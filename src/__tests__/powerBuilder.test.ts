import { describe, it, expect } from 'vitest';
import {
  calculateCostPerRank,
  calculateFlatCost,
  calculatePowerCost,
  calculateArrayCost,
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
} from '../shared/lib/mathEngine';
import type { IAppliedModifier, IModifierDef } from '../entities/types';

// ══════════════════════════════════════════════════════
//  FULL MODIFIER DEFINITIONS (matches data/modifiers.json)
// ══════════════════════════════════════════════════════

const MODS: IModifierDef[] = [
  // Extras — per_rank
  { id: 'ranged', name: 'Ranged', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'area', name: 'Area', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'increased_range', name: 'Increased Range', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'selective', name: 'Selective', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  // Extras — flat
  { id: 'accurate', name: 'Accurate', category: 'extra', costType: 'flat', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'homing', name: 'Homing', category: 'extra', costType: 'flat', costValue: 1, description: '', incompatibleWith: [] },
  // Flaws — per_rank
  { id: 'tiring', name: 'Tiring', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'limited', name: 'Limited', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'unreliable', name: 'Unreliable', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'diminished_range', name: 'Diminished Range', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  // Flaws — flat
  { id: 'removable', name: 'Removable', category: 'flaw', costType: 'flat', costValue: -2, description: '', incompatibleWith: [] },
];

// ══════════════════════════════════════════════════════
//  1. calculateCostPerRank — Core formula tests
// ══════════════════════════════════════════════════════

describe('calculateCostPerRank', () => {
  it('base cost 1, no modifiers → 1/rank (standard)', () => {
    const r = calculateCostPerRank(1, [], MODS);
    expect(r).toEqual({ costPerRank: 1, isFractional: false, ranksPerPP: 1 });
  });

  it('base cost 2 (Move Object), no modifiers → 2/rank', () => {
    const r = calculateCostPerRank(2, [], MODS);
    expect(r).toEqual({ costPerRank: 2, isFractional: false, ranksPerPP: 1 });
  });

  it('base 1 + Ranged (+1) → 2/rank', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.costPerRank).toBe(2);
    expect(r.isFractional).toBe(false);
  });

  it('base 1 + Ranged (+1) + Area (+1) → 3/rank', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
    ];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.costPerRank).toBe(3);
  });

  it('base 2 + Ranged (+1) + Area (+1) + Selective (+1) → 5/rank', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'selective', ranks: 1 },
    ];
    const r = calculateCostPerRank(2, mods, MODS);
    expect(r.costPerRank).toBe(5);
  });

  // Fractional cost levels
  it('base 1 - Tiring (-1) → 0 effective → fractional 1:2', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.isFractional).toBe(true);
    expect(r.ranksPerPP).toBe(2); // 2 - 0 = 2
  });

  it('base 1 - 2 flaws → -1 effective → fractional 1:3', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
    ];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.isFractional).toBe(true);
    expect(r.ranksPerPP).toBe(3); // 2 - (-1) = 3
  });

  it('base 1 - 3 flaws → -2 effective → fractional 1:4', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
      { modifierId: 'unreliable', ranks: 1 },
    ];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.isFractional).toBe(true);
    expect(r.ranksPerPP).toBe(4);
  });

  it('base 1 - 4 flaws → -3 effective → fractional 1:5', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
      { modifierId: 'unreliable', ranks: 1 },
      { modifierId: 'diminished_range', ranks: 1 },
    ];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.isFractional).toBe(true);
    expect(r.ranksPerPP).toBe(5); // 2 - (-3) = 5
  });

  it('base 2 - 1 flaw → 1 effective → stays non-fractional', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    const r = calculateCostPerRank(2, mods, MODS);
    expect(r.costPerRank).toBe(1);
    expect(r.isFractional).toBe(false);
  });

  it('ignores flat modifiers in per-rank calculation', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'accurate', ranks: 3 },
      { modifierId: 'homing', ranks: 2 },
    ];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.costPerRank).toBe(1); // flat mods don't affect per-rank
  });

  it('handles unknown modifier IDs gracefully', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'nonexistent_mod', ranks: 1 }];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.costPerRank).toBe(1); // unknown mod is skipped
  });
});

