/* ================================================
   Math Engine — Pure calculation functions
   Receives data via interfaces, returns numbers.
   Never imports stores directly — respects DIP.
   ================================================ */

import type {
  IAppliedModifier,
  IModifierDef,
  IDefenses,
  ICharacterPower,
  ICharacterPowerComponent,
  IAlternateEffect,
  IPowerEffect,
} from '../../entities/types';

/**
 * Calculate the cost contributed by a single applied modifier to one component.
 * Returns the point amount (positive = extra, negative = flaw).
 */
export function calcModifierCost(applied: IAppliedModifier, def: IModifierDef): number {
  if (def.costType === 'flat') return def.costValue;
  if (def.costType === 'flat_ranked') return def.costValue * applied.ranks;
  // per_rank: contributes to the per-rank total, not a fixed amount here
  return 0;
}

/**
 * Calculate the per-rank cost modifier sum for a component.
 * Formula: baseCost + sum(per_rank extras) - sum(per_rank flaw absolute values)
 * If result <= 0, returns fractional info.
 */
export function calculateCostPerRank(
  baseCost: number,
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): { costPerRank: number; isFractional: boolean; ranksPerPP: number } {
  let perRankSum = baseCost;

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def || def.costType !== 'per_rank') continue;
    perRankSum += def.costValue;
  }

  if (perRankSum >= 1) {
    return { costPerRank: perRankSum, isFractional: false, ranksPerPP: 1 };
  }

  // Fractional: 1 PP per N ranks
  const ranksPerPP = 2 - perRankSum;
  return { costPerRank: 1, isFractional: true, ranksPerPP };
}

/**
 * Calculate the flat modifier sum for a set of applied modifiers.
 * Handles both 'flat' (fixed) and 'flat_ranked' (cost × modifier ranks).
 */
export function calculateFlatCost(
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): number {
  let flatSum = 0;

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def) continue;
    if (def.costType === 'flat') flatSum += def.costValue;
    else if (def.costType === 'flat_ranked') flatSum += def.costValue * applied.ranks;
  }

  return flatSum;
}

/**
 * Calculate total PP cost for a single power component.
 * Formula: ((baseCost + per_rank_extras − per_rank_flaws) × ranks) + flat_mods
 * Minimum cost: 1 PP.
 */
export function calcComponentCost(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  modifierDefs: IModifierDef[]
): number {
  const { costPerRank, isFractional, ranksPerPP } = calculateCostPerRank(
    effectDef.baseCost,
    component.modifiers,
    modifierDefs
  );

  let rankCost: number;
  if (isFractional) {
    rankCost = Math.ceil(component.ranks / ranksPerPP);
  } else {
    rankCost = costPerRank * component.ranks;
  }

  const flatCost = calculateFlatCost(component.modifiers, modifierDefs);
  return Math.max(1, rankCost + flatCost);
}

/**
 * Legacy compatibility wrapper.
 * Use calcComponentCost for new code.
 */
export function calculatePowerCost(
  baseCost: number,
  ranks: number,
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): number {
  const { costPerRank, isFractional, ranksPerPP } = calculateCostPerRank(
    baseCost,
    appliedModifiers,
    modifierDefs
  );

  let rankCost: number;
  if (isFractional) {
    rankCost = Math.ceil(ranks / ranksPerPP);
  } else {
    rankCost = costPerRank * ranks;
  }

  const flatCost = calculateFlatCost(appliedModifiers, modifierDefs);
  return Math.max(1, rankCost + flatCost);
}

/**
 * Calculate the total cost of a power array (components + alternate effects).
 * Main cost = sum of all components.
 * Array cost = main cost + 1 per static alt + 2 per dynamic alt.
 */
export function calculateArrayCost(
  mainPowerCost: number,
  alternateEffectCount: number,
  dynamicCount: number
): number {
  const staticAlts = alternateEffectCount - dynamicCount;
  return mainPowerCost + staticAlts * 1 + dynamicCount * 2;
}

/**
 * Calculate the total PP cost of an Alternate Effect (sum of all its components).
 * An AE can have multiple components (Linked Powers within a single array slot).
 * Minimum cost: 1 PP.
 */
