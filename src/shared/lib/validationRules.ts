/* ================================================
   Validation Rules Configuration
   Modular system for enabling/disabling specific M&M 3e rules.
   GMs and players can customize which rules to enforce.
   ================================================ */

import type { IValidationRules } from '../../entities/types';

/**
 * Default validation rules configuration.
 * These are the recommended settings for standard M&M 3e play.
 */
export const DEFAULT_VALIDATION_RULES: IValidationRules = {
  // Modifier restrictions
  enforceIncompatibleModifiers: true,      // Prevent incompatible combinations (e.g., Ranged + Close)
  enforceModifierMaxRanks: true,           // Enforce maxRanks limits (e.g., Accurate max 5)
  enforceAccuratePLCap: true,              // Accurate capped at PL (attack+effect ≤ 2×PL)
  
  // Power validations
  enforceAfflictionProgression: false,     // Validate Affliction condition degrees (optional - GM discretion)
  enforceAbsentAbilityRestrictions: false, // Warn about powers requiring absent abilities (optional)
  
  // PL trade-offs
  plTradeOffsAsErrors: true,               // In strict mode: true = errors, false = warnings
  
  // Skill validations
  enforceTrainedOnlySkills: false,         // Prevent untrained use (optional - some GMs allow)
  enforceSkillAbilityRequirements: false,  // Warn about skills with absent base abilities (optional)
};

/**
 * Permissive validation rules for house-ruled or experimental games.
 * Disables most optional restrictions.
 */
export const PERMISSIVE_VALIDATION_RULES: IValidationRules = {
  enforceIncompatibleModifiers: false,
  enforceModifierMaxRanks: false,
  enforceAccuratePLCap: false,
  enforceAfflictionProgression: false,
  enforceAbsentAbilityRestrictions: false,
  plTradeOffsAsErrors: false,              // PL violations as warnings only
  enforceTrainedOnlySkills: false,
  enforceSkillAbilityRequirements: false,
};

/**
 * Strict validation rules for tournament or official play.
 * Enforces all rules strictly.
 */
export const STRICT_VALIDATION_RULES: IValidationRules = {
  enforceIncompatibleModifiers: true,
  enforceModifierMaxRanks: true,
  enforceAccuratePLCap: true,
  enforceAfflictionProgression: true,
  enforceAbsentAbilityRestrictions: true,
  plTradeOffsAsErrors: true,
  enforceTrainedOnlySkills: true,
  enforceSkillAbilityRequirements: true,
};

/**
 * Get the active validation rules, merging user preferences with defaults.
 */
export function getActiveValidationRules(
  userRules?: Partial<IValidationRules>
): IValidationRules {
  return {
    ...DEFAULT_VALIDATION_RULES,
    ...userRules,
  };
}

/**
 * Validation rule metadata for UI display.
 * Helps GMs understand what each rule does and when to disable it.
 */
export interface ValidationRuleMetadata {
  id: keyof IValidationRules;
  name: string;
  description: string;
  category: 'modifier' | 'power' | 'pl' | 'skill';
  recommendedFor: 'all' | 'strict' | 'optional';
  disableWhen: string;  // When GMs might want to disable this
}

export const VALIDATION_RULE_METADATA: ValidationRuleMetadata[] = [
  {
    id: 'enforceIncompatibleModifiers',
    name: 'Incompatible Modifiers',
    description: 'Prevents combining incompatible modifiers (e.g., Ranged + Close on same power)',
    category: 'modifier',
    recommendedFor: 'all',
    disableWhen: 'Using house rules that allow normally incompatible combinations',
  },
  {
    id: 'enforceModifierMaxRanks',
    name: 'Modifier Rank Limits',
    description: 'Enforces maximum ranks for modifiers (e.g., Accurate max 5 ranks)',
    category: 'modifier',
    recommendedFor: 'all',
    disableWhen: 'Allowing higher-than-normal modifier ranks for epic campaigns',
  },
  {
    id: 'enforceAccuratePLCap',
    name: 'Accurate PL Cap',
    description: 'Ensures Accurate modifier respects PL limits (attack + effect ≤ 2×PL)',
    category: 'modifier',
    recommendedFor: 'all',
    disableWhen: 'Never - this is a core PL balance rule',
  },
  {
    id: 'enforceAfflictionProgression',
    name: 'Affliction Condition Progression',
    description: 'Validates that Affliction conditions follow proper degree progression',
    category: 'power',
    recommendedFor: 'optional',
    disableWhen: 'Using custom Affliction conditions or narrative-focused play',
  },
  {
    id: 'enforceAbsentAbilityRestrictions',
    name: 'Absent Ability Restrictions',
    description: 'Warns when powers or skills require abilities marked as absent',
    category: 'power',
    recommendedFor: 'optional',
    disableWhen: 'Playing constructs/robots with creative power justifications',
  },
  {
    id: 'plTradeOffsAsErrors',
    name: 'PL Trade-offs as Errors',
    description: 'Treats PL violations as errors (vs. warnings) in strict mode',
    category: 'pl',
    recommendedFor: 'strict',
    disableWhen: 'Allowing temporary PL violations during character building',
  },
  {
    id: 'enforceTrainedOnlySkills',
    name: 'Trained-Only Skills',
    description: 'Prevents using trained-only skills without ranks',
    category: 'skill',
    recommendedFor: 'optional',
    disableWhen: 'Using house rules that allow untrained attempts at penalty',
  },
  {
    id: 'enforceSkillAbilityRequirements',
    name: 'Skill Ability Requirements',
    description: 'Warns when skills are based on absent abilities',
    category: 'skill',
    recommendedFor: 'optional',
    disableWhen: 'Playing constructs with creative skill justifications',
  },
];
