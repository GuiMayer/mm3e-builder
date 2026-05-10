import { describe, it, expect } from 'vitest';
import { calculatePowerCost } from '../shared/lib/mathEngine';
import type { IAppliedModifier, IModifierDef } from '../entities/types';

/**
 * Range/Duration/Action Parameter Modifiers Tests
 * 
 * Tests modifier effects on power parameters (range, duration, action).
 * 
 * References:
 * - Hero's Handbook p.137-140 (Accurate extra)
 * - Modifiers p.187-200 (Range/Duration/Action modifiers)
 */

// Mock modifier definitions
const MODS: IModifierDef[] = [
  { id: 'ranged', name: 'Ranged', category: 'extra', costType: 'per_rank', costValue: 1, description: 'Changes range from close to ranged', incompatibleWith: ['close_only'] },
  { id: 'increased_range', name: 'Increased Range', category: 'extra', costType: 'per_rank', costValue: 1, description: 'Increases range by one step', incompatibleWith: ['diminished_range'] },
  { id: 'diminished_range', name: 'Diminished Range', category: 'flaw', costType: 'per_rank', costValue: -1, description: 'Decreases range by one step', incompatibleWith: ['increased_range'] },
  { id: 'close_only', name: 'Close Only', category: 'flaw', costType: 'per_rank', costValue: -1, description: 'Limits to close range only', incompatibleWith: ['ranged'] },
  { id: 'concentration', name: 'Concentration', category: 'extra', costType: 'per_rank', costValue: 0, description: 'Changes duration to concentration', incompatibleWith: [] },
  { id: 'continuous', name: 'Continuous', category: 'extra', costType: 'per_rank', costValue: 1, description: 'Changes duration to continuous', incompatibleWith: [] },
  { id: 'sustained', name: 'Sustained', category: 'extra', costType: 'per_rank', costValue: 0, description: 'Changes duration to sustained', incompatibleWith: [] },
  { id: 'permanent', name: 'Permanent', category: 'extra', costType: 'per_rank', costValue: 0, description: 'Changes duration to permanent', incompatibleWith: [] },
];

describe('Range Progression Modifiers', () => {
  describe('Ranged extra', () => {
    it('Close → Ranged: Damage 10 + Ranged = (1+1)×10 = 20 PP', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(20);
    });

    it('base 2 effect + Ranged: Move Object 10 + Ranged = (2+1)×10 = 30 PP', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
      const cost = calculatePowerCost(2, 10, mods, MODS);
      expect(cost).toBe(30);
    });
  });

  describe('Increased Range extra', () => {
    it('Ranged → Perception: Damage 10 + Ranged + Increased Range = (1+1+1)×10 = 30 PP', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'increased_range', ranks: 1 },
      ];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(30);
    });

    it('Close → Perception (two steps): Damage 10 + Ranged + Increased Range = 30 PP', () => {
      // Same as above - Ranged takes close→ranged, Increased Range takes ranged→perception
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'increased_range', ranks: 1 },
      ];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(30);
    });
  });

  describe('Diminished Range flaw', () => {
    it('Ranged → Close: base ranged effect + Diminished Range = cost reduction', () => {
      // If base effect is ranged (base 2), diminished range reduces to close (base 1 equivalent)
      const mods: IAppliedModifier[] = [{ modifierId: 'diminished_range', ranks: 1 }];
      const cost = calculatePowerCost(2, 10, mods, MODS);
      // (2-1) × 10 = 10 PP
      expect(cost).toBe(10);
    });
  });

  describe('Close Only flaw', () => {
    it('limits ranged effect to close range: Damage 10 + Ranged + Close Only = (1+1-1)×10 = 10 PP', () => {
      const mods: IAppliedModifier[] = [
        { modifierId: 'ranged', ranks: 1 },
        { modifierId: 'close_only', ranks: 1 },
      ];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      // Net effect: +1-1 = 0, so 1×10 = 10 PP
      expect(cost).toBe(10);
    });
  });
});

