import type {
  IAdvantageDef,
  ICharacter,
  ICharacterPower,
  ICharacterPowerComponent,
  IModifierDef,
  IPowerEffect,
  ISkillDef,
  IValidationRules,
} from '../../entities/types';
import { validateComponentModifiers } from './modifierValidation';
import { validateRequiredPowerFields } from './validation';

export type SemanticSeverity = 'error' | 'warning' | 'info';

export interface SemanticValidationIssue {
  severity: SemanticSeverity;
  path: string;
  message: string;
}

interface GameDataContext {
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  skillDefs?: ISkillDef[];
  advantageDefs?: IAdvantageDef[];
}

function issue(path: string, message: string, severity: SemanticSeverity = 'error'): SemanticValidationIssue {
  return { path, message, severity };
}

/**
 * Check if a modifierId is valid for a given effectId.
 * Searches in both:
 * 1. Universal modifiers (from modifiers.json)
 * 2. Effect-specific extras/flaws (from powers.json[effectId].extras[] and .flaws[])
 *
 * Returns true if the modifier is found in either location.
 */
function isValidModifierForEffect(
  modifierId: string,
  effectId: string,
  context: GameDataContext
): boolean {
  // Check universal modifiers first
  if (context.modifierDefs.some((def) => def.id === modifierId)) {
    return true;
  }

  // Check effect-specific extras and flaws
  const effectDef = context.powerDefs.find((def) => def.id === effectId);
  if (!effectDef) {
    return false; // Effect not found, so modifier can't be valid for it
  }

  // Check extras
  if (effectDef.extras.some((extra) => extra.id === modifierId)) {
    return true;
  }

  // Check flaws
  if (effectDef.flaws.some((flaw) => flaw.id === modifierId)) {
    return true;
  }

  return false;
}

function validatePowerComponentForSave(
  component: ICharacterPowerComponent,
  path: string,
  rules: IValidationRules,
  context: GameDataContext
): SemanticValidationIssue[] {
  const issues: SemanticValidationIssue[] = [];
  const effectDef = context.powerDefs.find((def) => def.id === component.effectId);

  if (!effectDef) {
    issues.push(issue(`${path}.effectId`, `Unknown power effect "${component.effectId}".`));
    return issues;
  }

  if (effectDef.variableCost?.options?.length && !component.variableCostOption) {
    issues.push(issue(`${path}.variableCostOption`, `${effectDef.name} requires a variable cost option.`));
  }

  if (rules.enforceRequiredPowerFields) {
    const fieldViolation = validateRequiredPowerFields(component, effectDef);
    if (fieldViolation) {
      issues.push(issue(`${path}.fieldValues.${fieldViolation.field}`, fieldViolation.message));
    }
  }

  const modifierViolations = validateComponentModifiers(
    component,
    effectDef,
    context.modifierDefs,
    rules,
  );

  for (const violation of modifierViolations) {
    issues.push(issue(`${path}.modifiers.${violation.modifierId}`, violation.message));
  }

  return issues;
}

export function validatePowerForSave(
  power: ICharacterPower,
  rules: IValidationRules,
  context: GameDataContext,
): SemanticValidationIssue[] {
  const issues: SemanticValidationIssue[] = [];
  const components = power.components.filter((component) => component.effectId !== '');

  if (components.length === 0) {
    issues.push(issue('components', 'Power must have at least one selected effect.'));
  }

  components.forEach((component, index) => {
    issues.push(...validatePowerComponentForSave(component, `components.${index}`, rules, context));
  });

  const alternateEffectNames = new Set<string>();
  power.alternateEffects.forEach((ae, aeIndex) => {
    const trimmedName = ae.name.trim();
    const normalizedName = trimmedName.toLowerCase();

    if (!trimmedName) {
      issues.push(issue(
        `alternateEffects.${aeIndex}.name`,
        `Alternate Effect ${aeIndex + 1} has no name.`,
        'warning',
      ));
    } else if (alternateEffectNames.has(normalizedName)) {
      issues.push(issue(
        `alternateEffects.${aeIndex}.name`,
        `Duplicate Alternate Effect name "${ae.name}". Each Alternate Effect must have a unique name.`,
      ));
    }

    if (normalizedName) {
      alternateEffectNames.add(normalizedName);
    }

    ae.components
      .filter((component) => component.effectId !== '')
      .forEach((component, componentIndex) => {
        issues.push(...validatePowerComponentForSave(
          component,
          `alternateEffects.${aeIndex}.components.${componentIndex}`,
          rules,
          context,
        ));
      });
  });

  return issues;
}

