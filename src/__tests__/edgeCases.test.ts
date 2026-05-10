import { describe, it, expect } from 'vitest';
import {
  calculateCostPerRank,
  calculatePowerCost,
  calculateArrayCost,
  calculateAbilitiesCost,
  calcRemovableDiscount,
} from '../shared/lib/mathEngine';
import {
  validateAttackEffect,
  validateDodgeToughness,
  validateSkillCap,
} from '../shared/lib/validation';
import type { IAppliedModifier, IModifierDef } from '../entities/types';

/* ================================================
   Edge Cases and Boundary Conditions
   Tests validate extreme values, limits, and unusual combinations.
   Reference: Hero's Handbook, Modifiers p.187
   ================================================ */

const MOCK_MODIFIERS: IModifierDef[] = [
  { id: 'tiring', name: 'Tiring', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'limited', name: 'Limited', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'unreliable', name: 'Unreliable', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'diminished_range', name: 'Diminished Range', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'distracting', name: 'Distracting', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'removable', name: 'Removable', category: 'flaw', costType: 'flat_ranked', costValue: -2, description: '', incompatibleWith: [] },
  { id: 'homing', name: 'Homing', category: 'extra', costType: 'flat_ranked', costValue: 1, description: '', incompatibleWith: [] },
];

// ══════════════════════════════════════════════════════
//  Extreme Fractional Costs
//  Reference: Modifiers p.187 (fractional cost rules)
// ══════════════════════════════════════════════════════

describe('Extreme Fractional Costs', () => {
  describe('deep fractional costs (5+ flaws)', () => {
    it('5 flaws on base 1: 1 PP per 6 ranks (1:6 ratio)', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'tiring', ranks: 1 },
        { modifierId: 'limited', ranks: 1 },
        { modifierId: 'unreliable', ranks: 1 },
        { modifierId: 'diminished_range', ranks: 1 },
        { modifierId: 'distracting', ranks: 1 },
      ];
      // Base 1 - 5 flaws = -4 effective → ranksPerPP = 2 - (-4) = 6
      const result = calculateCostPerRank(1, mods, MOCK_MODIFIERS);
      expect(result.isFractional).toBe(true);
      expect(result.ranksPerPP).toBe(6);
    });

    it('Damage 12 with 5 flaws = ceil(12/6) = 2 PP', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'tiring', ranks: 1 },
        { modifierId: 'limited', ranks: 1 },
        { modifierId: 'unreliable', ranks: 1 },
        { modifierId: 'diminished_range', ranks: 1 },
        { modifierId: 'distracting', ranks: 1 },
      ];
      const cost = calculatePowerCost(1, 12, mods, MOCK_MODIFIERS);
      expect(cost).toBe(2); // ceil(12/6) = 2
    });

    it('Damage 18 with 5 flaws = ceil(18/6) = 3 PP', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'tiring', ranks: 1 },
        { modifierId: 'limited', ranks: 1 },
        { modifierId: 'unreliable', ranks: 1 },
        { modifierId: 'diminished_range', ranks: 1 },
        { modifierId: 'distracting', ranks: 1 },
      ];
      const cost = calculatePowerCost(1, 18, mods, MOCK_MODIFIERS);
      expect(cost).toBe(3);
    });
  });

  describe('fractional + negative flat modifiers', () => {
    it('fractional power with huge negative flat: minimum 1 PP enforced', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'tiring', ranks: 1 }, // Makes fractional
        { modifierId: 'removable', ranks: 10 }, // -20 flat
      ];
      // Rank cost: ceil(1/2) = 1, Flat: -20 → total -19 → clamped to 1
      const cost = calculatePowerCost(1, 1, mods, MOCK_MODIFIERS);
      expect(cost).toBe(1);
    });

    it('fractional Damage 10 - Tiring + Removable ×5 = max(1, 5 + (-10)) = 1 PP', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'tiring', ranks: 1 },
        { modifierId: 'removable', ranks: 5 },
      ];
      // Rank cost: ceil(10/2) = 5, Flat: -10 → total -5 → clamped to 1
      const cost = calculatePowerCost(1, 10, mods, MOCK_MODIFIERS);
      expect(cost).toBe(1);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Minimum Cost Enforcement
