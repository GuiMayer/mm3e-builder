import { useEffect } from 'react';
import { PERSONAL_LIBRARY_KEY } from './personalPowerModel';
import { usePersonalLibraryStore } from './personalLibraryStore';

/** Refresh readers while writers still compare the saved source before committing. */
export function usePersonalLibrarySync() {
  useEffect(() => {
    const reload = (event: StorageEvent) => {
      if (event.key === PERSONAL_LIBRARY_KEY || event.key === null) usePersonalLibraryStore.getState().reload();
    };
    usePersonalLibraryStore.getState().reload();
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);
}
