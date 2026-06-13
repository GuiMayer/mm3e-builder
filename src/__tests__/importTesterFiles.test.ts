import { describe, it, expect } from 'vitest';
import { CharacterFileSchema } from '../entities/schemas';

/**
 * Test suite for validating schema compatibility with descriptors field
 * Verifies that the schema can properly validate character files with descriptors
 */
describe('Schema Descriptors Support', () => {
  it('should validate power with descriptors field', () => {
    const characterData = {
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      language: 'en',
      character: {
        header: {
          name: 'Test Character',
          player: 'Test',
          identity: 'Test',
          base: '',
          powerLevel: 2,
          heroPoints: 0,
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
        defenses: {
          dodge: 0,
          parry: 0,
          fortitude: 0,
          will: 0,
        },
        skills: [],
        advantages: [],
        powers: [
          {
            id: 'test-power-1',
            name: 'Magic Blast',
            descriptors: ['magic'],
            components: [
              {
                id: 'component-1',
                effectId: 'damage',
                ranks: 4,
                modifiers: [],
              },
            ],
            notes: 'Test power with descriptors',
            alternateEffects: [],
          },
        ],
        complications: [],
        equipmentNotes: '',
        equipment: [],
      },
    };

    const result = CharacterFileSchema.safeParse(characterData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.character.powers[0].descriptors).toContain('magic');
    }
  });

  it('should validate equipment with descriptors field', () => {
    const characterData = {
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      language: 'en',
      character: {
        header: {
          name: 'Test Character',
          player: 'Test',
          identity: 'Test',
          base: '',
          powerLevel: 2,
          heroPoints: 0,
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
        defenses: {
          dodge: 0,
          parry: 0,
          fortitude: 0,
          will: 0,
        },
        skills: [],
        advantages: [],
        powers: [],
        complications: [],
        equipmentNotes: '',
        equipment: [
          {
            id: 'equipment-1',
            name: 'Force Field',
            descriptors: ['Technology'],
            components: [
              {
                id: 'component-1',
                effectId: 'protection',
                ranks: 5,
                modifiers: [],
              },
            ],
            notes: 'Test equipment with descriptors',
            alternateEffects: [],
            removable: 'none',
          },
        ],
      },
    };

    const result = CharacterFileSchema.safeParse(characterData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.character.equipment[0].descriptors).toContain('Technology');
    }
  });

  it('should accept powers without descriptors field (backward compatibility)', () => {
    const characterData = {
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      language: 'en',
      character: {
        header: {
          name: 'Test Character',
          player: 'Test',
          identity: 'Test',
          base: '',
          powerLevel: 2,
          heroPoints: 0,
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
        defenses: {
          dodge: 0,
          parry: 0,
          fortitude: 0,
          will: 0,
        },
        skills: [],
        advantages: [],
        powers: [
          {
            id: 'test-power-1',
            name: 'Simple Power',
            components: [
              {
                id: 'component-1',
                effectId: 'damage',
                ranks: 2,
                modifiers: [],
              },
            ],
            notes: 'Power without descriptors',
            alternateEffects: [],
          },
        ],
        complications: [],
        equipmentNotes: '',
        equipment: [],
      },
    };

    const result = CharacterFileSchema.safeParse(characterData);
    expect(result.success).toBe(true);
  });
});