// ══════════════════════════════════════════════════════
//  2. calculateFlatCost — Flat modifier cost sum
// ══════════════════════════════════════════════════════

describe('calculateFlatCost', () => {
  it('returns 0 with no modifiers', () => {
    expect(calculateFlatCost([], MODS)).toBe(0);
  });

  it('sums positive flat modifiers (Accurate ×3 = +3)', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'accurate', ranks: 3 }];
    expect(calculateFlatCost(mods, MODS)).toBe(3);
  });

  it('sums negative flat modifiers (Removable ×2 = -4)', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'removable', ranks: 2 }];
    expect(calculateFlatCost(mods, MODS)).toBe(-4);
  });

  it('mixes positive and negative flats (Homing ×2 + Removable ×1 = 0)', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'homing', ranks: 2 },
      { modifierId: 'removable', ranks: 1 },
    ];
    expect(calculateFlatCost(mods, MODS)).toBe(0); // 2 + (-2) = 0
  });

  it('ignores per_rank modifiers', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'accurate', ranks: 2 },
    ];
    expect(calculateFlatCost(mods, MODS)).toBe(2); // only Accurate counted
  });
});

// ══════════════════════════════════════════════════════
//  3. calculatePowerCost — Total power cost
// ══════════════════════════════════════════════════════

describe('calculatePowerCost', () => {
  // ── Basic powers ──

  it('Damage Rank 10, no mods → 10 PP', () => {
    expect(calculatePowerCost(1, 10, [], MODS)).toBe(10);
  });

  it('Damage Rank 1, no mods → 1 PP', () => {
    expect(calculatePowerCost(1, 1, [], MODS)).toBe(1);
  });

  it('Protection Rank 12 (base 1) → 12 PP', () => {
    expect(calculatePowerCost(1, 12, [], MODS)).toBe(12);
  });

  it('Flight Rank 5 (base 2) → 10 PP', () => {
    expect(calculatePowerCost(2, 5, [], MODS)).toBe(10);
  });

  it('Move Object Rank 10 (base 2) → 20 PP', () => {
    expect(calculatePowerCost(2, 10, [], MODS)).toBe(20);
  });

  // ── Powers with extras ──

  it('Damage 10 + Ranged → (1+1)×10 = 20 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(20);
  });

  it('Damage 10 + Ranged + Area → (1+1+1)×10 = 30 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(30);
  });

  it('Move Object 10 + Increased Range + Selective → (2+1+1)×10 = 40 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'increased_range', ranks: 1 },
      { modifierId: 'selective', ranks: 1 },
    ];
    expect(calculatePowerCost(2, 10, mods, MODS)).toBe(40);
  });

  // ── Powers with flaws ──

  it('Damage 10 + Ranged - Tiring → (1+1-1)×10 = 10 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'tiring', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(10);
  });

  it('Move Object 10 - Tiring → (2-1)×10 = 10 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    expect(calculatePowerCost(2, 10, mods, MODS)).toBe(10);
  });

  // ── Fractional cost powers ──

  it('Damage 10 - Tiring → fractional 1:2, ceil(10/2) = 5 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(5);
  });

  it('Damage 10 - Tiring - Limited → fractional 1:3, ceil(10/3) = 4 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(4);
  });

  it('Damage 10 - 3 flaws → fractional 1:4, ceil(10/4) = 3 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
      { modifierId: 'unreliable', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(3);
  });

  it('Damage 10 - 4 flaws → fractional 1:5, ceil(10/5) = 2 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
      { modifierId: 'unreliable', ranks: 1 },
      { modifierId: 'diminished_range', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(2);
  });

  it('fractional with odd ranks: Damage 7 - Tiring → ceil(7/2) = 4 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    expect(calculatePowerCost(1, 7, mods, MODS)).toBe(4);
  });

  it('fractional with odd ranks: Damage 11 - Tiring - Limited → ceil(11/3) = 4 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 11, mods, MODS)).toBe(4);
  });

  // ── Flat modifier interactions ──

  it('Damage 10 + Homing ×3 → 10 + 3 = 13 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'homing', ranks: 3 }];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(13);
  });

  it('Damage 10 + Accurate ×2 + Homing ×1 → 10 + 2 + 1 = 13 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'accurate', ranks: 2 },
      { modifierId: 'homing', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(13);
  });

  it('Damage 10 + Ranged + Accurate ×2 → (1+1)×10 + 2 = 22 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'accurate', ranks: 2 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(22);
  });

  it('fractional + flat positive: Damage 10 - Tiring + Homing ×3 → ceil(10/2) + 3 = 8 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'homing', ranks: 3 },
    ];
    expect(calculatePowerCost(1, 10, mods, MODS)).toBe(8);
  });

  // ── Minimum cost (always at least 1 PP) ──

  it('huge negative flat: Removable ×5 on Damage 1 → max(1, 1-10) = 1 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'removable', ranks: 5 }];
    expect(calculatePowerCost(1, 1, mods, MODS)).toBe(1);
  });

  it('fractional + negative flat: Damage 1 - Tiring + Removable ×1 → max(1, ceil(1/2) + (-2)) = max(1, -1) = 1 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'removable', ranks: 1 },
    ];
    expect(calculatePowerCost(1, 1, mods, MODS)).toBe(1);
  });
});

