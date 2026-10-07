import { useResourcesStore } from '../../store/resourcesStore';

/** Undo an owned resource write only while its exact durable bytes are still current. */
export function captureResourceRollback(): { markWritten: () => void; rollback: () => void } {
  const previous = useResourcesStore.getState();
  let writtenSource: string | null | undefined;
  return {
    markWritten: () => { writtenSource = useResourcesStore.getState().lastSavedSource; },
    rollback: () => {
      if (writtenSource === undefined) return;
      if (localStorage.getItem('mm3e-resource-library') !== writtenSource) {
        throw new Error('resources.error.storageConflict');
      }
      if (previous.lastSavedSource === null) localStorage.removeItem('mm3e-resource-library');
      else localStorage.setItem('mm3e-resource-library', previous.lastSavedSource);
      useResourcesStore.setState(previous);
    },
  };
}
