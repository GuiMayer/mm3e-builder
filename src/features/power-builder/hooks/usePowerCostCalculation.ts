import { useMemo } from 'react';
import type {
  ICharacterPower,
  ICharacter,
  ICharacterPowerComponent,
  IPowerEffect,
  IModifierDef,
  IValidationRules,
} from '../../../entities/types';
import {
  calculateArrayCost,
  getComponentCostBreakdown,
  calcAlternateEffectCost,
  calcEquipmentEPCost,
  validateAECost,
  calcRemovableDiscount,
  calcPowerTotalCost,
} from '../../../shared/lib/mathEngine';
import { validateAttackEffect, type PLViolation } from '../../../shared/lib/validation';
import { getActiveValidationRules } from '../../../shared/lib/validationRules';
import { calcAttackBonus } from '../../../shared/lib/offenseSummary';
import { SKILL_DEFS, MODIFIER_DEFS } from '../../../entities/gameDataLoaders';

/* ================================================
   usePowerCostCalculation Hook
   Encapsulates all cost calculation logic for PowerBuilder
   ================================================ */

interface UsePowerCostCalculationProps {
  power: ICharacterPower;
  powerDefs: IPowerEffect[];
  allModDefs: IModifierDef[];
  powerLevel: number;
  validationRules?: Partial<IValidationRules>;
  character: ICharacter;
}

interface ComponentCostResult {
  total: number;
  breakdown: ReturnType<typeof getComponentCostBreakdown> | null;
}

export function usePowerCostCalculation({
  power,
  powerDefs,
  allModDefs,
  powerLevel,
  validationRules,
  character,
}: UsePowerCostCalculationProps) {
  // Calculate costs per component
  const componentCosts = useMemo<ComponentCostResult[]>(() => {
    return power.components.map((comp) => {
      const effectDef = powerDefs.find((d) => d.id === comp.effectId);
      if (!effectDef) return { total: 0, breakdown: null };
      const breakdown = getComponentCostBreakdown(comp, effectDef, allModDefs);
      return { total: breakdown.total, breakdown };
    });
  }, [power.components, powerDefs, allModDefs]);

  // Calculate main cost (sum of all component costs)
  const mainCost = useMemo(
    () => componentCosts.reduce((sum, c) => sum + c.total, 0),
    [componentCosts]
  );

  // Calculate array cost
  const dynamicCount = useMemo(
    () => power.alternateEffects.filter((a) => a.dynamic).length,
    [power.alternateEffects]
  );

  const arrayCost = useMemo(
    () => calculateArrayCost(mainCost, power.alternateEffects.length, dynamicCount, power.baseDynamic === true),
    [mainCost, power.alternateEffects.length, dynamicCount, power.baseDynamic]
  );

  // Activation is a power-level flat flaw. Keep the unadjusted array cost for
  // the component breakdown, then apply it before calculating Removable.
  const activationDiscount = power.activation === 'standard' ? 2 : power.activation === 'move' ? 1 : 0;
  const adjustedArrayCost = useMemo(
    () => Math.max(1, arrayCost - activationDiscount),
    [arrayCost, activationDiscount]
  );

  // Calculate removable discount
  const removableDiscount = useMemo(
    () => calcRemovableDiscount(adjustedArrayCost, power.removable),
    [adjustedArrayCost, power.removable]
  );

  // Use the shared total calculator so the builder always matches sheets,
  // exports and persisted powers.
  const totalCost = useMemo(
    () => calcPowerTotalCost(power, powerDefs, allModDefs),
    [power, powerDefs, allModDefs]
  );

  const equipmentEPCost = useMemo(
    () => calcEquipmentEPCost(power, powerDefs, allModDefs),
    [power, powerDefs, allModDefs]
  );

  // Calculate AE costs
  const aeCosts = useMemo(
    () => power.alternateEffects.map((ae) => calcAlternateEffectCost(ae, powerDefs, allModDefs)),
    [power.alternateEffects, powerDefs, allModDefs]
  );

  // Validate AE costs against main cost cap
  const aeValidations = useMemo(() => {
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforceAlternateEffectCap) {
      // When AE cap is disabled, all AEs are considered valid
      return aeCosts.map(() => ({ valid: true, overageBy: 0 }));
    }
    return aeCosts.map((cost) => validateAECost(cost, mainCost));
  }, [aeCosts, mainCost, validationRules]);

  // PL violation check: attack bonus + rank <= PL*2, or no-roll rank <= PL.
  const plViolation = useMemo(() => {
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforcePLLimits) return null;

    const validateComponent = (
      component: ICharacterPowerComponent,
      label: string
    ): PLViolation | null => {
      const effectDef = powerDefs.find((d) => d.id === component.effectId);
      if (!effectDef || effectDef.type !== 'attack') return null;

      const { value: attackBonus, isNoRoll } = calcAttackBonus(
        effectDef.range,
        label,
        component,
        character,
        SKILL_DEFS,
        MODIFIER_DEFS
      );

      if (isNoRoll) {
        if (component.ranks <= powerLevel) return null;
        return {
          rule: 'pl.attack',
          formula: `${label} [no-roll]: rank ${component.ranks} > PL ${powerLevel}`,
          actual: component.ranks,
          limit: powerLevel,
        };
      }

      const atkVal = attackBonus ?? 0;
      const violation = validateAttackEffect(atkVal, component.ranks, powerLevel);
      if (!violation) return null;
      return {
        ...violation,
        formula: `${label}: ${atkVal} + ${component.ranks} = ${atkVal + component.ranks} > ${powerLevel * 2}`,
      };
    };

    for (const component of power.components) {
      const violation = validateComponent(component, power.name || 'Power');
      if (violation) return violation;
    }

    for (const ae of power.alternateEffects) {
      for (const component of ae.components) {
        const label = `${power.name || 'Power'} (AE: ${ae.name || 'AE'})`;
        const violation = validateComponent(component, label);
        if (violation) return violation;
      }
    }

    return null;
  }, [character, power.name, power.components, power.alternateEffects, powerDefs, powerLevel, validationRules]);

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
  };
}
