import { useMemo } from 'react';
import { useActiveCharacter } from './useActiveCharacter';
import { useAppStore } from '../../store/appStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { getActiveValidationRules } from '../lib/validationRules';
import { calculateCharacterPointSummary } from '../lib/pointSummary';

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
    const summary = calculateCharacterPointSummary(
      character,
      resources,
      POWER_DEFS,
      MODIFIER_DEFS
    );
    
    // Check if PP budget enforcement is enabled
    const activeRules = getActiveValidationRules(validationRules);
    const isOverBudget = activeRules.enforcePPBudget && summary.remaining < 0;
    const isBudgetEnforced = activeRules.enforcePPBudget;

    // F-15: Equipment Points (EP) budget tracking
    // Resources never reject an association. Equipment spending is surfaced as
    // a warning only while budget validation is active.
    const isOverEquipmentLimit = activeRules.enforcePPBudget
      && activeRules.enforceEquipmentPPLimit
      && summary.totalEPUsed > summary.equipmentEPLimit;

    return {
      ...summary,
      isOverBudget,
      isBudgetEnforced,
      isOverEquipmentLimit,
    };
  }, [character, resources, validationRules]);
}
