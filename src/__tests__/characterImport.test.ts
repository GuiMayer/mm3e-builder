import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import {
  duplicateImportedCharacter,
  ensureImportedCharacterIdentity,
  findCharacterIdentityMatches,
} from '../entities/characterImport';
import type { CharacterTab } from '../entities/characterTab';

const characterId = '3d594650-3436-4e36-a785-6ad065f3c7b4';

function createTab(id: string, identity = characterId): CharacterTab {
  return {
    id,
    character: createDefaultCharacter({ characterId: identity }),
    isDirty: false,
    label: id,
    lastModified: 0,
  };
}

describe('character import helpers', () => {
  it('finds every open tab with the imported character identity', () => {
    const matches = findCharacterIdentityMatches(
      [createTab('first'), createTab('other', 'c1a22134-71ac-4cc5-a9a6-60f797ce7b01'), createTab('second')],
      characterId
    );

    expect(matches.map((tab) => tab.id)).toEqual(['first', 'second']);
  });

  it('gives a legacy import a new character identity', () => {
    const character = ensureImportedCharacterIdentity(createDefaultCharacter());

    expect(character.characterId).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it('opens an imported copy with regenerated identities', () => {
    const source = createDefaultCharacter({
      characterId,
      header: { ...createDefaultCharacter().header, name: 'Hero' },
      powers: [{ id: 'power-old', name: 'Power', notes: '', components: [], alternateEffects: [] }],
    });

    const copy = duplicateImportedCharacter(source, ['Hero']);

    expect(copy.header.name).toBe('Hero (Copy)');
    expect(copy.characterId).not.toBe(characterId);
    expect(copy.powers[0].id).not.toBe('power-old');
  });
});
