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
  // Core limits (NEW - fundamental rules that can be disabled)
  enforcePLLimits: true,                   // Enforce ALL PL trade-off limits
  enforcePPBudget: true,                   // Enforce PP spending limit
  enforceMinimumAbilityScore: true,        // Enforce minimum ability score of -5
  enforceAlternateEffectCap: true,         // Alternate Effects cannot exceed base power cost
  enforceEquipmentPPLimit: true,           // Equipment limited to 5 PP per Equipment advantage rank
  
  // Modifier restrictions
  enforceIncompatibleModifiers: true,      // Prevent incompatible combinations (e.g., Ranged + Close)
  enforceDuplicateModifiers: true,         // Prevent duplicate modifier entries on the same component
  enforceModifierMaxRanks: true,           // Enforce maxRanks limits (e.g., Accurate max 5)
  enforceAccuratePLCap: true,              // Accurate capped at PL (attack+effect ≤ 2×PL)
  enforcePowerSpecificModifiers: false,    // Only allow modifiers valid for the power (optional - Phase 3)
  
  // Power validations
  enforceAfflictionProgression: false,     // Validate Affliction condition degrees (optional - GM discretion)
  enforceAbsentAbilityRestrictions: false, // Warn about powers requiring absent abilities (optional)
  
  // PL trade-offs
  plTradeOffsAsErrors: true,               // In strict mode: true = errors, false = warnings
  
  // Skill validations
  enforceTrainedOnlySkills: false,         // Prevent untrained use (optional - some GMs allow)
  enforceSkillAbilityRequirements: false,  // Warn about skills with absent base abilities (optional)
  
  // Power field validations
  enforceRequiredPowerFields: true,        // Require configurable power fields to be set at acquisition
};

/**
 * Permissive validation rules for house-ruled or experimental games.
 * Disables most optional restrictions.
 */
export const PERMISSIVE_VALIDATION_RULES: IValidationRules = {
  // Core limits - keep PL and PP budget, but relax others
  enforcePLLimits: true,                   // Keep PL limits even in permissive mode
  enforcePPBudget: true,                   // Keep PP budget even in permissive mode
  enforceMinimumAbilityScore: false,       // Allow abilities below -5
  enforceAlternateEffectCap: false,        // Allow AEs stronger than base
  enforceEquipmentPPLimit: false,          // Allow unlimited equipment
  
  enforceIncompatibleModifiers: false,
  enforceDuplicateModifiers: false,
  enforceModifierMaxRanks: false,
  enforceAccuratePLCap: false,
  enforcePowerSpecificModifiers: false,
  enforceAfflictionProgression: false,
  enforceAbsentAbilityRestrictions: false,
  plTradeOffsAsErrors: false,              // PL violations as warnings only
  enforceTrainedOnlySkills: false,
  enforceSkillAbilityRequirements: false,
  
  enforceRequiredPowerFields: false,       // Allow incomplete power configurations
};

/**
 * Strict validation rules for tournament or official play.
 * Enforces all rules strictly.
 */
export const STRICT_VALIDATION_RULES: IValidationRules = {
  // Core limits - all enforced
  enforcePLLimits: true,
  enforcePPBudget: true,
  enforceMinimumAbilityScore: true,
  enforceAlternateEffectCap: true,
  enforceEquipmentPPLimit: true,
  
  enforceIncompatibleModifiers: true,
  enforceDuplicateModifiers: true,
  enforceModifierMaxRanks: true,
  enforceAccuratePLCap: true,
  enforcePowerSpecificModifiers: true,
  enforceAfflictionProgression: true,
  enforceAbsentAbilityRestrictions: true,
  plTradeOffsAsErrors: true,
  enforceTrainedOnlySkills: true,
  enforceSkillAbilityRequirements: true,
  
  enforceRequiredPowerFields: true,        // Require all power fields in strict mode
};

/**
 * Sandbox validation rules for testing and experimentation.
 * Disables ALL restrictions - no limits whatsoever.
 */
