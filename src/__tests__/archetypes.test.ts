/**
 * ARCHETYPE GOLDEN FIXTURE TESTS
 *
 * Source: Mutants & Masterminds 3e — Deluxe Hero's Handbook, Chapter 2: Secret Origins
 * All archetypes are PL 10, total 150 PP.
 *
 * Strategy: We test the four cost sub-functions against known archetype data.
 * Archetypes WITHOUT powers (Martial Artist, Crime Fighter) let us verify every
 * subtotal independently. If any formula changes, the specific subtotal that
 * breaks will immediately tell you what went wrong.
 *
 * Why not test every archetype?
 *   - Archetypes with powers (Paragon, Battlesuit, etc.) require encoding the
 *     full power structure. These are covered by powerBuilder.test.ts.
 *   - Two power-free archetypes provide sufficient regression coverage for the
 *     core math: abilities, defenses, skills, advantages.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
} from '../shared/lib/mathEngine';

// ─────────────────────────────────────────────────────────
//  MARTIAL ARTIST (p. 40) — PL10, 150 PP
//
//  STR 4  AGL 6  FGT 13  AWE 5
//  STA 3  DEX 4  INT  0  PRE 0
//
//  Powers: 0 pp
//  Abilities 70 + Advantages 31 + Skills 30 + Defenses 19 = 120
//  (Powers 0 excluded → subtotals sum to 120, full total = 150)
// ─────────────────────────────────────────────────────────

describe('Archetype: Martial Artist (p.40)', () => {
  it('Abilities = 70 pp  (STR4 AGL6 FGT13 AWE5 STA3 DEX4 INT0 PRE0)', () => {
    // Formula: each ability rank × 2
    const abilities = { str: 4, agl: 6, fgt: 13, awe: 5, sta: 3, dex: 4, int: 0, pre: 0 };
    expect(calculateAbilitiesCost(abilities, [])).toBe(70);
  });

  it('Defenses = 19 pp  (Dodge+7 Parry+0 Fortitude+8 Will+4 bought)', () => {
    // Total scores: DODGE 13 (AGL 6 + 7), PARRY 13 (FGT 13 + 0),
    //               FORTITUDE 11 (STA 3 + 8), WILL 9 (AWE 5 + 4)
    const bought = { dodge: 7, parry: 0, fortitude: 8, will: 4 };
    expect(calculateDefensesCost(bought)).toBe(19);
  });

  it('Skills = 30 pp  (60 total ranks → ceil(60/2))', () => {
    // Acrobatics 10, Athletics 10, CC:Unarmed 3, Expertise:Philosophy 5,
    // Insight 8, Intimidation 8, Perception 8, Stealth 8  → 60 ranks total
    expect(calculateSkillsCost(60)).toBe(30);
  });

  it('Advantages = 31 pp  (Defensive Roll 4 + 27 single-rank advantages)', () => {
    // List (28 entries): Accurate Attack, Agile Feint, All-out Attack, Assessment,
    // Chokehold, Daze, Defensive Attack, Defensive Roll 4, Evasion, Improved Critical,
    // Improved Defense, Improved Disarm, Improved Grab, Improved Initiative,
    // Improved Smash, Improved Trip, Instant Up, Move-by Action, Power Attack,
    // Precise Attack, Prone Fighting, Redirect, Seize Initiative, Skill Mastery,
    // Takedown, Trance, Uncanny Dodge, Weapon Break
    const advantages = [
      { ranks: 4 }, // Defensive Roll 4
      ...Array(27).fill({ ranks: 1 }), // 27 single-rank advantages
    ];
    expect(calculateAdvantagesCost(advantages)).toBe(31);
  });

  it('Subtotals sum correctly (no powers)', () => {
    const abilities = calculateAbilitiesCost(
      { str: 4, agl: 6, fgt: 13, awe: 5, sta: 3, dex: 4, int: 0, pre: 0 },
      []
    );
    const defenses = calculateDefensesCost({ dodge: 7, parry: 0, fortitude: 8, will: 4 });
    const skills = calculateSkillsCost(60);
    const advantages = calculateAdvantagesCost([{ ranks: 4 }, ...Array(27).fill({ ranks: 1 })]);
    expect(abilities + defenses + skills + advantages).toBe(70 + 19 + 30 + 31);
    expect(abilities + defenses + skills + advantages).toBe(150);
  });
});

// ─────────────────────────────────────────────────────────
//  CRIME FIGHTER (p. 37) — PL10, 150 PP
//
//  STR 3  AGL 6  FGT 12  AWE 4
//  STA 3  DEX 6  INT  4  PRE 4
//
//  Powers: 0 pp  (uses Equipment advantage, not a Power)
//  Abilities 84 + Advantages 12 + Skills 39 + Defenses 15 = 150
// ─────────────────────────────────────────────────────────

describe('Archetype: Crime Fighter (p.37)', () => {
  it('Abilities = 84 pp  (STR3 AGL6 FGT12 AWE4 STA3 DEX6 INT4 PRE4)', () => {
    const abilities = { str: 3, agl: 6, fgt: 12, awe: 4, sta: 3, dex: 6, int: 4, pre: 4 };
    expect(calculateAbilitiesCost(abilities, [])).toBe(84);
  });

  it('Defenses = 15 pp  (Dodge+6 Parry+0 Fortitude+3 Will+6 bought)', () => {
    // Total scores: DODGE 12 (AGL 6 + 6), PARRY 12 (FGT 12 + 0),
    //               FORTITUDE 6 (STA 3 + 3), WILL 10 (AWE 4 + 6)
    const bought = { dodge: 6, parry: 0, fortitude: 3, will: 6 };
    expect(calculateDefensesCost(bought)).toBe(15);
  });

  it('Skills = 39 pp  (78 total ranks → ceil(78/2))', () => {
    // Acrobatics 6, Athletics 6, CC:Unarmed 2, Deception 6, Expertise 4,
    // Insight 6, Intimidation 8, Investigation 8, Perception 6,
    // RC:Thrown 8, Sleight of Hand 4, Stealth 8, Technology 2, Vehicles 4 → 78 total
    expect(calculateSkillsCost(78)).toBe(39);
  });

  it('Advantages = 12 pp  (Defensive Roll 3, Equipment 4, Uncanny Dodge, + 4 chosen)', () => {
    // Defensive Roll 3 = 3 ranks
    // Equipment 4 = 4 ranks
    // Uncanny Dodge = 1 rank
    // 4 chosen from optional list = 4 × 1 rank
    const advantages = [
      { ranks: 3 }, // Defensive Roll 3
      { ranks: 4 }, // Equipment 4
      { ranks: 1 }, // Uncanny Dodge
      { ranks: 4 }, // 4 chosen optional advantages
    ];
    expect(calculateAdvantagesCost(advantages)).toBe(12);
  });

  it('Subtotals sum to exactly 150 pp (no powers)', () => {
    const abilities = calculateAbilitiesCost(
      { str: 3, agl: 6, fgt: 12, awe: 4, sta: 3, dex: 6, int: 4, pre: 4 },
      []
    );
    const defenses = calculateDefensesCost({ dodge: 6, parry: 0, fortitude: 3, will: 6 });
    const skills = calculateSkillsCost(78);
    const advantages = calculateAdvantagesCost([
      { ranks: 3 },
      { ranks: 4 },
      { ranks: 1 },
      { ranks: 4 },
    ]);
    expect(abilities + defenses + skills + advantages).toBe(150);
  });
});

// ─────────────────────────────────────────────────────────
//  EDGE CASE: Absent abilities (fixed -10 PP)
// ─────────────────────────────────────────────────────────

describe('calculateAbilitiesCost — absent abilities', () => {
  it('absent ability has the same cost as an ability rank of -5', () => {
    // Construct: STR 11, AGL 3, FGT 9, AWE 1, STA absent (–), DEX 5, INT 0, PRE 0
    // An absent ability has a fixed -10 PP cost and no usable rank.
    const abilities = { str: 11, agl: 3, fgt: 9, awe: 1, sta: -5, dex: 5, int: 0, pre: 0 };
    const costWithAbsent = calculateAbilitiesCost(abilities, ['sta']);
    const costWithout = calculateAbilitiesCost(abilities, []);
    expect(costWithAbsent).toBe(costWithout);
  });
});
