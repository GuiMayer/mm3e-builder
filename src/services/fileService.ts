import { CharacterFileSchema } from '../entities/schemas';
import type { ICharacter, ICharacterFile } from '../entities/types';
import { downloadBlob, sanitizeFileName } from './downloadHelper';
import { migratePowers, migrateEquipment } from '../shared/lib/powerMigration';
import { SCHEMA_VERSION, SUPPORTED_SCHEMA_VERSIONS } from '../entities/constants';
import { ADVANTAGE_DEFS, MODIFIER_DEFS, POWER_DEFS, SKILL_DEFS } from '../entities/gameDataLoaders';
import { validateCharacterSemantics } from '../shared/lib/semanticValidation';
import type { CharacterTab } from '../store/charactersStore';

// Storage keys
const DRAFT_KEY = 'mm3e-draft-character';           // Legacy single-character key
const DRAFT_KEY_MULTI = 'mm3e-draft-characters';    // New multi-character key
const DRAFT_METADATA_KEY = 'mm3e-draft-metadata';
const DRAFT_VERSION = 1;

// Cache the last saved JSON to prevent redundant saves
let lastSavedJSON = '';
const characterHashCache = new Map<string, string>();

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
 * Sanitize character data before export to prevent injection attacks and data leaks.
 * - Removes any potentially dangerous fields
 * - Validates that all required fields are present
 * - Ensures data structure integrity
 */
function sanitizeCharacterForExport(character: ICharacter): ICharacter {
  // Create a clean copy with only safe fields
  const sanitized: ICharacter = {
    characterId: character.characterId, // Preserve unique ID for cross-device sync
    header: {
      name: character.header.name || 'Unnamed',
      player: character.header.player || '',
      identity: character.header.identity || '',
      identityType: character.header.identityType,
      base: character.header.base || '',
      powerLevel: Math.max(1, Math.min(15, character.header.powerLevel || 1)), // Clamp to valid range
      heroPoints: Math.max(0, character.header.heroPoints || 0),
      gender: character.header.gender,
      age: character.header.age,
      height: character.header.height,
      weight: character.header.weight,
      eyes: character.header.eyes,
      hair: character.header.hair,
      groupAffiliation: character.header.groupAffiliation,
      series: character.header.series,
      gameMaster: character.header.gameMaster,
    },
    abilities: {
      str: character.abilities.str || 0,
      sta: character.abilities.sta || 0,
      agl: character.abilities.agl || 0,
      dex: character.abilities.dex || 0,
      fgt: character.abilities.fgt || 0,
      int: character.abilities.int || 0,
      awe: character.abilities.awe || 0,
      pre: character.abilities.pre || 0,
    },
    absentAbilities: Array.isArray(character.absentAbilities) ? character.absentAbilities : [],
    defenses: {
      dodge: Math.max(0, character.defenses.dodge || 0),
      parry: Math.max(0, character.defenses.parry || 0),
      fortitude: Math.max(0, character.defenses.fortitude || 0),
      will: Math.max(0, character.defenses.will || 0),
    },
    skills: Array.isArray(character.skills) ? character.skills : [],
    advantages: Array.isArray(character.advantages) ? character.advantages : [],
    powers: Array.isArray(character.powers) ? character.powers : [],
    complications: Array.isArray(character.complications) ? character.complications : [],
    equipmentNotes: character.equipmentNotes || '',
    equipment: Array.isArray(character.equipment) ? character.equipment : [],
    notes: character.notes,
    manualOffenseRows: character.manualOffenseRows,
    campaignMode: character.campaignMode || false,
    ppLog: character.ppLog,
  };

  return sanitized;
}

/**
 * Export character to a downloadable .json file with security enhancements.
 * - Sanitizes character data before export
 * - Validates filename for safe downloads
 */
