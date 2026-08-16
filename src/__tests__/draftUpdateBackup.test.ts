import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  captureDraftStorageSnapshot,
  capturePendingDraftUpdateSnapshot,
  parseDraftStorageSnapshot,
  restoreDraftStorageSnapshot,
  serializeDraftStorageSnapshot,
} from '../services/storage/draftUpdateBackup';

function createStorageMock() {
  let values: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => values[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { values[key] = value; }),
    removeItem: vi.fn((key: string) => { delete values[key]; }),
    clear: vi.fn(() => { values = {}; }),
  };
}

const storage = createStorageMock();

describe('pre-update Draft backup', () => {
  beforeEach(() => storage.clear());

  it('captures and serializes the exact bytes before migration', () => {
    const rawDraft = '{"version":1,"characters":[{"legacy":true}]}';
    const rawResources = '{"version":1,"items":[{"legacyResource":true}]}';
    storage.setItem('mm3e-draft-characters', rawDraft);
    storage.setItem('mm3e-resource-library', rawResources);

    const captured = captureDraftStorageSnapshot('1.11.0', storage);
    expect(captured).not.toBeNull();
    const jsonl = serializeDraftStorageSnapshot(captured!);

    // Changes after capture cannot alter the already-generated backup.
    storage.setItem('mm3e-draft-characters', '{"version":1,"characters":[]}');
    const parsed = parseDraftStorageSnapshot(jsonl);
    expect(parsed?.entries).toContainEqual({ key: 'mm3e-draft-characters', value: rawDraft });
    expect(parsed?.entries).toContainEqual({ key: 'mm3e-resource-library', value: rawResources });
  });

  it('does not request an update backup for an intentionally empty Draft', () => {
    storage.setItem('mm3e-draft-characters', '{"version":1,"characters":[]}');
    storage.setItem('mm3e-resource-library', '{"version":1,"items":[]}');

    expect(captureDraftStorageSnapshot('1.11.0', storage)).toBeNull();
  });

  it('offers the pre-update backup only once for each app version', () => {
    storage.setItem('mm3e-draft-characters', '{"version":1,"characters":[{"hero":true}]}');
    expect(capturePendingDraftUpdateSnapshot('1.11.0', storage)).not.toBeNull();

    storage.setItem('mm3e-draft-export-notice-version', '1.11.0');
    expect(capturePendingDraftUpdateSnapshot('1.11.0', storage)).toBeNull();
    expect(capturePendingDraftUpdateSnapshot('1.12.0', storage)).not.toBeNull();
  });

  it('treats malformed stored content as user data worth preserving', () => {
    storage.setItem('mm3e-draft-characters', '{invalid');

    expect(captureDraftStorageSnapshot('1.11.0', storage)).not.toBeNull();
  });

  it('restores the exact allow-listed storage snapshot', () => {
    storage.setItem('mm3e-draft-characters', '{"version":1,"characters":[{"current":true}]}');
    const snapshot = {
      version: 1 as const,
      exportedAt: '2026-08-16T00:00:00.000Z',
      appVersion: '1.11.0',
      entries: [
        { key: 'mm3e-draft-characters' as const, value: '{"version":1,"characters":[{"old":true}]}' },
        { key: 'mm3e-resource-library' as const, value: '{"version":1,"items":[]}' },
      ],
    };

    expect(restoreDraftStorageSnapshot(snapshot, storage)).toBe(true);
    expect(storage.getItem('mm3e-draft-characters')).toContain('"old":true');
    expect(storage.getItem('mm3e-resource-library')).toBe('{"version":1,"items":[]}');
  });

  it('rejects duplicate or non-allow-listed storage entries', () => {
    const manifest = JSON.stringify({ type: 'manifest', format: 'mm3e-draft-storage-snapshot', version: 1, exportedAt: 'now', appVersion: '1.11.0' });
    const entry = JSON.stringify({ type: 'local-storage-entry', key: 'mm3e-draft-characters', value: '{invalid' });
    expect(() => parseDraftStorageSnapshot(`${manifest}\n${entry}\n${entry}\n`)).toThrow();
    const unsafe = JSON.stringify({ type: 'local-storage-entry', key: 'unrelated-key', value: 'unsafe' });
    expect(() => parseDraftStorageSnapshot(`${manifest}\n${unsafe}\n`)).toThrow();
  });
});
