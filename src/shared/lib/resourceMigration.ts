import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';
import { v5 as uuidv5 } from 'uuid';

const LEGACY_EQUIPMENT_NAMESPACE = '294e89a5-d9b7-4cae-9f16-97fe1ec74e40';

/** Converts pre-Resources structured equipment into paid Gear library entries. */
export function migrateLegacyEquipmentToResources(character: ICharacter): {
  character: ICharacter;
  resources: IResource[];
} {
  const legacyEquipment = character.equipment ?? [];
  if (legacyEquipment.length === 0 || (character.resourceLinks?.length ?? 0) > 0) {
    return { character, resources: [] };
  }

  const timestamp = new Date().toISOString();
  const resources = legacyEquipment.map((item, index): IResource => {
    // Stable UUIDs make an interrupted migration safely retryable without
    // creating duplicate Resources on every page load.
    const seed = `${character.characterId ?? 'legacy-character'}:${item.id}:${index}`;
    const id = uuidv5(`resource:${seed}`, LEGACY_EQUIPMENT_NAMESPACE);
    const power: ICharacterPower = { ...item, id: uuidv5(`power:${seed}`, LEGACY_EQUIPMENT_NAMESPACE), removable: 'none' };
    return { id, type: 'gear', name: item.name, notes: item.notes, power, createdAt: timestamp, updatedAt: timestamp };
  });

  return {
    resources,
    character: {
      ...character,
      equipment: [],
      resourceLinks: resources.map((resource) => ({
        id: uuidv5(`link:${character.characterId ?? 'legacy-character'}:${resource.id}`, LEGACY_EQUIPMENT_NAMESPACE), resourceId: resource.id, isFree: false,
      })),
    },
  };
}