export async function exportCharacterJSON(character: ICharacter, language: string = 'en', filename?: string): Promise<void> {
  // Warn if character doesn't have characterId (shouldn't happen after migration)
  if (!character.characterId) {
    console.warn('[fileService] Exporting character without characterId. This should not happen after migration.');
  }

  // Sanitize character data
  const sanitized = sanitizeCharacterForExport(character);

  const file: ICharacterFile = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    language,
    character: sanitized,
  };

  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const name = filename || `${sanitizeFileName(character.header.name)}.json`;
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
  const character = {
    ...raw,
    powers: migratePowers(raw.powers as unknown[]),
    equipment: migrateEquipment((raw.equipment as unknown[]) ?? []),
  };

  const semanticErrors = validateCharacterSemantics(character, {
    powerDefs: POWER_DEFS,
    modifierDefs: MODIFIER_DEFS,
    skillDefs: SKILL_DEFS,
    advantageDefs: ADVANTAGE_DEFS,
  }).filter((validationIssue) => validationIssue.severity === 'error');

  if (semanticErrors.length > 0) {
    const firstError = semanticErrors[0];
    throw new I18nError('errors.validationError', {
      field: firstError.path,
      message: firstError.message,
    });
  }

  return character;
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
    // Compare only character data, not the full file with timestamp
    const characterJSON = JSON.stringify(character);
    
    // Skip save if content hasn't changed (prevents redundant saves and loops)
    if (characterJSON === lastSavedJSON) {
      console.log('[saveDraft] Skipping save - content unchanged');
      return true;
    }
    
    console.log('[saveDraft] Saving draft to localStorage...', {
      characterName: character.header.name,
      key: DRAFT_KEY,
      size: characterJSON.length
    });
    
    const file: ICharacterFile = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      character,
    };
    const json = JSON.stringify(file);
    
    localStorage.setItem(DRAFT_KEY, json);
    lastSavedJSON = characterJSON; // Store only character JSON for comparison
    
    // Store metadata separately for quick access without parsing full character
    const metadata = {
      timestamp: new Date().toISOString(),
      characterName: character.header.name || 'Unnamed Character',
      powerLevel: character.header.powerLevel,
    };
    localStorage.setItem(DRAFT_KEY + '-metadata', JSON.stringify(metadata));
    
    console.log('[saveDraft] Draft saved successfully');
    return true;
  } catch (e) {
    console.error('[saveDraft] Error saving draft:', e);
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
 * Syncs lastSavedJSON to prevent redundant saves after load.
 */
export function loadDraft(): ICharacter | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) {
      console.log('[loadDraft] No draft found in localStorage');
      return null;
    }

    console.log('[loadDraft] Draft found, parsing...');
    const parsed = JSON.parse(stored);
    const result = CharacterFileSchema.safeParse(parsed);
    if (!result.success) {
      console.error('[loadDraft] Draft validation failed:', result.error);
      return null;
    }

    const raw = result.data.character;
    const character = {
      ...raw,
      powers: migratePowers(raw.powers as unknown[]),
      equipment: migrateEquipment((raw.equipment as unknown[]) ?? []),
    };

    // Sync lastSavedJSON with character data only (not full file with timestamp)
    lastSavedJSON = JSON.stringify(character);
    console.log('[loadDraft] Draft loaded and lastSavedJSON synced');

    return character;
  } catch (error) {
    console.error('[loadDraft] Error loading draft:', error);
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

/* ================================================
   Multi-Character Draft System (Phase 2)
   ================================================ */

interface MultiCharacterDraft {
  version: number;
  activeCharacterId: string | null;
  characters: {
    id: string;
    character: ICharacter;
    label: string;
    lastModified: number;
  }[];
  savedAt: string;
}

interface DraftMetadataMulti {
  version: number;
  characterCount: number;
  activeCharacterName: string;
  characterNames: string[];
  totalSize: number;
  savedAt: string;
}

/**
 * Generate hash for character to detect changes
 */
function hashCharacter(char: ICharacter): string {
  const json = JSON.stringify(char);
  return json.length + '_' + json.slice(0, 100);
}

/**
 * Save multiple character tabs to localStorage (auto-save).
 * Returns false if QuotaExceededError occurs.
 */
export function saveDraftMulti(tabs: CharacterTab[], activeId: string | null): boolean {
  try {
    // Check if any characters have changed using hash cache
    let hasChanges = false;
    for (const tab of tabs) {
      const currentHash = hashCharacter(tab.character);
      const cachedHash = characterHashCache.get(tab.id);
      if (currentHash !== cachedHash) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges) {
      console.log('[saveDraftMulti] Skipping save - no changes detected');
      return true;
    }

    console.log('[saveDraftMulti] Saving draft to localStorage...', {
      characterCount: tabs.length,
      activeId,
      key: DRAFT_KEY_MULTI,
    });

    const draft: MultiCharacterDraft = {
      version: DRAFT_VERSION,
      activeCharacterId: activeId,
      characters: tabs.map((tab) => ({
        id: tab.id,
        character: tab.character,
        label: tab.label,
        lastModified: tab.lastModified,
      })),
      savedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(draft);
    localStorage.setItem(DRAFT_KEY_MULTI, json);

    // Update hash cache
    tabs.forEach((tab) => {
      characterHashCache.set(tab.id, hashCharacter(tab.character));
    });

    // Store metadata separately
    const metadata: DraftMetadataMulti = {
      version: DRAFT_VERSION,
      characterCount: tabs.length,
      activeCharacterName:
        activeId
          ? tabs.find((t) => t.id === activeId)?.label || 'Unnamed Character'
          : 'No active character',
      characterNames: tabs.map((t) => t.label),
      totalSize: json.length,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_METADATA_KEY, JSON.stringify(metadata));

    console.log('[saveDraftMulti] Draft saved successfully');
    return true;
  } catch (e) {
    console.error('[saveDraftMulti] Error saving draft:', e);
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      // Fallback: export all characters as emergency backup
      console.error('[saveDraftMulti] localStorage quota exceeded - emergency export triggered');
      return false;
    }
    return false;
  }
}

/**
 * Load multiple character tabs from localStorage.
 */
export function loadDraftMulti(): { tabs: CharacterTab[]; activeId: string | null } | null {
  try {
    // Try to load new multi-character format first
    const stored = localStorage.getItem(DRAFT_KEY_MULTI);
    
    if (stored) {
      console.log('[loadDraftMulti] Multi-character draft found, parsing...');
      const parsed = JSON.parse(stored) as MultiCharacterDraft;

      // Validate version
      if (parsed.version !== DRAFT_VERSION) {
        console.warn(`[loadDraftMulti] Unknown version ${parsed.version}`);
      }

      // Reconstruct tabs with migrations
      const tabs: CharacterTab[] = parsed.characters.map((char) => ({
        id: char.id,
        character: {
          ...char.character,
          powers: migratePowers(char.character.powers as unknown[]),
          equipment: migrateEquipment((char.character.equipment as unknown[]) ?? []),
        },
        label: char.label,
        isDirty: false,
        lastModified: char.lastModified,
      }));

      // Update hash cache
      tabs.forEach((tab) => {
        characterHashCache.set(tab.id, hashCharacter(tab.character));
      });

      console.log('[loadDraftMulti] Draft loaded successfully', { count: tabs.length });
      return { tabs, activeId: parsed.activeCharacterId };
    }

    // Try legacy migration
    console.log('[loadDraftMulti] No multi-character draft, attempting legacy migration...');
    return migrateLegacyDraft();
  } catch (error) {
    console.error('[loadDraftMulti] Error loading draft:', error);
    return null;
  }
}

/**
 * Migrate legacy single-character draft to multi-character format.
 */
function migrateLegacyDraft(): { tabs: CharacterTab[]; activeId: string | null } | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) {
      console.log('[migrateLegacyDraft] No legacy draft found');
      return null;
    }

    console.log('[migrateLegacyDraft] Legacy draft found, migrating...');
    const parsed = JSON.parse(stored);
    const result = CharacterFileSchema.safeParse(parsed);
    
    if (!result.success) {
      console.error('[migrateLegacyDraft] Legacy draft validation failed:', result.error);
      return null;
    }

    const character = {
      ...result.data.character,
      powers: migratePowers(result.data.character.powers as unknown[]),
      equipment: migrateEquipment((result.data.character.equipment as unknown[]) ?? []),
    };

    // Create single tab from legacy character
    const newId = crypto.randomUUID();
    const tab: CharacterTab = {
      id: newId,
      character,
      label: character.header.name || 'Unnamed Character',
      isDirty: false,
      lastModified: Date.now(),
    };

    // Save to new format
    const success = saveDraftMulti([tab], newId);
    
    if (success) {
      // Only delete legacy draft after successful save
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_KEY + '-metadata');
      localStorage.setItem('mm3e-multi-char-migrated', 'true');
      console.log('[migrateLegacyDraft] Migration successful');
      
      return { tabs: [tab], activeId: newId };
    }

    console.error('[migrateLegacyDraft] Failed to save migrated draft');
    return null;
  } catch (error) {
    console.error('[migrateLegacyDraft] Error during migration:', error);
    return null;
  }
}

/**
 * Get multi-character draft metadata.
 */
export function getDraftMetadataMulti(): DraftMetadataMulti | null {
  try {
    const stored = localStorage.getItem(DRAFT_METADATA_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as DraftMetadataMulti;
  } catch {
    return null;
  }
}

/**
 * Clear all draft data (both legacy and multi-character).
 */
export function clearDraftMulti(): void {
  // Clear new format
  localStorage.removeItem(DRAFT_KEY_MULTI);
  localStorage.removeItem(DRAFT_METADATA_KEY);

  // Clear legacy format
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(DRAFT_KEY + '-metadata');

  // Clear hash cache
  characterHashCache.clear();
  lastSavedJSON = '';

  console.log('[clearDraftMulti] All drafts cleared');
}
