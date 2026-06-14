/* ================================================
   Notes Section — Page 2
   Fills "Notes 1..7" with content in this priority:
     1. character.notes (split by newline)
     2. overflow advantages (items beyond slot 11)

   If both sources are combined and exceed 7 slots,
   remaining lines are silently dropped — the
   overflow warning is already surfaced by
   overflowCollector.checkPDFOverflow.
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { ICharacter } from '../../../entities/types';
import { splitLines, setField } from '../helpers';
import { PDF_LIMITS } from '../overflowCollector';

/**
 * Fill Notes 1..7 on page 2.
 *
 * @param form              - The PDFForm from pdf-lib
 * @param character         - Full character data
 * @param advantageOverflow - Lines that didn't fit in Advantages 1..11;
 *                            provided by fillAdvantages() return value.
 */
export function fillNotes(
  form: PDFForm,
  character: ICharacter,
  advantageOverflow: string[]
): void {
  // Build the combined notes list
  const lines: string[] = [];

  // 1. Character notes (may be multi-line)
  if (character.notes?.trim()) {
    const noteLines = splitLines(character.notes, PDF_LIMITS.notes);
    lines.push(...noteLines);
  }

  // 2. Advantage overflow header + items
  if (advantageOverflow.length > 0) {
    if (lines.length > 0 && lines.length < PDF_LIMITS.notes) {
      lines.push('--- Overflow Advantages ---');
    } else if (lines.length === 0) {
      lines.push('--- Overflow Advantages ---');
    }
    for (const adv of advantageOverflow) {
      if (lines.length >= PDF_LIMITS.notes) break;
      lines.push(adv);
    }
  }

  // Fill Notes 1..7, padding with empty strings
  for (let i = 1; i <= PDF_LIMITS.notes; i++) {
    setField(form, `Notes ${i}`, lines[i - 1] ?? '');
  }
}
