import { describe, expect, it, vi } from 'vitest';
import { loadReferenceFavorites, saveReferenceFavorites, REFERENCE_FAVORITES_KEY } from '../features/references/favoritePreferences';
import { referenceCategories, selectReferenceSections } from '../features/references/referenceNavigation';
import { REFERENCE_SECTIONS, SIZE_SECTION, BENCHMARK_SECTION } from '../features/references/referenceCatalog';

const catalog = [...REFERENCE_SECTIONS, SIZE_SECTION, BENCHMARK_SECTION];
const validIds = new Set(catalog.map(section => section.id));

describe('Reference favorites preference', () => {
  it('round-trips stable IDs separately from character and measurement data', () => {
    const values = new Map([['mm3e-draft-characters', 'original'], ['mm3e-reference-measurement-system', 'metric']]);
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
    saveReferenceFavorites(new Set(['damage', 'turn']), storage);
    expect(loadReferenceFavorites(validIds, storage)).toEqual(new Set(['damage', 'turn']));
    expect(values.size).toBe(3);
    expect(values.get('mm3e-draft-characters')).toBe('original');
    expect(values.get('mm3e-reference-measurement-system')).toBe('metric');
    saveReferenceFavorites(new Set(), storage);
    expect(loadReferenceFavorites(validIds, storage).size).toBe(0);
    expect(JSON.parse(values.get(REFERENCE_FAVORITES_KEY)!)).toEqual({ version: 1, sectionIds: [] });
  });

  it.each([null, '', '{', 'null', '[]', '"damage"', '{"version":2,"sectionIds":["damage"]}', '{"version":1,"sectionIds":"damage"}'])('ignores malformed or unsupported preferences: %s', raw => {
    expect(loadReferenceFavorites(validIds, { getItem: () => raw }).size).toBe(0);
  });

  it('deduplicates known IDs and excludes removed IDs and invalid entries', () => {
    expect(loadReferenceFavorites(validIds, { getItem: () => JSON.stringify({ version: 1, sectionIds: ['damage', 'damage', 'removed', null, 2, {}, 'turn'] }) }))
      .toEqual(new Set(['damage', 'turn']));
  });

  it('does not prevent consultation when storage is inaccessible', () => {
    expect(loadReferenceFavorites(validIds, { getItem: () => { throw new Error('blocked'); } }).size).toBe(0);
    const selected = new Set(['turn']);
    expect(() => saveReferenceFavorites(selected, { setItem: () => { throw new Error('quota'); } })).not.toThrow();
    expect(selected).toEqual(new Set(['turn']));
  });

  it('keeps session favorites after leaving the view when browser storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    });
    try {
      saveReferenceFavorites(new Set(['turn', 'removed']));
      const restored = loadReferenceFavorites(validIds);
      expect(restored).toEqual(new Set(['turn']));
      restored.clear();
      expect(loadReferenceFavorites(validIds)).toEqual(new Set(['turn']));
      saveReferenceFavorites(new Set());
      expect(loadReferenceFavorites(validIds).size).toBe(0);
    } finally {
      saveReferenceFavorites(new Set());
      vi.unstubAllGlobals();
    }
  });
});

describe('Favorite reference navigation', () => {
  it('shows Favorites first only when a favorite exists', () => {
    expect(referenceCategories(new Set())[0]).toBe('quick');
    expect(referenceCategories(new Set())).not.toContain('favorites');
    expect(referenceCategories(new Set(['damage']))).toEqual(['favorites', ...referenceCategories(new Set())]);
  });

  it('keeps catalog order and shared section objects rather than favorite insertion order', () => {
    const original = structuredClone(catalog);
    const favorites = new Set(['benchmarks', 'damage', 'turn']);
    const selected = selectReferenceSections(catalog, 'favorites', '', favorites);
    expect(selected).toEqual(catalog.filter(section => favorites.has(section.id)));
    selected.forEach(section => expect(catalog).toContain(section));
    expect(catalog).toEqual(original);
  });

  it('scopes bilingual search to favorites while preserving global search elsewhere', () => {
    const favorites = new Set(['turn']);
    expect(selectReferenceSections(catalog, 'favorites', 'iniciativa', favorites).map(section => section.id)).toEqual(['turn']);
    expect(selectReferenceSections(catalog, 'favorites', 'initiative', favorites).map(section => section.id)).toEqual(['turn']);
    expect(selectReferenceSections(catalog, 'favorites', 'damage', favorites)).toEqual([]);
    expect(selectReferenceSections(catalog, 'hero', 'damage', favorites).map(section => section.id)).toContain('damage');
  });

  it('preserves normal category filtering and returns no panels after the last favorite is removed', () => {
    expect(selectReferenceSections(catalog, 'combat', '', new Set())).toEqual(catalog.filter(section => section.category === 'combat'));
    expect(selectReferenceSections(catalog, 'all', '', new Set())).toEqual(catalog);
    expect(selectReferenceSections(catalog, 'favorites', '', new Set())).toEqual([]);
  });
});
