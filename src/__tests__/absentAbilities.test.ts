import { describe, it, expect } from 'vitest';
import {
  calculateAbilitiesCost,
  calcToughnessBonus,
  calcInitiativeBonus,
} from '../shared/lib/mathEngine';
import type { Abilities } from '../entities/types';

/**
 * Absent Abilities Validation Tests
 * 
 * Tests validation rules for characters with absent abilities (constructs, robots, etc.)
 * 
 * References:
 * - Hero's Handbook p.16-17 (Absent Abilities)
 * - Hero's Handbook p.24 (Derived Stats)
 */

describe('Absent Abilities - Cost Calculation', () => {
  it('absent STA grants the fixed -10 PP cost', () => {
    const abilities: Abilities = {
      str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta']);
    expect(cost).toBe(-10);
  });

  it('combines the fixed absent ability cost with purchased abilities', () => {
    const abilities: Abilities = {
      str: 5, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta']);
    // STR 5 × 2 = 10, STA absent = -10 → 0 PP
    expect(cost).toBe(0);
  });

  it('applies the fixed cost to any absent ability', () => {
    const abilities: Abilities = {
      str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['pre']);
    expect(cost).toBe(-10);
  });

  it('stacks the fixed cost for multiple absent abilities', () => {
    const abilities: Abilities = {
      str: 8, sta: 0, agl: 2, dex: 2, fgt: 6, int: 4, awe: 2, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta', 'pre']);
    // (8 + 2 + 2 + 6 + 4 + 2) × 2 - 20 = 28 PP
    expect(cost).toBe(28);
  });

  it('all abilities absent cost -80 PP regardless of preserved ranks', () => {
    const abilities: Abilities = {
      str: 10, sta: 10, agl: 10, dex: 10, fgt: 10, int: 10, awe: 10, pre: 10,
    };
    const cost = calculateAbilitiesCost(abilities, ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre']);
    expect(cost).toBe(-80);
  });
});

describe('Absent Abilities - Derived Stats', () => {
  describe('Toughness with absent STA', () => {
    it('absent STA: Toughness = Protection only (no STA bonus)', () => {
      // Create a power with Protection 10
      const powers = [{
        id: 'p1',
        name: 'Protection',
        components: [{ id: 'c1', effectId: 'protection', ranks: 10, modifiers: [] }],
        alternateEffects: [],
        notes: '',
      }];
      const advantages: { advantageId: string; ranks: number }[] = [];
      const powerDefs = [
        { id: 'protection', name: 'Protection', baseCost: 1, type: 'defense', 
          action: 'none', range: 'personal', duration: 'permanent',
          enhancesDefense: 'toughness', description: '', variableCost: null, extras: [], flaws: [] }
      ];
      
      const result = calcToughnessBonus(powers, advantages, powerDefs as any);
      // 0 (STA absent) + 10 (Protection) = 10
      expect(result.bonus).toBe(10);
    });

    it('absent STA with Defensive Roll: Toughness = Protection + Defensive Roll', () => {
      const powers = [{
        id: 'p1',
        name: 'Protection',
        components: [{ id: 'c1', effectId: 'protection', ranks: 8, modifiers: [] }],
        alternateEffects: [],
        notes: '',
      }];
      const advantages = [{ advantageId: 'defensive_roll', ranks: 4 }];
      const powerDefs = [
        { id: 'protection', name: 'Protection', baseCost: 1, type: 'defense',
          action: 'none', range: 'personal', duration: 'permanent',
          enhancesDefense: 'toughness', description: '', variableCost: null, extras: [], flaws: [] }
      ];
      
      const result = calcToughnessBonus(powers, advantages, powerDefs as any);
      // 0 (STA absent) + 8 (Protection) + 4 (Defensive Roll) = 12
      expect(result.bonus).toBe(12);
    });

    it('normal STA: Toughness = STA + Protection + Defensive Roll', () => {
      const powers = [{
        id: 'p1',
        name: 'Protection',
        components: [{ id: 'c1', effectId: 'protection', ranks: 5, modifiers: [] }],
        alternateEffects: [],
        notes: '',
      }];
      const advantages = [{ advantageId: 'defensive_roll', ranks: 2 }];
      const powerDefs = [
        { id: 'protection', name: 'Protection', baseCost: 1, type: 'defense',
          action: 'none', range: 'personal', duration: 'permanent',
          enhancesDefense: 'toughness', description: '', variableCost: null, extras: [], flaws: [] }
      ];
      
      const result = calcToughnessBonus(powers, advantages, powerDefs as any);
      // Note: STA is added separately in the character sheet, not in calcToughnessBonus
      // calcToughnessBonus only returns Protection + Defensive Roll
      // 5 (Protection) + 2 (Defensive Roll) = 7
      expect(result.bonus).toBe(7);
    });

    it('does not count alternate effect Protection as passive Toughness', () => {
      const powers = [{
        id: 'p1',
        name: 'Force Field Array',
        components: [{ id: 'c1', effectId: 'protection', ranks: 4, modifiers: [] }],
        alternateEffects: [{
          id: 'ae1',
          name: 'Emergency Shield',
          components: [{ id: 'c2', effectId: 'protection', ranks: 10, modifiers: [] }],
          dynamic: false,
          notes: '',
        }],
        notes: '',
      }];
      const advantages: { advantageId: string; ranks: number }[] = [];
      const powerDefs = [
        { id: 'protection', name: 'Protection', baseCost: 1, type: 'defense',
          action: 'none', range: 'personal', duration: 'permanent',
          enhancesDefense: 'toughness', description: '', variableCost: null, extras: [], flaws: [] }
      ];

      const result = calcToughnessBonus(powers, advantages, powerDefs as any);
      expect(result.bonus).toBe(4);
      expect(result.breakdown).toEqual(['Force Field Array 4']);
    });
  });

  describe('Initiative with absent AGL', () => {
    it('absent AGL: Initiative = Improved Initiative only', () => {
      const agility = 0; // absent
      const advantages = [{ advantageId: 'improved_initiative', ranks: 2 }];
      const powers: any[] = [];
      const powerDefs: any[] = [];
      
      const result = calcInitiativeBonus(agility, advantages, powers, powerDefs);
      // 0 (AGL) + 2×4 (Improved Init) = 8
      expect(result.total).toBe(8);
    });

    it('normal AGL: Initiative = AGL + Improved Initiative + Enhanced Initiative', () => {
      const agility = 5;
      const advantages = [{ advantageId: 'improved_initiative', ranks: 1 }];
      const powers = [{
        id: 'p1',
        name: 'Enhanced Initiative',
        components: [{ id: 'c1', effectId: 'enhanced_initiative', ranks: 3, modifiers: [] }],
        alternateEffects: [],
        notes: '',
      }];
      const powerDefs = [
        { id: 'enhanced_initiative', name: 'Enhanced Initiative', baseCost: 1, type: 'general',
          action: 'none', range: 'personal', duration: 'permanent',
          description: '', variableCost: null, extras: [], flaws: [] }
      ];
      
      const result = calcInitiativeBonus(agility, advantages, powers, powerDefs as any);
      // 5 (AGL) + 1×4 (Improved Init) + 3 (Enhanced Init) = 12
      expect(result.total).toBe(12);
    });
  });
});

describe('Absent Abilities - Real Character Examples', () => {
  it('Robot (absent STA, PRE): correct cost calculation', () => {
    const abilities: Abilities = {
      str: 8, sta: 0, agl: 2, dex: 2, fgt: 6, int: 4, awe: 2, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta', 'pre']);
    // (8 + 2 + 2 + 6 + 4 + 2) × 2 - 20 = 28 PP
    expect(cost).toBe(28);
  });

  it('Construct (absent STA, INT, AWE, PRE): correct cost calculation', () => {
    const abilities: Abilities = {
      str: 10, sta: 0, agl: 0, dex: 0, fgt: 8, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta', 'int', 'awe', 'pre']);
    // (10 + 0 + 0 + 8) × 2 - 40 = -4 PP
    expect(cost).toBe(-4);
  });

  it('Undead (absent STA, PRE): correct cost calculation', () => {
    const abilities: Abilities = {
      str: 6, sta: 0, agl: 3, dex: 3, fgt: 5, int: 2, awe: 2, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta', 'pre']);
    // (6 + 3 + 3 + 5 + 2 + 2) × 2 - 20 = 22 PP
    expect(cost).toBe(22);
  });

  it('Energy Being (absent STR, STA): correct cost calculation', () => {
    const abilities: Abilities = {
      str: 0, sta: 0, agl: 5, dex: 5, fgt: 4, int: 3, awe: 4, pre: 3,
    };
    const cost = calculateAbilitiesCost(abilities, ['str', 'sta']);
    // (5 + 5 + 4 + 3 + 4 + 3) × 2 - 20 = 28 PP
    expect(cost).toBe(28);
  });
});

describe('Absent Abilities - Edge Cases', () => {
  it('negative ability with absent flag: fixed cost overrides its stored rank', () => {
    const abilities: Abilities = {
      str: -2, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['str']);
    expect(cost).toBe(-10);
  });

  it('absent ability with high stored value: fixed cost overrides its rank', () => {
    const abilities: Abilities = {
      str: 10, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['str']);
    expect(cost).toBe(-10);
  });

  it('mixed positive and negative with absent: correct calculation', () => {
    const abilities: Abilities = {
      str: 8, sta: 0, agl: -2, dex: 3, fgt: 5, int: 0, awe: 0, pre: 0,
    };
    const cost = calculateAbilitiesCost(abilities, ['sta', 'int', 'awe', 'pre']);
    // (8 + (-2) + 3 + 5) × 2 - 40 = -12 PP
    expect(cost).toBe(-12);
  });
});

describe('Absent Abilities - Validation Warnings (Future)', () => {
  // These tests document expected behavior for future validation implementation
  // Currently, the system allows these combinations but should warn users

  it.todo('Athletics skill with absent STR: should warn user');
  it.todo('Acrobatics skill with absent AGL: should warn user');
  it.todo('Ranged Combat skill with absent DEX: should warn user');
  it.todo('Close Combat skill with absent FGT: should warn user');
  it.todo('Perception skill with absent AWE: should warn user');
  it.todo('Persuasion skill with absent PRE: should warn user');
  it.todo('Technology skill with absent INT: should warn user');
  
  it.todo('STR-based power (Damage close) with absent STR: should warn');
  it.todo('Dodge defense with absent AGL: should warn about low base');
  it.todo('Fortitude defense with absent STA: should warn about low base');
});
