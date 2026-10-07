import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { instantiateArchetype } from '../data/archetypes/model';
import { batch1 } from '../data/archetypes/batch1';
import { commitCharacterImport } from '../services/character-file/commitCharacterImport';
import { normalizeCharacter } from '../services/character-file/normalizeCharacter';
import { clearDraftMulti, loadDraftMulti, saveDraftMulti } from '../services/storage/characterDraftStorage';
import { useCharactersStore } from '../store/charactersStore';
import { useResourcesStore } from '../store/resourcesStore';
import { withImportedPortraits } from '../services/portraitBundle';
import { clearPortraits, getPortrait, savePortrait } from '../services/storage/portraitStorage';

const values = new Map<string, string>();
let failWrite: ((key: string) => void) | undefined;
const storage = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => { failWrite?.(key); values.set(key, value); },
  removeItem: (key: string) => { values.delete(key); },
};
const imported = () => instantiateArchetype(batch1[0], { expertise: 'Science' }, 'en');
function persistCurrent() {
  const state = useCharactersStore.getState();
  expect(saveDraftMulti(state.tabs, state.activeCharacterId)).toBe(true);
}
function oldCharacter() {
  return createDefaultCharacter({
    characterId: crypto.randomUUID(),
    header: { ...createDefaultCharacter().header, name: 'Original', portraitUrl: 'https://example.com/old.png' },
    notes: 'Old notes',
    traitModifiers: [{ id: 'tools', target: { kind: 'ability', key: 'str' }, scope: 'check', value: 2, source: 'Tools', active: true }],
    powerUsage: { old: { enabled: false } },
  });
}
beforeEach(async () => {
  values.clear(); failWrite = undefined;
  vi.stubGlobal('localStorage', storage); clearDraftMulti();
  useCharactersStore.setState({ tabs: [], activeCharacterId: null, historyByTabId: {}, closedTabHistory: { past: [], future: [] }, isDraftHydrated: true });
  useResourcesStore.setState({ resources: [], past: [], future: [], lastSavedSource: null, source: null, quarantined: [], loadError: null, storageError: null });
  await clearPortraits();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('character import transaction', () => {
  it('replaces the complete character without inheriting absent optional fields and keeps undo', () => {
    const id = useCharactersStore.getState().addCharacter(oldCharacter());
    const before = structuredClone(useCharactersStore.getState().tabs[0].character);
    const other = useCharactersStore.getState().addCharacter(createDefaultCharacter({ notes: 'Untouched' }));
    const otherBefore = structuredClone(useCharactersStore.getState().getCharacterById(other));
    persistCurrent();
    const draft = imported();
    commitCharacterImport(draft.character, draft.resources, false, id);
    const replacement = useCharactersStore.getState().getCharacterById(id)!.character;
    expect(replacement).toEqual(draft.character);
    expect(replacement).not.toBe(draft.character);
    expect(replacement.notes).toBeUndefined();
    expect(replacement.traitModifiers).toBeUndefined();
    expect(replacement.powerUsage).toBeUndefined();
    expect(replacement.header.portraitUrl).toBeUndefined();
    expect(useCharactersStore.getState().getCharacterById(other)).toEqual(otherBefore);
    expect(JSON.parse(values.get('mm3e-draft-characters')!).characters.find((tab: { id: string }) => tab.id === id).character).toEqual(JSON.parse(JSON.stringify(draft.character)));
    expect(loadDraftMulti()?.tabs.find(tab => tab.id === id)?.character).toEqual(normalizeCharacter(JSON.parse(JSON.stringify(draft.character))));
    useCharactersStore.getState().undoCharacter(id);
    expect(useCharactersStore.getState().getCharacterById(id)?.character).toEqual(before);
    useCharactersStore.getState().redoCharacter(id);
    expect(useCharactersStore.getState().getCharacterById(id)?.character).toEqual(draft.character);
    draft.character.advantages.length = 0;
    expect(replacement.advantages.length).toBeGreaterThan(0);
  });

  it('preserves imported optional fields and other characters when adding a new sheet', () => {
    useCharactersStore.getState().addCharacter(oldCharacter()); persistCurrent();
    const before = structuredClone(useCharactersStore.getState().tabs[0]);
    const draft = oldCharacter();
    commitCharacterImport(draft, [], false);
    expect(useCharactersStore.getState().tabs[0]).toEqual(before);
    expect(useCharactersStore.getState().tabs[1].character).toMatchObject(draft);
    expect(loadDraftMulti()?.tabs[1].character).toEqual(normalizeCharacter(JSON.parse(JSON.stringify(draft))));
  });

  it('preserves a newer external resource library and its conflict error when upsert is rejected', () => {
    useCharactersStore.getState().addCharacter(oldCharacter()); persistCurrent();
    const before = useCharactersStore.getState();
    const durableDraft = values.get('mm3e-draft-characters');
    values.set('mm3e-resource-library', 'external library');
    const draft = imported();
    expect(() => commitCharacterImport(draft.character, draft.resources, false)).toThrow('resources.error.storageConflict');
    expect(values.get('mm3e-resource-library')).toBe('external library');
    expect(values.get('mm3e-draft-characters')).toBe(durableDraft);
    expect(useCharactersStore.getState()).toBe(before);
    expect(useResourcesStore.getState().storageError).toBe('resources.error.storageConflict');
  });

  it('restores the exact old character, history, resources and durable bytes after a partial draft failure', () => {
    useCharactersStore.getState().addCharacter(oldCharacter()); persistCurrent();
    const before = useCharactersStore.getState();
    const beforeResources = useResourcesStore.getState();
    const durable = new Map(values);
    failWrite = key => { if (key === 'mm3e-draft-metadata') throw new DOMException('Full', 'QuotaExceededError'); };
    const draft = imported();
    expect(() => commitCharacterImport(draft.character, draft.resources, false, before.tabs[0].id)).toThrow('draft.saveError.storageFull');
    expect(useCharactersStore.getState().tabs).toEqual(before.tabs);
    expect(useCharactersStore.getState().historyByTabId).toEqual(before.historyByTabId);
    expect(useResourcesStore.getState().resources).toEqual(beforeResources.resources);
    expect(values).toEqual(durable);
  });

  it('preserves an external draft on conflict while compensating only its own resource write', () => {
    useCharactersStore.getState().addCharacter(oldCharacter()); persistCurrent();
    const before = useCharactersStore.getState();
    values.set('mm3e-draft-characters', 'external draft');
    const draft = imported();
    expect(() => commitCharacterImport(draft.character, draft.resources, false)).toThrow('draft.saveError.storageConflict');
    expect(values.get('mm3e-draft-characters')).toBe('external draft');
    expect(values.has('mm3e-resource-library')).toBe(false);
    expect(useCharactersStore.getState().tabs).toEqual(before.tabs);
    expect(useResourcesStore.getState().resources).toEqual([]);
  });

  it('never overwrites an external resource write during recovery of a failed draft commit', () => {
    useCharactersStore.getState().addCharacter(oldCharacter()); persistCurrent();
    const durableDraft = values.get('mm3e-draft-characters');
    failWrite = key => {
      if (key === 'mm3e-draft-metadata') {
        values.set('mm3e-resource-library', 'newer external library');
        throw new DOMException('Full', 'QuotaExceededError');
      }
    };
    const draft = imported();
    expect(() => commitCharacterImport(draft.character, draft.resources, false)).toThrow('creation.recoveryError');
    expect(values.get('mm3e-resource-library')).toBe('newer external library');
    expect(values.get('mm3e-draft-characters')).toBe(durableDraft);
    expect(useCharactersStore.getState().tabs).toHaveLength(1);
    // The stale in-memory resources cannot be used to overwrite the durable library later.
    expect(useResourcesStore.getState().upsertResources(draft.resources)).toBe(false);
  });

  it('does not silently add a character when the chosen replacement tab was closed', () => {
    expect(() => commitCharacterImport(createDefaultCharacter(), [], false, 'closed')).toThrow('characterImport.destinationMissing');
    expect(values.size).toBe(0);
    expect(useCharactersStore.getState().tabs).toEqual([]);
  });

  it('restores the old local portrait along with the sheets when a ZIP import fails', async () => {
    const character = createDefaultCharacter({ characterId: 'hero' });
    useCharactersStore.getState().addCharacter(character); persistCurrent();
    const media = (text: string) => ({ image: new Blob([text], { type: 'image/png' }), thumbnail: new Blob([text]), width: 20, height: 30 });
    await savePortrait(media('old'), { characterId: 'hero' });
    failWrite = key => { if (key === 'mm3e-draft-metadata') throw new DOMException('Full', 'QuotaExceededError'); };
    const next = { ...character, notes: 'Imported' };
    await expect(withImportedPortraits([{ characterId: 'hero', media: media('new') }], () => {
      commitCharacterImport(next, [], false, useCharactersStore.getState().tabs[0].id);
    })).rejects.toThrow();
    expect(await (await getPortrait('hero'))?.image.text()).toBe('old');
    expect(useCharactersStore.getState().tabs[0].character).toEqual(character);
  });
});
