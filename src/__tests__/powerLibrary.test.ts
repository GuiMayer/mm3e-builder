import { describe, expect, it } from 'vitest';
import { instantiatePowerTemplate } from '../features/power-library/powerTemplateInstantiation';
import { applyPowerTemplate, canApplyPowerTemplate } from '../features/power-library/powerTemplateApplication';
import type { PowerTemplate } from '../features/power-library/types';
import { calculatePowerPricing } from '../shared/lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { CharacterPowerSchema } from '../entities/schemas';
import dimension from '../data/power-library/profiles/dimension';
import luck from '../data/power-library/profiles/luck';
import sensory from '../data/power-library/profiles/sensory';
import time from '../data/power-library/profiles/time';

const missile: PowerTemplate = {
  id: 'test-missile', profileId: 'armor', name: { en: 'Missile', pt: 'Míssil' },
  section: { en: 'Offensive', pt: 'Ofensivos' }, summary: { en: 'Guided missile.', pt: 'Míssil guiado.' }, page: 11,
  components: [
    { effectId: 'damage', ranks: 1, scalable: true, modifiers: [
      { modifierId: 'increased_range', ranks: 1, isPowerSpecific: false },
      { modifierId: 'homing', ranks: 2, isPowerSpecific: false },
    ] },
    { effectId: 'senses', ranks: 1, modifiers: [], senseTraits: [{ id: 'infravision', ranks: 1 }] },
  ], audit: { formula: '3 + 2 per rank', fixed: 3, perRank: 2 },
};
const price = (power: ReturnType<typeof instantiatePowerTemplate>) => calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS).total;

describe('power library drafts', () => {
  it('materializes scalable flat purchases, modifier-only purchases and skill/sense bonuses without catalog fields', () => {
    const blade = instantiatePowerTemplate(dimension.find(item => item.name.en === 'Dimensional Blade')!, 10);
    expect(blade.components[0].modifiers.find(modifier => modifier.modifierId === 'penetrating')?.ranks).toBe(10);
    expect(price(blade)).toBe(21);
    const weakness = instantiatePowerTemplate(luck.find(item => item.name.en === 'Find Weakness')!, 5);
    expect(weakness.components[0].ranks).toBe(0);
    expect(price(weakness)).toBe(5);
    const senses = instantiatePowerTemplate(sensory.find(item => item.name.en === 'Enhanced Senses')!, 5);
    expect(senses.components[0].ranks).toBe(10);
    expect(price(senses)).toBe(5);
    const rapid = instantiatePowerTemplate(time.find(item => item.name.en === 'Rapid Perception')!, 5);
    expect(rapid.components.every(component => component.ranks === 5 && component.senseTraits?.[0].ranks === 5)).toBe(true);
    expect(price(rapid)).toBe(25);
    for (const power of [blade, weakness, senses, rapid]) expect(CharacterPowerSchema.parse(power)).toEqual(power);
  });
  it('scales only declared effect ranks and calculates using the existing engine', () => {
    for (const ranks of [1, 5, 10]) {
      const power = instantiatePowerTemplate(missile, ranks);
      expect(price(power)).toBe(3 + 2 * ranks);
      expect(power.components[0].modifiers[1].ranks).toBe(2);
      expect(power.components[1].ranks).toBe(1);
      expect(CharacterPowerSchema.parse(power)).toEqual(power);
    }
  });
  it('does not read editorial expected prices or share mutable catalog objects', () => {
    const altered = { ...missile, audit: { formula: 'incorrect audit', fixed: 10000, perRank: 999 } };
    const one = instantiatePowerTemplate(altered);
    const two = instantiatePowerTemplate(altered);
    expect(price(one)).toBe(5);
    one.components[0].modifiers[0].ranks = 8;
    expect(two.components[0].modifiers[0].ranks).toBe(1);
    expect(missile.components[0].modifiers[0].ranks).toBe(1);
    expect(one.components[0].id).not.toBe(two.components[0].id);
  });
  it('replaces a selected component atomically, preserving siblings, notes and alternate effects', () => {
    const original = instantiatePowerTemplate(missile);
    original.name = 'Custom'; original.notes = 'Player notes';
    original.components[0].fieldValues = { stale: 'old selection' };
    original.alternateEffects = [{ id: 'ae', name: 'Sibling', dynamic: true, notes: 'AE notes', components: [original.components[1]] }];
    const result = applyPowerTemplate(original, instantiatePowerTemplate(missile, 5), { kind: 'component', componentId: original.components[0].id });
    expect(result.name).toBe('Custom');
    expect(result.notes).toContain('Player notes');
    expect(result.components).toHaveLength(3);
    expect(result.components[0].id).toBe(original.components[0].id);
    expect(result.components[0].fieldValues).toBeUndefined();
    expect(result.components[2]).toEqual(original.components[1]);
    expect(result.alternateEffects).toEqual(original.alternateEffects);
    expect(original.components[0].ranks).toBe(1);
  });
  it('preserves Dynamic and the parent when populating an alternate', () => {
    const original = instantiatePowerTemplate(missile);
    original.alternateEffects = [{ id: 'ae', name: '', dynamic: true, notes: '', components: [] }];
    const result = applyPowerTemplate(original, instantiatePowerTemplate(missile), { kind: 'alternate', alternateId: 'ae' });
    expect(result.alternateEffects[0].dynamic).toBe(true);
    expect(result.alternateEffects[0].name).toBe('Missile');
    expect(result.components).toEqual(original.components);
    expect(result.notes).toBe(original.notes);
  });
  it('rejects stale targets and nested arrays without changing the original', () => {
    const original = instantiatePowerTemplate(missile);
    const recipe = instantiatePowerTemplate(missile);
    recipe.alternateEffects = [{ id: 'nested', name: 'Nested', dynamic: false, notes: '', components: recipe.components }];
    const target = { kind: 'component' as const, componentId: original.components[1].id };
    expect(canApplyPowerTemplate(original, recipe, target)).toBe(false);
    expect(() => applyPowerTemplate(original, recipe, target)).toThrow();
    expect(() => applyPowerTemplate(original, recipe, { kind: 'alternate', alternateId: 'missing' })).toThrow();
    expect(original.alternateEffects).toEqual([]);
  });
});
