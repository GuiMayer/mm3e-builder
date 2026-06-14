/* ================================================
   Overflow Collector
   Detects and accumulates overflow items for each
   PDF section that has a fixed slot limit.
   ================================================ */

import type { ICharacter } from '../../entities/types';
import type { IOffenseEntry } from '../../shared/lib/offenseSummary';

/** Lightweight split used internally — avoids circular dependency with helpers.ts. */
function split<T>(arr: T[], max: number): { kept: T[]; overflow: T[] } {
  return { kept: arr.slice(0, max), overflow: arr.slice(max) };
}

/** Describes a single section that has more items than the PDF supports. */
export interface PDFOverflowReport {
  section: string;         // Human-readable section name
  limit: number;           // Max slots available in the PDF
  count: number;           // Total items the character has
  overflowItems: string[]; // Names/labels of items that won't fit
  destination: string;     // Where overflow will be written
}

/** PDF field limits per section (matches the actual fillable PDF). */
export const PDF_LIMITS = {
  attacks:        4,   // Attack 1-4 / Offense 1-4 / Description 1-4
  advantages:    11,   // Advantages 1-11 (p.2)
  equipment:     10,   // Equipment 1-10 (p.2)
  complications: 11,   // Complications 1-11 (p.2)
  powers:        18,   // Powers and Devices 1-18 (p.1)
  closeCombat:    3,   // CC 1-3 subtypes (p.2)
  rangedCombat:   3,   // RC 1-3 subtypes (p.2)
  expertise:      4,   // EX 1-4 subtypes (p.2)
  notes:          7,   // Notes 1-7 (p.2)
} as const;

/**
 * Inspect the character and offense entries and return a list of
 * sections that exceed their PDF field limits.
 */
export function checkPDFOverflow(
  character: ICharacter,
  offenseEntries: IOffenseEntry[]
): PDFOverflowReport[] {
  const reports: PDFOverflowReport[] = [];

  // ── Attacks ──────────────────────────────────────────────────
  if (offenseEntries.length > PDF_LIMITS.attacks) {
    const { overflow } = split(offenseEntries, PDF_LIMITS.attacks);
    reports.push({
      section:       'Attacks',
      limit:         PDF_LIMITS.attacks,
      count:         offenseEntries.length,
      overflowItems: overflow.map((e) => e.name),
      destination:   '"Notes and Conditions" (page 1)',
    });
  }

  // ── Advantages ───────────────────────────────────────────────
  if (character.advantages.length > PDF_LIMITS.advantages) {
    const { overflow } = split(character.advantages, PDF_LIMITS.advantages);
    reports.push({
      section:       'Advantages',
      limit:         PDF_LIMITS.advantages,
      count:         character.advantages.length,
      overflowItems: overflow.map((a) => a.advantageId),
      destination:   '"Notes 1-7" (page 2)',
    });
  }

  // ── Complications ────────────────────────────────────────────
  if (character.complications.length > PDF_LIMITS.complications) {
    const { overflow } = split(character.complications, PDF_LIMITS.complications);
    reports.push({
      section:       'Complications',
      limit:         PDF_LIMITS.complications,
      count:         character.complications.length,
      overflowItems: overflow.map((c) => c.title ?? c.description.slice(0, 30)),
      destination:   '"Notes and Conditions" (page 1)',
    });
  }

  // ── Powers ───────────────────────────────────────────────────
  if (character.powers.length > PDF_LIMITS.powers) {
    const { overflow } = split(character.powers, PDF_LIMITS.powers);
    reports.push({
      section:       'Powers',
      limit:         PDF_LIMITS.powers,
      count:         character.powers.length,
      overflowItems: overflow.map((p) => p.name),
      destination:   '"Notes and Conditions" (page 1)',
    });
  }

  // ── Close Combat subtypes ────────────────────────────────────
  const ccSkills = character.skills.filter((s) => s.skillId === 'close_combat' && s.subtype);
  if (ccSkills.length > PDF_LIMITS.closeCombat) {
    const { overflow } = split(ccSkills, PDF_LIMITS.closeCombat);
    reports.push({
      section:       'Close Combat (subtypes)',
      limit:         PDF_LIMITS.closeCombat,
      count:         ccSkills.length,
      overflowItems: overflow.map((s) => `Close Combat (${s.subtype ?? ''})`),
      destination:   '"Notes 1-7" (page 2)',
    });
  }

  // ── Ranged Combat subtypes ───────────────────────────────────
  const rcSkills = character.skills.filter((s) => s.skillId === 'ranged_combat' && s.subtype);
  if (rcSkills.length > PDF_LIMITS.rangedCombat) {
    const { overflow } = split(rcSkills, PDF_LIMITS.rangedCombat);
    reports.push({
      section:       'Ranged Combat (subtypes)',
      limit:         PDF_LIMITS.rangedCombat,
      count:         rcSkills.length,
      overflowItems: overflow.map((s) => `Ranged Combat (${s.subtype ?? ''})`),
      destination:   '"Notes 1-7" (page 2)',
    });
  }

  // ── Expertise subtypes ───────────────────────────────────────
  const expSkills = character.skills.filter((s) => s.skillId === 'expertise' && s.subtype);
  if (expSkills.length > PDF_LIMITS.expertise) {
    const { overflow } = split(expSkills, PDF_LIMITS.expertise);
    reports.push({
      section:       'Expertise (subtypes)',
      limit:         PDF_LIMITS.expertise,
      count:         expSkills.length,
      overflowItems: overflow.map((s) => `Expertise (${s.subtype ?? ''})`),
      destination:   '"Notes 1-7" (page 2)',
    });
  }

  return reports;
}