// ══════════════════════════════════════════════════════
//  4. calculateArrayCost — Alternate & Dynamic effects
// ══════════════════════════════════════════════════════

describe('calculateArrayCost', () => {
  it('no alternates → just the main power cost', () => {
    expect(calculateArrayCost(20, 0, 0)).toBe(20);
  });

  it('1 static alternate → main + 1 PP', () => {
    expect(calculateArrayCost(20, 1, 0)).toBe(21);
  });

  it('3 static alternates → main + 3 PP', () => {
    expect(calculateArrayCost(20, 3, 0)).toBe(23);
  });

  it('1 dynamic alternate → main + 2 PP', () => {
    expect(calculateArrayCost(20, 1, 1)).toBe(22);
  });

  it('5 alts: 3 static + 2 dynamic → 20 + 3 + 4 = 27 PP', () => {
    expect(calculateArrayCost(20, 5, 2)).toBe(27);
  });

  it('all dynamic: 4 dynamic → 20 + 8 = 28 PP', () => {
    expect(calculateArrayCost(20, 4, 4)).toBe(28);
  });

  it('main cost 1 + 1 alt → 1 + 1 = 2 PP (cheapest possible array)', () => {
    expect(calculateArrayCost(1, 1, 0)).toBe(2);
  });
});

// ══════════════════════════════════════════════════════
//  5. Real M&M 3e Character Power Builds
// ══════════════════════════════════════════════════════

