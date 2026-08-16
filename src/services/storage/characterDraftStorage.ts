import { z } from 'zod';
import { CharacterFileSchema, CharacterSchema } from '../../entities/schemas';
import type { ICharacter } from '../../entities/types';
import type { CharacterTab } from '../../entities/characterTab';
import { normalizeCharacter } from '../character-file/normalizeCharacter';
import { createDefaultCharacter } from '../../entities/characterDefaults';

const LEGACY_DRAFT_KEY = 'mm3e-draft-character';
const DRAFT_KEY = 'mm3e-draft-characters';
const DRAFT_METADATA_KEY = 'mm3e-draft-metadata';
const DRAFT_BACKUP_KEY = 'mm3e-draft-characters-backup-v1';
const LEGACY_DRAFT_BACKUP_KEY = 'mm3e-draft-character-backup-v1';
const DRAFT_VERSION = 1;

const StoredCharacterTabSchema = z.object({
  id: z.string(),
  character: CharacterSchema,
  label: z.string(),
  lastModified: z.number(),
});

const MultiCharacterDraftSchema = z.object({
  version: z.number().int(),
  activeCharacterId: z.string().nullable(),
  characters: z.array(StoredCharacterTabSchema),
  savedAt: z.string(),
});

const DraftMetadataSchema = z.object({
  version: z.number().int(),
  characterCount: z.number().int().min(0),
  activeCharacterName: z.string(),
  characterNames: z.array(z.string()),
  totalSize: z.number().int().min(0),
  savedAt: z.string(),
});

export type DraftMetadataMulti = z.infer<typeof DraftMetadataSchema>;

let lastSavedSignature = '';
let lastDraftSaveError: string | null = null;

function toStoredCharacters(tabs: CharacterTab[]) {
  return tabs.map((tab) => ({
    id: tab.id,
    character: tab.character,
    label: tab.label,
    lastModified: tab.lastModified,
  }));
}

function createDraftSignature(
  tabs: CharacterTab[],
  activeCharacterId: string | null
): string {
  return JSON.stringify({
    activeCharacterId,
    characters: toStoredCharacters(tabs),
  });
}

function addMissingCharacterIds(tabs: CharacterTab[]): CharacterTab[] {
  return tabs.map((tab) =>
    tab.character.characterId
      ? tab
      : {
          ...tab,
          character: {
            ...tab.character,
            characterId: tab.id,
          },
        }
  );
}

/**
 * Saves the complete multi-character draft while preserving the established
 * localStorage keys and serialized format.
 */
