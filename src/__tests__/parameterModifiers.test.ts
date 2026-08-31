import { describe, expect, it } from 'vitest';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import type {
  DurationType,
  ICharacterPower,
  ICharacterPowerComponent,
  IPowerEffect,
  RangeType,
} from '../entities/types';
import {
  calculatePowerCost,
  isRankedModifier,
} from '../shared/lib/mathEngine';
import {
  resolveEffectiveDuration,
  resolveEffectiveRange,
} from '../shared/lib/effectParameters';
import { validatePowerForSave } from '../shared/lib/semanticValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';

function component(
  modifierId: string,
  ranks = 1,
  effectId = 'damage'
): ICharacterPowerComponent {
  return {
    id: 'component-1',
    effectId,
    ranks: 10,
    modifiers: [{ modifierId, ranks }],
  };
}

function effect(
  range: RangeType,
  duration: DurationType = 'instant'
): IPowerEffect {
  return {
    id: 'test-effect',
    name: 'Test Effect',
    type: 'attack',
    baseCost: 1,
    action: 'standard',
    range,
    duration,
    description: '',
    variableCost: null,
    extras: [],
    flaws: [],
  };
}

function powerWith(
  effectId: string,
  modifierId: string,
  ranks = 1
): ICharacterPower {
  return {
    id: 'power-1',
    name: 'Test Power',
    notes: '',
    alternateEffects: [],
    components: [component(modifierId, ranks, effectId)],
  };
}

describe('official range parameter progression', () => {
  it('moves Close to Ranged with one Increased Range rank', () => {
    const applied = component('increased_range');

    expect(resolveEffectiveRange('close', applied)).toEqual({
      value: 'ranged',
      diagnostics: [],
    });
    expect(calculatePowerCost(1, 10, applied.modifiers, MODIFIER_DEFS)).toBe(20);
  });

  it('moves Close to Perception with two Increased Range ranks', () => {
    const applied = component('increased_range', 2);

    expect(resolveEffectiveRange('close', applied)).toEqual({
      value: 'perception',
      diagnostics: [],
    });
    expect(calculatePowerCost(1, 10, applied.modifiers, MODIFIER_DEFS)).toBe(30);
  });

  it('moves Ranged to Perception with one Increased Range rank', () => {
    expect(resolveEffectiveRange('ranged', component('increased_range')).value)
      .toBe('perception');
  });

  it('warns when Increased Range has no categorical step left', () => {
    const result = resolveEffectiveRange('ranged', component('increased_range', 2));

    expect(result.value).toBe('perception');
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      modifierId: 'increased_range',
      messageKey: 'builder.validation.rangeAlreadyPerception',
    }));
  });

  it('keeps Extended Range separate from the range category', () => {
    expect(resolveEffectiveRange('ranged', component('extended_range', 5)))
      .toEqual({ value: 'ranged', diagnostics: [] });
  });

  it('moves Perception down through Ranged to Close with Reduced Range', () => {
    expect(resolveEffectiveRange('perception', component('reduced_range')).value)
      .toBe('ranged');
    expect(resolveEffectiveRange('perception', component('reduced_range', 2)).value)
      .toBe('close');
  });

  it('allows Affects Others to establish Close range before increasing it', () => {
    const applied = component('increased_range');
    applied.modifiers.unshift({ modifierId: 'affects_others', ranks: 1 });

    expect(resolveEffectiveRange('personal', applied))
      .toEqual({ value: 'ranged', diagnostics: [] });
  });

  it('warns when a Personal effect has no modifier that establishes Close range', () => {
    const result = resolveEffectiveRange('personal', component('increased_range'));

    expect(result.value).toBe('personal');
    expect(result.diagnostics[0]?.messageKey).toBe('builder.validation.rangePersonal');
  });
});

describe('official duration parameter changes', () => {
  it('changes Instant to Concentration with Increased Duration', () => {
    expect(resolveEffectiveDuration('instant', component('increased_duration')))
      .toEqual({ value: 'concentration', diagnostics: [] });
  });

  it('changes Sustained to Continuous with Increased Duration', () => {
    expect(resolveEffectiveDuration('sustained', component('increased_duration')))
      .toEqual({ value: 'continuous', diagnostics: [] });
  });

  it('treats legacy Increased Duration ranks as one application', () => {
    const definition = MODIFIER_DEFS.find(({ id }) => id === 'increased_duration');
    const applied = component('increased_duration', 3);

    expect(definition && isRankedModifier(definition)).toBe(false);
    expect(calculatePowerCost(1, 10, applied.modifiers, MODIFIER_DEFS)).toBe(20);
  });

  it('warns when Increased Duration is applied to another duration', () => {
    const result = resolveEffectiveDuration('continuous', component('increased_duration'));

    expect(result.value).toBe('continuous');
    expect(result.diagnostics[0]?.messageKey)
      .toBe('builder.validation.increasedDurationInvalid');
  });

  it('only changes Sustained to Concentration with the Concentration flaw', () => {
    expect(resolveEffectiveDuration('sustained', component('concentration')).value)
      .toBe('concentration');
    expect(resolveEffectiveDuration('instant', component('concentration')).diagnostics[0]?.messageKey)
      .toBe('builder.validation.duration.concentration');
  });

  it('only changes Continuous to Permanent with the Permanent flaw', () => {
    expect(resolveEffectiveDuration('continuous', component('permanent_flaw')).value)
      .toBe('permanent');
    expect(resolveEffectiveDuration('concentration', component('permanent_flaw')).diagnostics[0]?.messageKey)
      .toBe('builder.validation.duration.permanent_flaw');
  });

  it('only changes Permanent to Sustained with the Sustained extra', () => {
    expect(resolveEffectiveDuration('permanent', component('sustained')).value)
      .toBe('sustained');
    expect(resolveEffectiveDuration('instant', component('sustained')).diagnostics[0]?.messageKey)
      .toBe('builder.validation.duration.sustained');
  });
});

describe('Power Builder parameter warnings', () => {
  it('keeps valid Increased Range on a Close effect warning-free', () => {
    const damage = POWER_DEFS.find(({ id }) => id === 'damage');
    expect(damage).toBeDefined();

    const warnings = validatePowerForSave(
      powerWith('damage', 'increased_range'),
      DEFAULT_VALIDATION_RULES,
      { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS }
    ).filter(({ severity }) => severity === 'warning');

    expect(warnings).toEqual([]);
  });

  it('surfaces invalid duration applicability as a non-blocking warning', () => {
    const concentrationEffect = effect('close', 'concentration');
    const warnings = validatePowerForSave(
      powerWith(concentrationEffect.id, 'permanent_flaw'),
      DEFAULT_VALIDATION_RULES,
      { powerDefs: [concentrationEffect], modifierDefs: MODIFIER_DEFS }
    );

    expect(warnings).toContainEqual(expect.objectContaining({
      severity: 'warning',
      messageKey: 'builder.validation.duration.permanent_flaw',
    }));
    expect(warnings.some(({ severity }) => severity === 'error')).toBe(false);
  });
});
