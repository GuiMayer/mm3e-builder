import { useState, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import type {
  ICharacterPower,
  IAlternateEffect,
  IModifierDef,
  ICharacterPowerComponent,
  IPowerEffect,
} from '../../entities/types';
import powerDefsRaw from '../../data/powers.json';
import modifierDefsRaw from '../../data/modifiers.json';
import {
  calculateArrayCost,
  getComponentCostBreakdown,
} from '../../shared/lib/mathEngine';
import { EffectPalette } from './EffectPalette';
import { X, Save, Plus, Trash2, Zap, Info, AlertTriangle } from 'lucide-react';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../shared/ui/Modal';

// ── Droppable Zone per component ──
function ModifierDropzone({
  componentId,
  activeId,
  children,
}: {
  componentId: string;
  activeId: string | null;
  children: React.ReactNode;
}) {
  const droppableId = `dropzone-${componentId}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });
  return (
    <div
      ref={setNodeRef}
      className={`build-dropzone ${isOver || activeId ? 'build-dropzone--active' : ''}`}
    >
      {children}
    </div>
  );
}

interface Props {
  existingPower?: ICharacterPower;
  onSave: (power: ICharacterPower) => void;
  onClose: () => void;
}

export function PowerBuilderOverlay({ existingPower, onSave, onClose }: Props) {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(powerDefsRaw) as IPowerEffect[];
  const modifierDefs = useLocalizedData(modifierDefsRaw as Parameters<typeof useLocalizedData>[0]) as IModifierDef[];

  // Build initial state — if existing power has legacy format, migration handles it at store level
  const [power, setPower] = useState<ICharacterPower>(
    existingPower ?? {
      id: uuidv4(),
      name: '',
      components: [{ id: uuidv4(), effectId: '', ranks: 1, modifiers: [] }],
      notes: '',
      alternateEffects: [],
    }
  );

  const [paletteFilter, setPaletteFilter] = useState('');
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<string>(
    power.components[0]?.id ?? ''
  );
  const [effectFilter, setEffectFilter] = useState('');
  const [effectTypeFilter, setEffectTypeFilter] = useState<string>('all');
  const [effectModalPower, setEffectModalPower] = useState<IPowerEffect | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // All modifier defs (general + power-specific merged for lookup)
  const allModDefs = useMemo(() => {
    const specificMods: IModifierDef[] = [];
    power.components.forEach((comp) => {
      const effect = powerDefs.find((d) => d.id === comp.effectId);
      if (effect) {
        specificMods.push(...(effect.extras || []), ...(effect.flaws || []));
      }
    });
    // Deduplicate by id
    const seen = new Set<string>();
    return [...modifierDefs, ...specificMods].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [modifierDefs, power.components, powerDefs]);

  // Currently selected effect for the active component
  const activeComponent = power.components.find((c) => c.id === activeComponentId);
  const selectedEffect = activeComponent
    ? powerDefs.find((d) => d.id === activeComponent.effectId)
    : undefined;

  // Calculate costs per component
  const componentCosts = useMemo(() => {
    return power.components.map((comp) => {
      const effectDef = powerDefs.find((d) => d.id === comp.effectId);
      if (!effectDef) return { total: 0, breakdown: null };
      const breakdown = getComponentCostBreakdown(comp, effectDef, allModDefs);
      return { total: breakdown.total, breakdown };
    });
  }, [power.components, powerDefs, allModDefs]);

  const mainCost = componentCosts.reduce((sum, c) => sum + c.total, 0);
  const dynamicCount = power.alternateEffects.filter((a) => a.dynamic).length;
  const totalCost = calculateArrayCost(mainCost, power.alternateEffects.length, dynamicCount);

  // Filtered effect list
  const filteredEffects = useMemo(() => {
    return powerDefs.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(effectFilter.toLowerCase()) ||
        d.description.toLowerCase().includes(effectFilter.toLowerCase());
      const matchType = effectTypeFilter === 'all' || d.type === effectTypeFilter;
      return matchSearch && matchType;
    });
  }, [powerDefs, effectFilter, effectTypeFilter]);

  // Drag handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    if (!overId.startsWith('dropzone-')) return;
    const targetComponentId = overId.replace('dropzone-', '');

    const modId = active.id as string;
    addModifierToComponent(targetComponentId, modId);
  }

  const addModifierToComponent = useCallback(
    (componentId: string, modId: string, isPowerSpecific?: boolean) => {
      // Check if it comes from the power's specific modifiers
      const allSpecific = powerDefs.flatMap((p) => [...(p.extras || []), ...(p.flaws || [])]);
      const isSpecific = isPowerSpecific ?? allSpecific.some((m) => m.id === modId);

      setPower((p) => ({
        ...p,
        components: p.components.map((comp) => {
          if (comp.id !== componentId) return comp;
          const already = comp.modifiers.find((m) => m.modifierId === modId);
          if (already) {
            return {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, ranks: m.ranks + 1 } : m
              ),
            };
          }
          return {
            ...comp,
            modifiers: [
              ...comp.modifiers,
              { modifierId: modId, ranks: 1, isPowerSpecific: isSpecific },
            ],
          };
        }),
      }));
    },
    [powerDefs]
  );

  function handleAddModifierFromPalette(modId: string, isPowerSpecific?: boolean) {
    if (!activeComponentId) return;
    addModifierToComponent(activeComponentId, modId, isPowerSpecific);
  }

  function removeModifier(componentId: string, modId: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : { ...comp, modifiers: comp.modifiers.filter((m) => m.modifierId !== modId) }
      ),
    }));
  }

  function updateModifierRanks(componentId: string, modId: string, ranks: number) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, ranks: Math.max(1, ranks) } : m
              ),
            }
      ),
    }));
  }

  function updateModifierOption(componentId: string, modId: string, option: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, option } : m
              ),
            }
      ),
    }));
  }

  function addComponent() {
    const newComp: ICharacterPowerComponent = {
      id: uuidv4(),
      effectId: '',
      ranks: 1,
      modifiers: [],
    };
    setPower((p) => ({ ...p, components: [...p.components, newComp] }));
    setActiveComponentId(newComp.id);
  }

  function removeComponent(componentId: string) {
    if (power.components.length <= 1) return;
    const remaining = power.components.filter((c) => c.id !== componentId);
    setPower((p) => ({ ...p, components: remaining }));
    if (activeComponentId === componentId) {
      setActiveComponentId(remaining[0]?.id ?? '');
    }
  }

  function updateComponent(componentId: string, update: Partial<ICharacterPowerComponent>) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === componentId ? { ...c, ...update } : c
      ),
    }));
  }

  function addAlternateEffect() {
    const alt: IAlternateEffect = {
      id: uuidv4(),
      name: '',
      effectId: '',
      ranks: 1,
      modifiers: [],
      dynamic: false,
      notes: '',
    };
    setPower((p) => ({ ...p, alternateEffects: [...p.alternateEffects, alt] }));
  }

  function removeAlternateEffect(id: string) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.filter((a) => a.id !== id),
    }));
  }

  function updateAlternateEffect(id: string, update: Partial<IAlternateEffect>) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((a) =>
        a.id === id ? { ...a, ...update } : a
      ),
    }));
  }

  function handleSave() {
    const hasEffect = power.components.some((c) => c.effectId !== '');
    if (!hasEffect) return;
    onSave(power);
  }

  const activeMod = activeId ? allModDefs.find((m) => m.id === activeId) : null;
  const hasEffect = power.components.some((c) => c.effectId !== '');

  const effectTypes = ['all', 'attack', 'defense', 'movement', 'sensory', 'general', 'control'];

  return (
    <div className="builder-overlay">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Top Bar */}
        <div className="builder-topbar">
          <h2 className="builder-topbar-title">
            <Zap size={18} /> {t('builder.title')}
          </h2>
          <div className="builder-topbar-actions">
            <button className="builder-action-btn" onClick={addAlternateEffect}>
              <Plus size={14} /> {t('builder.addAlternate')}
            </button>
            <button
              className="builder-action-btn builder-save-btn"
              onClick={handleSave}
              disabled={!hasEffect}
            >
              <Save size={14} /> {t('builder.save')}
            </button>
            <button className="builder-action-btn builder-close-btn" onClick={onClose}>
              <X size={14} /> {t('builder.close')}
            </button>
          </div>
        </div>

        <div className="builder-body">
          {/* Sidebar: Modifier Palette */}
          <EffectPalette
            filter={paletteFilter}
            onFilterChange={setPaletteFilter}
            selectedEffect={selectedEffect}
            onAddModifier={handleAddModifierFromPalette}
            collapsed={paletteCollapsed}
            onToggleCollapse={() => setPaletteCollapsed((v) => !v)}
          />

          {/* Main: Build Workspace */}
          <div className="builder-workspace">
            {/* Power Name */}
            <div className="build-section">
              <label className="build-label">{t('builder.powerName')}</label>
              <input
                className="build-input"
                value={power.name}
                onChange={(e) => setPower((p) => ({ ...p, name: e.target.value }))}
                placeholder={t('builder.powerNamePlaceholder')}
              />
            </div>

            {/* Effect Components */}
            <div className="build-section">
              <div className="build-section-header">
                <label className="build-label">{t('builder.component')}</label>
                <button className="build-add-comp-btn" onClick={addComponent}>
                  <Plus size={12} /> {t('builder.addComponent')}
                </button>
              </div>

              {power.components.map((comp, idx) => {
                const effectDef = powerDefs.find((d) => d.id === comp.effectId);
                const costInfo = componentCosts[idx];
                const isActive = comp.id === activeComponentId;

                return (
                  <div
                    key={comp.id}
                    className={`component-card ${isActive ? 'component-card--active' : ''}`}
                    onClick={() => setActiveComponentId(comp.id)}
                  >
                    {/* Component header */}
                    <div className="component-header">
                      <span className="component-label">
                        {idx === 0 ? 'Efeito Principal' : `Efeito ${idx + 1}`}
                      </span>
                      {costInfo.total > 0 && (
                        <span className="component-cost">{costInfo.total} PP</span>
                      )}
                      {power.components.length > 1 && (
                        <button
                          className="component-remove"
                          onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }}
                          title={t('builder.removeComponent')}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Effect selector with search */}
                    <div className="build-row" style={{ alignItems: 'flex-end' }}>
                      <div className="build-section build-section--flex">
                        <EffectCombobox
                          value={comp.effectId}
                          onChange={(effectId) => updateComponent(comp.id, { effectId })}
                          effects={filteredEffects}
                          allEffects={powerDefs}
                          filter={effectFilter}
                          onFilterChange={setEffectFilter}
                          typeFilter={effectTypeFilter}
                          onTypeFilterChange={setEffectTypeFilter}
                          effectTypes={effectTypes}
                          t={t}
                          onInfo={(e) => setEffectModalPower(e)}
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
                            updateComponent(comp.id, {
                              ranks: Math.max(1, Number(e.target.value) || 1),
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Effect info strip */}
                    {effectDef && (
                      <div className="build-effect-info">
                        <span className="effect-badge">{effectDef.type}</span>
                        <span className="effect-detail">{t('common.action')}: {effectDef.action}</span>
                        <span className="effect-detail">{t('common.range')}: {effectDef.range}</span>
                        <span className="effect-detail">{t('common.duration')}: {effectDef.duration}</span>
                        <p className="effect-desc">{effectDef.description}</p>
                        {effectDef.enhancesDefense && (
                          <div className="defense-warning">
                            <AlertTriangle size={13} />
                            {t('builder.defenseWarning')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Modifier dropzone */}
                    <div className="build-section" onClick={(e) => e.stopPropagation()}>
                      <label className="build-label">{t('builder.modifiers')}</label>
                      <ModifierDropzone componentId={comp.id} activeId={isActive ? activeId : null}>
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
                              : null; // per_rank shown differently

                          const overPL =
                            def.maxRanks !== undefined && applied.ranks > def.maxRanks;

                          return (
                            <div
                              key={applied.modifierId}
                              className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''} ${applied.isPowerSpecific ? 'applied-mod--specific' : ''}`}
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
                                    updateModifierRanks(
                                      comp.id,
                                      applied.modifierId,
                                      Number(e.target.value) || 1
                                    )
                                  }
                                />
                              )}
                              {/* Sub-option dropdown */}
                              {def.options && def.options.length > 0 && (
                                <select
                                  className="applied-mod-option"
                                  value={applied.option ?? ''}
                                  onChange={(e) =>
                                    updateModifierOption(comp.id, applied.modifierId, e.target.value)
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
                              {overPL && (
                                <span className="applied-mod-overlimit" title={t('builder.plWarning')}>
                                  ⚠️
                                </span>
                              )}
                              <button
                                className="applied-mod-remove"
                                onClick={() => removeModifier(comp.id, applied.modifierId)}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </ModifierDropzone>
                    </div>

                    {/* Cost breakdown for this component */}
                    {costInfo.breakdown && costInfo.total > 0 && (
                      <div className="component-breakdown">
                        {costInfo.breakdown.perRankExtras > 0 || costInfo.breakdown.perRankFlaws > 0 ? (
                          <span>
                            ({costInfo.breakdown.base} + {costInfo.breakdown.perRankExtras} − {costInfo.breakdown.perRankFlaws}) × {comp.ranks} = {costInfo.breakdown.rankCost}
                            {costInfo.breakdown.flatCost !== 0 ? ` + ${costInfo.breakdown.flatCost} flat` : ''}
                            {' = '}<strong>{costInfo.breakdown.total} PP</strong>
                          </span>
                        ) : (
                          <span>
                            {costInfo.breakdown.base}/rank × {comp.ranks} = {costInfo.breakdown.rankCost}
                            {costInfo.breakdown.flatCost !== 0 ? ` + ${costInfo.breakdown.flatCost} flat` : ''}
                            {' = '}<strong>{costInfo.breakdown.total} PP</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div className="build-section">
              <label className="build-label">{t('builder.notes')}</label>
              <textarea
                className="build-textarea"
                value={power.notes}
                onChange={(e) => setPower((p) => ({ ...p, notes: e.target.value }))}
                placeholder={t('builder.notesPlaceholder')}
                rows={2}
              />
            </div>

            {/* Alternate Effects */}
            {power.alternateEffects.length > 0 && (
              <div className="build-section">
                <label className="build-label">{t('builder.alternateEffects')}</label>
                {power.alternateEffects.map((alt) => (
                  <div key={alt.id} className="alt-effect-card">
                    <div className="alt-effect-row">
                      <input
                        className="build-input build-input--sm"
                        value={alt.name}
                        onChange={(e) => updateAlternateEffect(alt.id, { name: e.target.value })}
                        placeholder={t('builder.powerName')}
                      />
                      <select
                        className="build-select build-select--sm"
                        value={alt.effectId}
                        onChange={(e) => updateAlternateEffect(alt.id, { effectId: e.target.value })}
                      >
                        <option value="">{t('common.select')}</option>
                        {powerDefs.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        className="build-input build-input--tiny"
                        value={alt.ranks}
                        onChange={(e) =>
                          updateAlternateEffect(alt.id, {
                            ranks: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                      />
                      <label className="alt-dynamic-label">
                        <input
                          type="checkbox"
                          checked={alt.dynamic}
                          onChange={(e) =>
                            updateAlternateEffect(alt.id, { dynamic: e.target.checked })
                          }
                        />
                        {t('builder.dynamic')}
                      </label>
                      <button className="alt-remove" onClick={() => removeAlternateEffect(alt.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Cost Summary */}
        <div className="builder-footer">
          <div className="cost-breakdown">
            {power.components.map((comp, idx) => {
              const effectDef = powerDefs.find((d) => d.id === comp.effectId);
              const costInfo = componentCosts[idx];
              if (!effectDef || !costInfo.breakdown) return null;
              return (
                <span key={comp.id} className="cost-comp-item">
                  <span className="cost-comp-name">{effectDef.name}</span>
                  <span className="cost-comp-val">{costInfo.total}pp</span>
                </span>
              );
            })}
            {power.alternateEffects.length > 0 && (
              <span className="cost-comp-item">
                <span className="cost-comp-name">{t('builder.alts', { count: power.alternateEffects.length })}</span>
              </span>
            )}
          </div>
          <div className="cost-total">
            <span className="cost-total-label">{t('builder.total')}:</span>
            <span className="cost-total-value">{totalCost} {t('common.pp')}</span>
          </div>
        </div>

        <DragOverlay>
          {activeMod && (
            <div className="drag-ghost">
              <span>{activeMod.name}</span>
              <span className="drag-ghost-cost">
                {activeMod.costValue > 0 ? '+' : ''}{activeMod.costValue}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Effect Detail Modal */}
      {effectModalPower && (
        <Modal isOpen={true} title={effectModalPower.name} onClose={() => setEffectModalPower(null)} compact>
          <div className="effect-modal-content">
            <div className="effect-modal-meta">
              <span className="effect-badge">{effectModalPower.type}</span>
              <span className="effect-detail">{effectModalPower.action}</span>
              <span className="effect-detail">{effectModalPower.range}</span>
              <span className="effect-detail">{effectModalPower.duration}</span>
              <span className="effect-detail">{effectModalPower.baseCost} PP/rank</span>
            </div>
            <p className="effect-modal-desc">
              {effectModalPower.longDescription || effectModalPower.description}
            </p>
          </div>
        </Modal>
      )}

      <style>{`
        .builder-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: var(--c-bg);
          display: flex; flex-direction: column;
          animation: fadeIn 0.2s ease;
        }
        .builder-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface); border-bottom: 1px solid var(--c-border);
        }
        .builder-topbar-title {
          display: flex; align-items: center; gap: var(--s-sm);
          font-size: 1rem; font-weight: 700; color: var(--c-primary);
        }
        .builder-topbar-actions { display: flex; gap: var(--s-xs); }
        .builder-action-btn {
          display: flex; align-items: center; gap: 4px;
          padding: var(--s-xs) var(--s-sm);
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text-secondary);
          font-family: var(--f-body); font-size: 0.8rem; cursor: pointer;
          transition: all var(--t-fast);
        }
        .builder-action-btn:hover { border-color: var(--c-primary); color: var(--c-text); }
        .builder-save-btn { background: var(--c-primary); color: var(--c-text-inverse); border-color: var(--c-primary); }
        .builder-save-btn:hover { opacity: 0.9; }
        .builder-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .builder-close-btn:hover { border-color: var(--c-error); color: var(--c-error); }

        .builder-body { flex: 1; display: flex; overflow: hidden; }
        .builder-workspace {
          flex: 1; padding: var(--s-lg); overflow-y: auto;
          display: flex; flex-direction: column; gap: var(--s-md);
        }

        .build-section { display: flex; flex-direction: column; gap: var(--s-xs); }
        .build-section--flex { flex: 1; }
        .build-section-header { display: flex; align-items: center; justify-content: space-between; }
        .build-row { display: flex; gap: var(--s-md); }
        .build-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--c-text-secondary); }
        .build-select, .build-input, .build-textarea {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm) var(--s-md);
          color: var(--c-text); font-family: var(--f-body); font-size: 0.9rem;
        }
        .build-select:focus, .build-input:focus, .build-textarea:focus {
          outline: none; border-color: var(--c-primary); box-shadow: 0 0 0 2px var(--c-primary-muted);
        }
        .build-input--small { width: 80px; text-align: center; }
        .build-input--sm { flex: 1; min-width: 100px; }
        .build-input--tiny { width: 55px; text-align: center; }
        .build-select--sm { flex: 1; min-width: 120px; }
        .build-textarea { resize: vertical; line-height: 1.5; }
        .build-add-comp-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 3px 10px; background: var(--c-surface-elevated);
          border: 1px solid var(--c-border); border-radius: var(--r-sm);
          color: var(--c-text-secondary); font-size: 0.75rem; cursor: pointer;
          transition: all var(--t-fast);
        }
        .build-add-comp-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }

        /* Component Cards */
        .component-card {
          border: 1px solid var(--c-border); border-radius: var(--r-md);
          padding: var(--s-md); display: flex; flex-direction: column; gap: var(--s-sm);
          cursor: pointer; transition: all var(--t-fast);
          background: var(--c-surface);
        }
        .component-card:hover { border-color: var(--c-primary-muted); }
        .component-card--active { border-color: var(--c-primary); box-shadow: 0 0 0 1px var(--c-primary-muted); }
        .component-header { display: flex; align-items: center; gap: var(--s-sm); }
        .component-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-text-muted); flex: 1; }
        .component-cost { font-size: 0.78rem; font-weight: 700; color: var(--c-primary); }
        .component-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; transition: color var(--t-fast); padding: 2px;
        }
        .component-remove:hover { color: var(--c-error); }
        .component-breakdown {
          font-size: 0.72rem; color: var(--c-text-muted); padding: 4px 8px;
          background: var(--c-surface-elevated); border-radius: var(--r-sm);
        }

        /* Effect selector combobox */
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

        /* Effect info strip */
        .build-effect-info {
          display: flex; flex-wrap: wrap; gap: var(--s-sm); align-items: center;
          padding: var(--s-sm) var(--s-md);
          background: var(--c-primary-muted); border-radius: var(--r-sm);
        }
        .effect-badge {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          padding: 2px 8px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-text-inverse);
        }
        .effect-detail { font-size: 0.78rem; color: var(--c-text-secondary); }
        .effect-desc { font-size: 0.82rem; color: var(--c-text); width: 100%; margin-top: var(--s-xs); }
        .defense-warning {
          display: flex; align-items: center; gap: 6px; width: 100%;
          font-size: 0.78rem; color: #f59e0b; background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3); border-radius: var(--r-sm);
          padding: 4px 8px;
        }

        /* Dropzone */
        .build-dropzone {
          min-height: 70px; border: 2px dashed var(--c-border); border-radius: var(--r-md);
          padding: var(--s-sm); display: flex; flex-wrap: wrap; gap: var(--s-xs);
          align-items: flex-start; transition: all var(--t-fast);
        }
        .build-dropzone--active { border-color: var(--c-primary); background: var(--c-primary-muted); }
        .dropzone-placeholder { color: var(--c-text-muted); font-size: 0.82rem; font-style: italic; }

        /* Applied modifiers */
        .applied-mod {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 8px; border-radius: var(--r-full);
          background: rgba(74, 222, 128, 0.12); border: 1px solid rgba(74, 222, 128, 0.3);
          font-size: 0.78rem;
        }
        .applied-mod--flaw { background: rgba(248, 113, 113, 0.12); border-color: rgba(248, 113, 113, 0.3); }
        .applied-mod--specific { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.35); }
        .applied-mod-name { font-weight: 600; }
        .applied-mod-ranks {
          width: 28px; text-align: center; background: var(--c-bg);
          border: 1px solid var(--c-border); border-radius: var(--r-sm);
          color: var(--c-text); font-size: 0.72rem; padding: 1px;
        }
        .applied-mod-option {
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); color: var(--c-text);
          font-size: 0.72rem; padding: 1px 4px; cursor: pointer;
          max-width: 90px;
        }
        .applied-mod-cost { font-size: 0.68rem; color: var(--c-text-muted); }
        .applied-mod-overlimit { font-size: 0.72rem; cursor: help; }
        .applied-mod-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; transition: color var(--t-fast);
        }
        .applied-mod-remove:hover { color: var(--c-error); }

        /* Alternate Effects */
        .alt-effect-card {
          background: var(--c-surface-elevated); border: 1px solid var(--c-border);
          border-radius: var(--r-sm); padding: var(--s-sm); margin-bottom: var(--s-xs);
        }
        .alt-effect-row { display: flex; gap: var(--s-sm); align-items: center; flex-wrap: wrap; }
        .alt-dynamic-label {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.78rem; color: var(--c-accent); cursor: pointer;
        }
        .alt-remove {
          background: transparent; border: none; color: var(--c-text-muted);
          cursor: pointer; display: flex; transition: color var(--t-fast);
        }
        .alt-remove:hover { color: var(--c-error); }

        /* Footer */
        .builder-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface); border-top: 1px solid var(--c-border);
        }
        .cost-breakdown { display: flex; align-items: center; gap: var(--s-md); flex-wrap: wrap; }
        .cost-comp-item { display: flex; align-items: center; gap: 6px; }
        .cost-comp-name { font-size: 0.8rem; color: var(--c-text-secondary); }
        .cost-comp-val { font-size: 0.8rem; font-weight: 700; color: var(--c-primary); }
        .cost-total { display: flex; align-items: center; gap: var(--s-sm); }
        .cost-total-label { font-size: 0.9rem; font-weight: 600; }
        .cost-total-value { font-family: var(--f-heading); font-size: 1.4rem; font-weight: 800; color: var(--c-primary); }

        /* Drag ghost */
        .drag-ghost {
          display: flex; align-items: center; gap: var(--s-sm);
          padding: 6px 14px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-text-inverse);
          font-size: 0.82rem; font-weight: 600; box-shadow: var(--shadow-lg);
          opacity: 0.9;
        }
        .drag-ghost-cost { font-size: 0.7rem; opacity: 0.8; }

        /* Effect modal */
        .effect-modal-content { display: flex; flex-direction: column; gap: var(--s-md); }
        .effect-modal-meta { display: flex; gap: var(--s-xs); flex-wrap: wrap; align-items: center; }
        .effect-modal-desc { font-size: 0.88rem; line-height: 1.6; color: var(--c-text); }
      `}</style>
    </div>
  );
}

// ── Effect Combobox ──
function EffectCombobox({
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
}: {
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
}) {
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
    </div>
  );
}