export function saveDraftMulti(
  tabs: CharacterTab[],
  activeCharacterId: string | null
): boolean {
  const signature = createDraftSignature(tabs, activeCharacterId);
  if (signature === lastSavedSignature) {
    try {
      localStorage.removeItem(DRAFT_BACKUP_KEY);
      localStorage.removeItem(LEGACY_DRAFT_BACKUP_KEY);
    } catch (cleanupError) {
      console.warn('[saveDraftMulti] Could not remove obsolete draft backups:', cleanupError);
    }
    lastDraftSaveError = null;
    return true;
  }

  let previousDraft: string | null = null;
  let previousMetadata: string | null = null;
  let snapshotTaken = false;

  try {
    previousDraft = localStorage.getItem(DRAFT_KEY);
    previousMetadata = localStorage.getItem(DRAFT_METADATA_KEY);
    snapshotTaken = true;
    const draft = {
      version: DRAFT_VERSION,
      activeCharacterId,
      characters: toStoredCharacters(tabs),
      savedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(draft);
    const metadata: DraftMetadataMulti = {
      version: DRAFT_VERSION,
      characterCount: tabs.length,
      activeCharacterName: activeCharacterId
        ? tabs.find((tab) => tab.id === activeCharacterId)?.label ||
          'Unnamed Character'
        : 'No active character',
      characterNames: tabs.map((tab) => tab.label),
      totalSize: json.length,
      savedAt: new Date().toISOString(),
    };

    // Earlier versions kept a second full copy of the active draft. Remove
    // those obsolete backups before writing so they cannot exhaust quota.
    // The current draft remains available for rollback until this write ends.
    localStorage.removeItem(DRAFT_BACKUP_KEY);
    localStorage.removeItem(LEGACY_DRAFT_BACKUP_KEY);

    // Update the in-memory signature only after both durable writes succeed.
    localStorage.setItem(DRAFT_KEY, json);
    localStorage.setItem(DRAFT_METADATA_KEY, JSON.stringify(metadata));
    lastSavedSignature = signature;
    lastDraftSaveError = null;
    return true;
  } catch (error) {
    // localStorage has no transactions. Restore the previously durable pair
    // when a partial write fails, so a failed save never replaces a good one.
    try {
      if (!snapshotTaken) throw error;
      if (previousDraft === null) localStorage.removeItem(DRAFT_KEY);
      else localStorage.setItem(DRAFT_KEY, previousDraft);
      if (previousMetadata === null) localStorage.removeItem(DRAFT_METADATA_KEY);
      else localStorage.setItem(DRAFT_METADATA_KEY, previousMetadata);
    } catch (rollbackError) {
      console.error('[saveDraftMulti] Failed to restore the previous local draft:', rollbackError);
    }
    lastDraftSaveError = error instanceof DOMException && error.name === 'QuotaExceededError'
      ? 'Browser storage is full. Free storage space or export and clear older drafts before trying again.'
      : 'The browser could not save this Draft. Your changes remain marked as unsaved.';
    console.error('[saveDraftMulti] Failed to save local draft:', error);
    return false;
  }
}

/** The last storage failure, used to surface an actionable autosave message. */
export function getLastDraftSaveError(): string | null {
  return lastDraftSaveError;
}

function parseMultiCharacterDraft(stored: string): CharacterTab[] | null {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stored);
  } catch (error) {
    console.error('[loadDraftMulti] Draft is not valid JSON:', error);
    return null;
  }

  const result = MultiCharacterDraftSchema.safeParse(parsedJson);
  if (!result.success) {
    console.error('[loadDraftMulti] Draft validation failed:', result.error);
    return parseCompatibleMultiCharacterDraft(parsedJson);
  }

  if (result.data.version !== DRAFT_VERSION) {
    // Preserve the previous tolerant behavior when a structurally compatible
    // draft has a different version. The data is never deleted automatically.
    console.warn(`[loadDraftMulti] Unknown version ${result.data.version}`);
  }

  return addMissingCharacterIds(
    result.data.characters.map((storedTab) => ({
      id: storedTab.id,
      character: normalizeCharacter(storedTab.character as ICharacter),
      label: storedTab.label,
      isDirty: false,
      lastModified: storedTab.lastModified,
    }))
  );
}

/**
 * Older browser drafts can be structurally sound while failing a newly-added
 * strict field. Recover their stable character data, then let normal
 * normalization upgrade individual powers and equipment.
 */
function parseCompatibleMultiCharacterDraft(raw: unknown): CharacterTab[] | null {
  if (!raw || typeof raw !== 'object') return null;
  const draft = raw as { characters?: unknown };
  if (!Array.isArray(draft.characters)) return null;
  const tabs: CharacterTab[] = [];
  for (const rawTab of draft.characters) {
    if (!rawTab || typeof rawTab !== 'object') return null;
    const tab = rawTab as { id?: unknown; character?: unknown; label?: unknown; lastModified?: unknown };
    if (typeof tab.id !== 'string' || !tab.character || typeof tab.character !== 'object') return null;
    const characterData = tab.character as Partial<ICharacter>;
    if (!characterData.header || !characterData.abilities || !characterData.defenses) return null;
    const character = normalizeCharacter(createDefaultCharacter(characterData));
    if (!character.characterId) character.characterId = tab.id;
    tabs.push({
      id: tab.id,
      character,
      label: typeof tab.label === 'string' ? tab.label : character.header.name || 'Unnamed Character',
      isDirty: true,
      lastModified: typeof tab.lastModified === 'number' ? tab.lastModified : Date.now(),
    });
  }
  console.warn(`[loadDraftMulti] Recovered ${tabs.length} compatible legacy tab(s).`);
  return addMissingCharacterIds(tabs);
}

