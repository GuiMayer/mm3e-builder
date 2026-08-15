import type { ICharacter } from '../../entities/types';

/** Selects and normalizes the fields that belong in an exported character. */
export function sanitizeCharacterForExport(
  character: ICharacter
): ICharacter {
  return {
    characterId: character.characterId,
    header: {
      name: character.header.name || 'Unnamed',
      player: character.header.player || '',
      identity: character.header.identity || '',
      identityType: character.header.identityType,
      base: character.header.base || '',
      powerLevel: Math.max(
        1,
        Math.min(15, character.header.powerLevel || 1)
      ),
      heroPoints: Math.max(0, character.header.heroPoints || 0),
      gender: character.header.gender,
      age: character.header.age,
      height: character.header.height,
      weight: character.header.weight,
      eyes: character.header.eyes,
      hair: character.header.hair,
      groupAffiliation: character.header.groupAffiliation,
      series: character.header.series,
      gameMaster: character.header.gameMaster,
    },
    abilities: {
      str: character.abilities.str || 0,
      sta: character.abilities.sta || 0,
      agl: character.abilities.agl || 0,
      dex: character.abilities.dex || 0,
      fgt: character.abilities.fgt || 0,
      int: character.abilities.int || 0,
      awe: character.abilities.awe || 0,
      pre: character.abilities.pre || 0,
    },
    absentAbilities: Array.isArray(character.absentAbilities)
      ? character.absentAbilities
      : [],
    defenses: {
      dodge: Math.max(0, character.defenses.dodge || 0),
      parry: Math.max(0, character.defenses.parry || 0),
      fortitude: Math.max(0, character.defenses.fortitude || 0),
      will: Math.max(0, character.defenses.will || 0),
    },
    skills: Array.isArray(character.skills) ? character.skills : [],
    advantages: Array.isArray(character.advantages)
      ? character.advantages
      : [],
    powers: Array.isArray(character.powers) ? character.powers : [],
    complications: Array.isArray(character.complications)
      ? character.complications
      : [],
    equipmentNotes: character.equipmentNotes || '',
    equipment: Array.isArray(character.equipment) ? character.equipment : [],
    notes: character.notes,
    manualOffenseRows: character.manualOffenseRows,
    campaignMode: character.campaignMode || false,
    ppLog: character.ppLog,
  };
}
