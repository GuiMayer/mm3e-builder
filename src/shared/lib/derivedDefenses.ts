import type { ICharacter, IPowerEffect, IResource } from '../../entities/types';
import { getEffectiveAbilityRank } from './abilityRanks';
import { calcInitiativeBonus, calcToughnessBonus } from './mathEngine';
import { getPowerSources, resolvePowerUsage } from './powerUsage';
import { circumstanceBonus, effectiveTraitCharacter } from './traitValues';

type DefensiveCharacter = Pick<ICharacter, 'abilities' | 'absentAbilities' | 'powers' | 'advantages' | 'equipment' | 'resourceLinks'> & Partial<ICharacter>;

/** Only carried equipment applies to its wearer. Vehicle/HQ defenses belong to the item. */
export function deriveCharacterDefenses(character: DefensiveCharacter, powerDefs: IPowerEffect[], resources: IResource[] = []) {
  const effective = character.defenses && character.skills ? effectiveTraitCharacter(character as ICharacter, resources) : character;
  const sources = getPowerSources(character, resources).flatMap(source => {
    const usage = resolvePowerUsage(source, character.powerUsage?.[source.key]);
    return usage.personal ? [{ ...source, power: { ...source.power, components: usage.components } }] : [];
  });
  const equipment = sources.filter(source => source.equipment).map(source => source.power);
  const personalPowers = sources.filter(source => !source.equipment).map(source => source.power);
  const natural = calcToughnessBonus(personalPowers, character.advantages, powerDefs);
  let armor = { bonus: 0, breakdown: [] as string[] };
  for (const item of equipment) {
    const candidate = calcToughnessBonus([item], [], powerDefs);
    if (candidate.bonus > armor.bonus) armor = candidate;
  }
  // Equipment bonuses do not stack with one another or power/advantage bonuses.
  const toughness = armor.bonus > natural.bonus ? armor : natural;
  const agility = getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'agl');
  let initiative = calcInitiativeBonus(agility, character.advantages, personalPowers, powerDefs);
  for (const item of equipment) {
    const candidate = calcInitiativeBonus(agility, [], [item], powerDefs);
    if (candidate.total > initiative.total) initiative = candidate;
  }
  return {
    toughnessBonus: toughness.bonus,
    toughnessTotal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'sta') + toughness.bonus,
    toughnessBreakdown: toughness.breakdown,
    initiativeTotal: initiative.total,
    initiativeBreakdown: initiative.breakdown,
    dodgeTotal: agility + (effective.defenses?.dodge ?? 0),
    parryTotal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'fgt') + (effective.defenses?.parry ?? 0),
    fortitudeTotal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'sta') + (effective.defenses?.fortitude ?? 0),
    willTotal: getEffectiveAbilityRank(effective.abilities, effective.absentAbilities, 'awe') + (effective.defenses?.will ?? 0),
    dodgeCircumstance: circumstanceBonus(character, { kind: 'defense', key: 'dodge' }, 'active-defense'),
    parryCircumstance: circumstanceBonus(character, { kind: 'defense', key: 'parry' }, 'active-defense'),
  };
}
