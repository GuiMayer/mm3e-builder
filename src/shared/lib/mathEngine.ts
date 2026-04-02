/* ================================================
   Math Engine — Pure calculation functions
   Receives data via interfaces, returns numbers.
   Never imports stores directly — respects DIP.
   ================================================ */

import type { IAppliedModifier, IModifierDef, IDefenses } from '../../entities/types';

/**
 * Calculate the per-rank cost of a power effect.
 * Formula: baseCost + sumExtrasPerRank - sumFlawsPerRank
 * If result <= 0, returns a fractional representation.
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
 * Calculate the flat modifier cost sum.
 */
export function calculateFlatCost(
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[]
): number {
  let flatSum = 0;

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def || def.costType !== 'flat') continue;
    flatSum += def.costValue * applied.ranks;
  }

  return flatSum;
}

/**
 * Calculate total PP cost for a single power.
 * Total = (costPerRank × ranks / ranksPerPP) + flatCost, minimum 1.
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
 * Calculate the total cost of a power including alternate effects.
 * Array cost = most expensive effect + sum of alt flat costs (+1 or +2 each).
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
 * Calculate total PP spent on abilities.
 * Each rank costs 2 PP. Absent abilities cost 0.
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
 * Each rank costs 1 PP.
 */
export function calculateDefensesCost(defenses: IDefenses): number {
  return defenses.dodge + defenses.parry + defenses.fortitude + defenses.will;
}

/**
 * Calculate total PP spent on skills.
 * 1 PP per 2 ranks (round up).
 */
export function calculateSkillsCost(totalSkillRanks: number): number {
  return Math.ceil(totalSkillRanks / 2);
}

/**
 * Calculate total PP spent on advantages.
 * 1 PP per rank.
 */
export function calculateAdvantagesCost(
  advantages: { ranks: number }[]
): number {
  return advantages.reduce((sum, a) => sum + a.ranks, 0);
}
