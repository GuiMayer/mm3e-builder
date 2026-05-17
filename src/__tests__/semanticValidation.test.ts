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
