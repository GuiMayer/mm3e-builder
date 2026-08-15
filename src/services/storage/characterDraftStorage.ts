import { z } from 'zod';
import { CharacterFileSchema, CharacterSchema } from '../../entities/schemas';
import type { ICharacter } from '../../entities/types';
import type { CharacterTab } from '../../entities/characterTab';
import { normalizeCharacter } from '../character-file/normalizeCharacter';

const LEGACY_DRAFT_KEY = 'mm3e-draft-character';
const DRAFT_KEY = 'mm3e-draft-characters';
const DRAFT_METADATA_KEY = 'mm3e-draft-metadata';
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
  if (signature === lastSavedSignature) return true;

  try {
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

    // Update the in-memory signature only after both durable writes succeed.
    localStorage.setItem(DRAFT_KEY, json);
    localStorage.setItem(DRAFT_METADATA_KEY, JSON.stringify(metadata));
    lastSavedSignature = signature;
    return true;
  } catch (error) {
    console.error('[saveDraftMulti] Failed to save local draft:', error);
    return false;
  }
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
    return null;
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

/** Loads and validates the current draft, falling back to the legacy format. */
export function loadDraftMulti(): {
  tabs: CharacterTab[];
  activeId: string | null;
} | null {
  const stored = localStorage.getItem(DRAFT_KEY);
  if (!stored) return migrateLegacyDraft();

  const tabs = parseMultiCharacterDraft(stored);
  if (!tabs) return null;

  const parsed = MultiCharacterDraftSchema.safeParse(JSON.parse(stored));
  if (!parsed.success) return null;

  const activeId = parsed.data.activeCharacterId;
  lastSavedSignature = createDraftSignature(tabs, activeId);
  return { tabs, activeId };
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

  localStorage.removeItem(LEGACY_DRAFT_KEY);
  localStorage.removeItem(`${LEGACY_DRAFT_KEY}-metadata`);
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
  localStorage.removeItem(LEGACY_DRAFT_KEY);
  localStorage.removeItem(`${LEGACY_DRAFT_KEY}-metadata`);
  lastSavedSignature = '';
}

export const characterDraftStorageKeys = {
  draft: DRAFT_KEY,
  metadata: DRAFT_METADATA_KEY,
  legacyDraft: LEGACY_DRAFT_KEY,
} as const;
