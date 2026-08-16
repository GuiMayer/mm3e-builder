import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { useAppStore } from '../../store/appStore';
import { useResourcesStore } from '../../store/resourcesStore';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
  calcEquipmentEPCost,
} from '../lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { getActiveValidationRules } from '../lib/validationRules';
import { getCharacterResourceEPUsed } from '../lib/resourceCalculations';

/**
 * Hook that reactively calculates total PP spent across all sections.
 * When enforcePPBudget is disabled, isOverBudget will always be false.
 * Also tracks Equipment Points (EP) budget from the Equipment advantage.
 */
export function useCalculatedPP() {
  const { character } = useActiveCharacter();
  const validationRules = useAppStore((s) => s.validationRules);
  const resources = useResourcesStore((s) => s.resources);

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
    // F-17: when campaign mode is on, add PP earned from the log
    const ppEarned = character.campaignMode
      ? (character.ppLog ?? []).reduce((s, e) => s + e.amount, 0)
      : 0;
    const totalAvailable = character.header.powerLevel * 15 + ppEarned;
    const remaining = totalAvailable - totalSpent;
    
    // Check if PP budget enforcement is enabled
    const activeRules = getActiveValidationRules(validationRules);
    const isOverBudget = activeRules.enforcePPBudget && remaining < 0;
    const isBudgetEnforced = activeRules.enforcePPBudget;

    // F-15: Equipment Points (EP) budget tracking
    const equipmentAdv = character.advantages.find((a) => a.advantageId === 'equipment');
    const equipmentRanks = equipmentAdv?.ranks ?? 0;
    const equipmentEPLimit = equipmentRanks * 5;
    const equipmentItems = character.equipment ?? [];
    const legacyEPUsed = equipmentItems.reduce(
      (sum, item) => sum + calcEquipmentEPCost(item, POWER_DEFS, MODIFIER_DEFS),
      0
    );
    const totalEPUsed = legacyEPUsed + getCharacterResourceEPUsed(character, resources);
  // Resources never reject an association. Equipment spending is surfaced as a
  // warning only while budget validation is active (and the optional EP rule
  // itself is enabled), matching the rest of the permissive sheet workflow.
  const isOverEquipmentLimit = activeRules.enforcePPBudget
    && activeRules.enforceEquipmentPPLimit
    && totalEPUsed > equipmentEPLimit;

    return {
      abilitiesCost,
      defensesCost,
      skillsCost,
      advantagesCost,
      powersCost,
      totalSpent,
      totalAvailable,
      remaining,
      isOverBudget,
      isBudgetEnforced,
      // Equipment EP tracking
      equipmentRanks,
      equipmentEPLimit,
      totalEPUsed,
      isOverEquipmentLimit,
    };
  }, [character, resources, validationRules]);
}
