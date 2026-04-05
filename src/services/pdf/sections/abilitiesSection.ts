/* ================================================
   Abilities Section — Page 1
   Fields: Strength, Stamina, Agility, Dexterity,
   Fighting, Intellect, Awareness, Presence, Abilities (PP).
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { Abilities, AbilityKey } from '../../../entities/types';
import { setField, fmtAbility } from '../helpers';

interface AbilitiesPP {
  abilitiesCost: number;
}

export function fillAbilities(
  form: PDFForm,
  abilities: Abilities,
  absentAbilities: AbilityKey[],
  pp: AbilitiesPP
): void {
  const absent = new Set(absentAbilities);

  const map: Record<string, AbilityKey> = {
    Strength:  'str',
    Stamina:   'sta',
    Agility:   'agl',
    Dexterity: 'dex',
    Fighting:  'fgt',
    Intellect: 'int',
    Awareness: 'awe',
    Presence:  'pre',
  };

  for (const [fieldName, key] of Object.entries(map)) {
    setField(form, fieldName, fmtAbility(abilities[key], absent.has(key)));
  }

  setField(form, 'Abilities', String(pp.abilitiesCost));
}
