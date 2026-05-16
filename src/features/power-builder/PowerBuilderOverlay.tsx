import { useState, useMemo, useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import type {
  ICharacterPower,
  IModifierDef,
  ICharacterPowerComponent,
  IPowerEffect,
} from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { EffectPalette } from './EffectPalette';
import { AltEffectCard } from './AltEffectCard';
import { useAlternateEffects } from './hooks/useAlternateEffects';
import { usePowerDragAndDrop } from './hooks/usePowerDragAndDrop';
import { usePowerCostCalculation } from './hooks/usePowerCostCalculation';
import { ModifierDropzone } from './components/ModifierDropzone';
import { MobileModifierDrawer } from './components/MobileModifierDrawer';
import { ModifierDrawerFAB } from './components/ModifierDrawerFAB';
import { useMobileDrawer } from './hooks/useMobileDrawer';
import { X, Save, Plus, Zap, Info, AlertTriangle, Shield } from 'lucide-react';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../shared/ui/Modal';
import { NumberInput } from '../../shared/ui/NumberInput';
import { Button } from '../../shared/ui/Button';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import { DEFAULT_VALIDATION_RULES } from '../../shared/lib/validationRules';
import { EffectCombobox } from '../../shared/ui/EffectCombobox';
import { VariableCostSelector } from './components/VariableCostSelector';
import { ConfigurableFieldSelector } from './components/ConfigurableFieldSelector';
import { validatePowerForSave } from '../../shared/lib/semanticValidation';

interface Props {
  existingPower?: ICharacterPower;
  onSave: (power: ICharacterPower) => void;
  onClose: () => void;
  /** When true, hides the Removable modifier from the palette and badge UI. */
  equipmentMode?: boolean;
}

export function PowerBuilderOverlay({ existingPower, onSave, onClose, equipmentMode }: Props) {
  const { t } = useTranslation();
  const powerDefs = useLocalizedData(POWER_DEFS) as IPowerEffect[];
  const modifierDefs = useLocalizedData(MODIFIER_DEFS) as IModifierDef[];

  // Read character and validation rules from stores
  const character = useCharStore((s) => s.character);
  const powerLevel = character.header.powerLevel;
  const validationRules = useAppStore((s) => s.validationRules) ?? DEFAULT_VALIDATION_RULES;

  // Build initial state — if existing power has legacy format, migration handles it at store level
  const [power, setPower] = useState<ICharacterPower>(
    existingPower ?? {
      id: uuidv4(),
      name: '',
      components: [{ id: uuidv4(), effectId: '', ranks: 1, modifiers: [], fieldValues: {} }],
      notes: '',
      alternateEffects: [],
    }
  );

  const [paletteFilter, setPaletteFilter] = useState('');
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string>(
    power.components[0]?.id ?? ''
  );

  const [effectModalPower, setEffectModalPower] = useState<IPowerEffect | null>(null);
  // AE state: which AE card is expanded + which component within each AE is active
  const [expandedAEId, setExpandedAEId] = useState<string | null>(null);
  const [activeAEComponentId, setActiveAEComponentId] = useState<Record<string, string>>({});

  // Mobile drawer state
  const { isOpen: drawerOpen, height: drawerHeight, openDrawer, closeDrawer, setHeight: setDrawerHeight } = useMobileDrawer();

  // All modifier defs (general + power-specific merged for lookup)
  // Includes extras/flaws from AE components so the palette is correct
  // when editing an AE with a different effect than the main power.
  const allModDefs = useMemo(() => {
    const specificMods: IModifierDef[] = [];
    // Main power components
    power.components.forEach((comp) => {
      const effect = powerDefs.find((d) => d.id === comp.effectId);
      if (effect) specificMods.push(...(effect.extras || []), ...(effect.flaws || []));
    });
    // AE components (critical: different effects may have different specific mods)
    power.alternateEffects.forEach((ae) => {
      ae.components.forEach((comp) => {
        const effect = powerDefs.find((d) => d.id === comp.effectId);
        if (effect) specificMods.push(...(effect.extras || []), ...(effect.flaws || []));
      });
    });
    const seen = new Set<string>();
    return [...modifierDefs, ...specificMods].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [modifierDefs, power.components, power.alternateEffects, powerDefs]);

  // Detect modifier incompatibilities for all components
  const modifierIncompatibilities = useMemo(() => {
    const incompatibilities: Record<string, string[]> = {};
    
    // Check main power components
    power.components.forEach((comp) => {
      const appliedModIds = comp.modifiers.map((m) => m.modifierId);
      comp.modifiers.forEach((applied) => {
        const def = allModDefs.find((d) => d.id === applied.modifierId);
        if (!def || !def.incompatibleWith || def.incompatibleWith.length === 0) return;
        
        const conflicts = def.incompatibleWith.filter((incompatId) =>
          appliedModIds.includes(incompatId)
        );
        
        if (conflicts.length > 0) {
          const key = `${comp.id}:${applied.modifierId}`;
          incompatibilities[key] = conflicts;
        }
      });
    });
    
    // Check AE components
    power.alternateEffects.forEach((ae) => {
      ae.components.forEach((comp) => {
        const appliedModIds = comp.modifiers.map((m) => m.modifierId);
        comp.modifiers.forEach((applied) => {
          const def = allModDefs.find((d) => d.id === applied.modifierId);
          if (!def || !def.incompatibleWith || def.incompatibleWith.length === 0) return;
          
          const conflicts = def.incompatibleWith.filter((incompatId) =>
            appliedModIds.includes(incompatId)
          );
          
          if (conflicts.length > 0) {
            const key = `${ae.id}:${comp.id}:${applied.modifierId}`;
            incompatibilities[key] = conflicts;
          }
        });
      });
    });
    
    return incompatibilities;
  }, [power.components, power.alternateEffects, allModDefs]);

  // Currently selected effect for the active component (used only in component cards)
  const activeComponent = power.components.find((c) => c.id === activeComponentId);

  // Use cost calculation hook
  const {
    componentCosts,
    mainCost,
    removableDiscount,
    totalCost,
    equipmentEPCost,
    aeCosts,
    aeValidations,
    plViolation,
  } = usePowerCostCalculation({
    power,
    powerDefs,
    allModDefs,
    powerLevel,
    validationRules,
    character,
  });

  // Palette context: when an AE is expanded, palette serves that AE's active component
  const paletteSelectedEffect = useMemo(() => {
    if (expandedAEId !== null) {
      const ae = power.alternateEffects.find((a) => a.id === expandedAEId);
      const compId = activeAEComponentId[expandedAEId] ?? ae?.components[0]?.id;
      const comp = ae?.components.find((c) => c.id === compId);
      return comp ? powerDefs.find((d) => d.id === comp.effectId) : undefined;
    }
    return activeComponent ? powerDefs.find((d) => d.id === activeComponent.effectId) : undefined;
  }, [expandedAEId, power.alternateEffects, activeAEComponentId, activeComponent, powerDefs]);

  const paletteContextName = useMemo(() => {
    if (expandedAEId === null) return null;
    const ae = power.alternateEffects.find((a) => a.id === expandedAEId);
    if (!ae) return null;
    const compId = activeAEComponentId[expandedAEId] ?? ae.components[0]?.id;
    const compIdx = ae.components.findIndex((c) => c.id === compId);
    return `${ae.name || 'AE'} · Comp. ${compIdx + 1}`;
  }, [expandedAEId, power.alternateEffects, activeAEComponentId]);

  // FAB context label for mobile
  const fabContextLabel = useMemo(() => {
    if (expandedAEId !== null) {
      const ae = power.alternateEffects.find((a) => a.id === expandedAEId);
      return ae?.name || 'AE';
    }
    const effect = paletteSelectedEffect;
    return effect?.name || 'Main';
  }, [expandedAEId, power.alternateEffects, paletteSelectedEffect]);

  // Define addModifierToComponent before using it in hooks
  const addModifierToComponent = useCallback(
    (componentId: string, modId: string, isPowerSpecific?: boolean) => {
      // Intercept 'removable' — it's a power-level flaw, not a component modifier
      // In equipment mode, removable is not available (EP system handles it)
      if (modId === 'removable') {
        if (equipmentMode) return; // Silently ignore in equipment mode
        // Toggle: if already removable, upgrade to easily_removable, then back to none
        setPower((p) => {
          const current = p.removable ?? 'none';
          const next = current === 'none' ? 'removable'
            : current === 'removable' ? 'easily_removable'
            : 'none';
          return { ...p, removable: next };
        });
        return;
      }

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
    [equipmentMode, powerDefs]
  );

  // ── AE CRUD — delegado ao hook useAlternateEffects ──
  const {
    addAlternateEffect,
    removeAlternateEffect,
    updateAlternateEffect,
    addAEComponent,
    removeAEComponent,
    updateAEComponent,
    addModifierToAEComponent,
    removeModifierFromAEComponent,
    updateAEModifierRanks,
    updateAEModifierOption,
    updateAEModifierOptions,
  } = useAlternateEffects({
    setPower,
    powerDefs,
    expandedAEId,
    setExpandedAEId,
    setActiveAEComponentId,
  });

  // Use drag-and-drop hook
  const { sensors, activeId, handleDragStart, handleDragEnd } = usePowerDragAndDrop({
    onDropToComponent: addModifierToComponent,
    onDropToAEComponent: addModifierToAEComponent,
  });

  function handleAddModifierFromPalette(modId: string, isPowerSpecific?: boolean) {
    // Intercept 'removable' — power-level flaw, not per-component
    // In equipment mode, removable is not available
    if (modId === 'removable') {
      if (equipmentMode) return; // Silently ignore in equipment mode
      setPower((p) => {
        const current = p.removable ?? 'none';
        const next = current === 'none' ? 'removable'
          : current === 'removable' ? 'easily_removable'
          : 'none';
        return { ...p, removable: next };
      });
      return;
    }

    // Palette serves the AE context when an AE card is expanded
    if (expandedAEId !== null) {
      const ae = power.alternateEffects.find((a) => a.id === expandedAEId);
      const compId = activeAEComponentId[expandedAEId] ?? ae?.components[0]?.id;
      if (!compId) return;
      addModifierToAEComponent(expandedAEId, compId, modId, isPowerSpecific);
      return;
    }
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

  function updateModifierOptions(componentId: string, modId: string, options: Record<string, boolean | number | string>) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, options } : m
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
      fieldValues: {},
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

  function handleSave() {
    // Filter out empty components (components without an effect selected)
    const validComponents = power.components.filter((c) => c.effectId !== '');
    
    // Check if there's at least one valid component
    if (validComponents.length === 0) {
      alert(t('builder.noEffectError'));
      return;
    }

    // Clean up alternate effects: remove empty components and empty AEs
    const cleanedAlternateEffects = power.alternateEffects
      .map((ae) => ({
        ...ae,
        components: ae.components.filter((c) => c.effectId !== ''),
      }))
      .filter((ae) => ae.components.length > 0);

    // Create cleaned power object
    const cleanPower: ICharacterPower = {
      ...power,
      components: validComponents,
      alternateEffects: cleanedAlternateEffects,
    };

    const saveIssues = validatePowerForSave(cleanPower, validationRules, {
      powerDefs,
      modifierDefs: allModDefs,
    }).filter((validationIssue) => validationIssue.severity === 'error');

    if (saveIssues.length > 0) {
      const firstIssue = saveIssues[0];
      alert(`${firstIssue.path}: ${firstIssue.message}`);
      return;
    }

    // Validate alternate effects against main cost
    const invalidAEs = aeValidations
      .map((v, i) => ({ ...v, ae: power.alternateEffects[i] }))
      .filter((v) => !v.valid && v.ae.components.some((c) => c.effectId !== ''));
    
    if (invalidAEs.length > 0) {
      const names = invalidAEs.map((v) => v.ae.name || 'sem nome').join(', ');
      const confirmed = window.confirm(
        `${invalidAEs.length} efeito(s) alternativo(s) excedem o limite de ${mainCost}PP: ${names}.\nSalvar mesmo assim?`
      );
      if (!confirmed) return;
    }

    onSave(cleanPower);
  }

  const activeMod = activeId ? allModDefs.find((m) => m.id === activeId) : null;
  const hasEffect = power.components.some((c) => c.effectId !== '');



  return (
    <div className="builder-overlay">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Top Bar */}
        <div className="builder-topbar">
          <h2 className="builder-topbar-title">
            <Zap size={18} /> {t('builder.title')}
          </h2>
          <div className="builder-topbar-actions">
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
          {/* Sidebar: Modifier Palette (Desktop) */}
          <div className="builder-palette-desktop">
            <EffectPalette
              filter={paletteFilter}
              onFilterChange={setPaletteFilter}
              selectedEffect={paletteSelectedEffect}
              onAddModifier={handleAddModifierFromPalette}
              collapsed={paletteCollapsed}
              onToggleCollapse={() => setPaletteCollapsed((v) => !v)}
              contextName={paletteContextName}
              equipmentMode={equipmentMode}
            />
          </div>

          {/* Main: Build Workspace */}
          <div className="builder-workspace">
            {/* Power Name + Removable badge */}
            <div className="build-section">
              <label className="build-label">{t('builder.powerName')}</label>
              <div className="build-name-row">
                <input
                  className="build-input"
                  value={power.name}
                  onChange={(e) => setPower((p) => ({ ...p, name: e.target.value }))}
                  placeholder={t('builder.powerNamePlaceholder')}
                />
                {!equipmentMode && (power.removable === 'removable' || power.removable === 'easily_removable') && (
                  <span
                    className="build-removable-badge"
                    title={t(`builder.removable.${power.removable}_hint`)}
                    onClick={() => {
                      // Click cycles: removable → easily_removable → none
                      setPower((p) => ({
                        ...p,
                        removable: p.removable === 'removable' ? 'easily_removable' : 'none',
                      }));
                    }}
                  >
                    <Shield size={12} />
                    {t(`builder.removable.${power.removable}`)}
                    <button
                      className="build-removable-badge-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPower((p) => ({ ...p, removable: 'none' }));
                      }}
                      title={t('builder.removable.remove')}
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
              {!equipmentMode && removableDiscount > 0 && (
                <span className="build-removable-discount">
                  −{removableDiscount} PP {t('builder.removable.from')} {mainCost} PP
                </span>
              )}
            </div>

            {/* Power Descriptors */}
            <div className="build-section">
              <label className="build-label">{t('builder.descriptors')}</label>
              <div className="build-descriptors">
                <input
                  className="build-input"
                  value={(power.descriptors || []).join(', ')}
                  onChange={(e) => {
                    const descriptors = e.target.value
                      .split(',')
                      .map((d) => d.trim())
                      .filter((d) => d.length > 0);
                    setPower((p) => ({ ...p, descriptors }));
                  }}
                  placeholder={t('builder.descriptorsPlaceholder')}
                />
              </div>
              {power.descriptors && power.descriptors.length > 0 && (
                <div className="build-descriptor-tags">
                  {power.descriptors.map((desc, idx) => (
                    <span key={idx} className="build-descriptor-tag">
                      {desc}
                      <button
                        className="build-descriptor-tag-remove"
                        onClick={() => {
                          setPower((p) => ({
                            ...p,
                            descriptors: (p.descriptors || []).filter((_, i) => i !== idx),
                          }));
                        }}
                        title={t('builder.removeDescriptor')}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                        {idx === 0 ? t('builder.mainEffect') : t('builder.effectN', { n: idx + 1 })}
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
                          onChange={(effectId) => updateComponent(comp.id, {
                            effectId,
                            variableCostOption: undefined,
                            fieldValues: {},
                          })}
                          allEffects={powerDefs}
                          t={t}
                          onInfo={(e) => setEffectModalPower(e)}
                        />
                      </div>
                      <div className="build-section">
                        <label className="build-label">{t('builder.ranks')}</label>
                        <NumberInput
                          variant="small"
                          className="build-input build-input--small"
                          value={comp.ranks}
                          onChange={(value) =>
                            updateComponent(comp.id, {
                              ranks: Math.max(1, value),
                            })
                          }
                          onClick={(e) => e.stopPropagation()}
                          min={1}
                        />
                      </div>
                    </div>

                    {effectDef?.variableCost && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <VariableCostSelector
                          options={effectDef.variableCost.options}
                          selected={comp.variableCostOption}
                          onChange={(optionName) => updateComponent(comp.id, { variableCostOption: optionName })}
                          t={t}
                          name={`variable-cost-${comp.id}`}
                        />
                      </div>
                    )}

                    {effectDef?.configurableFields && effectDef.configurableFields.length > 0 && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <ConfigurableFieldSelector
                          fields={effectDef.configurableFields}
                          values={comp.fieldValues || {}}
                          onChange={(fieldId, value) => updateComponent(comp.id, {
                            fieldValues: { ...(comp.fieldValues || {}), [fieldId]: value },
                          })}
                          t={t}
                        />
                      </div>
                    )}

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

                          // Check for incompatibilities
                          const incompatKey = `${comp.id}:${applied.modifierId}`;
                          const conflicts = modifierIncompatibilities[incompatKey] || [];
                          const hasIncompatibility = conflicts.length > 0;

                          return (
                            <div
                              key={applied.modifierId}
                              className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''} ${applied.isPowerSpecific ? 'applied-mod--specific' : ''} ${hasIncompatibility ? 'applied-mod--incompatible' : ''}`}
                            >
                              <span className="applied-mod-name">{def.name}</span>
                              {def.costType !== 'per_rank' && (
                                <NumberInput
                                  variant="small"
                                  className="applied-mod-ranks"
                                  value={applied.ranks}
                                  onChange={(value) =>
                                    updateModifierRanks(
                                      comp.id,
                                      applied.modifierId,
                                      value
                                    )
                                  }
                                  min={1}
                                  max={def.maxRanks ?? undefined}
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
                              {/* Conditional checkbox for Affects Objects */}
                              {def.id === 'affects_objects' && (
                                <label className="applied-mod-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={applied.options?.affectsOnlyObjects === true}
                                    onChange={(e) => {
                                      const newOptions = {
                                        ...applied.options,
                                        affectsOnlyObjects: e.target.checked,
                                      };
                                      updateModifierOptions(comp.id, applied.modifierId, newOptions);
                                    }}
                                  />
                                  {t('builder.affectsOnlyObjects')}
                                </label>
                              )}
                              {/* Subtype selector for modifiers with variable cost (e.g. Alternate Resistance) */}
                              {def.subtypes && def.subtypes.length > 0 && (
                                <select
                                  className="applied-mod-subtype"
                                  value={(applied.options?.subtypeId as string) ?? ''}
                                  onChange={(e) => {
                                    updateModifierOptions(comp.id, applied.modifierId, {
                                      ...applied.options,
                                      subtypeId: e.target.value,
                                    });
                                  }}
                                  title={t('builder.subtypeLabel')}
                                >
                                  <option value="">{t('builder.subtypeNone')}</option>
                                  {def.subtypes.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                      {sub.label} (+{sub.costValue}/rank)
                                    </option>
                                  ))}
                                </select>
                              )}
                              <span className="applied-mod-cost">
                                {(() => {
                                  // Show effective cost, accounting for active subtype
                                  if (def.costType === 'per_rank') {
                                    let effectiveCost = def.costValue;
                                    if (def.subtypes && def.subtypes.length > 0) {
                                      const sid = applied.options?.subtypeId as string | undefined;
                                      const sub = sid ? def.subtypes.find((s) => s.id === sid) : undefined;
                                      if (sub) effectiveCost = sub.costValue;
                                    }
                                    if (def.id === 'affects_objects') {
                                      effectiveCost = applied.options?.affectsOnlyObjects === true ? 0 : 1;
                                    }
                                    return `${effectiveCost >= 0 ? '+' : ''}${effectiveCost}/rank`;
                                  }
                                  if (modCostPP !== null) {
                                    return `${modCostPP > 0 ? '+' : ''}${modCostPP}pp`;
                                  }
                                  return '';
                                })()}
                              </span>
                              {overPL && (
                                <span className="applied-mod-overlimit" title={t('builder.plWarning')}>
                                  ⚠️
                                </span>
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

            {/* Alternate Effects Section */}
            <div className="build-section ae-section">
              <div className="ae-section-header">
                <label className="build-label">{t('builder.alternateEffects')}</label>
                {mainCost > 0 && (
                  <span className="ae-cap-badge">Cap: {mainCost}pp</span>
                )}
              </div>
              {mainCost > 0 && (
                <div className="ae-rules-note">
                  <Info size={11} /> {t('builder.altRuleNote')}
                </div>
              )}
              {power.alternateEffects.map((ae, aeIdx) => (
                <AltEffectCard
                  key={ae.id}
                  ae={ae}
                  aeIdx={aeIdx}
                  cost={aeCosts[aeIdx] ?? 0}
                  validation={aeValidations[aeIdx] ?? { valid: true, overageBy: 0 }}
                  isExpanded={expandedAEId === ae.id}
                  onToggleExpand={() => setExpandedAEId((prev) => prev === ae.id ? null : ae.id)}
                  activeCompId={activeAEComponentId[ae.id] ?? ae.components[0]?.id ?? ''}
                  onSetActiveComp={(compId) => setActiveAEComponentId((prev) => ({ ...prev, [ae.id]: compId }))}
                  allEffects={powerDefs}
                  allModDefs={allModDefs}
                  modifierIncompatibilities={modifierIncompatibilities}

                  activeId={activeId}
                  onUpdateAE={(update) => updateAlternateEffect(ae.id, update)}
                  onRemoveAE={() => removeAlternateEffect(ae.id)}
                  onAddComponent={() => addAEComponent(ae.id)}
                  onRemoveComponent={(cId) => removeAEComponent(ae.id, cId)}
                  onUpdateComponent={(cId, upd) => updateAEComponent(ae.id, cId, upd)}
                  onAddModifier={(cId, modId, sp) => addModifierToAEComponent(ae.id, cId, modId, sp)}
                  onRemoveModifier={(cId, modId) => removeModifierFromAEComponent(ae.id, cId, modId)}
                  onUpdateModifierRanks={(cId, modId, ranks) => updateAEModifierRanks(ae.id, cId, modId, ranks)}
                  onUpdateModifierOption={(cId, modId, opt) => updateAEModifierOption(ae.id, cId, modId, opt)}
                  onUpdateModifierOptions={(cId, modId, opts) => updateAEModifierOptions(ae.id, cId, modId, opts)}
                  onInfoClick={setEffectModalPower}
                  t={t}
                />
              ))}
              <Button variant="secondary" size="sm" onClick={addAlternateEffect}>
                <Plus size={13} /> {t('builder.addAlternate')}
              </Button>
            </div>
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
            {power.alternateEffects.map((ae, aeIdx) => {
              const cost = aeCosts[aeIdx] ?? 0;
              const valid = aeValidations[aeIdx]?.valid ?? true;
              if (!ae.components.some((c) => c.effectId)) return null;
              return (
                <span key={ae.id} className="cost-comp-item">
                  <span className="cost-comp-name">↪ {ae.name || 'AE'}</span>
                  <span className={`cost-comp-val ${valid ? '' : 'cost-comp-val--invalid'}`}>
                    {cost}pp {valid ? '✅' : '⚠️'}
                  </span>
                </span>
              );
            })}
          </div>
          <div className="cost-total">
            {!equipmentMode && removableDiscount > 0 && (
              <span className="cost-removable-line">
                {t(`builder.removable.${power.removable ?? 'none'}`)} −{removableDiscount} PP
              </span>
            )}
            <span className="cost-total-label">{equipmentMode ? t('builder.totalEP') || 'Total EP:' : t('builder.total') + ':'}</span>
            <span className="cost-total-value">{equipmentMode ? equipmentEPCost : totalCost} {equipmentMode ? 'EP' : t('common.pp')}</span>
          </div>
          {plViolation && (
            <div className="pl-violation-banner">
              <AlertTriangle size={13} />
              <span>{t('validation.attackDamage')} — {plViolation.formula} (max {plViolation.limit})</span>
            </div>
          )}
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

        {/* Mobile Modifier Drawer */}
        <MobileModifierDrawer
          isOpen={drawerOpen}
          height={drawerHeight}
          onHeightChange={setDrawerHeight}
          onClose={closeDrawer}
        >
          <EffectPalette
            filter={paletteFilter}
            onFilterChange={setPaletteFilter}
            selectedEffect={paletteSelectedEffect}
            onAddModifier={handleAddModifierFromPalette}
            collapsed={false}
            onToggleCollapse={() => {}}
            contextName={paletteContextName}
            equipmentMode={equipmentMode}
          />
        </MobileModifierDrawer>

        {/* Mobile FAB */}
        <ModifierDrawerFAB
          onClick={() => openDrawer('peek')}
          contextLabel={fabContextLabel}
          isAE={expandedAEId !== null}
        />
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

        /* Removable badge — F-06 */
        .build-name-row { display: flex; gap: var(--s-sm); align-items: center; }
        .build-name-row .build-input { flex: 1; }
        .build-removable-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; background: var(--c-warning-bg, rgba(251, 191, 36, 0.15));
          border: 1px solid var(--c-warning, #f59e0b); border-radius: var(--r-full);
          color: var(--c-warning, #f59e0b); font-size: 0.72rem; font-weight: 600;
          cursor: pointer; white-space: nowrap; user-select: none;
          transition: all var(--t-fast);
        }
        .build-removable-badge:hover { background: var(--c-warning-bg, rgba(251, 191, 36, 0.25)); }
        .build-removable-badge-remove {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; border: none; color: inherit;
          cursor: pointer; padding: 0; margin-left: 2px; opacity: 0.6;
          transition: opacity var(--t-fast);
        }
        .build-removable-badge-remove:hover { opacity: 1; }
        .build-removable-discount {
          font-size: 0.78rem; color: var(--c-success, #4ade80); font-weight: 600;
          background: rgba(74, 222, 128, 0.1); padding: 2px 8px;
          border-radius: var(--r-full); border: 1px solid rgba(74, 222, 128, 0.3);
          margin-top: var(--s-xs);
        }

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
        .applied-mod--incompatible { 
          background: rgba(239, 68, 68, 0.15); 
          border-color: rgba(239, 68, 68, 0.5);
          animation: pulse-warning 2s ease-in-out infinite;
        }
        @keyframes pulse-warning {
          0%, 100% { border-color: rgba(239, 68, 68, 0.5); }
          50% { border-color: rgba(239, 68, 68, 0.8); }
        }
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
        .applied-mod-subtype {
          background: var(--c-bg); border: 1px solid var(--c-primary);
          border-radius: var(--r-sm); color: var(--c-text);
          font-size: 0.72rem; padding: 1px 4px; cursor: pointer;
          max-width: 140px;
        }
        .applied-mod-cost { font-size: 0.68rem; color: var(--c-text-muted); }
        .applied-mod-overlimit { font-size: 0.72rem; cursor: help; }
        .applied-mod-incompatible-warning {
          display: flex; align-items: center;
          color: var(--c-error);
          cursor: help;
          animation: pulse-icon 2s ease-in-out infinite;
        }
        @keyframes pulse-icon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
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
        .cost-total { display: flex; align-items: center; gap: var(--s-sm); flex-wrap: wrap; }
        .cost-total-label { font-size: 0.9rem; font-weight: 600; }
        .cost-total-value { font-family: var(--f-heading); font-size: 1.4rem; font-weight: 800; color: var(--c-primary); }
        .cost-removable-line {
          font-size: 0.78rem; color: var(--c-success, #4ade80); font-weight: 600;
          background: rgba(74, 222, 128, 0.1); padding: 2px 8px;
          border-radius: var(--r-full); border: 1px solid rgba(74, 222, 128, 0.3);
        }
        .pl-violation-banner { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--c-error); background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.3); border-radius: var(--r-sm); padding: 5px 10px; margin-top: 4px; width: 100%; }

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

        /* Desktop: Show palette sidebar, hide mobile drawer */
        .builder-palette-desktop {
          display: flex;
        }

        /* Mobile touch targets and layout */
        @media (max-width: 768px) {
          .builder-action-btn {
            min-height: var(--touch-target-min);
            padding: var(--s-sm) var(--s-md);
          }
          .build-add-comp-btn {
            min-height: var(--touch-target-min);
            padding: var(--s-sm) var(--s-md);
          }
          .component-card-remove,
          .applied-mod-remove,
          .alt-remove {
            min-width: var(--touch-target-min);
            min-height: var(--touch-target-min);
            padding: var(--s-sm);
          }

          /* Mobile layout optimizations */
          .builder-body {
            flex-direction: column;
          }
          
          /* Hide desktop palette, show mobile drawer instead */
          .builder-palette-desktop {
            display: none;
          }
          
          .builder-workspace {
            width: 100%;
            height: 100%;
          }
          .builder-topbar {
            padding: var(--s-sm) var(--s-md);
          }
          .builder-topbar-title {
            font-size: 0.9rem;
          }
          .builder-footer {
            flex-direction: column;
            gap: var(--s-sm);
            align-items: flex-start;
          }
          .cost-breakdown {
            width: 100%;
            flex-wrap: wrap;
          }
          .cost-total {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}


