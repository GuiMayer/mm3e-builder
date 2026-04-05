import React from 'react';
import { X, Plus, AlertTriangle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import type {
  IAlternateEffect,
  IPowerEffect,
  IModifierDef,
} from '../../entities/types';

// EffectCombobox is defined at the bottom of PowerBuilderOverlay — pass it as a render prop
// or re-export it. For simplicity we receive the necessary props and render inline selects here
// using the same EffectCombobox imported via the barrel export from the overlay.

interface AltEffectCardProps {
  ae: IAlternateEffect;
  aeIdx: number;
  cost: number;
  validation: { valid: boolean; overageBy: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeCompId: string;
  onSetActiveComp: (id: string) => void;
  powerDefs: IPowerEffect[];
  filteredEffects: IPowerEffect[];
  allEffects: IPowerEffect[];
  allModDefs: IModifierDef[];
  effectFilter: string;
  onFilterChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  effectTypes: string[];
  activeId: string | null;
  onUpdateAE: (u: Partial<IAlternateEffect>) => void;
  onRemoveAE: () => void;
  onAddComponent: () => void;
  onRemoveComponent: (cId: string) => void;
  onUpdateComponent: (cId: string, u: Partial<{ effectId: string; ranks: number }>) => void;
  onAddModifier: (cId: string, modId: string, sp?: boolean) => void;
  onRemoveModifier: (cId: string, modId: string) => void;
  onUpdateModifierRanks: (cId: string, modId: string, ranks: number) => void;
  onUpdateModifierOption: (cId: string, modId: string, opt: string) => void;
  onInfoClick: (e: IPowerEffect) => void;
  EffectComboboxComponent: React.ComponentType<EffectComboboxProps>;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

interface EffectComboboxProps {
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

export function AltEffectCard({
  ae, aeIdx, cost, validation, isExpanded, onToggleExpand,
  activeCompId, onSetActiveComp,
  allEffects, allModDefs,
  filteredEffects, effectFilter, onFilterChange,
  typeFilter, onTypeFilterChange, effectTypes,
  activeId,
  onUpdateAE, onRemoveAE, onAddComponent, onRemoveComponent, onUpdateComponent,
  onAddModifier: _onAddModifier, onRemoveModifier, onUpdateModifierRanks, onUpdateModifierOption,
  onInfoClick, EffectComboboxComponent, t,
}: AltEffectCardProps) {
  const { valid, overageBy } = validation;

  return (
    <div className={`ae-card ${isExpanded ? 'ae-card--expanded' : ''} ${!valid ? 'ae-card--invalid' : ''}`}>
      {/* Collapsed header — always visible */}
      <div className="ae-card-header" onClick={onToggleExpand}>
        <span className="ae-card-arrow">{isExpanded ? '▼' : '▶'}</span>
        <input
          className="ae-card-name"
          value={ae.name}
          onChange={(e) => { e.stopPropagation(); onUpdateAE({ name: e.target.value }); }}
          onClick={(e) => e.stopPropagation()}
          placeholder={`AE ${aeIdx + 1}`}
        />
        <span className={`ae-cost-badge ${valid ? 'ae-cost-badge--ok' : 'ae-cost-badge--over'}`}>
          {valid ? '✅' : '⚠️'} {cost}pp
          {!valid && <span className="ae-overage"> +{overageBy}PP acima</span>}
        </span>
        <label
          className="ae-dynamic-label"
          title={t('builder.dynamicTooltip')}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={ae.dynamic}
            onChange={(e) => onUpdateAE({ dynamic: e.target.checked })}
          />
          {t('builder.dynamic')} ⓘ
        </label>
        <button
          className="ae-remove-btn"
          onClick={(e) => { e.stopPropagation(); onRemoveAE(); }}
          title="Remover"
        >
          <X size={13} />
        </button>
      </div>

      {/* Expanded body */}
      {isExpanded && (
        <div className="ae-card-body">
          {!valid && (
            <div className="ae-cap-warning">
              <AlertTriangle size={12} />
              {t('builder.altExceedsCap', { overageBy })}
            </div>
          )}

          {/* Component cards */}
          {ae.components.map((comp, cIdx) => {
            const effectDef = allEffects.find((d) => d.id === comp.effectId);
            const isActiveComp = comp.id === activeCompId;
            const droppableId = `dropzone-ae::${ae.id}::${comp.id}`;

            return (
              <AEDropzone key={comp.id} droppableId={droppableId} isActive={isActiveComp && activeId !== null}>
                <div
                  className={`ae-comp-card ${isActiveComp ? 'ae-comp-card--active' : ''}`}
                  onClick={() => onSetActiveComp(comp.id)}
                >
                  {/* Component header */}
                  <div className="ae-comp-header">
                    <span className="ae-comp-label">Comp. {cIdx + 1}</span>
                    {ae.components.length > 1 && (
                      <button
                        className="component-remove"
                        onClick={(e) => { e.stopPropagation(); onRemoveComponent(comp.id); }}
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>

                  {/* Effect selection + Ranks */}
                  <div
                    className="build-row"
                    style={{ alignItems: 'flex-end' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="build-section build-section--flex">
                      <EffectComboboxComponent
                        value={comp.effectId}
                        onChange={(effectId) => onUpdateComponent(comp.id, { effectId })}
                        effects={filteredEffects}
                        allEffects={allEffects}
                        filter={effectFilter}
                        onFilterChange={onFilterChange}
                        typeFilter={typeFilter}
                        onTypeFilterChange={onTypeFilterChange}
                        effectTypes={effectTypes}
                        t={t}
                        onInfo={onInfoClick}
                      />
                    </div>
                    <div className="build-section">
                      <label className="build-label">{t('builder.ranks')}</label>
                      <input
                        type="number"
                        min={1}
                        className="build-input build-input--small"
                        value={comp.ranks}
                        onChange={(e) =>
                          onUpdateComponent(comp.id, { ranks: Math.max(1, Number(e.target.value) || 1) })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Effect info tags */}
                  {effectDef && (
                    <div className="build-effect-info">
                      <span className="effect-badge">{effectDef.type}</span>
                      <span className="effect-detail">{effectDef.action}</span>
                      <span className="effect-detail">{effectDef.range}</span>
                      <span className="effect-detail">{effectDef.duration}</span>
                    </div>
                  )}

                  {/* Modifier dropzone */}
                  <div className="build-section" onClick={(e) => e.stopPropagation()}>
                    <label className="build-label">{t('builder.modifiers')}</label>
                    <div className={`build-dropzone ${isActiveComp && activeId ? 'build-dropzone--active' : ''}`}>
                      {comp.modifiers.length === 0 && !activeId && (
                        <span className="dropzone-placeholder">{t('builder.dropHere')}</span>
                      )}
                      {comp.modifiers.map((applied) => {
                        const def = allModDefs.find((d) => d.id === applied.modifierId);
                        if (!def) return null;
                        const modCostPP =
                          def.costType === 'flat'
                            ? def.costValue
                            : def.costType === 'flat_ranked'
                            ? def.costValue * applied.ranks
                            : null;
                        return (
                          <div
                            key={applied.modifierId}
                            className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''}`}
                          >
                            <span className="applied-mod-name">{def.name}</span>
                            {def.costType !== 'per_rank' && (
                              <input
                                type="number"
                                min={1}
                                max={def.maxRanks ?? undefined}
                                className="applied-mod-ranks"
                                value={applied.ranks}
                                onChange={(e) =>
                                  onUpdateModifierRanks(comp.id, applied.modifierId, Number(e.target.value) || 1)
                                }
                              />
                            )}
                            {def.options && def.options.length > 0 && (
                              <select
                                className="applied-mod-option"
                                value={applied.option ?? ''}
                                onChange={(e) =>
                                  onUpdateModifierOption(comp.id, applied.modifierId, e.target.value)
                                }
                              >
                                <option value="">Shape...</option>
                                {def.options.map((opt) => (
                                  <option key={opt.label} value={opt.label}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            <span className="applied-mod-cost">
                              {def.costValue > 0 ? '+' : ''}
                              {def.costType === 'per_rank'
                                ? `${def.costValue}/rank`
                                : modCostPP !== null
                                ? `${modCostPP > 0 ? '+' : ''}${modCostPP}pp`
                                : ''}
                            </span>
                            <button
                              className="applied-mod-remove"
                              onClick={() => onRemoveModifier(comp.id, applied.modifierId)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </AEDropzone>
            );
          })}

          {/* Add linked effect button */}
          <button className="ae-add-comp-btn" onClick={onAddComponent}>
            <Plus size={12} /> {t('builder.addLinkedEffect')}
          </button>

          {/* Notes */}
          <div className="build-section">
            <label className="build-label">{t('builder.notes')}</label>
            <textarea
              className="build-textarea"
              value={ae.notes}
              onChange={(e) => onUpdateAE({ notes: e.target.value })}
              placeholder={t('builder.notesPlaceholder')}
              rows={2}
            />
          </div>
        </div>
      )}

      <style>{`
        .ae-section { gap: var(--s-sm); }
        .ae-section-header { display: flex; align-items: center; justify-content: space-between; }
        .ae-cap-badge { font-size: 0.72rem; font-weight: 700; padding: 2px 10px; border-radius: var(--r-full); background: var(--c-primary-muted); color: var(--c-primary); }
        .ae-rules-note { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--c-text-muted); padding: 4px var(--s-sm); background: var(--c-surface-elevated); border-radius: var(--r-sm); border: 1px solid var(--c-border); }
        .ae-card { border: 1px solid var(--c-border); border-radius: var(--r-md); background: var(--c-surface); overflow: hidden; transition: border-color var(--t-fast); }
        .ae-card--expanded { border-color: var(--c-accent); }
        .ae-card--invalid { border-color: rgba(248,113,113,0.5); }
        .ae-card-header { display: flex; align-items: center; gap: var(--s-sm); padding: var(--s-sm) var(--s-md); cursor: pointer; transition: background var(--t-fast); flex-wrap: wrap; }
        .ae-card-header:hover { background: var(--c-surface-elevated); }
        .ae-card-arrow { font-size: 0.65rem; color: var(--c-text-muted); flex-shrink: 0; }
        .ae-card-name { flex: 1; min-width: 80px; background: transparent; border: none; color: var(--c-text); font-family: var(--f-body); font-size: 0.88rem; font-weight: 600; }
        .ae-card-name:focus { outline: none; }
        .ae-cost-badge { font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: var(--r-full); white-space: nowrap; }
        .ae-cost-badge--ok { background: rgba(74,222,128,0.12); color: var(--c-success); }
        .ae-cost-badge--over { background: rgba(248,113,113,0.12); color: var(--c-error); }
        .ae-overage { font-size: 0.68rem; opacity: 0.8; }
        .ae-dynamic-label { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--c-accent); cursor: pointer; flex-shrink: 0; }
        .ae-remove-btn { background: transparent; border: none; color: var(--c-text-muted); cursor: pointer; display: flex; transition: color var(--t-fast); flex-shrink: 0; }
        .ae-remove-btn:hover { color: var(--c-error); }
        .ae-card-body { padding: var(--s-md); display: flex; flex-direction: column; gap: var(--s-md); border-top: 1px solid var(--c-border); }
        .ae-cap-warning { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--c-error); background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.25); border-radius: var(--r-sm); padding: 6px 10px; }
        .ae-comp-card { border: 1px solid var(--c-border); border-radius: var(--r-sm); padding: var(--s-sm); display: flex; flex-direction: column; gap: var(--s-sm); background: var(--c-surface-elevated); cursor: pointer; transition: border-color var(--t-fast); }
        .ae-comp-card--active { border-color: var(--c-accent); }
        .ae-comp-card:hover { border-color: var(--c-primary-muted); }
        .ae-comp-header { display: flex; align-items: center; gap: var(--s-sm); }
        .ae-comp-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-text-muted); flex: 1; }
        .ae-add-comp-btn { display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: transparent; border: 1px dashed var(--c-border); border-radius: var(--r-sm); color: var(--c-text-muted); font-size: 0.75rem; cursor: pointer; transition: all var(--t-fast); width: 100%; justify-content: center; }
        .ae-add-comp-btn:hover { border-color: var(--c-accent); color: var(--c-accent); }
        .ae-add-btn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; background: var(--c-surface-elevated); border: 1px dashed var(--c-border); border-radius: var(--r-md); color: var(--c-text-secondary); font-size: 0.8rem; cursor: pointer; transition: all var(--t-fast); align-self: flex-start; }
        .ae-add-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }
        .cost-comp-val--invalid { color: var(--c-error); }
      `}</style>
    </div>
  );
}

// Droppable wrapper for AE component modifier dropzones
function AEDropzone({
  droppableId,
  isActive,
  children,
}: {
  droppableId: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: droppableId });
  return (
    <div ref={setNodeRef} className={isActive ? 'ae-dropzone-active' : ''}>
      {children}
    </div>
  );
}
