/* ================================================
   PDF Helpers — Shared utilities for all sections.
   Pure functions, no side effects.
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { IOffenseEntry } from '../../shared/lib/offenseSummary';

/* ── Field setters ────────────────────────────────────────────── */

/**
 * Set a text field value silently — does nothing if the field doesn't exist.
 * This makes new sections resilient to PDF template changes.
 */
export function setField(form: PDFForm, fieldName: string, value: string): void {
  try {
    const field = form.getTextField(fieldName);
    field.setText(value || '');
  } catch {
    // Field does not exist in this PDF version — ignore silently.
  }
}

/**
 * Set a checkbox field. Checks or unchecks silently.
 */
export function setCheck(form: PDFForm, fieldName: string, checked: boolean): void {
  try {
    const field = form.getCheckBox(fieldName);
    if (checked) {
      field.check();
    } else {
      field.uncheck();
    }
  } catch {
    // Field does not exist — ignore.
  }
}

/* ── Value formatters ─────────────────────────────────────────── */

/**
 * Format an ability score for the PDF.
 * - Absent abilities → "–" (en-dash, community standard)
 * - Positive values → "+N"
 * - Zero or negative → "N" (0, -1, etc.)
 */
export function fmtAbility(value: number, isAbsent: boolean): string {
  if (isAbsent) return '–';
  if (value > 0) return `+${value}`;
  return String(value);
}

/**
 * Format a signed bonus for display (attack bonus, defense ranks).
 * Positive → "+N", Zero → "+0", Negative → "N"
 */
export function fmtBonus(value: number): string {
  if (value >= 0) return `+${value}`;
  return String(value);
}

/**
 * Calculate the DC for a resistance check.
 * - Damage / Weaken / Nullify: 15 + rank (Toughness / ability resistance)
 * - Affliction / other: 10 + rank
 */
export function calcDC(effectType: 'damage' | 'affliction' | 'other', rank: number): number {
  return effectType === 'damage' ? 15 + rank : 10 + rank;
}

/**
 * Detect the broad effect category from a free-text effect string.
 * Used to compute DC automatically when the exact type isn't stored.
 */
function detectEffectType(effect: string): 'damage' | 'affliction' | 'other' {
  const lower = effect.toLowerCase();
  if (lower.startsWith('damage') || lower.startsWith('weaken') || lower.startsWith('nullify')) {
    return 'damage';
  }
  if (lower.startsWith('affliction')) {
    return 'affliction';
  }
  return 'other';
}

/**
 * Detect the resistance type from an effect string.
 * Defaults are based on M&M 3e rules.
 */
function detectResistance(effect: string): string {
  const lower = effect.toLowerCase();
  if (lower.startsWith('damage')) return 'Toughness';
  if (lower.startsWith('weaken') || lower.startsWith('nullify')) return 'Fortitude';
  if (lower.startsWith('affliction')) return 'Fortitude'; // most common; user notes override
  return 'resistance check';
}

/**
 * Extract the rank number from a free-text effect string like "Damage 10" or "Affliction 6".
 * Returns null if not parseable.
 */
function extractRank(effect: string): number | null {
  const match = /(\d+)/.exec(effect);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Format a single offense entry into the two-line PDF format:
 *   main:  "+8 Close, Damage 10 (DC 25 Toughness)"
 *   desc:  "Hindered/Defenseless/Incapacitated" (or empty)
 */
export function fmtOffenseEntry(entry: IOffenseEntry): { main: string; desc: string } {
  const rangeLabelMap: Record<string, string> = {
    close:       'Close',
    ranged:      'Ranged',
    perception:  'Perception',
    personal:    'Personal',
  };
  const rangeLabel = rangeLabelMap[entry.range] ?? entry.range;

  // No-roll attacks (Area, Perception range)
  if (entry.isNoRoll || entry.range === 'perception') {
    const effectType = detectEffectType(entry.effect);
    const rank = extractRank(entry.effect);
    if (rank !== null) {
      const dc = calcDC(effectType, rank);
      const res = detectResistance(entry.effect);
      const main = `${rangeLabel}, ${entry.effect} (DC ${dc} ${res})`;
      return { main, desc: entry.notes };
    }
    return { main: `${rangeLabel}, ${entry.effect}`, desc: entry.notes };
  }

  // Manual attack rows (free-text effect, bonus already set by user)
  if (entry.isManual) {
    const effectType = detectEffectType(entry.effect);
    const rank = extractRank(entry.effect);
    let dcPart = '';
    if (rank !== null) {
      const dc = calcDC(effectType, rank);
      const res = detectResistance(entry.effect);
      dcPart = ` (DC ${dc} ${res})`;
    }
    const main = `${entry.bonus} ${rangeLabel}, ${entry.effect}${dcPart}`;
    return { main, desc: entry.notes };
  }

  // Standard auto-derived attack
  const effectType = detectEffectType(entry.effect);
  const rank = extractRank(entry.effect);
  if (rank !== null) {
    const dc = calcDC(effectType, rank);
    const res = detectResistance(entry.effect);
    const main = `${entry.bonus} ${rangeLabel}, ${entry.effect} (DC ${dc} ${res})`;
    return { main, desc: entry.notes };
  }

  return { main: `${entry.bonus} ${rangeLabel}, ${entry.effect}`, desc: entry.notes };
}

/* ── Text splitting ───────────────────────────────────────────── */

/**
 * Split a multi-line text string into an array of exactly N strings.
 * Lines beyond N are dropped. Empty slots are filled with "".
 */
export function splitLines(text: string, maxLines: number): string[] {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const result: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    result.push(lines[i] ?? '');
  }
  return result;
}

/**
 * Truncate an array to maxLength, returning the sliced portion and the overflow.
 */
export function sliceWithOverflow<T>(arr: T[], maxLength: number): { kept: T[]; overflow: T[] } {
  return {
    kept:     arr.slice(0, maxLength),
    overflow: arr.slice(maxLength),
  };
}
