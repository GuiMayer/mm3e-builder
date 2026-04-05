/* ================================================
   Complications Section — Page 2
   Fills "Complications 1..11" in the format:
     "[Type]: Description"
   or just "Description" when no structured type.

   Items beyond slot 11 are silently dropped (the
   overflow warning is already handled by
   overflowCollector.checkPDFOverflow).
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { ICharacter, IComplication, ComplicationType } from '../../../entities/types';
import { setField } from '../helpers';
import { PDF_LIMITS } from '../overflowCollector';

/** Human-readable labels for each ComplicationType. */
const COMPLICATION_TYPE_LABEL: Record<ComplicationType, string> = {
  motivation:    'Motivation',
  enemy:         'Enemy',
  identity:      'Identity',
  relationship:  'Relationship',
  responsibility:'Responsibility',
  secret:        'Secret',
  weakness:      'Weakness',
  accident:      'Accident',
  social:        'Social',
  disability:    'Disability',
  power_loss:    'Power Loss',
};

/**
 * Format a single complication for the PDF.
 * With a type: "[Type]: Description"
 * Without:     "Description"
 */
function fmtComplication(c: IComplication): string {
  if (c.type) {
    const label = COMPLICATION_TYPE_LABEL[c.type] ?? c.type;
    return `${label}: ${c.description}`;
  }
  return c.description;
}

/**
 * Fill Complications 1..11 on page 2.
 * Excess complications (> 11) are silently dropped — the caller
 * already surfaced them via checkPDFOverflow.
 */
export function fillComplications(form: PDFForm, character: ICharacter): void {
  const lines = character.complications
    .slice(0, PDF_LIMITS.complications)
    .map(fmtComplication);

  for (let i = 1; i <= PDF_LIMITS.complications; i++) {
    setField(form, `Complications ${i}`, lines[i - 1] ?? '');
  }
}
