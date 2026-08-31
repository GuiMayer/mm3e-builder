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
import { resolveEffectiveDuration, resolveEffectiveRange } from './effectParameters';

export type SemanticSeverity = 'error' | 'warning' | 'info';

export interface SemanticValidationIssue {
  severity: SemanticSeverity;
  path: string;
  message: string;
  messageKey?: string;
  params?: Record<string, string | number>;
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

  issues.push(...validateCoreModifierApplicability(component, effectDef, path));

  return issues;
}

function hasModifier(component: ICharacterPowerComponent, modifierId: string): boolean {
  return component.modifiers.some((modifier) => modifier.modifierId === modifierId);
}

/** Rules whose applicability is explicit and does not require GM judgment. */
function validateCoreModifierApplicability(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  path: string,
): SemanticValidationIssue[] {
  const issues: SemanticValidationIssue[] = [];

  for (const modifier of component.modifiers) {
    const modifierPath = `${path}.modifiers.${modifier.modifierId}`;
    const trigger = typeof modifier.options?.trigger === 'string'
      ? modifier.options.trigger.trim()
      : '';

    if (modifier.modifierId === 'affects_others' && effectDef.range !== 'personal') {
      issues.push(issue(modifierPath, 'Affects Others can only modify a Personal effect.'));
    }

    if (
      modifier.modifierId === 'reaction'
      && effectDef.action !== 'standard'
      && effectDef.action !== 'free'
    ) {
      issues.push(issue(modifierPath, 'Reaction can only modify an effect with a standard or free default action.'));
    }

    if (
      (modifier.modifierId === 'reaction' || modifier.modifierId === 'triggered')
      && !trigger
    ) {
      issues.push(issue(modifierPath, `${modifier.modifierId === 'reaction' ? 'Reaction' : 'Triggered'} requires a triggering circumstance.`));
    }

    if (modifier.modifierId === 'triggered' && effectDef.duration !== 'instant') {
      issues.push(issue(modifierPath, 'Triggered can only modify an Instant effect.'));
    }

  }

  const parameterDiagnostics = [
    ...resolveEffectiveRange(effectDef.range, component).diagnostics,
    ...resolveEffectiveDuration(effectDef.duration, component).diagnostics,
  ];
  for (const diagnostic of parameterDiagnostics) {
    issues.push({
      path: `${path}.modifiers.${diagnostic.modifierId}`,
      message: diagnostic.message,
      messageKey: diagnostic.messageKey,
      params: diagnostic.params,
      severity: 'warning',
    });
  }

  return issues;
}

/**
 * Enforce array constraints that are objective in the source rules. Subjective
 * array theme and GM approval remain outside automatic validation.
 */
function validateArrayRules(power: ICharacterPower): SemanticValidationIssue[] {
  const issues: SemanticValidationIssue[] = [];
  const hasDynamicAlternate = power.alternateEffects.some((alternate) => alternate.dynamic);
  const hasArray = power.alternateEffects.length > 0;

  if (power.baseDynamic && !hasDynamicAlternate) {
    issues.push(issue(
      'baseDynamic',
      'The base effect can only be Dynamic when the array has a Dynamic Alternate Effect.',
    ));
  }

  const validateArrayComponent = (
    component: ICharacterPowerComponent,
    componentPath: string,
  ) => {
    if (hasModifier(component, 'alternate_effect')) {
      issues.push(issue(
        `${componentPath}.modifiers.alternate_effect`,
        'Use the Alternate Effects section to create an array; do not apply Alternate Effect directly to a component.',
      ));
    }
    if (hasArray && hasModifier(component, 'permanent_flaw')) {
      issues.push(issue(
        `${componentPath}.modifiers.permanent_flaw`,
        'Permanent effects cannot be part of an Alternate Effect array.',
      ));
    }
  };

  for (const [componentIndex, component] of power.components.entries()) {
    validateArrayComponent(component, `components.${componentIndex}`);
  }

  for (const [alternateIndex, alternate] of power.alternateEffects.entries()) {
    for (const [componentIndex, component] of alternate.components.entries()) {
      validateArrayComponent(component, `alternateEffects.${alternateIndex}.components.${componentIndex}`);
    }
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

  issues.push(...validateArrayRules(power));

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
