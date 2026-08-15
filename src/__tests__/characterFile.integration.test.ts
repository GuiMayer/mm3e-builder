import { describe, expect, it, vi } from 'vitest';
import { importCharacterJSON } from '../services/character-file/importCharacter';

function createCharacterFile(schemaVersion = '1.0.0') {
  return {
    schemaVersion,
    exportedAt: '2026-01-01T00:00:00.000Z',
    character: {
      header: {
        name: 'Legacy Hero',
        player: 'Player',
        identity: 'Secret',
        base: 'City',
        powerLevel: 10,
        heroPoints: 1,
      },
      abilities: {
        str: 0,
        sta: 0,
        agl: 0,
        dex: 0,
        fgt: 0,
        int: 0,
        awe: 0,
        pre: 0,
      },
      absentAbilities: [],
      defenses: { dodge: 0, parry: 0, fortitude: 0, will: 0 },
      skills: [],
      advantages: [],
      powers: [],
      complications: [],
    },
  };
}

describe('character file integration', () => {
  it('validates, migrates, and normalizes a legacy JSON file', async () => {
    const file = new File(
      [JSON.stringify(createCharacterFile())],
      'legacy-character.json',
      { type: 'application/json' }
    );

    const character = await importCharacterJSON(file);

    expect(character.header.name).toBe('Legacy Hero');
    expect(character.equipmentNotes).toBe('');
    expect(character.equipment).toEqual([]);
  });

  it('preserves tolerant handling of a structurally compatible version', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const file = new File(
      [JSON.stringify(createCharacterFile('future-compatible'))],
      'future-character.json',
      { type: 'application/json' }
    );

    const character = await importCharacterJSON(file);

    expect(character.header.name).toBe('Legacy Hero');
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });
});
