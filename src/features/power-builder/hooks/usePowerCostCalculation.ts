import { useMemo } from 'react';
import type {
  ICharacterPower,
  IPowerEffect,
  IModifierDef,
} from '../../../entities/types';
import {
  calculateArrayCost,
  getComponentCostBreakdown,
  calcAlternateEffectCost,
  validateAECost,
  calcRemovableDiscount,
} from '../../../shared/lib/mathEngine';
import { validateAttackEffect } from '../../../shared/lib/validation';

/* ================================================
   usePowerCostCalculation Hook
   Encapsulates all cost calculation logic for PowerBuilder
   ================================================ */

interface UsePowerCostCalculationProps {
  power: ICharacterPower;
  powerDefs: IPowerEffect[];
  allModDefs: IModifierDef[];
  powerLevel: number;
  strictMode: boolean;
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
  strictMode,
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
    () => calculateArrayCost(mainCost, power.alternateEffects.length, dynamicCount),
    [mainCost, power.alternateEffects.length, dynamicCount]
  );

  // Calculate removable discount
  const removableDiscount = useMemo(
    () => calcRemovableDiscount(mainCost, power.removable),
    [mainCost, power.removable]
  );

  // Calculate total cost
  const totalCost = useMemo(
    () => Math.max(0, arrayCost - removableDiscount),
    [arrayCost, removableDiscount]
  );

  // Calculate AE costs
  const aeCosts = useMemo(
    () => power.alternateEffects.map((ae) => calcAlternateEffectCost(ae, powerDefs, allModDefs)),
    [power.alternateEffects, powerDefs, allModDefs]
  );

  // Validate AE costs against main cost cap
  const aeValidations = useMemo(
    () => aeCosts.map((cost) => validateAECost(cost, mainCost)),
    [aeCosts, mainCost]
  );

  // TD-5: Strict Mode PL violation check
  // validateAttackEffect: attack + highest damage rank <= PL*2
  const plViolation = useMemo(() => {
    if (!strictMode) return null;
    // Heuristic: check the highest-rank damage component against PL*2
    const highestRank = power.components.reduce((max, c) => Math.max(max, c.ranks), 0);
    const attackBonus = 0; // Power builder doesn't track attack bonus, defaulting to 0
    return validateAttackEffect(attackBonus, highestRank, powerLevel);
  }, [strictMode, powerLevel, power.components]);

  return {
    componentCosts,
    mainCost,
    arrayCost,
    removableDiscount,
    totalCost,
    aeCosts,
    aeValidations,
    plViolation,
  };
}
