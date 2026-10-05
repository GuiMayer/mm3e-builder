import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import { validateCharacterSemantics } from '../../shared/lib/semanticValidation';
import { getResourcePowers } from '../../shared/lib/resourcePowers';
import { I18nError } from './errors';

/** Resources can be saved before opening the Builder, with its untouched initial slot. */
function isUnconfiguredResourcePower(power: ICharacterPower): boolean {
  if (power.components.length !== 1 || power.alternateEffects.length || power.baseDynamic || power.activation) return false;
  const component = power.components[0];
  return component.effectId === '' && component.ranks === 1 && component.modifiers.length === 0
    && Object.keys(component.fieldValues ?? {}).length === 0
    && !component.variableCostOption && !component.enhancedTarget && !component.senseTraits?.length;
}

/** Validate the entire staged import before any resource or tab is persisted. */
export function validateImportedReferences(characters: ICharacter[], resources: IResource[]): void {
  const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: SKILL_DEFS, advantageDefs: ADVANTAGE_DEFS };
  for (const character of characters) {
    const error = validateCharacterSemantics(character, context).find(issue => issue.severity === 'error');
    if (error) throw new I18nError('errors.validationError', { field: error.path, message: error.message }, error);
  }
  for (const [resourceIndex, resource] of resources.entries()) {
    for (const { power, target } of getResourcePowers(resource)) {
      // Preserve the placeholder verbatim; this exception never applies to character powers
      // or partially configured resource powers, whose references still require validation.
      if (isUnconfiguredResourcePower(power)) continue;
      const error = validateCharacterSemantics(createDefaultCharacter({ powers: [power] }), context).find(issue => issue.severity === 'error');
      if (!error) continue;
      const slot = resource.type === 'vehicle'
        ? target.kind === 'movement' ? 'movement' : `systems.${resource.systems.indexOf(power)}`
        : resource.type === 'headquarters' ? `effects.${resource.effects.indexOf(power)}` : 'power';
      const path = error.path.replace(/^powers\.0/, `resources.${resourceIndex}.${slot}`);
      throw new I18nError('errors.validationError', { field: path, message: error.message }, error);
    }
  }
}
