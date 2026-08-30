import { describe, expect, it } from 'vitest';
import type {
  IAlternateEffect,
  IAppliedModifier,
  ICharacterPower,
  ICharacterPowerComponent,
} from '../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import {
  calcComponentCost,
  calcEquipmentEPCost,
  calcPowerTotalCost,
  calculateComponentPricing,
  calculatePowerPricing,
  getComponentCostBreakdown,
} from '../shared/lib/mathEngine';

function component(
  effectId: string,
  ranks: number,
  modifiers: IAppliedModifier[] = [],
  variableCostOption?: string
): ICharacterPowerComponent {
  return {
    id: `component-${effectId}`,
    effectId,
    ranks,
    modifiers,
    variableCostOption,
  };
}

function power(
  main: ICharacterPowerComponent,
  alternateEffects: IAlternateEffect[] = []
): ICharacterPower {
  return {
    id: 'power-id',
    name: 'Test power',
    components: [main],
    alternateEffects,
    notes: '',
  };
}

describe('canonical pricing parity', () => {
  it('uses a power-specific modifier on every calculation surface', () => {
    const flight = POWER_DEFS.find((definition) => definition.id === 'flight');
    expect(flight).toBeDefined();
    const value = component('flight', 5, [{
      modifierId: 'continuous_flight',
      ranks: 1,
      isPowerSpecific: true,
    }]);

    const pricing = calculateComponentPricing(value, flight!, MODIFIER_DEFS);

    expect(pricing.total).toBe(15);
    expect(calcComponentCost(value, flight!, MODIFIER_DEFS)).toBe(pricing.total);
    expect(getComponentCostBreakdown(value, flight!, MODIFIER_DEFS)).toEqual(pricing);
    expect(calcPowerTotalCost(power(value), POWER_DEFS, MODIFIER_DEFS)).toBe(15);
  });

  it('recovers a unique power-specific modifier from legacy data without a source marker', () => {
    const flight = POWER_DEFS.find((definition) => definition.id === 'flight');
    expect(flight).toBeDefined();
    const value = component('flight', 5, [{
      modifierId: 'continuous_flight',
      ranks: 1,
    }]);

    expect(calculateComponentPricing(value, flight!, MODIFIER_DEFS).total).toBe(15);
  });

  it('prices partial per-rank modifiers by their affected rank groups', () => {
    const damage = POWER_DEFS.find((definition) => definition.id === 'damage');
    expect(damage).toBeDefined();
    const value = component('damage', 7, [
      { modifierId: 'increased_range', ranks: 1, affectedRanks: 7 },
      { modifierId: 'area', ranks: 1, option: 'Burst', affectedRanks: 4 },
    ]);

    const pricing = calculateComponentPricing(value, damage!, MODIFIER_DEFS);

    expect(pricing.rankGroups.map((group) => [group.rankCount, group.costPerRank])).toEqual([
      [4, 3],
      [3, 2],
    ]);
    expect(pricing.rankCost).toBe(18);
    expect(pricing.total).toBe(18);
  });

  it('advances printed fractional costs through discrete MM3e ratio tiers', () => {
    const enhancedTrait = POWER_DEFS.find(
      (definition) => definition.id === 'enhanced-trait'
    );
    expect(enhancedTrait).toBeDefined();
    const value = component(
      'enhanced-trait',
      6,
      [{ modifierId: 'limited', ranks: 1 }],
      'Enhanced Skill'
    );

    const pricing = calculateComponentPricing(value, enhancedTrait!, MODIFIER_DEFS);

    expect(pricing.isFractional).toBe(true);
    expect(pricing.ranksPerPP).toBe(3);
    expect(pricing.total).toBe(2);
  });

  it('applies per-rank flaws to the ranks represented by a fixed package', () => {
    const immunity = POWER_DEFS.find((definition) => definition.id === 'immunity');
    expect(immunity).toBeDefined();
    const packageName = immunity!.variableCost!.options.find(
      (option) => option.cost === 10
    )!.name;
    const value = component('immunity', 1, [{
      modifierId: 'half_effect',
      ranks: 1,
      isPowerSpecific: true,
    }], packageName);

    expect(calculateComponentPricing(value, immunity!, MODIFIER_DEFS).total).toBe(5);
  });

  it('uses base Dynamic and Activation consistently for Equipment Points', () => {
    const alternate: IAlternateEffect = {
      id: 'alternate-id',
      name: 'Alternate',
      components: [component('damage', 10)],
      dynamic: true,
      notes: '',
    };
    const item = {
      ...power(component('damage', 10), [alternate]),
      baseDynamic: true,
      activation: 'standard' as const,
    };

    const pricing = calculatePowerPricing(item, POWER_DEFS, MODIFIER_DEFS);

    expect(pricing.arrayCost).toBe(13);
    expect(pricing.activationDiscount).toBe(2);
    expect(pricing.equipmentTotal).toBe(11);
    expect(calcEquipmentEPCost(item, POWER_DEFS, MODIFIER_DEFS)).toBe(11);
  });

  it('reports invalid references at runtime without changing serialized data', () => {
    const damage = POWER_DEFS.find((definition) => definition.id === 'damage');
    expect(damage).toBeDefined();
    const value = component('damage', 5, [{ modifierId: 'missing-modifier', ranks: 1 }]);
    const before = JSON.stringify(value);

    const pricing = calculateComponentPricing(value, damage!, MODIFIER_DEFS);

    expect(pricing.diagnostics).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'unknown-modifier', id: 'missing-modifier' }),
    ]));
    expect(JSON.stringify(value)).toBe(before);
  });
});
