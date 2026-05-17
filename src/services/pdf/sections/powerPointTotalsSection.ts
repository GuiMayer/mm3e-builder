/* ================================================
   Power Point Totals Section — Page 1
   Fields: Abilities, Powers, Advantages, Skills, Defenses (numeric PP values)
   Plus the Total field (total PP spent, not remaining)
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import { setField } from '../helpers';

interface PowerPointTotalsPP {
  abilitiesCost: number;
  powersCost: number;
  advantagesCost: number;
  skillsCost: number;
  defensesCost: number;
  totalSpent: number;
}

/**
 * Fill the Power Point Totals line on page 1 with numeric values.
 * This must be called AFTER fillOffense to overwrite any descriptive text
 * that may have been placed in these fields.
 */
export function fillPowerPointTotals(form: PDFForm, pp: PowerPointTotalsPP): void {
  setField(form, 'Abilities',  String(pp.abilitiesCost));
  setField(form, 'Powers',     String(pp.powersCost));
  setField(form, 'Advantages', String(pp.advantagesCost));
  setField(form, 'Skills',     String(pp.skillsCost));
  setField(form, 'Defenses',   String(pp.defensesCost));
  setField(form, 'Total',      String(pp.totalSpent));
}
