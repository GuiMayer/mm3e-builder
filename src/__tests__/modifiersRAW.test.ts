/**
 * MODIFIERS RAW TESTS
 *
 * These tests verify that modifier costs and rules match the official
 * M&M 3E Hero's Handbook (pages 136-150).
 *
 * Each test validates a specific modifier's:
 * - Cost type (per_rank, flat, flat_ranked)
 * - Cost value
 * - Max ranks (where applicable)
 * - Special rules or options
 */

import { describe, it, expect } from 'vitest';
import modifiersRaw from '../data/modifiers.json';
import type { IModifierDef } from '../entities/types';

const modifiers = modifiersRaw as IModifierDef[];

// Helper to find modifier by ID
const findMod = (id: string): IModifierDef => {
  const mod = modifiers.find((m) => m.id === id);
  if (!mod) throw new Error(`Modifier "${id}" not found`);
  return mod;
};

// ─────────────────────────────────────────────────────────
//  EXTRAS - RAW Spot Checks
// ─────────────────────────────────────────────────────────

describe('modifiers.json — Extras RAW validation', () => {
  it('Accurate: flat_ranked, +1/rank, maxRanks defined', () => {
    const mod = findMod('accurate');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
    expect(mod.maxRanks).toBeDefined();
    expect(mod.maxRanks).toBeGreaterThan(0);
  });

  it('Affects Corporeal: flat_ranked, +1/rank', () => {
    const mod = findMod('affects_corporeal');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Affects Insubstantial: flat_ranked, +1/rank, maxRanks: 2', () => {
    const mod = findMod('affects_insubstantial');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
    expect(mod.maxRanks).toBe(2);
  });

  it('Alternate Effect: flat, +1 or +2', () => {
    const mod = findMod('alternate_effect');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    // Cost varies: +1 for normal, +2 for dynamic
    expect([1, 2]).toContain(mod.costValue);
  });

  it('Alternate Resistance: per_rank, has subtypes with varying costs', () => {
    const mod = findMod('alternate_resistance');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(0); // Base cost, actual cost from subtypes
    expect(mod.subtypes).toBeDefined();
    expect(mod.subtypes!.length).toBe(4);
  });

  it('Area: per_rank, +1/rank, has 7 shape options', () => {
    const mod = findMod('area');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(1);
    expect(mod.options).toBeDefined();
    expect(mod.options!.length).toBe(7);
    const shapes = mod.options!.map((o) => o.label);
    expect(shapes).toContain('Burst');
    expect(shapes).toContain('Cloud');
    expect(shapes).toContain('Cone');
    expect(shapes).toContain('Cylinder');
    expect(shapes).toContain('Line');
    expect(shapes).toContain('Perception');
    expect(shapes).toContain('Shapeable');
  });

  it('Extended Range: flat_ranked, +1/rank', () => {
    const mod = findMod('extended_range');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Feature: flat_ranked, +1/rank', () => {
    const mod = findMod('feature');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Homing: flat_ranked, +1/rank', () => {
    const mod = findMod('homing');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Incurable: flat, +1', () => {
    const mod = findMod('incurable');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1);
  });

  it('Increased Duration: per_rank, +1/rank', () => {
    const mod = findMod('increased_duration');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(1);
  });

  it('Increased Range: per_rank, +1/rank', () => {
    const mod = findMod('increased_range');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(1);
  });

  it('Indirect: flat_ranked, +1/rank, maxRanks: 4', () => {
    const mod = findMod('indirect');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
    expect(mod.maxRanks).toBe(4);
  });

  it('Innate: flat, +1', () => {
    const mod = findMod('innate');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1);
  });

  it('Insidious: flat, +1', () => {
    const mod = findMod('insidious');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1);
  });

  it('Multiattack: per_rank, +1/rank', () => {
    const mod = findMod('multiattack');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(1);
  });

  it('Penetrating: flat_ranked, +1/rank', () => {
    const mod = findMod('penetrating');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Precise: flat, +1, maxRanks: 1', () => {
    const mod = findMod('precise');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1);
    expect(mod.maxRanks).toBe(1);
  });

  it('Reach: flat_ranked, +1/rank', () => {
    const mod = findMod('reach');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Reaction: per_rank, +3/rank (or +1 for free actions)', () => {
    const mod = findMod('reaction');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(3); // Standard cost, +1 for free actions
  });

  it('Reversible: flat, +1, maxRanks: 1', () => {
    const mod = findMod('reversible');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1);
    expect(mod.maxRanks).toBe(1);
  });

  it('Ricochet: flat_ranked, +1/rank', () => {
    const mod = findMod('ricochet');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Secondary Effect: per_rank, +1/rank', () => {
    const mod = findMod('secondary_effect');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(1);
  });

  it('Selective: per_rank, +1/rank', () => {
    const mod = findMod('selective');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(1);
  });

  it('Split: flat_ranked, +1/rank', () => {
    const mod = findMod('split');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Subtle: flat, +1/rank, maxRanks: 2', () => {
    const mod = findMod('subtle');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1);
    expect(mod.maxRanks).toBe(2);
  });

  it('Triggered: flat_ranked, +1/rank', () => {
    const mod = findMod('triggered');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(1);
  });

  it('Variable Descriptor: flat, +1 or +2, maxRanks: 2', () => {
    const mod = findMod('variable_descriptor');
    expect(mod.category).toBe('extra');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(1); // Base cost, +2 for broad group
    expect(mod.maxRanks).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────
//  FLAWS - RAW Spot Checks
// ─────────────────────────────────────────────────────────

describe('modifiers.json — Flaws RAW validation', () => {
  it('Activation: flat, -1 (move) or -2 (standard), maxRanks: 2', () => {
    const mod = findMod('activation');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(-1); // Base cost for move action
    expect(mod.maxRanks).toBe(2);
  });

  it('Check Required: flat_ranked, -1/rank', () => {
    const mod = findMod('check_required');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(-1);
  });

  it('Concentration: per_rank, -1/rank', () => {
    const mod = findMod('concentration');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Diminished Range: flat_ranked, -1/rank, maxRanks: 3', () => {
    const mod = findMod('diminished_range');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(-1);
    expect(mod.maxRanks).toBe(3);
  });

  it('Distracting: per_rank, -1/rank', () => {
    const mod = findMod('distracting');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Fades: per_rank, -1/rank', () => {
    const mod = findMod('fades');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Feedback: per_rank, -1/rank', () => {
    const mod = findMod('feedback');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Grab-Based: per_rank, -1/rank', () => {
    const mod = findMod('grab_based');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Inaccurate: flat_ranked, -1/rank', () => {
    const mod = findMod('inaccurate');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(-1);
  });

  it('Increased Action: per_rank, -1/rank', () => {
    const mod = findMod('increased_action');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Limited: per_rank, -1/rank', () => {
    const mod = findMod('limited');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Noticeable: flat, -1, maxRanks: 1', () => {
    const mod = findMod('noticeable');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(-1);
    expect(mod.maxRanks).toBe(1);
  });

  it('Permanent (flaw): per_rank, -1/rank', () => {
    const mod = findMod('permanent_flaw');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Quirk: flat_ranked, -1/rank', () => {
    const mod = findMod('quirk');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat_ranked');
    expect(mod.costValue).toBe(-1);
  });

  it('Reduced Range: per_rank, -1/rank', () => {
    const mod = findMod('reduced_range');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Removable: flat, 0 cost (power-level flaw, discount calculated separately)', () => {
    const mod = findMod('removable');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('flat');
    expect(mod.costValue).toBe(0); // Cost is 0 because discount is calculated via calcRemovableDiscount()
    expect(mod.appliesToPower).toBe(true);
    expect(mod.subtypes).toHaveLength(2);
  });

  it('Resistible: per_rank, -1/rank', () => {
    const mod = findMod('resistible');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Sense-Dependent: per_rank, -1/rank', () => {
    const mod = findMod('sense_dependent');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Side Effect: per_rank, -1/rank (or -2 if always occurs)', () => {
    const mod = findMod('side_effect');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1); // Base cost, -2 if always occurs
  });

  it('Tiring: per_rank, -1/rank', () => {
    const mod = findMod('tiring');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Uncontrolled: per_rank, -1/rank', () => {
    const mod = findMod('uncontrolled');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });

  it('Unreliable: per_rank, -1/rank', () => {
    const mod = findMod('unreliable');
    expect(mod.category).toBe('flaw');
    expect(mod.costType).toBe('per_rank');
    expect(mod.costValue).toBe(-1);
  });
});

// ─────────────────────────────────────────────────────────
//  TRANSLATIONS - Validation
// ─────────────────────────────────────────────────────────

describe('modifiers.json — Translation validation', () => {
  it('all modifiers have pt-BR translations', () => {
    for (const mod of modifiers) {
      expect(
        mod.i18n?.['pt-BR'],
        `${mod.id} missing pt-BR translation`
      ).toBeDefined();
    }
  });

  it('pt-BR translations have name and description', () => {
    for (const mod of modifiers) {
      const ptBR = mod.i18n?.['pt-BR'];
      if (ptBR) {
        expect(ptBR.name, `${mod.id} pt-BR missing name`).toBeTruthy();
        expect(ptBR.description, `${mod.id} pt-BR missing description`).toBeTruthy();
      }
    }
  });

  it('pt-BR translations are not just copies of English', () => {
    for (const mod of modifiers) {
      const ptBR = mod.i18n?.['pt-BR'];
      if (ptBR?.name) {
        // Translation should be different from English (allowing for proper nouns)
        const isDifferent = ptBR.name !== mod.name || mod.name.split(' ').length === 1;
        expect(
          isDifferent,
          `${mod.id} pt-BR name appears to be untranslated: "${ptBR.name}"`
        ).toBe(true);
      }
    }
  });
});
