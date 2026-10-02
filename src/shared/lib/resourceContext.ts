import type { ICharacter, ICharacterPower, IResource } from '../../entities/types';

export interface ResourceBuilderContext {
  resource: IResource;
  kind: 'power' | 'system' | 'movement' | 'headquarters-effect';
  effectId?: string;
}

/** Vehicle Strength belongs to the vehicle; ordinary weapons retain the user's attack skills. */
export function getResourceCharacter(character: ICharacter, resource: IResource): ICharacter {
  if (resource.type === 'vehicle') return { ...character, abilities: { ...character.abilities, str: resource.strength }, absentAbilities: character.absentAbilities.filter((ability) => ability !== 'str') };
  if (resource.type === 'headquarters') return {
    ...character, header: { ...character.header, powerLevel: resource.powerLevel ?? 10 },
    abilities: { str: 0, sta: 0, agl: 0, dex: 0, fgt: 0, int: 0, awe: 0, pre: 0 }, absentAbilities: [], skills: [], advantages: [],
  };
  return character;
}

export function getResourceAttackBonus(resource: IResource, power: ICharacterPower): number | undefined {
  return resource.type === 'headquarters' && resource.effectSettings?.[power.id]?.kind === 'defense-system'
    ? resource.powerLevel ?? 10 : undefined;
}
