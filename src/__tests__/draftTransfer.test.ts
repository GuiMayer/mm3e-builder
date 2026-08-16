import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { IResource } from '../entities/types';
import { parseDraftBundle, serializeDraftBundle } from '../services/draftTransfer';

const resource: IResource = { id: '4e842e63-57fb-46ba-bce3-58264d1fc591', type: 'gear', name: 'Scanner', notes: '', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', power: { id: 'power-1', name: 'Scanner', components: [], notes: '', alternateEffects: [] } };

describe('Draft JSONL transfer', () => {
  it('round-trips every character tab, active selection and resource', () => {
    const tab = { id: 'tab-1', character: createDefaultCharacter({ characterId: 'd7eac672-3b0c-4e6b-a0bf-25c21e10d635' }), label: 'Hero', isDirty: false, lastModified: 10 };
    const restored = parseDraftBundle(serializeDraftBundle([tab], tab.id, [resource]));
    expect(restored.activeId).toBe(tab.id);
    expect(restored.tabs[0].label).toBe('Hero');
    expect(restored.resources).toEqual([resource]);
  });

  it('rejects invalid records before any storage operation can occur', () => {
    expect(() => parseDraftBundle('{"type":"manifest"}\n{"type":"resource","resource":{}}')).toThrow();
  });
});
