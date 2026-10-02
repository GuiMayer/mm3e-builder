import { create } from 'zustand';
import type { IResource } from '../entities/types';
import { readResourceLibrary, saveResourceLibrary, migrateResourceMetadata } from '../services/storage/resourceLibraryStorage';

interface ResourcesStoreState {
  resources: IResource[]; past: IResource[][]; future: IResource[][];
  loadError: string | null; storageError: string | null; quarantined: unknown[]; source: string | null;
  addResource: (resource: IResource) => boolean;
  updateResource: (resource: IResource) => boolean;
  upsertResources: (resources: IResource[], replaceExisting?: boolean) => boolean;
  removeResource: (id: string) => boolean;
  replaceResources: (resources: IResource[]) => boolean;
  resetResources: () => void;
  getResource: (id: string) => IResource | undefined;
  undo: () => boolean; redo: () => boolean;
}
const loaded = readResourceLibrary();
export const useResourcesStore = create<ResourcesStoreState>()((set, get) => {
  const write = (resources: IResource[], history: { past: IResource[][]; future: IResource[][] }, replaceUnreadable = false): boolean => {
    const state = get();
    if (!saveResourceLibrary(resources, state.quarantined, {}, replaceUnreadable)) { set({ storageError: 'resources.error.storageWrite' }); return false; }
    set({ resources, ...history, storageError: null, ...(replaceUnreadable && state.loadError === 'resources.storage.unreadable' ? { loadError: null } : {}) });
    return true;
  };
  const change = (resources: IResource[]) => {
    const state = get();
    return write(resources, { past: [...state.past, structuredClone(state.resources)].slice(-50), future: [] });
  };
  return {
    resources: loaded.resources, past: [], future: [], loadError: loaded.error,
    quarantined: loaded.quarantined, source: loaded.source, storageError: null,
    addResource: (resource) => change([...get().resources, migrateResourceMetadata(resource)]),
    updateResource: (resource) => get().resources.some((item) => item.id === resource.id) && change(get().resources.map((item) => item.id === resource.id ? resource : item)),
    upsertResources: (resources, replaceExisting = false) => {
      const byId = new Map(get().resources.map((resource) => [resource.id, resource]));
      for (const resource of resources) if (replaceExisting || !byId.has(resource.id)) byId.set(resource.id, migrateResourceMetadata(resource));
      return change([...byId.values()]);
    },
    removeResource: (id) => change(get().resources.filter((resource) => resource.id !== id)),
    replaceResources: (resources) => write(resources.map(migrateResourceMetadata), { past: [...get().past, structuredClone(get().resources)].slice(-50), future: [] }, true),
    resetResources: () => set({ resources: [] }),
    getResource: (id) => get().resources.find((resource) => resource.id === id),
    undo: () => { const state = get(), previous = state.past.at(-1); return !!previous && write(structuredClone(previous), { past: state.past.slice(0, -1), future: [...state.future, structuredClone(state.resources)].slice(-50) }); },
    redo: () => { const state = get(), next = state.future.at(-1); return !!next && write(structuredClone(next), { past: [...state.past, structuredClone(state.resources)].slice(-50), future: state.future.slice(0, -1) }); },
  };
});