function validatePowerReferences(
  power: ICharacterPower,
  path: string,
  context: GameDataContext
): SemanticValidationIssue[] {
  const issues: SemanticValidationIssue[] = [];
  const validateComponentRefs = (component: ICharacterPowerComponent, componentPath: string) => {
    if (!context.powerDefs.some((def) => def.id === component.effectId)) {
      issues.push(issue(`${componentPath}.effectId`, `Unknown power effect "${component.effectId}".`));
      return; // Stop validating modifiers if effect is unknown
    }

    // Validate modifiers: check both universal modifiers and effect-specific extras/flaws
    for (const [modifierIndex, modifier] of component.modifiers.entries()) {
      if (!isValidModifierForEffect(modifier.modifierId, component.effectId, context)) {
        issues.push(issue(
          `${componentPath}.modifiers.${modifierIndex}.modifierId`,
          `Unknown modifier "${modifier.modifierId}".`,
        ));
      }
    }
  };

  power.components.forEach((component, index) => validateComponentRefs(component, `${path}.components.${index}`));
  power.alternateEffects.forEach((ae, aeIndex) => {
    ae.components.forEach((component, componentIndex) => {
      validateComponentRefs(component, `${path}.alternateEffects.${aeIndex}.components.${componentIndex}`);
    });
  });

  return issues;
}

export function validateCharacterSemantics(
  character: ICharacter,
  context: GameDataContext,
): SemanticValidationIssue[] {
  const issues: SemanticValidationIssue[] = [];
  const skillIds = new Set(context.skillDefs?.map((skill) => skill.id) ?? []);
  const advantageIds = new Set(context.advantageDefs?.map((advantage) => advantage.id) ?? []);

  character.skills.forEach((skill, index) => {
    if (skillIds.size > 0 && !skillIds.has(skill.skillId)) {
      issues.push(issue(`skills.${index}.skillId`, `Unknown skill "${skill.skillId}".`));
    }
  });

  character.advantages.forEach((advantage, index) => {
    if (advantageIds.size > 0 && !advantageIds.has(advantage.advantageId)) {
      issues.push(issue(`advantages.${index}.advantageId`, `Unknown advantage "${advantage.advantageId}".`));
      return;
    }

    // Validate subtype requirements
    const advantageDef = context.advantageDefs?.find((def) => def.id === advantage.advantageId);
    if (advantageDef) {
      // Check if advantage requires a subtype but doesn't have one
      if (advantageDef.subtypeRequired && (!advantage.subtype || advantage.subtype.trim() === '')) {
        issues.push(issue(
          `advantages.${index}.subtype`,
          `Advantage "${advantageDef.name}" requires a subtype.`,
        ));
      }

      // For skill-based advantages with subtypes, validate against known skills
      // Skill-based advantages are those with advantageType === 'skill' and have a subtypePrompt
      if (
        advantageDef.advantageType === 'skill' &&
        advantageDef.subtypePrompt &&
        advantage.subtype &&
        advantage.subtype.trim() !== ''
      ) {
        const skillExists = context.skillDefs?.some(
          (skill) => skill.name.toLowerCase() === advantage.subtype!.toLowerCase()
        );
        if (!skillExists && context.skillDefs && context.skillDefs.length > 0) {
          issues.push(issue(
            `advantages.${index}.subtype`,
            `Subtype "${advantage.subtype}" for advantage "${advantageDef.name}" must be a valid skill name.`,
            'warning',
          ));
        }
      }
    }
  });

  character.powers.forEach((power, index) => {
    issues.push(...validatePowerReferences(power, `powers.${index}`, context));
  });

  (character.equipment ?? []).forEach((item, index) => {
    issues.push(...validatePowerReferences(item, `equipment.${index}`, context));
  });

  return issues;
}
