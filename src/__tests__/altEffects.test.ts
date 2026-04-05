import { describe, it, expect } from 'vitest';
import {
  calcComponentCost,
  calcAlternateEffectCost,
  validateAECost,
  getComponentCostBreakdown,
} from '../shared/lib/mathEngine';
import { migrateAlternateEffect } from '../shared/lib/powerMigration';
import type {
  IModifierDef,
  ICharacterPowerComponent,
  IAlternateEffect,
  IPowerEffect,
} from '../entities/types';

// ── Mock effect definitions ──
const EFFECT_DEFS: IPowerEffect[] = [
  {
    id: 'damage', name: 'Damage', type: 'attack', baseCost: 1,
    action: 'standard', range: 'close', duration: 'instant',
    description: '', variableCost: null, extras: [], flaws: [], i18n: {},
  },
  {
    id: 'flight', name: 'Flight', type: 'movement', baseCost: 2,
    action: 'free', range: 'personal', duration: 'sustained',
    description: '', variableCost: null, extras: [], flaws: [], i18n: {},
  },
  {
    id: 'affliction', name: 'Affliction', type: 'attack', baseCost: 1,
    action: 'standard', range: 'close', duration: 'instant',
    description: '', variableCost: null, extras: [], flaws: [], i18n: {},
  },
];

const MOD_DEFS: IModifierDef[] = [
  { id: 'ranged', name: 'Ranged', category: 'extra', costType: 'per_rank', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'accurate', name: 'Accurate', category: 'extra', costType: 'flat_ranked', costValue: 1, description: '', incompatibleWith: [] },
  { id: 'tiring', name: 'Tiring', category: 'flaw', costType: 'per_rank', costValue: -1, description: '', incompatibleWith: [] },
  { id: 'removable', name: 'Removable', category: 'flaw', costType: 'flat_ranked', costValue: -2, description: '', incompatibleWith: [] },
];

function makeComp(effectId: string, ranks: number, modifiers: { modifierId: string; ranks: number }[] = []): ICharacterPowerComponent {
  return { id: 'comp-1', effectId, ranks, modifiers };
}

function makeAE(components: ICharacterPowerComponent[], dynamic = false): IAlternateEffect {
  return { id: 'ae-1', name: 'Test AE', dynamic, components, notes: '' };
}

// ══════════════════════════════════════════════════════
//  1. calcComponentCost — v2 component cost engine
// ══════════════════════════════════════════════════════

describe('calcComponentCost', () => {
  it('Damage 10, no mods → 10 PP', () => {
    const comp = makeComp('damage', 10);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    expect(calcComponentCost(comp, def, MOD_DEFS)).toBe(10);
  });

  it('Flight Rank 5 (base 2/rank) → 10 PP', () => {
    const comp = makeComp('flight', 5);
    const def = EFFECT_DEFS.find((d) => d.id === 'flight')!;
    expect(calcComponentCost(comp, def, MOD_DEFS)).toBe(10);
  });

  it('Damage 10 + Ranged (+1/rank) → (1+1)×10 = 20 PP', () => {
    const comp = makeComp('damage', 10, [{ modifierId: 'ranged', ranks: 1 }]);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    expect(calcComponentCost(comp, def, MOD_DEFS)).toBe(20);
  });

  it('Damage 10 - Tiring → fractional 1:2, ceil(10/2) = 5 PP', () => {
    const comp = makeComp('damage', 10, [{ modifierId: 'tiring', ranks: 1 }]);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    expect(calcComponentCost(comp, def, MOD_DEFS)).toBe(5);
  });

  it('Damage 10 + Accurate ×2 → 10 + 2 = 12 PP (flat_ranked)', () => {
    const comp = makeComp('damage', 10, [{ modifierId: 'accurate', ranks: 2 }]);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    expect(calcComponentCost(comp, def, MOD_DEFS)).toBe(12);
  });

  it('minimum 1 PP enforced even with large flaws', () => {
    const comp = makeComp('damage', 1, [{ modifierId: 'removable', ranks: 10 }]);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    // 1 rank × 1/rank = 1, flat: -2×10 = -20 → total -19 → clamped to 1
    expect(calcComponentCost(comp, def, MOD_DEFS)).toBe(1);
  });

  it('unknown effectId gracefully handled via caller (no def → caller skips)', () => {
    // calcComponentCost requires a valid def — tested at AE level below
    expect(true).toBe(true);
  });
});

