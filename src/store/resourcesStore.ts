import { create } from 'zustand';
import type { IResource } from '../entities/types';
import { loadResourceLibrary, saveResourceLibrary } from '../services/storage/resourceLibraryStorage';

interface ResourcesStoreState {
  resources: IResource[];
  addResource: (resource: IResource) => void;
  updateResource: (resource: IResource) => void;
  upsertResources: (resources: IResource[]) => void;
  removeResource: (id: string) => void;
  getResource: (id: string) => IResource | undefined;
}

function persist(resources: IResource[]) {
  saveResourceLibrary(resources);
  return { resources };
}

export const useResourcesStore = create<ResourcesStoreState>()((set, get) => ({
  resources: loadResourceLibrary(),
  addResource: (resource) => set((state) => persist([...state.resources, resource])),
  updateResource: (resource) => set((state) => persist(state.resources.map((item) => item.id === resource.id ? resource : item))),
  upsertResources: (resources) => set((state) => {
    const byId = new Map(state.resources.map((resource) => [resource.id, resource]));
    for (const resource of resources) if (!byId.has(resource.id)) byId.set(resource.id, resource);
    return persist([...byId.values()]);
  }),
  removeResource: (id) => set((state) => persist(state.resources.filter((resource) => resource.id !== id))),
  getResource: (id) => get().resources.find((resource) => resource.id === id),
}));
