import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcComponentCost,
  calculateArrayCost,
} from '../lib/mathEngine';
import type { IModifierDef } from '../../entities/types';
import powerDefs from '../../data/powers.json';
import modifierDefs from '../../data/modifiers.json';

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

    // Sum power costs using the math engine
    const powersCost = character.powers.reduce((sum, p) => {
      const mainCost = p.components.reduce((csum, comp) => {
        const def = powerDefs.find((d) => d.id === comp.effectId);
        if (!def) return csum;
        return csum + calcComponentCost(comp, def as unknown as Parameters<typeof calcComponentCost>[1], modifierDefs as IModifierDef[]);
      }, 0);
      const dynamicCount = p.alternateEffects.filter((a) => a.dynamic).length;
      return sum + calculateArrayCost(mainCost, p.alternateEffects.length, dynamicCount);
    }, 0);

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
