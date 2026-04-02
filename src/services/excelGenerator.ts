/**
 * Excel Generator — Exports character sheet as a styled .xlsx workbook.
 * Uses ExcelJS to create worksheets per section with themed formatting.
 * All labels come pre-translated from the calling component.
 */

import ExcelJS from 'exceljs';
import type {
  ICharacter,
  IAppliedModifier,
  IModifierDef,
  IPowerEffect,
  IAdvantageDef,
  ISkillDef,
  ICharacterPower,
} from '../entities/types';
import {
  calculatePowerCost,
  calculateArrayCost,
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
} from '../shared/lib/mathEngine';
import { downloadBlob } from './downloadHelper';

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
  // Headers
  heroName: string;
  player: string;
  identity: string;
  base: string;
  powerLevel: string;
  heroPoints: string;
  powerPoints: string;
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
  colTitle: string;
  colAlternateEffects: string;
  // Summary
  section: string;
  spent: string;
  remaining: string;
  totalSpent: string;
  // Misc
  absent: string;
  dynamic: string;
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

function locName(item: { name: string; i18n?: Record<string, { name: string }> }, lang: string): string {
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
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'M&M 3e Builder';
  wb.created = new Date();

  // ── 1. SUMMARY SHEET ──
  buildSummarySheet(wb, character, labels, gameData, language);

  // ── 2. ABILITIES SHEET ──
  buildAbilitiesSheet(wb, character, labels);

  // ── 3. DEFENSES SHEET ──
  buildDefensesSheet(wb, character, labels);

  // ── 4. SKILLS SHEET ──
  buildSkillsSheet(wb, character, labels, gameData, language);

  // ── 5. ADVANTAGES SHEET ──
  buildAdvantagesSheet(wb, character, labels, gameData, language);

  // ── 6. POWERS SHEET ──
  buildPowersSheet(wb, character, labels, gameData, language);

  // ── 7. COMPLICATIONS SHEET ──
  buildComplicationsSheet(wb, character, labels);

  // ── Download ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const fileName = `${character.header.name || 'character'}.xlsx`;
  await downloadBlob(blob, fileName);
}

// ══════════════════════════════════════════════════════
//  SHEET BUILDERS
// ══════════════════════════════════════════════════════

