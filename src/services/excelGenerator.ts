import { circumstanceBonus, effectiveTraitCharacter, resolveTraitState } from '../shared/lib/traitValues';
import { formatComponentDetails } from './pdf/components/powerDetails';
/**
 * Excel Generator — Exports character sheet as a styled .xlsx workbook.
 * Uses ExcelJS to create worksheets per section with themed formatting.
 * All labels come pre-translated from the calling component.
 */

import ExcelJS from 'exceljs';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { getPricingStrength } from '../shared/lib/pricingStrength';
import { traitTargetName } from '../shared/lib/traitLabels';
import type {
  ICharacter,
  IModifierDef,
  IPowerEffect,
  IAdvantageDef,
  ISkillDef,
  ICharacterPower,
  IResource,
} from '../entities/types';
import {
  calcAlternateEffectCost,
  calcEquipmentEPCost,
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  getPerRankModifierCost,
} from '../shared/lib/mathEngine';
import {
  calculateCharacterPointSummary,
  type CharacterPointSummary,
} from '../shared/lib/pointSummary';
import { buildTargetedEffectProfiles, type IOffenseEntry } from '../shared/lib/offenseSummary';
import { downloadBlob, sanitizeFileName } from './downloadHelper';
import { getLinkedResourceCharges } from '../shared/lib/resourceCalculations';
import { resolveModifierDefinition } from '../shared/lib/rulesCatalog';
import { getEffectiveAbilityRank } from '../shared/lib/abilityRanks';
import { describeResource } from './resourceDescription';
import { createPDFLabels, localizePDFPowers, localizePDFModifiers } from './pdf/pdfMessages';
import { campaignInitialPP } from '../shared/lib/campaign';

// ── Types for pre-localized labels ──

export interface ExportLabels {
  // Sheet names
  sheetSummary: string;
  sheetAbilities: string;
  sheetDefenses: string;
  sheetSkills: string;
  sheetAdvantages: string;
  sheetPowers: string;
  sheetComplications: string;
  sheetEquipment: string;
  sheetOffense: string;
  sheetNotes: string;
  campaign?: { sheet: string; initialPP: string; initialPL: string; active: string; date: string; session: string; type: string; award: string; adjustment: string; amount: string; running: string; available: string };
  heroName: string;
  player: string;
  identity: string;
  identityTypeLabel: string;
  base: string;
  powerLevel: string;
  heroPoints: string;
  powerPoints: string;
  // F-07 physical description labels
  gender: string;
  age: string;
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  groupAffiliation: string;
  series: string;
  gameMaster: string;
  // Ability names (already translated)
  abilityNames: Record<string, string>;
  // Defense names
  defenseNames: Record<string, string>;
  // Column headers
  colName: string;
  colRanks: string;
  colAbility: string;
  colTotal: string;
  colCost: string;
  colDescription: string;
  colEffect: string;
  colModifiers: string;
  colNotes: string;
  colBonus: string;
  colRange: string;
  colTitle: string;
  colType: string;
  colAlternateEffects: string;
  section: string;
  spent: string;
  remaining: string;
  totalSpent: string;
  absent: string;
  dynamic: string;
  removable: string;
  easilyRemovable: string;
  descriptors: string;
  yes: string;
  no: string;
}

export interface GameDataRefs {
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  advantageDefs: IAdvantageDef[];
  skillDefs: ISkillDef[];
}

// ── Theme Colors ──

const COLORS = {
  headerFill: '6C63FF',
  headerFont: 'FFFFFF',
  accentFill: 'E8E5FF',
  borderColor: 'D0CCF0',
  costPositive: '22C55E',
  costNegative: 'EF4444',
  altRowFill: 'F5F3FF',
};

// ── Helper: style a header row ──

function styleHeaderRow(row: ExcelJS.Row, colCount: number) {
  for (let i = 1; i <= colCount; i++) {
    const cell = row.getCell(i);
    cell.font = { bold: true, color: { argb: COLORS.headerFont }, size: 11 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.headerFill },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLORS.borderColor } },
    };
  }
  row.height = 24;
}

function autoWidth(ws: ExcelJS.Worksheet, minWidth = 12, maxWidth = 50) {
  ws.columns.forEach((col) => {
    let max = minWidth;
    col.eachCell?.({ includeEmpty: false }, (cell) => {
      const len = cell.value ? String(cell.value).length + 2 : 0;
      if (len > max) max = len;
    });
    col.width = Math.min(max, maxWidth);
  });
}

// ── Resolve localized name from game data with i18n field ──

