import { useEffect, useRef } from 'react';
import { loadDraftMulti, getDraftMetadataMulti } from '../../services/fileService';
import { useCharactersStore } from '../../store/charactersStore';

const INSTANCE_KEY = 'mm3e-app-instance-active';

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
      // If another instance was active in the last 2 seconds, skip loading
      if (timeDiff < 2000) {
        console.log('[useAutoLoadDraftMulti] Another instance detected, skipping auto-load');
        return;
      }
    }

    // Mark this instance as active
    localStorage.setItem(INSTANCE_KEY, now.toString());

    // Try to load draft tabs
    try {
      const draft = loadDraftMulti();
      if (draft && draft.characters.length > 0) {
        loadTabs(draft.characters, draft.activeCharacterId);
        console.log(`[useAutoLoadDraftMulti] Loaded ${draft.characters.length} character(s)`);
      } else {
        console.log('[useAutoLoadDraftMulti] No draft found, starting fresh');
      }
    } catch (error) {
      console.error('[useAutoLoadDraftMulti] Failed to load draft:', error);
      // If draft is corrupted, start fresh
      try {
        localStorage.removeItem('mm3e-draft-multi');
        localStorage.removeItem('mm3e-draft-metadata');
      } catch {
        // Ignore cleanup errors
      }
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
  }, [loadTabs]);

  // Return metadata for UI notifications (if needed)
  return getDraftMetadataMulti();
}
