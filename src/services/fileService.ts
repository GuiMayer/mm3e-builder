/**
 * Compatibility facade. New code should import from character-file or storage.
 */
export { I18nError } from './character-file/errors';
export { exportCharacterJSON } from './character-file/exportCharacter';
export { importCharacterJSON } from './character-file/importCharacter';
export {
  clearDraft,
  getDraftMetadata,
  loadDraft,
  saveDraft,
} from './storage/legacyDraftStorage';
export {
  clearDraftMulti,
  getDraftMetadataMulti,
  loadDraftMulti,
  saveDraftMulti,
} from './storage/characterDraftStorage';
