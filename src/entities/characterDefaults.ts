import type { ICharacter } from './types';

/**
 * Creates an independent character object with all current application defaults.
 * Optional overrides are merged for the nested value objects used by the stores.
 */
export function createDefaultCharacter(
  overrides: Partial<ICharacter> = {}
): ICharacter {
  return {
    ...overrides,
    characterId: overrides.characterId,
    header: {
      name: '',
      player: '',
      identity: '',
      base: '',
      powerLevel: 10,
      heroPoints: 1,
      ...overrides.header,
    },
    abilities: {
      str: 0,
      sta: 0,
      agl: 0,
      dex: 0,
      fgt: 0,
      int: 0,
      awe: 0,
      pre: 0,
      ...overrides.abilities,
    },
    absentAbilities: overrides.absentAbilities ?? [],
    defenses: {
      dodge: 0,
      parry: 0,
      fortitude: 0,
      will: 0,
      ...overrides.defenses,
    },
    skills: overrides.skills ?? [],
    advantages: overrides.advantages ?? [],
    powers: overrides.powers ?? [],
    complications: overrides.complications ?? [],
    equipmentNotes: overrides.equipmentNotes ?? '',
    resourceLinks: overrides.resourceLinks ?? [],
    manualOffenseRows: overrides.manualOffenseRows ?? [],
    campaignMode: overrides.campaignMode ?? false,
    ppLog: overrides.ppLog ?? [],
  };
}