describe('Real M&M 3e Power Builds', () => {
  /**
   * ENERGY BLAST — Classic blaster power
   * Damage 10 + Ranged (+1/rank) = 2/rank × 10 = 20 PP
   */
  it('Energy Blast: Damage 10 + Ranged = 20 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(20);
  });

  /**
   * AREA ATTACK — Explosion/grenade type
   * Damage 10 + Ranged (+1) + Area (+1) + Selective (+1) = 4/rank × 10 = 40 PP
   */
  it('Selective Area Attack: Damage 10 + Ranged + Area + Selective = 40 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'selective', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(40);
  });

  /**
   * TIRING AREA DAMAGE — Balanced AoE
   * Damage 10 + Ranged (+1) + Area (+1) - Tiring (-1) = 2/rank × 10 = 20 PP
   */
  it('Tiring Area Damage: Damage 10 + Ranged + Area - Tiring = 20 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'tiring', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(20);
  });

  /**
   * PRECISE RANGED BLAST — Damage + Ranged + Accurate ×3 + Homing ×2
   * Per-rank: (1+1) × 10 = 20
   * Flat: 3 + 2 = 5
   * Total: 25 PP
   */
  it('Precise Ranged Blast: Damage 10 + Ranged + Accurate ×3 + Homing ×2 = 25 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'accurate', ranks: 3 },
      { modifierId: 'homing', ranks: 2 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(25);
  });

  /**
   * TELEKINESIS — Move Object (base 2) 10 + Increased Range
   * (2+1) × 10 = 30 PP
   */
  it('Telekinesis: Move Object 10 + Increased Range = 30 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'increased_range', ranks: 1 }];
    const cost = calculatePowerCost(2, 10, mods, MODS);
    expect(cost).toBe(30);
  });

  /**
   * BUDGET FLIGHT — Flight (base 2) Rank 5 - Limited (only outdoors)
   * (2-1) × 5 = 5 PP
   */
  it('Limited Flight: Flight 5 - Limited = 5 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'limited', ranks: 1 }];
    const cost = calculatePowerCost(2, 5, mods, MODS);
    expect(cost).toBe(5);
  });

  /**
   * HEAVILY FLAWED PROTECTION — Protection (base 1) Rank 10 - Tiring - Limited
   * 1-1-1 = -1 → fractional 1:3 → ceil(10/3) = 4 PP
   */
  it('Heavily Flawed Protection: Protection 10 - Tiring - Limited = 4 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(4);
  });

  /**
   * POWER ARMOR BLAST — Damage 10 + Ranged - Removable ×4 (device)
   * Per-rank: (1+1) × 10 = 20, Flat: -8 → 20 - 8 = 12 PP
   */
  it('Power Armor Blast: Damage 10 + Ranged + Removable ×4 = 12 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'removable', ranks: 4 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(12);
  });

  /**
   * MAGIC ARRAY — Classic sorcerer build
   * Base: Damage 10 + Ranged = 20 PP (Eldritch Blast)
   * Alt 1: Flight (static AE, +1 PP)
   * Alt 2: Affliction (static AE, +1 PP)
   * Alt 3: Move Object (dynamic AE, +2 PP)
   * Total array: 20 + 1 + 1 + 2 = 24 PP
   */
  it('Magic Array: 20 PP base + 2 static + 1 dynamic = 24 PP', () => {
    const baseMods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
    const baseCost = calculatePowerCost(1, 10, baseMods, MODS); // 20
    expect(baseCost).toBe(20);

    const totalCost = calculateArrayCost(baseCost, 3, 1); // 3 alts, 1 dynamic
    expect(totalCost).toBe(24);
  });

  /**
   * GREEN LANTERN CONSTRUCTS — Full dynamic array
   * Base: Move Object 10 = 20 PP
   * Alt 1: Damage 10 + Ranged (Dynamic, +2)
   * Alt 2: Flight 10 (Dynamic, +2)
   * Alt 3: Protection 10 (Dynamic, +2)
   * Total: 20 + 3×2 = 26 PP
   */
  it('GL Constructs: Move Object 20 PP + 3 dynamic alts = 26 PP', () => {
    const baseCost = calculatePowerCost(2, 10, [], MODS); // 20
    expect(baseCost).toBe(20);

    const totalCost = calculateArrayCost(baseCost, 3, 3); // all 3 dynamic
    expect(totalCost).toBe(26);
  });

  /**
   * BATMAN UTILITY BELT — Array with Removable device flaw
   * Base: Damage 5 + Ranged + Accurate ×2 = (1+1)×5 + 2 = 12 PP (Batarang)
   * + 4 static alternates (Smoke, Bolo, Grapple, EMP)
   * Array: 12 + 4 = 16 PP
   */
  it('Utility Belt: Batarang 12 PP + 4 alternates = 16 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'accurate', ranks: 2 },
    ];
    const baseCost = calculatePowerCost(1, 5, mods, MODS);
    expect(baseCost).toBe(12); // (1+1)×5 + 2

    const totalCost = calculateArrayCost(baseCost, 4, 0);
    expect(totalCost).toBe(16);
  });

  /**
   * SUPERMAN HEAT VISION — High-rank ranged damage
   * Damage 13 + Ranged + Accurate ×2 = (1+1)×13 + 2 = 28 PP
   */
  it('Heat Vision: Damage 13 + Ranged + Accurate ×2 = 28 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'accurate', ranks: 2 },
    ];
    const cost = calculatePowerCost(1, 13, mods, MODS);
    expect(cost).toBe(28);
  });

  /**
   * MAXIMUM EFFICIENCY — Stacking lots of flaws for cheap high-rank
   * Damage 20 - Tiring - Limited - Unreliable - Diminished Range
   * 1-1-1-1-1 = -3 → fractional 1:5 → ceil(20/5) = 4 PP
   */
  it('Maximum Efficiency: Damage 20 with 4 flaws = 4 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'tiring', ranks: 1 },
      { modifierId: 'limited', ranks: 1 },
      { modifierId: 'unreliable', ranks: 1 },
      { modifierId: 'diminished_range', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 20, mods, MODS);
    expect(cost).toBe(4);
  });
});

