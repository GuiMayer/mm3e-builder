import { useEffect, useRef, useSyncExternalStore } from 'react';
import { loadDraft } from '../../services/fileService';
import type { ICharacter } from '../../entities/types';

const INSTANCE_KEY = 'mm3e-app-instance-active';

interface DraftInfo {
  loaded: boolean;
  character: ICharacter | null;
  skippedDueToMultipleInstances: boolean;
}

let cachedDraftInfo: DraftInfo | null = null;

function detectDraftInfo(): DraftInfo {
  if (cachedDraftInfo) return cachedDraftInfo;

  let draft: ICharacter | null = null;
  try {
    draft = loadDraft();
  } catch (error) {
    console.error('[useAutoLoadDraft] Failed to load draft:', error);
    try {
      localStorage.removeItem('mm3e-draft-character');
    } catch {
      // Ignore cleanup errors
    }
  }

  const instanceActive = localStorage.getItem(INSTANCE_KEY);
  const now = Date.now();

  if (instanceActive) {
    const timestamp = parseInt(instanceActive, 10);
    const timeDiff = now - timestamp;
    if (timeDiff < 2000) {
      cachedDraftInfo = {
        loaded: false,
        character: null,
        skippedDueToMultipleInstances: true,
      };
      return cachedDraftInfo;
    }
  }

  cachedDraftInfo = {
    loaded: false,
    character: draft,
    skippedDueToMultipleInstances: false,
  };
  return cachedDraftInfo;
}

/**
 * Hook that detects character draft from localStorage on app mount.
 * 
 * Features:
 * - Detects draft on every page load to show notification banner
 * - Does NOT auto-load - waits for user action
 * - Detects if another instance is already open (skips detection)
 * - Returns draft info for UI notification
 * - Handles corrupted drafts gracefully
 */
export function useAutoLoadDraft() {
  const hasRunRef = useRef(false);
  const draftInfo = useSyncExternalStore(
    () => () => undefined,
    detectDraftInfo,
    detectDraftInfo
  );

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
      // (reduced from 5s to avoid React StrictMode double-mount issues)
      if (timeDiff < 2000) {
        return;
      }
    }

    // Mark this instance as active
    localStorage.setItem(INSTANCE_KEY, now.toString());

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
    };
  }, []);

  return draftInfo;
}
