import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import {
  duplicateCharacterWithNewIds,
  getDuplicateCharacterName,
} from '../entities/characterOperations';

describe('character operations', () => {
  it('keeps the established duplicate naming sequence', () => {
    expect(getDuplicateCharacterName('Hero', ['Hero'])).toBe('Hero (Copy)');
    expect(
      getDuplicateCharacterName('Hero', ['Hero', 'Hero (Copy)', 'Hero (Copy 2)'])
    ).toBe('Hero (Copy 3)');
    expect(getDuplicateCharacterName('Hero (Copy)', ['Hero (Copy)'])).toBe(
      'Hero (Copy 2)'
    );
  });

  it('duplicates data and regenerates nested identities', () => {
    const source = createDefaultCharacter({
      characterId: '3d594650-3436-4e36-a785-6ad065f3c7b4',
      powers: [
        {
          id: 'power-old',
          name: 'Power',
          notes: '',
          components: [
            { id: 'component-old', effectId: 'damage', ranks: 1, modifiers: [] },
          ],
          alternateEffects: [
            {
              id: 'alternate-old',
              name: 'Alternate',
              notes: '',
              dynamic: false,
              components: [
                { id: 'alternate-component-old', effectId: 'damage', ranks: 1, modifiers: [] },
              ],
            },
          ],
        },
      ],
      resourceLinks: [
        { id: 'link-old-a', resourceId: 'resource-shared', isFree: false, alternateSetId: 'set-old' },
        { id: 'link-old-b', resourceId: 'resource-shared-b', isFree: true, alternateSetId: 'set-old' },
      ],
      manualOffenseRows: [
        { id: 'offense-old', name: 'Grab', bonus: 4, range: 'close', effect: 'Grab', notes: '' },
      ],
      ppLog: [
        { id: 'pp-log-old', date: '2026-08-16', amount: 1, note: 'Session' },
      ],
    });

    const duplicate = duplicateCharacterWithNewIds(source, 'Power Hero (Copy)');

    expect(duplicate).not.toBe(source);
    expect(duplicate.header.name).toBe('Power Hero (Copy)');
    expect(duplicate.characterId).not.toBe(source.characterId);
    expect(duplicate.powers[0].id).not.toBe('power-old');
    expect(duplicate.powers[0].components[0].id).not.toBe('component-old');
    expect(duplicate.powers[0].alternateEffects[0].id).not.toBe('alternate-old');
    expect(duplicate.resourceLinks?.[0].id).not.toBe('link-old-a');
    expect(duplicate.resourceLinks?.[0].resourceId).toBe('resource-shared');
    expect(duplicate.resourceLinks?.[0].alternateSetId).not.toBe('set-old');
    expect(duplicate.resourceLinks?.[1].alternateSetId).toBe(duplicate.resourceLinks?.[0].alternateSetId);
    expect(duplicate.manualOffenseRows?.[0].id).not.toBe('offense-old');
    expect(duplicate.ppLog?.[0].id).not.toBe('pp-log-old');
    expect(source.powers[0].id).toBe('power-old');
    expect(source.resourceLinks?.[0].id).toBe('link-old-a');
  });
});
