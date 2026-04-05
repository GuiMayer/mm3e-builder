/* ================================================
   PDF Fill Service — Orchestrator (Phase 1)
   Pure coordinator: no field-setting logic here.
   All field logic lives in the sections/ modules.
   ================================================ */

import type { ICharacter } from '../../entities/types';
import { buildOffenseSummary } from '../../shared/lib/offenseSummary';
import type { IOffenseEntry } from '../../shared/lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
  calcToughnessBonus,
  calcInitiativeBonus,
} from '../../shared/lib/mathEngine';

import { loadPDFTemplate } from './pdfTemplateLoader';
import { sliceWithOverflow } from './helpers';
import { PDF_LIMITS } from './overflowCollector';

import { fillHeader }    from './sections/headerSection';
import { fillAbilities } from './sections/abilitiesSection';
import { fillDefenses }  from './sections/defensesSection';
import { fillOffense }   from './sections/offenseSection';

// Re-export for MenuBar to use without importing from overflowCollector directly
export { checkPDFOverflow } from './overflowCollector';
export type { PDFOverflowReport } from './overflowCollector';

// Sanitise file name: removes characters invalid in most file systems
function sanitizeFileName(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '_').trim() || 'character';
}

/**
 * Fill the official M&M 3e PDF character sheet and trigger a browser download.
 * Pre-flight overflow check should be done separately via checkPDFOverflow()
 * so the caller can show a confirmation modal first.
 *
 * @param character - Full character data from charStore
 */
export async function fillAndDownloadPDF(character: ICharacter): Promise<void> {
  // ── 1. Derive offense entries (pure function, no React) ───────
  const offenseEntries: IOffenseEntry[] = buildOffenseSummary(
    character,
    POWER_DEFS,
    SKILL_DEFS,
    ADVANTAGE_DEFS,
    MODIFIER_DEFS
  );

  // ── 2. Load fresh template ────────────────────────────────────
  const pdfDoc = await loadPDFTemplate();
  const form   = pdfDoc.getForm();

  // ── 3. Derive calculated PP values ────────────────────────────
  const abilitiesCost   = calculateAbilitiesCost(character.abilities, character.absentAbilities);
  const defensesCost    = calculateDefensesCost(character.defenses);
  const totalSkillRanks = character.skills.reduce((s, sk) => s + sk.ranks, 0);
  const skillsCost      = calculateSkillsCost(totalSkillRanks);
  const advantagesCost  = calculateAdvantagesCost(character.advantages);
  const powersCost      = character.powers.reduce(
    (s, p) => s + calcPowerTotalCost(p, POWER_DEFS, MODIFIER_DEFS),
    0
  );
  const totalSpent     = abilitiesCost + defensesCost + skillsCost + advantagesCost + powersCost;
  const ppEarned       = character.campaignMode
    ? (character.ppLog ?? []).reduce((s, e) => s + e.amount, 0)
    : 0;
  const totalAvailable = character.header.powerLevel * 15 + ppEarned;
  const remaining      = totalAvailable - totalSpent;

  // ── 4. Derive toughness and initiative ────────────────────────
  const staValue = character.absentAbilities.includes('sta') ? 0 : character.abilities.sta;
  const aglValue = character.absentAbilities.includes('agl') ? 0 : character.abilities.agl;

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

  // Phases 2 & 3 will add: fillSkills, fillAdvantages, fillComplications, fillNotes

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
