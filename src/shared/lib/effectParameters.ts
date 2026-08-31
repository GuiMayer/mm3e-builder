import type {
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

const DURATION_CHANGES: Record<string, {
  from: DurationType;
  to: DurationType;
}> = {
  concentration: { from: 'sustained', to: 'concentration' },
  permanent_flaw: { from: 'continuous', to: 'permanent' },
  sustained: { from: 'permanent', to: 'sustained' },
};

/** Resolve the explicit duration changes defined by the official modifiers. */
export function resolveEffectiveDuration(
  baseDuration: DurationType,
  component: ICharacterPowerComponent
): EffectParameterResolution<DurationType> {
  const diagnostics: EffectParameterDiagnostic[] = [];
  const durationModifiers = component.modifiers.filter(({ modifierId }) =>
    modifierId === 'increased_duration'
      || Object.prototype.hasOwnProperty.call(DURATION_CHANGES, modifierId)
  );

  if (durationModifiers.length === 0) {
    return { value: baseDuration, diagnostics };
  }

  if (durationModifiers.length > 1) {
    diagnostics.push({
      modifierId: durationModifiers[1].modifierId,
      message: 'Multiple duration-changing modifiers need GM review; only one direct duration change is normally applied.',
      messageKey: 'builder.validation.multipleDurationChanges',
    });
  }

  const selected = durationModifiers[0];
  if (selected.modifierId === 'increased_duration') {
    if (baseDuration === 'instant') {
      return { value: 'concentration', diagnostics };
    }
    if (baseDuration === 'sustained') {
      return { value: 'continuous', diagnostics };
    }
    diagnostics.push({
      modifierId: selected.modifierId,
      message: 'Increased Duration only changes Instant to Concentration or Sustained to Continuous.',
      messageKey: 'builder.validation.increasedDurationInvalid',
    });
    return { value: baseDuration, diagnostics };
  }

  const change = DURATION_CHANGES[selected.modifierId];
  if (baseDuration !== change.from) {
    diagnostics.push({
      modifierId: selected.modifierId,
      message: `${selected.modifierId} only changes ${change.from} duration to ${change.to}.`,
      messageKey: `builder.validation.duration.${selected.modifierId}`,
    });
    return { value: baseDuration, diagnostics };
  }

  return { value: change.to, diagnostics };
}
