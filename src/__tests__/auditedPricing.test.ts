import { describe, expect, it } from 'vitest';
import type { IAlternateEffect, ICharacterPower, ICharacterPowerComponent } from '../entities/types';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import { calcComponentCost, calcPowerTotalCost, calcToughnessBonus } from '../shared/lib/mathEngine';

const effect = (id: string) => POWER_DEFS.find((definition) => definition.id === id)!;

function alternateEffects(count: number): IAlternateEffect[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `ae-${index}`,
    name: `Alternate ${index + 1}`,
    dynamic: false,
    notes: '',
    components: [{ id: `ae-component-${index}`, effectId: 'damage', ranks: 1, modifiers: [] }],
  }));
}

describe('audited community build pricing regressions', () => {
  it('prices Spider-Man Web-Shooters at 16 PP', () => {
    const power: ICharacterPower = {
      id: 'web-shooters',
      name: 'Web-Shooters',
      notes: '',
      removable: 'removable',
      alternateEffects: [],
      components: [
        { id: 'web-line', effectId: 'movement', ranks: 1, modifiers: [] },
        {
          id: 'spider-web', effectId: 'affliction', ranks: 6,
          modifiers: [
            { modifierId: 'increased_range', ranks: 1 },
            { modifierId: 'cumulative', ranks: 1, isPowerSpecific: true },
            { modifierId: 'extra_condition', ranks: 1, isPowerSpecific: true },
            { modifierId: 'limited_degree', ranks: 1, isPowerSpecific: true },
          ],
          variableCostOption: '2 degrees (add compelled/defenseless/disabled/exhausted/immobile/prone/stunned)',
        },
      ],
    };

    expect(calcPowerTotalCost(power, POWER_DEFS, MODIFIER_DEFS)).toBe(16);
  });

  it('prices the Death God Touch of Death array at 46 PP', () => {
    const power: ICharacterPower = {
      id: 'touch-of-death', name: 'Touch of Death', notes: '',
      components: [
        {
          id: 'damage', effectId: 'damage', ranks: 12,
          modifiers: [
            { modifierId: 'accurate', ranks: 2 },
            { modifierId: 'incurable', ranks: 1 },
            { modifierId: 'limited', ranks: 1 },
          ],
        },
        {
          id: 'affliction', effectId: 'affliction', ranks: 10,
          modifiers: [{ modifierId: 'cumulative', ranks: 1, isPowerSpecific: true }],
          variableCostOption: '3 degrees (add asleep/controlled/incapacitated/paralyzed/transformed/unaware)',
        },
        {
          id: 'weaken', effectId: 'weaken', ranks: 10,
          modifiers: [{ modifierId: 'incurable', ranks: 1, isPowerSpecific: true }],
        },
      ],
      alternateEffects: alternateEffects(6),
    };

    expect(calcPowerTotalCost(power, POWER_DEFS, MODIFIER_DEFS)).toBe(46);
  });

  it('charges all seven ranks of Teleport Increased Mass', () => {
    const component: ICharacterPowerComponent = {
      id: 'teleport', effectId: 'teleport', ranks: 10,
      modifiers: [
        { modifierId: 'accurate_teleport', ranks: 1, isPowerSpecific: true },
        { modifierId: 'easy', ranks: 1, isPowerSpecific: true },
        { modifierId: 'extended', ranks: 1, isPowerSpecific: true },
        { modifierId: 'change_direction', ranks: 1, isPowerSpecific: true },
        { modifierId: 'change_velocity', ranks: 1, isPowerSpecific: true },
        { modifierId: 'turnabout', ranks: 1, isPowerSpecific: true },
        { modifierId: 'increased_mass', ranks: 7, isPowerSpecific: true },
      ],
    };

    expect(calcComponentCost(component, effect('teleport'), MODIFIER_DEFS)).toBe(60);
  });

  it('prices explicit and legacy Variable Action tiers', () => {
    const variable = effect('variable');
    const component = (ranks: number, actionRanks: number, subtypeId?: string): ICharacterPowerComponent => ({
      id: `${ranks}-${actionRanks}-${subtypeId ?? 'legacy'}`,
      effectId: 'variable',
      ranks,
      modifiers: [{
        modifierId: 'action_variable',
        ranks: actionRanks,
        isPowerSpecific: true,
        ...(subtypeId ? { options: { subtypeId } } : {}),
      }],
    });

    expect(calcComponentCost(component(4, 1, 'move'), variable, MODIFIER_DEFS)).toBe(32);
    expect(calcComponentCost(component(6, 1, 'free'), variable, MODIFIER_DEFS)).toBe(54);
    expect(calcComponentCost(component(2, 1, 'reaction'), variable, MODIFIER_DEFS)).toBe(20);
    expect(calcComponentCost(component(10, 2), variable, MODIFIER_DEFS)).toBe(90);

    expect(calcComponentCost({
      ...component(10, 1, 'free'),
      id: 'absorbing-man',
      modifiers: [
        { modifierId: 'limited_variable', ranks: 1, isPowerSpecific: true },
        { modifierId: 'action_variable', ranks: 1, isPowerSpecific: true, options: { subtypeId: 'free' } },
      ],
    }, variable, MODIFIER_DEFS)).toBe(80);
  });

  it('only multiplies per-rank modifier ranks for definitions marked repeatable', () => {
    const damage = effect('damage');
    expect(calcComponentCost({
      id: 'limited-twice', effectId: 'damage', ranks: 10,
      modifiers: [{ modifierId: 'limited', ranks: 2 }],
    }, damage, MODIFIER_DEFS)).toBe(4);

    expect(calcComponentCost({
      id: 'tiring-legacy-ranks', effectId: 'damage', ranks: 10,
      modifiers: [{ modifierId: 'tiring', ranks: 3 }],
    }, damage, MODIFIER_DEFS)).toBe(5);
  });

  it('represents Impervious Toughness without increasing Toughness itself', () => {
    const component: ICharacterPowerComponent = {
      id: 'impervious-toughness',
      effectId: 'impervious-resistance',
      ranks: 12,
      modifiers: [],
      fieldValues: { resistance: 'toughness' },
    };
    const power: ICharacterPower = {
      id: 'rocky-form',
      name: 'Rocky Form',
      notes: '',
      components: [component],
      alternateEffects: [],
    };

    expect(calcComponentCost(component, effect('impervious-resistance'), MODIFIER_DEFS)).toBe(12);
    expect(calcToughnessBonus([power], [], POWER_DEFS)).toEqual({ bonus: 0, breakdown: [] });
  });
});