function locName(item: { name: string; i18n?: Record<string, { name?: string }> }, lang: string): string {
  return item.i18n?.[lang]?.name ?? item.name;
}

function locDesc(item: { description?: string; i18n?: Record<string, { description?: string }> }, lang: string): string {
  return item.i18n?.[lang]?.description ?? item.description ?? '';
}

// ══════════════════════════════════════════════════════
//  MAIN EXPORT FUNCTION
// ══════════════════════════════════════════════════════

export async function generateExcel(
  character: ICharacter,
  labels: ExportLabels,
  gameData: GameDataRefs,
  language: string
  , resources: IResource[] = []
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'M&M 3e Builder';
  wb.created = new Date();
  const pointSummary = calculateCharacterPointSummary(
    character,
    resources,
    gameData.powerDefs,
    gameData.modifierDefs
  );

  const effective = effectiveTraitCharacter(character, resources);

  // ── 1. SUMMARY SHEET ──
  buildSummarySheet(wb, character, labels, pointSummary);

  // ── 2. ABILITIES SHEET ──
  buildAbilitiesSheet(wb, character, labels, effective);

  // ── 3. DEFENSES SHEET ──
  buildDefensesSheet(wb, character, labels, gameData, resources);

  // ── 4. SKILLS SHEET ──
  buildSkillsSheet(wb, character, labels, gameData, language, effective);

  // ── 5. ADVANTAGES SHEET ──
  buildAdvantagesSheet(wb, character, labels, gameData, language);

  // ── 6. POWERS SHEET ──
  buildPowersSheet(wb, character, labels, gameData, language, pointSummary, resources);

  // ── 7. COMPLICATIONS SHEET ──
  buildComplicationsSheet(wb, character, labels);

  // ??? 8. EQUIPMENT SHEET ???
  if ((character.equipment && character.equipment.length > 0) || character.equipmentNotes?.trim() || (character.resourceLinks?.length ?? 0) > 0) {
    buildEquipmentSheet(wb, character, labels, resources, gameData, language);
  }

  // ?? 9. TARGETED EFFECTS SHEET ??
  const targetedProfiles = buildTargetedEffectProfiles(
    character,
    gameData.powerDefs,
    gameData.skillDefs,
    gameData.advantageDefs,
    gameData.modifierDefs,
    undefined,
    resources
  );
  buildOffenseSheet(wb, targetedProfiles, labels);

  // ?? 10. NOTES SHEET ??
  if (character.notes?.trim()) {
    buildNotesSheet(wb, character, labels);
  }

  // ── 9. PP LOG SHEET (Campaign Mode only) ──
  if (character.campaignMode || character.campaign || character.ppLog?.length) {
    buildCampaignSheet(wb, character, labels, pointSummary);
  }

  const traits = resolveTraitState(character, resources);
  if (traits.contributions.length || character.traitModifiers?.length) {
    const sheet = wb.addWorksheet(createPDFLabels(language)('Trait modifiers'));
    sheet.addRow([labels.colName, labels.colRanks, labels.colDescription]);
    for (const item of traits.contributions) sheet.addRow([traitTargetName(item.target, createPDFLabels(language)), item.ranks, item.name]);
    for (const item of character.traitModifiers ?? []) sheet.addRow([traitTargetName(item.target, createPDFLabels(language)), item.value, `${item.source} · ${createPDFLabels(language)(item.scope === 'check' ? 'Check only' : 'Active defense')} · ${item.active ? labels.yes : labels.no}`]);
    autoWidth(sheet);
  }

  // ── Download ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileName = `${sanitizeFileName(character.header.name)}.xlsx`;
  await downloadBlob(blob, fileName);
}

// ══════════════════════════════════════════════════════
//  SHEET BUILDERS
// ══════════════════════════════════════════════════════

