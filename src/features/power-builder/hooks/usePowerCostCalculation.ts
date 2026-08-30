import { useMemo } from 'react';
import type {
  ICharacterPower,
  ICharacter,
  IPowerEffect,
  IModifierDef,
  IValidationRules,
} from '../../../entities/types';
import {
  type ComponentCostBreakdown,
  calculatePowerPricing,
  validateAECost,
} from '../../../shared/lib/mathEngine';
import { validateAttackEffect } from '../../../shared/lib/validation';
import { getActiveValidationRules } from '../../../shared/lib/validationRules';
import { buildTargetedEffectProfiles } from '../../../shared/lib/offenseSummary';
import { SKILL_DEFS, MODIFIER_DEFS } from '../../../entities/gameDataLoaders';

/* ================================================
   usePowerCostCalculation Hook
   Encapsulates all cost calculation logic for PowerBuilder
   ================================================ */

interface UsePowerCostCalculationProps {
  power: ICharacterPower;
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  powerLevel: number;
  validationRules?: Partial<IValidationRules>;
  character: ICharacter;
}

interface ComponentCostResult {
  total: number;
  breakdown: ComponentCostBreakdown | null;
}

export function usePowerCostCalculation({
  power,
  powerDefs,
  modifierDefs,
  powerLevel,
  validationRules,
  character,
}: UsePowerCostCalculationProps) {
  const pricing = useMemo(
    () => calculatePowerPricing(power, powerDefs, modifierDefs),
    [power, powerDefs, modifierDefs]
  );
  const componentCosts = pricing.components as ComponentCostResult[];
  const mainCost = pricing.mainCost;
  const arrayCost = pricing.arrayCost;
  const activationDiscount = pricing.activationDiscount;
  const removableDiscount = pricing.removableDiscount;
  const totalCost = pricing.total;
  const equipmentEPCost = pricing.equipmentTotal;
  const aeCosts = pricing.alternateEffects.map((alternateEffect) => alternateEffect.total);

  // Validate AE costs against main cost cap
  const aeValidations = useMemo(() => {
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforceAlternateEffectCap) {
      // When AE cap is disabled, all AEs are considered valid
      return aeCosts.map(() => ({ valid: true, overageBy: 0 }));
    }
    return aeCosts.map((cost) => validateAECost(cost, mainCost));
  }, [aeCosts, mainCost, validationRules]);

  // PL validation uses the same component classification as Targeted Effects.
  const plViolation = (() => {
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforcePLLimits) return null;

    const profiles = buildTargetedEffectProfiles(
      { ...character, powers: [power], equipment: [] },
      powerDefs,
      SKILL_DEFS,
      [],
      modifierDefs.length > 0 ? modifierDefs : MODIFIER_DEFS
    ).filter((profile) => profile.sourceType === 'power' && profile.causesResistance && profile.effectRank !== null);

    for (const profile of profiles) {
      const rank = profile.effectRank;
      if (rank === null) continue;
      const label = profile.name || profile.componentName || 'Power';
      if (!profile.requiresAttackCheck) {
        if (rank <= powerLevel) continue;
        return {
          rule: 'pl.attack',
          formula: `${label} [no attack roll]: rank ${rank} > PL ${powerLevel}`,
          actual: rank,
          limit: powerLevel,
        };
      }

      const attackBonus = profile.bonusValue ?? 0;
      const violation = validateAttackEffect(attackBonus, rank, powerLevel);
      if (violation) {
        return {
          ...violation,
          formula: `${label}: ${attackBonus} + ${rank} = ${attackBonus + rank} > ${powerLevel * 2}`,
        };
      }
    }

    return null;
  })();

  return {
    componentCosts,
    mainCost,
    arrayCost,
    activationDiscount,
    removableDiscount,
    totalCost,
    equipmentEPCost,
    aeCosts,
    aeValidations,
    plViolation,
    pricingDiagnostics: pricing.diagnostics,
  };
}
