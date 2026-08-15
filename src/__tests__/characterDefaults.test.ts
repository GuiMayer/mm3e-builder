import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';

describe('createDefaultCharacter', () => {
  it('creates independent nested collections', () => {
    const first = createDefaultCharacter();
    const second = createDefaultCharacter();

    first.skills.push({ skillId: 'acrobatics', ranks: 1, subtype: null });
    first.header.name = 'Changed';

    expect(second.skills).toEqual([]);
    expect(second.header.name).toBe('');
  });

  it('merges nested overrides without losing defaults', () => {
    const character = createDefaultCharacter({
      header: {
        name: 'Hero',
        player: '',
        identity: '',
        base: '',
        powerLevel: 12,
        heroPoints: 1,
      },
      abilities: {
        str: 5,
        sta: 0,
        agl: 0,
        dex: 0,
        fgt: 0,
        int: 0,
        awe: 0,
        pre: 0,
      },
    });

    expect(character.header.name).toBe('Hero');
    expect(character.header.powerLevel).toBe(12);
    expect(character.abilities.str).toBe(5);
    expect(character.defenses).toEqual({ dodge: 0, parry: 0, fortitude: 0, will: 0 });
  });
});