function buildSummarySheet(
  wb: ExcelJS.Workbook,
  char: ICharacter,
  labels: ExportLabels,
  pointSummary: CharacterPointSummary
) {
  const ws = wb.addWorksheet(labels.sheetSummary, { properties: { tabColor: { argb: '6C63FF' } } });

  // Title row
  ws.mergeCells('A1:C1');
  const titleCell = ws.getCell('A1');
  titleCell.value = `${char.header.name || 'Character'} — M&M 3e`;
  titleCell.font = { bold: true, size: 16, color: { argb: COLORS.headerFill } };
  titleCell.alignment = { horizontal: 'center' };
  ws.getRow(1).height = 30;

  // Character info
  const identityTypeStr = char.header.identityType
    ? ` (${char.header.identityType === 'secret' ? labels.identityTypeLabel + ': Secret' : labels.identityTypeLabel + ': Public'})`
    : '';
  const info: [string, string | number | undefined][] = [
    [labels.heroName,        char.header.name],
    [labels.player,          char.header.player],
    [labels.identity,        char.header.identity + identityTypeStr],
    [labels.base,            char.header.base],
    [labels.powerLevel,      char.header.powerLevel],
    [labels.heroPoints,      char.header.heroPoints],
    // F-07: only emit rows when the field has a value
    ...(char.header.gender           ? [[labels.gender,           char.header.gender          ]] as [string, string][] : []),
    ...(char.header.age              ? [[labels.age,              char.header.age             ]] as [string, string][] : []),
    ...(char.header.height           ? [[labels.height,           char.header.height          ]] as [string, string][] : []),
    ...(char.header.weight           ? [[labels.weight,           char.header.weight          ]] as [string, string][] : []),
    ...(char.header.eyes             ? [[labels.eyes,             char.header.eyes            ]] as [string, string][] : []),
    ...(char.header.hair             ? [[labels.hair,             char.header.hair            ]] as [string, string][] : []),
    ...(char.header.groupAffiliation ? [[labels.groupAffiliation, char.header.groupAffiliation]] as [string, string][] : []),
    ...(char.header.series           ? [[labels.series,           char.header.series          ]] as [string, string][] : []),
    ...(char.header.gameMaster       ? [[labels.gameMaster,       char.header.gameMaster      ]] as [string, string][] : []),
  ];
  info.forEach(([label, val], i) => {
    const row = ws.getRow(i + 3);
    row.getCell(1).value = label as string;
    row.getCell(1).font = { bold: true, size: 10 };
    row.getCell(2).value = val as string | number;
  });

  // PP Summary
  const {
    abilitiesCost: abCost,
    defensesCost: defCost,
    skillsCost: skCost,
    advantagesCost: advCost,
    powersCost: pwrCost,
    totalSpent,
    totalAvailable,
  } = pointSummary;

  const summaryStart = 11;
  const headerRow = ws.getRow(summaryStart);
  headerRow.values = [labels.section, labels.colCost];
  styleHeaderRow(headerRow, 2);

  const sections = [
    [labels.sheetAbilities, abCost],
    [labels.sheetDefenses, defCost],
    [labels.sheetSkills, skCost],
    [labels.sheetAdvantages, advCost],
    [labels.sheetPowers, pwrCost],
  ];

  sections.forEach(([name, cost], i) => {
    const row = ws.getRow(summaryStart + 1 + i);
    row.getCell(1).value = name;
    row.getCell(2).value = cost;
    row.getCell(2).numFmt = '0 "PP"';
    if (i % 2 === 1) {
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
    }
  });

  // Totals
  const totalRow = ws.getRow(summaryStart + 1 + sections.length);
  totalRow.getCell(1).value = labels.totalSpent;
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(2).value = totalSpent;
  totalRow.getCell(2).font = { bold: true };
  totalRow.getCell(2).numFmt = '0 "PP"';

  const remRow = ws.getRow(summaryStart + 2 + sections.length);
  remRow.getCell(1).value = `${labels.remaining} / ${totalAvailable} PP`;
  remRow.getCell(1).font = { bold: true };
  remRow.getCell(2).value = totalAvailable - totalSpent;
  remRow.getCell(2).font = {
    bold: true,
    color: { argb: totalAvailable - totalSpent >= 0 ? COLORS.costPositive : COLORS.costNegative },
  };
  remRow.getCell(2).numFmt = '0 "PP"';

  autoWidth(ws);
}

function buildAbilitiesSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels, effective: ICharacter) {
  const ws = wb.addWorksheet(labels.sheetAbilities);

  const header = ws.getRow(1);
  header.values = ['', labels.colName, labels.colRanks, labels.colCost];
  styleHeaderRow(header, 4);

  const KEYS = ['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre'] as const;
  KEYS.forEach((key, i) => {
    const row = ws.getRow(i + 2);
    const isAbsent = char.absentAbilities.includes(key);
    row.getCell(1).value = key.toUpperCase();
    row.getCell(1).font = { bold: true, size: 10 };
    row.getCell(2).value = labels.abilityNames[key] || key;
    row.getCell(3).value = isAbsent ? labels.absent : effective.abilities[key];
    row.getCell(4).value = isAbsent ? -10 : char.abilities[key] * 2;
    row.getCell(4).numFmt = '0 "PP"';
    if (i % 2 === 1) {
      for (let c = 1; c <= 4; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  // Total row
  const totalRow = ws.getRow(KEYS.length + 2);
  totalRow.getCell(2).value = 'Total';
  totalRow.getCell(2).font = { bold: true };
  totalRow.getCell(4).value = calculateAbilitiesCost(char.abilities, char.absentAbilities);
  totalRow.getCell(4).font = { bold: true };
  totalRow.getCell(4).numFmt = '0 "PP"';

  autoWidth(ws);
}

function buildDefensesSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels, gameData: GameDataRefs, resources: IResource[]) {
  const effective = effectiveTraitCharacter(char, resources);
  const values = deriveCharacterDefenses(char, gameData.powerDefs, resources);
  const ws = wb.addWorksheet(labels.sheetDefenses);

  const header = ws.getRow(1);
  header.values = [labels.colName, labels.colAbility, labels.colRanks, labels.colTotal, labels.colCost];
  styleHeaderRow(header, 5);

  const defs = [
    { key: 'dodge', ability: 'agl', abilityVal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'agl'), bought: char.defenses.dodge },
    { key: 'parry', ability: 'fgt', abilityVal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'fgt'), bought: char.defenses.parry },
    { key: 'fortitude', ability: 'sta', abilityVal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'sta'), bought: char.defenses.fortitude },
    { key: 'will', ability: 'awe', abilityVal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'awe'), bought: char.defenses.will },
  ];

  defs.forEach((d, i) => {
    const row = ws.getRow(i + 2);
    row.getCell(1).value = labels.defenseNames[d.key] || d.key;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = `${d.ability.toUpperCase()} ${d.abilityVal}`;
    row.getCell(3).value = d.bought;
    row.getCell(4).value = values[`${d.key}Total` as 'dodgeTotal' | 'parryTotal' | 'fortitudeTotal' | 'willTotal'];
    row.getCell(4).font = { bold: true };
    row.getCell(5).value = d.bought;
    row.getCell(5).numFmt = '0 "PP"';
    if (i % 2 === 1) {
      for (let c = 1; c <= 5; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  const totalRow = ws.getRow(6);
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(5).value = calculateDefensesCost(char.defenses);
  totalRow.getCell(5).font = { bold: true };
  totalRow.getCell(5).numFmt = '0 "PP"';

  // Add derived stats section
  const derivedHeaderRow = ws.getRow(8);
  derivedHeaderRow.getCell(1).value = 'Derived Stats';
  derivedHeaderRow.getCell(1).font = { bold: true, size: 12 };
  
  const derived = deriveCharacterDefenses(char, gameData.powerDefs, resources);
  const toughnessRow = ws.getRow(9);
  const staAbsent = char.absentAbilities.includes('sta');
  const toughness = derived.toughnessTotal;
  toughnessRow.getCell(1).value = 'Toughness';
  toughnessRow.getCell(1).font = { bold: true };
  toughnessRow.getCell(2).value = staAbsent ? '–' : `STA ${char.abilities.sta}`;
  toughnessRow.getCell(4).value = toughness;
  toughnessRow.getCell(4).font = { bold: true };
  
  // Initiative = AGL
  const initiativeRow = ws.getRow(10);
  const aglAbsent = char.absentAbilities.includes('agl');
  const initiative = derived.initiativeTotal;
  initiativeRow.getCell(1).value = 'Initiative';
  initiativeRow.getCell(1).font = { bold: true };
  initiativeRow.getCell(2).value = aglAbsent ? '–' : `AGL ${char.abilities.agl}`;
  initiativeRow.getCell(4).value = initiative > 0 ? `+${initiative}` : String(initiative);
  initiativeRow.getCell(4).font = { bold: true };

  autoWidth(ws);
}

function buildSkillsSheet(
  wb: ExcelJS.Workbook,
  char: ICharacter,
  labels: ExportLabels,
  gameData: GameDataRefs,
  lang: string,
  effective: ICharacter,
) {
  const ws = wb.addWorksheet(labels.sheetSkills);

  const skillHeader = ws.getRow(1);
  skillHeader.values = [labels.colName, labels.colAbility, labels.colRanks, 'Other', labels.colTotal];
  styleHeaderRow(skillHeader, 5);

  effective.skills.forEach((sk, i) => {
    const def = gameData.skillDefs.find((d) => d.id === sk.skillId);
    const row = ws.getRow(i + 2);
    let name = def ? locName(def, lang) : sk.skillId;
    if (sk.subtype) name += `: ${sk.subtype}`;
    const abilityVal = def
      ? getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, def.baseAbility)
      : 0;
    const other = (sk.otherBonus ?? 0) + circumstanceBonus(char, { kind: 'skill', skillId: sk.skillId, subtype: sk.subtype });

    row.getCell(1).value = name;
    row.getCell(2).value = def ? def.baseAbility.toUpperCase() : '';
    row.getCell(3).value = sk.ranks;
    row.getCell(4).value = other !== 0 ? other : null;
    row.getCell(5).value = abilityVal + sk.ranks + other;
    row.getCell(5).font = { bold: true };
    if (i % 2 === 1) {
      for (let c = 1; c <= 5; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  const totalRanks = char.skills.reduce((s, sk) => s + sk.ranks, 0);
  const totalRow = ws.getRow(effective.skills.length + 2);
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(3).value = `${totalRanks} ranks`;
  totalRow.getCell(5).value = `${calculateSkillsCost(totalRanks)} PP`;
  totalRow.getCell(5).font = { bold: true };

  autoWidth(ws);
}

function buildAdvantagesSheet(
  wb: ExcelJS.Workbook,
  char: ICharacter,
  labels: ExportLabels,
  gameData: GameDataRefs,
  lang: string
) {
  const ws = wb.addWorksheet(labels.sheetAdvantages);

  const header = ws.getRow(1);
  header.values = [labels.colName, labels.colRanks, labels.colDescription];
  styleHeaderRow(header, 3);

  char.advantages.forEach((adv, i) => {
    const def = gameData.advantageDefs.find((d) => d.id === adv.advantageId);
    const row = ws.getRow(i + 2);
    const baseName = def ? locName(def, lang) : adv.advantageId;
    const displayName = adv.subtype ? `${baseName} (${adv.subtype})` : baseName;
    row.getCell(1).value = displayName;
    row.getCell(2).value = adv.ranks;
    row.getCell(3).value = def ? locDesc(def, lang) : '';
    row.getCell(3).alignment = { wrapText: true };
    if (i % 2 === 1) {
      for (let c = 1; c <= 3; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  const totalRow = ws.getRow(char.advantages.length + 2);
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(2).value = `${calculateAdvantagesCost(char.advantages)} PP`;
  totalRow.getCell(2).font = { bold: true };

  autoWidth(ws);
}

function buildPowersSheet(
  wb: ExcelJS.Workbook,
  char: ICharacter,
  labels: ExportLabels,
  gameData: GameDataRefs,
  lang: string,
  pointSummary: CharacterPointSummary,
  resources: IResource[] = []
) {
  const ws = wb.addWorksheet(labels.sheetPowers, { properties: { tabColor: { argb: 'FF2D6B' } } });

  const header = ws.getRow(1);
  header.values = [
    labels.colName,
    labels.colEffect,
    labels.colRanks,
    labels.colModifiers,
    labels.colAlternateEffects,
    labels.colNotes,
    labels.colCost,
  ];
  styleHeaderRow(header, 7);

  let rowIdx = 2;

  char.powers.forEach((power, powerIndex) => {
    const totalCost = pointSummary.powerPricing[powerIndex]?.total ?? 0;

    // Build effect display from all components
    const effectNames = power.components
      .map((c) => {
        const def = gameData.powerDefs.find((d) => d.id === c.effectId);
        if (!def) return null;
        
        let name = `${locName(def, lang)} ${c.ranks}`;
        
        // Handle variable cost options (e.g., flat costs per rank)
        if (c.variableCostOption && (def as unknown as Record<string, unknown>).variableCostOptions) {
          const optionsArray = (def as unknown as Record<string, unknown>).variableCostOptions as Array<Record<string, unknown>>;
          const option = optionsArray.find(o => o.id === c.variableCostOption);
          if (option && option.name) {
            const nameObj = option.name as Record<string, string>;
            name += ` [${nameObj[lang as keyof typeof nameObj] || nameObj.en}]`;
          }
        }
        
        return name;
      })
      .filter(Boolean)
      .join(' + ');

    // Handle field values if present (from effect options)
    const fieldValuesText = power.components
      .filter(component => component.fieldValues && Object.keys(component.fieldValues).length)
      .map(component => formatComponentDetails(component, localizePDFPowers(gameData.powerDefs, lang), localizePDFModifiers(gameData.modifierDefs, lang), createPDFLabels(lang)))
      .join('\n');

    // Format power name with removable tags
    let powerName = power.name || '—';
    if (power.removable === 'removable') powerName += ` (${labels.removable})`;
    else if (power.removable === 'easily_removable') powerName += ` (${labels.easilyRemovable})`;

    // Format notes with descriptors and field values
    let notes = power.notes || '';
    if (power.descriptors && power.descriptors.length > 0) {
      const descriptorsText = `${labels.descriptors}: [${power.descriptors.join(', ')}]`;
      notes = notes ? `${descriptorsText}\n\n${notes}` : descriptorsText;
    }
    if (fieldValuesText) {
      notes = notes ? `${fieldValuesText}\n\n${notes}` : fieldValuesText;
    }

    const row = ws.getRow(rowIdx);
    row.getCell(1).value = powerName;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = effectNames || '—';
    row.getCell(3).value = power.components.length > 1 ? `${power.components.length} effects` : (power.components[0]?.ranks ?? 0);
    row.getCell(4).value = formatPowerModifiers(power, gameData, lang);
    row.getCell(4).alignment = { wrapText: true };
    row.getCell(5).value = formatAlternates(power, gameData, lang, labels, getPricingStrength(char, resources));
    row.getCell(5).alignment = { wrapText: true };
    row.getCell(6).value = notes;
    row.getCell(6).alignment = { wrapText: true };
    row.getCell(7).value = totalCost;
    row.getCell(7).numFmt = '0 "PP"';
    row.getCell(7).font = { bold: true };

    rowIdx++;
  });

  // Total
  const totalRow = ws.getRow(rowIdx);
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { bold: true, size: 11 };
  totalRow.getCell(7).value = pointSummary.powersCost;
  totalRow.getCell(7).font = { bold: true, size: 11 };
  totalRow.getCell(7).numFmt = '0 "PP"';

  autoWidth(ws, 14, 40);
}

function buildComplicationsSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels) {
  const ws = wb.addWorksheet(labels.sheetComplications);

  const header = ws.getRow(1);
  header.values = [labels.colType, labels.colTitle, labels.colDescription];
  styleHeaderRow(header, 3);

  char.complications.forEach((comp, i) => {
    const row = ws.getRow(i + 2);
    row.getCell(1).value = comp.type ?? '';
    row.getCell(2).value = comp.title;
    row.getCell(2).font = { bold: true };
    row.getCell(3).value = comp.description;
    row.getCell(3).alignment = { wrapText: true };
    if (i % 2 === 1) {
      for (let c = 1; c <= 3; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  autoWidth(ws, 20, 60);
}

function buildOffenseSheet(wb: ExcelJS.Workbook, profiles: IOffenseEntry[], labels: ExportLabels) {
  const ws = wb.addWorksheet(labels.sheetOffense);

  // Title row
  ws.mergeCells('A1:E1');
  const titleCell = ws.getCell('A1');
  titleCell.value = labels.sheetOffense;
  titleCell.font = { bold: true, size: 13, color: { argb: COLORS.headerFill } };
  ws.getRow(1).height = 22;

  // Header row
  const headerRow = ws.getRow(2);
  headerRow.values = [labels.colName, labels.colBonus, labels.colRange, labels.colEffect, labels.colNotes];
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLORS.headerFill },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLORS.borderColor } },
    };
  });
  headerRow.height = 20;

  // Data rows
  let currentRow = 3;
    profiles.forEach((profile) => {
      const row = ws.getRow(currentRow);
      const source = profile.sourceName || profile.name;
      const relation = profile.relationship === 'alternate' ? ' ↳' : profile.relationship === 'dynamic-alternate' ? ' ↳ Dynamic' : '';
      const notes = [
        profile.tags.join(', '),
        profile.resistance,
        profile.notes,
      ].filter(Boolean).join(' · ');
      row.values = [
        `${source}${relation}`,
        profile.requiresAttackCheck ? profile.bonus : '—',
        profile.range,
        profile.effect,
        notes,
      ];
    
    row.getCell(1).font = { bold: true };
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(3).alignment = { horizontal: 'center' };
    
    // Notes wrap
    row.getCell(5).alignment = { wrapText: true };
    row.getCell(5).font = { size: 10 };

    const borderConfig: Partial<ExcelJS.Borders> = {
      bottom: { style: 'thin', color: { argb: COLORS.borderColor } }
    };
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      if (colNumber <= 5) {
        cell.border = borderConfig;
      }
    });

    currentRow++;
  });

  autoWidth(ws, 15, 60);
  ws.getColumn(1).width = 30; // Attack Name
  ws.getColumn(2).width = 15; // Bonus
  ws.getColumn(3).width = 15; // Range
  ws.getColumn(4).width = 30; // Effect
  ws.getColumn(5).width = 40; // Notes
}

function buildNotesSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels) {
  const ws = wb.addWorksheet(labels.sheetNotes);

  // Title row
  ws.mergeCells('A1:A1');
  const titleCell = ws.getCell('A1');
  titleCell.value = labels.sheetNotes;
  titleCell.font = { bold: true, size: 13, color: { argb: COLORS.headerFill } };
  ws.getRow(1).height = 22;

  // Notes content in a large merged cell
  ws.mergeCells('A2:H20');
  const notesCell = ws.getCell('A2');
  notesCell.value = char.notes;
  notesCell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
  notesCell.font = { size: 11 };
}

export function buildEquipmentSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels, resources: IResource[], gameData: GameDataRefs, language: string) {
  const ws = wb.addWorksheet(labels.sheetEquipment);

  // Title row
  ws.mergeCells('A1:C1');
  const titleCell = ws.getCell('A1');
  titleCell.value = labels.sheetEquipment;
  titleCell.font = { bold: true, size: 13, color: { argb: COLORS.headerFill } };
  ws.getRow(1).height = 22;

  let currentRow = 2;

  if (char.equipment && Array.isArray(char.equipment) && char.equipment.length > 0) {
    const headerRow = ws.getRow(currentRow);
    headerRow.values = [labels.colName, labels.colCost, labels.colNotes];
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: COLORS.headerFill },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: COLORS.borderColor } },
      };
    });
    headerRow.height = 20;
    currentRow++;

    char.equipment.forEach((eq) => {
      const row = ws.getRow(currentRow);
      row.values = [eq.name, calcEquipmentEPCost(eq, gameData.powerDefs, gameData.modifierDefs, getPricingStrength(char, resources)), eq.notes];
      row.getCell(2).numFmt = '0 "EP"';
      row.getCell(1).font = { bold: true };
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).alignment = { wrapText: true };
      row.getCell(3).font = { size: 10 };
      
      const borderConfig: Partial<ExcelJS.Borders> = {
        bottom: { style: 'thin', color: { argb: COLORS.borderColor } }
      };
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= 3) {
          cell.border = borderConfig;
        }
      });
      currentRow++;
    });
    
    currentRow++; // Empty row
  }

  const linkedResources = getLinkedResourceCharges(char, resources, gameData.powerDefs, gameData.modifierDefs);
  if (linkedResources.length > 0) {
    const l = createPDFLabels(language);
    const powers = localizePDFPowers(gameData.powerDefs, language), modifiers = localizePDFModifiers(gameData.modifierDefs, language);
    const headerRow = ws.getRow(currentRow++);
    headerRow.values = [labels.colName, labels.colCost, labels.colNotes];
    headerRow.eachCell((cell) => { cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerFill } }; });
    for (const { resource, link, charged, unit, alternate, total } of linkedResources) {
      const detail = describeResource(resource, powers, modifiers, l).join(' · ');
      const ownership = link.isFree ? l('Free') : alternate ? l('Alternate') : unit === 'EP' && link.contributionEP !== undefined ? l('Shared') : '';
      const row = ws.getRow(currentRow++);
      row.values = [resource.name || l('Unnamed Resource'), `${charged} ${unit}${ownership ? ` (${ownership})` : ''}`, [`${l('Total')}: ${total} ${unit}`, detail, resource.notes].filter(Boolean).join('\n')];
      row.getCell(1).font = { bold: true }; row.getCell(2).alignment = { horizontal: 'center' }; row.getCell(3).alignment = { wrapText: true };
    }
    currentRow++;
  }

  if (char.equipmentNotes?.trim()) {
    // Title for legacy notes
    ws.mergeCells(`A${currentRow}:C${currentRow}`);
    const legacyTitleCell = ws.getCell(`A${currentRow}`);
    legacyTitleCell.value = labels.colNotes;
    legacyTitleCell.font = { bold: true, size: 12, color: { argb: COLORS.headerFill } };
    ws.getRow(currentRow).height = 20;
    currentRow++;

    // Notes in a merged tall cell
    ws.mergeCells(`A${currentRow}:C${currentRow}`);
    const notesCell = ws.getCell(`A${currentRow}`);
    notesCell.value = char.equipmentNotes;
    notesCell.alignment = { wrapText: true, vertical: 'top' };
    notesCell.font = { size: 10 };
    ws.getRow(currentRow).height = 120;
  }

  autoWidth(ws, 15, 60);
  ws.getColumn(1).width = 30; // Name
  ws.getColumn(2).width = 15; // Cost
  ws.getColumn(3).width = 60; // Description/Notes
}

