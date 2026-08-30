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
import { resolveModifierDefinition } from './rulesCatalog';

export type PricingDiagnosticCode =
  | 'unknown-effect'
  | 'unknown-modifier'
  | 'ambiguous-modifier';

export interface PricingDiagnostic {
  code: PricingDiagnosticCode;
  id: string;
  message: string;
}

export interface RankCostGroup {
  fromRank: number;
  toRank: number;
  rankCount: number;
  costPerRank: number;
  isFractional: boolean;
  ranksPerPP: number;
  subtotal: number;
}

export interface ComponentCostBreakdown {
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
  rankGroups: RankCostGroup[];
  diagnostics: PricingDiagnostic[];
}

interface ResolvedAppliedModifier {
  applied: IAppliedModifier;
  definition: IModifierDef;
}

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
 * Whether repeated applications change a per-rank modifier's pricing tier.
 * `maxRanks` remains a backward-compatible signal for definitions that
 * already exposed a rank selector before `repeatable` existed.
 */
export function isRepeatablePerRankModifier(def: IModifierDef): boolean {
  return def.costType === 'per_rank'
    && (def.repeatable === true || (def.maxRanks !== undefined && def.maxRanks > 1));
}

/** True when the Builder should expose and increment modifier ranks. */
export function isRankedModifier(def: IModifierDef): boolean {
  return def.costType === 'flat_ranked'
    || (def.costType === 'flat' && def.maxRanks !== undefined && def.maxRanks > 1)
    || isRepeatablePerRankModifier(def);
}

/** Resolve the explicit subtype or the rank-based legacy Variable Action tier. */
export function getSelectedModifierSubtypeId(
  applied: IAppliedModifier,
  def: IModifierDef,
): string {
  const explicitSubtype = applied.options?.subtypeId;
  if (typeof explicitSubtype === 'string' && explicitSubtype) return explicitSubtype;
  if (def.id !== 'action_variable') return '';
  if (applied.ranks >= 3) return 'reaction';
  if (applied.ranks === 2) return 'free';
  return 'move';
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
    // Older Variable Action records encoded Move/Free/Reaction as ranks 1/2/3.
    // Keep those JSONs untouched while pricing them according to the source.
    if (def.id === 'action_variable') {
      return Math.max(1, Math.min(3, applied.ranks));
    }
    // No subtype chosen yet → fall back to def.costValue (0 for alternate_resistance)
    return def.costValue;
  }

  // Default behavior
  const multiplier = isRepeatablePerRankModifier(def) ? applied.ranks : 1;
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
  let pricingTier = baseCost > 0 && baseCost < 1
    ? 2 - (1 / baseCost)
    : baseCost;

  for (const applied of appliedModifiers) {
    const def = modifierDefs.find((m) => m.id === applied.modifierId);
    if (!def || def.costType !== 'per_rank') continue;
    pricingTier += getPerRankModifierCost(applied, def, effectAction);
  }

  if (pricingTier >= 1) {
    return { costPerRank: pricingTier, isFractional: false, ranksPerPP: 1 };
  }

  // MM3e fractional costs use discrete ratio tiers. A printed 1 PP per 2
  // ranks starts at tier 0; every -1/rank flaw advances it to 1:3, 1:4, etc.
  const ranksPerPP = 2 - pricingTier;
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

function getAffectedRanks(applied: IAppliedModifier): number | undefined {
  return applied.affectedRanks
    ?? (typeof applied.options?.affectedRanks === 'number'
      ? applied.options.affectedRanks
      : undefined);
}

function getTierPricing(
  baseCost: number,
  modifiers: readonly ResolvedAppliedModifier[],
  effectAction?: string
): { costPerRank: number; isFractional: boolean; ranksPerPP: number } {
  let pricingTier = baseCost > 0 && baseCost < 1
    ? 2 - (1 / baseCost)
    : baseCost;

  for (const { applied, definition } of modifiers) {
    if (definition.costType !== 'per_rank') continue;
    pricingTier += getPerRankModifierCost(applied, definition, effectAction);
  }

  return pricingTier >= 1
    ? { costPerRank: pricingTier, isFractional: false, ranksPerPP: 1 }
    : { costPerRank: 1, isFractional: true, ranksPerPP: 2 - pricingTier };
}

function priceRanks(
  rankCount: number,
  pricing: { costPerRank: number; isFractional: boolean; ranksPerPP: number }
): number {
  return pricing.isFractional
    ? Math.ceil(rankCount / pricing.ranksPerPP)
    : pricing.costPerRank * rankCount;
}

