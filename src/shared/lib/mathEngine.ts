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
  if (def.costType === 'flat') return def.costValue * (def.maxRanks && def.maxRanks > 1 ? applied.ranks : 1);
  if (def.costType === 'flat_ranked') return def.costValue * applied.ranks;
  // per_rank: contributes to the per-rank total, not a fixed amount here
  return 0;
}

/**
 * Calculate the cost contribution for a single per-rank modifier with conditional logic.
 * Handles edge cases like:
 *   - "Affects Objects" (+1/rank both; +0/rank only objects)
 *   - "Alternate Resistance" — cost depends on chosen defense subtype
 */
export function getPerRankModifierCost(
  applied: IAppliedModifier,
  def: IModifierDef,
  effectAction?: string
): number {
  // ── Affects Objects ────────────────────────────────────────────────────────
  if (def.id === 'affects_objects') {
    // +1/rank if affects both characters and objects (default)
    // +0/rank if affects ONLY objects
    const isOnlyObjects = applied.options?.affectsOnlyObjects === true;
    return isOnlyObjects ? 0 : 1;
  }

  // Affects Others costs +1/rank when the user can also use the effect,
  // and +0/rank only when it affects others exclusively.
  if (def.id === 'affects_others') {
    return applied.options?.affectsOnlyOthers === true ? 0 : 1;
  }

  // The source defines Alternate Resistance by its relative advantage, not
  // by a fixed defense table. Keep the chosen resistance as metadata and
  // let the GM decide whether it is more advantageous.
  if (def.id === 'alternate_resistance') {
    return applied.options?.alternateResistanceCost === 'advantageous' ? 1 : 0;
  }

  // Reaction is derived from the effect's printed default action.
  if (def.id === 'reaction') {
    return effectAction === 'free' ? 1 : 3;
  }

  // Side Effect is worth -2/rank only when it always occurs.
  if (def.id === 'side_effect') {
    return applied.options?.sideEffectAlways === true ? -2 : -1;
  }

  // Area may be purchased repeatedly to expand its dimensions. Perception
  // Area includes Sense-Dependent at no additional cost; without it, the
  // Perception shape costs +2/rank rather than the usual +1/rank.
  if (def.id === 'area') {
    const isPerception = applied.option === 'Perception';
    const includesSenseDependent = applied.options?.includesSenseDependent === true;
    return applied.ranks + (isPerception && !includesSenseDependent ? 1 : 0);
  }

  // ── Modifiers with subtypes (e.g. Alternate Resistance) ────────────────────
  // If def has subtypes and the user chose one, use that subtype's costValue.
  if (def.subtypes && def.subtypes.length > 0) {
    const subtypeId = applied.options?.subtypeId as string | undefined;
    if (subtypeId) {
      const sub = def.subtypes.find((s) => s.id === subtypeId);
    if (sub) return sub.costValue;
    }
    // No subtype chosen yet → fall back to def.costValue (0 for alternate_resistance)
    return def.costValue;
  }

  // Default behavior
  const multiplier = def.maxRanks && def.maxRanks > 1 ? applied.ranks : 1;
  return def.costValue * multiplier;
}

/**
 * Calculate the per-rank cost modifier sum for a component.
 * Formula: baseCost + sum(per_rank extras) - sum(per_rank flaw absolute values)
 * If result <= 0, returns fractional info.
 */
