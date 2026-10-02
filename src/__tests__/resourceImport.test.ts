import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { IResource } from '../entities/types';
import { findResourceImportConflicts, prepareResourceImport } from '../shared/lib/resourceImport';
import { preserveResourceImportBackup, RESOURCE_IMPORT_BACKUP_KEY } from '../services/storage/resourceImportBackup';
import { parseResourceAppendix, saveResourceLibrary } from '../services/storage/resourceLibraryStorage';
import { parseResourceLibrary, serializeResourceLibrary } from '../services/draftTransfer';

const local: IResource = { id: '00000000-0000-4000-8000-000000000001', type: 'gear', costMode: 'equipment', name: 'Local scanner', notes: 'Keep', createdAt: 'old', updatedAt: 'old', power: { id: 'p', name: 'Scanner', notes: 'Power notes', components: [{ id: 'c', effectId: 'senses', ranks: 1, modifiers: [] }], alternateEffects: [] } };
const incoming = { ...local, name: 'Updated scanner', notes: 'Imported notes' };
const character = createDefaultCharacter({ resourceLinks: [{ id: 'link', resourceId: local.id, isFree: false, contributionEP: 3, alternateSetId: 'set' }] });
const values = new Map<string, string>();
const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
describe('Resource import conflicts and reference safety', () => {
  beforeEach(() => { values.clear(); vi.stubGlobal('localStorage', storage); });
  it('compares contents independent of object key order and explicitly identifies changed UUIDs', () => {
    expect(findResourceImportConflicts([{ ...local, power: { ...local.power } }], [local])).toEqual([]);
    expect(findResourceImportConflicts([incoming], [local])).toEqual([incoming]);
  });
  it('keeps local values or replaces shared identities only by an explicit choice', () => {
    const keep = prepareResourceImport(character, [incoming], [local], 'keep');
    expect(keep.resources).toEqual([]); expect(keep.character).toBe(character);
    const update = prepareResourceImport(character, [incoming], [local], 'update');
    expect(update.resources).toEqual([incoming]); expect(update.replaceExisting).toBe(true);
    expect(update.character.resourceLinks).toEqual(character.resourceLinks);
  });
  it('imports independent copies and only remaps incoming resource references, retaining link ownership and power notes', () => {
    const before = JSON.stringify({ character, local, incoming });
    const copy = prepareResourceImport(character, [incoming], [local], 'copy');
    expect(copy.resources[0].id).not.toBe(local.id);
    expect(copy.character.resourceLinks![0]).toEqual({ ...character.resourceLinks![0], resourceId: copy.resources[0].id });
    expect(copy.resources[0]).toEqual({ ...incoming, id: copy.resources[0].id });
    expect(JSON.stringify({ character, local, incoming })).toBe(before);
  });
  it('rejects missing references and duplicate UUIDs before any durable write', () => {
    expect(() => prepareResourceImport(character, [], [], 'keep')).toThrow();
    expect(() => parseResourceAppendix({ version: 2, items: [local, incoming] })).toThrow();
    expect(() => parseResourceLibrary(serializeResourceLibrary([local, incoming]))).toThrow();
    expect(saveResourceLibrary([local, incoming])).toBe(false);
    expect(storage.getItem('mm3e-resource-library')).toBeNull();
  });
  it('verifies the exact previous library backup and refuses imports when backup storage fails', () => {
    const raw = '{ original bytes }'; storage.setItem('mm3e-resource-library', raw);
    expect(preserveResourceImportBackup()).toBe(true);
    expect(JSON.parse(storage.getItem(RESOURCE_IMPORT_BACKUP_KEY)!).resources).toBe(raw);
    vi.stubGlobal('localStorage', { ...storage, setItem: () => { throw new Error('Full'); } });
    expect(preserveResourceImportBackup()).toBe(false);
    expect(storage.getItem('mm3e-resource-library')).toBe(raw);
  });
});
