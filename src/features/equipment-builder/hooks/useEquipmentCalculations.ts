import { useMemo } from 'react';
import type {
  IEquipmentItem,
  IPowerEffect,
  IModifierDef,
  IValidationRules,
} from '../../../entities/types';
import {
  getComponentCostBreakdown,
  calcAlternateEffectCost,
  validateAECost,
} from '../../../shared/lib/mathEngine';
import { getActiveValidationRules } from '../../../shared/lib/validationRules';

/* ================================================
   useEquipmentCalculations Hook
   Encapsulates all cost calculation logic for Equipment
   
   Equipment uses Equipment Points (EP) where 1 EP = 1 PP
   after the "Easily Removable" discount is applied.
   Equipment items use the same component structure as powers.
   ================================================ */

interface UseEquipmentCalculationsProps {
  item: IEquipmentItem;
  powerDefs: IPowerEffect[];
  allModDefs: IModifierDef[];
  validationRules?: Partial<IValidationRules>;
}

interface ComponentCostResult {
  total: number;
  breakdown: ReturnType<typeof getComponentCostBreakdown> | null;
}

export function useEquipmentCalculations({
  item,
  powerDefs,
  allModDefs,
  validationRules,
}: UseEquipmentCalculationsProps) {
  // Calculate costs per component
  const componentCosts = useMemo<ComponentCostResult[]>(() => {
    return item.components.map((comp) => {
      const effectDef = powerDefs.find((d) => d.id === comp.effectId);
      if (!effectDef) return { total: 0, breakdown: null };
      const breakdown = getComponentCostBreakdown(comp, effectDef, allModDefs);
      return { total: breakdown.total, breakdown };
    });
  }, [item.components, powerDefs, allModDefs]);

  // Calculate base cost (sum of all component costs)
  const baseCost = useMemo(
    () => componentCosts.reduce((sum, c) => sum + c.total, 0),
    [componentCosts]
  );

  // Equipment Points (EP) cost
  // Equipment is always "Easily Removable" (-2 flat per 5 PP)
  // Formula: EP = baseCost - floor(baseCost / 5) * 2
  const equipmentPoints = useMemo(() => {
    const discount = Math.floor(baseCost / 5) * 2;
    return Math.max(1, baseCost - discount);
  }, [baseCost]);

  // Calculate AE costs (if equipment has alternate effects, e.g., utility belt)
  const aeCosts = useMemo(
    () => (item.alternateEffects ?? []).map((ae) => calcAlternateEffectCost(ae, powerDefs, allModDefs)),
    [item.alternateEffects, powerDefs, allModDefs]
  );

  // Validate AE costs against base cost cap
  const aeValidations = useMemo(() => {
    const activeRules = getActiveValidationRules(validationRules);
    if (!activeRules.enforceAlternateEffectCap) {
      return aeCosts.map(() => ({ valid: true, overageBy: 0 }));
    }
    return aeCosts.map((cost) => validateAECost(cost, baseCost));
  }, [aeCosts, baseCost, validationRules]);

  // Total EP cost including array cost if there are alternate effects
  const totalEP = useMemo(() => {
    if (!item.alternateEffects || item.alternateEffects.length === 0) {
      return equipmentPoints;
    }
    
    // If there are alternate effects, add 1 EP per AE (flat cost for equipment arrays)
    const aeCount = item.alternateEffects.length;
    return equipmentPoints + aeCount;
  }, [equipmentPoints, item.alternateEffects]);

  return {
    componentCosts,
    baseCost,
    equipmentPoints,
    totalEP,
    aeCosts,
    aeValidations,
  };
}
