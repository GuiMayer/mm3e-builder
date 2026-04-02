import { CharacterFileSchema } from '../entities/schemas';
import type { ICharacter, ICharacterFile } from '../entities/types';
import { downloadBlob } from './downloadHelper';

const CURRENT_SCHEMA_VERSION = '1.0.0';
const DRAFT_KEY = 'mm3e-draft-character';

/**
 * Custom error class that carries i18n translation keys and parameters.
 * The calling component resolves these via t(key, params).
 */
export class I18nError extends Error {
  i18nKey: string;
  i18nParams?: Record<string, string>;

  constructor(i18nKey: string, i18nParams?: Record<string, string>) {
    super(i18nKey);
    this.name = 'I18nError';
    this.i18nKey = i18nKey;
    this.i18nParams = i18nParams;
  }
}

/**
 * Export character to a downloadable .json file.
 */
export async function exportCharacterJSON(character: ICharacter, language: string = 'en', filename?: string): Promise<void> {
  const file: ICharacterFile = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    language,
    character,
  };

  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const name = filename || `${character.header.name || 'character'}.json`;
  await downloadBlob(blob, name);
}

/**
 * Import and validate a character from a JSON file.
 * Returns the character or throws I18nError with translation keys.
 */
export async function importCharacterJSON(file: File): Promise<ICharacter> {
  const text = await file.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new I18nError('errors.invalidJson');
  }

  const result = CharacterFileSchema.safeParse(parsed);

  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new I18nError('errors.validationError', {
      field: firstError.path.join('.'),
      message: firstError.message,
    });
  }

  // TODO: Schema migration logic (v1.0 -> v1.1, etc.)

  return result.data.character;
}

/**
 * Save draft to localStorage (auto-save).
 * Returns false if QuotaExceededError occurs.
 */
export function saveDraft(character: ICharacter): boolean {
  try {
    const file: ICharacterFile = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      character,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(file));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      // Fallback: auto-export
      exportCharacterJSON(character, 'en', 'emergency-backup.json');
      return false;
    }
    return false;
  }
}

/**
 * Load draft from localStorage.
 */
export function loadDraft(): ICharacter | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const result = CharacterFileSchema.safeParse(parsed);
    if (!result.success) return null;

    return result.data.character;
  } catch {
    return null;
  }
}

/**
 * Clear draft from localStorage.
 */
export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}
