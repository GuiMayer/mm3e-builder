/* ================================================
   Equipment Section — Page 2
   Fills "Equipment 1..10" by splitting the free-text
   equipmentNotes field on newlines.
   Lines beyond slot 10 are silently dropped (the
   overflow check in overflowCollector is not needed
   here as equipment is a single free-text block,
   not a structured list with named items).
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { ICharacter, IResource } from '../../../entities/types';
import { setField, splitLines } from '../helpers';
import { PDF_LIMITS } from '../overflowCollector';
import { getLinkedResourceCharges } from '../../../shared/lib/resourceCalculations';

/**
 * Fill Equipment 1..10 on page 2 from the character's
 * free-text equipmentNotes field.
 */
export function fillEquipment(form: PDFForm, character: ICharacter, resources: IResource[] = []): void {
  const resourceLines = getLinkedResourceCharges(character, resources).map(({ resource, link, charged, unit, alternate }) => `${resource.name || 'Unnamed resource'} — ${charged} ${unit}${link.isFree ? ' (Free)' : alternate ? ' (Alternate)' : unit === 'EP' && link.contributionEP !== undefined ? ' (Shared)' : ''}`);
  const lines = splitLines([character.equipmentNotes ?? '', ...resourceLines].filter(Boolean).join('\n'), PDF_LIMITS.equipment);

  for (let i = 1; i <= PDF_LIMITS.equipment; i++) {
    setField(form, `Equipment ${i}`, lines[i - 1] ?? '');
  }
}
