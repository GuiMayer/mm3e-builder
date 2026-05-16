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

  power.alternateEffects.forEach((ae, aeIndex) => {
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
    }

    for (const [modifierIndex, modifier] of component.modifiers.entries()) {
      if (!context.modifierDefs.some((def) => def.id === modifier.modifierId)) {
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
