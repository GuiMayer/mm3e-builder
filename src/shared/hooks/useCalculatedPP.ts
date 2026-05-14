import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
} from '../lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { getActiveValidationRules } from '../lib/validationRules';

/**
 * Hook that reactively calculates total PP spent across all sections.
 * When enforcePPBudget is disabled, isOverBudget will always be false.
 */
export function useCalculatedPP() {
  const character = useCharStore((s) => s.character);
  const validationRules = useAppStore((s) => s.validationRules);

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
    };
  }, [character, validationRules]);
}

/**
 * Hook that reactively calculates total PP spent across all sections.
 * When enforcePPBudget is disabled, isOverBudget will always be false.
 * 
 * Optimized: Uses specific selectors instead of subscribing to entire character object
 * to prevent unnecessary re-renders when unrelated parts change.
 */
export function useCalculatedPP() {
  // Use specific selectors instead of subscribing to the entire character object
  const powerLevel = useCharStore((s) => s.character.header.powerLevel);
  const abilities = useCharStore((s) => s.character.abilities);
  const absentAbilities = useCharStore((s) => s.character.absentAbilities);
  const defenses = useCharStore((s) => s.character.defenses);
  const skills = useCharStore((s) => s.character.skills);
  const advantages = useCharStore((s) => s.character.advantages);
  const powers = useCharStore((s) => s.character.powers);
  const equipment = useCharStore((s) => s.character.equipment);
  const campaignMode = useCharStore((s) => s.character.campaignMode);
  const ppLog = useCharStore((s) => s.character.ppLog);
  const validationRules = useAppStore((s) => s.validationRules);

  return useMemo(() => {
    const abilitiesCost = calculateAbilitiesCost(abilities, absentAbilities);
    const defensesCost = calculateDefensesCost(defenses);
    const totalSkillRanks = skills.reduce((sum, s) => sum + s.ranks, 0);
    const skillsCost = calculateSkillsCost(totalSkillRanks);
    const advantagesCost = calculateAdvantagesCost(advantages);

    const powersCost = powers.reduce(
      (sum, p) => sum + calcPowerTotalCost(p, POWER_DEFS, MODIFIER_DEFS),
      0
    );

    const totalSpent = abilitiesCost + defensesCost + skillsCost + advantagesCost + powersCost;
    // F-17: when campaign mode is on, add PP earned from the log
    const ppEarned = campaignMode
      ? (ppLog ?? []).reduce((s, e) => s + e.amount, 0)
      : 0;
    const totalAvailable = powerLevel * 15 + ppEarned;
    const remaining = totalAvailable - totalSpent;
    
    // Check if PP budget enforcement is enabled
    const activeRules = getActiveValidationRules(validationRules);
    const isOverBudget = activeRules.enforcePPBudget && remaining < 0;
    const isBudgetEnforced = activeRules.enforcePPBudget;

    // F-15: Equipment PP Limit validation
    // Calculate total EP used and compare against Equipment advantage limit
    const totalEPUsed = calculateTotalEquipmentPoints(equipment || []);
    const equipmentAdvantage = advantages.find((adv) => adv.advantageId === 'equipment');
    const equipmentRanks = equipmentAdvantage?.ranks || 0;
    const equipmentEPLimit = equipmentRanks * 5;
    const isOverEquipmentLimit = activeRules.enforceEquipmentPPLimit && totalEPUsed > equipmentEPLimit;
    const equipmentEPRemaining = equipmentEPLimit - totalEPUsed;

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
      // Equipment validation
      totalEPUsed,
      equipmentEPLimit,
      equipmentEPRemaining,
      isOverEquipmentLimit,
    };
  }, [
    powerLevel,
    abilities,
    absentAbilities,
    defenses,
    skills,
    advantages,
    powers,
    equipment,
    campaignMode,
    ppLog,
    validationRules,
  ]);
}