export function buildCampaignSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels, summary: CharacterPointSummary) {
  const l = labels.campaign ?? { sheet: 'Campaign', initialPP: 'Starting PP', initialPL: 'Starting PL', active: 'Campaign active', date: 'Date', session: 'Session', type: 'Type', award: 'Award', adjustment: 'Adjustment', amount: 'Amount', running: 'Campaign budget after entry', available: 'Available PP' };
  const ws = wb.addWorksheet(l.sheet);
  ws.addRow([l.active, char.campaignMode ? labels.yes : labels.no]);
  ws.addRow([l.initialPL, char.campaign?.initialPowerLevel ?? char.header.powerLevel]);
  ws.addRow([labels.powerLevel, char.header.powerLevel]);
  ws.addRow([l.initialPP, campaignInitialPP(char)]);
  ws.addRow([l.available, summary.totalAvailable]);
  ws.addRow([labels.totalSpent, summary.totalSpent]);
  ws.addRow([labels.remaining, summary.remaining]);
  ws.addRow([]);
  const header = ws.addRow([l.date, l.session, l.type, labels.colNotes, l.amount, l.running]);
  styleHeaderRow(header, 6);
  let running = campaignInitialPP(char);
  for (const entry of char.ppLog ?? []) {
    running += entry.amount;
    const row = ws.addRow([entry.date, entry.session ?? '', entry.kind ? l[entry.kind] : '', entry.note, entry.amount, running]);
    // General formatting preserves historical fractions without rounding display.
    row.getCell(5).numFmt = 'General';
    row.getCell(5).font = { bold: true, color: { argb: entry.amount < 0 ? COLORS.costNegative : COLORS.costPositive } };
    row.getCell(4).alignment = { wrapText: true, vertical: 'top' };
  }
  ws.views = [{ state: 'frozen', ySplit: header.number }];
  autoWidth(ws);
  ws.getColumn(4).width = 50;
}

