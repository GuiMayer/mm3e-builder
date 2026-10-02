import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IResource, IPowerResource } from '../entities/types';
import { parseResourceAppendix, readResourceLibrary, resourceLibraryStorageKeys, saveResourceLibrary } from '../services/storage/resourceLibraryStorage';
import { parseResourceLibrary, serializeResourceLibrary } from '../services/draftTransfer';
import { useResourcesStore } from '../store/resourcesStore';

const resource: IResource = { id: '00000000-0000-4000-8000-000000000001', type: 'gadget', name: 'Legacy device', notes: 'Keep', createdAt: 'old', updatedAt: 'old', power: { id: 'p', name: 'Power', components: [{ id: 'c', effectId: 'damage', ranks: 5, modifiers: [] }], notes: 'Power notes', alternateEffects: [] } };
const values = new Map<string, string>();
const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };

describe('Resource compatibility and durable writes', () => {
  beforeEach(() => { values.clear(); vi.stubGlobal('localStorage', storage); useResourcesStore.setState({ resources: [], past: [], future: [], quarantined: [], storageError: null, loadError: null }); });
  it('rejects incomplete nested powers in appendices and library files', () => {
    const broken = { ...resource, power: { id: 'p', name: 'Missing components' } } as IResource;
    expect(() => parseResourceAppendix({ version: 1, items: [broken] })).toThrow();
    expect(() => parseResourceLibrary(serializeResourceLibrary([broken]))).toThrow();
  });
  it('keeps valid records and preserves malformed records without rewriting the source', () => {
    const invalid = { ...resource, id: '00000000-0000-4000-8000-000000000002', power: {} };
    const raw = JSON.stringify({ version: 1, items: [resource, invalid] });
    storage.setItem(resourceLibraryStorageKeys.library, raw);
    const loaded = readResourceLibrary();
    expect(loaded.resources).toHaveLength(1);
    expect(loaded.quarantined).toEqual([invalid]);
    expect(storage.getItem(resourceLibraryStorageKeys.library)).toBe(raw);
    expect(saveResourceLibrary(loaded.resources, loaded.quarantined)).toBe(true);
    expect(storage.getItem(resourceLibraryStorageKeys.backup)).toBe(raw);
    expect(readResourceLibrary().quarantined).toEqual([invalid]);
  });
  it('backs up legacy bytes and conservatively marks ambiguous devices for review', () => {
    const raw = JSON.stringify({ version: 1, items: [{ ...resource, extension: { keep: true }, power: { ...resource.power, extraField: 'keep' } }] });
    storage.setItem(resourceLibraryStorageKeys.library, raw);
    const migrated = readResourceLibrary().resources;
    expect(migrated[0]).toMatchObject({ costMode: 'equipment', costReviewRequired: true, extension: { keep: true }, power: { extraField: 'keep' } });
    expect((migrated[0] as IPowerResource).power).toEqual({ ...resource.power, extraField: 'keep' });
    expect(saveResourceLibrary(migrated)).toBe(true);
    expect(storage.getItem(resourceLibraryStorageKeys.backup)).toBe(raw);
    expect(readResourceLibrary().resources).toEqual(migrated);
  });
  it('converts validated flat legacy powers using stable component IDs', () => {
    const raw = { ...resource, power: { id: 'p', name: 'Old', effectId: 'damage', ranks: 4, modifiers: [], notes: 'Keep', alternateEffects: [] } };
    const first = parseResourceAppendix({ version: 1, items: [raw] });
    expect(first).toEqual(parseResourceAppendix({ version: 1, items: [raw] }));
    expect((first[0] as IPowerResource).power.components[0]).toMatchObject({ effectId: 'damage', ranks: 4 });
  });
  it('refuses to overwrite unreadable or future libraries', () => {
    for (const raw of ['{broken', JSON.stringify({ version: 99, items: [resource] })]) {
      storage.setItem(resourceLibraryStorageKeys.library, raw);
      expect(saveResourceLibrary([])).toBe(false);
      expect(storage.getItem(resourceLibraryStorageKeys.library)).toBe(raw);
    }
  });
  it('does not publish a mutation or move history when storage is full', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('localStorage', { ...storage, setItem: () => { throw new Error('Full'); } });
    expect(useResourcesStore.getState().addResource(resource)).toBe(false);
    expect(useResourcesStore.getState().resources).toEqual([]);
    expect(useResourcesStore.getState().past).toEqual([]);
    expect(useResourcesStore.getState().storageError).toBe('resources.error.storageWrite');
  });
  it('rejects zero feature quantities before overwriting a valid library', () => {
    expect(saveResourceLibrary([resource])).toBe(true);
    const before = storage.getItem(resourceLibraryStorageKeys.library);
    const hq = { ...resource, type: 'headquarters', size: 'small', toughness: 6, effects: [], features: [{ id: 'f', name: 'Alarm', ranks: 0 }] } as unknown as IResource;
    expect(saveResourceLibrary([hq])).toBe(false);
    expect(storage.getItem(resourceLibraryStorageKeys.library)).toBe(before);
  });
});
