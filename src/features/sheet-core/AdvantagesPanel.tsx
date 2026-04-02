import { useState } from 'react';
import { useCharStore } from '../../store/charStore';
import type { ICharacterAdvantage } from '../../entities/types';
import advantageDefsRaw from '../../data/advantages.json';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AdvantagesPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const advantageDefs = useLocalizedData(advantageDefsRaw as any) as typeof advantageDefsRaw;
  const advantages = useCharStore((s) => s.character.advantages);
  const [showAdd, setShowAdd] = useState(false);
  const [newAdvId, setNewAdvId] = useState('');

  function setAdvantages(next: ICharacterAdvantage[]) {
    useCharStore.setState((s) => ({
      character: { ...s.character, advantages: next },
      isDirty: true,
    }));
  }

  function addAdvantage() {
    if (!newAdvId) return;
    // If already exists and it's ranked, just bump rank
    const existing = advantages.findIndex((a) => a.advantageId === newAdvId);
    const def = advantageDefs.find((d) => d.id === newAdvId);
    if (!def) return;

    if (existing >= 0 && def.ranked) {
      const next = [...advantages];
      next[existing] = { ...next[existing], ranks: next[existing].ranks + 1 };
      setAdvantages(next);
    } else if (existing < 0) {
      setAdvantages([...advantages, { advantageId: newAdvId, ranks: 1 }]);
    }
    setNewAdvId('');
    setShowAdd(false);
  }

  function updateRanks(index: number, ranks: number) {
    const next = [...advantages];
    next[index] = { ...next[index], ranks: Math.max(1, ranks) };
    setAdvantages(next);
  }

  function removeAdvantage(index: number) {
    setAdvantages(advantages.filter((_, i) => i !== index));
  }

  const availableToAdd = advantageDefs.filter((def) => {
    if (def.ranked) return true;
    return !advantages.some((a) => a.advantageId === def.id);
  });

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
                <span className="adv-name">{def.name}</span>
              </Tooltip>
              {def.ranked && (
                <input
                  type="number" min={1}
                  className="adv-rank-input"
                  value={adv.ranks}
                  onChange={(e) => updateRanks(i, Number(e.target.value) || 1)}
                />
              )}
              <button className="adv-remove" onClick={() => removeAdvantage(i)} title={t('common.remove')}>
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {!showAdd ? (
        <button className="skill-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> {t('advantages.addAdvantage')}
        </button>
      ) : (
        <div className="skill-add-form">
          <select value={newAdvId} onChange={(e) => setNewAdvId(e.target.value)} className="skill-select">
            <option value="">{t('common.select')}</option>
            {availableToAdd.map((d) => (
              <option key={d.id} value={d.id}>{d.name}{d.ranked ? ` (${t('common.rank')})` : ''}</option>
            ))}
          </select>
          <button className="skill-confirm-btn" onClick={addAdvantage} disabled={!newAdvId}>
            {t('common.add')}
          </button>
          <button className="skill-cancel-btn" onClick={() => { setShowAdd(false); setNewAdvId(''); }}>
            {t('common.cancel')}
          </button>
        </div>
      )}

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
        .adv-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; opacity: 0; transition: opacity var(--t-fast), color var(--t-fast);
          display: flex; padding: 2px;
        }
        .adv-chip:hover .adv-remove { opacity: 1; }
        .adv-remove:hover { color: var(--c-error); }
      `}</style>
    </section>
  );
}
