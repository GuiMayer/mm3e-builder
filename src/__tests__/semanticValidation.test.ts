import { describe, expect, it } from 'vitest';
import type { ICharacterPower, IModifierDef, IPowerEffect } from '../entities/types';
import { validatePowerForSave } from '../shared/lib/semanticValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';

const DAMAGE_EFFECT: IPowerEffect = {
  id: 'damage',
  name: 'Damage',
  type: 'attack',
  baseCost: 1,
  action: 'standard',
  range: 'close',
  duration: 'instant',
  description: 'Inflicts damage',
  variableCost: null,
  extras: [],
  flaws: [],
};

const MODIFIER_DEFS: IModifierDef[] = [];

function makePower(alternateEffectNames: string[]): ICharacterPower {
  return {
    id: 'p1',
    name: 'Array',
    notes: '',
    components: [
      {
        id: 'c1',
        effectId: 'damage',
        ranks: 10,
        modifiers: [],
      },
    ],
    alternateEffects: alternateEffectNames.map((name, index) => ({
      id: `ae-${index}`,
      name,
      dynamic: false,
      notes: '',
      components: [
        {
          id: `ae-c-${index}`,
          effectId: 'damage',
          ranks: 8,
          modifiers: [],
        },
      ],
    })),
  };
}

describe('validatePowerForSave', () => {
  it('rejects a Dynamic base without a Dynamic Alternate Effect', () => {
    const power = { ...makePower([]), baseDynamic: true };
    const issues = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, {
      powerDefs: [DAMAGE_EFFECT],
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'baseDynamic', severity: 'error' }),
    ]));
  });

  it('rejects Permanent effects and direct Alternate Effect modifiers in arrays', () => {
    const power = makePower(['Alternate']);
    power.components[0].modifiers = [{ modifierId: 'permanent_flaw', ranks: 1 }];
    power.alternateEffects[0].components[0].modifiers = [{ modifierId: 'alternate_effect', ranks: 1 }];

    const issues = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, {
      powerDefs: [DAMAGE_EFFECT],
      modifierDefs: [
        ...MODIFIER_DEFS,
        { id: 'permanent_flaw', name: 'Permanent', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
        { id: 'alternate_effect', name: 'Alternate Effect', category: 'extra', costType: 'flat', costValue: 1, description: '', incompatibleWith: [] },
      ],
    });

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'components.0.modifiers.permanent_flaw' }),
      expect.objectContaining({ path: 'alternateEffects.0.components.0.modifiers.alternate_effect' }),
    ]));
  });

  it('rejects modifiers whose applicability conflicts with the source rules', () => {
    const power = makePower([]);
    power.components[0].modifiers = [
      { modifierId: 'affects_others', ranks: 1 },
      { modifierId: 'reduced_range', ranks: 1 },
    ];

    const issues = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, {
      powerDefs: [DAMAGE_EFFECT],
      modifierDefs: [
        { id: 'affects_others', name: 'Affects Others', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
        { id: 'reduced_range', name: 'Reduced Range', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
      ],
    });

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'components.0.modifiers.affects_others' }),
      expect.objectContaining({ path: 'components.0.modifiers.reduced_range' }),
    ]));
  });

  it('requires a trigger for Reaction and Triggered', () => {
    const power = makePower([]);
    power.components[0].modifiers = [
      { modifierId: 'reaction', ranks: 1 },
      { modifierId: 'triggered', ranks: 1 },
    ];

    const issues = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, {
      powerDefs: [DAMAGE_EFFECT],
      modifierDefs: [
        { id: 'reaction', name: 'Reaction', category: 'extra', costType: 'per_rank', costValue: 3, description: '', incompatibleWith: [] },
        { id: 'triggered', name: 'Triggered', category: 'extra', costType: 'flat_ranked', costValue: 1, description: '', incompatibleWith: [] },
      ],
    });

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'components.0.modifiers.reaction' }),
      expect.objectContaining({ path: 'components.0.modifiers.triggered' }),
    ]));
  });

  it('warns when an alternate effect name is empty', () => {
    const issues = validatePowerForSave(makePower(['']), DEFAULT_VALIDATION_RULES, {
      powerDefs: [DAMAGE_EFFECT],
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues).toContainEqual(expect.objectContaining({
      severity: 'warning',
      path: 'alternateEffects.0.name',
    }));
  });

  it('blocks duplicate alternate effect names case-insensitively', () => {
    const issues = validatePowerForSave(makePower(['Fire Blast', 'fire blast']), DEFAULT_VALIDATION_RULES, {
      powerDefs: [DAMAGE_EFFECT],
      modifierDefs: MODIFIER_DEFS,
    });

    expect(issues).toContainEqual(expect.objectContaining({
      severity: 'error',
      path: 'alternateEffects.1.name',
    }));
  });
});