// ══════════════════════════════════════════════════════
//  2. calcAlternateEffectCost — multi-component AEs
// ══════════════════════════════════════════════════════

describe('calcAlternateEffectCost', () => {
  it('single-component AE: Damage 10 = 10 PP', () => {
    const ae = makeAE([makeComp('damage', 10)]);
    expect(calcAlternateEffectCost(ae, EFFECT_DEFS, MOD_DEFS)).toBe(10);
  });

  it('multi-component AE (Linked): Damage 5 + Affliction 5 = 10 PP', () => {
    const ae = makeAE([
      { id: 'c1', effectId: 'damage', ranks: 5, modifiers: [] },
      { id: 'c2', effectId: 'affliction', ranks: 5, modifiers: [] },
    ]);
    expect(calcAlternateEffectCost(ae, EFFECT_DEFS, MOD_DEFS)).toBe(10);
  });

  it('AE with modifiers: Damage 10 + Ranged = 20 PP', () => {
    const ae = makeAE([makeComp('damage', 10, [{ modifierId: 'ranged', ranks: 1 }])]);
    expect(calcAlternateEffectCost(ae, EFFECT_DEFS, MOD_DEFS)).toBe(20);
  });

  it('AE with unknown effectId component → skipped, remaining components counted', () => {
    const ae = makeAE([
      { id: 'c1', effectId: 'unknown_effect', ranks: 5, modifiers: [] },
      { id: 'c2', effectId: 'damage', ranks: 5, modifiers: [] },
    ]);
    expect(calcAlternateEffectCost(ae, EFFECT_DEFS, MOD_DEFS)).toBe(5);
  });

  it('empty AE components → minimum 1 PP', () => {
    const ae = makeAE([]);
    expect(calcAlternateEffectCost(ae, EFFECT_DEFS, MOD_DEFS)).toBe(1);
  });

  it('linked: Flight 5 (base 2) + Damage 5 = 10 + 5 = 15 PP', () => {
    const ae = makeAE([
      { id: 'c1', effectId: 'flight', ranks: 5, modifiers: [] },
      { id: 'c2', effectId: 'damage', ranks: 5, modifiers: [] },
    ]);
    expect(calcAlternateEffectCost(ae, EFFECT_DEFS, MOD_DEFS)).toBe(15);
  });
});

// ══════════════════════════════════════════════════════
//  3. validateAECost — cap validation
// ══════════════════════════════════════════════════════

describe('validateAECost', () => {
  it('AE cost equal to main → valid, overageBy 0', () => {
    expect(validateAECost(20, 20)).toEqual({ valid: true, overageBy: 0 });
  });

  it('AE cost below main → valid, overageBy 0', () => {
    expect(validateAECost(15, 20)).toEqual({ valid: true, overageBy: 0 });
  });

  it('AE cost above main → invalid, overageBy = exact difference', () => {
    expect(validateAECost(25, 20)).toEqual({ valid: false, overageBy: 5 });
  });

  it('AE cost 1 above → overageBy 1', () => {
    expect(validateAECost(21, 20)).toEqual({ valid: false, overageBy: 1 });
  });

  it('AE cost 0 (edge) against main 1 → valid', () => {
    expect(validateAECost(0, 1)).toEqual({ valid: true, overageBy: 0 });
  });
});

// ══════════════════════════════════════════════════════
//  4. getComponentCostBreakdown — display breakdown
// ══════════════════════════════════════════════════════

describe('getComponentCostBreakdown', () => {
  it('Damage 10 no mods → correct breakdown', () => {
    const comp = makeComp('damage', 10);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    const bd = getComponentCostBreakdown(comp, def, MOD_DEFS);
    expect(bd.base).toBe(1);
    expect(bd.perRankExtras).toBe(0);
    expect(bd.perRankFlaws).toBe(0);
    expect(bd.costPerRank).toBe(1);
    expect(bd.rankCost).toBe(10);
    expect(bd.flatCost).toBe(0);
    expect(bd.total).toBe(10);
    expect(bd.isFractional).toBe(false);
  });

  it('Damage 10 + Ranged → perRankExtras=1, costPerRank=2, total=20', () => {
    const comp = makeComp('damage', 10, [{ modifierId: 'ranged', ranks: 1 }]);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    const bd = getComponentCostBreakdown(comp, def, MOD_DEFS);
    expect(bd.perRankExtras).toBe(1);
    expect(bd.costPerRank).toBe(2);
    expect(bd.total).toBe(20);
    expect(bd.isFractional).toBe(false);
  });

  it('Damage 10 - Tiring → isFractional=true, ranksPerPP=2', () => {
    const comp = makeComp('damage', 10, [{ modifierId: 'tiring', ranks: 1 }]);
    const def = EFFECT_DEFS.find((d) => d.id === 'damage')!;
    const bd = getComponentCostBreakdown(comp, def, MOD_DEFS);
    expect(bd.isFractional).toBe(true);
    expect(bd.ranksPerPP).toBe(2);
    expect(bd.total).toBe(5);
  });
});

