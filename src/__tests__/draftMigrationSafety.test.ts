import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { IResource } from '../entities/types';
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

  it('preserves identities from the published v1.10 draft while adding Resources', () => {
    const publishedCharacter = createDefaultCharacter({
      characterId: '3d594650-3436-4e36-a785-6ad065f3c7b4',
      powers: [{
        id: 'published-power-id',
        name: 'Damage',
        descriptors: ['Fire'],
        components: [{
          id: 'published-power-component-id',
          effectId: 'damage',
          ranks: 8,
          modifiers: [],
        }],
        notes: '',
        alternateEffects: [],
      }],
      equipment: [{
        id: 'published-equipment-id',
        name: 'Utility Belt',
        components: [{
          id: 'published-equipment-component-id',
          effectId: 'damage',
          ranks: 2,
          modifiers: [],
        }],
        notes: '',
        alternateEffects: [],
      }],
      manualOffenseRows: [{
        id: 'published-offense-id',
        name: 'Throw',
        bonus: 6,
        range: 'ranged',
        effect: 'Damage 4',
        notes: '',
      }],
      ppLog: [{
        id: 'published-pp-log-id',
        date: '2026-08-15',
        amount: 1,
        note: 'Session',
      }],
    });
    delete publishedCharacter.resourceLinks;

    const characterWithoutId = createDefaultCharacter();
    delete characterWithoutId.characterId;
    delete characterWithoutId.resourceLinks;

    const publishedTabId = '298e7a8d-d920-4acf-9ad2-8f735b9ec805';
    const noCharacterIdTabId = 'e4d7d3af-9189-452e-aac7-160b30344336';
    const sourcePayload = JSON.stringify({
      version: 1,
      activeCharacterId: publishedTabId,
      characters: [
        { id: publishedTabId, character: publishedCharacter, label: 'Published hero', lastModified: 1 },
        { id: noCharacterIdTabId, character: characterWithoutId, label: 'Older hero', lastModified: 2 },
      ],
      savedAt: '2026-08-15T00:00:00.000Z',
    });
    localStorage.setItem(characterDraftStorageKeys.draft, sourcePayload);

    const loaded = loadDraftMulti();

    expect(localStorage.getItem(characterDraftStorageKeys.draft)).toBe(sourcePayload);
    expect(loaded?.activeId).toBe(publishedTabId);
    expect(loaded?.tabs).toHaveLength(2);
    expect(loaded?.tabs[0].id).toBe(publishedTabId);
    expect(loaded?.tabs[0].character.characterId).toBe(publishedCharacter.characterId);
    expect(loaded?.tabs[0].character.powers[0].id).toBe('published-power-id');
    expect(loaded?.tabs[0].character.powers[0].components[0].id).toBe('published-power-component-id');
    expect(loaded?.tabs[0].character.equipment?.[0].id).toBe('published-equipment-id');
    expect(loaded?.tabs[0].character.manualOffenseRows?.[0].id).toBe('published-offense-id');
    expect(loaded?.tabs[0].character.ppLog?.[0].id).toBe('published-pp-log-id');
    expect(loaded?.tabs[1].character.characterId).toBe(noCharacterIdTabId);

    let persistedResources: IResource[] = [];
    const migrated = migrateDraftResources(loaded!.tabs, (resources) => {
      persistedResources = resources;
      return true;
    });

    expect(migrated.resourcesPersisted).toBe(true);
    expect(migrated.tabs[0].id).toBe(publishedTabId);
    expect(migrated.tabs[0].character.characterId).toBe(publishedCharacter.characterId);
    expect(migrated.tabs[0].character.powers[0].id).toBe('published-power-id');
    expect(migrated.tabs[0].character.manualOffenseRows?.[0].id).toBe('published-offense-id');
    expect(migrated.tabs[0].character.ppLog?.[0].id).toBe('published-pp-log-id');
    expect(migrated.tabs[0].character.equipment).toEqual([]);
    expect(migrated.tabs[0].character.resourceLinks).toHaveLength(1);
    expect(persistedResources).toHaveLength(1);
    expect(persistedResources[0].type).toBe('gear');
    if (persistedResources[0].type !== 'gear') throw new Error('Expected migrated Equipment to become Gear.');
    expect(persistedResources[0].power.components[0].id).toBe('published-equipment-component-id');
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
