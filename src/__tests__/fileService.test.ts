import { describe, it, expect } from 'vitest';
import { CharacterFileSchema } from '../entities/schemas';

describe('fileService - Schema Validation', () => {
  it('validates a correct character file', () => {
    const valid = {
      schemaVersion: '1.0.0',
      exportedAt: '2026-04-02T14:00:00Z',
      character: {
        header: { name: 'Test', player: 'Player', identity: 'Secret', base: 'City', powerLevel: 10, heroPoints: 1 },
        abilities: { str: 5, sta: 3, agl: 2, dex: 1, fgt: 4, int: 2, awe: 3, pre: 1 },
        absentAbilities: [],
        defenses: { dodge: 2, parry: 3, fortitude: 4, will: 5 },
        skills: [{ skillId: 'acrobatics', ranks: 4, subtype: null }],
        advantages: [{ advantageId: 'power_attack', ranks: 1 }],
        powers: [],
        complications: [{ title: 'Motivation', description: 'Justice' }],
      },
    };
    const result = CharacterFileSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects missing schemaVersion', () => {
    const invalid = {
      exportedAt: '2026-04-02T14:00:00Z',
      character: {
        header: { name: '', player: '', identity: '', base: '', powerLevel: 10, heroPoints: 1 },
        abilities: { str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        absentAbilities: [],
        defenses: { dodge: 0, parry: 0, fortitude: 0, will: 0 },
        skills: [], advantages: [], powers: [], complications: [],
      },
    };
    const result = CharacterFileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid ability key in absentAbilities', () => {
    const invalid = {
      schemaVersion: '1.0.0',
      exportedAt: '2026-04-02T14:00:00Z',
      character: {
        header: { name: '', player: '', identity: '', base: '', powerLevel: 10, heroPoints: 1 },
        abilities: { str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 },
        absentAbilities: ['invalid_key'],
        defenses: { dodge: 0, parry: 0, fortitude: 0, will: 0 },
        skills: [], advantages: [], powers: [], complications: [],
      },
    };
    const result = CharacterFileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
