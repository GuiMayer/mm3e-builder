import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { CharacterTab } from '../store/charactersStore';
import {
  characterDraftStorageKeys,
  getDraftMetadataMulti,
  getLastDraftSaveError,
  loadDraftMulti,
  saveDraftMulti,
} from '../services/storage/characterDraftStorage';

function createStorageMock() {
  let values: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => values[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete values[key];
    }),
    clear: vi.fn(() => {
      values = {};
    }),
  };
}

const storage = createStorageMock();
Object.defineProperty(globalThis, 'localStorage', { value: storage });

function createTab(id: string, name: string): CharacterTab {
  return {
    id,
    character: createDefaultCharacter({
      characterId: '3d594650-3436-4e36-a785-6ad065f3c7b4',
      header: {
        name,
        player: '',
        identity: '',
        base: '',
        powerLevel: 10,
        heroPoints: 1,
      },
    }),
    isDirty: true,
    label: name,
    lastModified: 123,
  };
}

describe('characterDraftStorage', () => {
  beforeEach(() => {
    storage.clear();
    storage.setItem.mockClear();
  });

  it('round-trips the established multi-character draft format', () => {
    const tabs = [createTab('tab-1', 'Hero')];

    expect(saveDraftMulti(tabs, 'tab-1')).toBe(true);
    const loaded = loadDraftMulti();

    expect(loaded?.activeId).toBe('tab-1');
    expect(loaded?.tabs).toHaveLength(1);
    expect(loaded?.tabs[0].character.header.name).toBe('Hero');
    expect(loaded?.tabs[0].isDirty).toBe(false);
  });

  it('preserves invalid stored data instead of deleting it', () => {
    storage.setItem(characterDraftStorageKeys.draft, '{invalid');

    expect(loadDraftMulti()).toBeNull();
    expect(storage.getItem(characterDraftStorageKeys.draft)).toBe('{invalid');
    expect(storage.removeItem).not.toHaveBeenCalledWith(
      characterDraftStorageKeys.draft
    );
  });

  it('validates metadata before returning it', () => {
    storage.setItem(characterDraftStorageKeys.metadata, '{"version":"bad"}');

    expect(getDraftMetadataMulti()).toBeNull();
  });

  it('persists an active-tab-only change', () => {
    const tabs = [createTab('tab-1', 'One'), createTab('tab-2', 'Two')];
    saveDraftMulti(tabs, 'tab-1');
    storage.setItem.mockClear();

    saveDraftMulti(tabs, 'tab-2');

    expect(storage.setItem).toHaveBeenCalledWith(
      characterDraftStorageKeys.draft,
      expect.any(String)
    );
  });

  it('falls back to the first tab when the saved active tab no longer exists', () => {
    const tabs = [createTab('tab-1', 'One'), createTab('tab-2', 'Two')];

    saveDraftMulti(tabs, 'missing-tab');
    const loaded = loadDraftMulti();

    expect(loaded?.activeId).toBe('tab-1');
    expect(loaded?.tabs.map((tab) => tab.id)).toEqual(['tab-1', 'tab-2']);
  });

  it('falls back to the first tab when a populated draft has no active tab', () => {
    const tabs = [createTab('tab-3', 'Three')];

    saveDraftMulti(tabs, null);

    expect(loadDraftMulti()?.activeId).toBe('tab-3');
  });

  it('removes obsolete full-draft backups after a successful save', () => {
    storage.setItem(characterDraftStorageKeys.backup, 'old draft');
    storage.setItem(characterDraftStorageKeys.legacyBackup, 'old legacy draft');

    expect(saveDraftMulti([createTab('tab-4', 'Four')], 'tab-4')).toBe(true);
    expect(storage.getItem(characterDraftStorageKeys.backup)).toBeNull();
    expect(storage.getItem(characterDraftStorageKeys.legacyBackup)).toBeNull();
  });

  it('restores the previous draft when a partial write fails', () => {
    const oldDraft = JSON.stringify({ version: 1, activeCharacterId: 'old', characters: [], savedAt: 'old' });
    const oldMetadata = JSON.stringify({ version: 1, characterCount: 0, activeCharacterName: 'Old', characterNames: [], totalSize: 1, savedAt: 'old' });
    storage.setItem(characterDraftStorageKeys.draft, oldDraft);
    storage.setItem(characterDraftStorageKeys.metadata, oldMetadata);
    const baseSetItem = storage.setItem.getMockImplementation();
    storage.setItem.mockImplementation((key: string, value: string) => {
      if (key === characterDraftStorageKeys.metadata && value !== oldMetadata) {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }
      baseSetItem?.(key, value);
    });

    expect(saveDraftMulti([createTab('tab-5', 'Five')], 'tab-5')).toBe(false);
    expect(storage.getItem(characterDraftStorageKeys.draft)).toBe(oldDraft);
    expect(storage.getItem(characterDraftStorageKeys.metadata)).toBe(oldMetadata);
    expect(getLastDraftSaveError()).toContain('storage is full');
  });
});
