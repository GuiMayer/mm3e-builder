import { describe, expect, it } from 'vitest';
import { createInstance } from 'i18next';
import en from '../locales/en/translation.json';
import pt from '../locales/pt-BR/translation.json';
import { formatDiagnostic } from '../shared/lib/formatDiagnostic';
import { validatePowerForSave } from '../shared/lib/semanticValidation';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import type { ICharacterPower } from '../entities/types';

const power: ICharacterPower = { id: 'p', name: 'Meu texto', notes: 'Do not translate me', components: [{ id: 'c', effectId: 'affliction', ranks: 1, modifiers: [{ modifierId: 'limited', ranks: 1 }, { modifierId: 'limited', ranks: 2 }] }], alternateEffects: [{ id: 'a', name: '', notes: '', dynamic: false, components: [] }] };
async function translator() {
  const i18n = createInstance();
  await i18n.init({ lng: 'en', fallbackLng: 'en', keySeparator: false, resources: { en: { translation: en }, 'pt-BR': { translation: pt } } });
  return i18n;
}
describe('presentation diagnostics', () => {
  it('translates the same diagnostic after a language switch without changing state or save semantics', async () => {
    const snapshot = JSON.stringify(power);
    const issues = validatePowerForSave(power, DEFAULT_VALIDATION_RULES, { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS });
    const i18n = await translator();
    const duplicate = issues.find(issue => issue.messageKey === 'builder.duplicateModifierWarning')!;
    expect(formatDiagnostic(duplicate, i18n.t, i18n.language)).toContain('Limited');
    await i18n.changeLanguage('pt-BR');
    expect(formatDiagnostic(duplicate, i18n.t, i18n.language)).toContain('Limitado');
    expect(formatDiagnostic(issues.find(issue => issue.messageKey === 'diagnostic.unnamedAlternate')!, i18n.t, i18n.language)).toContain('sem nome');
    expect(JSON.stringify(power)).toBe(snapshot);
    expect(duplicate.severity).toBe('warning');
    expect(issues.find(issue => issue.messageKey === 'diagnostic.requiredField')?.path).toBe('components.0.fieldValues.resistance');
  });
  it('localizes unresolved pricing while preserving unknown identities and zero-cost fallback', async () => {
    const invalid = { ...power, components: [{ id: 'c', effectId: 'invalid-id', ranks: 1, modifiers: [] }] };
    const result = calculatePowerPricing(invalid, POWER_DEFS, MODIFIER_DEFS);
    const i18n = await translator();
    await i18n.changeLanguage('pt-BR');
    expect(formatDiagnostic(result.diagnostics[0], i18n.t, i18n.language)).toContain('desconhecido "invalid-id"');
    expect(result.total).toBe(1); // the existing Alternate Effect overhead remains
  });
  it('retains a user-authored duplicate name verbatim in both languages', async () => {
    const named = { ...power, alternateEffects: [0, 1].map(index => ({ id: String(index), name: 'Minha Chama', notes: '', dynamic: false, components: [] })) };
    const issue = validatePowerForSave(named, DEFAULT_VALIDATION_RULES, { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS }).find(issue => issue.messageKey === 'diagnostic.duplicateAlternate')!;
    const i18n = await translator();
    for (const language of ['en', 'pt-BR']) {
      await i18n.changeLanguage(language);
      expect(formatDiagnostic(issue, i18n.t, language)).toContain('Minha Chama');
    }
    expect(issue.severity).toBe('error');
  });
});
