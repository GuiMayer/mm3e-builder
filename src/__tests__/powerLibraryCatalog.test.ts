import { describe, expect, it } from 'vitest';
import type { PowerTemplate } from '../features/power-library/types';
import { instantiatePowerTemplate } from '../features/power-library/powerTemplateInstantiation';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { resolveModifierDefinition } from '../shared/lib/rulesCatalog';
import { CharacterPowerSchema } from '../entities/schemas';
import { POWER_LIBRARY_INDEX } from '../data/power-library/catalogIndex';
import { POWER_PROFILES } from '../data/power-library/profiles';
import { SENSE_TRAITS } from '../data/senseTraits';
import { resolveEffectiveAction, resolveEffectiveDuration } from '../shared/lib/effectParameters';
import { applyPowerTemplate } from '../features/power-library/powerTemplateApplication';

const modules = import.meta.glob<PowerTemplate[]>('../data/power-library/profiles/*.ts', { eager: true, import: 'default' });
const templates = Object.values(modules).flat();
describe('Published powers catalog audit', () => {
  it('applies the four Sustained Afflictions with normal pricing and a localized rule note', () => {
    for (const [id, perRank] of [
      ['kinetic-friction-blindness', 0.5], ['kinetic-friction-muzzle', 0.5],
      ['light-blinding-aura', 4], ['magic-fifth-wheel-of-weyan', 4],
    ] as const) {
      const template = templates.find(item => item.id === id)!;
      expect(template.requiresCharacterChanges).toBeUndefined();
      expect(POWER_LIBRARY_INDEX.find(item => item.id === id)?.referenceOnly).toBeUndefined();
      for (const language of ['en', 'pt-BR']) {
        const recipe = instantiatePowerTemplate(template, 5, language);
        const component = recipe.components[0];
        const effect = POWER_DEFS.find(item => item.id === component.effectId)!;
        const context = { effect, modifierDefs: MODIFIER_DEFS };
        expect(resolveEffectiveDuration(effect.duration, component, context)).toEqual({ value: 'sustained', diagnostics: [] });
        expect(resolveEffectiveAction(effect.action, component, context).maintenanceAction).toBe('free');
        expect(calculatePowerPricing(recipe, POWER_DEFS, MODIFIER_DEFS).total).toBe(Math.ceil(perRank * 5));
        expect(recipe.notes).toContain('DC Adventures');
        expect(recipe.notes).toContain(language === 'en' ? '+2 PP per effect rank' : '+2 PP por graduação');
        expect(recipe).not.toHaveProperty('ruleNote');
        const target = { id: 'target', name: '', notes: '', components: [{ ...component, id: 'base' }], alternateEffects: [] };
        const result = applyPowerTemplate(target, recipe, { kind: 'component', componentId: 'base' });
        expect(result.notes).toContain('DC Adventures');
        expect(CharacterPowerSchema.parse(JSON.parse(JSON.stringify(result)))).toEqual(result);
        const changedEditorialPrice = instantiatePowerTemplate({ ...template, audit: { formula: 'Ignored editorial price', fixed: 999, perRank: 999 } }, 5, language);
        expect(calculatePowerPricing(changedEditorialPrice, POWER_DEFS, MODIFIER_DEFS).total).toBe(Math.ceil(perRank * 5));
      }
    }
  });
  it('indexes every published recipe exactly once and uses known chapters', () => {
    const ids = templates.map(template => template.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(POWER_LIBRARY_INDEX.map(entry => entry.id).sort()).toEqual([...ids].sort());
    expect([...new Set(templates.map(template => template.profileId))].sort()).toEqual(POWER_PROFILES.map(profile => profile.id).sort());
    expect(POWER_LIBRARY_INDEX.filter(entry => entry.referenceOnly).map(entry => entry.id).sort()).toEqual(templates.filter(template => template.requiresCharacterChanges).map(template => template.id).sort());
    for (const template of templates) expect(POWER_PROFILES.some(profile => profile.id === template.profileId)).toBe(true);
  });
  for (const template of templates) {
    it(`${template.profileId}: ${template.name.en} — source price, configuration and portability`, () => {
      // Open Handbook compositions have no defined purchase or printed price.
      if (!template.components.length) {
        expect(template.requiresCharacterChanges).toBeDefined();
        expect(POWER_LIBRARY_INDEX.find(entry => entry.id === template.id)?.referenceOnly).toBe(true);
        const power = instantiatePowerTemplate(template);
        expect(CharacterPowerSchema.parse(power)).toEqual(power);
        return;
      }
      const reference = template.audit.discrepancy ?? template.audit;
      for (const ranks of [1, 5, 10]) {
        const power = instantiatePowerTemplate(template, ranks);
        const pricing = calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS);
        const expected = template.audit.samples?.find(sample => sample.ranks === ranks)?.total
          ?? reference.fixed + Math.ceil(reference.perRank * ranks);
        expect(pricing.diagnostics, `${template.id}: no ambiguous or unresolved prices`).toEqual([]);
        expect(pricing.total, `${template.id}: rank ${ranks}`).toBe(expected);
        expect(CharacterPowerSchema.parse(power)).toEqual(power);
        const components = [...power.components, ...power.alternateEffects.flatMap(ae => ae.components)];
        for (const component of components) {
          const effect = POWER_DEFS.find(definition => definition.id === component.effectId)!;
          expect(effect).toBeDefined();
          if (component.variableCostOption) expect(effect.variableCost?.options.some(option => option.name === component.variableCostOption)).toBe(true);
          for (const modifier of component.modifiers) {
            const resolved = resolveModifierDefinition(modifier, effect, MODIFIER_DEFS);
            expect(resolved.definition).toBeDefined();
            expect(resolved.source === 'power-specific').toBe(modifier.isPowerSpecific);
          }
          if (component.senseTraits) {
            expect(component.senseTraits.reduce((sum, trait) => sum + trait.ranks, 0)).toBe(component.ranks);
            for (const trait of component.senseTraits) {
              const definition = SENSE_TRAITS.find(item => item.id === trait.id)!;
              expect(definition).toBeDefined();
              expect(trait.ranks).toBeGreaterThanOrEqual(definition.minRanks);
              expect(trait.ranks).toBeLessThanOrEqual(definition.maxRanks);
              if (definition.requiresSense) expect(trait.senseType).toBeTruthy();
              if (definition.requiresDetail) expect(trait.detail?.trim()).toBeTruthy();
            }
          }
        }
      }
    });
  }
});
