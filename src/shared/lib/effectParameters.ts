import { resolveModifierDefinition } from './rulesCatalog';
import { getSelectedModifierSubtypeId } from './mathEngine';
import type {
  ActionType,
  IAppliedModifier,
  IModifierDef,
  IPowerEffect,
  DurationType,
  ICharacterPowerComponent,
  RangeType,
} from '../../entities/types';

export interface EffectParameterDiagnostic {
  modifierId: string;
  message: string;
  messageKey: string;
  params?: Record<string, string | number>;
}

export interface EffectParameterResolution<T> {
  value: T;
  diagnostics: EffectParameterDiagnostic[];
  provisional?: boolean;
}

const RANGE_STEPS: RangeType[] = ['close', 'ranged', 'perception'];

/** Resolve categorical range. Extended Range changes distance, not this category. */
export function resolveEffectiveRange(
  baseRange: RangeType,
  component: ICharacterPowerComponent
): EffectParameterResolution<RangeType> {
  const diagnostics: EffectParameterDiagnostic[] = [];
  const targetsOthers = component.modifiers.some(({ modifierId }) =>
    modifierId === 'affects_others' || modifierId === 'attack'
  );
  const startingRange: RangeType = baseRange === 'personal' && targetsOthers
    ? 'close'
    : baseRange;
  const startingIndex = RANGE_STEPS.indexOf(startingRange);
  const increasedRanks = component.modifiers
    .filter(({ modifierId }) => modifierId === 'increased_range')
    .reduce((sum, modifier) => sum + Math.max(1, modifier.ranks), 0);
  const reducedRanks = component.modifiers
    .filter(({ modifierId }) => modifierId === 'reduced_range')
    .reduce((sum, modifier) => sum + Math.max(1, modifier.ranks), 0);

  if (startingIndex === -1) {
    if (increasedRanks > 0 || reducedRanks > 0) {
      const modifierId = increasedRanks > 0 ? 'increased_range' : 'reduced_range';
      diagnostics.push({
        modifierId,
        message: 'Range modifiers do not change an unmodified Personal effect.',
        messageKey: 'builder.validation.rangePersonal',
      });
    }
    return { value: startingRange, diagnostics };
  }

  const requestedIndex = startingIndex + increasedRanks - reducedRanks;
  const finalIndex = Math.max(0, Math.min(requestedIndex, RANGE_STEPS.length - 1));

  if (requestedIndex > RANGE_STEPS.length - 1) {
    diagnostics.push({
      modifierId: 'increased_range',
      message: 'Additional Increased Range ranks do not extend beyond Perception range; use Extended Range for distance.',
      messageKey: 'builder.validation.rangeAlreadyPerception',
    });
  }
  if (requestedIndex < 0) {
    diagnostics.push({
      modifierId: 'reduced_range',
      message: 'Additional Reduced Range ranks do not reduce an effect below Close range.',
      messageKey: 'builder.validation.rangeAlreadyClose',
    });
  }

  return { value: RANGE_STEPS[finalIndex], diagnostics };
}

export interface EffectParameterContext {
  effect: IPowerEffect;
  modifierDefs: readonly IModifierDef[];
}
function resolved(component: ICharacterPowerComponent, context?: EffectParameterContext) {
  return component.modifiers.flatMap<{ applied: IAppliedModifier; source: string; definition?: IModifierDef }>(applied => {
    if (!context) return [{ applied, source: applied.isPowerSpecific ? 'power-specific' : 'generic', definition: undefined }];
    const rule = resolveModifierDefinition(applied, context.effect, context.modifierDefs);
    return rule.definition ? [{ applied, ...rule }] : [];
  });
}
const DURATION_CHANGES: Record<string, { from: DurationType; to: DurationType }> = {
  concentration: { from: 'sustained', to: 'concentration' },
  permanent_flaw: { from: 'continuous', to: 'permanent' },
  sustained: { from: 'permanent', to: 'sustained' },
};
const SPECIFIC_DURATION_CHANGES: Record<string, { from: DurationType; to: DurationType }> = {
  sustained_protection: { from: 'permanent', to: 'sustained' },
  sustained_immunity: { from: 'permanent', to: 'sustained' },
  sustained_extra_limbs: { from: 'permanent', to: 'sustained' },
  concentration_nullify: { from: 'instant', to: 'concentration' },
  sustained_nullify: { from: 'concentration', to: 'sustained' },
  concentration_flight: { from: 'sustained', to: 'concentration' },
  concentration_move_object: { from: 'sustained', to: 'concentration' },
  permanent: { from: 'sustained', to: 'permanent' },
  permanent_growth: { from: 'sustained', to: 'permanent' },
  permanent_insubstantial: { from: 'sustained', to: 'permanent' },
  permanent_enhanced_trait: { from: 'sustained', to: 'permanent' },
};
const ambiguous = (modifierId: string): EffectParameterDiagnostic => ({ modifierId, message: 'Ambiguous parameter composition: the displayed value is provisional; ask the GM to review it.', messageKey: 'builder.validation.parameterAmbiguous' });