function buildSummarySheet(
  wb: ExcelJS.Workbook,
  char: ICharacter,
  labels: ExportLabels,
  gameData: GameDataRefs,
  _lang: string
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
  const info = [
    [labels.heroName, char.header.name],
    [labels.player, char.header.player],
    [labels.identity, char.header.identity],
    [labels.base, char.header.base],
    [labels.powerLevel, char.header.powerLevel],
    [labels.heroPoints, char.header.heroPoints],
  ];
  info.forEach(([label, val], i) => {
    const row = ws.getRow(i + 3);
    row.getCell(1).value = label;
    row.getCell(1).font = { bold: true, size: 10 };
    row.getCell(2).value = val;
  });

  // PP Summary
  const abCost = calculateAbilitiesCost(char.abilities, char.absentAbilities);
  const defCost = calculateDefensesCost(char.defenses);
  const totalSkillRanks = char.skills.reduce((s, sk) => s + sk.ranks, 0);
  const skCost = calculateSkillsCost(totalSkillRanks);
  const advCost = calculateAdvantagesCost(char.advantages);
  const pwrCost = char.powers.reduce((sum, p) => {
    const def = gameData.powerDefs.find((d) => d.id === p.effectId);
    const base = def?.baseCost ?? 1;
    const main = calculatePowerCost(base, p.ranks, p.modifiers, gameData.modifierDefs);
    const dynCount = p.alternateEffects.filter((a) => a.dynamic).length;
    return sum + calculateArrayCost(main, p.alternateEffects.length, dynCount);
  }, 0);
  const totalSpent = abCost + defCost + skCost + advCost + pwrCost;
  const totalAvailable = char.header.powerLevel * 15;

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

function buildAbilitiesSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels) {
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
    row.getCell(3).value = isAbsent ? labels.absent : char.abilities[key];
    row.getCell(4).value = isAbsent ? 0 : char.abilities[key] * 2;
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

function buildDefensesSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels) {
  const ws = wb.addWorksheet(labels.sheetDefenses);

  const header = ws.getRow(1);
  header.values = [labels.colName, labels.colAbility, labels.colRanks, labels.colTotal, labels.colCost];
  styleHeaderRow(header, 5);

  const defs = [
    { key: 'dodge', ability: 'agl', abilityVal: char.abilities.agl, bought: char.defenses.dodge },
    { key: 'parry', ability: 'fgt', abilityVal: char.abilities.fgt, bought: char.defenses.parry },
    { key: 'fortitude', ability: 'sta', abilityVal: char.abilities.sta, bought: char.defenses.fortitude },
    { key: 'will', ability: 'awe', abilityVal: char.abilities.awe, bought: char.defenses.will },
  ];

  defs.forEach((d, i) => {
    const row = ws.getRow(i + 2);
    row.getCell(1).value = labels.defenseNames[d.key] || d.key;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = `${d.ability.toUpperCase()} ${d.abilityVal}`;
    row.getCell(3).value = d.bought;
    row.getCell(4).value = d.abilityVal + d.bought;
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

  autoWidth(ws);
}

function buildSkillsSheet(
  wb: ExcelJS.Workbook,
  char: ICharacter,
  labels: ExportLabels,
  gameData: GameDataRefs,
  lang: string
) {
  const ws = wb.addWorksheet(labels.sheetSkills);

  const header = ws.getRow(1);
  header.values = [labels.colName, labels.colAbility, labels.colRanks, labels.colTotal];
  styleHeaderRow(header, 4);

  char.skills.forEach((sk, i) => {
    const def = gameData.skillDefs.find((d) => d.id === sk.skillId);
    const row = ws.getRow(i + 2);
    let name = def ? locName(def, lang) : sk.skillId;
    if (sk.subtype) name += `: ${sk.subtype}`;
    const abilityVal = def ? (char.abilities[def.baseAbility as keyof typeof char.abilities] ?? 0) : 0;

    row.getCell(1).value = name;
    row.getCell(2).value = def ? def.baseAbility.toUpperCase() : '';
    row.getCell(3).value = sk.ranks;
    row.getCell(4).value = abilityVal + sk.ranks;
    row.getCell(4).font = { bold: true };
    if (i % 2 === 1) {
      for (let c = 1; c <= 4; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  const totalRanks = char.skills.reduce((s, sk) => s + sk.ranks, 0);
  const totalRow = ws.getRow(char.skills.length + 2);
  totalRow.getCell(1).value = 'Total';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(3).value = `${totalRanks} ranks`;
  totalRow.getCell(4).value = `${calculateSkillsCost(totalRanks)} PP`;
  totalRow.getCell(4).font = { bold: true };

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
    row.getCell(1).value = def ? locName(def, lang) : adv.advantageId;
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
  lang: string
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

  char.powers.forEach((power) => {
    const effectDef = gameData.powerDefs.find((d) => d.id === power.effectId);
    const baseCost = effectDef?.baseCost ?? 1;
    const mainCost = calculatePowerCost(baseCost, power.ranks, power.modifiers, gameData.modifierDefs);
    const dynCount = power.alternateEffects.filter((a) => a.dynamic).length;
    const totalCost = calculateArrayCost(mainCost, power.alternateEffects.length, dynCount);

    const row = ws.getRow(rowIdx);
    row.getCell(1).value = power.name || '—';
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = effectDef ? locName(effectDef, lang) : power.effectId;
    row.getCell(3).value = power.ranks;
    row.getCell(4).value = formatModifiers(power.modifiers, gameData.modifierDefs, lang);
    row.getCell(4).alignment = { wrapText: true };
    row.getCell(5).value = formatAlternates(power, gameData, lang, labels);
    row.getCell(5).alignment = { wrapText: true };
    row.getCell(6).value = power.notes || '';
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
  const totalPP = char.powers.reduce((sum, p) => {
    const def = gameData.powerDefs.find((d) => d.id === p.effectId);
    const base = def?.baseCost ?? 1;
    const main = calculatePowerCost(base, p.ranks, p.modifiers, gameData.modifierDefs);
    const dynCount = p.alternateEffects.filter((a) => a.dynamic).length;
    return sum + calculateArrayCost(main, p.alternateEffects.length, dynCount);
  }, 0);
  totalRow.getCell(7).value = totalPP;
  totalRow.getCell(7).font = { bold: true, size: 11 };
  totalRow.getCell(7).numFmt = '0 "PP"';

  autoWidth(ws, 14, 40);
}

function buildComplicationsSheet(wb: ExcelJS.Workbook, char: ICharacter, labels: ExportLabels) {
  const ws = wb.addWorksheet(labels.sheetComplications);

  const header = ws.getRow(1);
  header.values = [labels.colTitle, labels.colDescription];
  styleHeaderRow(header, 2);

  char.complications.forEach((comp, i) => {
    const row = ws.getRow(i + 2);
    row.getCell(1).value = comp.title;
    row.getCell(1).font = { bold: true };
    row.getCell(2).value = comp.description;
    row.getCell(2).alignment = { wrapText: true };
    if (i % 2 === 1) {
      for (let c = 1; c <= 2; c++) {
        row.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.altRowFill } };
      }
    }
  });

  autoWidth(ws, 20, 60);
}

// ── Helper: format modifier list as text ──

function formatModifiers(mods: IAppliedModifier[], defs: IModifierDef[], lang: string): string {
  if (mods.length === 0) return '—';
  return mods
    .map((m) => {
      const def = defs.find((d) => d.id === m.modifierId);
      if (!def) return m.modifierId;
      const name = locName(def, lang);
      const sign = def.costValue >= 0 ? '+' : '';
      const costStr = def.costType === 'per_rank'
        ? `${sign}${def.costValue}/rank`
        : `${sign}${def.costValue} flat`;
      return m.ranks > 1 ? `${name} ×${m.ranks} (${costStr})` : `${name} (${costStr})`;
    })
    .join(', ');
}

// ── Helper: format alternate effects as text ──

function formatAlternates(
  power: ICharacterPower,
  gameData: GameDataRefs,
  lang: string,
  labels: ExportLabels
): string {
  if (power.alternateEffects.length === 0) return '—';
  return power.alternateEffects
    .map((alt) => {
      const eDef = gameData.powerDefs.find((d) => d.id === alt.effectId);
      const name = alt.name || (eDef ? locName(eDef, lang) : alt.effectId);
      const dyn = alt.dynamic ? ` [${labels.dynamic}]` : '';
      return `${name} (R${alt.ranks})${dyn}`;
    })
    .join('\n');
}