// ══════════════════════════════════════════════════════
//  6. Full character PP budget calculations
// ══════════════════════════════════════════════════════

describe('Full Character PP Budget', () => {
  /**
   * PL 10 Blaster — typical build
   * Abilities: STR 2, STA 4, AGL 4, DEX 6, FGT 2, INT 2, AWE 3, PRE 1 = 48 PP
   * Defenses: Dodge 6, Parry 4, Fort 4, Will 5 = 19 PP
   * Skills: 24 ranks = 12 PP
   * Advantages: 8 ranks = 8 PP
   * Powers: Energy Blast 10+Ranged=20 + Flight 5=10 = 30 PP
   * Total: 48 + 19 + 12 + 8 + 30 = 117 PP
   * Budget: PL 10 × 15 = 150 PP → Remaining: 33 PP
   */
  it('PL10 Blaster: total 117 / 150 PP, 33 remaining', () => {
    const abilitiesCost = calculateAbilitiesCost(
      { str: 2, sta: 4, agl: 4, dex: 6, fgt: 2, int: 2, awe: 3, pre: 1 },
      []
    );
    expect(abilitiesCost).toBe(48);

    const defensesCost = calculateDefensesCost({
      dodge: 6, parry: 4, fortitude: 4, will: 5,
    });
    expect(defensesCost).toBe(19);

    const skillsCost = calculateSkillsCost(24);
    expect(skillsCost).toBe(12);

    const advantagesCost = calculateAdvantagesCost([
      { ranks: 1 }, { ranks: 1 }, { ranks: 2 }, { ranks: 4 },
    ]);
    expect(advantagesCost).toBe(8);

    // Energy Blast
    const blastMods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
    const blastCost = calculatePowerCost(1, 10, blastMods, MODS);
    const blastTotal = calculateArrayCost(blastCost, 0, 0);

    // Flight
    const flightCost = calculatePowerCost(2, 5, [], MODS);
    const flightTotal = calculateArrayCost(flightCost, 0, 0);

    const powersCost = blastTotal + flightTotal;
    expect(powersCost).toBe(30);

    const totalSpent = abilitiesCost + defensesCost + skillsCost + advantagesCost + powersCost;
    const totalAvailable = 10 * 15;
    expect(totalSpent).toBe(117);
    expect(totalAvailable - totalSpent).toBe(33);
  });

  /**
   * PL 12 Power-heavy — magic array sorcerer, lower physical stats
   * Abilities: all 0 except INT 5, AWE 5, PRE 3 = 26 PP
   * Defenses: Dodge 8, Parry 4, Fort 4, Will 8 = 24 PP
   * Skills: 16 ranks = 8 PP
   * Advantages: 6 ranks = 6 PP
   * Powers: Magic Array (Damage 12 + Ranged + Area - Tiring = 24 PP base,
   *         + 5 static AE = +5, + 1 dynamic AE = +2) = 31 PP
   *         + Protection 12 = 12 PP → Total powers: 43 PP
   * Total: 26 + 24 + 8 + 6 + 43 = 107 PP
   * Budget: PL 12 × 15 = 180 PP → Remaining: 73 PP
   */
  it('PL12 Sorcerer: magic array + protection, 107 / 180 PP', () => {
    const abilitiesCost = calculateAbilitiesCost(
      { str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 5, awe: 5, pre: 3 },
      []
    );
    expect(abilitiesCost).toBe(26);

    const defensesCost = calculateDefensesCost({
      dodge: 8, parry: 4, fortitude: 4, will: 8,
    });
    expect(defensesCost).toBe(24);

    const skillsCost = calculateSkillsCost(16);
    expect(skillsCost).toBe(8);

    const advantagesCost = calculateAdvantagesCost([
      { ranks: 1 }, { ranks: 2 }, { ranks: 3 },
    ]);
    expect(advantagesCost).toBe(6);

    // Magic Array base: Damage 12 + Ranged + Area - Tiring
    const arrayMods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'area', ranks: 1 },
      { modifierId: 'tiring', ranks: 1 },
    ];
    const arrayBase = calculatePowerCost(1, 12, arrayMods, MODS);
    expect(arrayBase).toBe(24); // (1+1+1-1)×12 = 24

    // 5 static AE + 1 dynamic AE
    const arrayCost = calculateArrayCost(arrayBase, 6, 1);
    expect(arrayCost).toBe(31); // 24 + 5×1 + 1×2 = 31

    // Protection 12
    const protectionCost = calculatePowerCost(1, 12, [], MODS);
    expect(protectionCost).toBe(12);

    const powersCost = arrayCost + protectionCost;
    expect(powersCost).toBe(43);

    const totalSpent = abilitiesCost + defensesCost + skillsCost + advantagesCost + powersCost;
    expect(totalSpent).toBe(107);
    expect(12 * 15 - totalSpent).toBe(73);
  });

  /**
   * Robot with absent abilities (no Stamina, no Presence)
   * Abilities: STR 8, STA 0(absent), AGL 2, DEX 2, FGT 6, INT 4, AWE 2, PRE 0(absent)
   * Should cost: (8+2+2+6+4+2)×2 = 48 PP (skipping absent STA and PRE)
   */
  it('Robot: absent STA and PRE correctly excluded from cost', () => {
    const cost = calculateAbilitiesCost(
      { str: 8, sta: 0, agl: 2, dex: 2, fgt: 6, int: 4, awe: 2, pre: 0 },
      ['sta', 'pre']
    );
    expect(cost).toBe(48); // (8+2+2+6+4+2)×2 = 48
  });
});

