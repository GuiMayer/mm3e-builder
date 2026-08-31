/* ================================================
   Validation Functions
   - Power Field Validation (configurable fields)
   - PL Trade-Off Limit Checks (M&M 3e official rules)
   ================================================ */

import type { ICharacterPowerComponent, IPowerEffect } from '../../entities/types';

// ══════════════════════════════════════════════════════════════════════════════
// POWER FIELD VALIDATION
// ══════════════════════════════════════════════════════════════════════════════

export interface IPowerFieldViolation {
  field: string;
  label: string;
  message: string;
}

/**
 * Validates that all required configurable fields are set on a power component.
 * Returns null if valid, or a violation object if a required field is missing/empty.
 */
export function validateRequiredPowerFields(
  component: ICharacterPowerComponent,
  effectDef?: IPowerEffect
): IPowerFieldViolation | null {
  if (!effectDef?.configurableFields) return null;

  for (const field of effectDef.configurableFields) {
    if (!field.required) continue;

    const value = component.fieldValues?.[field.id];

    // Check if value is missing or empty
    if (!value) {
      return {
        field: field.id,
        label: field.label,
        message: `Required field "${field.label}" is not set`,
      };
    }

    // For multi-select, check if array is empty
    if (Array.isArray(value) && value.length === 0) {
      return {
        field: field.id,
        label: field.label,
        message: `Required field "${field.label}" must have at least one selection`,
      };
    }

    // For text inputs, check if string is empty
    if (typeof value === 'string' && value.trim() === '') {
      return {
        field: field.id,
        label: field.label,
        message: `Required field "${field.label}" cannot be empty`,
      };
    }
  }

  return null; // All required fields are valid
}

/**
 * Validates all components in a power.
 * Returns an array of violations (empty if all valid).
 */
export function validatePowerComponents(
  components: ICharacterPowerComponent[],
  powerDefs: IPowerEffect[]
): Array<{ componentIndex: number; violation: IPowerFieldViolation }> {
  const violations: Array<{ componentIndex: number; violation: IPowerFieldViolation }> = [];

  components.forEach((comp, idx) => {
    const effectDef = powerDefs.find((d) => d.id === comp.effectId);
    const violation = validateRequiredPowerFields(comp, effectDef);
    if (violation) {
      violations.push({ componentIndex: idx, violation });
    }
  });

  return violations;
}

// ══════════════════════════════════════════════════════════════════════════════
// PL TRADE-OFF VALIDATION (M&M 3e Hero's Handbook p.24)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Represents a Power Level violation.
 * Used by usePLValidation hook and power cost calculation.
 */
export interface CharacterValidationNotice {
  rule: string;        // Translation key: 'validation.attackDamage', 'validation.dodgeToughness', etc.
  formula: string;     // Human-readable: "Attack +12 + Damage 10 = 22"
  params?: Record<string, string | number>;
  severity?: 'error' | 'warning';
}

export interface PLViolation extends CharacterValidationNotice {
  actual: number;      // 22
  limit: number;       // 20 (PL 10 × 2)
}

/**
 * Validates attack + effect rank limit.
 * 
 * Official Rule (Hero's Handbook p.24):
 * - "The total of your hero's attack bonus and effect rank with that attack 
 *    cannot exceed twice the series power level."
 * 
 * Formula: attackBonus + effectRank ≤ PL × 2
 */
export function validateAttackEffect(
  attackBonus: number,
  effectRank: number,
  powerLevel: number
): PLViolation | null {
  const actual = attackBonus + effectRank;
  const limit = powerLevel * 2;
  if (actual > limit) {
    return {
      rule: 'validation.attackDamage',
      formula: `${attackBonus} + ${effectRank} = ${actual} > ${limit}`,
      actual,
      limit,
    };
  }
  return null;
}

/**
 * Validates Dodge + Toughness limit.
 * 
 * Official Rule (Hero's Handbook p.24):
 * - "The total of your hero's Dodge and Toughness defenses cannot exceed 
 *    twice the series power level."
 * 
 * Formula: dodge + toughness ≤ PL × 2
 */
export function validateDodgeToughness(
  dodge: number,
  toughness: number,
  powerLevel: number
): PLViolation | null {
  const actual = dodge + toughness;
  const limit = powerLevel * 2;
  if (actual > limit) {
    return {
      rule: 'validation.dodgeToughness',
      formula: `${dodge} + ${toughness} = ${actual} > ${limit}`,
      actual,
      limit,
    };
  }
  return null;
}

/**
 * Validates Parry + Toughness limit.
 * 
 * Official Rule (Hero's Handbook p.24):
 * - "The total of your hero's Parry and Toughness defenses cannot exceed 
 *    twice the series power level."
 * 
 * Formula: parry + toughness ≤ PL × 2
 */
export function validateParryToughness(
  parry: number,
  toughness: number,
  powerLevel: number
): PLViolation | null {
  const actual = parry + toughness;
  const limit = powerLevel * 2;
  if (actual > limit) {
    return {
      rule: 'validation.parryToughness',
      formula: `${parry} + ${toughness} = ${actual} > ${limit}`,
      actual,
      limit,
    };
  }
  return null;
}

/**
 * Validates Fortitude + Will limit.
 * 
 * Official Rule (Hero's Handbook p.24):
 * - "The total of your hero's Fortitude and Will defenses cannot exceed 
 *    twice the series power level."
 * 
 * Formula: fortitude + will ≤ PL × 2
 */
export function validateFortitudeWill(
  fortitude: number,
  will: number,
  powerLevel: number
): PLViolation | null {
  const actual = fortitude + will;
  const limit = powerLevel * 2;
  if (actual > limit) {
    return {
      rule: 'validation.fortitudeWill',
      formula: `${fortitude} + ${will} = ${actual} > ${limit}`,
      actual,
      limit,
    };
  }
  return null;
}



/**
 * Validate skill cap (ALL skills, combat and non-combat).
 * Official M&M 3e rule (Hero's Handbook p.24):
 * "Your hero's total modifier with any skill (ability rank + skill rank + advantage modifiers)
 * cannot exceed the series power level +10."
 * 
 * Formula: abilityBase + ranks <= PL + 10
 * 
 * Note: The book does NOT distinguish between combat and non-combat skills.
 * All skills follow the same PL+10 limit.
 */
export function validateSkillCap(
  abilityBase: number,
  ranks: number,
  powerLevel: number
): PLViolation | null {
  const actual = abilityBase + ranks;
  const limit = powerLevel + 10;
  if (actual > limit) {
    return {
      rule: 'validation.skill',
      formula: `${abilityBase} + ${ranks} = ${actual} > ${limit}`,
      actual,
      limit,
    };
  }
  return null;
}

/**
 * Validates Luck advantage against PL limit.
 * 
 * Official Rule (Hero's Handbook p.565):
 * - "You can do this a number of times per game session equal to your Luck rank, 
 *    with a maximum rank of half the series power level (rounded down)."
 * 
 * Formula: Luck Rank ≤ PL ÷ 2 (rounded down)
 */
export function validateLuckAdvantage(
  luckRanks: number,
  powerLevel: number
): PLViolation | null {
  const limit = Math.floor(powerLevel / 2);
  if (luckRanks > limit) {
    return {
      rule: 'validation.luckAdvantage',
      formula: `Luck ${luckRanks} > ${limit}`,
      actual: luckRanks,
      limit,
    };
  }
  return null;
}