export function calcAlternateEffectCost(
  ae: IAlternateEffect,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): number {
  const raw = ae.components.reduce((sum, comp) => {
    const effectDef = powerDefs.find((d) => d.id === comp.effectId);
    if (!effectDef) return sum;
    return sum + calcComponentCost(comp, effectDef, modifierDefs);
  }, 0);
  return Math.max(1, raw);
}

/**
 * Validate whether an Alternate Effect conforms to the array cap rule.
 * Rule: An AE cannot cost more PP than the base power.
 * Returns valid flag and how many PP over the cap (for precise user messaging).
 */
export function validateAECost(
  aeCost: number,
  mainCost: number
): { valid: boolean; overageBy: number } {
  return {
    valid: aeCost <= mainCost,
    overageBy: Math.max(0, aeCost - mainCost),
  };
}

/**
 * Get a breakdown of a component's cost for display in the UI.
 */
export function getComponentCostBreakdown(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  modifierDefs: IModifierDef[]
): {
  base: number;
  perRankExtras: number;
  perRankFlaws: number;
  costPerRank: number;
  rankCost: number;
  flatCost: number;
  total: number;
  isFractional: boolean;
  ranksPerPP: number;
} {
  let perRankExtras = 0;
  let perRankFlaws = 0;
  let flatCost = 0;

  for (const applied of component.modifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def) continue;
    if (def.costType === 'per_rank') {
      if (def.costValue > 0) perRankExtras += def.costValue;
      else perRankFlaws += Math.abs(def.costValue);
    } else if (def.costType === 'flat') {
      flatCost += def.costValue;
    } else if (def.costType === 'flat_ranked') {
      flatCost += def.costValue * applied.ranks;
    }
  }

  const rawCostPerRank = effectDef.baseCost + perRankExtras - perRankFlaws;
  const isFractional = rawCostPerRank < 1;
  const ranksPerPP = isFractional ? 2 - rawCostPerRank : 1;
  const costPerRank = Math.max(1, rawCostPerRank);
  const rankCost = isFractional
    ? Math.ceil(component.ranks / ranksPerPP)
    : costPerRank * component.ranks;
  const total = Math.max(1, rankCost + flatCost);

  return {
    base: effectDef.baseCost,
    perRankExtras,
    perRankFlaws,
    costPerRank,
    rankCost,
    flatCost,
    total,
    isFractional,
    ranksPerPP,
  };
}

/**
 * Calculate total PP spent on abilities.
 */
export function calculateAbilitiesCost(
  abilities: Record<string, number>,
  absentAbilities: string[]
): number {
  let total = 0;
  for (const [key, value] of Object.entries(abilities)) {
    if (absentAbilities.includes(key)) continue;
    total += value * 2;
  }
  return total;
}

/**
 * Calculate total PP spent on bought defense ranks.
 */
export function calculateDefensesCost(defenses: IDefenses): number {
  return defenses.dodge + defenses.parry + defenses.fortitude + defenses.will;
}

/**
 * Calculate total PP spent on skills. 1 PP per 2 ranks (round up).
 */
export function calculateSkillsCost(totalSkillRanks: number): number {
  return Math.ceil(totalSkillRanks / 2);
}

/**
 * Calculate total PP spent on advantages. 1 PP per rank.
 */
export function calculateAdvantagesCost(advantages: { ranks: number }[]): number {
  return advantages.reduce((sum, a) => sum + a.ranks, 0);
}

/**
 * Calculate total PP cost of a complete power (all components + alternate effects).
 * Consolidates the duplicated two-level reduce that previously existed in
 * PowersList.tsx and useCalculatedPP.ts.
 *
 * Formula: arrayCost − removableDiscount
 *   arrayCost = calculateArrayCost(mainCost, altCount, dynamicCount)
 *   removableDiscount = calcRemovableDiscount(mainCost, power.removable)
 */
export function calcPowerTotalCost(
  power: ICharacterPower,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): number {
  const mainCost = power.components.reduce((sum, comp) => {
    const def = powerDefs.find((d) => d.id === comp.effectId);
    return def ? sum + calcComponentCost(comp, def, modifierDefs) : sum;
  }, 0);
  const dynamicCount = power.alternateEffects.filter((a) => a.dynamic).length;
  const arrayCost = calculateArrayCost(mainCost, power.alternateEffects.length, dynamicCount);
  const discount = calcRemovableDiscount(mainCost, power.removable);
  return Math.max(0, arrayCost - discount);
}

