import { describe, expect, it } from 'vitest';
import handbook from '../data/power-library/profiles/handbook';
import { POWER_LIBRARY_INDEX } from '../data/power-library/catalogIndex';
import { searchLibrary } from '../data/power-library';
import { instantiatePowerTemplate } from '../features/power-library/powerTemplateInstantiation';
import { applyPowerTemplate } from '../features/power-library/powerTemplateApplication';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { resolveEffectiveAction, resolveEffectiveDuration } from '../shared/lib/effectParameters';
import { afflictionRecoveryLabel, afflictionSummary, validateAfflictionComponent } from '../shared/lib/afflictionConfiguration';
import en from '../locales/en/translation.json';
import pt from '../locales/pt-BR/translation.json';
import { resolveTraitState } from '../shared/lib/traitValues';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { CharacterPowerSchema } from '../entities/schemas';
import { renderPowerDetails } from '../services/pdf/components/powerDetails';
import { createPDFLabels } from '../services/pdf/pdfMessages';

const template = (id: string) => handbook.find(item => item.id === `handbook-${id}`)!;
const draft = (id: string, ranks = 1, language = 'en') => instantiatePowerTemplate(template(id), ranks, language);
const price = (power: ReturnType<typeof draft>) => calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS).total;

describe('Deluxe Handbook sample powers', () => {
  it('covers all 21 sample powers, splits fixed Invisibility scopes and does not invent an Alternate Form purchase', () => {
    expect(handbook).toHaveLength(22);
    expect(handbook.filter(item => item.requiresCharacterChanges).map(item => item.id)).toEqual(['handbook-alternate-form']);
    expect(template('alternate-form').components).toEqual([]);
    const results = searchLibrary(POWER_LIBRARY_INDEX, 'metamorfose', 'handbook', 'pt-BR');
    expect(results.map(item => item.id)).toEqual(['handbook-shapeshift']);
    expect(POWER_LIBRARY_INDEX.some(item => item.id === 'morphing-shapeshift')).toBe(true);
  });
  it('keeps source identity and strips catalog policy from portable compositions without consulting editorial prices', () => {
    for (const recipe of handbook.filter(item => item.components.length)) {
      for (const language of ['en', 'pt-BR']) {
        const power = instantiatePowerTemplate(recipe, 5, language);
        const editedAudit = instantiatePowerTemplate({ ...recipe, audit: { formula: 'Not a purchase', fixed: 9999, perRank: 9999 } }, 5, language);
        expect(price(editedAudit)).toBe(price(power));
        expect(power.notes).toContain('Deluxe Hero’s Handbook');
        expect(power.notes).not.toContain('Power Profiles');
        expect(power).not.toHaveProperty('book');
        expect(power.components.every(component => !('chooseEnhancedTrait' in component) && !('choices' in component) && !('scalable' in component))).toBe(true);
        expect(CharacterPowerSchema.parse(JSON.parse(JSON.stringify(power)))).toEqual(power);
        const target = draft('blast');
        const result = applyPowerTemplate(target, power, { kind: 'component', componentId: target.components[0].id }, true);
        expect(price(result)).toBe(price(power));
        expect(target.components[0].effectId).toBe('damage');
      }
    }
  });
  it('preserves the Handbook action, duration, modifiers and fixed prices rather than applying Power Profiles variants', () => {
    const summon = draft('duplication', 5);
    expect(summon.components[0].modifiers.map(modifier => modifier.modifierId)).toEqual(['active']);
    expect(price(summon)).toBe(15);
    const field = draft('force-field', 5).components[0];
    const protection = POWER_DEFS.find(effect => effect.id === 'protection')!;
    expect(resolveEffectiveDuration(protection.duration, field, { effect: protection, modifierDefs: MODIFIER_DEFS }).value).toBe('sustained');
    for (const id of ['mimic', 'shapeshift']) {
      const power = draft(id, 5);
      const variable = POWER_DEFS.find(effect => effect.id === 'variable')!;
      expect(resolveEffectiveAction(variable.action, power.components[0], { effect: variable, modifierDefs: MODIFIER_DEFS }).value).toBe('move');
      expect(price(power)).toBe(40);
    }
    const sleep = draft('sleep', 5);
    expect(sleep.components[0].fieldValues?.resistance).toBe('fortitude');
    expect(sleep.components[0].modifiers.map(modifier => modifier.modifierId)).toEqual(['increased_range']);
    expect(price(sleep)).toBe(10);
    for (const id of ['mental-blast', 'mind-control']) expect(price(draft(id, 5))).toBe(20);
    expect(price(draft('invisibility-normal', 10))).toBe(4);
    expect(price(draft('invisibility-all', 10))).toBe(8);
    expect(draft('invisibility-all', 10).components[0].ranks).toBe(4);
  });
  it('materializes valid Affliction conditions and the Snare recovery rule', () => {
    const affliction = POWER_DEFS.find(effect => effect.id === 'affliction')!;
    for (const id of ['dazzle', 'mind-control', 'sleep', 'snare', 'suffocation']) {
      const component = draft(id).components[0];
      expect(validateAfflictionComponent(component, affliction, MODIFIER_DEFS)).toEqual([]);
    }
    const snare = draft('snare').components[0];
    expect(snare.fieldValues?.afflictionDegrees).toEqual(['1', '2']);
    expect(snare.fieldValues?.afflictionRecovery).toBe('damage-or-sleight-of-hand');
    expect(snare.modifiers.find(modifier => modifier.modifierId === 'alternate_resistance')?.options?.subtypeId).toBe('dodge');
    for (const [translations, expected] of [[en, 'Sleight of Hand'], [pt, 'Prestidigitação']] as const) {
      const label = (key: string) => (translations as Record<string, string>)[key] ?? key;
      expect(afflictionSummary(snare, label).at(-1)).toContain(expected);
      expect(afflictionSummary(snare, label).at(-1)).not.toContain('defenses.');
    }
    expect(afflictionRecoveryLabel('Custom recovery rule', key => key)).toBe('Custom recovery rule');
    expect(renderPowerDetails(draft('snare'), POWER_DEFS, MODIFIER_DEFS, createPDFLabels('pt-BR'))).toContain('Dano ou Prestidigitação');
  });
  it('grants Super-Speed initiative without buying it twice and keeps Power-Lifting out of combat Strength', () => {
    const speed = draft('super-speed', 5);
    expect(speed.components.map(component => component.ranks)).toEqual([5, 5, 5]);
    expect(price(speed)).toBe(15);
    const character = createDefaultCharacter({ powers: [speed, draft('power-lifting', 5)] });
    const state = resolveTraitState(character, []);
    expect(state.character.advantages.find(advantage => advantage.advantageId === 'improved_initiative')?.ranks).toBe(5);
    expect(state.character.abilities.str).toBe(character.abilities.str);
  });
  it('lets Energy Absorption use the selected trait price through the same modifiers', () => {
    const power = draft('energy-absorption', 5);
    expect(price(power)).toBe(10);
    power.components[0].variableCostOption = 'Enhanced Skill';
    expect(price(power)).toBe(3);
    power.components[0].variableCostOption = 'Enhanced Defense';
    expect(price(power)).toBe(5);
    expect(power.components[0].modifiers.map(modifier => modifier.modifierId)).toEqual(['fades', 'reaction']);
  });
});
