/* ================================================
   PDF Fill Service — Orchestrator (Phase 3)
   Pure coordinator: no field-setting logic here.
   All field logic lives in the sections/ modules.
   ================================================ */

import type { ICharacter, IResource } from '../../entities/types';
import { buildOffenseSummary } from '../../shared/lib/offenseSummary';
import type { IOffenseEntry } from '../../shared/lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import {
  calcToughnessBonus,
  calcInitiativeBonus,
} from '../../shared/lib/mathEngine';
import { calculateCharacterPointSummary } from '../../shared/lib/pointSummary';
import { getEffectiveAbilityRank } from '../../shared/lib/abilityRanks';

import { loadPDFTemplate } from './pdfTemplateLoader';
import { sliceWithOverflow } from './helpers';
import { PDF_LIMITS } from './overflowCollector';
import { sanitizeFileName } from '../downloadHelper';

import { fillHeader }     from './sections/headerSection';
import { fillAbilities }  from './sections/abilitiesSection';
import { fillDefenses }   from './sections/defensesSection';
import { fillOffense }    from './sections/offenseSection';
import { fillSkills }     from './sections/skillsSection';
import { fillAdvantages }    from './sections/advantagesSection';
import { fillEquipment }     from './sections/equipmentSection';
import { fillComplications } from './sections/complicationsSection';
import { fillNotes }         from './sections/notesSection';
import { fillPowerPointTotals } from './sections/powerPointTotalsSection';

// Re-export for MenuBar to use without importing from overflowCollector directly
export { checkPDFOverflow } from './overflowCollector';
export type { PDFOverflowReport } from './overflowCollector';

/**
 * Fill the official M&M 3e PDF character sheet and trigger a browser download.
 * Pre-flight overflow check should be done separately via checkPDFOverflow()
 * so the caller can show a confirmation modal first.
 *
 * @param character - Full character data from charStore
 */
export async function fillAndDownloadPDF(character: ICharacter, resources: IResource[] = []): Promise<void> {
  // ── 1. Derive offense entries (pure function, no React) ───────
  const offenseEntries: IOffenseEntry[] = buildOffenseSummary(
    character,
    POWER_DEFS,
    SKILL_DEFS,
    ADVANTAGE_DEFS,
    MODIFIER_DEFS,
    undefined,
    resources
  );

  // ── 2. Load fresh template ────────────────────────────────────
  const pdfDoc = await loadPDFTemplate();
  const form   = pdfDoc.getForm();

  // ── 3. Derive calculated PP values ────────────────────────────
  const {
    abilitiesCost,
    defensesCost,
    skillsCost,
    advantagesCost,
    powersCost,
    totalSpent,
    totalAvailable,
    remaining,
  } = calculateCharacterPointSummary(
    character,
    resources,
    POWER_DEFS,
    MODIFIER_DEFS
  );

  // ── 4. Derive toughness and initiative ────────────────────────
  const staValue = getEffectiveAbilityRank(character.abilities, character.absentAbilities, 'sta');
  const aglValue = getEffectiveAbilityRank(character.abilities, character.absentAbilities, 'agl');

  const { bonus: toughnessBonus } = calcToughnessBonus(
    character.powers,
    character.advantages,
    POWER_DEFS
  );
  const toughnessTotal = staValue + toughnessBonus;

  const { total: initiativeTotal } = calcInitiativeBonus(
    aglValue,
    character.advantages,
    character.powers,
    POWER_DEFS
  );

  // ── 5. Handle overflow for attacks ────────────────────────────
  const { overflow: attackOverflow } = sliceWithOverflow(offenseEntries, PDF_LIMITS.attacks);

  // ── 6. Fill each section ──────────────────────────────────────
  fillHeader(form, character.header, { totalAvailable, totalSpent, remaining });

  fillAbilities(form, character.abilities, character.absentAbilities, { abilitiesCost });

  fillDefenses(
    form,
    character.abilities,
    character.absentAbilities,
    character.defenses,
    toughnessTotal,
    initiativeTotal,
    { defensesCost }
  );

  fillOffense(form, { offenseEntries, character, attackOverflow });

  // ── Phase 2: Page 2 sections ──────────────────────────────
  fillSkills(form, character, SKILL_DEFS);

  const { overflowLines: advantageOverflow } = fillAdvantages(form, character, ADVANTAGE_DEFS);

  fillEquipment(form, character, resources);

  // ── Phase 3: Complications, Notes ────────────────────────
  fillComplications(form, character);

  fillNotes(form, character, advantageOverflow);

  // ── Phase 4: Power Point Totals (must be last to overwrite descriptive text) ──
  fillPowerPointTotals(form, {
    abilitiesCost,
    powersCost,
    advantagesCost,
    skillsCost,
    defensesCost,
    totalSpent,
  });

  // ── 7. Serialise and download ─────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  // Cast needed: pdf-lib returns Uint8Array<ArrayBufferLike>, Blob requires ArrayBuffer
  const blob     = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url      = URL.createObjectURL(blob);
  const link     = document.createElement('a');
  link.href      = url;
  link.download  = `${sanitizeFileName(character.header.name)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
