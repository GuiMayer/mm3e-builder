import { useState, useMemo, useRef, useEffect } from 'react';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharacterActions } from '../../shared/hooks/useCharacterActions';
import type { AdvantageType, ICharacterAdvantage } from '../../entities/types';
import { ADVANTAGE_DEFS, SKILL_DEFS } from '../../entities/gameDataLoaders';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { Plus, Trash2, Search, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '../../shared/ui/NumberInput';
import { useAppDialog } from '../../shared/ui/appDialogContext';

const ADVANTAGE_TYPES: AdvantageType[] = ['combat', 'fortune', 'general', 'skill'];

export function AdvantagesPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const advantageDefs = useLocalizedData(ADVANTAGE_DEFS);
  const skillDefs = useLocalizedData(SKILL_DEFS);
  const { character } = useActiveCharacter();
  const { setAdvantages } = useCharacterActions();
  const advantages = character.advantages;
  const dialog = useAppDialog();

  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<AdvantageType>>(new Set());
  const [descTarget, setDescTarget] = useState<(typeof advantageDefs)[0] | null>(null);
  const [subtypeModal, setSubtypeModal] = useState<{ defId: string; existingInstances: ICharacterAdvantage[] } | null>(null);
  const [subtypeInput, setSubtypeInput] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const subtypeSelectRef = useRef<HTMLSelectElement>(null);
  const subtypeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSelector && searchRef.current) searchRef.current.focus();
  }, [showSelector]);

  useEffect(() => {
    if (subtypeModal) {
      // Focus on the appropriate input based on which one is visible
      if (subtypeSelectRef.current) {
        subtypeSelectRef.current.focus();
      } else if (subtypeInputRef.current) {
        subtypeInputRef.current.focus();
      }
    }
  }, [subtypeModal]);

  // Memoize available skills to avoid recalculating on every render
  const availableSkills = useMemo(() => {
    // 1. Get all character skills with full names
    const characterSkills = character.skills
      .map(s => {
        const def = skillDefs.find(d => d.id === s.skillId);
        if (!def) return null;
        
        // Skills with subtype: "Expertise: Magic"
        if (def.subtyped && s.subtype) {
          return { value: `${def.name}: ${s.subtype}`, label: `${def.name}: ${s.subtype}` };
        }
        
        // Normal skills: "Acrobatics"
        return { value: def.name, label: def.name };
      })
      .filter((skill): skill is { value: string; label: string } => skill !== null);
    
    // 2. Get skills that already have Skill Mastery
    const skillsWithMastery = new Set(
      advantages
        .filter(a => a.advantageId === 'skill_mastery' && a.subtype)
        .map(a => a.subtype!)
    );
    
    // 3. Filter and sort alphabetically
    return characterSkills
      .filter(skill => !skillsWithMastery.has(skill.value))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [character.skills, skillDefs, advantages]);

  function addAdvantage(defId: string, subtype?: string | null) {
    const def = advantageDefs.find((d) => d.id === defId);
    if (!def) return;

    // Multi-instance support: check if advantage allows multiple instances
    if (def.allowMultiple) {
      const existingInstances = advantages.filter((a) => a.advantageId === defId);
      
      // Hybrid mode: advantage can either stack ranks OR create new instances
      if (def.hybridMode && existingInstances.length > 0 && !subtype) {
        // Show modal to choose: increase existing or create new
        setSubtypeModal({ defId, existingInstances });
        return;
      }

      // If subtype is required but not provided, show modal
      if (def.subtypeRequired && !subtype) {
        setSubtypeModal({ defId, existingInstances });
        return;
      }

      // Check for duplicate (same advantageId + same subtype)
      const duplicate = existingInstances.find((a) => a.subtype === (subtype ?? null));
      if (duplicate && def.ranked) {
        // Increase rank of existing instance
        const index = advantages.indexOf(duplicate);
        const max = def.maxRank ?? Infinity;
        if (duplicate.ranks >= max) return;
        const next = [...advantages];
        next[index] = { ...next[index], ranks: next[index].ranks + 1 };
        setAdvantages(next);
      } else if (!duplicate) {
        // Create new instance with subtype
        setAdvantages([...advantages, { advantageId: defId, ranks: 1, subtype: subtype ?? null }]);
      }
    } else {
      // Simple ranked or non-ranked advantage (old behavior)
      const existing = advantages.findIndex((a) => a.advantageId === defId);

      if (existing >= 0 && def.ranked) {
        const max = def.maxRank ?? Infinity;
        if (advantages[existing].ranks >= max) return;
        const next = [...advantages];
        next[existing] = { ...next[existing], ranks: next[existing].ranks + 1 };
        setAdvantages(next);
      } else if (existing < 0) {
        setAdvantages([...advantages, { advantageId: defId, ranks: 1, subtype: null }]);
      }
    }
  }

  async function confirmSubtype() {
    if (!subtypeModal) return;
    const def = advantageDefs.find((d) => d.id === subtypeModal.defId);
    if (!def) return;

    // Validate required subtype
    if (def.subtypeRequired && !subtypeInput.trim()) {
      await dialog.alert({ title: 'Advantage', message: t('advantages.subtypeRequired') });
      return;
    }

    // Close modal and add advantage
    const subtype = subtypeInput.trim() || null;
    setSubtypeModal(null);
    setSubtypeInput('');
    addAdvantage(subtypeModal.defId, subtype);
  }

  function increaseExistingRank(advantageIndex: number) {
    if (!subtypeModal) return;
    const def = advantageDefs.find((d) => d.id === subtypeModal.defId);
    if (!def) return;

    const adv = advantages[advantageIndex];
    const max = def.maxRank ?? Infinity;
    if (adv.ranks >= max) return;

    const next = [...advantages];
    next[advantageIndex] = { ...next[advantageIndex], ranks: next[advantageIndex].ranks + 1 };
    setAdvantages(next);
    setSubtypeModal(null);
    setSubtypeInput('');
  }

  function updateRanks(index: number, ranks: number) {
    const next = [...advantages];
    const def = advantageDefs.find((d) => d.id === next[index].advantageId);
    const max = def?.maxRank ?? Infinity;
    next[index] = { ...next[index], ranks: Math.min(max, Math.max(1, ranks)) };
    setAdvantages(next);
  }

  function removeAdvantage(index: number) {
    setAdvantages(advantages.filter((_, i) => i !== index));
  }

  function toggleFilter(type: AdvantageType) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function getAdvStatus(defId: string) {
    const def = advantageDefs.find((d) => d.id === defId);
    if (!def) return 'available';

    const existingInstances = advantages.filter((a) => a.advantageId === defId);
    if (existingInstances.length === 0) return 'available';

    // Multi-instance advantages: always show as available if allowMultiple is true
    if (def.allowMultiple) return 'multiple-available';

    // Simple advantages
    const existing = existingInstances[0];
    if (!def.ranked) return 'added';
    if (def.maxRank && existing.ranks >= def.maxRank) return 'maxed';
    return 'ranked-available';
  }

  const filteredAdvantages = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return advantageDefs.filter((def) => {
      const matchesSearch = term === '' || def.name.toLowerCase().includes(term);
      const matchesCategory = activeFilters.size === 0 || activeFilters.has(def.advantageType);
      return matchesSearch && matchesCategory;
    });
  }, [advantageDefs, searchTerm, activeFilters]);

  const filterKey = (type: AdvantageType) =>
    t(`advantages.filter${type.charAt(0).toUpperCase() + type.slice(1)}`);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('advantages.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')}</span>
      </div>

      {advantages.length === 0 && (
        <p className="adv-empty">{t('advantages.noAdvantages')}</p>
      )}

      <div className="adv-grid">
        {advantages.map((adv, i) => {
          const def = advantageDefs.find((d) => d.id === adv.advantageId);
          if (!def) return null;
          return (
            <div key={`${adv.advantageId}-${i}`} className="adv-chip">
              <Tooltip content={def.description!}>
                <span className="adv-name">
                  {def.name}
                  {adv.subtype && <span className="adv-subtype"> ({adv.subtype})</span>}
                </span>
              </Tooltip>
              {def.ranked && (
                <>
                  <NumberInput
                    variant="small"
                    className="adv-rank-input"
                    value={adv.ranks}
                    onChange={(value) => updateRanks(i, value)}
                    min={1}
                    max={def.maxRank ?? undefined}
                  />
                  {def.maxRank && (
                    <span className="adv-rank-max">/ {def.maxRank}</span>
                  )}
                </>
              )}
              <button
                className="adv-info-btn"
                onClick={() => setDescTarget(def)}
                title={t('advantages.viewDescription')}
              >
                <Info size={12} />
              </button>
              <button className="adv-remove" onClick={() => removeAdvantage(i)} title={t('common.remove')}>
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {!showSelector ? (
        <Button variant="ghost" size="md" onClick={() => setShowSelector(true)}>
          <Plus size={16} /> {t('advantages.addAdvantage')}
        </Button>
      ) : (
        <div className="adv-selector">
          {/* Search */}
          <div className="adv-search">
            <Search size={14} className="adv-search-icon" />
            <input
              ref={searchRef}
              className="adv-search-input"
              type="text"
              placeholder={t('advantages.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="adv-filters">
            {ADVANTAGE_TYPES.map((type) => (
              <button
                key={type}
                className={`adv-filter-chip ${activeFilters.has(type) ? 'adv-filter-chip--active' : ''}`}
                onClick={() => toggleFilter(type)}
              >
                {filterKey(type)}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="adv-results">
            {filteredAdvantages.length === 0 && (
              <p className="adv-no-results">{t('advantages.noResults')}</p>
            )}
            {filteredAdvantages.map((def) => {
              const status = getAdvStatus(def.id);
              const isDisabled = status === 'maxed';
              return (
                <div
                  key={def.id}
                  className={`adv-result-item ${isDisabled ? 'adv-result-item--disabled' : ''}`}
                  onClick={() => { if (!isDisabled) addAdvantage(def.id); }}
                >
                  <span className="adv-result-name">{def.name}</span>
                  {def.ranked && <span className="adv-result-badge">{t('advantages.ranked')}</span>}
                  {def.allowMultiple && status === 'multiple-available' && (
                    <span className="adv-result-badge">{t('advantages.multipleAvailable')}</span>
                  )}
                  {(status === 'added' || status === 'maxed' || status === 'ranked-available' || status === 'multiple-available') && (
                    <span className="adv-result-check">✓</span>
                  )}
                  <button
                    className="adv-result-info"
                    onClick={(e) => { e.stopPropagation(); setDescTarget(def); }}
                    title={t('advantages.viewDescription')}
                  >
                    <Info size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="adv-selector-footer">
            <button
              className="sel-close-btn"
              onClick={() => { setShowSelector(false); setSearchTerm(''); setActiveFilters(new Set()); }}
            >
              <X size={14} /> {t('advantages.closeSelector')}
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
          <div className="adv-desc-meta">
            <span className={`adv-desc-badge adv-desc-badge--${descTarget.advantageType}`}>
              {filterKey(descTarget.advantageType)}
            </span>
            <span className="adv-desc-ranked">
              {descTarget.ranked
                ? `${t('advantages.ranked')}${descTarget.maxRank ? ` · Max ${descTarget.maxRank}` : ''}`
                : t('advantages.notRanked')
              }
            </span>
          </div>
          <p className="adv-desc-body">{descTarget.longDescription}</p>
        </Modal>
      )}

      {/* Subtype Modal */}
      {subtypeModal && (() => {
        const def = advantageDefs.find((d) => d.id === subtypeModal.defId);
        if (!def) return null;
        const isHybridWithExisting = def.hybridMode && subtypeModal.existingInstances.length > 0;
        return (
          <Modal
            isOpen={!!subtypeModal}
            onClose={() => { setSubtypeModal(null); setSubtypeInput(''); }}
            title={def.name}
            compact
          >
            <div className="subtype-modal-content">
              {isHybridWithExisting ? (
                <>
                  <p className="subtype-prompt">{t('advantages.hybridChoice')}</p>
                  <div className="subtype-hybrid-options">
                    <div className="subtype-existing-list">
                      <h4>{t('advantages.increaseExisting')}</h4>
                      {subtypeModal.existingInstances.map((adv, idx) => {
                        const actualIndex = advantages.indexOf(adv);
                        const max = def.maxRank ?? Infinity;
                        const isMaxed = adv.ranks >= max;
                        return (
                          <button
                            key={idx}
                            className={`subtype-existing-item ${isMaxed ? 'subtype-existing-item--disabled' : ''}`}
                            onClick={() => !isMaxed && increaseExistingRank(actualIndex)}
                            disabled={isMaxed}
                          >
                            <span>{def.name}{adv.subtype ? ` (${adv.subtype})` : ''}</span>
                            <span className="subtype-ranks">Rank {adv.ranks}{max < Infinity ? ` / ${max}` : ''}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="subtype-divider">{t('advantages.or')}</div>
                    <div className="subtype-new-section">
                      <h4>{t('advantages.createNew')}</h4>
                      <p className="subtype-prompt-text">{def.subtypePrompt || t('advantages.enterSubtype')}</p>
                      
                      {def.id === 'skill_mastery' && availableSkills.length === 0 && (
                        <p className="subtype-warning">
                          {character.skills.length === 0 
                            ? t('advantages.noSkillsInSheet')
                            : t('advantages.allSkillsHaveMastery')}
                        </p>
                      )}
                      
                      {def.id === 'skill_mastery' ? (
                        <select
                          ref={subtypeSelectRef}
                          className="subtype-dropdown"
                          value={subtypeInput}
                          onChange={(e) => setSubtypeInput(e.target.value)}
                          disabled={availableSkills.length === 0}
                        >
                          <option value="">
                            {availableSkills.length === 0 
                              ? t('advantages.noSkillsAvailable')
                              : t('advantages.selectSkill')}
                          </option>
                          {availableSkills.map((skill) => (
                            <option key={skill.value} value={skill.value}>
                              {skill.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          ref={subtypeInputRef}
                          type="text"
                          className="subtype-input"
                          value={subtypeInput}
                          onChange={(e) => setSubtypeInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && confirmSubtype()}
                          placeholder={t('advantages.subtypePlaceholder')}
                        />
                      )}
                      
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={confirmSubtype}
                        disabled={def.id === 'skill_mastery' && (!subtypeInput || availableSkills.length === 0)}
                      >
                        {t('advantages.confirm')}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="subtype-prompt">{def.subtypePrompt || t('advantages.enterSubtype')}</p>
                  
                  {def.id === 'skill_mastery' && availableSkills.length === 0 && (
                    <p className="subtype-warning">
                      {character.skills.length === 0 
                        ? t('advantages.noSkillsInSheet')
                        : t('advantages.allSkillsHaveMastery')}
                    </p>
                  )}
                  
                  {def.id === 'skill_mastery' ? (
                    <select
                      ref={subtypeSelectRef}
                      className="subtype-dropdown"
                      value={subtypeInput}
                      onChange={(e) => setSubtypeInput(e.target.value)}
                      disabled={availableSkills.length === 0}
                    >
                      <option value="">
                        {availableSkills.length === 0 
                          ? t('advantages.noSkillsAvailable')
                          : t('advantages.selectSkill')}
                      </option>
                      {availableSkills.map((skill) => (
                        <option key={skill.value} value={skill.value}>
                          {skill.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      ref={subtypeInputRef}
                      type="text"
                      className="subtype-input"
                      value={subtypeInput}
                      onChange={(e) => setSubtypeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmSubtype()}
                      placeholder={t('advantages.subtypePlaceholder')}
                    />
                  )}
                  
                  <div className="subtype-actions">
                    <Button variant="ghost" size="sm" onClick={() => { setSubtypeModal(null); setSubtypeInput(''); }}>
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={confirmSubtype}
                      disabled={def.id === 'skill_mastery' && (!subtypeInput || availableSkills.length === 0)}
                    >
                      {t('advantages.confirm')}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        );
      })()}

      <style>{`
        .adv-empty { color: var(--c-text-muted); font-size: 0.85rem; font-style: italic; }
        .adv-grid { display: flex; flex-wrap: wrap; gap: var(--s-sm); }
        .adv-chip {
          display: flex; align-items: center; gap: var(--s-xs);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-full); padding: var(--s-xs) var(--s-md);
          transition: border-color var(--t-fast);
        }
        .adv-chip:hover { border-color: var(--c-border-active); }
        .adv-name { font-size: 0.82rem; font-weight: 500; cursor: help; white-space: nowrap; }
        .adv-rank-input {
          width: 36px; text-align: center;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-primary);
          font-family: var(--f-body); font-size: 0.8rem; font-weight: 700;
          padding: 2px;
        }
        .adv-rank-input:focus { outline: none; border-color: var(--c-primary); }
        .adv-rank-max { font-size: 0.72rem; color: var(--c-text-muted); font-weight: 600; }
        .adv-info-btn {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; padding: 2px; opacity: 0;
          transition: opacity var(--t-fast), color var(--t-fast);
        }
        .adv-chip:hover .adv-info-btn { opacity: 1; }
        .adv-info-btn:hover { color: var(--c-primary); }
        .adv-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; opacity: 0; transition: opacity var(--t-fast), color var(--t-fast);
          display: flex; padding: 2px;
        }
        .adv-chip:hover .adv-remove { opacity: 1; }
        .adv-remove:hover { color: var(--c-error); }

        /* Selector */
        .adv-selector {
          margin-top: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-md); padding: var(--s-md);
          animation: fadeIn 0.2s ease;
        }
        .adv-search {
          display: flex; align-items: center; gap: var(--s-xs);
          padding-bottom: var(--s-sm); border-bottom: 1px solid var(--c-border);
        }
        .adv-search-icon { color: var(--c-text-muted); flex-shrink: 0; }
        .adv-search-input {
          flex: 1; background: transparent; border: none;
          color: var(--c-text); font-family: var(--f-body); font-size: 0.85rem;
        }
        .adv-search-input:focus { outline: none; }
        .adv-search-input::placeholder { color: var(--c-text-muted); }
        .adv-filters { display: flex; gap: var(--s-xs); padding: var(--s-sm) 0; flex-wrap: wrap; }
        .adv-filter-chip {
          padding: var(--s-xs) var(--s-sm); border-radius: var(--r-full);
          font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em;
          background: transparent; border: 1px solid var(--c-border);
          color: var(--c-text-secondary); cursor: pointer; transition: all var(--t-fast);
        }
        .adv-filter-chip:hover { border-color: var(--c-primary); color: var(--c-text); }
        .adv-filter-chip--active {
          background: var(--c-primary-muted);
          border-color: rgba(var(--c-primary-rgb), 0.5); color: var(--c-primary);
        }
        .adv-results {
          max-height: 220px; overflow-y: auto;
          display: flex; flex-direction: column; gap: 2px;
        }
        .adv-no-results { color: var(--c-text-muted); font-size: 0.82rem; font-style: italic; padding: var(--s-sm) 0; }
        .adv-result-item {
          display: flex; align-items: center; gap: var(--s-sm);
          padding: 6px var(--s-sm); border-radius: var(--r-sm);
          cursor: pointer; transition: all var(--t-fast); font-size: 0.84rem;
        }
        .adv-result-item:hover { background: var(--c-primary-muted); }
        .adv-result-item--disabled { opacity: 0.4; cursor: not-allowed; }
        .adv-result-item--disabled:hover { background: transparent; }
        .adv-result-name { font-weight: 500; flex: 1; }
        .adv-result-badge { font-size: 0.68rem; color: var(--c-text-muted); font-style: italic; }
        .adv-result-check { color: var(--c-success); font-size: 0.75rem; }
        .adv-result-info {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; padding: 2px; border-radius: var(--r-sm);
          transition: all var(--t-fast); flex-shrink: 0;
        }
        .adv-result-info:hover { color: var(--c-primary); background: var(--c-primary-muted); }
        .adv-selector-footer {
          display: flex; justify-content: flex-end;
          padding-top: var(--s-sm); border-top: 1px solid var(--c-border); margin-top: var(--s-sm);
        }
        .sel-close-btn {
          display: flex; align-items: center; gap: 4px;
          padding: var(--s-xs) var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary);
          font-family: var(--f-body); font-size: 0.8rem; cursor: pointer;
          transition: all var(--t-fast);
        }
        .sel-close-btn:hover { border-color: var(--c-error); color: var(--c-error); }

        /* Description Modal content */
        .adv-desc-meta { display: flex; gap: var(--s-sm); flex-wrap: wrap; margin-bottom: var(--s-md); }
        .adv-desc-badge {
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
          padding: 3px 10px; border-radius: var(--r-full);
        }
        .adv-desc-badge--combat  { background: rgba(248,113,113,0.15); color: #f87171; }
        .adv-desc-badge--fortune { background: rgba(251,191,36,0.15);  color: #fbbf24; }
        .adv-desc-badge--general { background: rgba(96,165,250,0.15);  color: #60a5fa; }
        .adv-desc-badge--skill   { background: rgba(74,222,128,0.15);  color: #4ade80; }
        .adv-desc-ranked {
          font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: var(--r-full);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border); color: var(--c-text-secondary);
        }
        .adv-desc-body { font-size: 0.92rem; line-height: 1.7; color: var(--c-text); margin: 0; }

        /* Subtype display in chip */
        .adv-subtype { font-size: 0.72rem; color: var(--c-text-muted); font-weight: 400; font-style: italic; }

        /* Subtype Modal */
        .subtype-modal-content { display: flex; flex-direction: column; gap: var(--s-md); }
        .subtype-prompt { font-size: 0.9rem; color: var(--c-text-secondary); margin: 0; }
        .subtype-prompt-text { font-size: 0.85rem; color: var(--c-text-secondary); margin: var(--s-xs) 0; }
        .subtype-input-container { position: relative; }
        .subtype-input {
          width: 100%; padding: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-body); font-size: 0.9rem;
        }
        .subtype-input:focus { outline: none; border-color: var(--c-primary); }
        .subtype-dropdown {
          width: 100%; padding: var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-body); font-size: 0.9rem;
          cursor: pointer;
        }
        .subtype-dropdown:focus { outline: none; border-color: var(--c-primary); }
        .subtype-dropdown:disabled {
          opacity: 0.5; cursor: not-allowed;
          background: var(--c-surface);
        }
        .subtype-warning {
          font-size: 0.85rem; color: var(--c-warning);
          background: rgba(251, 191, 36, 0.1);
          padding: var(--s-sm); border-radius: var(--r-sm);
          margin: var(--s-sm) 0;
        }
        .subtype-autocomplete {
          position: absolute; top: 100%; left: 0; right: 0; z-index: 1000;
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); margin-top: 4px; max-height: 200px; overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .subtype-autocomplete-portal {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); margin-top: 4px; max-height: 200px; overflow-y: auto;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .subtype-autocomplete-item {
          width: 100%; padding: var(--s-sm); text-align: left;
          background: transparent; border: none; color: var(--c-text);
          font-family: var(--f-body); font-size: 0.85rem; cursor: pointer;
          transition: background var(--t-fast);
        }
        .subtype-autocomplete-item:hover { background: var(--c-primary-muted); }
        .subtype-actions {
          display: flex; gap: var(--s-sm); justify-content: flex-end; margin-top: var(--s-sm);
        }

        /* Hybrid mode layout */
        .subtype-hybrid-options {
          display: flex; flex-direction: column; gap: var(--s-md);
        }
        .subtype-existing-list h4, .subtype-new-section h4 {
          font-size: 0.85rem; font-weight: 600; margin: 0 0 var(--s-xs) 0;
          color: var(--c-text);
        }
        .subtype-existing-item {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          padding: var(--s-sm); background: var(--c-surface-elevated);
          border: 1px solid var(--c-border); border-radius: var(--r-sm);
          font-family: var(--f-body); font-size: 0.85rem; cursor: pointer;
          transition: all var(--t-fast); margin-bottom: var(--s-xs);
        }
        .subtype-existing-item:hover:not(.subtype-existing-item--disabled) {
          border-color: var(--c-primary); background: var(--c-primary-muted);
        }
        .subtype-existing-item--disabled {
          opacity: 0.5; cursor: not-allowed;
        }
        .subtype-ranks { font-size: 0.75rem; color: var(--c-text-muted); font-weight: 600; }
        .subtype-divider {
          text-align: center; font-size: 0.8rem; font-weight: 600;
          color: var(--c-text-muted); text-transform: uppercase; letter-spacing: 0.05em;
        }
        .subtype-new-section { display: flex; flex-direction: column; gap: var(--s-sm); }

        /* Mobile responsive adjustments for NumberInput */
        @media (max-width: 768px) {
          .adv-rank-input {
            width: 44px;
          }
        }
      `}</style>
    </section>
  );
}