function resolveComponentModifiers(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  genericModifierDefs: readonly IModifierDef[]
): { modifiers: ResolvedAppliedModifier[]; diagnostics: PricingDiagnostic[] } {
  const modifiers: ResolvedAppliedModifier[] = [];
  const diagnostics: PricingDiagnostic[] = [];

  for (const applied of component.modifiers) {
    const resolution = resolveModifierDefinition(applied, effectDef, genericModifierDefs);
    if (!resolution.definition) {
      diagnostics.push({
        code: 'unknown-modifier',
        id: applied.modifierId,
        message: `Unknown modifier "${applied.modifierId}" on effect "${effectDef.id}".`,
      });
      continue;
    }
    if (resolution.ambiguous) {
      diagnostics.push({
        code: 'ambiguous-modifier',
        id: applied.modifierId,
        message: `Legacy modifier "${applied.modifierId}" matches generic and power-specific rules; generic pricing was preserved.`,
      });
    }
    modifiers.push({ applied, definition: resolution.definition });
  }

  return { modifiers, diagnostics };
}

/**
 * The canonical component pricing result used by totals and UI breakdowns.
 * It resolves effect-specific modifiers, partial ranks, fractional tiers and
 * fixed-cost packages on one code path.
 */
export function calculateComponentPricing(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  genericModifierDefs: IModifierDef[]
): ComponentCostBreakdown {
  const resolved = resolveComponentModifiers(component, effectDef, genericModifierDefs);
  const perRankModifiers = resolved.modifiers.filter(
    ({ definition }) => definition.costType === 'per_rank'
  );

  let baseCost = effectDef.baseCost;
  let fixedPackageCost: number | undefined;
  if (effectDef.variableCost && component.variableCostOption) {
    const selectedOption = effectDef.variableCost.options.find(
      (option) => option.name === component.variableCostOption
    );
    if (selectedOption) {
      if (effectDef.variableCost.costType === 'flat') fixedPackageCost = selectedOption.cost;
      else baseCost = selectedOption.cost;
    }
  }

  let perRankExtras = 0;
  let perRankFlaws = 0;
  for (const { applied, definition } of perRankModifiers) {
    const effectiveCost = getPerRankModifierCost(applied, definition, effectDef.action);
    if (effectiveCost > 0) perRankExtras += effectiveCost;
    else perRankFlaws += Math.abs(effectiveCost);
  }

  const fullRankPricing = getTierPricing(baseCost, perRankModifiers, effectDef.action);
  const rankGroups: RankCostGroup[] = [];

  if (fixedPackageCost !== undefined) {
    const packageRanks = effectDef.baseCost > 0
      ? fixedPackageCost / effectDef.baseCost
      : fixedPackageCost;
    const subtotal = priceRanks(packageRanks, fullRankPricing);
    rankGroups.push({
      fromRank: 1,
      toRank: Math.max(1, component.ranks),
      rankCount: packageRanks,
      ...fullRankPricing,
      subtotal,
    });
  } else {
    let previousKey: string | null = null;
    let currentGroup: {
      fromRank: number;
      toRank: number;
      modifiers: ResolvedAppliedModifier[];
    } | null = null;

    for (let rank = 1; rank <= component.ranks; rank += 1) {
      const activeModifiers = perRankModifiers.filter(({ applied }) => {
        const affectedRanks = getAffectedRanks(applied);
        return affectedRanks === undefined || rank <= affectedRanks;
      });
      const key = activeModifiers.map(({ applied, definition }) =>
        `${definition.id}:${applied.ranks}:${applied.option ?? ''}:${JSON.stringify(applied.options ?? {})}`
      ).join('|');

      if (currentGroup && key === previousKey) {
        currentGroup.toRank = rank;
      } else {
        currentGroup = { fromRank: rank, toRank: rank, modifiers: activeModifiers };
        const pricing = getTierPricing(baseCost, activeModifiers, effectDef.action);
        rankGroups.push({
          fromRank: rank,
          toRank: rank,
          rankCount: 1,
          ...pricing,
          subtotal: priceRanks(1, pricing),
        });
      }
      previousKey = key;

      const latest = rankGroups.at(-1);
      if (latest) {
        latest.toRank = currentGroup.toRank;
        latest.rankCount = latest.toRank - latest.fromRank + 1;
        latest.subtotal = priceRanks(latest.rankCount, latest);
      }
    }
  }

  const rankCost = rankGroups.reduce((total, group) => total + group.subtotal, 0);
  const flatCost = resolved.modifiers.reduce((total, { applied, definition }) =>
    total + calcModifierCost(applied, definition), 0);
  const total = Math.max(1, rankCost + flatCost);

  return {
    base: fixedPackageCost ?? baseCost,
    selectedVariableCost: component.variableCostOption || null,
    perRankExtras,
    perRankFlaws,
    ...fullRankPricing,
    rankCost,
    flatCost,
    total,
    rankGroups,
    diagnostics: resolved.diagnostics,
  };
}

