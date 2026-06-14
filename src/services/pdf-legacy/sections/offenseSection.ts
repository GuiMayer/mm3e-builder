/* ================================================
   Offense Section — Page 1
   Fields: Attack 1-4, Offense 1-4, Description 1-4.
   Plus free-text fields: Skills, Advantages, Powers,
   Notes and Conditions.
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { IOffenseEntry } from '../../../shared/lib/offenseSummary';
import type { ICharacter } from '../../../entities/types';
import { setField, fmtOffenseEntry, sliceWithOverflow } from '../helpers';
import { PDF_LIMITS } from '../overflowCollector';

interface OffenseSectionOptions {
  offenseEntries: IOffenseEntry[];
  character: ICharacter;
  /** Extra lines to append to Notes and Conditions when attack overflow occurs. */
  attackOverflow: IOffenseEntry[];
}

export function fillOffense(form: PDFForm, opts: OffenseSectionOptions): void {
  const { offenseEntries, character, attackOverflow } = opts;
  const { kept } = sliceWithOverflow(offenseEntries, PDF_LIMITS.attacks);

  // ── Attack table (4 rows max) ──────────────────────────────
  for (let i = 0; i < PDF_LIMITS.attacks; i++) {
    const entry = kept[i];
    if (!entry) {
      setField(form, `Attack ${i + 1}`,      '');
      setField(form, `Offense ${i + 1}`,     '');
      setField(form, `Description ${i + 1}`, '');
      continue;
    }
    const { main, desc } = fmtOffenseEntry(entry);
    setField(form, `Attack ${i + 1}`,      entry.name);
    setField(form, `Offense ${i + 1}`,     main);
    setField(form, `Description ${i + 1}`, desc);
  }

  // ── Free-text summary fields (page 1 compact view) ────────
  fillFreeTextSummaries(form, character, attackOverflow);
}

/** Fill the three large free-text blocks on page 1: Skills, Advantages, Powers. */
function fillFreeTextSummaries(
  form: PDFForm,
  character: ICharacter,
  attackOverflow: IOffenseEntry[]
): void {
  // Skills — compact list: "Acrobatics +8, Deception +6, ..."
  const skillsSummary = character.skills
    .filter((s) => s.ranks > 0)
    .map((s) => {
      const label = s.subtype ? `${s.skillId} (${s.subtype})` : s.skillId;
      return `${label} +${s.ranks}`;
    })
    .join(', ');
  setField(form, 'Skills', skillsSummary);

  // Advantages — compact list: "Accurate Attack, Close Attack 3, ..."
  const advSummary = character.advantages
    .map((a) => (a.ranks > 1 ? `${a.advantageId} ${a.ranks}` : a.advantageId))
    .join(', ');
  setField(form, 'Advantages', advSummary);

  // Powers — one power per line: "Energy Blast (Damage 10) 10pp"
  const powersSummary = character.powers
    .map((p) => {
      const effects = p.components.map((c) => `${c.effectId} ${c.ranks}`).join(' + ');
      return `${p.name}: ${effects}`;
    })
    .join('\n');
  setField(form, 'Powers', powersSummary);

  // Powers and Devices 1-18 — individual power lines
  const powerLines = character.powers.map((p) => {
    const effects = p.components.map((c) => `${c.effectId} ${c.ranks}`).join(' + ');
    return `${p.name}: ${effects}`;
  });
  const { kept: keptPowers } = sliceWithOverflow(powerLines, PDF_LIMITS.powers);
  for (let i = 0; i < PDF_LIMITS.powers; i++) {
    setField(form, `Powers and Devices ${i + 1}`, keptPowers[i] ?? '');
  }

  // Notes and Conditions = character.notes + attack overflow
  const notesLines: string[] = [];
  if (character.notes) {
    notesLines.push(character.notes);
  }
  if (attackOverflow.length > 0) {
    notesLines.push('--- Overflow Attacks ---');
    attackOverflow.forEach((entry) => {
      const { main } = fmtOffenseEntry(entry);
      notesLines.push(`${entry.name}: ${main}`);
    });
  }
  setField(form, 'Notes and Conditions', notesLines.join('\n'));
}
