import { useState, useMemo, useRef, useEffect } from 'react';
import { useCharStore } from '../../store/charStore';
import type { ICharacterAdvantage, AdvantageType, IAdvantageDef } from '../../entities/types';
import advantageDefsRaw from '../../data/advantages.json';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { Tooltip } from '../../shared/ui/Tooltip';
import { Modal } from '../../shared/ui/Modal';
import { Plus, Trash2, Search, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ADVANTAGE_TYPES: AdvantageType[] = ['combat', 'fortune', 'general', 'skill'];

export function AdvantagesPanel({ cost }: { cost: number }) {
  const { t } = useTranslation();
  const advantageDefs = useLocalizedData(advantageDefsRaw as any) as IAdvantageDef[];
  const advantages = useCharStore((s) => s.character.advantages);

  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<AdvantageType>>(new Set());
  const [descTarget, setDescTarget] = useState<(typeof advantageDefs)[0] | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSelector && searchRef.current) searchRef.current.focus();
  }, [showSelector]);

  function setAdvantages(next: ICharacterAdvantage[]) {
    useCharStore.setState((s) => ({
      character: { ...s.character, advantages: next },
      isDirty: true,
    }));
  }

  function addAdvantage(defId: string) {
    const existing = advantages.findIndex((a) => a.advantageId === defId);
    const def = advantageDefs.find((d) => d.id === defId);
    if (!def) return;

    if (existing >= 0 && def.ranked) {
      const max = def.maxRank ?? Infinity;
      if (advantages[existing].ranks >= max) return;
      const next = [...advantages];
      next[existing] = { ...next[existing], ranks: next[existing].ranks + 1 };
      setAdvantages(next);
    } else if (existing < 0) {
      setAdvantages([...advantages, { advantageId: defId, ranks: 1 }]);
    }
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
    const existing = advantages.find((a) => a.advantageId === defId);
    if (!def || !existing) return 'available';
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
                <span className="adv-name">{def.name}</span>
              </Tooltip>
              {def.ranked && (
                <>
                  <input
                    type="number" min={1} max={def.maxRank ?? undefined}
                    className="adv-rank-input"
                    value={adv.ranks}
                    onChange={(e) => updateRanks(i, Number(e.target.value) || 1)}
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
        <button className="skill-add-btn" onClick={() => setShowSelector(true)}>
          <Plus size={16} /> {t('advantages.addAdvantage')}
        </button>
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
              const isDisabled = status === 'added' || status === 'maxed';
              return (
                <div
                  key={def.id}
                  className={`adv-result-item ${isDisabled ? 'adv-result-item--disabled' : ''}`}
                  onClick={() => { if (!isDisabled) addAdvantage(def.id); }}
                >
                  <span className="adv-result-name">{def.name}</span>
                  {def.ranked && <span className="adv-result-badge">{t('advantages.ranked')}</span>}
                  {(status === 'added' || status === 'maxed' || status === 'ranked-available') && (
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
              className="skill-cancel-btn"
              onClick={() => { setShowSelector(false); setSearchTerm(''); setActiveFilters(new Set()); }}
            >
              {t('advantages.closeSelector')}
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
      `}</style>
    </section>
  );
}
