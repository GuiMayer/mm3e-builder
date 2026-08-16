import { useEffect, useRef } from 'react';
import { hasStoredDraft, loadDraftMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { migrateLegacyEquipmentToResources } from '../lib/resourceMigration';

const INSTANCE_KEY = 'mm3e-app-instance-active';

/** A recovered draft may intentionally contain no character tabs. */
export function isRecoveredCharacterDraft(
  draft: ReturnType<typeof loadDraftMulti>
): draft is NonNullable<ReturnType<typeof loadDraftMulti>> {
  return draft !== null;
}

/**
 * Hook that auto-loads character tabs from localStorage on app mount.
 * 
 * Features:
 * - Auto-loads all tabs on first mount
 * - Detects if another instance is already open (skips loading)
 * - Handles corrupted drafts gracefully
 * - Manages instance heartbeat to prevent conflicts
 * - Returns metadata for UI notification (tab count, last modified)
 */
export function useAutoLoadDraftMulti() {
  const hasRunRef = useRef(false);
  const loadTabs = useCharactersStore((s) => s.loadTabs);
  const setDraftHydrated = useCharactersStore((s) => s.setDraftHydrated);
  const setDraftLoadError = useCharactersStore((s) => s.setDraftLoadError);

  useEffect(() => {
    // Prevent double-run in React StrictMode
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    const instanceActive = localStorage.getItem(INSTANCE_KEY);
    const now = Date.now();
    
    if (instanceActive) {
      const timestamp = parseInt(instanceActive, 10);
      const timeDiff = now - timestamp;
      // The marker is advisory: skipping initialization here leaves this tab
      // with autosave disabled forever. Loading the latest durable draft is
      // safe and lets each tab work normally.
      if (timeDiff < 2000) {
        console.log('[useAutoLoadDraftMulti] Another instance detected, loading the latest saved draft');
      }
    }

    // Mark this instance as active
    localStorage.setItem(INSTANCE_KEY, now.toString());

    // Try to load draft tabs
    try {
      const draft = loadDraftMulti();
      if (isRecoveredCharacterDraft(draft)) {
        const migrated = draft.tabs.map((tab) => {
          const result = migrateLegacyEquipmentToResources(tab.character);
          if (result.resources.length > 0) useResourcesStore.getState().upsertResources(result.resources);
          return result.resources.length > 0 ? { ...tab, character: result.character, isDirty: true } : tab;
        });
        loadTabs(migrated, draft.activeId);
        setDraftHydrated(true);
        setDraftLoadError(null);
        console.log(`[useAutoLoadDraftMulti] Loaded ${draft.tabs.length} character(s)`);
      } else if (!hasStoredDraft()) {
        setDraftHydrated(true);
        setDraftLoadError(null);
        console.log('[useAutoLoadDraftMulti] No draft found, starting fresh');
      } else {
        console.error('[useAutoLoadDraftMulti] Stored draft was not recovered; autosave remains disabled to protect it.');
        setDraftLoadError('The saved Draft could not be recovered, so autosave is disabled to avoid replacing it.');
      }
    } catch (error) {
      console.error('[useAutoLoadDraftMulti] Failed to load draft:', error);
      setDraftLoadError('The saved Draft could not be read, so autosave is disabled to avoid replacing it.');
      // Keep the original payload intact. A future migration or manual export
      // is safer than silently replacing a draft that failed to load.
    }

    // Set up heartbeat to keep instance marker fresh
    const heartbeatInterval = setInterval(() => {
      localStorage.setItem(INSTANCE_KEY, Date.now().toString());
    }, 2000);

    // Clean up instance marker on unload
    const cleanup = () => {
      const currentTimestamp = localStorage.getItem(INSTANCE_KEY);
      // Only remove if we're the current instance
      if (currentTimestamp === now.toString() || 
          (currentTimestamp && Date.now() - parseInt(currentTimestamp, 10) < 3000)) {
        localStorage.removeItem(INSTANCE_KEY);
      }
    };
    window.addEventListener('beforeunload', cleanup);

    // Cleanup function
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [loadTabs, setDraftHydrated, setDraftLoadError]);

  // This hook has no return value - it's a side-effect only
}
