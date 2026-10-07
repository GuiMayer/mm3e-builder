import type { Package } from '../../data/archetypes/model';
import { CharacterSchema } from '../../entities/schemas';
import { ResourceSchema } from '../../services/storage/resourceLibraryStorage';
import { validateImportedReferences } from '../../services/character-file/validateImportedReferences';
import { captureDraftRollback, saveDraftMulti } from '../../services/storage/characterDraftStorage';
import { captureResourceRollback } from '../../services/storage/resourceRollback';
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
  const rollbackDraft = captureDraftRollback();
  const resourceWrite = captureResourceRollback();
  try {
    if (resources.length) {
      if (!previousResources.upsertResources(resources)) throw new Error('creation.storageError');
      resourceWrite.markWritten();
    }
    const id = previous.addCharacter(character);
    const current = useCharactersStore.getState();
    if (!saveDraftMulti(current.tabs, current.activeCharacterId)) throw new Error('creation.storageError');
    return id;
  } catch (error) {
    useCharactersStore.setState(previous);
    try {
      try { resourceWrite.rollback(); } finally { rollbackDraft(); }
    } catch { throw new Error('creation.recoveryError', { cause: error }); }
    throw error;
  }
}
