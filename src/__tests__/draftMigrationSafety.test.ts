import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { characterDraftStorageKeys, hasStoredDraft, loadDraftMulti, saveDraftMulti } from '../services/storage/characterDraftStorage';
import { isRecoveredCharacterDraft, migrateDraftResources } from '../shared/hooks/useAutoLoadDraftMulti';

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

  it('allows the startup flow to hydrate an intentionally empty stored draft', () => {
    localStorage.setItem(characterDraftStorageKeys.draft, JSON.stringify({
      version: 1,
      activeCharacterId: null,
      characters: [],
      savedAt: new Date().toISOString(),
    }));

    expect(isRecoveredCharacterDraft(loadDraftMulti())).toBe(true);
  });

  it('recovers a legacy component without a modifiers collection', () => {
    const character = createDefaultCharacter();
    character.powers = [{
      id: 'legacy-power',
      name: 'Legacy Blast',
      components: [{ id: 'legacy-component', effectId: 'damage', ranks: 8 }],
      notes: '',
      alternateEffects: [],
    }] as unknown as typeof character.powers;
    localStorage.setItem(characterDraftStorageKeys.draft, JSON.stringify({
      version: 1,
      activeCharacterId: 'tab-1',
      characters: [{ id: 'tab-1', character, label: 'Legacy hero', lastModified: 1 }],
      savedAt: new Date().toISOString(),
    }));

    const loaded = loadDraftMulti();

    expect(loaded?.tabs[0].character.powers[0].components[0].modifiers).toEqual([]);

    const legacyPayload = localStorage.getItem(characterDraftStorageKeys.draft);
    expect(saveDraftMulti(loaded!.tabs, loaded!.activeId)).toBe(true);
    expect(localStorage.getItem(characterDraftStorageKeys.draft)).not.toBe(legacyPayload);
    expect(localStorage.getItem(characterDraftStorageKeys.draft)).toContain('"modifiers":[]');
  });

  it('recovers every tab when one legacy character has malformed nested collections', () => {
    const validCharacter = createDefaultCharacter();
    const malformedCharacter = createDefaultCharacter();
    (malformedCharacter as unknown as Record<string, unknown>).powers = { legacy: true };
    (malformedCharacter as unknown as Record<string, unknown>).equipment = [null, 'legacy equipment'];
    (malformedCharacter as unknown as Record<string, unknown>).advantages = [null, 'legacy advantage'];
    (malformedCharacter as unknown as Record<string, unknown>).resourceLinks = { stale: true };
    localStorage.setItem(characterDraftStorageKeys.draft, JSON.stringify({
      version: 1,
      activeCharacterId: 'tab-2',
      characters: [
        { id: 'tab-1', character: validCharacter, label: 'Valid hero', lastModified: 1 },
        { id: 'tab-2', character: malformedCharacter, label: 'Legacy hero', lastModified: 2 },
      ],
      savedAt: new Date().toISOString(),
    }));

    const loaded = loadDraftMulti();

    expect(loaded?.tabs.map((tab) => tab.label)).toEqual(['Valid hero', 'Legacy hero']);
    expect(loaded?.activeId).toBe('tab-2');
    expect(loaded?.tabs[1].character.powers).toEqual([]);
    expect(loaded?.tabs[1].character.equipment).toEqual([]);
    expect(loaded?.tabs[1].character.advantages).toEqual([]);
    expect(loaded?.tabs[1].character.resourceLinks).toEqual([]);
  });

  it('keeps legacy Equipment untouched when Resources cannot be persisted', () => {
    const character = createDefaultCharacter({
      equipment: [{ id: 'legacy-item', name: 'Utility Belt', components: [], notes: '', alternateEffects: [] }],
    });
    const tab = { id: 'tab-equipment', character, label: 'Hero', isDirty: false, lastModified: 1 };

    const result = migrateDraftResources([tab], () => false);

    expect(result.resourcesPersisted).toBe(false);
    expect(result.tabs[0]).toBe(tab);
    expect(result.tabs[0].character.equipment).toHaveLength(1);
    expect(result.tabs[0].character.resourceLinks).toEqual([]);
  });

  it('converts legacy Equipment only after Resources are persisted', () => {
    const character = createDefaultCharacter({
      equipment: [{ id: 'legacy-item', name: 'Utility Belt', components: [], notes: '', alternateEffects: [] }],
    });
    const tab = { id: 'tab-equipment', character, label: 'Hero', isDirty: false, lastModified: 1 };

    const result = migrateDraftResources([tab], () => true);

    expect(result.resourcesPersisted).toBe(true);
    expect(result.tabs[0].character.equipment).toEqual([]);
    expect(result.tabs[0].character.resourceLinks).toHaveLength(1);
    expect(result.tabs[0].isDirty).toBe(true);
  });
});
