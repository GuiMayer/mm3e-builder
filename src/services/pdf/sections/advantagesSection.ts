/* ================================================
   Advantages Section — Page 2
   Fills "Advantages 1..11" with the character's
   advantage list. Items beyond slot 11 are pushed
   to overflow (to be written by notesSection).

   Format per slot: "Advantage Name [Rank N]"
   - Ranked advantages with ranks > 1 show the rank.
   - Unranked or rank-1 advantages show the name only.
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { ICharacter, ICharacterAdvantage } from '../../../entities/types';
import type { IAdvantageDef } from '../../../entities/types';
import { setField } from '../helpers';
import { PDF_LIMITS } from '../overflowCollector';

/** Items that overflow slot 11 for the caller (notesSection) to handle. */
export interface AdvantageOverflow {
  overflowLines: string[];
}

/**
 * Format a single advantage for display on the PDF.
 * Returns "Advantage Name" or "Advantage Name [Rank N]".
 */
function fmtAdvantage(adv: ICharacterAdvantage, def: IAdvantageDef | undefined): string {
  const name = def?.name ?? adv.advantageId;
  if (adv.ranks > 1) return `${name} ${adv.ranks}`;
  return name;
}

/**
 * Fill Advantages 1..11 on page 2.
 * Returns any overflow items so the orchestrator can pass them to fillNotes.
 */
export function fillAdvantages(
  form: PDFForm,
  character: ICharacter,
  advantageDefs: IAdvantageDef[]
): AdvantageOverflow {
  const defMap = new Map(advantageDefs.map((d) => [d.id, d]));
  const formatted = character.advantages.map((a) => fmtAdvantage(a, defMap.get(a.advantageId)));

  const kept     = formatted.slice(0, PDF_LIMITS.advantages);
  const overflow = formatted.slice(PDF_LIMITS.advantages);

  for (let i = 1; i <= PDF_LIMITS.advantages; i++) {
    setField(form, `Advantages ${i}`, kept[i - 1] ?? '');
  }

  return { overflowLines: overflow };
}
