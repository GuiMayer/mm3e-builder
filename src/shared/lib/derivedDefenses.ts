import type { ICharacter, IPowerEffect, IResource } from '../../entities/types';
import { getEffectiveAbilityRank } from './abilityRanks';
import { calcInitiativeBonus, calcToughnessBonus } from './mathEngine';

type DefensiveCharacter = Pick<ICharacter, 'abilities' | 'absentAbilities' | 'powers' | 'advantages' | 'equipment' | 'resourceLinks'>;

/** Only carried equipment applies to its wearer. Vehicle/HQ defenses belong to the item. */
export function deriveCharacterDefenses(character: DefensiveCharacter, powerDefs: IPowerEffect[], resources: IResource[] = []) {
  const linkedIds = new Set((character.resourceLinks ?? []).map((link) => link.resourceId));
  const equipment = [
    ...(character.equipment ?? []),
    ...resources.flatMap((resource) => linkedIds.has(resource.id)
      && resource.type !== 'vehicle' && resource.type !== 'headquarters' ? [resource.power] : []),
  ];
  const natural = calcToughnessBonus(character.powers, character.advantages, powerDefs);
  let armor = { bonus: 0, breakdown: [] as string[] };
  for (const item of equipment) {
    const candidate = calcToughnessBonus([item], [], powerDefs);
    if (candidate.bonus > armor.bonus) armor = candidate;
  }
  // Equipment bonuses do not stack with one another or power/advantage bonuses.
  const toughness = armor.bonus > natural.bonus ? armor : natural;
  const agility = getEffectiveAbilityRank(character.abilities, character.absentAbilities, 'agl');
  let initiative = calcInitiativeBonus(agility, character.advantages, character.powers, powerDefs);
  for (const item of equipment) {
    const candidate = calcInitiativeBonus(agility, [], [item], powerDefs);
    if (candidate.total > initiative.total) initiative = candidate;
  }
  return {
    toughnessBonus: toughness.bonus,
    toughnessTotal: getEffectiveAbilityRank(character.abilities, character.absentAbilities, 'sta') + toughness.bonus,
    toughnessBreakdown: toughness.breakdown,
    initiativeTotal: initiative.total,
    initiativeBreakdown: initiative.breakdown,
  };
}
