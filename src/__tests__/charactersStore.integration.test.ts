import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { useCharactersStore } from '../store/charactersStore';

describe('charactersStore integration', () => {
  beforeEach(() => {
    useCharactersStore.setState({
      tabs: [],
      activeCharacterId: null,
      historyByTabId: {},
    });
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
    expect(useCharactersStore.getState().historyByTabId).toEqual({});
  });

  it('undoes and redoes a committed power deletion', () => {
    const power = {
      id: 'power-1',
      name: 'Energy Blast',
      notes: '',
      components: [],
      alternateEffects: [],
    };
    const id = useCharactersStore.getState().addCharacter(
      createDefaultCharacter({ powers: [power] })
    );

    useCharactersStore.getState().updateCharacter(id, { powers: [] });
    expect(useCharactersStore.getState().canUndoCharacter(id)).toBe(true);
    expect(useCharactersStore.getState().getCharacterById(id)?.character.powers).toEqual([]);

    useCharactersStore.getState().undoCharacter(id);
    expect(useCharactersStore.getState().getCharacterById(id)?.character.powers).toEqual([power]);
    expect(useCharactersStore.getState().canRedoCharacter(id)).toBe(true);

    useCharactersStore.getState().redoCharacter(id);
    expect(useCharactersStore.getState().getCharacterById(id)?.character.powers).toEqual([]);
  });

  it('restores an edited equipment item without affecting another tab', () => {
    const equipment = {
      id: 'equipment-1',
      name: 'Utility Belt',
      notes: '',
      components: [],
      alternateEffects: [],
    };
    const firstId = useCharactersStore.getState().addCharacter(
      createDefaultCharacter({ equipment: [equipment] })
    );
    const secondHeader = { ...createDefaultCharacter().header, name: 'Second' };
    const secondId = useCharactersStore.getState().addCharacter(
      createDefaultCharacter({ header: secondHeader })
    );

    useCharactersStore.getState().updateCharacter(firstId, {
      equipment: [{ ...equipment, name: 'Advanced Utility Belt' }],
    });
    useCharactersStore.getState().updateCharacter(secondId, {
      header: { ...secondHeader, name: 'Changed Second' },
    });
    useCharactersStore.getState().undoCharacter(firstId);

    expect(useCharactersStore.getState().getCharacterById(firstId)?.character.equipment).toEqual([
      equipment,
    ]);
    expect(useCharactersStore.getState().getCharacterById(secondId)?.character.header.name).toBe(
      'Changed Second'
    );
  });

  it('keeps a reset as one reversible character change', () => {
    const beforeResetHeader = {
      ...createDefaultCharacter().header,
      name: 'Before Reset',
    };
    const id = useCharactersStore.getState().addCharacter(
      createDefaultCharacter({ header: beforeResetHeader })
    );
    const reset = createDefaultCharacter();

    useCharactersStore.getState().updateCharacter(id, reset);
    expect(useCharactersStore.getState().getCharacterById(id)?.character.header.name).toBe('');

    useCharactersStore.getState().undoCharacter(id);
    expect(useCharactersStore.getState().getCharacterById(id)?.character.header.name).toBe(
      'Before Reset'
    );
  });
});
