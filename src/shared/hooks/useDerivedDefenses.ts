import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import { calcToughnessBonus, calcInitiativeBonus } from '../lib/mathEngine';

/**
 * Derives Toughness total and Initiative bonus from the current character state.
 * Thin React wrapper around the pure functions in mathEngine.ts.
 * The PDF generator calls the pure functions directly.
 */
export function useDerivedDefenses() {
  const { character } = useActiveCharacter();
  const abilities = character.abilities;
  const powers = character.powers;
  const advantages = character.advantages;

  return useMemo(() => {
    const { bonus: toughnessBonus, breakdown: toughnessBreakdown } =
      calcToughnessBonus(powers, advantages, POWER_DEFS);

    const toughnessTotal = abilities.sta + toughnessBonus;

    const { total: initiativeTotal, breakdown: initiativeBreakdown } =
      calcInitiativeBonus(abilities.agl, advantages, powers, POWER_DEFS);

    return {
      toughnessBonus,
      toughnessTotal,
      toughnessBreakdown,
      initiativeTotal,
      initiativeBreakdown,
    };
  }, [abilities, powers, advantages]);
}
