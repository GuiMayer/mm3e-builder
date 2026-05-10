/* ================================================
   Affliction Validation — M&M 3e Rules Enforcement
   Validates Affliction condition progression by degree.
   Reference: Hero's Handbook p.149 (Powers chapter)
   ================================================ */

import type { IValidationRules } from '../../entities/types';

export interface AfflictionViolation {
  type: 'invalid_condition' | 'invalid_progression' | 'invalid_resistance';
  degree: 1 | 2 | 3;
  condition?: string;
  message: string;
  severity: 'error' | 'warning';
  reference: string;
}

/**
 * Valid Affliction conditions by degree.
 * Reference: Hero's Handbook p.149
 */
export const AFFLICTION_CONDITIONS = {
  degree1: ['dazed', 'entranced', 'fatigued', 'hindered', 'impaired', 'vulnerable'],
  degree2: ['compelled', 'defenseless', 'disabled', 'exhausted', 'immobile', 'prone', 'stunned'],
  degree3: ['asleep', 'controlled', 'incapacitated', 'paralyzed', 'transformed', 'unaware'],
} as const;

/**
 * Valid resistance types for Affliction.
 * Reference: Hero's Handbook p.149
 */
export const AFFLICTION_RESISTANCES = ['fortitude', 'will', 'dodge'] as const;

export type AfflictionResistance = typeof AFFLICTION_RESISTANCES[number];
export type AfflictionCondition = 
  | typeof AFFLICTION_CONDITIONS.degree1[number]
  | typeof AFFLICTION_CONDITIONS.degree2[number]
  | typeof AFFLICTION_CONDITIONS.degree3[number];

export interface AfflictionConfig {
  resistance: AfflictionResistance;
  degree1Condition: string;
  degree2Condition: string;
  degree3Condition: string;
  alternateResistance?: boolean; // Dodge initial, Fort/Will recovery
}

/**
 * Validate that a condition is valid for its degree.
 */
export function validateAfflictionCondition(
  condition: string,
  degree: 1 | 2 | 3
): AfflictionViolation | null {
  const validConditions = AFFLICTION_CONDITIONS[`degree${degree}` as keyof typeof AFFLICTION_CONDITIONS];
  
  if (!validConditions.includes(condition as any)) {
    return {
      type: 'invalid_condition',
      degree,
      condition,
      message: `"${condition}" is not a valid degree ${degree} condition. Valid options: ${validConditions.join(', ')}`,
      severity: 'error',
      reference: 'Hero\'s Handbook p.149',
    };
  }
  
  return null;
}

/**
 * Validate that Affliction conditions form a logical progression.
 * Higher degree conditions should be more severe than lower degrees.
 */
export function validateAfflictionProgression(
  config: AfflictionConfig
): AfflictionViolation[] {
  const violations: AfflictionViolation[] = [];
  
  // Validate each condition is valid for its degree
  const degree1Violation = validateAfflictionCondition(config.degree1Condition, 1);
  if (degree1Violation) violations.push(degree1Violation);
  
  const degree2Violation = validateAfflictionCondition(config.degree2Condition, 2);
  if (degree2Violation) violations.push(degree2Violation);
  
  const degree3Violation = validateAfflictionCondition(config.degree3Condition, 3);
  if (degree3Violation) violations.push(degree3Violation);
  
  // Check for duplicate conditions across degrees
  const conditions = [config.degree1Condition, config.degree2Condition, config.degree3Condition];
  const uniqueConditions = new Set(conditions);
  
  if (uniqueConditions.size < conditions.length) {
    violations.push({
      type: 'invalid_progression',
      degree: 1,
      message: 'Affliction conditions must be unique across degrees',
      severity: 'warning',
      reference: 'Hero\'s Handbook p.149',
    });
  }
  
  return violations;
}

/**
 * Validate Affliction resistance type.
 */
export function validateAfflictionResistance(
  config: AfflictionConfig
): AfflictionViolation | null {
  // Standard resistances: Fortitude or Will
  if (config.resistance === 'fortitude' || config.resistance === 'will') {
    return null;
  }
  
  // Dodge is only valid with Alternate Resistance extra
  if (config.resistance === 'dodge') {
    if (!config.alternateResistance) {
      return {
        type: 'invalid_resistance',
        degree: 1,
        message: 'Dodge resistance requires Alternate Resistance extra',
        severity: 'error',
        reference: 'Hero\'s Handbook p.149',
      };
    }
    return null;
  }
  
  return {
    type: 'invalid_resistance',
    degree: 1,
    message: `Invalid resistance type: ${config.resistance}. Must be Fortitude, Will, or Dodge (with Alternate Resistance)`,
    severity: 'error',
    reference: 'Hero\'s Handbook p.149',
  };
}

/**
 * Validate complete Affliction configuration.
 */
export function validateAffliction(
  config: AfflictionConfig,
  validationRules: IValidationRules
): AfflictionViolation[] {
  if (!validationRules.enforceAfflictionProgression) {
    return [];
  }
  
  const violations: AfflictionViolation[] = [];
  
  // Validate resistance type
  const resistanceViolation = validateAfflictionResistance(config);
  if (resistanceViolation) violations.push(resistanceViolation);
  
  // Validate condition progression
  violations.push(...validateAfflictionProgression(config));
  
  return violations;
}

/**
 * Get human-readable description of Affliction conditions.
 */
export function describeAfflictionConditions(degree: 1 | 2 | 3): string {
  const conditions = AFFLICTION_CONDITIONS[`degree${degree}` as keyof typeof AFFLICTION_CONDITIONS];
  return conditions.join(', ');
}