/** Loads and validates the current draft, falling back to the legacy format. */
export function loadDraftMulti(): {
  tabs: CharacterTab[];
  activeId: string | null;
} | null {
  const stored = localStorage.getItem(DRAFT_KEY);
  if (!stored) return migrateLegacyDraft();

  const tabs = parseMultiCharacterDraft(stored);
  if (!tabs) return null;

  let savedActiveId: string | null = null;
  try {
    const parsed = MultiCharacterDraftSchema.safeParse(JSON.parse(stored));
    if (parsed.success) savedActiveId = parsed.data.activeCharacterId;
  } catch {
    // parseMultiCharacterDraft already reports malformed JSON.
  }
  const activeId = savedActiveId && tabs.some((tab) => tab.id === savedActiveId)
    ? savedActiveId
    : tabs[0]?.id ?? null;

  // Keep the signature of the stored data. If the active tab needed recovery,
  // the autosave hook will persist the corrected selection after hydration.
  lastSavedSignature = createDraftSignature(tabs, savedActiveId);
  return { tabs, activeId };
}

/** True when a persisted draft needs to be restored or recovered before saving. */
export function hasStoredDraft(): boolean {
  return typeof localStorage !== 'undefined'
    && (localStorage.getItem(DRAFT_KEY) !== null || localStorage.getItem(LEGACY_DRAFT_KEY) !== null);
}

function migrateLegacyDraft(): {
  tabs: CharacterTab[];
  activeId: string | null;
} | null {
  const stored = localStorage.getItem(LEGACY_DRAFT_KEY);
  if (!stored) return null;

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stored);
  } catch (error) {
    console.error('[migrateLegacyDraft] Draft is not valid JSON:', error);
    return null;
  }

  const result = CharacterFileSchema.safeParse(parsedJson);
  if (!result.success) {
    console.error('[migrateLegacyDraft] Draft validation failed:', result.error);
    return null;
  }

  const id = crypto.randomUUID();
  const character = normalizeCharacter(result.data.character as ICharacter);
  if (!character.characterId) character.characterId = id;

  const tab: CharacterTab = {
    id,
    character,
    label: character.header.name || 'Unnamed Character',
    isDirty: false,
    lastModified: Date.now(),
  };

  if (!saveDraftMulti([tab], id)) return null;

  localStorage.setItem('mm3e-multi-char-migrated', 'true');
  return { tabs: [tab], activeId: id };
}

export function getDraftMetadataMulti(): DraftMetadataMulti | null {
  const stored = localStorage.getItem(DRAFT_METADATA_KEY);
  if (!stored) return null;

  try {
    const result = DraftMetadataSchema.safeParse(JSON.parse(stored));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function clearDraftMulti(): void {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(DRAFT_METADATA_KEY);
  localStorage.removeItem(DRAFT_BACKUP_KEY);
  localStorage.removeItem(LEGACY_DRAFT_KEY);
  localStorage.removeItem(LEGACY_DRAFT_BACKUP_KEY);
  localStorage.removeItem(`${LEGACY_DRAFT_KEY}-metadata`);
  lastSavedSignature = '';
  lastDraftSaveError = null;
}

/** Replaces the character draft after an external backup was fully validated. */
export function replaceDraftMulti(tabs: CharacterTab[], activeId: string | null): boolean {
  lastSavedSignature = '';
  return saveDraftMulti(tabs, activeId);
}

export const characterDraftStorageKeys = {
  draft: DRAFT_KEY,
  metadata: DRAFT_METADATA_KEY,
  legacyDraft: LEGACY_DRAFT_KEY,
  backup: DRAFT_BACKUP_KEY,
  legacyBackup: LEGACY_DRAFT_BACKUP_KEY,
} as const;
