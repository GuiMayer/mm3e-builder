import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import type { ICharacterSkill, AbilityKey } from '../../entities/types';
import skillDefsRaw from '../../data/skills.json';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SkillsPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const skillDefs = useLocalizedData(skillDefsRaw as any) as typeof skillDefsRaw;
  const skills = useCharStore((s) => s.character.skills);
  const abilities = useCharStore((s) => s.character.abilities);
  const [showAdd, setShowAdd] = useState(false);
  const [newSkillId, setNewSkillId] = useState('');
  const [newSubtype, setNewSubtype] = useState('');

  function setSkills(newSkills: ICharacterSkill[]) {
    useCharStore.setState((s) => ({
      character: { ...s.character, skills: newSkills },
      isDirty: true,
    }));
  }

  function addSkill() {
    if (!newSkillId) return;
    const def = skillDefs.find((s) => s.id === newSkillId);
    if (!def) return;

    const entry: ICharacterSkill = {
      skillId: newSkillId,
      ranks: 1,
      subtype: def.subtyped ? (newSubtype || 'Geral') : null,
    };
    setSkills([...skills, entry]);
    setNewSkillId('');
    setNewSubtype('');
    setShowAdd(false);
  }

  function updateRanks(index: number, ranks: number) {
    const next = [...skills];
    next[index] = { ...next[index], ranks: Math.max(0, ranks) };
    setSkills(next);
  }

  function removeSkill(index: number) {
    setSkills(skills.filter((_, i) => i !== index));
  }

  const totalRanks = skills.reduce((sum, s) => sum + s.ranks, 0);

  // Available skills to add (non-subtyped only show once if not already added)
  const availableToAdd = skillDefs.filter((def) => {
    if (def.subtyped) return true; // can add multiple subtypes
    return !skills.some((s) => s.skillId === def.id);
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{t('skills.title')}</h2>
        <span className="panel-cost">{cost} {t('common.pp')} <span className="skill-ranks-counter">({totalRanks} {totalRanks === 1 ? t('common.rank') : t('common.ranks')})</span></span>
      </div>

      {skills.length === 0 && (
        <p className="skill-empty">{t('skills.noSkills')}</p>
      )}

      <div className="skills-list">
        {skills.map((skill, i) => {
          const def = skillDefs.find((d) => d.id === skill.skillId);
          if (!def) return null;
          const abilityVal = abilities[def.baseAbility as AbilityKey] || 0;
          const total = abilityVal + skill.ranks;
          const displayName = def.subtyped ? `${def.name}: ${skill.subtype}` : def.name;

          return (
            <div key={`${skill.skillId}-${skill.subtype}-${i}`} className="skill-row">
              <Tooltip content={`Base: ${def.baseAbility.toUpperCase()} (${abilityVal}) + ${t('common.ranks').replace(/^./, (c)=>c.toUpperCase())}`}>
                <span className="skill-name">{displayName}</span>
              </Tooltip>
              <span className="skill-base">{def.baseAbility.toUpperCase()} {abilityVal}</span>
              <span className="skill-plus">+</span>
              <input
                type="number"
                min={0}
                className="skill-input"
                value={skill.ranks}
                onChange={(e) => updateRanks(i, Number(e.target.value) || 0)}
              />
              <span className="skill-total">= {total}</span>
              <button className="skill-remove" onClick={() => removeSkill(i)} title={t('common.remove')}>
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Skill */}
      {!showAdd ? (
        <button className="skill-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> {t('skills.addSkill')}
        </button>
      ) : (
        <div className="skill-add-form">
          <select value={newSkillId} onChange={(e) => setNewSkillId(e.target.value)} className="skill-select">
            <option value="">{t('common.select')}</option>
            {availableToAdd.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {newSkillId && skillDefs.find((d) => d.id === newSkillId)?.subtyped && (
            <input
              className="skill-subtype-input"
              value={newSubtype}
              onChange={(e) => setNewSubtype(e.target.value)}
              placeholder={t('skills.subtypePlaceholder')}
            />
          )}
          <button className="skill-confirm-btn" onClick={addSkill} disabled={!newSkillId}>
            {t('common.add')}
          </button>
          <button className="skill-cancel-btn" onClick={() => { setShowAdd(false); setNewSkillId(''); }}>
            {t('common.cancel')}
          </button>
        </div>
      )}

      <style>{`
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
        .skill-name { font-weight: 500; font-size: 0.85rem; min-width: 180px; cursor: help; }
        .skill-base { font-size: 0.78rem; color: var(--c-text-secondary); min-width: 60px; }
        .skill-plus { color: var(--c-text-muted); font-size: 0.85rem; }
        .skill-input {
          width: 50px; text-align: center;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-family: var(--f-body); font-size: 0.9rem; padding: var(--s-xs);
        }
        .skill-input:focus { outline: none; border-color: var(--c-primary); }
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
          transition: all var(--t-fast); width: 100%;
          justify-content: center;
        }
        .skill-add-btn:hover { border-color: var(--c-primary); color: var(--c-primary); background: var(--c-primary-muted); }

        .skill-add-form {
          display: flex; gap: var(--s-sm); align-items: center;
          margin-top: var(--s-sm); flex-wrap: wrap;
        }
        .skill-select, .skill-subtype-input {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
          color: var(--c-text); font-family: var(--f-body); font-size: 0.85rem;
        }
        .skill-select { min-width: 180px; }
        .skill-subtype-input { min-width: 140px; }
        .skill-select:focus, .skill-subtype-input:focus { outline: none; border-color: var(--c-primary); }
        .skill-confirm-btn, .skill-cancel-btn {
          padding: var(--s-xs) var(--s-md); border-radius: var(--r-sm);
          font-family: var(--f-body); font-size: 0.82rem; cursor: pointer;
          border: 1px solid var(--c-border);
        }
        .skill-confirm-btn { background: var(--c-primary); color: var(--c-text-inverse); border-color: var(--c-primary); }
        .skill-confirm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .skill-cancel-btn { background: transparent; color: var(--c-text-secondary); }
      `}</style>
    </section>
  );
}
