import React from 'react';
import { getComponentEffectRanks } from '../../shared/lib/componentRanks';
import { X, Plus, AlertTriangle } from 'lucide-react';
import { ModifierDropzone } from './components/ModifierDropzone';
import { EffectCombobox } from '../../shared/ui/EffectCombobox';
import { Button } from '../../shared/ui/Button';
import type { TFunction } from 'i18next';
import type {
  IAlternateEffect,
  IPowerEffect,
  IModifierDef,
  ICharacterPowerComponent,
} from '../../entities/types';
import { NumberInput } from '../../shared/ui/NumberInput';
import { VariableCostSelector } from './components/VariableCostSelector';
import { ConfigurableFieldSelector } from './components/ConfigurableFieldSelector';
import { SenseTraitsEditor } from './components/SenseTraitsEditor';
import { ModifierParameterControls } from './components/ModifierParameterControls';
import { EffectReference } from './components/EffectReference';
import { PowerNotesTextarea } from './components/PowerNotesTextarea';
import { PowerLibraryButton } from '../power-library/PowerLibraryButton';
import type { PowerLibraryTarget } from '../power-library/types';
import { getComponentCostBreakdown } from '../../shared/lib/mathEngine';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';
import { modifierInstanceKey } from './modifierInstances';

interface AltEffectCardProps {
  strength?: number;
  costUnit?: 'PP' | 'EP';
  ae: IAlternateEffect;
  aeIdx: number;
  cost: number;
  cap: number;
  validation: { valid: boolean; overageBy: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeCompId: string;
  onSetActiveComp: (id: string) => void;
  allEffects: IPowerEffect[];
  allModDefs: IModifierDef[];
  genericModifierDefs: IModifierDef[];
  modifierIncompatibilities: Record<string, string[]>;

  activeId: string | null;
  onUpdateAE: (u: Partial<IAlternateEffect>) => void;
  onRemoveAE: () => void;
  onAddComponent: () => void;
  onRemoveComponent: (cId: string) => void;
  onUpdateComponent: (cId: string, u: Partial<ICharacterPowerComponent>) => void;
  onRemoveModifier: (cId: string, modId: string) => void;
  onUpdateModifierRanks: (cId: string, modId: string, ranks: number) => void;
  onUpdateModifierOption: (cId: string, modId: string, opt: string) => void;
  onUpdateModifierOptions: (cId: string, modId: string, opts: Record<string, boolean | number | string>) => void;
  onInfoClick: (e: IPowerEffect) => void;
  onOpenLibrary: (target: PowerLibraryTarget) => void;
  t: TFunction;
}

export function AltEffectCard({
  strength = 0, costUnit = 'PP', ae, aeIdx, cost, cap, validation, isExpanded, onToggleExpand,
  activeCompId, onSetActiveComp,
  allEffects, allModDefs, genericModifierDefs, modifierIncompatibilities,
  activeId,
  onUpdateAE, onRemoveAE, onAddComponent, onRemoveComponent, onUpdateComponent,
  onRemoveModifier, onUpdateModifierRanks, onUpdateModifierOption, onUpdateModifierOptions,
  onInfoClick, onOpenLibrary, t,
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
          {valid ? '✅' : '⚠️'} {cost}/{cap} {costUnit}
          {!valid && <span className="ae-overage"> {t('builder.aeOverageLabel', { overageBy })}</span>}
        </span>
        <PowerLibraryButton targetLabel={ae.name || `AE ${aeIdx + 1}`}
          onClick={() => onOpenLibrary({ kind: 'alternate', alternateId: ae.id })}/>
        <label
          className="ae-dynamic-label"
          title={t('builder.dynamicTooltip')}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            className="app-checkbox"
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
            const costBreakdown = effectDef
              ? getComponentCostBreakdown(comp, effectDef, genericModifierDefs, strength)
              : null;
            const isActiveComp = comp.id === activeCompId;

            return (
              <React.Fragment key={comp.id}>
                <div
                  className={`ae-comp-card ${isActiveComp ? 'ae-comp-card--active' : ''}`}
                  onClick={() => onSetActiveComp(comp.id)}
                >
                  {/* Component header */}
                  <div className="ae-comp-header">
                    <span className="ae-comp-label">Comp. {cIdx + 1}</span>
                    <PowerLibraryButton targetLabel={`${ae.name || `AE ${aeIdx + 1}`} · ${cIdx + 1}`}
                      onClick={() => onOpenLibrary({ kind: 'component', componentId: comp.id, alternateId: ae.id })}/>
                    {ae.components.length > 1 && (
                      <button
                        className="component-remove"
                        onClick={(e) => { e.stopPropagation(); onRemoveComponent(comp.id); }}
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>

                  <div className={`build-effect-layout ${effectDef ? 'build-effect-layout--with-reference' : ''}`}>
                    <div className="build-effect-controls">
                      {/* Effect selection + Ranks */}
                      <div
                        className="build-row"
                        style={{ alignItems: 'flex-end' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="build-section build-section--flex">
                          <EffectCombobox
                            value={comp.effectId}
                            onChange={(effectId) => onUpdateComponent(comp.id, {
                              effectId,
                              ranks: 1,
                              variableCostOption: undefined,
                              fieldValues: {},
                              senseTraits: effectId === 'senses' ? [] : undefined,
                            })}
                            allEffects={allEffects}
                            t={t}
                            onInfo={onInfoClick}
                          />
                        </div>
                        <div className="build-section">
                          <label className="build-label">{t('builder.ranks')}</label>
                          <NumberInput
                            variant="small"
                            className="build-input build-input--small"
                            value={comp.ranks}
                            onChange={(value) =>
                              onUpdateComponent(comp.id, { ranks: Math.max(1, value) })
                            }
                            onClick={(e) => e.stopPropagation()}
                            min={1}
                            disabled={effectDef?.variableCost?.costType === 'flat'}
                          />
                        </div>
                      </div>

                      {effectDef?.variableCost && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <VariableCostSelector
                            options={effectDef.variableCost.options}
                            costType={effectDef.variableCost.costType}
                            selected={comp.variableCostOption}
                            onChange={(optionName) => onUpdateComponent(comp.id, {
                              variableCostOption: optionName,
                              ...(effectDef.variableCost?.costType === 'flat' ? { ranks: 1 } : {}),
                            })}
                            t={t}
                            name={`variable-cost-${ae.id}-${comp.id}`}
                          />
                        </div>
                      )}

                      {effectDef?.configurableFields && effectDef.configurableFields.length > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <ConfigurableFieldSelector
                            fields={effectDef.configurableFields}
                            values={comp.fieldValues || {}}
                            onChange={(fieldId, value) => onUpdateComponent(comp.id, {
                              fieldValues: { ...(comp.fieldValues || {}), [fieldId]: value },
                            })}
                            t={t}
                          />
                        </div>
                      )}
                      {comp.effectId === 'senses' && comp.senseTraits !== undefined && (
                        <SenseTraitsEditor traits={comp.senseTraits} onChange={(senseTraits) => onUpdateComponent(comp.id, { senseTraits, ranks: senseTraits.reduce((sum, trait) => sum + trait.ranks, 0) })} />
                      )}

                      {costBreakdown && (
                        <div className={`component-breakdown ${costBreakdown.rankGroups.some((group) => group.isFractional) ? 'component-breakdown--fractional' : ''}`}>
                          {costBreakdown.rankGroups.map((group, groupIndex) => (
                            <span key={`${group.fromRank}-${group.toRank}`}>
                              R{group.fromRank}{group.toRank > group.fromRank ? `–${group.toRank}` : ''}:{' '}
                              {group.isFractional
                                ? `1 ${costUnit} / ${group.ranksPerPP} ranks × ${group.rankCount}`
                                : `${group.costPerRank} ${costUnit}/rank × ${group.rankCount}`}
                              {' = '}{group.subtotal} {costUnit}{groupIndex < costBreakdown.rankGroups.length - 1 ? ' + ' : ''}
                            </span>
                          ))}
                          {(costBreakdown.rankGroups.length !== 1
                            || costBreakdown.flatCost !== 0
                            || costBreakdown.total !== costBreakdown.rankCost) && (
                            <span>{' = '}<strong>{costBreakdown.total} {costUnit}</strong></span>
                          )}
                        </div>
                      )}

                      {/* Modifier dropzone */}
                      <div className="build-section" onClick={(e) => e.stopPropagation()}>
                        <label className="build-label">{t('builder.modifiers')}</label>
                        <ModifierDropzone componentId={comp.id} aeId={ae.id} effectId={comp.effectId} label={`${ae.name || `AE ${aeIdx + 1}`} · ${effectDef?.name ?? cIdx + 1}`}>
                          {comp.modifiers.length === 0 && !activeId && (
                            <span className="dropzone-placeholder">{t('builder.dropHere')}</span>
                          )}
                          {comp.modifiers.map((applied, modifierIndex) => {
                            const def = effectDef
                              ? resolveModifierDefinition(applied, effectDef, genericModifierDefs).definition
                              : undefined;
                            if (!def) return null;
                            const applicationNumber = comp.modifiers.filter(modifier => modifier.modifierId === applied.modifierId).length > 1
                              ? comp.modifiers.slice(0, modifierIndex + 1).filter(modifier => modifier.modifierId === applied.modifierId).length : undefined;
                            // Check for incompatibilities
                            const incompatKey = `${ae.id}:${comp.id}:${applied.modifierId}`;
                            const conflicts = modifierIncompatibilities[incompatKey] || [];
                            const hasIncompatibility = conflicts.length > 0;

                            return (
                              <div
                                key={modifierInstanceKey(applied, modifierIndex)}
                                className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''} ${hasIncompatibility ? 'applied-mod--incompatible' : ''}`}
                              >
                                <span className="applied-mod-name">{def.name}{applicationNumber && <small className="applied-mod-instance-number"> #{applicationNumber}</small>}</span>
                                <ModifierParameterControls
                                  applied={applied}
                                  definition={def}
                                  applicationNumber={applicationNumber}
                                  effectRanks={Math.max(1, getComponentEffectRanks(comp, strength))}
                                  effectAction={effectDef?.action}
                                  onRanksChange={(value) => onUpdateModifierRanks(comp.id, modifierInstanceKey(applied, modifierIndex), value)}
                                  onOptionsChange={(options) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), options)}
                                />
                                {def.options && def.options.length > 0 && (
                                  <>
                                    <select className="applied-mod-option" value={applied.option ?? ''} onChange={(e) => onUpdateModifierOption(comp.id, modifierInstanceKey(applied, modifierIndex), e.target.value)}>
                                      <option value="">Shape...</option>
                                      {def.options.map((opt) => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                                    </select>
                                    {def.id === 'area' && applied.option === 'Perception' && (
                                      <label className="applied-mod-check"><input className="app-checkbox" type="checkbox" checked={applied.options?.includesSenseDependent === true} onChange={(e) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), { ...applied.options, includesSenseDependent: e.target.checked })} /> Includes Sense-Dependent</label>
                                    )}
                                  </>
                                )}
                                {def.id === 'affects_objects' && (
                                  <label className="applied-mod-checkbox">
                                    <input
                                      className="app-checkbox"
                                      type="checkbox"
                                      checked={applied.options?.affectsOnlyObjects === true}
                                      onChange={(e) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                        ...applied.options,
                                        affectsOnlyObjects: e.target.checked,
                                      })}
                                    />
                                    {t('builder.affectsOnlyObjects')}
                                  </label>
                                )}
                                {def.id === 'affects_others' && (
                                  <label className="applied-mod-checkbox">
                                    <input
                                      className="app-checkbox"
                                      type="checkbox"
                                      checked={applied.options?.affectsOnlyOthers === true}
                                      onChange={(e) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                        ...applied.options,
                                        affectsOnlyOthers: e.target.checked,
                                      })}
                                    />
                                    {t('builder.affectsOnlyOthers')}
                                  </label>
                                )}
                                {def.id === 'side_effect' && (
                                  <label className="applied-mod-checkbox">
                                    <input
                                      className="app-checkbox"
                                      type="checkbox"
                                      checked={applied.options?.sideEffectAlways === true}
                                      onChange={(e) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                        ...applied.options,
                                        sideEffectAlways: e.target.checked,
                                      })}
                                    />
                                    {t('builder.sideEffectAlways')}
                                  </label>
                                )}
                                {def.id === 'alternate_resistance' && (
                                  <select
                                    className="applied-mod-subtype"
                                    value={(applied.options?.alternateResistanceCost as string) ?? 'equal'}
                                    onChange={(e) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                      ...applied.options,
                                      alternateResistanceCost: e.target.value,
                                    })}
                                  >
                                    <option value="equal">{t('builder.alternateResistanceEqual')}</option>
                                    <option value="advantageous">{t('builder.alternateResistanceAdvantageous')}</option>
                                  </select>
                                )}
                                {(def.id === 'reaction' || def.id === 'triggered') && (
                                  <input
                                    className="applied-mod-option"
                                    value={(applied.options?.trigger as string) ?? ''}
                                    onChange={(e) => onUpdateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                      ...applied.options,
                                      trigger: e.target.value,
                                    })}
                                    placeholder={t('builder.triggerPlaceholder')}
                                    aria-label={t('builder.trigger')}
                                  />
                                )}
                                {hasIncompatibility && (
                                  <span
                                    className="applied-mod-incompatible-warning"
                                    title={`${t('builder.incompatibleWith')}: ${conflicts.map(id => allModDefs.find(d => d.id === id)?.name || id).join(', ')}`}
                                  >
                                    <AlertTriangle size={14} />
                                  </span>
                                )}
                                <button
                                  className="applied-mod-remove"
                                  aria-label={`${t('common.remove')}: ${def.name}${applicationNumber ? ` (#${applicationNumber})` : ''}`}
                                  onClick={() => onRemoveModifier(comp.id, modifierInstanceKey(applied, modifierIndex))}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </ModifierDropzone>
                      </div>
                    </div>
                    {effectDef && <EffectReference effect={effectDef} t={t} />}
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Add linked effect button */}
          <Button variant="ghost" size="sm" onClick={onAddComponent}>
            <Plus size={12} /> {t('builder.addLinkedEffect')}
          </Button>

          {/* Notes */}
          <div className="build-section">
            <label className="build-label">{t('builder.notes')}</label>
            <PowerNotesTextarea
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
        .ae-card--invalid { border-color: rgba(var(--c-error-rgb, 248, 113, 113), 0.5); }
        .ae-card-header { display: flex; align-items: center; gap: var(--s-sm); padding: var(--s-sm) var(--s-md); cursor: pointer; transition: background var(--t-fast); flex-wrap: wrap; }
        .ae-card-header:hover { background: var(--c-surface-elevated); }
        .ae-card-arrow { font-size: 0.65rem; color: var(--c-text-muted); flex-shrink: 0; }
        .ae-card-name { flex: 1; min-width: 80px; background: transparent; border: none; color: var(--c-text); font-family: var(--f-body); font-size: 0.88rem; font-weight: 600; }
        .ae-card-name:focus { outline: none; }
        .ae-cost-badge { font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: var(--r-full); white-space: nowrap; }
        .ae-cost-badge--ok { background: rgba(var(--c-success-rgb, 74, 222, 128), 0.12); color: var(--c-success); }
        .ae-cost-badge--over { background: rgba(var(--c-error-rgb, 248, 113, 113), 0.12); color: var(--c-error); }
        .ae-overage { font-size: 0.68rem; opacity: 0.8; }
        .ae-dynamic-label { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--c-accent); cursor: pointer; flex-shrink: 0; }
        .ae-remove-btn { background: transparent; border: none; color: var(--c-text-muted); cursor: pointer; display: flex; transition: color var(--t-fast); flex-shrink: 0; }
        .ae-remove-btn:hover { color: var(--c-error); }
        .ae-card-body { padding: var(--s-md); display: flex; flex-direction: column; gap: var(--s-md); border-top: 1px solid var(--c-border); }
        .ae-cap-warning { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--c-error); background: rgba(var(--c-error-rgb, 248, 113, 113), 0.08); border: 1px solid rgba(var(--c-error-rgb, 248, 113, 113), 0.25); border-radius: var(--r-sm); padding: 6px 10px; }
        .ae-comp-card { border: 1px solid var(--c-border); border-radius: var(--r-sm); padding: var(--s-sm); display: flex; flex-direction: column; gap: var(--s-sm); background: var(--c-surface-elevated); cursor: pointer; transition: border-color var(--t-fast); container-type: inline-size; }
        .ae-comp-card--active { border-color: var(--c-accent); }
        .ae-comp-card:hover { border-color: var(--c-primary-muted); }
        .ae-comp-header { display: flex; align-items: center; gap: var(--s-sm); }
        .ae-comp-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-text-muted); flex: 1; }
        .component-breakdown--fractional { color: var(--c-warning); border-color: rgba(var(--c-warning-rgb, 251, 191, 36), 0.35); background: rgba(var(--c-warning-rgb, 251, 191, 36), 0.08); }
        .fractional-cost-badge { font-weight: 800; }
        .cost-comp-val--invalid { color: var(--c-error); }
      `}</style>
    </div>
  );
}
