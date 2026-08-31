import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { POWER_DEFS } from '../../entities/gameDataLoaders';
import { calcToughnessBonus, calcInitiativeBonus } from '../lib/mathEngine';
import { getEffectiveAbilityRank } from '../lib/abilityRanks';

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
  const absentAbilities = character.absentAbilities;

  return useMemo(() => {
    const { bonus: toughnessBonus, breakdown: toughnessBreakdown } =
      calcToughnessBonus(powers, advantages, POWER_DEFS);

    const stamina = getEffectiveAbilityRank(abilities, absentAbilities, 'sta');
    const agility = getEffectiveAbilityRank(abilities, absentAbilities, 'agl');
    const toughnessTotal = stamina + toughnessBonus;

    const { total: initiativeTotal, breakdown: initiativeBreakdown } =
      calcInitiativeBonus(agility, advantages, powers, POWER_DEFS);

    return {
      toughnessBonus,
      toughnessTotal,
      toughnessBreakdown,
      initiativeTotal,
      initiativeBreakdown,
    };
  }, [abilities, absentAbilities, powers, advantages]);
}
