import { z } from 'zod';
import { CharacterFileSchema, CharacterSchema } from '../../entities/schemas';
import type { ICharacter } from '../../entities/types';
import type { CharacterTab } from '../../entities/characterTab';
import { normalizeCharacter } from '../character-file/normalizeCharacter';
import { createDefaultCharacter } from '../../entities/characterDefaults';
import { createId } from '../../shared/lib/identity';

const LEGACY_DRAFT_KEY = 'mm3e-draft-character';
const DRAFT_KEY = 'mm3e-draft-characters';
const DRAFT_METADATA_KEY = 'mm3e-draft-metadata';
const DRAFT_BACKUP_KEY = 'mm3e-draft-characters-backup-v1';
const LEGACY_DRAFT_BACKUP_KEY = 'mm3e-draft-character-backup-v1';
const DRAFT_RECOVERY_KEY = 'mm3e-draft-recovery-v1';
const LEGACY_DRAFT_RECOVERY_KEY = 'mm3e-draft-character-recovery-v1';
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
let lastSavedSource: string | null | undefined;
type DraftSaveError = 'draft.saveError.storageFull' | 'draft.saveError.writeFailed' | 'draft.saveError.recoveryFailed' | 'draft.saveError.storageConflict';
let lastDraftSaveError: DraftSaveError | null = null;
let draftNeedsRecoveryBeforeSave = false;
let writeRevision = 0;
const ownedWrites = new Map<string, { revision: number; value: string | null }>();

function writeDraftValue(key: string, value: string | null): void {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
  ownedWrites.set(key, { revision: ++writeRevision, value });
}

function quarantineUnreadableMultiDraft(): boolean {
  if (!draftNeedsRecoveryBeforeSave) return true;
  let stored: string | null;
  let existingRecovery: string | null;
  try {
    stored = localStorage.getItem(DRAFT_KEY);
    existingRecovery = localStorage.getItem(DRAFT_RECOVERY_KEY);
  } catch (error) {
    console.error('[saveDraftMulti] Could not inspect unreadable draft:', error);
    return false;
  }
  if (stored === null) {
    draftNeedsRecoveryBeforeSave = false;
    return true;
  }

  if (existingRecovery !== null && existingRecovery !== stored) return false;

  try {
    // Move instead of copy to avoid temporarily doubling storage usage.
    writeDraftValue(DRAFT_KEY, null);
    writeDraftValue(DRAFT_RECOVERY_KEY, stored);
    if (localStorage.getItem(DRAFT_RECOVERY_KEY) !== stored) {
      throw new Error('Recovery verification failed.');
    }
    draftNeedsRecoveryBeforeSave = false;
    lastSavedSource = null;
    return true;
  } catch (error) {
    console.error('[saveDraftMulti] Could not preserve unreadable draft:', error);
    try {
      writeDraftValue(DRAFT_KEY, stored);
    } catch (rollbackError) {
      console.error('[saveDraftMulti] Could not restore unreadable draft:', rollbackError);
    }
    return false;
  }
}

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
  // Compare the exact bytes loaded/saved by this window, even on a cache hit.
  // Another window's edits or removals must never be replaced by a stale snapshot.
  try {
    const source = localStorage.getItem(DRAFT_KEY);
    if (lastSavedSource !== undefined && source !== lastSavedSource) {
      lastDraftSaveError = 'draft.saveError.storageConflict';
      return false;
    }
    lastSavedSource = source;
  } catch {
    lastDraftSaveError = 'draft.saveError.writeFailed';
    return false;
  }
  if (!quarantineUnreadableMultiDraft()) {
    lastDraftSaveError = 'draft.saveError.recoveryFailed';
    return false;
  }
  const signature = createDraftSignature(tabs, activeCharacterId);
  if (signature === lastSavedSignature) {
    try {
      writeDraftValue(DRAFT_BACKUP_KEY, null);
      writeDraftValue(LEGACY_DRAFT_BACKUP_KEY, null);
    } catch (cleanupError) {
      console.warn('[saveDraftMulti] Could not remove obsolete draft backups:', cleanupError);
    }
    lastDraftSaveError = null;
    return true;
  }

  let previousDraft: string | null = null;
  let previousMetadata: string | null = null;
  let snapshotTaken = false;
  let writtenDraft: string | undefined;
  let writtenMetadata: string | undefined;

  try {
    previousDraft = localStorage.getItem(DRAFT_KEY);
    if (previousDraft !== lastSavedSource) {
      lastDraftSaveError = 'draft.saveError.storageConflict';
      return false;
    }
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
    writeDraftValue(DRAFT_BACKUP_KEY, null);
    writeDraftValue(LEGACY_DRAFT_BACKUP_KEY, null);

    // Update the in-memory signature only after both durable writes succeed.
    writeDraftValue(DRAFT_KEY, json);
    writtenDraft = json;
    const metadataJson = JSON.stringify(metadata);
    writeDraftValue(DRAFT_METADATA_KEY, metadataJson);
    writtenMetadata = metadataJson;
    lastSavedSource = json;
    lastSavedSignature = signature;
    lastDraftSaveError = null;
    return true;
  } catch (error) {
    // localStorage has no transactions. Restore the previously durable pair
    // when a partial write fails, so a failed save never replaces a good one.
    try {
      if (!snapshotTaken) throw error;
      if (writtenDraft !== undefined && localStorage.getItem(DRAFT_KEY) === writtenDraft) writeDraftValue(DRAFT_KEY, previousDraft);
      if (writtenMetadata !== undefined && localStorage.getItem(DRAFT_METADATA_KEY) === writtenMetadata) writeDraftValue(DRAFT_METADATA_KEY, previousMetadata);
    } catch (rollbackError) {
      console.error('[saveDraftMulti] Failed to restore the previous local draft:', rollbackError);
    }
    lastDraftSaveError = error instanceof DOMException && error.name === 'QuotaExceededError'
      ? 'draft.saveError.storageFull'
      : 'draft.saveError.writeFailed';
    console.error('[saveDraftMulti] Failed to save local draft:', error);
    return false;
  }
}