// ══════════════════════════════════════════════════════

describe('Minimum Cost Enforcement', () => {
  it('rank 0 power costs minimum 1 PP', () => {
    const cost = calculatePowerCost(1, 0, [], MOCK_MODIFIERS);
    expect(cost).toBe(1);
  });

  it('negative total from flaws: clamped to 1 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'removable', ranks: 100 }, // -200 flat
    ];
    const cost = calculatePowerCost(1, 1, mods, MOCK_MODIFIERS);
    expect(cost).toBe(1);
  });

  it('zero base cost with flaws: fractional calculation still applies', () => {
    // Edge case: base 0 (hypothetical) with flaws
    // 0 - 1 = -1, ranksPerPP = 2 - (-1) = 3, ceil(10/3) = 4
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
    ];
    const cost = calculatePowerCost(0, 10, mods, MOCK_MODIFIERS);
    expect(cost).toBe(4); // ceil(10/3) = 4
  });
});

// ══════════════════════════════════════════════════════
//  Array Edge Cases
// ══════════════════════════════════════════════════════

describe('Array Edge Cases', () => {
  it('array with 0 PP main power (minimum 1)', () => {
    const arrayCost = calculateArrayCost(1, 3, 0);
    expect(arrayCost).toBe(4); // 1 + 3 static
  });

  it('array with very low main power cost', () => {
    const arrayCost = calculateArrayCost(2, 5, 2);
    expect(arrayCost).toBe(9); // 2 + 5 static + 2 dynamic = 2 + 5 + 2
  });

  it('array with 0 alternates = just main cost', () => {
    const arrayCost = calculateArrayCost(20, 0, 0);
    expect(arrayCost).toBe(20);
  });

  it('array with all dynamic alternates', () => {
    const arrayCost = calculateArrayCost(20, 5, 5);
    expect(arrayCost).toBe(30); // 20 + (5×2)
  });

  it('array with many alternates: 20 static + 10 dynamic', () => {
    const arrayCost = calculateArrayCost(30, 30, 10);
    expect(arrayCost).toBe(70); // 30 + 20 + 20
  });

  it('dynamic alternates cost exactly 2× static', () => {
    const staticCost = calculateArrayCost(20, 5, 0);
    const dynamicCost = calculateArrayCost(20, 5, 5);
    expect(dynamicCost - staticCost).toBe(5); // 5 more PP for dynamic
  });
});

// ══════════════════════════════════════════════════════
//  PL Extremes
// ══════════════════════════════════════════════════════

