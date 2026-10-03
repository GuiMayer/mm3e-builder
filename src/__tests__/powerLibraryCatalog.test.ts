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

const modules = import.meta.glob<PowerTemplate[]>('../data/power-library/profiles/*.ts', { eager: true, import: 'default' });
const templates = Object.values(modules).flat();
describe('Power Profiles catalog audit', () => {
  it('indexes every published recipe exactly once and uses known chapters', () => {
    const ids = templates.map(template => template.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(POWER_LIBRARY_INDEX.map(entry => entry.id).sort()).toEqual([...ids].sort());
    for (const template of templates) expect(POWER_PROFILES.some(profile => profile.id === template.profileId)).toBe(true);
  });
  for (const template of templates) {
    it(`${template.profileId}: ${template.name.en} — source price, configuration and portability`, () => {
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
