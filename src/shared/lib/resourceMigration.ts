import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';

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
  const resources = legacyEquipment.map((item): IResource => {
    const id = crypto.randomUUID();
    const power: ICharacterPower = { ...item, id: crypto.randomUUID(), removable: 'none' };
    return { id, type: 'gear', name: item.name, notes: item.notes, power, createdAt: timestamp, updatedAt: timestamp };
  });

  return {
    resources,
    character: {
      ...character,
      equipment: [],
      resourceLinks: resources.map((resource) => ({
        id: crypto.randomUUID(), resourceId: resource.id, isFree: false,
      })),
    },
  };
}
