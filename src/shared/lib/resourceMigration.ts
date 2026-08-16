import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';
import { createDerivedId } from './identity';

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
    const id = createDerivedId('resource', seed);
    const power: ICharacterPower = { ...item, id: createDerivedId('power', seed), removable: 'none' };
    return { id, type: 'gear', name: item.name, notes: item.notes, power, createdAt: timestamp, updatedAt: timestamp };
  });

  return {
    resources,
    character: {
      ...character,
      equipment: [],
      resourceLinks: resources.map((resource) => ({
        id: createDerivedId('link', `${character.characterId ?? 'legacy-character'}:${resource.id}`), resourceId: resource.id, isFree: false,
      })),
    },
  };
}
