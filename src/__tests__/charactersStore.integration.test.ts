import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { useCharactersStore } from '../store/charactersStore';

describe('charactersStore integration', () => {
  beforeEach(() => {
    useCharactersStore.setState({ tabs: [], activeCharacterId: null });
  });

  it('creates independent characters and selects the newest tab', () => {
    const store = useCharactersStore.getState();
    const firstId = store.addCharacter();
    const secondId = useCharactersStore.getState().addCharacter();
    const state = useCharactersStore.getState();

    expect(state.tabs.map((tab) => tab.id)).toEqual([firstId, secondId]);
    expect(state.activeCharacterId).toBe(secondId);
    expect(state.tabs[0].character.skills).not.toBe(
      state.tabs[1].character.skills
    );
  });

  it('deep-merges value objects and updates tab metadata', () => {
    const id = useCharactersStore.getState().addCharacter(
      createDefaultCharacter({
        header: {
          name: 'Before',
          player: 'Player',
          identity: 'Secret',
          base: 'Base',
          powerLevel: 10,
          heroPoints: 1,
        },
      })
    );

    useCharactersStore.getState().updateCharacter(id, {
      header: { name: 'After' },
    } as Partial<ReturnType<typeof createDefaultCharacter>>);

    const tab = useCharactersStore.getState().getCharacterById(id);
    expect(tab?.character.header).toMatchObject({
      name: 'After',
      player: 'Player',
      base: 'Base',
    });
    expect(tab?.label).toBe('After');
    expect(tab?.isDirty).toBe(true);
  });

  it('duplicates without sharing character or nested identities', () => {
    const sourceId = useCharactersStore.getState().addCharacter(
      createDefaultCharacter({
        header: {
          name: 'Hero',
          player: '',
          identity: '',
          base: '',
          powerLevel: 10,
          heroPoints: 1,
        },
        powers: [
          {
            id: 'source-power',
            name: 'Power',
            notes: '',
            components: [],
            alternateEffects: [],
          },
        ],
      })
    );

    const duplicateId = useCharactersStore.getState().duplicateCharacter(sourceId);
    const state = useCharactersStore.getState();
    const source = state.getCharacterById(sourceId);
    const duplicate = state.getCharacterById(duplicateId);

    expect(duplicate?.label).toBe('Hero (Copy)');
    expect(duplicate?.character).not.toBe(source?.character);
    expect(duplicate?.character.characterId).not.toBe(
      source?.character.characterId
    );
    expect(duplicate?.character.powers[0].id).not.toBe('source-power');
  });

  it('loads a persisted session without marking tabs dirty', () => {
    const character = createDefaultCharacter();
    useCharactersStore.getState().loadTabs(
      [
        {
          id: 'restored',
          character,
          isDirty: false,
          label: 'Restored',
          lastModified: 1,
        },
      ],
      'restored'
    );

    expect(useCharactersStore.getState()).toMatchObject({
      activeCharacterId: 'restored',
      tabs: [{ id: 'restored', isDirty: false }],
    });
  });
});
