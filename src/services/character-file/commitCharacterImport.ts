import type { ICharacter, IResource } from '../../entities/types';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { captureDraftRollback, getLastDraftSaveError, saveDraftMulti } from '../storage/characterDraftStorage';
import { captureResourceRollback } from '../storage/resourceRollback';
import { preserveResourceImportBackup } from '../storage/resourceImportBackup';
import { I18nError } from './errors';

/** Synchronous commit after portrait I/O; snapshots never span an async pause. */
export function commitCharacterImport(character: ICharacter, resources: IResource[], replaceExisting: boolean, tabId?: string): void {
  const previous = useCharactersStore.getState();
  if (tabId && !previous.getCharacterById(tabId)) throw new I18nError('characterImport.destinationMissing');
  const rollbackDraft = captureDraftRollback();
  const resourceWrite = captureResourceRollback();
  let changedCharacters = false;
  try {
    if (resources.length) {
      if (replaceExisting && !preserveResourceImportBackup()) throw new I18nError('resources.error.storageWrite');
      if (!useResourcesStore.getState().upsertResources(resources, replaceExisting)) {
        throw new I18nError(useResourcesStore.getState().storageError ?? 'resources.error.storageWrite');
      }
      resourceWrite.markWritten();
    }
    if (tabId) {
      previous.replaceCharacter(tabId, character);
      previous.setActiveCharacter(tabId);
    } else previous.addCharacter(character);
    changedCharacters = true;
    const current = useCharactersStore.getState();
    if (!saveDraftMulti(current.tabs, current.activeCharacterId)) throw new I18nError(getLastDraftSaveError() ?? 'draft.error.storageWrite');
  } catch (error) {
    if (changedCharacters) useCharactersStore.setState(previous);
    // Attempt both compensations, preserving newer external values on conflict.
    const failures: unknown[] = [];
    try { resourceWrite.rollback(); } catch (failure) { failures.push(failure); }
    try { rollbackDraft(); } catch (failure) { failures.push(failure); }
    if (failures.length) throw new I18nError('creation.recoveryError');
    throw error;
  }
}
