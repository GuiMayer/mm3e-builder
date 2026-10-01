import { describe, expect, it, vi } from 'vitest';
import ExcelJS from 'exceljs';
import { generateExcel, type ExportLabels } from '../services/excelGenerator';
import { downloadBlob } from '../services/downloadHelper';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { ADVANTAGE_DEFS, MODIFIER_DEFS, POWER_DEFS, SKILL_DEFS } from '../entities/gameDataLoaders';
import type { ICharacterPower, ICharacterPowerComponent, IResource } from '../entities/types';
import { calculateComponentPricing, calculatePowerPricing } from '../shared/lib/mathEngine';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { calculateCharacterPointSummary, createCharacterPointSummarySelector } from '../shared/lib/pointSummary';
import { validateCharacterSemantics, validatePowerForSave } from '../shared/lib/semanticValidation';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { importCharacterJSON } from '../services/character-file/importCharacter';
import { SCHEMA_VERSION } from '../entities/constants';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';

vi.mock('../services/downloadHelper', async (importOriginal) => ({
  ...await importOriginal<typeof import('../services/downloadHelper')>(),
  downloadBlob: vi.fn(),
}));

const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: SKILL_DEFS, advantageDefs: ADVANTAGE_DEFS };
const component = (overrides: Partial<ICharacterPowerComponent> = {}): ICharacterPowerComponent => ({
  id: 'component', effectId: 'damage', ranks: 5, modifiers: [], ...overrides,
});
const power = (value = component()): ICharacterPower => ({ id: 'power', name: 'Blast', components: [value], alternateEffects: [], notes: '' });
const characterWith = (value: ICharacterPower) => createDefaultCharacter({ powers: [value] });
const profiles = (character: ReturnType<typeof createDefaultCharacter>) => buildTargetedEffectProfiles(
  character, POWER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS, MODIFIER_DEFS,
).filter((profile) => profile.sourceType === 'power');
const armor = (id: string, ranks: number): IResource => ({
  id, type: 'gear', name: id, notes: '', createdAt: '', updatedAt: '',
  power: power(component({ effectId: 'protection', ranks })),
});

