import { SCHEMA_VERSION } from '../../entities/constants';
import { CharacterFileSchema } from '../../entities/schemas';
import type { ICharacter, ICharacterFile } from '../../entities/types';
import { exportCharacterJSON } from '../character-file/exportCharacter';
import { normalizeCharacter } from '../character-file/normalizeCharacter';

const DRAFT_KEY = 'mm3e-draft-character';
let lastSavedJSON = '';

/** @deprecated Kept only to migrate and support the original single draft. */
export function saveDraft(character: ICharacter): boolean {
  try {
    const characterJSON = JSON.stringify(character);
    if (characterJSON === lastSavedJSON) return true;

    const file: ICharacterFile = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      character,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(file));
    localStorage.setItem(
      `${DRAFT_KEY}-metadata`,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        characterName: character.header.name || 'Unnamed Character',
        powerLevel: character.header.powerLevel,
      })
    );
    lastSavedJSON = characterJSON;
    return true;
  } catch (error) {
    console.error('[saveDraft] Error saving draft:', error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      void exportCharacterJSON(character, 'en', 'emergency-backup.json');
    }
    return false;
  }
}

/** @deprecated Use the multi-character draft loader in new code. */
export function loadDraft(): ICharacter | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const result = CharacterFileSchema.safeParse(JSON.parse(stored));
    if (!result.success) return null;

    const character = normalizeCharacter(result.data.character as ICharacter);
    lastSavedJSON = JSON.stringify(character);
    return character;
  } catch (error) {
    console.error('[loadDraft] Error loading draft:', error);
    return null;
  }
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(`${DRAFT_KEY}-metadata`);
  lastSavedJSON = '';
}

export interface LegacyDraftMetadata {
  timestamp: string;
  characterName: string;
  powerLevel: number;
}

export function getDraftMetadata(): LegacyDraftMetadata | null {
  try {
    const stored = localStorage.getItem(`${DRAFT_KEY}-metadata`);
    return stored ? (JSON.parse(stored) as LegacyDraftMetadata) : null;
  } catch {
    return null;
  }
}
