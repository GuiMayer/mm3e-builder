import { describe, it, expect } from 'vitest';
import {
  validatePowerSpecificModifiers,
  validateComponentModifiers,
} from '../shared/lib/modifierValidation';
import type {
  ICharacterPowerComponent,
  IPowerEffect,
  IModifierDef,
  IValidationRules,
} from '../entities/types';

// ── Mock universal modifiers ──
const UNIVERSAL_MODS: IModifierDef[] = [
  { id: 'ranged', name: 'Ranged', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'area', name: 'Area', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'accurate', name: 'Accurate', category: 'extra', costType: 'flat_ranked', costValue: 1, description: '', incompatibleWith: [], maxRanks: 5 },
  { id: 'tiring', name: 'Tiring', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
];

// ── Mock power effects ──
const FLIGHT_EFFECT: IPowerEffect = {
  id: 'flight',
  name: 'Flight',
  type: 'movement',
  baseCost: 2,
  action: 'free',
  range: 'personal',
  duration: 'sustained',
  description: 'Fly through the air',
  variableCost: null,
  extras: [
    { id: 'aquatic', name: 'Aquatic', category: 'extra', costType: 'flat', costValue: 1, description: 'Swim as fast as you fly', incompatibleWith: [] },
    { id: 'continuous', name: 'Continuous', category: 'extra', costType: 'per_rank', costValue: 1, description: 'Stays active when incapacitated', incompatibleWith: [] },
    { id: 'subtle', name: 'Subtle', category: 'extra', costType: 'flat', costValue: 1, description: 'Less noticeable', incompatibleWith: [], maxRanks: 2 },
  ],
  flaws: [
    { id: 'concentration', name: 'Concentration', category: 'flaw', costType: 'per_rank', costValue: -1, description: 'Requires focus', incompatibleWith: [] },
    { id: 'distracting', name: 'Distracting', category: 'flaw', costType: 'per_rank', costValue: -1, description: 'Vulnerable while flying', incompatibleWith: [] },
    { id: 'gliding', name: 'Gliding', category: 'flaw', costType: 'per_rank', costValue: -1, description: 'Must glide', incompatibleWith: [] },
  ],
  i18n: {},
};

const DAMAGE_EFFECT: IPowerEffect = {
  id: 'damage',
  name: 'Damage',
  type: 'attack',
  baseCost: 1,
  action: 'standard',
  range: 'close',
  duration: 'instant',
  description: 'Deal damage',
  variableCost: null,
  extras: [],  // No power-specific extras
  flaws: [],  // No power-specific flaws
  i18n: {},
};

// ── Helper to create component ──
function makeComponent(effectId: string, ranks: number, modifiers: { modifierId: string; ranks: number }[]): ICharacterPowerComponent {
  return {
    id: 'comp-1',
    effectId,
    ranks,
    modifiers: modifiers.map((m) => ({ modifierId: m.modifierId, ranks: m.ranks })),
  };
}

// ══════════════════════════════════════════════════════
//  1. validatePowerSpecificModifiers — Core validation
// ══════════════════════════════════════════════════════

describe('validatePowerSpecificModifiers', () => {
  it('allows universal modifiers on any power', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'ranged', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('allows power-specific extras on the correct power', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('allows power-specific flaws on the correct power', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'gliding', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('allows mixing universal and power-specific modifiers', () => {
    const comp = makeComponent('flight', 5, [
      { modifierId: 'ranged', ranks: 1 },      // universal
      { modifierId: 'aquatic', ranks: 1 },     // power-specific extra
      { modifierId: 'gliding', ranks: 1 },     // power-specific flaw
    ]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('warns when power-specific modifier is used on wrong power', () => {
    // Trying to use Flight's "aquatic" on Damage
    const comp = makeComponent('damage', 10, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, DAMAGE_EFFECT, UNIVERSAL_MODS);
    
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('power_specific');
    expect(violations[0].modifierId).toBe('aquatic');
    expect(violations[0].severity).toBe('warning');
    expect(violations[0].message).toContain('not valid for Damage');
  });

  it('warns for multiple invalid power-specific modifiers', () => {
    // Trying to use Flight's modifiers on Damage
    const comp = makeComponent('damage', 10, [
      { modifierId: 'aquatic', ranks: 1 },
      { modifierId: 'gliding', ranks: 1 },
    ]);
    const violations = validatePowerSpecificModifiers(comp, DAMAGE_EFFECT, UNIVERSAL_MODS);
    
    expect(violations).toHaveLength(2);
    expect(violations[0].modifierId).toBe('aquatic');
    expect(violations[1].modifierId).toBe('gliding');
  });

  it('allows all universal modifiers even on powers with no power-specific modifiers', () => {
    const comp = makeComponent('damage', 10, [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'accurate', ranks: 2 },
      { modifierId: 'tiring', ranks: 1 },
    ]);
    const violations = validatePowerSpecificModifiers(comp, DAMAGE_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('handles unknown modifier IDs gracefully', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'nonexistent_mod', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    
    expect(violations).toHaveLength(1);
    expect(violations[0].modifierId).toBe('nonexistent_mod');
    expect(violations[0].message).toContain('not valid for Flight');
  });
});

// ══════════════════════════════════════════════════════
//  2. Integration with validateComponentModifiers
// ══════════════════════════════════════════════════════

describe('validateComponentModifiers with enforcePowerSpecificModifiers', () => {
  const validationRulesEnabled: IValidationRules = {
    enforceIncompatibleModifiers: false,
    enforceModifierMaxRanks: false,
    enforceAccuratePLCap: false,
    enforcePowerSpecificModifiers: true,  // ENABLED
    enforceAfflictionProgression: false,
    enforceAbsentAbilityRestrictions: false,
    plTradeOffsAsErrors: false,
    enforceTrainedOnlySkills: false,
    enforceSkillAbilityRequirements: false,
    enforcePLLimits: true,
    enforcePPBudget: true,
    enforceMinimumAbilityScore: true,
    enforceAlternateEffectCap: true,
    enforceEquipmentPPLimit: true,
    enforceRequiredPowerFields: false,
  };

  const validationRulesDisabled: IValidationRules = {
    ...validationRulesEnabled,
    enforcePowerSpecificModifiers: false,  // DISABLED
  };

  it('validates power-specific modifiers when rule is enabled', () => {
    const comp = makeComponent('damage', 10, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validateComponentModifiers(
      comp,
      DAMAGE_EFFECT,
      UNIVERSAL_MODS,
      validationRulesEnabled
    );
    
    expect(violations).toHaveLength(1);
    expect(violations[0].type).toBe('power_specific');
  });

  it('skips power-specific validation when rule is disabled', () => {
    const comp = makeComponent('damage', 10, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validateComponentModifiers(
      comp,
      DAMAGE_EFFECT,
      UNIVERSAL_MODS,
      validationRulesDisabled
    );
    
    expect(violations).toHaveLength(0);
  });

  it('combines power-specific validation with other validations', () => {
    const allRulesEnabled: IValidationRules = {
      enforceIncompatibleModifiers: true,
      enforceModifierMaxRanks: true,
      enforceAccuratePLCap: false,
      enforcePowerSpecificModifiers: true,
      enforceAfflictionProgression: false,
      enforceAbsentAbilityRestrictions: false,
      plTradeOffsAsErrors: false,
      enforceTrainedOnlySkills: false,
      enforceSkillAbilityRequirements: false,
      enforcePLLimits: true,
      enforcePPBudget: true,
      enforceRequiredPowerFields: false,
      enforceMinimumAbilityScore: true,
      enforceAlternateEffectCap: true,
      enforceEquipmentPPLimit: true,
    };

    // Component with: invalid power-specific modifier + exceeds maxRanks
    const comp = makeComponent('damage', 10, [
      { modifierId: 'aquatic', ranks: 1 },    // invalid for Damage
      { modifierId: 'accurate', ranks: 10 },  // exceeds maxRanks (5)
    ]);

    const violations = validateComponentModifiers(
      comp,
      DAMAGE_EFFECT,
      UNIVERSAL_MODS,
      allRulesEnabled
    );
    
    expect(violations.length).toBeGreaterThanOrEqual(2);
    expect(violations.some((v) => v.type === 'power_specific')).toBe(true);
    expect(violations.some((v) => v.type === 'max_ranks')).toBe(true);
  });
});

// ══════════════════════════════════════════════════════
//  3. Real-world scenarios from Phase 2 modifiers
// ══════════════════════════════════════════════════════

describe('Real M&M 3e Power-Specific Modifier Scenarios', () => {
  it('Flight with Aquatic extra (valid)', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('Flight with Gliding flaw (valid)', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'gliding', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('Flight with Continuous + Subtle (valid power-specific extras)', () => {
    const comp = makeComponent('flight', 5, [
      { modifierId: 'continuous', ranks: 1 },
      { modifierId: 'subtle', ranks: 2 },
    ]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('Damage with Aquatic (invalid - Flight-specific)', () => {
    const comp = makeComponent('damage', 10, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, DAMAGE_EFFECT, UNIVERSAL_MODS);
    
    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain('not valid for Damage');
    expect(violations[0].modifierId).toBe('aquatic');
  });

  it('Damage with universal modifiers only (valid)', () => {
    const comp = makeComponent('damage', 10, [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'accurate', ranks: 2 },
    ]);
    const violations = validatePowerSpecificModifiers(comp, DAMAGE_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════
//  4. Edge cases
// ══════════════════════════════════════════════════════

describe('Power-Specific Validation Edge Cases', () => {
  it('handles power with no extras or flaws arrays', () => {
    const minimalEffect: IPowerEffect = {
      id: 'minimal',
      name: 'Minimal',
      type: 'general',
      baseCost: 1,
      action: 'standard',
      range: 'personal',
      duration: 'instant',
      description: 'Minimal effect',
      variableCost: null,
      extras: [],
      flaws: [],
      i18n: {},
    };

    const comp = makeComponent('minimal', 5, [{ modifierId: 'ranged', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, minimalEffect, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);  // Universal modifiers still allowed
  });

  it('handles component with no modifiers', () => {
    const comp = makeComponent('flight', 5, []);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, UNIVERSAL_MODS);
    expect(violations).toHaveLength(0);
  });

  it('handles empty universal modifiers list', () => {
    const comp = makeComponent('flight', 5, [{ modifierId: 'aquatic', ranks: 1 }]);
    const violations = validatePowerSpecificModifiers(comp, FLIGHT_EFFECT, []);
    expect(violations).toHaveLength(0);  // Power-specific still allowed
  });
});