export function calculateCostPerRank(
  baseCost: number,
  appliedModifiers: IAppliedModifier[],
  modifierDefs: IModifierDef[],
  effectAction?: string
): { costPerRank: number; isFractional: boolean; ranksPerPP: number } {
  let perRankSum = baseCost;

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def || def.costType !== 'per_rank') continue;
    perRankSum += getPerRankModifierCost(applied, def, effectAction);
  }

  if (perRankSum >= 1) {
    return { costPerRank: perRankSum, isFractional: false, ranksPerPP: 1 };
  }

  // Fractional costs can be printed as 1 PP per 2 ranks (for example,
  // Enhanced Skill). Preserve that exact half-cost case; flaws below it use
  // the normal 1 PP per 2/3/... ranks progression.
  const ranksPerPP = perRankSum > 0 ? 1 / perRankSum : 2 - perRankSum;
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
    if (def.costType === 'flat') {
      flatSum += def.costValue * (def.maxRanks && def.maxRanks > 1 ? applied.ranks : 1);
    }
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
  // Determine base cost: use variable cost option if selected, otherwise use baseCost
  let baseCost = effectDef.baseCost;
  let fixedPackageCost: number | undefined;
  
  if (effectDef.variableCost && component.variableCostOption) {
    const selectedOption = effectDef.variableCost.options.find(
      opt => opt.name === component.variableCostOption
    );
    if (selectedOption) {
      if (effectDef.variableCost.costType === 'flat') fixedPackageCost = selectedOption.cost;
      else baseCost = selectedOption.cost;
    }
  }

  const { costPerRank, isFractional, ranksPerPP } = calculateCostPerRank(
    baseCost,
    component.modifiers,
    modifierDefs,
    effectDef.action,
  );

  let rankCost: number;
  if (isFractional) {
    rankCost = Math.ceil(component.ranks / ranksPerPP);
  } else {
    rankCost = costPerRank * component.ranks;
  }

  if (fixedPackageCost !== undefined) {
    // A selected package has one printed base cost. Per-rank modifiers still
    // affect that cost because they modify the complete effect.
    rankCost = fixedPackageCost * (costPerRank / effectDef.baseCost);
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
  dynamicCount: number,
  baseDynamic = false
): number {
  const staticAlts = alternateEffectCount - dynamicCount;
  return mainPowerCost + staticAlts + dynamicCount * 2 + (baseDynamic ? 1 : 0);
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
  selectedVariableCost: string | null;
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

  let perRankSum = 0;

  for (const applied of component.modifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def) continue;
    if (def.costType === 'per_rank') {
      // Keep the breakdown on the same rule path as calcComponentCost().
      // Some modifiers (for example Affects Objects) have a conditional cost.
      const effectiveCost = getPerRankModifierCost(applied, def, effectDef.action);
      perRankSum += effectiveCost;
      if (effectiveCost > 0) perRankExtras += effectiveCost;
      else perRankFlaws += Math.abs(effectiveCost);
    } else if (def.costType === 'flat') {
      flatCost += def.costValue * (def.maxRanks && def.maxRanks > 1 ? applied.ranks : 1);
    } else if (def.costType === 'flat_ranked') {
      flatCost += def.costValue * applied.ranks;
    }
  }

  // Determine base cost: use variable cost option if selected, otherwise use baseCost
  let baseCost = effectDef.baseCost;
  let fixedPackageCost: number | undefined;
  
  if (effectDef.variableCost && component.variableCostOption) {
    const selectedOption = effectDef.variableCost.options.find(
      opt => opt.name === component.variableCostOption
    );
    if (selectedOption) {
      if (effectDef.variableCost.costType === 'flat') fixedPackageCost = selectedOption.cost;
      else baseCost = selectedOption.cost;
    }
  }

  const rawCostPerRank = baseCost + perRankSum;
  const isFractional = rawCostPerRank < 1;
  const ranksPerPP = isFractional
    ? (rawCostPerRank > 0 ? 1 / rawCostPerRank : 2 - rawCostPerRank)
    : 1;
  const costPerRank = Math.max(1, rawCostPerRank);
  let rankCost = isFractional
    ? Math.ceil(component.ranks / ranksPerPP)
    : costPerRank * component.ranks;
  if (fixedPackageCost !== undefined) {
    rankCost = fixedPackageCost * (rawCostPerRank / effectDef.baseCost);
  }
  const total = Math.max(1, rankCost + flatCost);

  return {
    base: fixedPackageCost ?? baseCost,
    selectedVariableCost: component.variableCostOption || null,
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
 *   removableDiscount = calcRemovableDiscount(arrayCost, power.removable)
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
  const arrayCost = calculateArrayCost(
    mainCost,
    power.alternateEffects.length,
    dynamicCount,
    power.baseDynamic === true,
  );
  const discount = calcRemovableDiscount(arrayCost, power.removable);
  // A flat flaw cannot reduce a power's final cost below 1 PP.
  return Math.max(1, arrayCost - discount);
}

/**
 * Calculate Equipment Points (EP) cost for an equipment item.
 *
 * Equipment uses the same component structure as powers, but cost is in EP.
 * The Equipment advantage already provides the "Easily Removable" discount
 * inherently (1 rank = 5 EP = 1 PP), so we do NOT apply calcRemovableDiscount().
 *
 * EP cost = sum of component costs + AE flat costs (1 EP per static AE, 2 per dynamic)
 * Minimum 1 EP per item.
 */
export function calcEquipmentEPCost(
  item: ICharacterPower,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): number {
  const mainCost = item.components.reduce((sum, comp) => {
    const def = powerDefs.find((d) => d.id === comp.effectId);
    return def ? sum + calcComponentCost(comp, def, modifierDefs) : sum;
  }, 0);
  const dynamicCount = item.alternateEffects.filter((a) => a.dynamic).length;
  const arrayCost = calculateArrayCost(mainCost, item.alternateEffects.length, dynamicCount);
  // No removable discount for equipment — it's inherent in the EP system
  return Math.max(1, arrayCost);
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
 *   Removable:        −1 PP per 5 PP of the power's final cost (rounded up)
 *   Easily Removable: −2 PP per 5 PP of the power's final cost (rounded up)
 *
 * The input includes the Alternate Effect flat costs, because Removable applies
 * to the power as a whole rather than to individual components.
 * Returns 0 if removable is undefined or 'none'.
 */
export function calcRemovableDiscount(
  finalPowerCost: number,
  removable: 'none' | 'removable' | 'easily_removable' | undefined
): number {
  if (!removable || removable === 'none') return 0;
  const factor = removable === 'easily_removable' ? 2 : 1;
  return Math.ceil(finalPowerCost / 5) * factor;
}
