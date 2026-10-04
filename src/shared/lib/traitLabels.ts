import type { ITraitTarget } from '../../entities/types';
import { SKILL_DEFS } from '../../entities/gameDataLoaders';
const names = { str: 'Strength', sta: 'Stamina', agl: 'Agility', dex: 'Dexterity', fgt: 'Fighting', int: 'Intellect', awe: 'Awareness', pre: 'Presence', dodge: 'Dodge', parry: 'Parry', fortitude: 'Fortitude', will: 'Will', toughness: 'Toughness' };
export function traitTargetName(target: ITraitTarget, translate: (label: string) => string = label => label): string {
  if (target.kind !== 'skill') return translate(names[target.key]);
  const name = translate(SKILL_DEFS.find(def => def.id === target.skillId)?.name ?? target.skillId);
  return target.subtype ? `${name}: ${target.subtype}` : name;
}
