/**
 * Compatibility facade. New code should import from character-file or storage.
 */
export { I18nError } from './character-file/errors';
export { exportCharacterJSON } from './character-file/exportCharacter';
export { importCharacterJSON } from './character-file/importCharacter';
export { importResourceAppendix } from './character-file/importResourceAppendix';
export {
  clearDraft,
  getDraftMetadata,
  loadDraft,
  saveDraft,
} from './storage/legacyDraftStorage';
export {
  clearDraftMulti,
  getDraftMetadataMulti,
  getLastDraftSaveError,
  loadDraftMulti,
  hasStoredDraft,
  preserveStoredDraftBeforeNextSave,
  saveDraftMulti,
  replaceDraftMulti,
} from './storage/characterDraftStorage';