// ── Helper: format modifier list as text ──

function formatPowerModifiers(power: ICharacterPower, gameData: GameDataRefs, lang: string): string {
  const modifiers = power.components.flatMap((component) => {
    const effectDef = gameData.powerDefs.find(
      (definition) => definition.id === component.effectId
    );
    return component.modifiers.map((applied) => ({ applied, effectDef }));
  });
  if (modifiers.length === 0) return '—';
  return modifiers
    .map(({ applied, effectDef }) => {
      const def = effectDef
        ? resolveModifierDefinition(applied, effectDef, gameData.modifierDefs).definition
        : undefined;
      if (!def) return applied.modifierId;
      const name = locName(def, lang);
      const costValue = def.costType === 'per_rank'
        ? getPerRankModifierCost(applied, def, effectDef?.action)
        : def.costValue;
      const sign = costValue >= 0 ? '+' : '';
      const costStr = def.costType === 'per_rank'
        ? `${sign}${costValue}/rank`
        : `${sign}${costValue} flat`;
      return applied.ranks > 1
        ? `${name} ×${applied.ranks} (${costStr})`
        : `${name} (${costStr})`;
    })
    .join(', ');
}

// ── Helper: format alternate effects as text ──

function formatAlternates(
  power: ICharacterPower,
  gameData: GameDataRefs,
  lang: string,
  labels: ExportLabels,
  strength: number
): string {
  if (power.alternateEffects.length === 0) return '—';
  return power.alternateEffects
      .map((alt) => {
        // v2 format: components[]
        const effectNames = alt.components
          .map((comp) => {
            const eDef = gameData.powerDefs.find((d) => d.id === comp.effectId);
            return eDef ? formatComponentDetails(comp, localizePDFPowers(gameData.powerDefs, lang), localizePDFModifiers(gameData.modifierDefs, lang), createPDFLabels(lang)) : comp.effectId;
          })
          .filter(Boolean)
          .join(' + ');
        const name = alt.name || effectNames || '—';
        const cost = calcAlternateEffectCost(alt, gameData.powerDefs, gameData.modifierDefs, strength);
        const dyn = alt.dynamic ? ` [${labels.dynamic}]` : '';
        const notesStr = alt.notes ? `\n  ${alt.notes}` : '';
        return `${name}: ${effectNames} [${cost}PP]${dyn}${notesStr}`;
      })
    .join('\n');
}
