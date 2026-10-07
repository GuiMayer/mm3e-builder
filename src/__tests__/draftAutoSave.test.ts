import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { CharacterTab } from '../store/charactersStore';
import { useDraftAutoSave } from '../shared/hooks/useDraftAutoSave';

const mock = vi.hoisted(() => ({
  save: vi.fn(), alert: vi.fn(), acknowledge: vi.fn(), error: vi.fn(),
  effects: [] as (() => (() => void) | undefined)[], refs: [] as { current: unknown }[], cursor: 0,
  tabs: [] as CharacterTab[], activeId: null as string | null, hydrated: false,
}));
vi.mock('react', () => ({
  useRef: (initial: unknown) => mock.refs[mock.cursor++] ?? (mock.refs[mock.cursor - 1] = { current: initial }),
  useEffect: (effect: () => (() => void) | undefined) => mock.effects.push(effect),
}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../shared/ui/appDialogContext', () => ({ useAppDialog: () => ({ alert: mock.alert }) }));
vi.mock('../store/charactersStore', () => ({ useCharactersStore: (selector: (state: unknown) => unknown) => selector({
  tabs: mock.tabs, activeCharacterId: mock.activeId, isDraftHydrated: mock.hydrated, acknowledgePersisted: mock.acknowledge,
}) }));
vi.mock('../services/fileService', () => ({ saveDraftMulti: mock.save, getLastDraftSaveError: mock.error }));
let cleanup: (() => void) | undefined;
function render() {
  cleanup?.(); mock.cursor = 0; mock.effects = [];
  useDraftAutoSave();
  cleanup = mock.effects[0]();
}
const tab = (): CharacterTab => ({ id: 'hero', character: createDefaultCharacter(), isDirty: true, label: 'Hero', lastModified: 1, revision: 3 });
beforeEach(() => {
  vi.useFakeTimers(); vi.stubGlobal('window', { setTimeout });
  mock.save.mockReset().mockReturnValue(true); mock.alert.mockReset(); mock.acknowledge.mockReset(); mock.error.mockReset();
  mock.refs = []; mock.tabs = []; mock.activeId = null; mock.hydrated = true; cleanup = undefined;
});
afterEach(() => { cleanup?.(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('draft autosave lifecycle', () => {
  it('does not write an empty draft at fresh or unrecoverable startup', () => {
    render(); vi.advanceTimersByTime(2000);
    expect(mock.save).not.toHaveBeenCalled();
  });
  it('waits for hydration before persisting any character', () => {
    mock.tabs = [tab()]; mock.activeId = 'hero'; mock.hydrated = false;
    render(); vi.advanceTimersByTime(2000);
    expect(mock.save).not.toHaveBeenCalled();
    mock.hydrated = true; render(); vi.advanceTimersByTime(500);
    expect(mock.save).toHaveBeenCalledWith(mock.tabs, 'hero');
  });
  it('saves closing the last character immediately and cancels its stale pending save', () => {
    mock.tabs = [tab()]; mock.activeId = 'hero'; render();
    vi.advanceTimersByTime(100);
    mock.tabs = []; mock.activeId = null; render();
    expect(mock.save.mock.calls).toEqual([[[], null]]);
    vi.advanceTimersByTime(2000);
    expect(mock.save).toHaveBeenCalledTimes(1);
  });
  it('persists an empty draft after a previously saved character is closed', () => {
    mock.tabs = [tab()]; mock.activeId = 'hero'; render(); vi.advanceTimersByTime(500);
    expect(mock.acknowledge).toHaveBeenCalledWith([{ id: 'hero', revision: 3 }]);
    mock.tabs = []; mock.activeId = null; render();
    expect(mock.save).toHaveBeenLastCalledWith([], null);
  });
  it('keeps local edits dirty on conflict and shows the actionable error once', () => {
    mock.tabs = [tab()]; mock.activeId = 'hero';
    mock.save.mockReturnValue(false); mock.error.mockReturnValue('draft.saveError.storageConflict');
    render(); vi.advanceTimersByTime(500);
    render(); vi.advanceTimersByTime(500);
    expect(mock.acknowledge).not.toHaveBeenCalled();
    expect(mock.alert).toHaveBeenCalledTimes(1);
    expect(mock.alert).toHaveBeenCalledWith({ title: 'draft.saveErrorTitle', message: 'draft.saveError.storageConflict' });
    expect(mock.tabs[0].isDirty).toBe(true);
  });
});
