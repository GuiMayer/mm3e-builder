import { z } from 'zod';
import { I18nError } from '../character-file/errors';

export const DRAFT_UPDATE_NOTICE_KEY = 'mm3e-draft-export-notice-version';

const SNAPSHOT_FORMAT = 'mm3e-draft-storage-snapshot';
const SNAPSHOT_VERSION = 1;

const STORAGE_KEYS = [
  'mm3e-draft-characters',
  'mm3e-draft-metadata',
  'mm3e-draft-character',
  'mm3e-draft-character-metadata',
  'mm3e-resource-library',
  'mm3e-draft-recovery-v1',
  'mm3e-draft-character-recovery-v1',
] as const;

type SnapshotKey = (typeof STORAGE_KEYS)[number];
type StorageReader = Pick<Storage, 'getItem'>;
type StorageWriter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const SnapshotKeySchema = z.enum(STORAGE_KEYS);
const SnapshotManifestSchema = z.object({
  type: z.literal('manifest'),
  format: z.literal(SNAPSHOT_FORMAT),
  version: z.literal(SNAPSHOT_VERSION),
  exportedAt: z.string(),
  appVersion: z.string(),
});
const SnapshotEntrySchema = z.object({
  type: z.literal('local-storage-entry'),
  key: SnapshotKeySchema,
  value: z.string(),
});

export interface DraftStorageSnapshot {
  version: 1;
  exportedAt: string;
  appVersion: string;
  entries: Array<{ key: SnapshotKey; value: string }>;
}

function parsedCollectionHasItems(value: string, field: 'characters' | 'items'): boolean {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return !Array.isArray(parsed[field]) || parsed[field].length > 0;
  } catch {
    // Invalid data is still user data and must be offered for recovery.
    return true;
  }
}

function containsUserData(entries: DraftStorageSnapshot['entries']): boolean {
  return entries.some(({ key, value }) => {
    if (key === 'mm3e-draft-characters') return parsedCollectionHasItems(value, 'characters');
    if (key === 'mm3e-resource-library') return parsedCollectionHasItems(value, 'items');
    if (key === 'mm3e-draft-metadata' || key === 'mm3e-draft-character-metadata') return false;
    return value.trim().length > 0;
  });
}

/** Captures the exact persisted bytes without parsing or migrating character data. */
export function captureDraftStorageSnapshot(
  appVersion: string,
  storage: StorageReader = localStorage
): DraftStorageSnapshot | null {
  const entries: DraftStorageSnapshot['entries'] = [];
  try {
    for (const key of STORAGE_KEYS) {
      const value = storage.getItem(key);
      if (value !== null) entries.push({ key, value });
    }
  } catch (error) {
    console.error('[draftUpdateBackup] Could not read local storage:', error);
    return null;
  }

  if (!containsUserData(entries)) return null;
  return {
    version: SNAPSHOT_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion,
    entries,
  };
}

/** Captures at most once per app version, according to the persisted notice marker. */
export function capturePendingDraftUpdateSnapshot(
  appVersion: string,
  storage: StorageReader = localStorage
): DraftStorageSnapshot | null {
  try {
    if (storage.getItem(DRAFT_UPDATE_NOTICE_KEY) === appVersion) return null;
  } catch {
    return null;
  }
  return captureDraftStorageSnapshot(appVersion, storage);
}

export function serializeDraftStorageSnapshot(snapshot: DraftStorageSnapshot): string {
  const records = [
    {
      type: 'manifest',
      format: SNAPSHOT_FORMAT,
      version: SNAPSHOT_VERSION,
      exportedAt: snapshot.exportedAt,
      appVersion: snapshot.appVersion,
    },
    ...snapshot.entries.map((entry) => ({ type: 'local-storage-entry', ...entry })),
  ];
  return `${records.map((record) => JSON.stringify(record)).join('\n')}\n`;
}

/** Returns null when the input is another supported Draft JSONL format. */
export function parseDraftStorageSnapshot(text: string): DraftStorageSnapshot | null {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return null;

  let first: unknown;
  try {
    first = JSON.parse(lines[0]);
  } catch {
    return null;
  }
  if (!first || typeof first !== 'object' || (first as { format?: unknown }).format !== SNAPSHOT_FORMAT) {
    return null;
  }

  const manifest = SnapshotManifestSchema.safeParse(first);
  if (!manifest.success) throw new I18nError('draft.error.invalidSnapshot');

  const entries: DraftStorageSnapshot['entries'] = [];
  const seen = new Set<SnapshotKey>();
  for (let index = 1; index < lines.length; index += 1) {
    let record: unknown;
    try {
      record = JSON.parse(lines[index]);
    } catch {
      throw new I18nError('draft.error.invalidJson', { line: String(index + 1) });
    }
    const parsed = SnapshotEntrySchema.safeParse(record);
    if (!parsed.success || seen.has(parsed.data.key)) {
      throw new I18nError('draft.error.invalidSnapshot');
    }
    seen.add(parsed.data.key);
    entries.push({ key: parsed.data.key, value: parsed.data.value });
  }
  if (!containsUserData(entries)) throw new I18nError('draft.error.emptySnapshot');

  return {
    version: SNAPSHOT_VERSION,
    exportedAt: manifest.data.exportedAt,
    appVersion: manifest.data.appVersion,
    entries,
  };
}

/** Restores only the allow-listed application keys and rolls back on failure. */
export function restoreDraftStorageSnapshot(
  snapshot: DraftStorageSnapshot,
  storage: StorageWriter = localStorage
): boolean {
  const previous = STORAGE_KEYS.map((key) => ({ key, value: storage.getItem(key) }));
  try {
    for (const key of STORAGE_KEYS) storage.removeItem(key);
    for (const entry of snapshot.entries) storage.setItem(entry.key, entry.value);
    if (snapshot.entries.some((entry) => storage.getItem(entry.key) !== entry.value)) {
      throw new Error('Snapshot verification failed.');
    }
    return true;
  } catch (error) {
    console.error('[draftUpdateBackup] Could not restore snapshot:', error);
    try {
      for (const key of STORAGE_KEYS) storage.removeItem(key);
      for (const entry of previous) {
        if (entry.value !== null) storage.setItem(entry.key, entry.value);
      }
    } catch (rollbackError) {
      console.error('[draftUpdateBackup] Could not roll back snapshot restore:', rollbackError);
    }
    return false;
  }
}

export const draftStorageSnapshotKeys = STORAGE_KEYS;