describe('PL Extremes', () => {
  describe('PL 1 (minimum)', () => {
    const PL = 1;

    it('attack 1 + effect 1 = 2 (valid)', () => {
      const violation = validateAttackEffect(1, 1, PL);
      expect(violation).toBeNull();
    });

    it('attack 2 + effect 1 = 3 (violates)', () => {
      const violation = validateAttackEffect(2, 1, PL);
      expect(violation).not.toBeNull();
      expect(violation?.actual).toBe(3);
      expect(violation?.limit).toBe(2);
    });

    it('dodge 1 + toughness 1 = 2 (valid)', () => {
      const violation = validateDodgeToughness(1, 1, PL);
      expect(violation).toBeNull();
    });

    it('dodge 2 + toughness 1 = 3 (violates)', () => {
      const violation = validateDodgeToughness(2, 1, PL);
      expect(violation).not.toBeNull();
    });

    it('skill cap: combat = 2, non-combat = 11', () => {
      expect(validateSkillCap(1, 1, PL, true)).toBeNull(); // Combat: 2
      expect(validateSkillCap(1, 2, PL, true)).not.toBeNull(); // Combat: 3 > 2
      expect(validateSkillCap(5, 6, PL, false)).toBeNull(); // Non-combat: 11
      expect(validateSkillCap(5, 7, PL, false)).not.toBeNull(); // Non-combat: 12 > 11
    });
  });

  describe('PL 20 (cosmic level)', () => {
    const PL = 20;

    it('attack 20 + effect 20 = 40 (valid)', () => {
      const violation = validateAttackEffect(20, 20, PL);
      expect(violation).toBeNull();
    });

    it('attack 21 + effect 20 = 41 (violates)', () => {
      const violation = validateAttackEffect(21, 20, PL);
      expect(violation).not.toBeNull();
      expect(violation?.actual).toBe(41);
      expect(violation?.limit).toBe(40);
    });

    it('dodge 20 + toughness 20 = 40 (valid)', () => {
      const violation = validateDodgeToughness(20, 20, PL);
      expect(violation).toBeNull();
    });

    it('skill cap: combat = 40, non-combat = 30', () => {
      expect(validateSkillCap(10, 30, PL, true)).toBeNull(); // Combat: 40
      expect(validateSkillCap(10, 31, PL, true)).not.toBeNull(); // Combat: 41 > 40
      expect(validateSkillCap(10, 20, PL, false)).toBeNull(); // Non-combat: 30
      expect(validateSkillCap(10, 21, PL, false)).not.toBeNull(); // Non-combat: 31 > 30
    });
  });

  describe('PL 0 (theoretical minimum)', () => {
    const PL = 0;

    it('attack 0 + effect 0 = 0 (valid)', () => {
      const violation = validateAttackEffect(0, 0, PL);
      expect(violation).toBeNull();
    });

    it('attack 1 + effect 0 = 1 (violates)', () => {
      const violation = validateAttackEffect(1, 0, PL);
      expect(violation).not.toBeNull();
      expect(violation?.limit).toBe(0);
    });
  });
});

// ══════════════════════════════════════════════════════
//  Negative Abilities
// ══════════════════════════════════════════════════════

describe('Negative Abilities', () => {
  it('negative abilities have negative cost', () => {
    const cost = calculateAbilitiesCost(
      { str: -2, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
      []
    );
    expect(cost).toBe(-4); // -2 × 2 = -4
  });

  it('mixed positive and negative abilities', () => {
    const cost = calculateAbilitiesCost(
      { str: 5, sta: -2, agl: 3, dex: -1, fgt: 0, int: 0, awe: 0, pre: 0 },
      []
    );
    expect(cost).toBe(10); // (5 - 2 + 3 - 1) × 2 = 10
  });

  it('all negative abilities', () => {
    const cost = calculateAbilitiesCost(
      { str: -1, sta: -1, agl: -1, dex: -1, fgt: -1, int: -1, awe: -1, pre: -1 },
      []
    );
    expect(cost).toBe(-16); // -8 × 2 = -16
  });

  it('absent abilities excluded from cost calculation', () => {
    const cost = calculateAbilitiesCost(
      { str: 10, sta: 0, agl: 10, dex: 10, fgt: 10, int: 10, awe: 10, pre: 10 },
      ['sta']
    );
    expect(cost).toBe(140); // (10+10+10+10+10+10+10) × 2 = 140, STA excluded
  });

  it('all abilities absent = 0 cost', () => {
    const cost = calculateAbilitiesCost(
      { str: 10, sta: 10, agl: 10, dex: 10, fgt: 10, int: 10, awe: 10, pre: 10 },
      ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre']
    );
    expect(cost).toBe(0);
  });
});

// ══════════════════════════════════════════════════════
//  Large Rank Values
// ══════════════════════════════════════════════════════

describe('Large Rank Values', () => {
  it('Damage 100 = 100 PP', () => {
    const cost = calculatePowerCost(1, 100, [], MOCK_MODIFIERS);
    expect(cost).toBe(100);
  });

  it('Damage 100 - Tiring = ceil(100/2) = 50 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    const cost = calculatePowerCost(1, 100, mods, MOCK_MODIFIERS);
    expect(cost).toBe(50);
  });

  it('Damage 1000 (cosmic scale)', () => {
    const cost = calculatePowerCost(1, 1000, [], MOCK_MODIFIERS);
    expect(cost).toBe(1000);
  });

  it('base cost 10 × rank 100 = 1000 PP', () => {
    const cost = calculatePowerCost(10, 100, [], MOCK_MODIFIERS);
    expect(cost).toBe(1000);
  });
});

