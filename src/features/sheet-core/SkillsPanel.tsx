import { useState, useMemo, useRef, useEffect } from 'react';
import { useCharStore } from '../../store/charStore';
import type { ICharacterSkill, AbilityKey, ISkillDef } from '../../entities/types';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { Modal } from '../../shared/ui/Modal';
import { Plus, Trash2, Search, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Colour palette for ability badges (list + modal)
const ABILITY_COLORS: Record<AbilityKey, { bg: string; color: string; border: string }> = {
  agl: { bg: 'rgba(34,211,238,0.12)',  color: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
  str: { bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.3)' },
  fgt: { bg: 'rgba(251,146,60,0.12)',  color: '#fb923c', border: 'rgba(251,146,60,0.3)' },
  dex: { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  pre: { bg: 'rgba(244,114,182,0.12)', color: '#f472b6', border: 'rgba(244,114,182,0.3)' },
  int: { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  awe: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  sta: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
};

export function SkillsPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const skillDefs = useLocalizedData(SKILL_DEFS);
  const skills = useCharStore((s) => s.character.skills);
  const setSkills = useCharStore((s) => s.setSkills);
  const abilities = useCharStore((s) => s.character.abilities);

  const [showSelector, setShowSelector]     = useState(false);
  const [searchTerm, setSearchTerm]         = useState('');
  const [pendingSubtype, setPendingSubtype] = useState<string | null>(null);
  const [subtypeValue, setSubtypeValue]     = useState('');
  const [descTarget, setDescTarget]         = useState<ISkillDef | null>(null);
  const [allUsagesOpen, setAllUsagesOpen]   = useState(false);

  const searchRef   = useRef<HTMLInputElement>(null);
  const subtypeRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { if (showSelector) searchRef.current?.focus(); }, [showSelector]);
  useEffect(() => { if (pendingSubtype) subtypeRef.current?.focus(); }, [pendingSubtype]);



  function addSkillDirect(skillId: string, subtype: string | null) {
    const entry: ICharacterSkill = { skillId, ranks: 1, subtype };
    setSkills([...skills, entry]);
  }

  function updateRanks(index: number, ranks: number) {
    const next = [...skills];
    next[index] = { ...next[index], ranks: Math.max(0, ranks) };
    setSkills(next);
  }

  function updateOtherBonus(index: number, val: number) {
    const next = [...skills];
    next[index] = { ...next[index], otherBonus: val === 0 ? undefined : val };
    setSkills(next);
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  function handleSelectSkill(def: ISkillDef) {
    if (def.subtyped) {
      setPendingSubtype(prev => prev === def.id ? null : def.id);
      setSubtypeValue('');
    } else {
      addSkillDirect(def.id, null);
    }
  }

  function confirmSubtype() {
    if (!pendingSubtype || !subtypeValue.trim()) return;
    addSkillDirect(pendingSubtype, subtypeValue.trim());
    setPendingSubtype(null);
    setSubtypeValue('');
  }

  function closeSelector() {
    setShowSelector(false);
    setSearchTerm('');
    setPendingSubtype(null);
    setSubtypeValue('');
  }

  // Non-subtyped: hide once added; subtyped: always show
  const availableToAdd = skillDefs.filter(def =>
    def.subtyped || !skills.some(s => s.skillId === def.id)
  );

  const filteredSkills = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return availableToAdd.filter(def =>
      term === '' || def.name.toLowerCase().includes(term)
    );
  }, [availableToAdd, searchTerm]);

  const totalRanks = skills.reduce((sum, s) => sum + s.ranks, 0);

  function getSubtypeCount(defId: string) {
    return skills.filter(s => s.skillId === defId).length;
  }

  function abilityBadgeStyle(ability: string) {
    const c = ABILITY_COLORS[ability as AbilityKey];
    if (!c) return {};
    return { background: c.bg, color: c.color, border: `1px solid ${c.border}` };
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('skills.title')}</h2>
        <span className="panel-cost">
          {cost} {t('common.pp')}{' '}
          <span className="skill-ranks-counter">
            ({totalRanks} {totalRanks === 1 ? t('common.rank') : t('common.ranks')})
          </span>
        </span>
      </div>

      {skills.length === 0 && (
        <p className="skill-empty">{t('skills.noSkills')}</p>
      )}

      {/* Existing skill rows — name click opens modal */}
      <div className="skills-list">
        {skills.map((skill, i) => {
          const def = skillDefs.find((d) => d.id === skill.skillId);
          if (!def) return null;
          const abilityVal = abilities[def.baseAbility as AbilityKey] || 0;
          const total = abilityVal + skill.ranks;
          const displayName = def.subtyped && skill.subtype
            ? `${def.name}: ${skill.subtype}`
            : def.name;

          return (
            <div key={`${skill.skillId}-${skill.subtype}-${i}`} className="skill-row">
              <button
                className="skill-name skill-name--clickable"
                onClick={() => { setDescTarget(def); setAllUsagesOpen(false); }}
                title={t('skills.viewDescription')}
              >
                {displayName}
              </button>
              <span className="skill-base" style={abilityBadgeStyle(def.baseAbility)}>
                {t(`abilities.${def.baseAbility}`).toUpperCase()} {abilityVal}
              </span>
              <span className="skill-plus">+</span>
              <input
                type="number"
                min={0}
                className="skill-input"
                value={skill.ranks}
                onChange={(e) => updateRanks(i, Number(e.target.value) || 0)}
              />
              {/* Other bonus — optional situational modifier (F-11) */}
              <span className="skill-other-label">±</span>
              <input
                type="number"
                className="skill-input skill-input--other"
                value={skill.otherBonus ?? 0}
                title={t('skills.otherBonus')}
                onChange={(e) => updateOtherBonus(i, Number(e.target.value) || 0)}
              />
              <span className="skill-total">= {total + (skill.otherBonus ?? 0)}</span>
              <button className="skill-remove" onClick={() => removeSkill(i)} title={t('common.remove')}>
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Selector */}
      {!showSelector ? (
        <button className="skill-add-btn" onClick={() => setShowSelector(true)}>
          <Plus size={16} /> {t('skills.addSkill')}
        </button>
      ) : (
        <div className="sk-selector">
          {/* Search */}
          <div className="sk-search">
            <Search size={14} className="sk-search-icon" />
            <input
              ref={searchRef}
              className="sk-search-input"
              type="text"
              placeholder={t('skills.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="sk-results">
            {filteredSkills.length === 0 && (
              <p className="sk-no-results">{t('skills.noResults')}</p>
            )}
            {filteredSkills.map((def) => {
              const isNonSubtypedAdded = !def.subtyped && skills.some(s => s.skillId === def.id);
              const subtypeCount = getSubtypeCount(def.id);
              const isPending = pendingSubtype === def.id;

              return (
                <div
                  key={def.id}
                  className={`sk-result-item ${isNonSubtypedAdded ? 'sk-result-item--disabled' : ''} ${isPending ? 'sk-result-item--pending' : ''}`}
                >
                  <span
                    className="sk-result-name"
                    onClick={() => { if (!isNonSubtypedAdded) handleSelectSkill(def); }}
                  >
                    {def.name}
                  </span>

                  {def.subtyped && subtypeCount > 0 && (
                    <span className="sk-result-subcount">+{subtypeCount}</span>
                  )}

                  <span className="sk-result-ability" style={abilityBadgeStyle(def.baseAbility)}>
                    {t(`abilities.${def.baseAbility}`).toUpperCase()}
                  </span>

                  <button
                    className="adv-result-info"
                    onClick={(e) => { e.stopPropagation(); setDescTarget(def); setAllUsagesOpen(false); }}
                    title={t('skills.viewDescription')}
                  >
                    <Info size={14} />
                  </button>

                  {/* In-place subtype form (Melhoria 2) */}
                  {isPending && (
                    <div className="sk-subtype-inline">
                      <input
                        ref={subtypeRef}
                        className="sk-subtype-input-inline"
                        placeholder={t('skills.subtypePlaceholder')}
                        value={subtypeValue}
                        onChange={(e) => setSubtypeValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmSubtype();
                          if (e.key === 'Escape') setPendingSubtype(null);
                        }}
                      />
                      <button
                        className="sk-subtype-confirm"
                        onClick={confirmSubtype}
                        disabled={!subtypeValue.trim()}
                      >
                        {t('skills.addSubtype')}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="adv-selector-footer">
            <button className="sk-sel-close-btn" onClick={closeSelector}>
              <X size={14} /> {t('skills.closeSelector')}
            </button>
          </div>
        </div>
      )}

      {/* Description Modal */}
      {descTarget && (
        <Modal
          isOpen={!!descTarget}
          onClose={() => setDescTarget(null)}
          title={descTarget.name}
          compact
        >
          {/* Metadata badges */}
          <div className="sk-desc-meta">
            <span
              className="sk-desc-badge"
              style={abilityBadgeStyle(descTarget.baseAbility)}
            >
              {t(`abilities.${descTarget.baseAbility}`).toUpperCase()}
            </span>
            {descTarget.trainedOnly && (
              <span className="sk-desc-badge sk-desc-badge--trained">
                {t('skills.trainedOnly')}
              </span>
            )}
            {descTarget.interaction && (
              <span className="sk-desc-badge sk-desc-badge--interaction">
                {t('skills.interaction')}
              </span>
            )}
            {descTarget.manipulation && (
              <span className="sk-desc-badge sk-desc-badge--manipulation">
                {t('skills.manipulation')}
              </span>
            )}
            {descTarget.requiresTools && (
              <span className="sk-desc-badge sk-desc-badge--tools">
                {t('skills.requiresTools')}
              </span>
            )}
          </div>

          {/* Opening description */}
          <p className="sk-desc-body">{descTarget.longDescription}</p>

          {/* Collapsible usages (Melhoria 4) */}
          {descTarget.usages.length > 0 && (
            <>
              <div className="sk-desc-usages-header">
                <span className="sk-desc-usages-label">
                  {t('skills.usages')} ({descTarget.usages.length})
                </span>
                <button
                  className="sk-desc-expand-btn"
                  onClick={() => setAllUsagesOpen(v => !v)}
                >
                  {allUsagesOpen
                    ? `▼ ${t('skills.collapseAll')}`
                    : `▶ ${t('skills.expandAll')}`}
                </button>
              </div>
              <div className="sk-desc-usages">
                {descTarget.usages.map((usage, i) => (
                  <details key={i} open={allUsagesOpen}>
                    <summary className="sk-desc-usage-title">{usage.title}</summary>
                    <p className="sk-desc-usage-body">{usage.description}</p>
                  </details>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}

      <style>{`
        /* ── Existing row styles (updated) ── */
        .skill-ranks-counter { font-size: 0.75rem; color: var(--c-text-muted); font-weight: 400; }
        .skill-empty { color: var(--c-text-muted); font-size: 0.85rem; font-style: italic; }
        .skills-list { display: flex; flex-direction: column; gap: var(--s-xs); }
        .skill-row {
          display: flex; align-items: center; gap: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-xs) var(--s-md);
          transition: border-color var(--t-fast);
        }
        .skill-row:hover { border-color: var(--c-border-active); }

        /* Melhoria 3: name is a clickable button */
        .skill-name--clickable {
          background: transparent; border: none; color: var(--c-text);
          font-weight: 500; font-size: 0.85rem; min-width: 180px;
          cursor: pointer; text-align: left; padding: 0; font-family: var(--f-body);
          text-decoration-line: underline;
          text-decoration-style: dotted;
          text-decoration-color: transparent;
          transition: text-decoration-color var(--t-fast), color var(--t-fast);
        }
        .skill-name--clickable:hover {
          color: var(--c-primary);
          text-decoration-color: var(--c-primary);
        }

        .skill-base {
          font-size: 0.7rem; font-weight: 700; min-width: 60px;
          padding: 2px 7px; border-radius: var(--r-full);
        }
        .skill-plus { color: var(--c-text-muted); font-size: 0.85rem; }
        .skill-input {
          width: 50px; text-align: center;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-body); font-size: 0.9rem; padding: var(--s-xs);
        }
        .skill-input:focus { outline: none; border-color: var(--c-primary); }
        .skill-input--other {
          width: 42px; background: transparent;
          border-color: transparent; color: var(--c-text-muted);
          font-size: 0.82rem;
        }
        .skill-input--other:focus { border-color: var(--c-border); background: var(--c-bg); color: var(--c-text); }
        .skill-other-label { color: var(--c-text-muted); font-size: 0.8rem; opacity: 0.5; }
        .skill-total { font-weight: 700; font-size: 0.9rem; color: var(--c-primary); min-width: 35px; text-align: right; }
        .skill-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; opacity: 0; transition: opacity var(--t-fast), color var(--t-fast);
          padding: var(--s-xs); border-radius: var(--r-sm); display: flex;
        }
        .skill-row:hover .skill-remove { opacity: 1; }
        .skill-remove:hover { color: var(--c-error); }

        .skill-add-btn {
          display: flex; align-items: center; gap: var(--s-xs);
          margin-top: var(--s-sm); padding: var(--s-sm) var(--s-md);
          background: transparent; border: 1px dashed var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary);
          font-family: var(--f-body); font-size: 0.82rem; cursor: pointer;
          transition: all var(--t-fast); width: 100%; justify-content: center;
        }
        .skill-add-btn:hover { border-color: var(--c-primary); color: var(--c-primary); background: var(--c-primary-muted); }
        .sk-sel-close-btn {
          display: flex; align-items: center; gap: 4px;
          padding: var(--s-xs) var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary);
          font-family: var(--f-body); font-size: 0.8rem; cursor: pointer;
          transition: all var(--t-fast);
        }
        .sk-sel-close-btn:hover { border-color: var(--c-error); color: var(--c-error); }

        /* ── Selector ── */
        .sk-selector {
          margin-top: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
          animation: fadeIn 0.2s ease;
        }
        .sk-search {
          display: flex; align-items: center; gap: var(--s-xs);
          padding-bottom: var(--s-sm); border-bottom: 1px solid var(--c-border);
        }
        .sk-search-icon { color: var(--c-text-muted); flex-shrink: 0; }
        .sk-search-input {
          flex: 1; background: transparent; border: none;
          color: var(--c-text); font-family: var(--f-body); font-size: 0.85rem;
        }
        .sk-search-input:focus { outline: none; }
        .sk-search-input::placeholder { color: var(--c-text-muted); }

        .sk-results {
          max-height: 260px; overflow-y: auto;
          display: flex; flex-direction: column; gap: 2px;
          padding-top: var(--s-xs);
        }
        .sk-no-results { color: var(--c-text-muted); font-size: 0.82rem; font-style: italic; padding: var(--s-sm) 0; }

        .sk-result-item {
          display: flex; align-items: center; gap: var(--s-sm);
          padding: 6px var(--s-sm); border-radius: var(--r-sm);
          transition: all var(--t-fast); font-size: 0.84rem;
          flex-wrap: wrap;
        }
        .sk-result-item:hover { background: var(--c-primary-muted); }
        .sk-result-item--disabled { opacity: 0.4; }
        .sk-result-item--disabled:hover { background: transparent; }
        .sk-result-item--pending { background: var(--c-primary-muted); border-radius: var(--r-sm); }

        .sk-result-name {
          font-weight: 500; flex: 1; cursor: pointer;
          min-width: 120px;
        }
        .sk-result-item--disabled .sk-result-name { cursor: not-allowed; }

        /* Melhoria 1: coloured ability badge */
        .sk-result-ability {
          font-size: 0.68rem; font-weight: 700;
          padding: 1px 7px; border-radius: var(--r-full); flex-shrink: 0;
        }

        /* Melhoria 5: dynamic subtype count badge */
        .sk-result-subcount {
          font-size: 0.65rem; font-weight: 700;
          background: rgba(74,222,128,0.15); color: #4ade80;
          border: 1px solid rgba(74,222,128,0.3);
          padding: 1px 6px; border-radius: var(--r-full); flex-shrink: 0;
        }

        /* Melhoria 2: in-place subtype form */
        .sk-subtype-inline {
          width: 100%; display: flex; gap: var(--s-sm); align-items: center;
          padding: var(--s-xs) 0 var(--s-xs) 0;
          animation: fadeIn 0.15s ease;
        }
        .sk-subtype-input-inline {
          flex: 1; background: var(--c-bg); border: 1px solid var(--c-primary);
          border-radius: var(--r-sm); padding: var(--s-xs) var(--s-sm);
          color: var(--c-text); font-size: 0.82rem; font-family: var(--f-body);
        }
        .sk-subtype-input-inline:focus { outline: none; }
        .sk-subtype-confirm {
          padding: var(--s-xs) var(--s-sm); background: var(--c-primary);
          color: var(--c-text-inverse); border: none; border-radius: var(--r-sm);
          cursor: pointer; font-size: 0.78rem; font-family: var(--f-body);
          white-space: nowrap;
        }
        .sk-subtype-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Modal: metadata badges ── */
        .sk-desc-meta { display: flex; gap: var(--s-xs); flex-wrap: wrap; margin-bottom: var(--s-md); }
        .sk-desc-badge {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 2px 9px; border-radius: var(--r-full);
        }
        .sk-desc-badge--trained     { background: rgba(251,191,36,0.15);  color: #fbbf24; }
        .sk-desc-badge--interaction { background: rgba(74,222,128,0.15);  color: #4ade80; }
        .sk-desc-badge--manipulation{ background: rgba(167,139,250,0.15); color: #a78bfa; }
        .sk-desc-badge--tools       { background: rgba(248,113,113,0.15); color: #f87171; }

        .sk-desc-body { font-size: 0.92rem; line-height: 1.7; color: var(--c-text); margin: 0 0 var(--s-md); }

        /* Melhoria 4: expand/collapse header */
        .sk-desc-usages-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: var(--s-xs);
        }
        .sk-desc-usages-label { font-size: 0.78rem; font-weight: 600; color: var(--c-text-secondary); }
        .sk-desc-expand-btn {
          background: transparent; border: none; font-size: 0.72rem;
          color: var(--c-primary); cursor: pointer; padding: 2px 6px;
          border-radius: var(--r-sm); font-family: var(--f-body);
          transition: background var(--t-fast);
        }
        .sk-desc-expand-btn:hover { background: var(--c-primary-muted); }

        .sk-desc-usages { display: flex; flex-direction: column; gap: 2px; }
        .sk-desc-usages details {
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); overflow: hidden;
        }
        .sk-desc-usage-title {
          font-size: 0.8rem; font-weight: 600; color: var(--c-text-secondary);
          cursor: pointer; padding: var(--s-xs) var(--s-sm); list-style: none;
          display: flex; align-items: center; gap: 6px;
          transition: background var(--t-fast);
        }
        .sk-desc-usage-title:hover { background: var(--c-surface-elevated); }
        .sk-desc-usage-title::marker,
        .sk-desc-usage-title::-webkit-details-marker { display: none; }
        .sk-desc-usage-title::before {
          content: '▶'; font-size: 0.55rem; color: var(--c-primary);
          transition: transform 0.15s; flex-shrink: 0;
        }
        details[open] .sk-desc-usage-title::before { transform: rotate(90deg); }
        .sk-desc-usage-body {
          font-size: 0.84rem; line-height: 1.65; color: var(--c-text);
          padding: var(--s-xs) var(--s-md) var(--s-sm);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
