import type { Package } from '../../data/archetypes/model';
import { CharacterSchema } from '../../entities/schemas';
import { ResourceSchema } from '../../services/storage/resourceLibraryStorage';
import { validateImportedReferences } from '../../services/character-file/validateImportedReferences';
import { captureDraftRollback, saveDraftMulti } from '../../services/storage/characterDraftStorage';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';

/** Commit only a reviewed package; compensate both stores and durable data on failure. */
export function commitCharacterCreation({ character, resources }: Package): string {
  const previous = useCharactersStore.getState();
  if (!previous.isDraftHydrated) throw new Error('creation.startupPending');
  CharacterSchema.parse(character);
  resources.forEach(resource => ResourceSchema.parse(resource));
  validateImportedReferences([character], resources);
  const previousResources = useResourcesStore.getState();
  const previousLibrary = localStorage.getItem('mm3e-resource-library');
  const rollbackDraft = captureDraftRollback();
  let wroteResources = false;
  try {
    if (resources.length) {
      if (!previousResources.upsertResources(resources)) throw new Error('creation.storageError');
      wroteResources = true;
    }
    const id = previous.addCharacter(character);
    const current = useCharactersStore.getState();
    if (!saveDraftMulti(current.tabs, current.activeCharacterId)) throw new Error('creation.storageError');
    return id;
  } catch (error) {
    useCharactersStore.setState(previous);
    useResourcesStore.setState(previousResources);
    try {
      if (wroteResources) {
        if (previousLibrary === null) localStorage.removeItem('mm3e-resource-library');
        else localStorage.setItem('mm3e-resource-library', previousLibrary);
      }
      rollbackDraft();
    } catch { throw new Error('creation.recoveryError', { cause: error }); }
    throw error;
  }
}
