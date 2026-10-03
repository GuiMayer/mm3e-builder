import { useMemo, useState } from 'react';

/** UI preference only: never enters character data, undo history or JSON exports. */
export function useCharacterDetailsPreference(characterId?: string) {
  const key = characterId ? `mm3e-character-details-open:${characterId}` : undefined;
  const storedOpen = useMemo(() => {
    if (!key) return false;
    try { return localStorage.getItem(key) === 'true'; }
    catch { return false; }
  }, [key]);
  // Keep each sheet independent even if browser storage becomes unavailable.
  const [sessionStates, setSessionStates] = useState(() => new Map<string | undefined, boolean>());
  const open = sessionStates.get(key) ?? storedOpen;

  function toggle() {
    const next = !open;
    if (key) {
      try { localStorage.setItem(key, String(next)); }
      catch { /* Continue using the preference within this session. */ }
    }
    setSessionStates(previous => new Map(previous).set(key, next));
  }

  return [open, toggle] as const;
}