describe('rules audit regressions', () => {
  it('saves Accurate against the actual PL instead of the legacy PL 10 default', () => {
    const value = power(component({ ranks: 25, modifiers: [{ modifierId: 'accurate', ranks: 1 }] }));
    const character = characterWith(value);
    character.header.powerLevel = 20;
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, { ...context, character })).toEqual([]);
    character.header.powerLevel = 10;
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, { ...context, character })).toContainEqual(expect.objectContaining({ severity: 'error' }));
  });

  it('includes ability and combat skill bonuses when validating Accurate saves', () => {
    const value = power(component({ ranks: 10, modifiers: [{ modifierId: 'accurate', ranks: 1 }] }));
    const character = characterWith(value);
    character.abilities.fgt = 5;
    character.skills = [{ skillId: 'close_combat', ranks: 4, otherBonus: 2, subtype: 'Blast' }];
    expect(profiles(character)[0].bonusValue).toBe(13);
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, { ...context, character })).toContainEqual(expect.objectContaining({ severity: 'error' }));
    expect(validatePowerForSave(value, { ...DEFAULT_VALIDATION_RULES, plTradeOffsAsErrors: false }, { ...context, character })).toContainEqual(expect.objectContaining({ severity: 'warning' }));
    expect(validatePowerForSave(value, { ...DEFAULT_VALIDATION_RULES, enforcePLLimits: false }, { ...context, character })).toEqual([]);
  });

  it('does not invent PL 10 when validating a power without character context', () => {
    const value = power(component({ ranks: 25, modifiers: [{ modifierId: 'accurate', ranks: 1 }] }));
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, context)).toEqual([]);
  });

  it('charges extras on the Strength contribution without buying Strength Damage twice', () => {
    const value = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'increased_range', ranks: 1 }] }));
    const character = characterWith(value);
    character.abilities.str = 5;
    expect(calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS, 5).total).toBe(15);
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).powersCost).toBe(15);
    expect(profiles(character)[0]).toMatchObject({ range: 'ranged', effectRank: 10 });
    value.components[0].modifiers = [];
    expect(calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS, 5).total).toBe(5);
  });

  it('charges only modified Strength ranks for partial extras', () => {
    const value = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'increased_range', ranks: 1, affectedRanks: 7 }] }));
    expect(calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS, 5).total).toBe(12);
    const character = characterWith(value);
    character.abilities.str = 5;
    expect(profiles(character).map((profile) => [profile.range, profile.effectRank])).toEqual([['ranged', 7], ['close', 10]]);
  });

  it('ignores absent or negative Strength for extra pricing while preserving its effect on damage', () => {
    const value = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'increased_range', ranks: 1 }] }));
    const character = characterWith(value);
    character.abilities.str = -2;
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).powersCost).toBe(10);
    expect(profiles(character)[0].effectRank).toBe(3);
    character.abilities.str = 5;
    character.absentAbilities = ['str'];
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).powersCost).toBe(10);
    expect(profiles(character)[0].effectRank).toBe(5);
  });

  it('does not refund natural Strength for a flaw on a weapon', () => {
    const value = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'limited', ranks: 1 }] }));
    expect(calculatePowerPricing(value, POWER_DEFS, MODIFIER_DEFS, 5).total).toBe(3);
  });

  it('separates the direct attack from a partial Area effect', () => {
    const value = power(component({ ranks: 12, modifiers: [{ modifierId: 'area', ranks: 1, option: 'Burst', affectedRanks: 4 }] }));
    const character = characterWith(value);
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).powersCost).toBe(16);
    expect(profiles(character).map((profile) => [profile.effectRank, profile.requiresAttackCheck])).toEqual([[4, false], [12, true]]);
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, { ...context, character })).toEqual([]);
    expect(new Set(profiles(character).map((profile) => profile.id)).size).toBe(2);
  });

  it('handles the options-based partial format and full Area without a phantom attack', () => {
    const value = power(component({ ranks: 12, modifiers: [{ modifierId: 'area', ranks: 1, option: 'Burst', options: { affectedRanks: 4 } }] }));
    expect(profiles(characterWith(value)).map((profile) => profile.effectRank)).toEqual([4, 12]);
    value.components[0].modifiers[0].options = {};
    expect(profiles(characterWith(value))).toHaveLength(1);
    expect(profiles(characterWith(value))[0]).toMatchObject({ effectRank: 12, requiresAttackCheck: false });
  });

  it('uses separate no-roll caps for partial Perception range', () => {
    const value = power(component({ ranks: 12, modifiers: [{ modifierId: 'increased_range', ranks: 2, affectedRanks: 4 }] }));
    expect(profiles(characterWith(value)).map((profile) => [profile.range, profile.effectRank])).toEqual([['perception', 4], ['close', 12]]);
  });

  it.each(['will', 'fortitude', 'dodge', 'parry'])('preserves Damage DC 15 when changing resistance to %s', (resistance) => {
    const value = power(component({ ranks: 8, modifiers: [{ modifierId: 'alternate_resistance', ranks: 1, options: { subtypeId: resistance } }] }));
    expect(profiles(characterWith(value))[0].resistance).toBe(`${resistance[0].toUpperCase()}${resistance.slice(1)} DC 23`);
  });

  it.each(['close_combat', 'ranged_combat'])('includes otherBonus from %s in the attack', (skillId) => {
    const value = power(component({ modifiers: skillId === 'ranged_combat' ? [{ modifierId: 'increased_range', ranks: 1 }] : [] }));
    const character = characterWith(value);
    character.abilities.fgt = 2;
    character.abilities.dex = 2;
    character.skills = [{ skillId, ranks: 4, otherBonus: 3, subtype: 'Blast' }];
    expect(profiles(character)[0].bonusValue).toBe(9);
    character.skills[0].otherBonus = -3;
    expect(profiles(character)[0].bonusValue).toBe(3);
  });

  it('includes unarmed combat otherBonus', () => {
    const character = createDefaultCharacter({ skills: [{ skillId: 'close_combat', ranks: 2, otherBonus: 3, subtype: 'Unarmed' }] });
    expect(buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [], MODIFIER_DEFS)[0].bonusValue).toBe(5);
  });

  it('rejects inconsistent modifier source markers at import and save boundaries', async () => {
    const value = power(component({ modifiers: [{ modifierId: 'increased_range', ranks: 1, isPowerSpecific: true }] }));
    const character = characterWith(value);
    expect(validateCharacterSemantics(character, context)).toContainEqual(expect.objectContaining({ severity: 'error' }));
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, context)).toContainEqual(expect.objectContaining({ severity: 'error' }));
    const file = { text: async () => JSON.stringify({ schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), character }) } as File;
    await expect(importCharacterJSON(file)).rejects.toThrow();
    value.components[0].modifiers[0].isPowerSpecific = false;
    expect(validateCharacterSemantics(character, context)).toEqual([]);
    delete value.components[0].modifiers[0].isPowerSpecific;
    expect(validateCharacterSemantics(character, context)).toEqual([]);
  });

  it('includes paid and GM-granted armor without stacking equipment bonuses', () => {
    const resources = [armor('light', 3), armor('heavy', 5)];
    const character = createDefaultCharacter({ resourceLinks: [
      { id: 'a', resourceId: 'light', isFree: false }, { id: 'b', resourceId: 'heavy', isFree: true },
    ] });
    character.abilities.sta = 2;
    expect(deriveCharacterDefenses(character, POWER_DEFS, resources)).toMatchObject({ toughnessBonus: 5, toughnessTotal: 7 });
    expect(calculateCharacterPointSummary(character, resources, POWER_DEFS, MODIFIER_DEFS).resourceEPUsed).toBe(3);
    character.powers = [power(component({ effectId: 'protection', ranks: 8 }))];
    expect(deriveCharacterDefenses(character, POWER_DEFS, resources).toughnessTotal).toBe(10);
  });

  it('includes legacy armor but does not activate armor in an alternate slot', () => {
    const equipment = power(component({ effectId: 'protection', ranks: 5 }));
    const character = createDefaultCharacter({ equipment: [equipment] });
    expect(deriveCharacterDefenses(character, POWER_DEFS).toughnessBonus).toBe(5);
    equipment.components = [];
    equipment.alternateEffects = [{ id: 'alt', name: 'Armor', components: [component({ effectId: 'protection', ranks: 10 })], notes: '', dynamic: false }];
    expect(deriveCharacterDefenses(character, POWER_DEFS).toughnessBonus).toBe(0);
  });

  it('never adds the defenses of unlinked items, vehicles or headquarters to their owner', () => {
    const resources = [armor('unlinked', 20), {
      id: 'car', name: 'Car', type: 'vehicle', size: 'medium', strength: 0, speed: 0, defense: 0, toughness: 20,
      features: [], systems: [power(component({ effectId: 'protection', ranks: 20 }))], notes: '', createdAt: '', updatedAt: '',
    }, { id: 'hq', name: 'HQ', type: 'headquarters', size: 'small', toughness: 20, features: [], effects: [power(component({ effectId: 'protection', ranks: 20 }))], notes: '', createdAt: '', updatedAt: '' }] as IResource[];
    const character = createDefaultCharacter({ resourceLinks: [{ id: 'v', resourceId: 'car', isFree: false }, { id: 'h', resourceId: 'hq', isFree: false }] });
    expect(deriveCharacterDefenses(character, POWER_DEFS, resources).toughnessTotal).toBe(0);
  });

  it('uses corrected prices, resistance and armor in PDF HTML', async () => {
    const value = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'increased_range', ranks: 1 }] }));
    const character = characterWith(value);
    character.abilities.str = 5;
    character.resourceLinks = [{ id: 'armor-link', resourceId: 'armor', isFree: false }];
    const result = await generateCharacterPDF({ character, ...context, skillDefs: Object.fromEntries(SKILL_DEFS.map((skill) => [skill.id, skill])), advantageDefs: Object.fromEntries(ADVANTAGE_DEFS.map((advantage) => [advantage.id, advantage])), resources: [armor('armor', 5)], includeStyles: false });
    expect(result.success).toBe(true);
    expect(result.html).toContain('15 PP');
    expect(result.html).toContain('Toughness DC 25');
    expect(result.html).toMatch(/defense-name">Toughness<[^]*?defense-value">5</);
  });

  it('does not apply Accurate attack caps to an Area attack with no attack check', () => {
    const value = power(component({ ranks: 12, modifiers: [{ modifierId: 'accurate', ranks: 5 }, { modifierId: 'area', ranks: 1, option: 'Burst' }] }));
    const character = characterWith(value);
    expect(profiles(character)[0].requiresAttackCheck).toBe(false);
    expect(validatePowerForSave(value, DEFAULT_VALIDATION_RULES, { ...context, character })).toEqual([]);
  });

  it('keeps alternate profile keys unique even for reused component IDs', () => {
    const value = power();
    value.alternateEffects = ['a', 'b'].map((id) => ({ id, name: id, components: [component()], notes: '', dynamic: false }));
    const entries = profiles(characterWith(value));
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(3);
    expect(entries.slice(1).map((entry) => entry.parentId)).toEqual(['power', 'power']);
  });

  it('charges Strength-based linked equipment and honors shared EP contributions', () => {
    const resource = armor('weapon', 5);
    if (resource.type === 'vehicle' || resource.type === 'headquarters') throw new Error('Expected gear');
    resource.power = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'increased_range', ranks: 1 }] }));
    const character = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: resource.id, isFree: false }] });
    character.abilities.str = 5;
    expect(calculateCharacterPointSummary(character, [resource], POWER_DEFS, MODIFIER_DEFS).resourceEPUsed).toBe(15);
    character.resourceLinks![0].contributionEP = 3;
    expect(calculateCharacterPointSummary(character, [resource], POWER_DEFS, MODIFIER_DEFS).resourceEPUsed).toBe(3);
  });

  it('exports actual derived defenses and canonical equipment prices to Excel', async () => {
    const weapon = power(component({ fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'increased_range', ranks: 1 }] }));
    const character = createDefaultCharacter({ equipment: [weapon], advantages: [{ advantageId: 'improved_initiative', ranks: 2 }], resourceLinks: [{ id: 'link', resourceId: 'armor', isFree: true }] });
    character.abilities.str = 5;
    character.abilities.sta = 2;
    character.abilities.agl = 3;
    const labels = new Proxy({}, { get: (_, key) => key === 'abilityNames' || key === 'defenseNames' ? {} : String(key) }) as ExportLabels;
    await generateExcel(character, labels, context, 'en', [armor('armor', 5)]);
    const blob = vi.mocked(downloadBlob).mock.calls.at(-1)![0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await blob.arrayBuffer());
    const defenses = workbook.getWorksheet('sheetDefenses')!;
    expect(defenses.getCell('D9').value).toBe(7);
    expect(defenses.getCell('D10').value).toBe('+11');
    expect(workbook.getWorksheet('sheetEquipment')!.getCell('B3').value).toBe(15);
  });

  it('reuses the shared summary for text edits and invalidates it for rule inputs', () => {
    const select = createCharacterPointSummarySelector(POWER_DEFS, MODIFIER_DEFS);
    const character = characterWith(power());
    const resources: IResource[] = [];
    const summary = select(character, resources);
    expect(select({ ...character, notes: 'New notes', header: { ...character.header, name: 'New name' } }, resources)).toBe(summary);
    expect(select({ ...character, abilities: { ...character.abilities, str: 5 } }, resources)).not.toBe(summary);
    const changed = select({ ...character, header: { ...character.header, powerLevel: 12 } }, resources);
    expect(changed.totalAvailable).toBe(180);
    expect(select(character, [armor('armor', 5)])).not.toBe(changed);
  });

  it('prices huge rank counts directly by modifier boundaries', () => {
    const value = component({ ranks: 10_000_000, modifiers: [{ modifierId: 'increased_range', ranks: 1, affectedRanks: 4 }] });
    const result = calculateComponentPricing(value, POWER_DEFS.find((effect) => effect.id === 'damage')!, MODIFIER_DEFS);
    expect(result.total).toBe(10_000_004);
    expect(result.rankGroups).toHaveLength(2);
  });
});
