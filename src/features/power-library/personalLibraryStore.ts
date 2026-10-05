import { create } from 'zustand';
import { parsePersonalLibrary, serializePersonalLibrary, PERSONAL_LIBRARY_KEY, type PersonalPowerModel } from './personalPowerModel';

interface LibraryState {
  models: PersonalPowerModel[]; source: string | null; error: string | null;
  reload: () => void;
  put: (model: PersonalPowerModel, original?: PersonalPowerModel) => boolean;
  remove: (model: PersonalPowerModel) => boolean;
  merge: (models: PersonalPowerModel[], conflicts: 'copy' | 'replace' | 'keep') => boolean;
}
function read() {
  let source: string | null = null;
  try { source = localStorage.getItem(PERSONAL_LIBRARY_KEY); return { models: source !== null ? parsePersonalLibrary(source) : [], source, error: null }; }
  catch { return { models: [], source, error: 'personalLibrary.readError' }; }
}
export const usePersonalLibraryStore = create<LibraryState>()((set, get) => {
  const write = (models: PersonalPowerModel[]) => {
    const state = get();
    if (state.error === 'personalLibrary.readError') return false;
    try {
      if (localStorage.getItem(PERSONAL_LIBRARY_KEY) !== state.source) { set({ error: 'personalLibrary.storageConflict' }); return false; }
      const source = serializePersonalLibrary(models);
      localStorage.setItem(PERSONAL_LIBRARY_KEY, source);
      set({ models, source, error: null }); return true;
    } catch { set({ error: 'personalLibrary.writeError' }); return false; }
  };
  return { ...read(), reload: () => set(read()),
    put: (model, original) => {
      const existing = get().models.find(item => item.id === model.id);
      if ((original && JSON.stringify(existing) !== JSON.stringify(original)) || (!original && existing)) { set({ error: 'personalLibrary.storageConflict' }); return false; }
      return write(existing ? get().models.map(item => item.id === model.id ? model : item) : [...get().models, model]);
    },
    remove: model => {
      if (JSON.stringify(get().models.find(item => item.id === model.id)) !== JSON.stringify(model)) { set({ error: 'personalLibrary.storageConflict' }); return false; }
      return write(get().models.filter(item => item.id !== model.id));
    },
    merge: (models, conflicts) => {
      const byId = new Map(get().models.map(model => [model.id, model]));
      for (const model of models) if (!byId.has(model.id) || conflicts === 'replace') byId.set(model.id, model);
      // Copies are assigned new identities by the import coordinator before this operation.
      return write([...byId.values()]);
    },
  };
});