describe('Duration Modifiers', () => {
  describe('Concentration duration', () => {
    it('Instant → Concentration: +0/rank (no cost change)', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'concentration', ranks: 1 }];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      // (1+0) × 10 = 10 PP
      expect(cost).toBe(10);
    });
  });

  describe('Sustained duration', () => {
    it('Instant → Sustained: +0/rank (no cost change)', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'sustained', ranks: 1 }];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(10);
    });
  });

  describe('Continuous duration', () => {
    it('Sustained → Continuous: +1/rank', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'continuous', ranks: 1 }];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      // (1+1) × 10 = 20 PP
      expect(cost).toBe(20);
    });

    it('base 2 + Continuous: Protection 10 + Continuous = (2+1)×10 = 30 PP', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'continuous', ranks: 1 }];
      const cost = calculatePowerCost(2, 10, mods, MODS);
      expect(cost).toBe(30);
    });
  });

  describe('Permanent duration', () => {
    it('Continuous → Permanent: +0/rank (no additional cost)', () => {
      const mods: IAppliedModifier[] = [{ modifierId: 'permanent', ranks: 1 }];
      const cost = calculatePowerCost(1, 10, mods, MODS);
      expect(cost).toBe(10);
    });
  });
});

describe('Combined Range and Duration Modifiers', () => {
  it('Damage 10 + Ranged + Continuous = (1+1+1)×10 = 30 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'continuous', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(30);
  });

  it('Damage 10 + Ranged + Increased Range + Continuous = (1+1+1+1)×10 = 40 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'increased_range', ranks: 1 },
      { modifierId: 'continuous', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(40);
  });

  it('base 2 + Ranged + Continuous: Move Object 10 + Ranged + Continuous = (2+1+1)×10 = 40 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'continuous', ranks: 1 },
    ];
    const cost = calculatePowerCost(2, 10, mods, MODS);
    expect(cost).toBe(40);
  });
});

describe('Real Power Examples with Parameter Modifiers', () => {
  it('Telekinesis: Move Object 10 + Increased Range = (2+1)×10 = 30 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'increased_range', ranks: 1 }];
    const cost = calculatePowerCost(2, 10, mods, MODS);
    expect(cost).toBe(30);
  });

  it('Force Field: Protection 10 + Continuous = (1+1)×10 = 20 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'continuous', ranks: 1 }];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(20);
  });

  it('Energy Blast: Damage 10 + Ranged = (1+1)×10 = 20 PP', () => {
    const mods: IAppliedModifier[] = [{ modifierId: 'ranged', ranks: 1 }];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(20);
  });

  it('Perception Range Attack: Damage 10 + Ranged + Increased Range = (1+1+1)×10 = 30 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'increased_range', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    expect(cost).toBe(30);
  });
});

describe('Edge Cases - Parameter Modifiers', () => {
  it('multiple range modifiers: Ranged + Increased Range on base 1 = +2/rank', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'increased_range', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 5, mods, MODS);
    // (1+1+1) × 5 = 15 PP
    expect(cost).toBe(15);
  });

  it('range increase and decrease cancel: Ranged + Diminished Range = net 0', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'diminished_range', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    // (1+1-1) × 10 = 10 PP
    expect(cost).toBe(10);
  });

  it('duration modifiers stack: Continuous + Permanent = +1/rank total', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'continuous', ranks: 1 },
      { modifierId: 'permanent', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 10, mods, MODS);
    // (1+1+0) × 10 = 20 PP
    expect(cost).toBe(20);
  });

  it('rank 1 with multiple modifiers: Damage 1 + Ranged + Continuous = (1+1+1)×1 = 3 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'continuous', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 1, mods, MODS);
    expect(cost).toBe(3);
  });

  it('high rank with modifiers: Damage 20 + Ranged + Increased Range + Continuous = (1+1+1+1)×20 = 80 PP', () => {
    const mods: IAppliedModifier[] = [
      { modifierId: 'ranged', ranks: 1 },
      { modifierId: 'increased_range', ranks: 1 },
      { modifierId: 'continuous', ranks: 1 },
    ];
    const cost = calculatePowerCost(1, 20, mods, MODS);
    expect(cost).toBe(80);
  });
});

describe('Parameter Modifiers - Future Validation (TODO)', () => {
  // These tests document expected behavior for future validation implementation
  // Currently, the system allows these combinations but should validate them

  it.todo('Ranged + Close Only: should warn about incompatibility');
  it.todo('Increased Range + Diminished Range: should warn about incompatibility');
  it.todo('Increased Range without Ranged on close power: should warn (no effect)');
  it.todo('Continuous on Instant duration: should validate duration change is valid');
  it.todo('Permanent on Concentration: should validate progression');
  it.todo('Multiple Increased Range ranks: should track range progression (ranged→perception→extended)');
});
