import { useMemo } from 'react';
import { getPricingStrength } from '../../../shared/lib/pricingStrength';
import { useResourcesStore } from '../../../store/resourcesStore';
import type {
  ICharacterPower,
  ICharacter,
  IPowerEffect,
  IModifierDef,
  IValidationRules,
} from '../../../entities/types';
import {
  type ComponentCostBreakdown,
  validateAECost,
} from '../../../shared/lib/mathEngine';
import { validateAttackEffect } from '../../../shared/lib/validation';
import { getActiveValidationRules } from '../../../shared/lib/validationRules';
import { buildTargetedEffectProfiles } from '../../../shared/lib/offenseSummary';
import { createPowerPricingSelector } from '../powerBuilderModel';
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
  attackBonusOverride?: number;
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
  attackBonusOverride,
}: UsePowerCostCalculationProps) {
  const resources = useResourcesStore(state => state.resources);
  const strength = getPricingStrength({ ...character, powers: [...character.powers.filter(item => item.id !== power.id), power] }, resources);
  const selectPricing = useMemo(() => createPowerPricingSelector(powerDefs, modifierDefs, strength), [powerDefs, modifierDefs, strength]);
  const pricing = selectPricing(power);
  const componentCosts = pricing.components as ComponentCostResult[];
  const mainCost = pricing.mainCost;
  const arrayCost = pricing.arrayCost;
  const activationDiscount = pricing.activationDiscount;
  const removableDiscount = pricing.removableDiscount;
  const totalCost = pricing.total;
  const equipmentEPCost = pricing.equipmentTotal;
  const aeCosts = useMemo(() => pricing.alternateEffects.map((alternateEffect) => alternateEffect.total), [pricing]);

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
  const plViolation = useMemo(() => {
    return getPowerPLViolation({ validationRules, character, power, powerDefs, modifierDefs, powerLevel, attackBonusOverride });
  }, [validationRules, character, power, powerDefs, modifierDefs, powerLevel, attackBonusOverride]);

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

function getPowerPLViolation({ validationRules, character, power, powerDefs, modifierDefs, powerLevel, attackBonusOverride }: UsePowerCostCalculationProps) {
  const activeRules = getActiveValidationRules(validationRules);
  if (!activeRules.enforcePLLimits) return null;

  const profiles = buildTargetedEffectProfiles(
    { ...character, powers: [...character.powers.filter(item => item.id !== power.id), power] },
    powerDefs,
    SKILL_DEFS,
    [],
    modifierDefs.length > 0 ? modifierDefs : MODIFIER_DEFS, undefined, [], false
  ).filter((profile) => profile.sourceType === 'power' && [...power.components, ...power.alternateEffects.flatMap(item => item.components)].some(component => component.id === profile.componentId) && profile.causesResistance && profile.effectRank !== null);

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

    const attackBonus = attackBonusOverride ?? profile.bonusValue ?? 0;
    const violation = validateAttackEffect(attackBonus, rank, powerLevel);
    if (violation) {
      return {
        ...violation,
        formula: `${label}: ${attackBonus} + ${rank} = ${attackBonus + rank} > ${powerLevel * 2}`,
      };
    }
  }

  return null;
}
