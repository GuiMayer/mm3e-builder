import type { ICharacter, IResource } from '../../entities/types';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import { validateCharacterSemantics } from '../../shared/lib/semanticValidation';
import { getResourcePowers } from '../../shared/lib/resourcePowers';
import { I18nError } from './errors';
/** Validate the entire staged import before any resource or tab is persisted. */
export function validateImportedReferences(characters: ICharacter[], resources: IResource[]): void {
  const context = { powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: SKILL_DEFS, advantageDefs: ADVANTAGE_DEFS };
  for (const character of [...characters, ...resources.map(resource => createDefaultCharacter({ powers: getResourcePowers(resource).map(entry => entry.power) }))]) {
    const error = validateCharacterSemantics(character, context).find(issue => issue.severity === 'error');
    if (error) throw new I18nError('errors.validationError', { field: error.path, message: error.message }, error);
  }
}
