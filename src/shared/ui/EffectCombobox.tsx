import { Info } from 'lucide-react';
import type { IPowerEffect } from '../../entities/types';

export interface EffectComboboxProps {
  value: string;
  onChange: (id: string) => void;
  effects: IPowerEffect[];
  allEffects: IPowerEffect[];
  filter: string;
  onFilterChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  effectTypes: string[];
  t: (key: string) => string;
  onInfo: (e: IPowerEffect) => void;
}

export function EffectCombobox({
  value,
  onChange,
  effects,
  allEffects,
  filter,
  onFilterChange,
  typeFilter,
  onTypeFilterChange,
  effectTypes,
  t,
  onInfo,
}: EffectComboboxProps) {
  const selectedEff = allEffects.find((d) => d.id === value);

  return (
    <div className="effect-combobox">
      <div className="effect-combobox-controls">
        <input
          className="effect-search-input"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder={t('builder.searchEffect')}
          onClick={(e) => e.stopPropagation()}
        />
        <select
          className="effect-type-select"
          value={typeFilter}
          onChange={(e) => { e.stopPropagation(); onTypeFilterChange(e.target.value); }}
          onClick={(e) => e.stopPropagation()}
        >
          {effectTypes.map((type) => (
            <option key={type} value={type}>
              {t(`builder.filter${type.charAt(0).toUpperCase() + type.slice(1)}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="effect-selector-row">
        <select
          className="effect-select"
          value={value}
          onChange={(e) => { e.stopPropagation(); onChange(e.target.value); }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">{t('builder.selectEffect')}</option>
          {effects.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.baseCost} PP/rank)
            </option>
          ))}
        </select>
        <button
          className="effect-info-btn"
          disabled={!selectedEff}
          onClick={(e) => { e.stopPropagation(); if (selectedEff) onInfo(selectedEff); }}
          title={t('builder.viewEffect')}
        >
          <Info size={14} />
        </button>
      </div>

      <style>{`
        .effect-combobox { display: flex; flex-direction: column; gap: var(--s-xs); }
        .effect-combobox-controls { display: flex; gap: var(--s-xs); align-items: center; }
        .effect-search-input {
          flex: 1; background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: 6px 10px; color: var(--c-text);
          font-family: var(--f-body); font-size: 0.85rem;
        }
        .effect-search-input:focus { outline: none; border-color: var(--c-primary); }
        .effect-type-select {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: 5px 6px; color: var(--c-text);
          font-family: var(--f-body); font-size: 0.78rem; cursor: pointer;
        }
        .effect-selector-row { display: flex; gap: var(--s-xs); align-items: center; }
        .effect-select {
          flex: 1; background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
          color: var(--c-text); font-family: var(--f-body); font-size: 0.9rem;
        }
        .effect-select:focus { outline: none; border-color: var(--c-primary); }
        .effect-info-btn {
          background: transparent; border: 1px solid var(--c-border); border-radius: var(--r-sm);
          color: var(--c-text-muted); cursor: pointer; padding: 6px 8px;
          display: flex; align-items: center; transition: all var(--t-fast);
        }
        .effect-info-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }
        .effect-info-btn:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
