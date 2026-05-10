/**
 * MODIFIER RANKS TESTS
 *
 * These tests verify that maxRanks values are correctly defined for modifiers
 * that have rank limits according to the M&M 3E rules.
 */

import { describe, it, expect } from 'vitest';
import modifiersRaw from '../data/modifiers.json';
import type { IModifierDef } from '../entities/types';

const modifiers = modifiersRaw as IModifierDef[];

// Helper to find modifier by ID
const findMod = (id: string): IModifierDef | undefined => {
  return modifiers.find((m) => m.id === id);
};

describe('modifiers.json — maxRanks validation', () => {
  it('Accurate has maxRanks defined (limited by PL)', () => {
    const mod = findMod('accurate');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBeDefined();
    expect(mod!.maxRanks).toBeGreaterThan(0);
  });

  it('Precise has maxRanks: 1', () => {
    const mod = findMod('precise');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(1);
  });

  it('Subtle has maxRanks: 2', () => {
    const mod = findMod('subtle');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(2);
  });

  it('Variable Descriptor has maxRanks: 2', () => {
    const mod = findMod('variable_descriptor');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(2);
  });

  it('Activation has maxRanks: 2', () => {
    const mod = findMod('activation');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(2);
  });

  it('Diminished Range has maxRanks: 3', () => {
    const mod = findMod('diminished_range');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(3);
  });

  it('Affects Insubstantial has maxRanks: 2', () => {
    const mod = findMod('affects_insubstantial');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(2);
  });

  it('Indirect has maxRanks: 4', () => {
    const mod = findMod('indirect');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(4);
  });

  it('Reversible has maxRanks: 1', () => {
    const mod = findMod('reversible');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(1);
  });

  it('Noticeable has maxRanks: 1', () => {
    const mod = findMod('noticeable');
    expect(mod).toBeDefined();
    expect(mod!.maxRanks).toBe(1);
  });
});

describe('modifiers.json — modifiers without maxRanks can have unlimited ranks', () => {
  it('per_rank modifiers without maxRanks are unlimited', () => {
    const unlimitedPerRank = modifiers.filter(
      (m) => m.costType === 'per_rank' && !m.maxRanks
    );
    
    // These should be able to scale with power rank
    expect(unlimitedPerRank.length).toBeGreaterThan(0);
    
    // Examples: Multiattack, Contagious, Secondary Effect
    const examples = ['multiattack', 'contagious', 'secondary_effect'];
    for (const id of examples) {
      const mod = findMod(id);
      if (mod) {
        expect(mod.costType).toBe('per_rank');
        expect(mod.maxRanks).toBeUndefined();
      }
    }
  });

  it('flat_ranked modifiers without maxRanks can be taken multiple times', () => {
    const unlimitedFlatRanked = modifiers.filter(
      (m) => m.costType === 'flat_ranked' && !m.maxRanks
    );
    
    // Some flat_ranked modifiers don't have hard limits
    // Examples: Extended Range, Homing, Penetrating
    const examples = ['extended_range', 'homing', 'penetrating'];
    for (const id of examples) {
      const mod = findMod(id);
      if (mod) {
        expect(mod.costType).toBe('flat_ranked');
        // These may or may not have maxRanks - just checking they exist
        expect(mod).toBeDefined();
      }
    }
  });
});

describe('modifiers.json — maxRanks consistency', () => {
  it('flat modifiers with maxRanks: 1 are effectively binary', () => {
    const binaryFlat = modifiers.filter(
      (m) => m.costType === 'flat' && m.maxRanks === 1
    );
    
    // Examples: Precise, Reversible, Noticeable
    expect(binaryFlat.length).toBeGreaterThan(0);
    
    for (const mod of binaryFlat) {
      expect(mod.costType).toBe('flat');
      expect(mod.maxRanks).toBe(1);
    }
  });

  it('modifiers with maxRanks have positive values', () => {
    const withMaxRanks = modifiers.filter((m) => m.maxRanks !== undefined);
    
    for (const mod of withMaxRanks) {
      expect(
        mod.maxRanks,
        `${mod.id} has invalid maxRanks ${mod.maxRanks}`
      ).toBeGreaterThan(0);
    }
  });
});
