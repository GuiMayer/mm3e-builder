import { ModifierDefinitionNotice } from '../../shared/ui/ModifierDefinitionNotice';
import { AfflictionConditionsEditor } from './components/AfflictionConditionsEditor';
import { EnhancedTargetEditor } from './components/EnhancedTargetEditor';
import { formatDiagnostic } from '../../shared/lib/formatDiagnostic';
import { InfoDialog } from '../../shared/ui/InfoDialog';
import { getResourceCharacter, getResourceAttackBonus, type ResourceBuilderContext } from '../../shared/lib/resourceContext';
import { getResourcePowerWarnings } from '../../shared/lib/resourceWarnings';
import { lazy, Suspense, useState, useMemo, useCallback, useId, useRef } from 'react';
import { DndContext, DragOverlay, type Announcements } from '@dnd-kit/core';
import type {
  ICharacterPower,
  IModifierDef,
  ICharacterPowerComponent,
  IPowerEffect,
} from '../../entities/types';
import { getCharacterStrength, getComponentEffectRanks } from '../../shared/lib/componentRanks';
import { SKILL_DEFS, POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { EffectPalette } from './EffectPalette';
import { AltEffectCard } from './AltEffectCard';
import { useAlternateEffects } from './hooks/useAlternateEffects';
import { usePowerDragAndDrop } from './hooks/usePowerDragAndDrop';
import { usePowerCostCalculation } from './hooks/usePowerCostCalculation';
import { ModifierDropzone } from './components/ModifierDropzone';
import { MobileModifierDrawer } from './components/MobileModifierDrawer';
import { ModifierDrawerFAB } from './components/ModifierDrawerFAB';
import { createId } from '../../shared/lib/identity';
import { useMobileDrawer } from './hooks/useMobileDrawer';
import { useDialogFocus } from '../../shared/hooks/useDialogFocus';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { X, Save, Plus, Zap, Info, AlertTriangle, Shield } from 'lucide-react';
import { useLocalizedData } from '../../shared/hooks/useLocalizedData';
import { useTranslation } from 'react-i18next';
import { NumberInput } from '../../shared/ui/NumberInput';
import { Button } from '../../shared/ui/Button';
import { useAppDialog } from '../../shared/ui/appDialogContext';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { useCharactersStore } from '../../store/charactersStore';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { BudgetPreview } from './components/BudgetPreview';
import type { BudgetEditTarget } from './budgetProjection';
import { useAppStore } from '../../store/appStore';
import { DEFAULT_VALIDATION_RULES } from '../../shared/lib/validationRules';
import { EffectCombobox } from '../../shared/ui/EffectCombobox';
import { VariableCostSelector } from './components/VariableCostSelector';
import { ConfigurableFieldSelector } from './components/ConfigurableFieldSelector';
import { SenseTraitsEditor } from './components/SenseTraitsEditor';
import { ModifierParameterControls } from './components/ModifierParameterControls';
import { EffectReference } from './components/EffectReference';
import { PowerNotesTextarea } from './components/PowerNotesTextarea';
import { PowerLibraryButton } from '../power-library/PowerLibraryButton';
import type { PowerLibraryTarget } from '../power-library/types';
import { applyPowerTemplate } from '../power-library/powerTemplateApplication';
import { validatePowerForSave } from '../../shared/lib/semanticValidation';
import { addComponentModifier } from './modifierApplication';
import { modifierInstanceKey, removeComponentModifier, updateComponentModifier } from './modifierInstances';
import { getBlockingPowerSaveIssues } from './powerSavePolicy';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';
import {
  collectModifierDefinitions,
  createPowerDraft,
  findModifierIncompatibilities,
  getPaletteContext,
  applyDescriptor,
  hasDuplicateDescriptor,
  normalizeDescriptor,
} from './powerBuilderModel';

interface Props {
  initialComponentId?: string;
  isNewPower?: boolean;
  existingPower?: ICharacterPower;
  sourceCharacterId?: string | null;
  onSave: (power: ICharacterPower) => void;
  onClose: () => void;
  /** When true, hides the Removable modifier from the palette and badge UI. */
  equipmentMode?: boolean;
  resourceContext?: ResourceBuilderContext;
  saveError?: string | null;
  /** Authoring a reusable composition without writing to a character. */
  templateMode?: boolean;
}

const PowerLibraryDialog = lazy(() => import('../power-library/PowerLibraryDialog').then(module => ({ default: module.PowerLibraryDialog })));

export function PowerBuilderOverlay({ existingPower, initialComponentId, isNewPower, sourceCharacterId, onSave, onClose, equipmentMode, resourceContext, saveError, templateMode }: Props) {
  const associationReviewIds = useMemo(() => {
    const components = !isNewPower && existingPower
      ? [...existingPower.components, ...existingPower.alternateEffects.flatMap(alternate => alternate.components)]
      : [];
    return new Set(components
      .filter(component => component.effectId === 'enhanced-trait' && !component.enhancedTarget)
      .map(component => component.id));
  }, [existingPower, isNewPower]);
  const { t, i18n } = useTranslation();
  const dialog = useAppDialog();
  const isMobile = useIsMobile();
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const powerDefs = useLocalizedData(POWER_DEFS) as IPowerEffect[];
  const modifierDefs = useLocalizedData(MODIFIER_DEFS) as IModifierDef[];

  // Read character and validation rules from stores
  const active = useActiveCharacter();
  const [originId] = useState(() => sourceCharacterId ?? active.characterId);
  const origin = useCharactersStore(state => state.tabs.find(tab => tab.id === originId)?.character);
  const [initialCharacter] = useState(() => templateMode ? createDefaultCharacter() : active.character);
  const activeCharacter = templateMode ? initialCharacter : origin ?? initialCharacter;
  const budgetTarget = useMemo<BudgetEditTarget>(() => resourceContext
    ? { kind: 'resource', target: { resourceId: resourceContext.resource.id, kind: resourceContext.kind, powerId: resourceContext.effectId } }
    : { kind: equipmentMode ? 'equipment' : 'power', powerId: isNewPower ? undefined : existingPower?.id }, [resourceContext, equipmentMode, existingPower?.id, isNewPower]);
  const character = useMemo(() => resourceContext ? getResourceCharacter(activeCharacter, resourceContext.resource) : activeCharacter, [activeCharacter, resourceContext]);
  const powerLevel = character.header.powerLevel;
  const isHQEffect = resourceContext?.kind === 'headquarters-effect';
  const costUnit = equipmentMode && !isHQEffect ? 'EP' : 'PP';
  const validationRules = useAppStore((s) => s.validationRules) ?? DEFAULT_VALIDATION_RULES;

  // Build initial state — if existing power has legacy format, migration handles it at store level
  const [power, setPower] = useState<ICharacterPower>(() =>
    createPowerDraft(existingPower)
  );
  const [descriptorInput, setDescriptorInput] = useState('');
  const [selectedDescriptorIndex, setSelectedDescriptorIndex] = useState<number | null>(null);
  const descriptorInputRef = useRef<HTMLInputElement>(null);

  const [paletteFilter, setPaletteFilter] = useState('');
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string>(
    power.components.find(component => component.id === initialComponentId)?.id ?? power.components[0]?.id ?? ''
  );

  const [effectModalPower, setEffectModalPower] = useState<IPowerEffect | null>(null);
  const [libraryTarget, setLibraryTarget] = useState<PowerLibraryTarget | null>(null);
  // AE state: which AE card is expanded + which component within each AE is active
  const [expandedAEId, setExpandedAEId] = useState<string | null>(() => power.alternateEffects.find(alternate => alternate.components.some(component => component.id === initialComponentId))?.id ?? null);
  const [activeAEComponentId, setActiveAEComponentId] = useState<Record<string, string>>(() => {
    const alternate = power.alternateEffects.find(item => item.components.some(component => component.id === initialComponentId));
    return alternate && initialComponentId ? { [alternate.id]: initialComponentId } : {};
  });

  const descriptors = power.descriptors ?? [];
  const normalizedDescriptorInput = normalizeDescriptor(descriptorInput);
  const hasDescriptorConflict = hasDuplicateDescriptor(
    descriptors,
    normalizedDescriptorInput,
    selectedDescriptorIndex
  );
  const canApplyDescriptor = Boolean(normalizedDescriptorInput) && !hasDescriptorConflict;

  function focusDescriptorInput(selectText = false) {
    requestAnimationFrame(() => {
      descriptorInputRef.current?.focus();
      if (selectText) descriptorInputRef.current?.select();
    });
  }

  function selectDescriptor(index: number) {
    setSelectedDescriptorIndex(index);
    setDescriptorInput(descriptors[index] ?? '');
    focusDescriptorInput(true);
  }

  function applyCurrentDescriptor() {
    if (!canApplyDescriptor) return;

    setPower((current) => ({
      ...current,
      descriptors: applyDescriptor(
        current.descriptors ?? [],
        descriptorInput,
        selectedDescriptorIndex
      ),
    }));
    setDescriptorInput('');
    setSelectedDescriptorIndex(null);
    focusDescriptorInput();
  }

  function removeDescriptor(index: number) {
    setPower((current) => ({
      ...current,
      descriptors: (current.descriptors ?? []).filter((_, descriptorIndex) => descriptorIndex !== index),
    }));

    if (selectedDescriptorIndex === index) {
      setSelectedDescriptorIndex(null);
      setDescriptorInput('');
      focusDescriptorInput();
    } else if (selectedDescriptorIndex !== null && selectedDescriptorIndex > index) {
      setSelectedDescriptorIndex(selectedDescriptorIndex - 1);
    }
  }

  // Mobile drawer state
  const { isOpen: drawerOpen, height: drawerHeight, openDrawer, closeDrawer, setHeight: setDrawerHeight } = useMobileDrawer();

  // All modifier defs (general + power-specific merged for lookup)
  // Includes extras/flaws from AE components so the palette is correct
  // when editing an AE with a different effect than the main power.
  const allModDefs = useMemo(
    () => collectModifierDefinitions(power, powerDefs, modifierDefs),
    [modifierDefs, power, powerDefs]
  );

  // Detect modifier incompatibilities for all components
  const modifierIncompatibilities = useMemo(
    () => findModifierIncompatibilities(power, powerDefs, modifierDefs),
    [power, powerDefs, modifierDefs]
  );

  // Use cost calculation hook
  const {
    componentCosts,
    mainCost,
    arrayCost,
    activationDiscount,
    removableDiscount,
    totalCost,
    equipmentEPCost,
    aeCosts,
    aeValidations,
    plViolation,
    pricingDiagnostics,
  } = usePowerCostCalculation({
    power,
    powerDefs,
    modifierDefs,
    powerLevel,
    validationRules,
    character,
    attackBonusOverride: resourceContext ? getResourceAttackBonus(resourceContext.resource, power) : undefined,
  });

  const semanticWarnings = useMemo(
    () => validatePowerForSave(power, validationRules, {
      powerDefs,
      modifierDefs,
      character,
      skillDefs: SKILL_DEFS,
      language: i18n.language,
    }).filter((validationIssue) => validationIssue.severity === 'warning'),
    [modifierDefs, power, powerDefs, validationRules, character, i18n.language]
  );
  const resourceWarnings = resourceContext ? getResourcePowerWarnings(resourceContext.resource, power, character, powerDefs, allModDefs) : [];

  // Palette context: when an AE is expanded, palette serves that AE's active component
  const paletteContext = useMemo(
    () =>
      getPaletteContext(
        power,
        powerDefs,
        activeComponentId,
        expandedAEId,
        activeAEComponentId
      ),
    [power, powerDefs, activeComponentId, expandedAEId, activeAEComponentId]
  );
  const paletteSelectedEffect = paletteContext.selectedEffect;

  const paletteContextName = useMemo(() => {
    if (expandedAEId === null) return null;
    const ae = power.alternateEffects.find((a) => a.id === expandedAEId);
    if (!ae) return null;
    const compId = activeAEComponentId[expandedAEId] ?? ae.components[0]?.id;
    const compIdx = ae.components.findIndex((c) => c.id === compId);
    return `${ae.name || 'AE'} · Comp. ${compIdx + 1}`;
  }, [expandedAEId, power.alternateEffects, activeAEComponentId]);

  const togglePalette = useCallback(() => setPaletteCollapsed((value) => !value), []);

  // Selected target for the mobile palette action
  const fabContextLabel = paletteContext.fabLabel;

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

      setPower((p) => ({
        ...p,
        components: p.components.map(comp => comp.id === componentId
          ? addComponentModifier(comp, powerDefs.find(effect => effect.id === comp.effectId), modifierDefs, modId, isPowerSpecific)
          : comp),
      }));
    },
    [equipmentMode, modifierDefs, powerDefs]
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
    modifierDefs,
    expandedAEId,
    setExpandedAEId,
    setActiveAEComponentId,
  });

  // Use drag-and-drop hook
  const { sensors, activeId, activeDrag, collisionDetection, handleDragStart, handleDragEnd, handleDragCancel } = usePowerDragAndDrop({
    powerDefs, modifierDefs,
    onDropToComponent: (id, modifierId, specific) => {
      setActiveComponentId(id); setExpandedAEId(null);
      addModifierToComponent(id, modifierId, specific);
    },
    onDropToAEComponent: (aeId, id, modifierId, specific) => {
      setExpandedAEId(aeId); setActiveAEComponentId((current) => ({ ...current, [aeId]: id }));
      if (modifierId === 'removable') addModifierToComponent(id, modifierId, specific);
      else addModifierToAEComponent(aeId, id, modifierId, specific);
    },
  });

  const handleAddModifierFromPalette = useCallback((modId: string, isPowerSpecific?: boolean) => {
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
  }, [equipmentMode, expandedAEId, power.alternateEffects, activeAEComponentId, activeComponentId, addModifierToComponent, addModifierToAEComponent]);

  function removeModifier(componentId: string, instanceKey: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : removeComponentModifier(comp, instanceKey)
      ),
    }));
  }

  function updateModifierRanks(componentId: string, instanceKey: string, ranks: number) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : updateComponentModifier(comp, instanceKey, { ranks: Math.max(1, ranks) })
      ),
    }));
  }

  function updateModifierOption(componentId: string, instanceKey: string, option: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : updateComponentModifier(comp, instanceKey, { option })
      ),
    }));
  }

  function updateModifierOptions(componentId: string, instanceKey: string, options: Record<string, boolean | number | string>) {
    setPower((p) => ({
      ...p,
      components: p.components.map((comp) =>
        comp.id !== componentId
          ? comp
          : updateComponentModifier(comp, instanceKey, { options, ...(typeof options.affectedRanks === 'number' ? { affectedRanks: options.affectedRanks } : {}) })
      ),
    }));
  }

  function addComponent() {
    const newComp: ICharacterPowerComponent = {
      id: createId(),
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

  async function handleSave() {
    // Filter out empty components (components without an effect selected)
    const validComponents = power.components.filter((c) => c.effectId !== '');

    // Check if there's at least one valid component
    if (validComponents.length === 0) {
      await dialog.alert({ title: t('builder.title'), message: t('builder.noEffectError') });
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

    const saveIssues = getBlockingPowerSaveIssues(cleanPower, validationRules, {
      powerDefs,
      modifierDefs,
      character,
      skillDefs: SKILL_DEFS,
    });

    if (saveIssues.length > 0) {
      const firstIssue = saveIssues[0];
      await dialog.alert({ title: t('builder.title'), message: `${firstIssue.path}: ${firstIssue.message}`, messageDiagnostic: { ...firstIssue, messageKey: 'errors.validationError', params: { field: firstIssue.path }, nested: firstIssue } });
      return;
    }

    // Validate alternate effects against main cost
    const invalidAEs = aeValidations
      .map((v, i) => ({ ...v, ae: power.alternateEffects[i] }))
      .filter((v) => !v.valid && v.ae.components.some((c) => c.effectId !== ''));

    if (invalidAEs.length > 0) {
      const names = invalidAEs.map((v, index) => v.ae.name || `AE ${index + 1}`).join(', ');
      const confirmed = await dialog.confirm({
        title: t('builder.title'),
        message: t('builder.saveInvalidAEsConfirm', { count: invalidAEs.length, cap: mainCost, names }),
        confirmLabel: t('common.save'),
      });
      if (!confirmed) return;
    }

    if (!templateMode && !resourceContext && !origin) return;
    onSave(cleanPower);
  }

  const activeMod = activeDrag?.modifier;
  useDialogFocus(overlayRef, true, onClose, !activeId);
  const hasEffect = power.components.some((c) => c.effectId !== '');
  const announcements = useMemo<Announcements>(() => ({
    onDragStart: ({ active }) => t('builder.dragStarted', { name: active.data.current?.modifier?.name ?? '' }),
    onDragOver: ({ over }) => over ? t('builder.dragOver', { name: over.data.current?.label ?? '' }) : t('builder.dragOutside'),
    onDragEnd: ({ over }) => t(over ? 'builder.dragAdded' : 'builder.dragCancelled', { name: over?.data.current?.label ?? '' }),
    onDragCancel: () => t('builder.dragCancelled'),
  }), [t]);

  return (
    <div ref={overlayRef} className="builder-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} data-history-shortcuts-disabled>
      <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel} accessibility={{ announcements, screenReaderInstructions: { draggable: t('builder.dragInstructions') } }}>
        {/* Top Bar */}
        <div className="builder-topbar">
          <h2 id={titleId} className="builder-topbar-title">
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
            {!hasEffect && <span className="builder-save-hint">{t('builder.selectEffectToSave')}</span>}
            <button className="builder-action-btn builder-close-btn" onClick={onClose}>
              <X size={14} /> {t('builder.close')}
            </button>
          </div>
        </div>

        <div className="builder-body">
          {/* Sidebar: Modifier Palette (Desktop) */}
          {!isMobile && <div className="builder-palette-desktop">
            <EffectPalette
              filter={paletteFilter}
              onFilterChange={setPaletteFilter}
              selectedEffect={paletteSelectedEffect}
              onAddModifier={handleAddModifierFromPalette}
              collapsed={paletteCollapsed}
              onToggleCollapse={togglePalette}
              contextName={paletteContextName ?? paletteSelectedEffect?.name}
              equipmentMode={equipmentMode}
            />
          </div>}

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
                    <select className="build-input build-input--small" value={power.activation ?? ''} onChange={(e) => setPower((current) => ({ ...current, activation: e.target.value === 'move' || e.target.value === 'standard' ? e.target.value : undefined }))} aria-label="Activation">
                      <option value="">Activation: none</option><option value="move">Activation: move (−1 {costUnit})</option><option value="standard">Activation: standard (−2 {costUnit})</option>
                    </select>
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
              <div className="build-descriptor-tags">
                {descriptors.map((desc, idx) => (
                  <div
                    key={`${desc}-${idx}`}
                    className={`build-descriptor-tag${selectedDescriptorIndex === idx ? ' build-descriptor-tag--selected' : ''}`}
                  >
                    <button
                      type="button"
                      className="build-descriptor-tag-select"
                      onClick={() => selectDescriptor(idx)}
                      aria-pressed={selectedDescriptorIndex === idx}
                    >
                      {desc}
                    </button>
                    <button
                      type="button"
                      className="build-descriptor-tag-remove"
                      onClick={() => removeDescriptor(idx)}
                      title={t('builder.removeDescriptor')}
                      aria-label={`${t('builder.removeDescriptor')}: ${desc}`}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <div className="build-descriptor-add">
                <input
                  ref={descriptorInputRef}
                  className="build-input"
                  value={descriptorInput}
                  onChange={(e) => setDescriptorInput(e.target.value)}
                  placeholder={t('builder.descriptorsPlaceholder')}
                  aria-label={t('builder.descriptors')}
                />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={applyCurrentDescriptor}
                    disabled={!canApplyDescriptor}
                  >
                    {selectedDescriptorIndex === null ? t('common.add') : t('common.edit')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Effect Components */}
            <div className="build-section">
              <div className="build-section-header">
                <label className="build-label">{t('builder.component')}</label>
                <button className="build-add-comp-btn" onClick={addComponent}>
                  <Plus size={12} /> {t('builder.addLinkedEffect')}
                </button>
              </div>
              {!hasEffect && (
                <p className="builder-draft-guidance" role="status">
                  <Info size={14} /> {t('builder.selectEffectToStart')}
                </p>
              )}
              {hasEffect && power.components.length === 1 && (
                <p className="builder-relationship-hint">{t('builder.linkedEffectHint')}</p>
              )}

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
                        {idx === 0
                          ? (power.alternateEffects.length > 0 ? t('builder.baseEffect') : t('builder.mainEffect'))
                          : t('builder.linkedComponent', { n: idx + 1 })}
                      </span>
                      <PowerLibraryButton targetLabel={idx === 0 ? t('builder.baseEffect') : t('builder.linkedComponent', { n: idx + 1 })}
                        onClick={() => setLibraryTarget({ kind: 'component', componentId: comp.id })}/>
                      {costInfo.total > 0 && (
                        <span className="component-cost">{costInfo.total} {costUnit}</span>
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

                    <div className={`build-effect-layout ${effectDef ? 'build-effect-layout--with-reference' : ''}`}>
                      <div className="build-effect-controls">
                        {/* Effect selector with search */}
                        <div className="build-row build-effect-selector-row" style={{ alignItems: 'flex-end' }}>
                          <div className="build-section build-section--flex">
                            <EffectCombobox
                              value={comp.effectId}
                              onChange={(effectId) => updateComponent(comp.id, {
                                effectId,
                                ranks: 1,
                                variableCostOption: undefined,
                                enhancedTarget: undefined,
                                fieldValues: {},
                                senseTraits: effectId === 'senses' ? [] : undefined,
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
                              disabled={effectDef?.variableCost?.costType === 'flat'}
                            />
                          </div>
                        </div>

                        {comp.effectId === 'enhanced-trait' && <EnhancedTargetEditor reviewAssociation={associationReviewIds.has(comp.id)} component={comp} character={character} onChange={update => updateComponent(comp.id, update)} />}
                        {effectDef?.variableCost && comp.effectId !== 'enhanced-trait' && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <VariableCostSelector
                              options={effectDef.variableCost.options}
                              costType={effectDef.variableCost.costType}
                              selected={comp.variableCostOption}
                              onChange={(optionName) => updateComponent(comp.id, {
                                variableCostOption: optionName,
                                ...(effectDef.variableCost?.costType === 'flat' ? { ranks: 1 } : {}),
                              })}
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
                        {comp.effectId === 'affliction' && <AfflictionConditionsEditor component={comp} onChange={fieldValues => updateComponent(comp.id, { fieldValues })} />}
                        {comp.effectId === 'senses' && comp.senseTraits !== undefined && (
                          <SenseTraitsEditor traits={comp.senseTraits} onChange={(senseTraits) => updateComponent(comp.id, { senseTraits, ranks: senseTraits.reduce((sum, trait) => sum + trait.ranks, 0) })} />
                        )}

                        {/* Modifier dropzone */}
                        <div className="build-section" onClick={(e) => e.stopPropagation()}>
                          <label className="build-label">{t('builder.modifiers')}</label>
                          <ModifierDropzone componentId={comp.id} effectId={comp.effectId} label={effectDef?.name ?? t('builder.mainEffect')}>
                            {comp.modifiers.length === 0 && !activeId && (
                              <span className="dropzone-placeholder">{t(comp.effectId ? 'builder.dropHere' : 'builder.chooseEffectForModifiers')}</span>
                            )}
                            {comp.modifiers.map((applied, modifierIndex) => {
                              const def = effectDef
                                ? resolveModifierDefinition(applied, effectDef, modifierDefs).definition
                                : undefined;
                              if (!def) return null;

                              const applicationNumber = comp.modifiers.filter(modifier => modifier.modifierId === applied.modifierId).length > 1
                                ? comp.modifiers.slice(0, modifierIndex + 1).filter(modifier => modifier.modifierId === applied.modifierId).length : undefined;
                              // Check for incompatibilities
                              const incompatKey = `${comp.id}:${applied.modifierId}`;
                              const conflicts = modifierIncompatibilities[incompatKey] || [];
                              const hasIncompatibility = conflicts.length > 0;

                              return (
                                <div
                                  key={modifierInstanceKey(applied, modifierIndex)}
                                  className={`applied-mod ${def.category === 'flaw' ? 'applied-mod--flaw' : ''} ${applied.isPowerSpecific ? 'applied-mod--specific' : ''} ${hasIncompatibility ? 'applied-mod--incompatible' : ''}`}
                                >
                                  <span className="applied-mod-name">{def.name}<ModifierDefinitionNotice effectId={comp.effectId} modifierId={def.id} />{applicationNumber && <small className="applied-mod-instance-number"> #{applicationNumber}</small>}</span>
                                  <ModifierParameterControls
                                    applied={applied}
                                    definition={def}
                                    applicationNumber={applicationNumber}
                                    effectRanks={Math.max(1, getComponentEffectRanks(comp, getCharacterStrength(character)))}
                                    effectAction={effectDef?.action}
                                    onRanksChange={(value) => updateModifierRanks(comp.id, modifierInstanceKey(applied, modifierIndex), value)}
                                    onOptionsChange={(options) => updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), options)}
                                  />
                                  {/* Sub-option dropdown */}
                                  {def.options && def.options.length > 0 && (
                                    <>
                                      <select
                                        className="applied-mod-option"
                                        value={applied.option ?? ''}
                                        onChange={(e) => updateModifierOption(comp.id, modifierInstanceKey(applied, modifierIndex), e.target.value)}
                                      >
                                        <option value="">Shape...</option>
                                        {def.options.map((opt) => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                                      </select>
                                      {def.id === 'area' && applied.option === 'Perception' && (
                                        <label className="applied-mod-check"><input className="app-checkbox" type="checkbox" checked={applied.options?.includesSenseDependent === true} onChange={(e) => updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), { ...applied.options, includesSenseDependent: e.target.checked })} /> Includes Sense-Dependent</label>
                                      )}
                                    </>
                                  )}
                                  {/* Conditional checkbox for Affects Objects */}
                                  {def.id === 'affects_objects' && (
                                    <label className="applied-mod-checkbox">
                                      <input
                                        className="app-checkbox"
                                        type="checkbox"
                                        checked={applied.options?.affectsOnlyObjects === true}
                                        onChange={(e) => {
                                          const newOptions = {
                                            ...applied.options,
                                            affectsOnlyObjects: e.target.checked,
                                          };
                                          updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), newOptions);
                                        }}
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
                                        onChange={(e) => {
                                          updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                            ...applied.options,
                                            affectsOnlyOthers: e.target.checked,
                                          });
                                        }}
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
                                        onChange={(e) => {
                                          updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                            ...applied.options,
                                            sideEffectAlways: e.target.checked,
                                          });
                                        }}
                                      />
                                      {t('builder.sideEffectAlways')}
                                    </label>
                                  )}
                                  {def.id === 'alternate_resistance' && (
                                    <select
                                      className="applied-mod-subtype"
                                      value={(applied.options?.alternateResistanceCost as string) ?? 'equal'}
                                      onChange={(e) => {
                                        updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                          ...applied.options,
                                          alternateResistanceCost: e.target.value,
                                        });
                                      }}
                                    >
                                      <option value="equal">{t('builder.alternateResistanceEqual')}</option>
                                      <option value="advantageous">{t('builder.alternateResistanceAdvantageous')}</option>
                                    </select>
                                  )}
                                  {(def.id === 'reaction' || def.id === 'triggered') && (
                                    <input
                                      className="applied-mod-option"
                                      value={(applied.options?.trigger as string) ?? ''}
                                      onChange={(e) => {
                                        updateModifierOptions(comp.id, modifierInstanceKey(applied, modifierIndex), {
                                          ...applied.options,
                                          trigger: e.target.value,
                                        });
                                      }}
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
                                    onClick={() => removeModifier(comp.id, modifierInstanceKey(applied, modifierIndex))}
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
                            {costInfo.breakdown.rankGroups.map((group, groupIndex) => (
                              <span key={`${group.fromRank}-${group.toRank}`} className={group.isFractional ? 'fractional-cost-line' : undefined}>
                                {effectDef?.variableCost?.costType === 'flat'
                                  ? `${costInfo.breakdown?.selectedVariableCost ?? effectDef?.name ?? comp.effectId}: `
                                  : `R${group.fromRank}${group.toRank > group.fromRank ? `–${group.toRank}` : ''}: `}
                                {group.isFractional ? (
                                  <>
                                    <span className="fractional-cost-badge">1 {costUnit} / {group.ranksPerPP} ranks</span>
                                    {' '}× {group.rankCount} = {group.subtotal} {costUnit}
                                  </>
                                ) : (
                                  <>{group.costPerRank} {costUnit}/rank × {group.rankCount} = {group.subtotal} {costUnit}</>
                                )}
                                {groupIndex < costInfo.breakdown!.rankGroups.length - 1 ? ' + ' : ''}
                              </span>
                            ))}
                            {costInfo.breakdown.flatCost !== 0 && (
                              <span>{costInfo.breakdown.rankGroups.length > 0 ? ' + ' : ''}{costInfo.breakdown.flatCost} flat</span>
                            )}
                            {(costInfo.breakdown.rankGroups.length !== 1
                              || costInfo.breakdown.flatCost !== 0
                              || costInfo.breakdown.total !== costInfo.breakdown.rankCost) && (
                              <span>{' = '}<strong>{costInfo.breakdown.total} {costUnit}</strong></span>
                            )}
                          </div>
                        )}
                      </div>
                      {effectDef && <EffectReference effect={effectDef} component={comp} t={t} />}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div className="build-section">
              <label className="build-label">{t('builder.notes')}</label>
              <PowerNotesTextarea
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
                  <span className="ae-cap-badge">Cap: {mainCost} {costUnit}</span>
                )}
              </div>
              {mainCost > 0 && (
                <div className="ae-rules-note">
                  <Info size={11} /> {t('builder.altRuleNote')}
                </div>
              )}
              {power.alternateEffects.length === 0 && (
                <p className="builder-relationship-hint">{t('builder.alternateEffectHint')}</p>
              )}
              {power.alternateEffects.some((ae) => ae.dynamic) && (
                <label className="applied-mod-checkbox" title={t('builder.dynamicBaseTooltip')}>
                  <input
                    className="app-checkbox"
                    type="checkbox"
                    checked={power.baseDynamic === true}
                    onChange={(e) => setPower((current) => ({
                      ...current,
                      baseDynamic: e.target.checked,
                    }))}
                  />
                  {t('builder.dynamicBase')}
                </label>
              )}
              {power.alternateEffects.map((ae, aeIdx) => (
                <AltEffectCard
                  associationReviewIds={associationReviewIds}
                  character={character}
                  strength={getCharacterStrength(character)}
                  costUnit={costUnit}
                  key={ae.id}
                  ae={ae}
                  aeIdx={aeIdx}
                  cost={aeCosts[aeIdx] ?? 0}
                  cap={mainCost}
                  validation={aeValidations[aeIdx] ?? { valid: true, overageBy: 0 }}
                  isExpanded={expandedAEId === ae.id}
                  onToggleExpand={() => setExpandedAEId((prev) => prev === ae.id ? null : ae.id)}
                  activeCompId={activeAEComponentId[ae.id] ?? ae.components[0]?.id ?? ''}
                  onSetActiveComp={(compId) => setActiveAEComponentId((prev) => ({ ...prev, [ae.id]: compId }))}
                  allEffects={powerDefs}
                  allModDefs={allModDefs}
                  genericModifierDefs={modifierDefs}
                  modifierIncompatibilities={modifierIncompatibilities}

                  activeId={activeId}
                  onUpdateAE={(update) => updateAlternateEffect(ae.id, update)}
                  onRemoveAE={() => removeAlternateEffect(ae.id)}
                  onAddComponent={() => addAEComponent(ae.id)}
                  onRemoveComponent={(cId) => removeAEComponent(ae.id, cId)}
                  onUpdateComponent={(cId, upd) => updateAEComponent(ae.id, cId, upd)}
                  onRemoveModifier={(cId, modId) => removeModifierFromAEComponent(ae.id, cId, modId)}
                  onUpdateModifierRanks={(cId, modId, ranks) => updateAEModifierRanks(ae.id, cId, modId, ranks)}
                  onUpdateModifierOption={(cId, modId, opt) => updateAEModifierOption(ae.id, cId, modId, opt)}
                  onUpdateModifierOptions={(cId, modId, opts) => updateAEModifierOptions(ae.id, cId, modId, opts)}
                  onInfoClick={setEffectModalPower}
                  onOpenLibrary={setLibraryTarget}
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
                  <span className="cost-comp-val">{costInfo.total} {costUnit}</span>
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
                    {cost} {costUnit} {valid ? '✅' : '⚠️'}
                  </span>
                </span>
              );
            })}
            {power.alternateEffects.length > 0 && (
              <span className="cost-comp-item">
                <span className="cost-comp-name">{t('builder.arrayCost')}</span>
                <span className="cost-comp-val">{arrayCost - mainCost} {costUnit}</span>
              </span>
            )}
            {activationDiscount > 0 && (
              <span className="cost-comp-item">
                <span className="cost-comp-name">{t('builder.activation')}</span>
                <span className="cost-comp-val">−{activationDiscount} {costUnit}</span>
              </span>
            )}
          </div>
          <div className="cost-total">
            {!equipmentMode && removableDiscount > 0 && (
              <span className="cost-removable-line">
                {t(`builder.removable.${power.removable ?? 'none'}`)} −{removableDiscount} PP
              </span>
            )}
            <span className="cost-total-label">{isHQEffect ? t('resources.hq.budgetLabel') : equipmentMode ? t('builder.totalEP') : t('builder.total') + ':'}</span>
            <span className="cost-total-value">{equipmentMode ? equipmentEPCost : totalCost} {costUnit}</span>
            <ModifierDrawerFAB
              onClick={() => openDrawer('full')}
              contextLabel={fabContextLabel}
            />
          </div>
          {!templateMode && <BudgetPreview characterId={originId} target={budgetTarget} power={power} rules={validationRules} />}
          {saveError && <div role="alert" className="pl-violation-banner">{t(saveError)}</div>}
          {resourceContext && <div className="pl-violation-banner resource-context-banner">
            <Info size={13} /><span>{t('resources.builder.context', { name: resourceContext.resource.name || t('resources.unnamed'), strength: getCharacterStrength(character), level: powerLevel })}{resourceContext.resource.type === 'headquarters' ? ` · ${t('resources.hq.effectCost', { cost: equipmentEPCost, limit: powerLevel * 2 })}` : ''}</span>
          </div>}
          {resourceWarnings.map((warning) => <div className="pl-violation-banner" key={warning.key}><AlertTriangle size={13} /><span>{t(warning.key, warning.values)}</span></div>)}
          {plViolation && (
            <div className="pl-violation-banner">
              <AlertTriangle size={13} />
              <span>{t('validation.attackDamage')} — {plViolation.formula} (max {plViolation.limit})</span>
            </div>
          )}
          {semanticWarnings.map((warning) => (
            <div className={`pl-violation-banner${warning.messageKey === 'builder.duplicateModifierWarning' ? ' duplicate-modifier-banner' : ''}`} key={`${warning.path}:${warning.message}`}>
              <AlertTriangle size={13} />
              <span>
                {formatDiagnostic(warning, t, i18n.language)}
              </span>
            </div>
          ))}
          {pricingDiagnostics.length > 0 && (
            <div className="pl-violation-banner" title={pricingDiagnostics.map((diagnostic) => formatDiagnostic(diagnostic, t, i18n.language)).join('\n')}>
              <AlertTriangle size={13} />
              <span>{t(pricingDiagnostics.every(diagnostic => diagnostic.code === 'ambiguous-modifier') ? 'builder.pricingAmbiguityWarning' : 'builder.pricingDataWarning', { count: pricingDiagnostics.length })}</span>
              <Button variant="ghost" onClick={async () => { const original = JSON.stringify(power); const reviewed = await dialog.reviewModifierSources(power, original); if (reviewed) setPower(reviewed); }}>{t('recovery.review')}</Button>
            </div>
          )}
        </div>

        <DragOverlay zIndex={1200} dropAnimation={null}>
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
        {isMobile && <MobileModifierDrawer
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
            onToggleCollapse={closeDrawer}
            contextName={paletteContextName ?? paletteSelectedEffect?.name}
            equipmentMode={equipmentMode}
          />
        </MobileModifierDrawer>}


      </DndContext>

      {libraryTarget && <Suspense fallback={null}><PowerLibraryDialog
        power={power} target={libraryTarget} strength={getCharacterStrength(character)} costUnit={costUnit}
        onClose={() => setLibraryTarget(null)}
        onApply={(recipe, useName) => {
          const next = applyPowerTemplate(power, recipe, libraryTarget, useName);
          setPower(next);
          if (libraryTarget.alternateId) {
            const alternate = next.alternateEffects.find(ae => ae.id === libraryTarget.alternateId);
            setExpandedAEId(libraryTarget.alternateId);
            if (alternate) {
              const selected = libraryTarget.kind === 'component' && alternate.components.some(component => component.id === libraryTarget.componentId)
                ? libraryTarget.componentId : alternate.components[0].id;
              setActiveAEComponentId(previous => ({ ...previous, [alternate.id]: selected }));
            }
          } else setActiveComponentId(libraryTarget.kind === 'component' && next.components.some(component => component.id === libraryTarget.componentId)
            ? libraryTarget.componentId : next.components[0].id);
          setLibraryTarget(null);
        }}/></Suspense>}

      {/* Effect Detail Modal */}
      {effectModalPower && (
        <InfoDialog isOpen={true} title={effectModalPower.name} onClose={() => setEffectModalPower(null)}>
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
        </InfoDialog>
      )}

      <style>{`
        .builder-overlay {
          position: fixed; inset: 0; z-index: 1000; height: 100dvh;
          background: var(--c-bg);
          display: flex; flex-direction: column;
          animation: fadeIn 0.2s ease;
          overflow: hidden;
        }
        .builder-topbar {
          flex-shrink: 0; flex-wrap: wrap; gap: var(--s-sm);
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
        .builder-save-btn { background: var(--c-primary); color: var(--c-action-text, var(--c-text-inverse)); border-color: var(--c-primary); }
        .builder-save-btn:hover { opacity: 0.9; }
        .builder-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .builder-close-btn:hover { border-color: var(--c-error); color: var(--c-error); }

        .builder-body { flex: 1; display: flex; overflow: hidden; min-width: 0; min-height: 0; }
        .builder-workspace {
          min-height: 0; min-width: 0; overscroll-behavior: contain;
          flex: 1; padding: var(--s-lg); overflow-y: auto;
          display: flex; flex-direction: column; gap: var(--s-md); min-width: 0;
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
          padding: 3px 10px; background: var(--c-warning-bg, rgba(var(--c-warning-rgb, 251, 191, 36), 0.15));
          border: 1px solid var(--c-warning, #f59e0b); border-radius: var(--r-full);
          color: var(--c-warning, #f59e0b); font-size: 0.72rem; font-weight: 600;
          cursor: pointer; white-space: nowrap; user-select: none;
          transition: all var(--t-fast);
        }
        .build-removable-badge:hover { background: var(--c-warning-bg, rgba(var(--c-warning-rgb, 251, 191, 36), 0.25)); }
        .build-removable-badge-remove {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; border: none; color: inherit;
          cursor: pointer; padding: 0; margin-left: 2px; opacity: 0.6;
          transition: opacity var(--t-fast);
        }
        .build-removable-badge-remove:hover { opacity: 1; }
        .build-removable-discount {
          font-size: 0.78rem; color: var(--c-success, #4ade80); font-weight: 600;
          background: rgba(var(--c-success-rgb, 74, 222, 128), 0.1); padding: 2px 8px;
          border-radius: var(--r-full); border: 1px solid rgba(var(--c-success-rgb, 74, 222, 128), 0.3);
          margin-top: var(--s-xs);
        }
        .builder-save-hint { align-self: center; color: var(--c-text-muted); font-size: 0.72rem; }
        .builder-relationship-hint { margin: 0; color: var(--c-text-muted); font-size: 0.78rem; line-height: 1.45; }
        .builder-draft-guidance {
          display: flex; align-items: center; gap: 6px; margin: 0;
          color: var(--c-primary); font-size: 0.8rem; line-height: 1.45;
          background: var(--c-primary-muted); border-radius: var(--r-sm); padding: var(--s-sm);
        }

        /* Component Cards */
        .component-card {
          border: 1px solid var(--c-border); border-radius: var(--r-md);
          padding: var(--s-md); display: flex; flex-direction: column; gap: var(--s-sm);
          cursor: pointer; transition: all var(--t-fast);
          background: var(--c-surface); container-type: inline-size;
        }
        .build-effect-layout { display: grid; gap: var(--s-md); min-width: 0; align-items: start; }
        .build-effect-controls { display: flex; flex-direction: column; gap: var(--s-sm); min-width: 0; }
        .build-effect-controls .build-section--flex { min-width: 0; }
        .build-effect-selector-row { --effect-control-height: var(--touch-target-min); }
        .build-effect-selector-row .ecb-input,
        .build-effect-selector-row .ecb-info-btn,
        .build-effect-selector-row .number-input-wrapper,
        .build-effect-selector-row .build-input { height: var(--effect-control-height); }
        .build-effect-selector-row .ecb-input { min-width: 0; }
        .build-effect-selector-row .ecb-info-btn { width: var(--effect-control-height); justify-content: center; }
        .build-effect-controls .applied-mod { flex-wrap: wrap; min-width: 0; max-width: 100%; }
        .build-effect-controls .applied-mod-name { min-width: 0; overflow-wrap: anywhere; }
        .build-effect-layout > .build-effect-info { min-width: 0; align-content: start; }
        .build-effect-layout .effect-desc { margin: 0; line-height: 1.6; overflow-wrap: anywhere; }
        @container (min-width: 680px) {
          .build-effect-layout--with-reference { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); }
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
        .fractional-cost-line { color: var(--c-warning); }
        .fractional-cost-badge { font-weight: 800; }

        /* Effect info strip */
        .build-effect-info {
          display: flex; flex-wrap: wrap; gap: var(--s-sm); align-items: center;
          padding: var(--s-sm) var(--s-md);
          background: var(--c-primary-muted); border-radius: var(--r-sm);
        }
        .build-effect-meta { display: contents; }
        @media (min-width: 769px) {
          @container (min-width: 680px) {
            .build-effect-layout--with-reference { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          .build-effect-layout > .build-effect-info { padding: 12px 16px; gap: 12px; }
          .build-effect-layout .build-effect-meta {
            display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; width: 100%; line-height: 1.4;
          }
          .build-effect-layout .effect-detail { font-size: 0.8rem; }
          .build-effect-layout .effect-desc { font-size: 0.875rem; line-height: 1.55; }
        }
        .effect-badge {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          padding: 2px 8px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-action-text, var(--c-text-inverse));
        }
        .effect-detail { font-size: 0.78rem; color: var(--c-text-secondary); }
        .effect-desc { font-size: 0.82rem; color: var(--c-text); width: 100%; margin-top: var(--s-xs); }
        .defense-warning {
          display: flex; align-items: center; gap: 6px; width: 100%;
          font-size: 0.78rem; color: var(--c-status-warning, #f59e0b); background: rgba(var(--c-warning-rgb, 245, 158, 11), 0.1);
          border: 1px solid rgba(var(--c-warning-rgb, 245, 158, 11), 0.3); border-radius: var(--r-sm);
          padding: 4px 8px;
        }

        /* Dropzone */
        .build-dropzone {
          min-height: 70px; border: 2px dashed var(--c-border); border-radius: var(--r-md);
          padding: var(--s-sm); display: flex; flex-wrap: wrap; gap: var(--s-xs);
          align-items: flex-start; transition: all var(--t-fast);
        }
        .build-dropzone--eligible { border-color: var(--c-primary); }
        .build-dropzone--active { border-style: solid; border-color: var(--c-success); background: var(--c-success-muted); box-shadow: 0 0 0 2px var(--c-success); }
        .dropzone-feedback { flex-basis: 100%; font-size: 0.78rem; font-weight: 600; color: var(--c-success); }
        .dropzone-placeholder { color: var(--c-text-muted); font-size: 0.82rem; font-style: italic; }

        /* Applied modifiers */
        .applied-mod {
          display: flex; align-items: center; gap: 5px;
          padding: 3px 8px; border-radius: var(--r-full);
          background: rgba(var(--c-success-rgb, 74, 222, 128), 0.12); border: 1px solid rgba(var(--c-success-rgb, 74, 222, 128), 0.3);
          font-size: 0.78rem;
        }
        .applied-mod--flaw { background: rgba(var(--c-error-rgb, 248, 113, 113), 0.12); border-color: rgba(var(--c-error-rgb, 248, 113, 113), 0.3); }
        .applied-mod--specific { background: rgba(var(--c-warning-rgb, 245, 158, 11), 0.1); border-color: rgba(var(--c-warning-rgb, 245, 158, 11), 0.35); }
        .applied-mod--incompatible {
          background: rgba(var(--c-error-rgb, 239, 68, 68), 0.15);
          border-color: rgba(var(--c-error-rgb, 239, 68, 68), 0.5);
          animation: pulse-warning 2s ease-in-out infinite;
        }
        @keyframes pulse-warning {
          0%, 100% { border-color: rgba(var(--c-error-rgb, 239, 68, 68), 0.5); }
          50% { border-color: rgba(var(--c-error-rgb, 239, 68, 68), 0.8); }
        }
        .applied-mod-name { font-weight: 600; }
        .applied-mod-instance-number { font-size: .7rem; color: var(--c-text-muted); white-space: nowrap; }
        .applied-mod:has(.applied-mod-instance-note) { flex-basis: 100%; border-radius: var(--r-md); }
        .applied-mod-instance-note { order: 2; flex: 1 1 100%; min-width: 0; width: 100%; max-width: 100%; padding: 4px 6px; border: 1px solid var(--c-border); border-radius: var(--r-sm); background: var(--c-bg); color: var(--c-text); font: inherit; }
        .applied-mod-parameters, .applied-mod-field { display: contents; }
        .applied-mod-field-label { display: none; }
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
          flex-shrink: 0; flex-wrap: wrap; gap: var(--s-xs); max-height: 30dvh; overflow-y: auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--s-sm) var(--s-lg);
          background: var(--c-surface); border-top: 1px solid var(--c-border);
        }
        .cost-breakdown { display: flex; align-items: center; gap: 4px var(--s-md); flex-wrap: wrap; line-height: 1.4; }
        .cost-comp-item { display: flex; align-items: center; gap: 6px; }
        .cost-comp-name { font-size: 0.8rem; color: var(--c-text-secondary); }
        .cost-comp-val { font-size: 0.8rem; font-weight: 700; color: var(--c-primary); }
        .cost-total { display: flex; align-items: center; gap: var(--s-sm); flex-wrap: wrap; }
        .cost-total-label { font-size: 0.9rem; font-weight: 600; }
        .cost-total-value { font-family: var(--f-heading); font-size: 1.4rem; font-weight: 800; color: var(--c-primary); }
        .cost-removable-line {
          font-size: 0.78rem; color: var(--c-success, #4ade80); font-weight: 600;
          background: rgba(var(--c-success-rgb, 74, 222, 128), 0.1); padding: 2px 8px;
          border-radius: var(--r-full); border: 1px solid rgba(var(--c-success-rgb, 74, 222, 128), 0.3);
        }
        .pl-violation-banner { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--c-error); background: rgba(var(--c-error-rgb, 248, 113, 113), 0.08); border: 1px solid rgba(var(--c-error-rgb, 248, 113, 113), 0.3); border-radius: var(--r-sm); padding: 5px 10px; margin-top: 4px; width: 100%; }
        .pl-violation-banner span { min-width: 0; overflow-wrap: anywhere; }
        .pl-violation-banner svg { flex-shrink: 0; }
        .duplicate-modifier-banner { color: var(--c-warning); background: rgba(var(--c-warning-rgb, 251, 191, 36), 0.08); border-color: rgba(var(--c-warning-rgb, 251, 191, 36), 0.3); }
        .resource-context-banner { background: transparent; border-color: var(--c-border); color: var(--c-text-secondary); }

        /* Drag ghost */
        .drag-ghost {
          display: flex; align-items: center; gap: var(--s-sm);
          padding: 6px 14px; border-radius: var(--r-full);
          background: var(--c-primary); color: var(--c-action-text, var(--c-text-inverse));
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
            min-width: 0;
            padding: var(--s-md);
          }
          .builder-topbar {
            padding: var(--s-sm) var(--s-md);
          }
          .builder-topbar-title {
            font-size: 0.9rem;
          }
          .builder-topbar-actions { min-width: 0; }
          .builder-save-hint { display: none; }
          .build-name-row,
          .build-row { flex-direction: column; align-items: stretch !important; gap: var(--s-sm); min-width: 0; }
          .build-name-row .build-input,
          .build-section--flex { min-width: 0; width: 100%; }
          .build-name-row .build-input--small { width: 100%; text-align: left; }
          .build-row > .build-section:not(.build-section--flex) { align-self: flex-start; }
          .component-card, .ae-card, .ae-comp-card { min-width: 0; }
          .build-dropzone { min-width: 0; }
          /* Applied modifiers become structured cards on touch screens. */
          .build-dropzone .applied-mod {
            width: 100%; min-width: 0; max-width: 100%; flex-wrap: wrap;
            border-radius: var(--r-md); padding: 8px 10px; gap: 8px;
          }
          .build-dropzone .applied-mod-name { order: 0; flex: 1; min-width: 0; overflow-wrap: anywhere; }
          .applied-mod-cost { order: 1; flex-shrink: 0; font-size: 0.75rem; }
          .applied-mod-overlimit, .applied-mod-incompatible-warning { order: 2; flex-shrink: 0; }
          .applied-mod-remove { order: 3; align-items: center; justify-content: center; flex-shrink: 0; }
          .applied-mod-parameters {
            order: 4; display: flex; flex: 0 0 100%; min-width: 0; gap: 8px; flex-wrap: wrap;
          }
          .applied-mod-parameters:empty { display: none; }
          .applied-mod-instance-note { order: 5; flex: 0 0 100%; width: 100%; min-height: 44px; padding: 8px; }
          .applied-mod-field { display: flex; flex-direction: column; gap: 4px; flex: 1 1 120px; min-width: 0; }
          .applied-mod-field-label { display: block; color: var(--c-text-secondary); font-size: 0.7rem; line-height: 1.4; }
          .applied-mod-field .number-input-wrapper { width: 100%; }
          .applied-mod-field .applied-mod-ranks { flex: 1; width: 0; font-size: 0.85rem; }
          .applied-mod > .applied-mod-option,
          .applied-mod > .applied-mod-subtype,
          .applied-mod > .applied-mod-checkbox,
          .applied-mod > .applied-mod-check {
            order: 5; flex: 0 0 100%; min-width: 0; max-width: 100%;
          }
          .applied-mod .applied-mod-option, .applied-mod .applied-mod-subtype {
            min-height: 44px; width: 100%; max-width: 100%; padding: 8px; font-size: 0.8rem;
          }
          .applied-mod > .applied-mod-checkbox, .applied-mod > .applied-mod-check {
            display: flex; align-items: center; gap: 8px; min-height: 44px; line-height: 1.4;
          }
          .applied-mod .app-checkbox { flex-shrink: 0; }

          .builder-footer {
            flex-direction: column;
            flex-wrap: nowrap;
            gap: var(--s-sm);
            align-items: flex-start;
          }
          .builder-footer > * { flex-shrink: 0; max-width: 100%; }
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
