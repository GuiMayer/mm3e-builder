import { describe, it, expect } from 'vitest';
import {
  calculateCostPerRank,
  calculatePowerCost,
  calculateArrayCost,
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
} from '../shared/lib/mathEngine';
import type { IAppliedModifier, IModifierDef } from '../entities/types';

// ── Mock modifier definitions ──
const MODS: IModifierDef[] = [
  { id: 'ranged', name: 'Ranged', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'area', name: 'Area', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'tiring', name: 'Tiring', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'limited', name: 'Limited', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'homing', name: 'Homing', category: 'extra', costType: 'flat', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'removable', name: 'Removable', category: 'flaw', costType: 'flat', costValue: -2, description: '', incompatibleWith: [] },
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

    it('includes flat modifiers', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'homing', ranks: 3 }];
      // Base 1 per rank × 10 = 10 + 3 flat = 13
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(13);
    });

    it('minimum cost is 1 PP', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'removable', ranks: 5 }];
      // Base 1 × 1 rank = 1 + (-10 flat) = -9 → clamps to 1
      const cost = calculatePowerCost(1, 1, mods, MODS);
      expect(cost).toBe(1);
    });
  });

  describe('calculateArrayCost', () => {
    it('main 20 PP + 2 static alts + 1 dynamic = 24 PP', () => {
      expect(calculateArrayCost(20, 3, 1)).toBe(24);
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
});