// ── Derived Stats (pure — usable by PDF generator and React hooks alike) ────

/**
 * Calculate the bonus Toughness a character gains beyond STA.
 * Sources:
 *   - Protection power components (enhancesDefense === 'toughness') × ranks
 *   - Defensive Roll advantage ranks (each rank = +1 active Toughness)
 *
 * Returns { bonus, breakdown } for display in tooltips.
 */
export function calcToughnessBonus(
  powers: ICharacterPower[],
  advantages: { advantageId: string; ranks: number }[],
  powerDefs: IPowerEffect[]
): { bonus: number; breakdown: string[] } {
  const breakdown: string[] = [];
  let bonus = 0;

  // Protection (and any future effect with enhancesDefense === 'toughness')
  for (const power of powers) {
    for (const comp of power.components) {
      const def = powerDefs.find((d) => d.id === comp.effectId);
      if (def?.enhancesDefense === 'toughness') {
        bonus += comp.ranks;
        breakdown.push(`${power.name || def.name} ${comp.ranks}`);
      }
    }
    // Also check AE components — AEs can have their own Protection
    for (const ae of power.alternateEffects) {
      for (const comp of ae.components) {
        const def = powerDefs.find((d) => d.id === comp.effectId);
        if (def?.enhancesDefense === 'toughness') {
          bonus += comp.ranks;
          breakdown.push(`${ae.name || def.name} ${comp.ranks} (AE)`);
        }
      }
    }
  }

  // Defensive Roll advantage
  const defRoll = advantages.find((a) => a.advantageId === 'defensive_roll');
  if (defRoll && defRoll.ranks > 0) {
    bonus += defRoll.ranks;
    breakdown.push(`Defensive Roll ${defRoll.ranks}`);
  }

  return { bonus, breakdown };
}

/**
 * Calculate the total Initiative bonus for a character.
 * Sources:
 *   - Base: AGL ability rank
 *   - Improved Initiative advantage: +4 per rank
 *   - Enhanced Initiative power effect: +rank
 *
 * Returns { total, breakdown }.
 */
export function calcInitiativeBonus(
  agl: number,
  advantages: { advantageId: string; ranks: number }[],
  powers: ICharacterPower[],
  powerDefs: IPowerEffect[]
): { total: number; breakdown: string[] } {
  const breakdown: string[] = [`AGL ${agl}`];
  let total = agl;

  // Improved Initiative advantage: +4 per rank
  const improvedInit = advantages.find((a) => a.advantageId === 'improved_initiative');
  if (improvedInit && improvedInit.ranks > 0) {
    const bonus = improvedInit.ranks * 4;
    total += bonus;
    breakdown.push(`Improved Initiative ×${improvedInit.ranks} (+${bonus})`);
  }

  // Enhanced Initiative power effect (effectId === 'enhanced_initiative')
  for (const power of powers) {
    for (const comp of power.components) {
      const def = powerDefs.find((d) => d.id === comp.effectId);
      if (def?.id === 'enhanced_initiative') {
        total += comp.ranks;
        breakdown.push(`${power.name || 'Enhanced Initiative'} +${comp.ranks}`);
      }
    }
  }

  return { total, breakdown };
}

/**
 * Calculate the PP discount for Removable / Easily Removable powers.
 *
 * Official rule:
 *   Removable:        −1 PP per 5 PP of main component cost (rounded down)
 *   Easily Removable: −2 PP per 5 PP of main component cost (rounded down)
 *
 * Only mainCost is used (not AE additions), as per the rulebook.
 * Returns 0 if removable is undefined or 'none'.
 */
export function calcRemovableDiscount(
  mainCost: number,
  removable: 'none' | 'removable' | 'easily_removable' | undefined
): number {
  if (!removable || removable === 'none') return 0;
  const factor = removable === 'easily_removable' ? 2 : 1;
  return Math.floor(mainCost / 5) * factor;
}
