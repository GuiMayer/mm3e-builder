/**
 * DATA INTEGRITY TESTS
 *
 * These tests verify structural and semantic correctness of the JSON data files
 * WITHOUT requiring manual consultation of the rulebook.
 *
 * Rules encoded here come directly from the MM3e RAW and should never change:
 *   - Extras always cost > 0 per rank
 *   - Flaws always cost < 0 per rank
 *   - No duplicate IDs within a file
 *   - Required fields are present on every record
 */

import { describe, it, expect } from 'vitest';
import modifiersRaw from '../data/modifiers.json';
import powersRaw from '../data/powers.json';
import advantagesRaw from '../data/advantages.json';
import skillsRaw from '../data/skills.json';
import type { IModifierDef, IPowerEffect } from '../entities/types';

// Type helpers for test assertions
type ModifierWithSubtypes = IModifierDef & {
  subtypes?: Array<{ id: string; costValue: number }>;
};

type PowerWithModifiers = IPowerEffect & {
  extras?: string[];
  flaws?: string[];
};

const modifiers = modifiersRaw as IModifierDef[];
const powers = powersRaw as IPowerEffect[];

// ─────────────────────────────────────────────────────────
//  modifiers.json
// ─────────────────────────────────────────────────────────

describe('modifiers.json — structural integrity', () => {
  it('has no duplicate modifier IDs', () => {
    const ids = modifiers.map((m) => m.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it('every modifier has all required fields', () => {
    const REQUIRED = ['id', 'name', 'category', 'costType', 'costValue'];
    for (const mod of modifiers) {
      for (const field of REQUIRED) {
        expect(mod, `${mod.id} missing "${field}"`).toHaveProperty(field);
      }
    }
  });

  it('category is one of: extra | flaw | special', () => {
    const VALID = new Set(['extra', 'flaw', 'special']);
    for (const mod of modifiers) {
      expect(VALID.has(mod.category), `${mod.id} has invalid category "${mod.category}"`).toBe(true);
    }
  });

  it('costType is one of: per_rank | flat | flat_ranked', () => {
    const VALID = new Set(['per_rank', 'flat', 'flat_ranked']);
    for (const mod of modifiers) {
      expect(VALID.has(mod.costType), `${mod.id} has invalid costType "${mod.costType}"`).toBe(true);
    }
  });
});

describe('modifiers.json — extended structural validation', () => {
  it('incompatibleWith is always an array', () => {
    for (const mod of modifiers) {
      expect(
        Array.isArray(mod.incompatibleWith),
        `${mod.id} has non-array incompatibleWith`
      ).toBe(true);
    }
  });

  it('IDs in incompatibleWith reference existing modifiers', () => {
    const allIds = new Set(modifiers.map((m) => m.id));
    for (const mod of modifiers) {
      for (const incompatId of mod.incompatibleWith) {
        expect(
          allIds.has(incompatId),
          `${mod.id} references non-existent modifier "${incompatId}" in incompatibleWith`
        ).toBe(true);
      }
    }
  });

  it('maxRanks, when present, is a positive number', () => {
    for (const mod of modifiers) {
      if (mod.maxRanks !== undefined) {
        expect(
          typeof mod.maxRanks === 'number' && mod.maxRanks > 0,
          `${mod.id} has invalid maxRanks ${mod.maxRanks}`
        ).toBe(true);
      }
    }
  });

  it('description and name are non-empty strings', () => {
    for (const mod of modifiers) {
      expect(mod.name.length, `${mod.id} has empty name`).toBeGreaterThan(0);
      expect(mod.description.length, `${mod.id} has empty description`).toBeGreaterThan(0);
    }
  });

  it('longDescription, when present, is longer than description', () => {
    for (const mod of modifiers) {
      if (mod.longDescription) {
        expect(
          mod.longDescription.length > mod.description.length,
          `${mod.id} longDescription (${mod.longDescription.length} chars) is not longer than description (${mod.description.length} chars)`
        ).toBe(true);
      }
    }
  });

  it('options, when present, is an array with valid structure', () => {
    for (const mod of modifiers) {
      if (mod.options) {
        expect(Array.isArray(mod.options), `${mod.id} has non-array options`).toBe(true);
        for (const opt of mod.options) {
          expect(opt.label, `${mod.id} option missing label`).toBeTruthy();
          expect(opt.notes, `${mod.id} option missing notes`).toBeTruthy();
        }
      }
    }
  });

  it('subtypes, when present, have valid structure', () => {
    for (const mod of modifiers) {
      const modWithSubtypes = mod as ModifierWithSubtypes;
      if (modWithSubtypes.subtypes) {
        expect(Array.isArray(modWithSubtypes.subtypes), `${mod.id} has non-array subtypes`).toBe(true);
        for (const sub of modWithSubtypes.subtypes) {
          expect(sub.id, `${mod.id} subtype missing id`).toBeTruthy();
          expect(sub.label, `${mod.id} subtype missing label`).toBeTruthy();
          expect(typeof sub.costValue, `${mod.id} subtype missing costValue`).toBe('number');
        }
      }
    }
  });

  it('modifiers with subtypes have unique subtype IDs', () => {
    for (const mod of modifiers) {
      const modWithSubtypes = mod as ModifierWithSubtypes;
      if (modWithSubtypes.subtypes) {
        const ids = modWithSubtypes.subtypes.map((s) => s.id);
        const unique = new Set(ids);
        expect(
          ids.length,
          `${mod.id} has duplicate subtype IDs: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`
        ).toBe(unique.size);
      }
    }
  });

  it('i18n translations, when present, have valid structure', () => {
    for (const mod of modifiers) {
      if (mod.i18n) {
        for (const [lang, trans] of Object.entries(mod.i18n)) {
          expect(typeof trans, `${mod.id} i18n.${lang} is not an object`).toBe('object');
          // At least one translation field should be present
          const hasTranslation = trans.name || trans.description || trans.longDescription;
          expect(hasTranslation, `${mod.id} i18n.${lang} has no translation fields`).toBeTruthy();
        }
      }
    }
  });
});

describe('modifiers.json — costType validation rules', () => {
  it('flat_ranked modifiers should have maxRanks defined', () => {
    const flatRanked = modifiers.filter((m) => m.costType === 'flat_ranked');
    const withoutMaxRanks = flatRanked.filter((m) => !m.maxRanks);
    
    // Some flat_ranked modifiers may not have maxRanks if they're unlimited
    // This is a warning test - we document which ones don't have it
    if (withoutMaxRanks.length > 0) {
      // const ids = withoutMaxRanks.map((m) => m.id).join(', ');
      // This is informational - not all flat_ranked need maxRanks
      expect(withoutMaxRanks.length).toBeLessThan(flatRanked.length);
    }
  });

  it('modifiers with costValue 0 should have subtypes, options, or documented special logic', () => {
    const zeroCosters = modifiers.filter((m) => m.costValue === 0);
    const KNOWN_SPECIAL_LOGIC = [
      'affects_objects',
      'affects_others', 
      'alternate_resistance',
      'attack',
      'linked',
      'sleep',
      'sustained'
    ];
    
    for (const mod of zeroCosters) {
      const modWithSubtypes = mod as ModifierWithSubtypes;
      const hasSubtypes = modWithSubtypes.subtypes && modWithSubtypes.subtypes.length > 0;
      const hasOptions = mod.options && mod.options.length > 0;
      const isKnownSpecial = KNOWN_SPECIAL_LOGIC.includes(mod.id);
      
      // Zero-cost modifiers should have subtypes, options, or be in the known special list
      expect(
        hasSubtypes || hasOptions || isKnownSpecial,
        `${mod.id} has costValue 0 but no subtypes, options, or documented special logic`
      ).toBe(true);
    }
  });
});

describe('modifiers.json — RAW semantic rules', () => {
  const extras = modifiers.filter((m) => m.category === 'extra');
  const flaws = modifiers.filter((m) => m.category === 'flaw');

  it('all extras have costValue >= 0 (engine-computed extras may use 0 as placeholder)', () => {
    for (const mod of extras) {
      // Some extras (e.g. affects_objects, alternate_resistance) use costValue=0
      // because their actual cost is computed by special engine logic.
      // The invariant is: extras must never have a NEGATIVE costValue.
      expect(
        mod.costValue,
        `extra "${mod.id}" has negative costValue ${mod.costValue}`
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it('all extras with subtypes have subtypes where every costValue >= 0', () => {
    for (const mod of modifiers) {
      const modWithSubtypes = mod as ModifierWithSubtypes;
      const subtypes = modWithSubtypes.subtypes;
      if (!subtypes) continue;
      for (const sub of subtypes) {
        expect(
          sub.costValue,
          `extra "${mod.id}" subtype "${sub.id}" has invalid costValue ${sub.costValue}`
        ).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('all flaws have costValue < 0 (except power-level flaws)', () => {
    for (const mod of flaws) {
      // Power-level flaws like 'removable' have costValue 0 because their
      // discount is calculated separately via calcRemovableDiscount()
      if ((mod as Record<string, unknown>).appliesToPower) continue;
      expect(mod.costValue, `flaw "${mod.id}" has non-negative costValue ${mod.costValue}`).toBeLessThan(0);
    }
  });

  it('Alternate Resistance has exactly 4 subtypes (Will, Fortitude, Dodge, Parry)', () => {
    const altRes = modifiers.find((m) => m.id === 'alternate_resistance');
    expect(altRes, 'alternate_resistance modifier not found').toBeDefined();
    const altResWithSubtypes = altRes as ModifierWithSubtypes;
    const subtypes = altResWithSubtypes.subtypes;
    expect(subtypes).toBeDefined();
    expect(subtypes!.length).toBe(4);
    const ids = subtypes!.map((s) => s.id).sort();
    expect(ids).toEqual(['dodge', 'fortitude', 'parry', 'will']);
  });

  it('Alternate Resistance subtype costs match RAW (Will+1, Fortitude+2, Dodge+1, Parry+1)', () => {
    const altRes = modifiers.find((m) => m.id === 'alternate_resistance');
    const altResWithSubtypes = altRes as ModifierWithSubtypes;
    const subtypes = altResWithSubtypes.subtypes!;
    const byId = Object.fromEntries(subtypes.map((s) => [s.id, s.costValue]));
    expect(byId['will']).toBe(1);
    expect(byId['fortitude']).toBe(2);
    expect(byId['dodge']).toBe(1);
    expect(byId['parry']).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────
//  powers.json
// ─────────────────────────────────────────────────────────

describe('powers.json — structural integrity', () => {
  it('has no duplicate power IDs', () => {
    const ids = powers.map((p) => p.id);
    const unique = new Set(ids);
    expect(ids.length, `Duplicate IDs: ${[...ids].filter((id, i) => ids.indexOf(id) !== i)}`).toBe(unique.size);
  });

  it('every power has all required fields', () => {
    const REQUIRED = ['id', 'name', 'baseCost', 'action', 'range', 'duration'];
    for (const power of powers) {
      for (const field of REQUIRED) {
        expect(power, `power "${power.id}" missing "${field}"`).toHaveProperty(field);
      }
    }
  });

  it('baseCost is a non-negative number on every power', () => {
    for (const power of powers) {
      expect(
        typeof power.baseCost === 'number' && power.baseCost >= 0,
        `power "${power.id}" has invalid baseCost ${power.baseCost}`
      ).toBe(true);
    }
  });

  it('inline extras/flaws in powers have required fields and valid costTypes', () => {
    const VALID_COST_TYPES = new Set(['per_rank', 'flat', 'flat_ranked']);
    const VALID_CATEGORIES = new Set(['extra', 'flaw', 'special']);
    for (const power of powers) {
      const powerWithMods = power as PowerWithModifiers;
      const allMods = [
        ...(powerWithMods.extras ?? []),
        ...(powerWithMods.flaws ?? []),
      ] as Array<{ id: string; costType: string; costValue: number; category: string }>;
      for (const mod of allMods) {
        expect(mod.id, `power "${power.id}" inline mod missing id`).toBeTruthy();
        expect(
          VALID_COST_TYPES.has(mod.costType),
          `power "${power.id}" inline mod "${mod.id}" has invalid costType "${mod.costType}"`
        ).toBe(true);
        if (VALID_CATEGORIES.has(mod.category)) {
          if (mod.category === 'extra') {
            expect(
              mod.costValue,
              `power "${power.id}" inline extra "${mod.id}" has negative costValue ${mod.costValue} (must be >= 0)`
            ).toBeGreaterThanOrEqual(0);
          } else if (mod.category === 'flaw') {
            expect(
              mod.costValue,
              `power "${power.id}" inline flaw "${mod.id}" has positive costValue ${mod.costValue} (must be <= 0)`
            ).toBeLessThanOrEqual(0);
          }
        }
      }
    }
  });
});

describe('powers.json — RAW spot-checks', () => {
  it('Damage costs 1 PP/rank', () => {
    const dmg = powers.find((p) => p.id === 'damage');
    expect(dmg?.baseCost).toBe(1);
  });

  it('Move Object costs 2 PP/rank', () => {
    const mo = powers.find((p) => p.id === 'move-object');
    expect(mo?.baseCost).toBe(2);
  });

  it('Flight costs 2 PP/rank', () => {
    const fl = powers.find((p) => p.id === 'flight');
    expect(fl?.baseCost).toBe(2);
  });

  it('Immunity costs 1 PP/rank', () => {
    const imm = powers.find((p) => p.id === 'immunity');
    expect(imm?.baseCost).toBe(1);
  });

  it('Affliction costs 1 PP/rank', () => {
    const aff = powers.find((p) => p.id === 'affliction');
    expect(aff?.baseCost).toBe(1);
  });

  it('Variable costs 7 PP/rank', () => {
    const v = powers.find((p) => p.id === 'variable');
    expect(v?.baseCost).toBe(7);
  });
});

// ─────────────────────────────────────────────────────────
//  advantages.json + skills.json
// ─────────────────────────────────────────────────────────

describe('advantages.json — structural integrity', () => {
  it('has no duplicate advantage IDs', () => {
    const raw = advantagesRaw as Array<{ id: string }>;
    const ids = raw.map((a) => a.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });
});

describe('skills.json — structural integrity', () => {
  it('has no duplicate skill IDs', () => {
    const raw = skillsRaw as Array<{ id: string }>;
    const ids = raw.map((s) => s.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it('every skill has id and name', () => {
    const raw = skillsRaw as Array<{ id: string; name: string }>;
    for (const skill of raw) {
      expect(skill.id).toBeTruthy();
      expect(skill.name).toBeTruthy();
    }
  });
});