export const SANDBOX_VALIDATION_RULES: IValidationRules = {
  // Core limits - all disabled for sandbox mode
  enforcePLLimits: false,
  enforcePPBudget: false,
  enforceMinimumAbilityScore: false,
  enforceAlternateEffectCap: false,
  enforceEquipmentPPLimit: false,
  
  enforceIncompatibleModifiers: false,
  enforceDuplicateModifiers: false,
  enforceModifierMaxRanks: false,
  enforceAccuratePLCap: false,
  enforcePowerSpecificModifiers: false,
  enforceAfflictionProgression: false,
  enforceAbsentAbilityRestrictions: false,
  plTradeOffsAsErrors: false,
  enforceTrainedOnlySkills: false,
  enforceSkillAbilityRequirements: false,
  
  enforceRequiredPowerFields: false,       // Allow incomplete power configurations in sandbox
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
  // Core limits (NEW)
  {
    id: 'enforcePLLimits',
    name: 'PL Trade-off Limits',
    description: 'Enforces ALL PL trade-off limits (attack+damage, dodge+toughness, parry+toughness, fortitude+will ≤ 2×PL)',
    category: 'pl',
    recommendedFor: 'all',
    disableWhen: 'Epic campaigns, characters above PL, or house rules that ignore PL balance',
  },
  {
    id: 'enforcePPBudget',
    name: 'PP Budget Limit',
    description: 'Prevents spending more PP than available (PL × 15 + campaign adjustments)',
    category: 'pl',
    recommendedFor: 'all',
    disableWhen: 'Sandbox mode, testing builds, or campaigns without PP restrictions',
  },
  {
    id: 'enforceMinimumAbilityScore',
    name: 'Minimum Ability Score',
    description: 'Enforces minimum ability score of -5 (official M&M 3e rule)',
    category: 'pl',
    recommendedFor: 'all',
    disableWhen: 'Extremely debilitated characters or special constructs',
  },
  {
    id: 'enforceAlternateEffectCap',
    name: 'Alternate Effect Cost Cap',
    description: 'Alternate Effects cannot exceed the base power cost (array cap rule)',
    category: 'power',
    recommendedFor: 'all',
    disableWhen: 'House rules allowing stronger AEs than base power',
  },
  {
    id: 'enforceEquipmentPPLimit',
    name: 'Equipment PP Limit',
    description: 'Equipment limited to 5 PP per rank of Equipment advantage',
    category: 'power',
    recommendedFor: 'all',
    disableWhen: 'Campaigns with free equipment or custom equipment rules',
  },
  {
    id: 'enforceIncompatibleModifiers',
    name: 'Incompatible Modifiers',
    description: 'Prevents combining incompatible modifiers (e.g., Ranged + Close on same power)',
    category: 'modifier',
    recommendedFor: 'all',
    disableWhen: 'Using house rules that allow normally incompatible combinations',
  },
  {
    id: 'enforceDuplicateModifiers',
    name: 'Duplicate Modifiers',
    description: 'Prevents applying the same modifier more than once to a single power component; use ranks instead',
    category: 'modifier',
    recommendedFor: 'all',
    disableWhen: 'Importing or repairing legacy data with duplicate modifier entries',
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
    id: 'enforcePowerSpecificModifiers',
    name: 'Power-Specific Modifiers',
    description: 'Only allows modifiers that are valid for the specific power (universal or power-specific)',
    category: 'modifier',
    recommendedFor: 'optional',
    disableWhen: 'Using house rules with custom modifiers or allowing creative modifier applications',
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
  {
    id: 'enforceRequiredPowerFields',
    name: 'Required Power Fields',
    description: 'Requires configurable power fields (resistance type, sense medium, etc.) to be set at acquisition',
    category: 'power',
    recommendedFor: 'all',
    disableWhen: 'Allowing incomplete power configurations during character building',
  },
];
