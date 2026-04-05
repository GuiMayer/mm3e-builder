import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
} from '../lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';

/**
 * Hook that reactively calculates total PP spent across all sections.
 */
export function useCalculatedPP() {
  const character = useCharStore((s) => s.character);

  return useMemo(() => {
    const abilitiesCost = calculateAbilitiesCost(
      character.abilities,
      character.absentAbilities
    );
    const defensesCost = calculateDefensesCost(character.defenses);
    const totalSkillRanks = character.skills.reduce((sum, s) => sum + s.ranks, 0);
    const skillsCost = calculateSkillsCost(totalSkillRanks);
    const advantagesCost = calculateAdvantagesCost(character.advantages);

    const powersCost = character.powers.reduce(
      (sum, p) => sum + calcPowerTotalCost(p, POWER_DEFS, MODIFIER_DEFS),
      0
    );

    const totalSpent = abilitiesCost + defensesCost + skillsCost + advantagesCost + powersCost;
    const totalAvailable = character.header.powerLevel * 15;
    const remaining = totalAvailable - totalSpent;

    return {
      abilitiesCost,
      defensesCost,
      skillsCost,
      advantagesCost,
      powersCost,
      totalSpent,
      totalAvailable,
      remaining,
    };
  }, [character]);
}
