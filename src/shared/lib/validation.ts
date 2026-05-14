/* ================================================
   Power Field Validation Functions
   Validates configurable power fields at acquisition.
   ================================================ */

import type { ICharacterPowerComponent, IPowerEffect } from '../../entities/types';

export interface IPowerFieldViolation {
  field: string;
  label: string;
  message: string;
}

/**
 * Validates that all required configurable fields are set for a power component.
 * Returns a violation object if validation fails, null if valid.
 */
export function validateRequiredPowerFields(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect | undefined
): IPowerFieldViolation | null {
  if (!effectDef?.configurableFields) {
    return null; // No configurable fields for this effect
  }

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
