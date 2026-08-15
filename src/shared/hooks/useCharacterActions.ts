import { useCallback } from 'react';
import { useCharactersStore } from '../../store/charactersStore';
import { migratePowers, migrateAdvantages } from '../lib/powerMigration';
import type { ICharacter, AbilityKey, IPPLogEntry, IManualOffenseRow } from '../../entities/types';
import { ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import { createDefaultCharacter } from '../../entities/characterDefaults';

/**
 * Hook providing character mutation actions.
 * Works on the currently active character in charactersStore.
 * 
 * Use alongside useActiveCharacter() for a complete replacement of useCharStore.
 */
export function useCharacterActions() {
  const store = useCharactersStore();

  const updateHeader = useCallback((partial: Partial<ICharacter['header']>) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    const active = store.getCharacterById(activeId);
    if (!active) return;

    store.updateCharacter(activeId, {
      header: { ...active.character.header, ...partial },
    });
  }, [store]);

  const setAbility = useCallback((key: AbilityKey, value: number) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    const active = store.getCharacterById(activeId);
    if (!active) return;

    store.updateCharacter(activeId, {
      abilities: { ...active.character.abilities, [key]: value },
    });
  }, [store]);

  const toggleAbsentAbility = useCallback((key: AbilityKey) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    const active = store.getCharacterById(activeId);
    if (!active) return;

    const absent = active.character.absentAbilities;
    const newAbsent = absent.includes(key)
      ? absent.filter((k) => k !== key)
      : [...absent, key];

    store.updateCharacter(activeId, {
      absentAbilities: newAbsent,
      abilities: {
        ...active.character.abilities,
        ...(newAbsent.includes(key) ? { [key]: 0 } : {}),
      },
    });
  }, [store]);

  const setDefense = useCallback((key: keyof ICharacter['defenses'], value: number) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    const active = store.getCharacterById(activeId);
    if (!active) return;

    store.updateCharacter(activeId, {
      defenses: { ...active.character.defenses, [key]: value },
    });
  }, [store]);

  const loadCharacter = useCallback((character: ICharacter) => {
    const activeId = store.activeCharacterId;

    const migratedCharacter = {
      ...character,
      powers: migratePowers(character.powers as unknown[]),
      advantages: migrateAdvantages((character.advantages as unknown[]) ?? [], ADVANTAGE_DEFS),
    };

    // Validate characterId format if present
    let hasValidCharacterId = false;
    if (migratedCharacter.characterId) {
      // UUID v4 format validation: 8-4-4-4-12 hex digits
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (uuidRegex.test(migratedCharacter.characterId)) {
        hasValidCharacterId = true;
      } else {
        console.warn('[loadCharacter] Invalid characterId format detected, treating as character without ID');
        // Remove invalid characterId - will be treated as new character
        migratedCharacter.characterId = undefined;
      }
    }

    // Smart import logic based on characterId matching
    if (activeId && hasValidCharacterId) {
      const activeTab = store.getCharacterById(activeId);
      
      // If characterId matches the current active tab's character → REPLACE
      if (activeTab?.character.characterId === migratedCharacter.characterId) {
        console.log('[loadCharacter] Updating existing character (same characterId)');
        store.updateCharacter(activeId, migratedCharacter);
        return;
      }
    }
    
    // FALLBACK: Different ID, no ID, or no active tab → CREATE NEW TAB
    console.log('[loadCharacter] Creating new tab (different or missing characterId)');
    
    // Ensure imported character has characterId
    if (!migratedCharacter.characterId) {
      migratedCharacter.characterId = crypto.randomUUID();
    }
    
    store.addCharacter(migratedCharacter);
  }, [store]);

  const resetCharacter = useCallback(() => {
    const activeId = store.activeCharacterId;

    if (activeId) {
      const active = store.getCharacterById(activeId);
      if (active) {
        store.updateCharacter(activeId, createDefaultCharacter());
        // isDirty is already set to true by updateCharacter
        // Auto-save will be triggered automatically after debounce
      }
    }
  }, [store]);

  const setSkills = useCallback((skills: ICharacter['skills']) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { skills });
  }, [store]);

  const setAdvantages = useCallback((advantages: ICharacter['advantages']) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { advantages });
  }, [store]);

  const setPowers = useCallback((powers: ICharacter['powers']) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { powers });
  }, [store]);

  const setComplications = useCallback((complications: ICharacter['complications']) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { complications });
  }, [store]);

  const setEquipment = useCallback((equipment: ICharacter['equipment']) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { equipment });
  }, [store]);

  const setEquipmentNotes = useCallback((notes: string) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { equipmentNotes: notes });
  }, [store]);

  const setNotes = useCallback((notes: string) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { notes });
  }, [store]);

  const setManualOffenseRows = useCallback((rows: IManualOffenseRow[]) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { manualOffenseRows: rows });
  }, [store]);

  const setCampaignMode = useCallback((enabled: boolean) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    store.updateCharacter(activeId, { campaignMode: enabled });
  }, [store]);

  const addPPLogEntry = useCallback((entry: Omit<IPPLogEntry, 'id'>) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    const active = store.getCharacterById(activeId);
    if (!active) return;

    const newEntry: IPPLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };

    const ppLog = active.character.ppLog || [];
    store.updateCharacter(activeId, {
      ppLog: [...ppLog, newEntry],
    });
  }, [store]);

  const removePPLogEntry = useCallback((id: string) => {
    const activeId = store.activeCharacterId;
    if (!activeId) return;

    const active = store.getCharacterById(activeId);
    if (!active) return;

    const ppLog = active.character.ppLog || [];
    store.updateCharacter(activeId, {
      ppLog: ppLog.filter((entry) => entry.id !== id),
    });
  }, [store]);

  const markClean = useCallback(() => {
    const activeId = store.activeCharacterId;
    if (activeId) {
      store.markCharacterClean(activeId);
    }
  }, [store]);

  return {
    updateHeader,
    setAbility,
    toggleAbsentAbility,
    setDefense,
    loadCharacter,
    resetCharacter,
    setSkills,
    setAdvantages,
    setPowers,
    setComplications,
    setEquipment,
    setEquipmentNotes,
    setNotes,
    setManualOffenseRows,
    setCampaignMode,
    addPPLogEntry,
    removePPLogEntry,
    markClean,
  };
}