const INCREASED_DURATION_EDGES = [
  { from: 'instant' as DurationType, to: 'concentration' as DurationType },
  { from: 'concentration' as DurationType, to: 'sustained' as DurationType },
  { from: 'sustained' as DurationType, to: 'continuous' as DurationType },
];

/** DC Adventures progression; legacy records without a step option still buy one step. */
function increasedDurationSteps(applied: IAppliedModifier): number {
  return applied.options?.subtypeId === 'two_steps' ? 2 : applied.options?.subtypeId === 'three_steps' ? 3 : 1;
}

/** Compose duration changes independently of input order, using the adopted DC Adventures progression. */
export function resolveEffectiveDuration(baseDuration: DurationType, component: ICharacterPowerComponent, context?: EffectParameterContext): EffectParameterResolution<DurationType> {
  const diagnostics: EffectParameterDiagnostic[] = [];
  const modifiers = resolved(component, context);
  const durationSteps = modifiers.filter(({ applied, source }) => source === 'generic' && applied.modifierId === 'increased_duration')
    .reduce((sum, { applied }) => sum + increasedDurationSteps(applied), 0);
  const changes: Array<{ id: string; edges: Array<{ from: DurationType; to: DurationType }>; steps?: number }> = modifiers.flatMap(({ applied, source }) => {
    const change = (source === 'power-specific' ? SPECIFIC_DURATION_CHANGES : DURATION_CHANGES)[applied.modifierId];
    return change ? [{ id: applied.modifierId, edges: [change] }] : [];
  }).sort((a, b) => a.id.localeCompare(b.id));
  if (durationSteps) changes.push({ id: 'increased_duration', edges: INCREASED_DURATION_EDGES, steps: durationSteps });
  const unique = changes.filter((change, index) => changes.findIndex(other => other.id === change.id) === index);
  if (unique.length !== changes.length) diagnostics.push(ambiguous(changes.find((change, index) => changes.findIndex(other => other.id === change.id) !== index)!.id));
  let value = baseDuration;
  const remaining = [...unique];
  const visited = new Set<DurationType>([value]);
  while (remaining.length) {
    const applicable = remaining.flatMap(change => change.edges.filter(edge => edge.from === value).map(edge => ({ change, edge })));
    if (!applicable.length) break;
    const destinations = new Set(applicable.map(candidate => candidate.edge.to));
    if (destinations.size > 1 || applicable.some(candidate => visited.has(candidate.edge.to))) {
      diagnostics.push(ambiguous(applicable[0].change.id));
      return { value: baseDuration, diagnostics, provisional: true };
    }
    value = applicable[0].edge.to;
    visited.add(value);
    // A specific transition establishes its duration before purchased generic steps.
    // Otherwise Concentration Nullify + one generic step would incorrectly stop at Concentration.
    const specific = applicable.filter(candidate => candidate.change.steps === undefined);
    for (const candidate of specific.length ? specific : applicable) {
      if (candidate.change.steps && candidate.change.steps > 1) candidate.change.steps--;
      else remaining.splice(remaining.indexOf(candidate.change), 1);
    }
  }
  for (const change of remaining) diagnostics.push({ modifierId: change.id,
    message: 'This duration modifier cannot be composed with the selected duration.',
    messageKey: change.id === 'increased_duration' ? 'builder.validation.increasedDurationInvalid' : DURATION_CHANGES[change.id] ? `builder.validation.duration.${change.id}` : 'builder.validation.specificDurationInvalid',
  });
  return { value, diagnostics, ...(diagnostics.length ? { provisional: true } : {}) };
}
const ACTION_STEPS: ActionType[] = ['reaction', 'free', 'move', 'standard'];