export function calcComponentCost(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  modifierDefs: IModifierDef[]
): number {
  return calculateComponentPricing(component, effectDef, modifierDefs).total;
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

export interface PricedPowerComponent {
  componentId: string;
  effectId: string;
  breakdown: ComponentCostBreakdown | null;
  total: number;
}

export interface AlternateEffectPricing {
  alternateEffectId: string;
  components: PricedPowerComponent[];
  total: number;
  diagnostics: PricingDiagnostic[];
}

export interface PowerPricing {
  components: PricedPowerComponent[];
  alternateEffects: AlternateEffectPricing[];
  mainCost: number;
  arrayCost: number;
  activationDiscount: number;
  adjustedArrayCost: number;
  removableDiscount: number;
  total: number;
  equipmentTotal: number;
  diagnostics: PricingDiagnostic[];
}

function calculateComponentListPricing(
  components: ICharacterPowerComponent[],
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): { components: PricedPowerComponent[]; total: number; diagnostics: PricingDiagnostic[] } {
  const diagnostics: PricingDiagnostic[] = [];
  const pricedComponents = components.map((component): PricedPowerComponent => {
    const effectDef = powerDefs.find((definition) => definition.id === component.effectId);
    if (!effectDef) {
      if (component.effectId) {
        diagnostics.push({
          code: 'unknown-effect',
          id: component.effectId,
          message: `Unknown effect "${component.effectId}".`,
        });
      }
      return {
        componentId: component.id,
        effectId: component.effectId,
        breakdown: null,
        total: 0,
      };
    }

    const breakdown = calculateComponentPricing(component, effectDef, modifierDefs);
    diagnostics.push(...breakdown.diagnostics);
    return {
      componentId: component.id,
      effectId: component.effectId,
      breakdown,
      total: breakdown.total,
    };
  });

  return {
    components: pricedComponents,
    total: pricedComponents.reduce((sum, component) => sum + component.total, 0),
    diagnostics,
  };
}

export function calculateAlternateEffectPricing(
  alternateEffect: IAlternateEffect,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): AlternateEffectPricing {
  const pricing = calculateComponentListPricing(
    alternateEffect.components,
    powerDefs,
    modifierDefs
  );
  return {
    alternateEffectId: alternateEffect.id,
    components: pricing.components,
    total: Math.max(1, pricing.total),
    diagnostics: pricing.diagnostics,
  };
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
  return calculateAlternateEffectPricing(ae, powerDefs, modifierDefs).total;
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
): ComponentCostBreakdown {
  return calculateComponentPricing(component, effectDef, modifierDefs);
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
  return calculatePowerPricing(power, powerDefs, modifierDefs).total;
}

export function calculatePowerPricing(
  power: ICharacterPower,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): PowerPricing {
  const main = calculateComponentListPricing(power.components, powerDefs, modifierDefs);
  const alternateEffects = power.alternateEffects.map((alternateEffect) =>
    calculateAlternateEffectPricing(alternateEffect, powerDefs, modifierDefs)
  );
  const dynamicCount = power.alternateEffects.filter(
    (alternateEffect) => alternateEffect.dynamic
  ).length;
  const arrayCost = calculateArrayCost(
    main.total,
    power.alternateEffects.length,
    dynamicCount,
    power.baseDynamic === true
  );
  const activationDiscount = power.activation === 'standard'
    ? 2
    : power.activation === 'move'
      ? 1
      : 0;
  const adjustedArrayCost = Math.max(1, arrayCost - activationDiscount);
  const removableDiscount = calcRemovableDiscount(adjustedArrayCost, power.removable);

  return {
    components: main.components,
    alternateEffects,
    mainCost: main.total,
    arrayCost,
    activationDiscount,
    adjustedArrayCost,
    removableDiscount,
    total: Math.max(1, adjustedArrayCost - removableDiscount),
    // Equipment uses the same array and Activation rules, but Removable is
    // inherent in Equipment Points and must not be discounted a second time.
    equipmentTotal: adjustedArrayCost,
    diagnostics: [
      ...main.diagnostics,
      ...alternateEffects.flatMap((alternateEffect) => alternateEffect.diagnostics),
    ],
  };
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
  return calculatePowerPricing(item, powerDefs, modifierDefs).equipmentTotal;
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