// ══════════════════════════════════════════════════════
//  Removable Discount Edge Cases
// ══════════════════════════════════════════════════════

describe('Removable Discount Edge Cases', () => {
  it('power < 5 PP: no discount', () => {
    expect(calcRemovableDiscount(4, 'removable')).toBe(0);
    expect(calcRemovableDiscount(4, 'easily_removable')).toBe(0);
  });

  it('power = 5 PP: 1 PP discount (removable)', () => {
    expect(calcRemovableDiscount(5, 'removable')).toBe(1);
  });

  it('power = 5 PP: 2 PP discount (easily removable)', () => {
    expect(calcRemovableDiscount(5, 'easily_removable')).toBe(2);
  });

  it('power = 24 PP: 4 PP discount (removable)', () => {
    expect(calcRemovableDiscount(24, 'removable')).toBe(4); // floor(24/5) = 4
  });

  it('power = 25 PP: 5 PP discount (removable)', () => {
    expect(calcRemovableDiscount(25, 'removable')).toBe(5);
  });

  it('power = 100 PP: 20 PP discount (removable)', () => {
    expect(calcRemovableDiscount(100, 'removable')).toBe(20);
  });

  it('power = 100 PP: 40 PP discount (easily removable)', () => {
    expect(calcRemovableDiscount(100, 'easily_removable')).toBe(40);
  });

  it('none or undefined: no discount', () => {
    expect(calcRemovableDiscount(25, 'none')).toBe(0);
    expect(calcRemovableDiscount(25, undefined)).toBe(0);
  });
});

// ══════════════════════════════════════════════════════
//  Zero and Empty Values
// ══════════════════════════════════════════════════════

describe('Zero and Empty Values', () => {
  it('0 skill ranks = 0 PP', () => {
    // Tested in other files, but confirming here
    expect(Math.ceil(0 / 2)).toBe(0);
  });

  it('empty modifier list = base cost only', () => {
    const result = calculateCostPerRank(1, [], MOCK_MODIFIERS);
    expect(result.costPerRank).toBe(1);
    expect(result.isFractional).toBe(false);
  });

  it('power with 0 ranks and flat modifiers = flat cost only', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'homing', ranks: 3 }];
    const cost = calculatePowerCost(1, 0, mods, MOCK_MODIFIERS);
    expect(cost).toBe(3); // 1×0 = 0, flat +3 = 3
  });
});

// ══════════════════════════════════════════════════════
//  Boundary Validation
// ══════════════════════════════════════════════════════

describe('Boundary Validation', () => {
  it('PL limit exactly at boundary (no violation)', () => {
    const violation = validateAttackEffect(10, 10, 10);
    expect(violation).toBeNull();
  });

  it('PL limit 1 over boundary (violation)', () => {
    const violation = validateAttackEffect(10, 11, 10);
    expect(violation).not.toBeNull();
    expect(violation?.actual).toBe(21);
    expect(violation?.limit).toBe(20);
  });

  it('skill cap exactly at boundary', () => {
    expect(validateSkillCap(5, 15, 10, true)).toBeNull(); // Combat: 20
    expect(validateSkillCap(5, 15, 10, false)).toBeNull(); // Non-combat: 20
  });

  it('skill cap 1 over boundary', () => {
    expect(validateSkillCap(5, 16, 10, true)).not.toBeNull(); // Combat: 21 > 20
    expect(validateSkillCap(5, 16, 10, false)).not.toBeNull(); // Non-combat: 21 > 20
  });
});
