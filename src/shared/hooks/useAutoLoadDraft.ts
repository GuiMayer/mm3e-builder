import { useEffect, useState } from 'react';
import { useCharStore } from '../../store/charStore';
import { loadDraft } from '../../services/fileService';
import type { ICharacter } from '../../entities/types';

const INSTANCE_KEY = 'mm3e-app-instance-active';

/**
 * Hook that auto-loads the character draft from localStorage on app mount.
 * 
 * Features:
 * - Loads draft on every page load to show notification banner
 * - Detects if another instance is already open (skips load)
 * - Returns draft info for UI notification
 * - Handles corrupted drafts gracefully
 */
export function useAutoLoadDraft() {
  const loadCharacter = useCharStore((s) => s.loadCharacter);
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
    console.log('[useAutoLoadDraft] Effect triggered');
    
    // Check if another instance is already active
    const instanceActive = localStorage.getItem(INSTANCE_KEY);
    const now = Date.now();
    console.log('[useAutoLoadDraft] Instance check:', { instanceActive, now });
    
    if (instanceActive) {
      const timestamp = parseInt(instanceActive, 10);
      const timeDiff = now - timestamp;
      console.log('[useAutoLoadDraft] Instance timestamp check:', { timestamp, timeDiff, threshold: 5000 });
      // If another instance was active in the last 5 seconds, skip loading
      if (timeDiff < 5000) {
        console.log('[useAutoLoadDraft] Another instance detected, skipping draft load');
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

    // Try to load draft
    try {
      const draft = loadDraft();
      
      if (draft) {
        console.log('[useAutoLoadDraft] Draft found, loading character');
        loadCharacter(draft);
        setDraftInfo({
          loaded: true,
          character: draft,
          skippedDueToMultipleInstances: false,
        });
      } else {
        console.log('[useAutoLoadDraft] No draft found');
      }
    } catch (error) {
      console.error('[useAutoLoadDraft] Failed to load draft:', error);
      // Clear corrupted draft
      try {
        localStorage.removeItem('mm3e-draft-character');
      } catch {
        // Ignore cleanup errors
      }
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