export interface EffectiveActionResolution extends EffectParameterResolution<ActionType> {
  maintenanceAction?: ActionType;
  trigger?: string;
}
/** Usage action, maintenance and trigger are distinct from global power Activation. */
export function resolveEffectiveAction(baseAction: ActionType, component: ICharacterPowerComponent, context?: EffectParameterContext): EffectiveActionResolution {
  const diagnostics: EffectParameterDiagnostic[] = [];
  const modifiers = resolved(component, context);
  const replacements: { action: ActionType; applied: IAppliedModifier }[] = [];
  let increased = 0;
  for (const { applied, definition, source } of modifiers) {
    if (source === 'generic' && applied.modifierId === 'reaction') {
      if (baseAction === 'standard' || baseAction === 'free') replacements.push({ action: 'reaction', applied });
      else diagnostics.push(ambiguous(applied.modifierId));
    }
    if ((source === 'generic' && applied.modifierId === 'increased_action') || (source === 'power-specific' && applied.modifierId === 'action_luck')) increased += Math.max(1, applied.ranks);
    if (source === 'power-specific' && applied.modifierId === 'reaction_insubstantial') replacements.push({ action: 'reaction', applied });
    if (source === 'power-specific' && applied.modifierId === 'action_variable' && definition) {
      const subtype = getSelectedModifierSubtypeId(applied, definition);
      if (['move', 'free', 'reaction'].includes(subtype)) replacements.push({ action: subtype as ActionType, applied });
      else diagnostics.push(ambiguous(applied.modifierId));
    }
    if (source === 'power-specific' && applied.modifierId === 'action_healing') replacements.push({ action: ACTION_STEPS[Math.max(1, 3 - Math.max(1, applied.ranks))], applied });
  }
  let value = baseAction;
  if (replacements.length > 1 && new Set(replacements.map(replacement => replacement.action)).size === 1) diagnostics.push(ambiguous(replacements[0].applied.modifierId));
  if (new Set(replacements.map(replacement => replacement.action)).size > 1 || (replacements.length && increased > 0)) diagnostics.push(ambiguous(replacements[0].applied.modifierId));
  else if (replacements.length) value = replacements[0].action;
  if (!diagnostics.length && increased) {
    const start = ACTION_STEPS.indexOf(value);
    if (start < 0 || start + increased > 3) diagnostics.push(ambiguous('increased_action'));
    if (start >= 0) value = ACTION_STEPS[Math.min(3, start + increased)];
  }
  const duration = context ? resolveEffectiveDuration(context.effect.duration, component, context).value : undefined;
  const repeatedCheck = modifiers.some(({ applied, source }) => source === 'power-specific' && ['concentration_affliction', 'concentration_weaken'].includes(applied.modifierId));
  const maintenanceAction: ActionType | undefined = repeatedCheck || duration === 'concentration' ? 'standard' : duration === 'sustained' ? 'free' : duration === 'permanent' ? 'none' : undefined;
  // Permanent passive effects become conscious free-action effects when Sustained.
  if (baseAction === 'none' && duration && ['sustained', 'continuous', 'concentration'].includes(duration) && !replacements.length && !increased) value = 'free';
  const trigger = modifiers.find(({ applied }) => ['reaction', 'triggered', 'reaction_insubstantial'].includes(applied.modifierId))?.applied.options?.trigger;
  return { value, diagnostics, maintenanceAction, ...(typeof trigger === 'string' && trigger.trim() ? { trigger: trigger.trim() } : {}), ...(diagnostics.length ? { provisional: true } : {}) };
}