// ══════════════════════════════════════════════════════
//  7. Edge Cases & Boundary Conditions
// ══════════════════════════════════════════════════════

describe('Edge Cases', () => {
  it('rank 0 power costs 0 (but clamped to 1 by minimum)', () => {
    const cost = calculatePowerCost(1, 0, [], MODS);
    // 1 × 0 = 0 → minimum 1
    expect(cost).toBe(1);
  });

  it('negative abilities have negative cost', () => {
    const cost = calculateAbilitiesCost(
      { str: -2, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
      []
    );
    expect(cost).toBe(-4); // -2 × 2 = -4
  });

  it('all abilities absent → 0 cost', () => {
    const cost = calculateAbilitiesCost(
      { str: 10, sta: 10, agl: 10, dex: 10, fgt: 10, int: 10, awe: 10, pre: 10 },
      ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre']
    );
    expect(cost).toBe(0);
  });

  it('0 skill ranks → 0 PP', () => {
    expect(calculateSkillsCost(0)).toBe(0);
  });

  it('1 skill rank → 1 PP (rounds up)', () => {
    expect(calculateSkillsCost(1)).toBe(1);
  });

  it('empty advantages → 0 PP', () => {
    expect(calculateAdvantagesCost([])).toBe(0);
  });

  it('all defenses at 0 → 0 PP', () => {
    expect(calculateDefensesCost({ dodge: 0, parry: 0, fortitude: 0, will: 0 })).toBe(0);
  });

  it('mixed extras and flaws that cancel out: Ranged + Tiring on base 1 → 1/rank', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'tiring', ranks: 1 },
    ];
    const r = calculateCostPerRank(1, mods, MODS);
    expect(r.costPerRank).toBe(1);
    expect(r.isFractional).toBe(false);
  });

  it('large rank values: Damage 100 = 100 PP', () => {
    expect(calculatePowerCost(1, 100, [], MODS)).toBe(100);
  });

  it('large rank with fractional: Damage 100 - Tiring → ceil(100/2) = 50 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'tiring', ranks: 1 }];
    expect(calculatePowerCost(1, 100, mods, MODS)).toBe(50);
  });

  it('array with 0 alternates is just the main cost', () => {
    expect(calculateArrayCost(15, 0, 0)).toBe(15);
  });

  it('many alternates: 20 static + 10 dynamic on 30 PP base', () => {
    expect(calculateArrayCost(30, 30, 10)).toBe(30 + 20 + 20); // 70
  });
});
