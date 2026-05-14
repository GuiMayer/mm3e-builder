import { CharacterFileSchema } from '../entities/schemas';
import type { ICharacter, ICharacterFile } from '../entities/types';
import { downloadBlob } from './downloadHelper';
import { migratePowers, migrateEquipment } from '../shared/lib/powerMigration';
import { SCHEMA_VERSION, SUPPORTED_SCHEMA_VERSIONS } from '../entities/constants';
const DRAFT_KEY = 'mm3e-draft-character';

// Cache the last saved JSON to prevent redundant saves
let lastSavedJSON = '';

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
    schemaVersion: SCHEMA_VERSION,
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

  // Warn when the file's schema version is not in the supported list
  const fileVersion = (parsed as Record<string, unknown>)?.schemaVersion as string | undefined;
  if (fileVersion && !SUPPORTED_SCHEMA_VERSIONS.includes(fileVersion)) {
    console.warn(
      `[fileService] Importing file with unknown schema version "${fileVersion}". ` +
      `Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`
    );
  }

  const raw = result.data.character;
  return {
    ...raw,
    powers: migratePowers(raw.powers as unknown[]),
    equipment: migrateEquipment((raw.equipment as unknown[]) ?? []),
  };
}

/**
 * Save draft to localStorage (auto-save).
 * Returns false if QuotaExceededError occurs.
 * Includes metadata: timestamp and character name for better UX.
 * 
 * Protection: Skips save if character data hasn't changed since last save
 * to prevent redundant localStorage writes and potential infinite loops.
 */
export function saveDraft(character: ICharacter): boolean {
  try {
    const file: ICharacterFile = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      character,
    };
    const json = JSON.stringify(file);
    
    // Skip save if content hasn't changed (prevents redundant saves and loops)
    if (json === lastSavedJSON) {
      return true;
    }
    
    localStorage.setItem(DRAFT_KEY, json);
    lastSavedJSON = json;
    
    // Store metadata separately for quick access without parsing full character
    const metadata = {
      timestamp: new Date().toISOString(),
      characterName: character.header.name || 'Unnamed Character',
      powerLevel: character.header.powerLevel,
    };
    localStorage.setItem(DRAFT_KEY + '-metadata', JSON.stringify(metadata));
    
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

    const raw = result.data.character;
    return {
      ...raw,
      powers: migratePowers(raw.powers as unknown[]),
      equipment: migrateEquipment((raw.equipment as unknown[]) ?? []),
    };
  } catch {
    return null;
  }
}

/**
 * Clear draft from localStorage.
 * Also clears the save cache to ensure fresh saves after clearing.
 */
export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(DRAFT_KEY + '-metadata');
  // Clear the save cache so next save will work properly
  lastSavedJSON = '';
}

/**
 * Get draft metadata without loading the full character.
 * Useful for showing draft info in UI without parsing the entire character.
 */
export function getDraftMetadata(): { timestamp: string; characterName: string; powerLevel: number } | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY + '-metadata');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
