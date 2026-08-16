import { useCallback } from 'react';
import { useCharactersStore } from '../../store/charactersStore';
import { migratePowers, migrateAdvantages } from '../lib/powerMigration';
import type { ICharacter, AbilityKey, IPPLogEntry, IManualOffenseRow } from '../../entities/types';
import { ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';
import { createDefaultCharacter } from '../../entities/characterDefaults';

const getCharactersStore = useCharactersStore.getState;

/**
 * Hook providing character mutation actions.
 * Works on the currently active character in charactersStore.
 * 
 * Use alongside useActiveCharacter() for a complete replacement of useCharStore.
 */
export function useCharacterActions() {
  const updateHeader = useCallback((partial: Partial<ICharacter['header']>) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    const active = getCharactersStore().getCharacterById(activeId);
    if (!active) return;

    getCharactersStore().updateCharacter(activeId, {
      header: { ...active.character.header, ...partial },
    }, {
      group: `header:${Object.keys(partial).sort().join(',')}`,
    });
  }, []);

  const setAbility = useCallback((key: AbilityKey, value: number) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    const active = getCharactersStore().getCharacterById(activeId);
    if (!active) return;

    getCharactersStore().updateCharacter(activeId, {
      abilities: { ...active.character.abilities, [key]: value },
    }, { group: `abilities:${key}` });
  }, []);

  const toggleAbsentAbility = useCallback((key: AbilityKey) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    const active = getCharactersStore().getCharacterById(activeId);
    if (!active) return;

    const absent = active.character.absentAbilities;
    const newAbsent = absent.includes(key)
      ? absent.filter((k) => k !== key)
      : [...absent, key];

    getCharactersStore().updateCharacter(activeId, {
      absentAbilities: newAbsent,
      abilities: {
        ...active.character.abilities,
        ...(newAbsent.includes(key) ? { [key]: 0 } : {}),
      },
    });
  }, []);

  const setDefense = useCallback((key: keyof ICharacter['defenses'], value: number) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    const active = getCharactersStore().getCharacterById(activeId);
    if (!active) return;

    getCharactersStore().updateCharacter(activeId, {
      defenses: { ...active.character.defenses, [key]: value },
    }, { group: `defenses:${key}` });
  }, []);

  const loadCharacter = useCallback((character: ICharacter) => {
    const activeId = getCharactersStore().activeCharacterId;

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
      const activeTab = getCharactersStore().getCharacterById(activeId);
      
      // If characterId matches the current active tab's character â†’ REPLACE
      if (activeTab?.character.characterId === migratedCharacter.characterId) {
        console.log('[loadCharacter] Updating existing character (same characterId)');
        getCharactersStore().updateCharacter(activeId, migratedCharacter);
        return;
      }
    }
    
    // FALLBACK: Different ID, no ID, or no active tab â†’ CREATE NEW TAB
    console.log('[loadCharacter] Creating new tab (different or missing characterId)');
    
    // Ensure imported character has characterId
    if (!migratedCharacter.characterId) {
      migratedCharacter.characterId = crypto.randomUUID();
    }
    
    getCharactersStore().addCharacter(migratedCharacter);
  }, []);

  const resetCharacter = useCallback(() => {
    const activeId = getCharactersStore().activeCharacterId;

    if (activeId) {
      const active = getCharactersStore().getCharacterById(activeId);
      if (active) {
        getCharactersStore().updateCharacter(activeId, createDefaultCharacter());
        // isDirty is already set to true by updateCharacter
        // Auto-save will be triggered automatically after debounce
      }
    }
  }, []);

  const setSkills = useCallback((skills: ICharacter['skills']) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { skills });
  }, []);

  const setAdvantages = useCallback((advantages: ICharacter['advantages']) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { advantages });
  }, []);

  const setPowers = useCallback((powers: ICharacter['powers']) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { powers });
  }, []);

  const setComplications = useCallback((complications: ICharacter['complications']) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { complications });
  }, []);

  const setEquipment = useCallback((equipment: ICharacter['equipment']) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { equipment });
  }, []);

  const setEquipmentNotes = useCallback((notes: string) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(
      activeId,
      { equipmentNotes: notes },
      { group: 'equipment-notes' }
    );
  }, []);

  const setNotes = useCallback((notes: string) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { notes }, { group: 'notes' });
  }, []);

  const setManualOffenseRows = useCallback((rows: IManualOffenseRow[]) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { manualOffenseRows: rows });
  }, []);

  const setCampaignMode = useCallback((enabled: boolean) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    getCharactersStore().updateCharacter(activeId, { campaignMode: enabled });
  }, []);

  const addPPLogEntry = useCallback((entry: Omit<IPPLogEntry, 'id'>) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    const active = getCharactersStore().getCharacterById(activeId);
    if (!active) return;

    const newEntry: IPPLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };

    const ppLog = active.character.ppLog || [];
    getCharactersStore().updateCharacter(activeId, {
      ppLog: [...ppLog, newEntry],
    });
  }, []);

  const removePPLogEntry = useCallback((id: string) => {
    const activeId = getCharactersStore().activeCharacterId;
    if (!activeId) return;

    const active = getCharactersStore().getCharacterById(activeId);
    if (!active) return;

    const ppLog = active.character.ppLog || [];
    getCharactersStore().updateCharacter(activeId, {
      ppLog: ppLog.filter((entry) => entry.id !== id),
    });
  }, []);

  const markClean = useCallback(() => {
    const activeId = getCharactersStore().activeCharacterId;
    if (activeId) {
      getCharactersStore().markCharacterClean(activeId);
    }
  }, []);

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
