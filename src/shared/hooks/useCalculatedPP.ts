import { useMemo } from 'react';
import { useCharStore } from '../../store/charStore';
import { useAppStore } from '../../store/appStore';
import {
  calculateAbilitiesCost,
  calculateDefensesCost,
  calculateSkillsCost,
  calculateAdvantagesCost,
  calcPowerTotalCost,
  getComponentCostBreakdown,
} from '../lib/mathEngine';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { getActiveValidationRules } from '../lib/validationRules';
import type { IEquipmentItem } from '../../entities/types';

/**
 * Calculate total Equipment Points (EP) used by all equipment items.
 * Equipment uses the "Easily Removable" discount: EP = baseCost - floor(baseCost / 5) * 2
 */
function calculateTotalEquipmentPoints(equipment: IEquipmentItem[]): number {
  return equipment.reduce((total, item) => {
    // Calculate base cost from components using the same logic as useEquipmentCalculations
    const baseCost = (item.components || []).reduce((sum, comp) => {
      const effectDef = POWER_DEFS.find((d) => d.id === comp.effectId);
      if (!effectDef) return sum;
      
      const breakdown = getComponentCostBreakdown(comp, effectDef, MODIFIER_DEFS);
      return sum + breakdown.total;
    }, 0);
    
    // Apply Easily Removable discount
    const discount = Math.floor(baseCost / 5) * 2;
    const equipmentPoints = Math.max(1, baseCost - discount);
    
    // Add alternate effect costs (1 EP per AE)
    const aeCount = (item.alternateEffects || []).length;
    
    return total + equipmentPoints + aeCount;
  }, 0);
}

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

    // F-15: Equipment PP Limit validation
    // Calculate total EP used and compare against Equipment advantage limit
    const totalEPUsed = calculateTotalEquipmentPoints(character.equipment || []);
    const equipmentAdvantage = character.advantages.find((adv) => adv.advantageId === 'equipment');
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
  }, [character, validationRules]);
}
