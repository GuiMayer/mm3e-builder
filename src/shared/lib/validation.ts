/* ================================================
   Validation — PL Trade-Off Limit Checks
   Returns violations when Strict Mode is active.
   ================================================ */

export interface PLViolation {
  rule: string;
  formula: string;
  actual: number;
  limit: number;
}

/**
 * Validate attack + effect rank limit.
 * attackBonus + effectRank <= PL × 2
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
 * Validate dodge + toughness limit.
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
 * Validate parry + toughness limit.
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
 * Validate fortitude + will limit.
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
 * Validate non-combat skill cap.
 * abilityBase + ranks <= PL + 10
 */
export function validateSkillCap(
  abilityBase: number,
  ranks: number,
  powerLevel: number,
  isCombatSkill: boolean
): PLViolation | null {
  const actual = abilityBase + ranks;
  const limit = isCombatSkill ? powerLevel * 2 : powerLevel + 10;
  if (actual > limit) {
    return {
      rule: isCombatSkill ? 'validation.combatSkill' : 'validation.skill',
      formula: `${abilityBase} + ${ranks} = ${actual} > ${limit}`,
      actual,
      limit,
    };
  }
  return null;
}
