import { describe, expect, it, vi } from 'vitest';
import { createInstance } from 'i18next';
import ExcelJS from 'exceljs';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPowerComponent, ICharacterPower } from '../entities/types';
import { validatePowerForSave } from '../shared/lib/semanticValidation';
import { getBlockingPowerSaveIssues } from '../features/power-builder/powerSavePolicy';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import { validateAfflictionComponent } from '../shared/lib/afflictionConfiguration';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { importCharacterJSON } from '../services/character-file/importCharacter';
import { parseDraftBundle, serializeDraftBundle } from '../services/draftTransfer';
import { renderPowerDetails } from '../services/pdf/components/powerDetails';
import { createPDFLabels, localizePDFPowers } from '../services/pdf/pdfMessages';
import { generateExcel } from '../services/excelGenerator';
import { buildExcelLabels } from '../services/excelExportConfig';
import en from '../locales/en/translation.json';
import { downloadBlob } from '../services/downloadHelper';
vi.mock('../services/downloadHelper', () => ({ downloadBlob: vi.fn(), sanitizeFileName: (name: string) => name }));
const effect = POWER_DEFS.find(effect => effect.id === 'affliction')!;
const component: ICharacterPowerComponent = { id: 'c', effectId: 'affliction', ranks: 5, modifiers: [], fieldValues: { resistance: 'will', afflictionDegrees: ['1','2','3'], afflictionDegree1: ['dazed'], afflictionDegree2: ['stunned'], afflictionDegree3: ['incapacitated'] } };
const power: ICharacterPower = { id: 'p', name: 'My power', notes: 'Old handwritten notes remain', components: [component], alternateEffects: [] };
const mod = (modifierId: string, ranks = 1) => ({ modifierId, ranks, isPowerSpecific: true });
const validate = (value: ICharacterPowerComponent) => validateAfflictionComponent(value, effect, MODIFIER_DEFS);
describe('optional structured Affliction', () => {
  it('leaves legacy note-only data unverified, unchanged and saveable', () => {
    const legacy = { ...component, fieldValues: { resistance: 'will' } };
    const original = JSON.stringify(legacy);
    expect(validate(legacy)).toEqual([]);
    expect(JSON.stringify(legacy)).toBe(original);
  });
  it('accepts a normal progression, two degrees, and third-degree-only purchases', () => {
    expect(validate(component)).toEqual([]);
    expect(validate({ ...component, modifiers: [mod('limited_degree')], fieldValues: { ...component.fieldValues, afflictionDegrees: ['1','2'] } })).toEqual([]);
    expect(validate({ ...component, modifiers: [mod('limited_degree'), mod('limited_degree')], fieldValues: { ...component.fieldValues, afflictionDegrees: ['3'] } })).toEqual([]);
  });
  it('handles Extra Condition as simultaneous conditions at every active degree', () => {
    const two = { ...component, modifiers: [mod('extra_condition')], fieldValues: { ...component.fieldValues, afflictionDegree1: ['dazed','vulnerable'], afflictionDegree2: ['stunned','defenseless'], afflictionDegree3: ['incapacitated','unaware'] } };
    expect(validate(two)).toEqual([]);
    expect(validate({ ...two, fieldValues: component.fieldValues })).toHaveLength(3);
  });
  it('supports variable conditions for all or one chosen degree and retains stored inactive selections', () => {
    expect(validate({ ...component, modifiers: [mod('variable_conditions')], fieldValues: { resistance: 'will', afflictionDegrees: ['1','2','3'] } })).toEqual([]);
    const single = { ...component, modifiers: [mod('variable_condition_degree')], fieldValues: { ...component.fieldValues, afflictionVariableDegrees: ['2'], afflictionDegree2: [] } };
    expect(validate(single)).toEqual([]);
    const thirdOnly: ICharacterPowerComponent = { ...single, modifiers: [mod('limited_degree', 2)], fieldValues: { ...component.fieldValues, afflictionDegrees: ['3'] } };
    expect(validate(thirdOnly)).toEqual([]);
    expect(thirdOnly.fieldValues?.afflictionDegree1).toEqual(['dazed']);
  });
  it('keeps alternate initial resistance separate from recovery without rejecting variants', () => {
    const alternate = { ...component, modifiers: [{ ...mod('alternate_resistance'), options: { subtypeId: 'dodge' } }], fieldValues: { ...component.fieldValues, afflictionRecovery: 'fortitude' } };
    expect(validate(alternate)).toEqual([]);
  });
  it('integrates only advisory diagnostics in base, Linked and AE when enabled, independently of PL', () => {
    const invalid = { ...component, fieldValues: { ...component.fieldValues, afflictionDegree1: ['incapacitated'] } };
    const draft = { ...power, components: [component, { ...invalid, id: 'linked' }], alternateEffects: [{ id: 'a', name: 'Other', notes: '', dynamic: false, components: [invalid] }] };
    const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS };
    const flags = { ...DEFAULT_VALIDATION_RULES, enforcePLLimits: false, enforceAfflictionProgression: true };
    const issues = validatePowerForSave(draft, flags, context).filter(issue => issue.messageKey?.startsWith('builder.affliction.warning'));
    expect(issues).toHaveLength(2);
    expect(issues.every(issue => issue.severity === 'warning')).toBe(true);
    expect(getBlockingPowerSaveIssues(draft, flags, context)).toEqual([]);
    expect(validatePowerForSave(draft, { ...flags, enforceAfflictionProgression: false }, context).filter(issue => issue.messageKey?.startsWith('builder.affliction.warning'))).toEqual([]);
  });
  it('round-trips JSON and JSONL without changing notes, modifiers or cost and renders conditions in both PDF languages', async () => {
    const character = createDefaultCharacter({ characterId: '3f09715c-1d42-4e53-9783-84ce8b5270e1', powers: [power] });
    const before = JSON.stringify(character);
    const file = new File([JSON.stringify({ schemaVersion: '2.2.0', exportedAt: '', character })], 'hero.json');
    const loaded = await importCharacterJSON(file);
    expect(loaded.powers).toEqual(character.powers);
    const bundle = parseDraftBundle(serializeDraftBundle([{ id: 'tab', label: 'Hero', lastModified: 1, isDirty: false, character }], 'tab', []));
    expect(bundle.tabs[0].character.powers).toEqual(character.powers);
    expect(calculatePowerPricing(loaded.powers[0], POWER_DEFS, MODIFIER_DEFS).total).toBe(5);
    expect(renderPowerDetails(power, POWER_DEFS, MODIFIER_DEFS)).toContain('Degree 1: Dazed');
    expect(renderPowerDetails(power, localizePDFPowers(POWER_DEFS, 'pt-BR'), MODIFIER_DEFS, createPDFLabels('pt-BR'))).toContain('1º grau: Atordoado');
    expect(renderPowerDetails(power, localizePDFPowers(POWER_DEFS, 'pt-BR'), MODIFIER_DEFS, createPDFLabels('pt-BR'))).toContain('Tipo de Resistência: Vontade');
    expect(JSON.stringify(character)).toBe(before);
  });
  it('writes and reloads an actual Excel workbook containing base and alternate condition details', async () => {
    const i18n = createInstance();
    await i18n.init({ lng: 'en', keySeparator: false, resources: { en: { translation: en } } });
    const character = createDefaultCharacter({ powers: [{ ...power, alternateEffects: [{ id: 'a', name: 'Other', dynamic: false, notes: 'Alternate notes', components: [component] }] }] });
    const original = JSON.stringify(character);
    await generateExcel(character, buildExcelLabels(i18n.t), { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: [], advantageDefs: [] }, 'en');
    const blob = vi.mocked(downloadBlob).mock.calls.at(-1)![0];
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await blob.arrayBuffer());
    const values = workbook.getWorksheet(i18n.t('excel.sheetPowers'))!.getRow(2).values;
    expect(JSON.stringify(values)).toContain('Degree 1: Dazed');
    expect(JSON.stringify(values)).toContain('Alternate notes');
    expect(JSON.stringify(character)).toBe(original);
  });
});
