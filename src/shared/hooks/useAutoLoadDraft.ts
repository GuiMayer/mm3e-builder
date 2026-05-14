import { useEffect, useState, useRef } from 'react';
import { loadDraft } from '../../services/fileService';
import type { ICharacter } from '../../entities/types';

const INSTANCE_KEY = 'mm3e-app-instance-active';

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
  const [draftInfo, setDraftInfo] = useState<{
    loaded: boolean;
    character: ICharacter | null;
    skippedDueToMultipleInstances: boolean;
  }>({
    loaded: false,
    character: null,
    skippedDueToMultipleInstances: false,
  });

  useEffect(() => {
    // Prevent double-run in React StrictMode
    if (hasRunRef.current) {
      return;
    }
    hasRunRef.current = true;

    // Try to detect draft first (before instance check)
    let draft: ICharacter | null = null;
    try {
      draft = loadDraft();
    } catch (error) {
      console.error('[useAutoLoadDraft] Failed to load draft:', error);
      // Clear corrupted draft
      try {
        localStorage.removeItem('mm3e-draft-character');
      } catch {
        // Ignore cleanup errors
      }
    }

    // Check if another instance is already active
    const instanceActive = localStorage.getItem(INSTANCE_KEY);
    const now = Date.now();
    
    if (instanceActive) {
      const timestamp = parseInt(instanceActive, 10);
      const timeDiff = now - timestamp;
      // If another instance was active in the last 2 seconds, skip loading
      // (reduced from 5s to avoid React StrictMode double-mount issues)
      if (timeDiff < 2000) {
        setDraftInfo({
          loaded: false,
          character: null,
          skippedDueToMultipleInstances: true,
        });
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

    // Set draft info if we found one
    if (draft) {
      setDraftInfo({
        loaded: false, // Not loaded yet - just detected
        character: draft,
        skippedDueToMultipleInstances: false,
      });
    }

    // Cleanup function
    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', cleanup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return draftInfo;
}
