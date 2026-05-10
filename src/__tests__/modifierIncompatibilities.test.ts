/**
 * MODIFIER INCOMPATIBILITIES TESTS
 *
 * These tests verify that modifier incompatibility rules are correctly defined
 * and that incompatibilities are bidirectional (if A is incompatible with B,
 * then B must be incompatible with A).
 */

import { describe, it, expect } from 'vitest';
import modifiersRaw from '../data/modifiers.json';
import type { IModifierDef } from '../entities/types';

const modifiers = modifiersRaw as IModifierDef[];

// Helper to find modifier by ID
const findMod = (id: string): IModifierDef | undefined => {
  return modifiers.find((m) => m.id === id);
};

describe('modifiers.json — Incompatibility rules', () => {
  it('accurate and inaccurate are mutually incompatible', () => {
    const accurate = findMod('accurate');
    const inaccurate = findMod('inaccurate');
    
    expect(accurate).toBeDefined();
    expect(inaccurate).toBeDefined();
    
    expect(
      accurate!.incompatibleWith.includes('inaccurate'),
      'accurate should be incompatible with inaccurate'
    ).toBe(true);
    
    expect(
      inaccurate!.incompatibleWith.includes('accurate'),
      'inaccurate should be incompatible with accurate'
    ).toBe(true);
  });

  it('increased_range and reduced_range are mutually incompatible', () => {
    const increased = findMod('increased_range');
    const reduced = findMod('reduced_range');
    
    expect(increased).toBeDefined();
    expect(reduced).toBeDefined();
    
    expect(
      increased!.incompatibleWith.includes('reduced_range'),
      'increased_range should be incompatible with reduced_range'
    ).toBe(true);
    
    expect(
      reduced!.incompatibleWith.includes('increased_range'),
      'reduced_range should be incompatible with increased_range'
    ).toBe(true);
  });

  it('increased_range and diminished_range are mutually incompatible', () => {
    const increased = findMod('increased_range');
    const diminished = findMod('diminished_range');
    
    expect(increased).toBeDefined();
    expect(diminished).toBeDefined();
    
    expect(
      increased!.incompatibleWith.includes('diminished_range'),
      'increased_range should be incompatible with diminished_range'
    ).toBe(true);
    
    expect(
      diminished!.incompatibleWith.includes('increased_range'),
      'diminished_range should be incompatible with increased_range'
    ).toBe(true);
  });

  it('all incompatibilities are bidirectional', () => {
    for (const mod of modifiers) {
      for (const incompatId of mod.incompatibleWith) {
        const incompatMod = findMod(incompatId);
        expect(
          incompatMod,
          `${mod.id} references non-existent modifier "${incompatId}"`
        ).toBeDefined();
        
        expect(
          incompatMod!.incompatibleWith.includes(mod.id),
          `${mod.id} is incompatible with ${incompatId}, but ${incompatId} is not incompatible with ${mod.id}`
        ).toBe(true);
      }
    }
  });

  it('no modifier is incompatible with itself', () => {
    for (const mod of modifiers) {
      expect(
        mod.incompatibleWith.includes(mod.id),
        `${mod.id} is incompatible with itself`
      ).toBe(false);
    }
  });

  it('incompatibleWith arrays have no duplicates', () => {
    for (const mod of modifiers) {
      const unique = new Set(mod.incompatibleWith);
      expect(
        mod.incompatibleWith.length,
        `${mod.id} has duplicate entries in incompatibleWith`
      ).toBe(unique.size);
    }
  });
});

describe('modifiers.json — Known incompatibility coverage', () => {
  it('documents all known RAW incompatibilities', () => {
    // These are the main incompatibilities documented in the rulebook
    const knownPairs = [
      ['accurate', 'inaccurate'],
      ['increased_range', 'reduced_range'],
      ['increased_range', 'diminished_range'],
    ];

    for (const [modA, modB] of knownPairs) {
      const a = findMod(modA);
      const b = findMod(modB);
      
      if (a && b) {
        expect(
          a.incompatibleWith.includes(modB),
          `${modA} should be incompatible with ${modB}`
        ).toBe(true);
        
        expect(
          b.incompatibleWith.includes(modA),
          `${modB} should be incompatible with ${modA}`
        ).toBe(true);
      }
    }
  });
});
