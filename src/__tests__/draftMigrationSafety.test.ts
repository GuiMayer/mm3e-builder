import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { characterDraftStorageKeys, hasStoredDraft, loadDraftMulti } from '../services/storage/characterDraftStorage';

const localStorageMock = (() => {
  let values: Record<string, string> = {};
  return { getItem: (key: string) => values[key] ?? null, setItem: (key: string, value: string) => { values[key] = value; }, removeItem: (key: string) => { delete values[key]; }, clear: () => { values = {}; } };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('draft migration safety', () => {
  beforeEach(() => localStorage.clear());

  it('recovers a structurally compatible draft rejected by a newly strict field', () => {
    const character = createDefaultCharacter();
    (character.header as { identityType?: string }).identityType = 'legacy-house-rule';
    localStorage.setItem(characterDraftStorageKeys.draft, JSON.stringify({
      version: 1,
      activeCharacterId: 'tab-1',
      characters: [{ id: 'tab-1', character, label: 'Legacy hero', lastModified: 1 }],
      savedAt: new Date().toISOString(),
    }));

    const loaded = loadDraftMulti();

    expect(loaded?.tabs).toHaveLength(1);
    expect(loaded?.tabs[0].label).toBe('Legacy hero');
    expect(hasStoredDraft()).toBe(true);
    // Loading must not remove or replace the original source payload.
    expect(localStorage.getItem(characterDraftStorageKeys.draft)).toContain('Legacy hero');
  });
});
