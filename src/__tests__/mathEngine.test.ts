import { describe, it, expect } from 'vitest';
import {
  calcComponentCost,
  calculateCostPerRank,
  calculatePowerCost,
  calculateArrayCost,
  getComponentCostBreakdown,
  getPerRankModifierCost,
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcRemovableDiscount,
  calcPowerTotalCost,
} from '../shared/lib/mathEngine';
import type { IAppliedModifier, IModifierDef, ICharacterPower } from '../entities/types';

// ── Mock modifier definitions ──
const MODS: IModifierDef[] = [
  { id: 'ranged', name: 'Ranged', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'area', name: 'Area', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'tiring', name: 'Tiring', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'limited', name: 'Limited', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'homing', name: 'Homing', category: 'extra', costType: 'flat_ranked', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'removable', name: 'Removable', category: 'flaw', costType: 'flat_ranked', costValue: -2, description: '', incompatibleWith: [] },
  { id: 'affects_objects', name: 'Affects Objects', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
];

describe('mathEngine', () => {
  describe('calculateCostPerRank', () => {
    it('returns base cost with no modifiers', () => {
      const result = calculateCostPerRank(1, [], MODS);
      expect(result).toEqual({ costPerRank: 1, isFractional: false, ranksPerPP: 1 });
    });

    it('adds extras per rank', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
      const result = calculateCostPerRank(1, mods, MODS);
      expect(result.costPerRank).toBe(2);
      expect(result.isFractional).toBe(false);
    });

    it('subtracts flaws per rank', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
      const result = calculateCostPerRank(1, mods, MODS);
      // 1 - 1 = 0, which goes fractional: 1 PP per 2 ranks
      expect(result.isFractional).toBe(true);
      expect(result.ranksPerPP).toBe(2);
    });

    it('handles deeply fractional cost (2 flaws on base 1)', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'tiring', ranks: 1 },
        { modifierId: 'limited', ranks: 1 },
      ];
      const result = calculateCostPerRank(1, mods, MODS);
      // 1 - 1 - 1 = -1 → ranksPerPP = 2 - (-1) = 3
      expect(result.isFractional).toBe(true);
      expect(result.ranksPerPP).toBe(3);
    });

    it('handles affects_objects with affectsOnlyObjects flag', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'affects_objects', ranks: 1, options: { affectsOnlyObjects: true } }];
      const result = calculateCostPerRank(1, mods, MODS);
      // Base 1 + 0 = 1 costPerRank
      expect(result.costPerRank).toBe(1);
    });

    it('handles affects_objects without flag (default cost +1)', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'affects_objects', ranks: 1 }];
      const result = calculateCostPerRank(1, mods, MODS);
      // Base 1 + 1 = 2 costPerRank
      expect(result.costPerRank).toBe(2);
    });
  });

  describe('calculatePowerCost', () => {
    it('Dano 10 + Alcance + Área - Cansativo = 20 PP', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'area', ranks: 1 },
        { modifierId: 'tiring', ranks: 1 },
      ];
      // Base 1 + 1 + 1 - 1 = 2 per rank × 10 ranks = 20
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(20);
    });

    it('Dano 10 simples = 10 PP', () => {
      const cost = calculatePowerCost(1, 10, [], MODS);
      expect(cost).toBe(10);
    });

    it('fractional power: base 1 - 1 flaw, rank 10 = 5 PP', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
      // 1 - 1 = 0 → fractional, 1 PP per 2 ranks → ceil(10/2) = 5
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(5);
    });

    it('includes flat ranked modifiers', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'homing', ranks: 3 }];
      // flat_ranked: 1×3 = 3 flat bonus
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(13);
    });

  it('minimum cost is 1 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'removable', ranks: 5 }];
    // flat_ranked: 1×rank, -2×5 = -10. Base 1×1 = 1. 1 + (-10) = -9 → clamped to 1
    const cost = calculatePowerCost(1, 1, mods, MODS);
    expect(cost).toBe(1);
  });
  });

  describe('calculateArrayCost', () => {
    it('main 20 PP + 2 static alts + 1 dynamic = 24 PP', () => {
      expect(calculateArrayCost(20, 3, 1)).toBe(24);
    });

    it('adds 1 PP when the base effect is Dynamic', () => {
      expect(calculateArrayCost(20, 1, 1, true)).toBe(23);
    });
  });

  describe('variable and ranked-flat costs', () => {
    const enhancedSkill = {
      id: 'enhanced-trait', name: 'Enhanced Trait', baseCost: 1, type: 'general',
      action: 'free', range: 'personal', duration: 'sustained', description: '',
      variableCost: { options: [{ name: 'Enhanced Skill', cost: 0.5 }] }, extras: [], flaws: [],
    } as unknown as import('../entities/types').IPowerEffect;
    const immunity = {
      id: 'immunity', name: 'Immunity', baseCost: 1, type: 'defense',
      action: 'none', range: 'personal', duration: 'permanent', description: '',
      variableCost: { costType: 'flat', options: [{ name: 'Life support', cost: 10 }] }, extras: [], flaws: [],
    } as unknown as import('../entities/types').IPowerEffect;

    it('charges Enhanced Skill at one point per two ranks', () => {
      expect(calcComponentCost(
        { id: 'c1', effectId: 'enhanced-trait', ranks: 2, modifiers: [], variableCostOption: 'Enhanced Skill' },
        enhancedSkill,
        MODS,
      )).toBe(1);
    });

    it('uses a selected Immunity package once rather than once per component rank', () => {
      expect(calcComponentCost(
        { id: 'c1', effectId: 'immunity', ranks: 1, modifiers: [], variableCostOption: 'Life support' },
        immunity,
        MODS,
      )).toBe(10);
    });

    it('scales ranked flat modifiers by their modifier ranks', () => {
      const subtle = { id: 'subtle', name: 'Subtle', category: 'extra', costType: 'flat', costValue: 1, maxRanks: 2, description: '', incompatibleWith: [] } as IModifierDef;
      expect(calcComponentCost(
        { id: 'c1', effectId: 'damage', ranks: 10, modifiers: [{ modifierId: 'subtle', ranks: 2 }] },
        { id: 'damage', name: 'Damage', baseCost: 1, type: 'attack', action: 'standard', range: 'close', duration: 'instant', description: '', variableCost: null, extras: [], flaws: [] },
        [subtle],
      )).toBe(12);
    });

    it('charges a modifier only for the effect ranks it covers', () => {
      const damage = { id: 'damage', name: 'Damage', baseCost: 1, type: 'attack', action: 'standard', range: 'ranged', duration: 'instant', description: '', variableCost: null, extras: [], flaws: [] } as unknown as import('../entities/types').IPowerEffect;
      expect(calcComponentCost({ id: 'c1', effectId: 'damage', ranks: 7, modifiers: [{ modifierId: 'ranged', ranks: 1 }, { modifierId: 'area', ranks: 1, affectedRanks: 4 }] }, damage, MODS)).toBe(18);
    });
  });

  describe('calculateAbilitiesCost', () => {
    it('calculates 2 PP per rank, skipping absent', () => {
      const abilities = { str: 5, sta: 3, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 };
      const cost = calculateAbilitiesCost(abilities, ['sta']);
      // str: 5×2=10, sta: absent=0, rest: 0 → 10
      expect(cost).toBe(10);
    });
  });

  describe('calculateDefensesCost', () => {
    it('sums bought ranks (1 PP each)', () => {
      expect(calculateDefensesCost({ dodge: 3, parry: 2, fortitude: 5, will: 4 })).toBe(14);
    });
  });

  describe('calculateSkillsCost', () => {
    it('1 PP per 2 ranks, rounds up', () => {
      expect(calculateSkillsCost(9)).toBe(5);
      expect(calculateSkillsCost(10)).toBe(5);
      expect(calculateSkillsCost(11)).toBe(6);
    });
  });

  describe('calculateAdvantagesCost', () => {
    it('sums ranks', () => {
      expect(calculateAdvantagesCost([{ ranks: 2 }, { ranks: 1 }, { ranks: 3 }])).toBe(6);
    });
  });

  // ── F-06: Removable / Easily Removable discount ──────────────────────────
  describe('calcRemovableDiscount', () => {
    it('returns 0 when removable is undefined or none', () => {
      expect(calcRemovableDiscount(25, undefined)).toBe(0);
      expect(calcRemovableDiscount(25, 'none')).toBe(0);
    });

    it('Removable: −1 PP per 5 PP, rounded down', () => {
      // 25 PP → floor(25/5)*1 = 5 discount
      expect(calcRemovableDiscount(25, 'removable')).toBe(5);
      // 24 PP → floor(24/5)*1 = 4 discount
      expect(calcRemovableDiscount(24, 'removable')).toBe(5);
    });

    it('Easily Removable: −2 PP per 5 PP, rounded down', () => {
      // 25 PP → floor(25/5)*2 = 10 discount
      expect(calcRemovableDiscount(25, 'easily_removable')).toBe(10);
      // 30 PP → floor(30/5)*2 = 12 discount
      expect(calcRemovableDiscount(26, 'easily_removable')).toBe(12);
    });
  });

  describe('calcPowerTotalCost with Removable discount', () => {
    const POWER_DEFS = [
      { id: 'damage', name: 'Damage', baseCost: 1, type: 'attack',
        action: 'standard', range: 'close', duration: 'instant',
        description: '', variableCost: null, extras: [], flaws: [] },
    ] as unknown as import('../entities/types').IPowerEffect[];

    it('applies Removable discount to calcPowerTotalCost (25 PP power → -5 PP = 20 PP total)', () => {
      const power: ICharacterPower = {
        id: 'p1', name: 'Power Armor Fist',
        components: [{ id: 'c1', effectId: 'damage', ranks: 25, modifiers: [] }],
        notes: '', alternateEffects: [],
        removable: 'removable', // −1 per 5 PP → floor(25/5)*1 = 5 discount
      };
      // array cost = 25 (no AEs); removable discount = 5; total = 20
      expect(calcPowerTotalCost(power, POWER_DEFS, MODS)).toBe(20);
    });

    it('applies Easily Removable discount (25 PP → -10 PP = 15 PP total)', () => {
      const power: ICharacterPower = {
        id: 'p2', name: 'Gadget',
        components: [{ id: 'c1', effectId: 'damage', ranks: 25, modifiers: [] }],
        notes: '', alternateEffects: [],
        removable: 'easily_removable', // floor(25/5)*2 = 10 discount
      };
      expect(calcPowerTotalCost(power, POWER_DEFS, MODS)).toBe(15);
    });

    it('calculates Removable from the complete array cost and rounds up', () => {
      const power: ICharacterPower = {
        id: 'p-array', name: 'Array Device',
        components: [{ id: 'c1', effectId: 'damage', ranks: 20, modifiers: [] }],
        notes: '',
        alternateEffects: [{
          id: 'ae1', name: 'Alternate', dynamic: false, notes: '',
          components: [{ id: 'ae-c1', effectId: 'damage', ranks: 20, modifiers: [] }],
        }],
        removable: 'removable',
      };
      // 20 PP main + 1 PP Alternate Effect = 21; ceil(21 / 5) = 5 discount.
      expect(calcPowerTotalCost(power, POWER_DEFS, MODS)).toBe(16);
    });

    it('applies Activation before calculating a Removable discount', () => {
      const power: ICharacterPower = {
        id: 'p-activation', name: 'Activated device',
        components: [{ id: 'c1', effectId: 'damage', ranks: 7, modifiers: [] }],
        notes: '', alternateEffects: [],
        activation: 'standard',
        removable: 'removable',
      };
      // 7 PP − 2 PP (standard activation) = 5 PP; Removable then reduces it by 1 PP.
      expect(calcPowerTotalCost(power, POWER_DEFS, MODS)).toBe(4);
    });

    it('total never goes below 0', () => {
      const power: ICharacterPower = {
        id: 'p3', name: 'Tiny Gadget',
        components: [{ id: 'c1', effectId: 'damage', ranks: 1, modifiers: [] }],
        notes: '', alternateEffects: [],
        removable: 'easily_removable', // discount = floor(1/5)*2 = 0 (< 5PP)
      };
      // 1 PP, discount = 0 (floor(1/5)=0)
      expect(calcPowerTotalCost(power, POWER_DEFS, MODS)).toBe(1);
    });
  });

  describe('cost breakdown parity', () => {
    it('uses the same conditional Affects Objects cost as final calculation', () => {
      const effect = {
        id: 'damage', name: 'Damage', baseCost: 1, type: 'attack',
        action: 'standard', range: 'close', duration: 'instant',
        description: '', variableCost: null, extras: [], flaws: [],
      } as unknown as import('../entities/types').IPowerEffect;
      const component = {
        id: 'c1', effectId: 'damage', ranks: 10,
        modifiers: [{ modifierId: 'affects_objects', ranks: 1 }],
      };

      expect(getComponentCostBreakdown(component, effect, MODS).total).toBe(20);
    });
  });

  describe('conditional modifier costs', () => {
    const affectsOthers = {
      id: 'affects_others', name: 'Affects Others', category: 'extra',
      costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [],
    } as IModifierDef;
    const alternateResistance = {
      id: 'alternate_resistance', name: 'Alternate Resistance', category: 'extra',
      costType: 'per_rank', costValue: 0, description: '', incompatibleWith: [],
    } as IModifierDef;
    const reaction = {
      id: 'reaction', name: 'Reaction', category: 'extra',
      costType: 'per_rank', costValue: 3, description: '', incompatibleWith: [],
    } as IModifierDef;
    const sideEffect = {
      id: 'side_effect', name: 'Side Effect', category: 'flaw',
      costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [],
    } as IModifierDef;
    const increasedRange = {
      id: 'increased_range', name: 'Increased Range', category: 'extra',
      costType: 'per_rank', costValue: 1, maxRanks: 2, description: '', incompatibleWith: [],
    } as IModifierDef;

    it('uses the RAW alternatives for Affects Others and Alternate Resistance', () => {
      expect(getPerRankModifierCost({ modifierId: 'affects_others', ranks: 1 }, affectsOthers)).toBe(1);
      expect(getPerRankModifierCost(
        { modifierId: 'affects_others', ranks: 1, options: { affectsOnlyOthers: true } },
        affectsOthers,
      )).toBe(0);
      expect(getPerRankModifierCost(
        { modifierId: 'alternate_resistance', ranks: 1, options: { alternateResistanceCost: 'advantageous' } },
        alternateResistance,
      )).toBe(1);
    });

    it('derives Reaction from the printed default action', () => {
      const applied = { modifierId: 'reaction', ranks: 1 };
      expect(getPerRankModifierCost(applied, reaction, 'free')).toBe(1);
      expect(getPerRankModifierCost(applied, reaction, 'standard')).toBe(3);
    });

    it('supports ranked range changes and both Side Effect costs', () => {
      expect(getPerRankModifierCost({ modifierId: 'increased_range', ranks: 2 }, increasedRange)).toBe(2);
      expect(getPerRankModifierCost({ modifierId: 'side_effect', ranks: 1 }, sideEffect)).toBe(-1);
      expect(getPerRankModifierCost(
        { modifierId: 'side_effect', ranks: 1, options: { sideEffectAlways: true } },
        sideEffect,
      )).toBe(-2);
    });

    it('prices expanded and Perception Areas correctly', () => {
      const area = { id: 'area', name: 'Area', category: 'extra', costType: 'per_rank', costValue: 1, maxRanks: 20, description: '', incompatibleWith: [] } as IModifierDef;
      expect(getPerRankModifierCost({ modifierId: 'area', ranks: 3, option: 'Burst' }, area)).toBe(3);
      expect(getPerRankModifierCost({ modifierId: 'area', ranks: 1, option: 'Perception' }, area)).toBe(2);
      expect(getPerRankModifierCost({ modifierId: 'area', ranks: 1, option: 'Perception', options: { includesSenseDependent: true } }, area)).toBe(1);
    });
  });
});