/** The last storage failure, used to surface an actionable autosave message. */
export function getLastDraftSaveError(): DraftSaveError | null {
  return lastDraftSaveError;
}

interface ParsedMultiCharacterDraft {
  tabs: CharacterTab[];
  savedActiveId: string | null;
  needsRewrite: boolean;
}

function getCompatibleActiveId(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const activeId = (raw as { activeCharacterId?: unknown }).activeCharacterId;
  return typeof activeId === 'string' ? activeId : null;
}

function parseMultiCharacterDraft(stored: string): ParsedMultiCharacterDraft | null {
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
    const tabs = parseCompatibleMultiCharacterDraft(parsedJson);
    return tabs
      ? { tabs, savedActiveId: getCompatibleActiveId(parsedJson), needsRewrite: true }
      : null;
  }

  if (result.data.version !== DRAFT_VERSION) {
    // Preserve the previous tolerant behavior when a structurally compatible
    // draft has a different version. The data is never deleted automatically.
    console.warn(`[loadDraftMulti] Unknown version ${result.data.version}`);
  }

  return {
    tabs: addMissingCharacterIds(result.data.characters.map((storedTab) => ({
      id: storedTab.id,
      character: normalizeCharacter(storedTab.character as ICharacter),
      label: storedTab.label,
      isDirty: false,
      lastModified: storedTab.lastModified,
    }))),
    savedActiveId: result.data.activeCharacterId,
    needsRewrite: false,
  };
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
  lastSavedSource = stored;
  lastSavedSignature = '';
  draftNeedsRecoveryBeforeSave = false;
  if (!stored) return migrateLegacyDraft();

  const parsed = parseMultiCharacterDraft(stored);
  if (!parsed) {
    draftNeedsRecoveryBeforeSave = true;
    return null;
  }

  const activeId = parsed.savedActiveId && parsed.tabs.some((tab) => tab.id === parsed.savedActiveId)
    ? parsed.savedActiveId
    : parsed.tabs[0]?.id ?? null;

  // Keep the signature of the stored data. If the active tab needed recovery,
  // the autosave hook will persist the corrected selection after hydration.
  lastSavedSignature = parsed.needsRewrite
    ? ''
    : createDraftSignature(parsed.tabs, parsed.savedActiveId);
  return { tabs: parsed.tabs, activeId };
}

/** True when a persisted draft needs to be restored or recovered before saving. */
export function hasStoredDraft(): boolean {
  return typeof localStorage !== 'undefined'
    && (localStorage.getItem(DRAFT_KEY) !== null || localStorage.getItem(LEGACY_DRAFT_KEY) !== null);
}

/** Ensures an unexpected startup failure cannot overwrite the current source. */
export function preserveStoredDraftBeforeNextSave(): void {
  draftNeedsRecoveryBeforeSave = true;
  try {
    lastSavedSource = localStorage.getItem(DRAFT_KEY);
    if (lastSavedSource === null) draftNeedsRecoveryBeforeSave = false;
  } catch {
    // Stay conservative: the later save must verify preservation first.
  }
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

  const id = createId();
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
  localStorage.removeItem(DRAFT_RECOVERY_KEY);
  localStorage.removeItem(LEGACY_DRAFT_RECOVERY_KEY);
  localStorage.removeItem(`${LEGACY_DRAFT_KEY}-metadata`);
  lastSavedSignature = '';
  lastSavedSource = null;
  lastDraftSaveError = null;
  draftNeedsRecoveryBeforeSave = false;
}

/** Replaces the character draft after an external backup was fully validated. */
export function replaceDraftMulti(tabs: CharacterTab[], activeId: string | null): boolean {
  lastSavedSignature = '';
  return saveDraftMulti(tabs, activeId);
}

/** Capture durable data and save bookkeeping for compensation of a multi-store import. */
export function captureDraftRollback(): () => void {
  const entries = Object.values(characterDraftStorageKeys).map(key => [key, localStorage.getItem(key)] as const);
  const signature = lastSavedSignature;
  const source = lastSavedSource;
  const saveError = lastDraftSaveError;
  const recovery = draftNeedsRecoveryBeforeSave;
  const revision = writeRevision;
  return () => {
    const changed = entries.filter(([key]) => (ownedWrites.get(key)?.revision ?? 0) > revision);
    // Roll back only our writes. In particular, a rejected write owns nothing.
    if (changed.some(([key]) => localStorage.getItem(key) !== ownedWrites.get(key)!.value)) {
      lastDraftSaveError = 'draft.saveError.storageConflict';
      throw new Error('draft.saveError.storageConflict');
    }
    for (const [key, value] of changed) {
      if (localStorage.getItem(key) !== value) writeDraftValue(key, value);
    }
    lastSavedSignature = signature;
    lastSavedSource = source;
    lastDraftSaveError = saveError;
    draftNeedsRecoveryBeforeSave = recovery;
  };
}

export const characterDraftStorageKeys = {
  draft: DRAFT_KEY,
  metadata: DRAFT_METADATA_KEY,
  legacyDraft: LEGACY_DRAFT_KEY,
  backup: DRAFT_BACKUP_KEY,
  legacyBackup: LEGACY_DRAFT_BACKUP_KEY,
  recovery: DRAFT_RECOVERY_KEY,
  legacyRecovery: LEGACY_DRAFT_RECOVERY_KEY,
} as const;
