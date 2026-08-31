/* ================================================
   Defenses Section — Page 1
   Fields: Dodge, Parry, Fortitude, Will, Toughness,
   Defenses (PP cost), Initiative.
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { Abilities, AbilityKey, IDefenses } from '../../../entities/types';
import { setField, fmtBonus } from '../helpers';
import { getEffectiveAbilityRank } from '../../../shared/lib/abilityRanks';

interface DefensesPP {
  defensesCost: number;
}

export function fillDefenses(
  form: PDFForm,
  abilities: Abilities,
  absentAbilities: AbilityKey[],
  defenses: IDefenses,
  toughnessTotal: number,
  initiativeTotal: number,
  pp: DefensesPP
): void {
  // ── Active defenses = ability base + purchased ranks ──────
  // If the base ability is absent, contribute 0 from it.
  const agl = getEffectiveAbilityRank(abilities, absentAbilities, 'agl');
  const fgt = getEffectiveAbilityRank(abilities, absentAbilities, 'fgt');
  const sta = getEffectiveAbilityRank(abilities, absentAbilities, 'sta');
  const awe = getEffectiveAbilityRank(abilities, absentAbilities, 'awe');

  const dodgeTotal    = agl + defenses.dodge;
  const parryTotal    = fgt + defenses.parry;
  const fortTotal     = sta + defenses.fortitude;
  const willTotal     = awe + defenses.will;

  setField(form, 'Dodge',     String(dodgeTotal));
  setField(form, 'Parry',     String(parryTotal));
  setField(form, 'Fortitude', String(fortTotal));
  setField(form, 'Will',      String(willTotal));
  setField(form, 'Toughness', String(toughnessTotal));

  // PP cost
  setField(form, 'Defenses', String(pp.defensesCost));

  // Initiative (AGL + Initiative advantage bonus)
  setField(form, 'Initiative', fmtBonus(initiativeTotal));
}