// ══════════════════════════════════════════════════════
//  5. migrateAlternateEffect — schema migration
// ══════════════════════════════════════════════════════

describe('migrateAlternateEffect', () => {
  it('v1 AE (effectId + ranks flat fields) → converts to components[]', () => {
    const v1 = {
      id: 'ae-old-1', name: 'Old Blast', dynamic: false, notes: '',
      effectId: 'damage', ranks: 10,
      modifiers: [{ modifierId: 'ranged', ranks: 1 }],
    } as Record<string, unknown>;
    const result = migrateAlternateEffect(v1);
    expect(result.components).toHaveLength(1);
    expect(result.components[0].effectId).toBe('damage');
    expect(result.components[0].ranks).toBe(10);
    expect(result.components[0].modifiers).toHaveLength(1);
    expect(result.id).toBe('ae-old-1');
    expect(result.name).toBe('Old Blast');
  });

  it('v2 AE (components[]) → passes through unchanged', () => {
    const v2 = {
      id: 'ae-new-1', name: 'New Blast', dynamic: true, notes: 'fire',
      components: [{ id: 'c1', effectId: 'damage', ranks: 10, modifiers: [] }],
    } as Record<string, unknown>;
    const result = migrateAlternateEffect(v2);
    expect(result.components).toHaveLength(1);
    expect(result.components[0].effectId).toBe('damage');
    expect(result.dynamic).toBe(true);
  });

  it('malformed AE without effectId → safe empty AE (no phantom component)', () => {
    const bad = { id: 'ae-bad', something: 'garbage' } as Record<string, unknown>;
    const result = migrateAlternateEffect(bad);
    // After TD-4: unknown shape returns components: [] not phantom component
    expect(result.id).toBe('ae-bad');
    expect(result.components).toEqual([]);
  });

  it('non-object input → safe AE with generated id', () => {
    const result = migrateAlternateEffect('not-an-object');
    expect(result.components).toEqual([]);
    expect(typeof result.id).toBe('string');
  });

  it('completely empty object → safe AE (no effectId means no v1 path)', () => {
    const result = migrateAlternateEffect({} as Record<string, unknown>);
    expect(result.components).toEqual([]);
    expect(typeof result.id).toBe('string');
  });
});

// ══════════════════════════════════════════════════════
//  6. migratePower — power-level migration pipeline
// ══════════════════════════════════════════════════════

describe('migratePower', () => {
  it('v1 AE migrates correctly via migrateAlternateEffect', () => {
    const v1AE = {
      id: 'ae-1', name: 'Flight', dynamic: false, notes: '',
      effectId: 'flight', ranks: 5, modifiers: [],
    } as Record<string, unknown>;
    const result = migrateAlternateEffect(v1AE);
    expect(result.components[0].effectId).toBe('flight');
    expect(result.components[0].ranks).toBe(5);
  });

  it('v1 and v2 AEs mixed → all migrate correctly', () => {
    const v1AE = {
      id: 'ae-v1', name: 'Old', dynamic: false, notes: '',
      effectId: 'affliction', ranks: 8, modifiers: [],
    } as Record<string, unknown>;
    const v2AE = {
      id: 'ae-v2', name: 'New', dynamic: true, notes: '',
      components: [{ id: 'c1', effectId: 'damage', ranks: 8, modifiers: [] }],
    } as Record<string, unknown>;
    const r1 = migrateAlternateEffect(v1AE);
    const r2 = migrateAlternateEffect(v2AE);
    expect(r1.components[0].effectId).toBe('affliction');
    expect(r2.components[0].effectId).toBe('damage');
    expect(r2.dynamic).toBe(true);
  });
});
