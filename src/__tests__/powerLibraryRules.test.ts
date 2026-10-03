import { describe, expect, it } from 'vitest';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { calculateComponentPricing } from '../shared/lib/mathEngine';
import type { ICharacterPowerComponent } from '../entities/types';

describe('rules needed by Power Profiles recipes', () => {
  const summon = POWER_DEFS.find(effect => effect.id === 'summon')!;
  const animals: ICharacterPowerComponent = { id: 'animals', effectId: 'summon', ranks: 3, modifiers: [
    { modifierId: 'variable_type_broad', ranks: 1, isPowerSpecific: true },
    { modifierId: 'horde', ranks: 1, isPowerSpecific: true },
    { modifierId: 'multiple_minions_ranked', ranks: 5, isPowerSpecific: true },
    { modifierId: 'self_powered', ranks: 1, isPowerSpecific: true },
  ] };
  it('prices Animal Summoning with five purchases of +2 per Summon rank, totaling 42 PP', () => {
    expect(calculateComponentPricing(animals, summon, MODIFIER_DEFS).total).toBe(42);
  });
  it('preserves the original flat-price modifier for existing sheets', () => {
    const legacy = { ...animals, modifiers: animals.modifiers.map(modifier => modifier.modifierId === 'multiple_minions_ranked' ? { ...modifier, modifierId: 'multiple_minions' } : modifier) };
    expect(calculateComponentPricing(legacy, summon, MODIFIER_DEFS).total).toBe(22);
  });
  it('prices Environment visibility and movement intensities with their actual definitions', () => {
    const environment = POWER_DEFS.find(effect => effect.id === 'environment')!;
    for (const [option, cost] of [['Visibility (-2)', 1], ['Visibility (-5)', 2], ['Impede Movement (1 rank)', 1], ['Impede Movement (2 ranks)', 2]] as const) {
      const pricing = calculateComponentPricing({ id: 'environment', effectId: 'environment', ranks: 5, modifiers: [], variableCostOption: option }, environment, MODIFIER_DEFS);
      expect(pricing.total).toBe(cost * 5);
    }
  });
});
