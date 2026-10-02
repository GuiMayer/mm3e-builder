import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCharacterActions } from '../shared/hooks/useCharacterActions';
import { useCharactersStore } from '../store/charactersStore';
import { duplicateCharacterWithNewIds } from '../entities/characterOperations';
import { createDefaultCharacter } from '../entities/characterDefaults';

describe('Campaign actions and tab isolation', () => {
  beforeEach(() => useCharactersStore.getState().clearAllCharacters());
  it('targets the original tab after switching, rejects stale changes and supports undo', () => {
    let actions!: ReturnType<typeof useCharacterActions>;
    function Probe() { actions = useCharacterActions(); return null; }
    renderToStaticMarkup(createElement(Probe));
    const store = useCharactersStore.getState();
    const a = store.addCharacter({ campaignMode: true });
    const b = store.addCharacter();
    store.setActiveCharacter(b);
    expect(actions.addPPLogEntry({ date: '2026-10-02', amount: 5, note: 'Session', kind: 'award' }, a)).toBe(true);
    const entry = store.getCharacterById(a)!.character.ppLog![0];
    expect(store.getCharacterById(b)!.character.ppLog).toHaveLength(0);
    expect(actions.editPPLogEntry(a, 0, entry, { ...entry, note: 'Edited' })).toBe(true);
    expect(actions.removePPLogEntry(entry.id, a, 0, entry)).toBe(false);
    store.undoCharacter(a);
    expect(store.getCharacterById(a)!.character.ppLog![0]).toEqual(entry);
    expect(actions.reversePPLogEntry(a, 0, entry, 'Correction')).toBe(true);
    expect(actions.reversePPLogEntry(a, 0, entry, 'Again')).toBe(false);
    expect(store.getCharacterById(a)!.character.ppLog!.reduce((total, row) => total + row.amount, 0)).toBe(0);
    actions.setCampaignMode(false, a);
    expect(store.getCharacterById(a)!.character.ppLog).toHaveLength(2);
    expect(store.getCharacterById(b)!.character.campaign).toBeUndefined();
  });
  it('preserves legacy fractions and duplicate IDs while deleting only the selected entry', () => {
    let actions!: ReturnType<typeof useCharacterActions>;
    function Probe() { actions = useCharacterActions(); return null; }
    renderToStaticMarkup(createElement(Probe));
    const store = useCharactersStore.getState();
    const original = { id: 'duplicate', date: 'old date', amount: 1.5, note: '  original  ' };
    const id = store.addCharacter({ campaignMode: true, ppLog: [original, { ...original, note: 'Second' }] });
    expect(actions.editPPLogEntry(id, 0, original, { ...original, note: 'Updated' })).toBe(true);
    expect(actions.addPPLogEntry({ date: '2026-10-02', amount: 1.5, note: '' }, id)).toBe(false);
    expect(actions.removePPLogEntry(original.id, id, 1, { ...original, note: 'Second' })).toBe(true);
    expect(store.getCharacterById(id)!.character.ppLog).toEqual([{ ...original, note: 'Updated' }]);
    expect(actions.setCampaignBudget(id, 150.5)).toBe(false);
    expect(actions.setCampaignBudget(id, 120)).toBe(true);
  });
  it('duplicates reversal references with new IDs while preserving every ledger record', () => {
    const character = createDefaultCharacter({ campaignMode: true, ppLog: [
      { id: 'original', date: '', amount: 1.5, note: 'First' },
      { id: 'reverse', date: '', amount: -1.5, note: 'Correction', reversesEntryId: 'original' },
      { id: 'original', date: '', amount: 2, note: 'Duplicate legacy ID' },
    ] });
    const clone = duplicateCharacterWithNewIds(character, 'Copy');
    expect(new Set(clone.ppLog!.map(entry => entry.id)).size).toBe(3);
    expect(clone.ppLog![1].reversesEntryId).toBe(clone.ppLog![0].id);
    expect(clone.campaign).toEqual(character.campaign);
    expect(clone.ppLog!.map(({ amount, note }) => ({ amount, note }))).toEqual(character.ppLog!.map(({ amount, note }) => ({ amount, note })));
  });
});
