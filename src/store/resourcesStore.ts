import { create } from 'zustand';
import type { IResource } from '../entities/types';
import { loadResourceLibrary, saveResourceLibrary } from '../services/storage/resourceLibraryStorage';

interface ResourcesStoreState {
  resources: IResource[];
  past: IResource[][];
  future: IResource[][];
  addResource: (resource: IResource) => void;
  updateResource: (resource: IResource) => void;
  upsertResources: (resources: IResource[]) => boolean;
  removeResource: (id: string) => void;
  replaceResources: (resources: IResource[]) => boolean;
  resetResources: () => void;
  getResource: (id: string) => IResource | undefined;
  undo: () => void;
  redo: () => void;
}

function persist(resources: IResource[]) {
  saveResourceLibrary(resources);
  return { resources };
}

export const useResourcesStore = create<ResourcesStoreState>()((set, get) => ({
  resources: loadResourceLibrary(),
  past: [], future: [],
  addResource: (resource) => set((state) => ({ ...persist([...state.resources, resource]), past: [...state.past, structuredClone(state.resources)].slice(-50), future: [] })),
  updateResource: (resource) => set((state) => ({ ...persist(state.resources.map((item) => item.id === resource.id ? resource : item)), past: [...state.past, structuredClone(state.resources)].slice(-50), future: [] })),
  upsertResources: (resources) => {
    const state = get();
    const byId = new Map(state.resources.map((resource) => [resource.id, resource]));
    for (const resource of resources) if (!byId.has(resource.id)) byId.set(resource.id, resource);
    const next = [...byId.values()];
    if (!saveResourceLibrary(next)) return false;
    set(next.length === state.resources.length
      ? { resources: next }
      : { resources: next, past: [...state.past, structuredClone(state.resources)].slice(-50), future: [] });
    return true;
  },
  removeResource: (id) => set((state) => ({ ...persist(state.resources.filter((resource) => resource.id !== id)), past: [...state.past, structuredClone(state.resources)].slice(-50), future: [] })),
  replaceResources: (resources) => {
    const state = get();
    if (!saveResourceLibrary(resources)) return false;
    set({ resources, past: [...state.past, structuredClone(state.resources)].slice(-50), future: [] });
    return true;
  },
  resetResources: () => set({ resources: [] }),
  getResource: (id) => get().resources.find((resource) => resource.id === id),
  undo: () => set((state) => { const previous = state.past.at(-1); return previous ? { ...persist(structuredClone(previous)), past: state.past.slice(0, -1), future: [...state.future, structuredClone(state.resources)].slice(-50) } : {}; }),
  redo: () => set((state) => { const next = state.future.at(-1); return next ? { ...persist(structuredClone(next)), past: [...state.past, structuredClone(state.resources)].slice(-50), future: state.future.slice(0, -1) } : {}; }),
}));
