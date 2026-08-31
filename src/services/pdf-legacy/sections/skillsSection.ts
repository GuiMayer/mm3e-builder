/* ================================================
   Skills Section — Page 2
   Fills the structured skill fields on page 2:
   - 13 fixed skills (Acrobatics → Vehicles)
   - Close Combat subtypes 1-3
   - Ranged Combat subtypes 1-3
   - Expertise subtypes 1-4

   Field naming (from the fillable PDF):
     Fixed:   {prefix}Ab, {prefix}Ra, {prefix}Oth, {prefix}Total
     Subtype: {prefix}Ab N, {prefix}Ra N, {prefix}Oth N, {prefix}Total N
              plus the name field  CC N / RC N / EX N
   ================================================ */

import type { PDFForm } from 'pdf-lib';
import type { ICharacter } from '../../../entities/types';
import type { ISkillDef } from '../../../entities/types';
import { setField } from '../helpers';
import { getEffectiveAbilityRank } from '../../../shared/lib/abilityRanks';

// ── Static skill-id → PDF prefix map ──────────────────────────
const FIXED_SKILL_PREFIX: Record<string, string> = {
  acrobatics:      'Acro',
  athletics:       'Ath',
  deception:       'Dec',
  insight:         'Ins',
  intimidation:    'Int',
  investigation:   'Inv',
  perception:      'Perc',
  persuasion:      'Pers',
  sleight_of_hand: 'SOH',
  stealth:         'St',
  technology:      'Te',
  treatment:       'Tr',
  vehicles:        'Ve',
};

/**
 * Fill all skill-related fields on PDF page 2.
 *
 * @param form      - The PDFForm from pdf-lib
 * @param character - Full character data
 * @param skillDefs - The SKILL_DEFS array from gameDataLoaders
 */
export function fillSkills(
  form: PDFForm,
  character: ICharacter,
  skillDefs: ISkillDef[]
): void {
  const { abilities, absentAbilities, skills } = character;

  // Build a quick lookup: skillId → ISkillDef
  const defMap = new Map(skillDefs.map((d) => [d.id, d]));

  // ── 1. Fixed Skills ────────────────────────────────────────
  for (const [skillId, prefix] of Object.entries(FIXED_SKILL_PREFIX)) {
    const def = defMap.get(skillId);
    if (!def) continue;

    const baseKey = def.baseAbility;
    const abilityVal = getEffectiveAbilityRank(abilities, absentAbilities, baseKey);

    // Find the character's entry (non-subtyped skill has no subtype)
    const entry = skills.find((s) => s.skillId === skillId && !s.subtype);
    const ranks = entry?.ranks ?? 0;
    const total = abilityVal + ranks;

    setField(form, `${prefix}Ab`,    String(abilityVal));
    setField(form, `${prefix}Ra`,    ranks > 0 ? String(ranks) : '');
    setField(form, `${prefix}Oth`,   '');  // situational bonuses not persisted
    setField(form, `${prefix}Total`, String(total));
  }

  // ── 2. Close Combat subtypes (CC 1-3) ─────────────────────
  const ccDef = defMap.get('close_combat');
  const fgtVal = getEffectiveAbilityRank(abilities, absentAbilities, 'fgt');
  const ccEntries = skills.filter((s) => s.skillId === 'close_combat' && s.subtype);

  for (let i = 1; i <= 3; i++) {
    const entry = ccEntries[i - 1];
    if (entry) {
      const ranks = entry.ranks;
      const total = fgtVal + ranks;
      setField(form, `CC ${i}`,       entry.subtype ?? '');
      setField(form, `CCAb ${i}`,     String(fgtVal));
      setField(form, `CCRa ${i}`,     String(ranks));
      setField(form, `CCOth ${i}`,    '');
      setField(form, `CCTotal ${i}`,  String(total));
    } else {
      // Blank out unused slots
      setField(form, `CC ${i}`,      '');
      setField(form, `CCAb ${i}`,    ccDef ? String(fgtVal) : '');
      setField(form, `CCRa ${i}`,    '');
      setField(form, `CCOth ${i}`,   '');
      setField(form, `CCTotal ${i}`, ccDef ? String(fgtVal) : '');
    }
  }

  // ── 3. Ranged Combat subtypes (RC 1-3) ────────────────────
  const rcDef = defMap.get('ranged_combat');
  const dexVal = getEffectiveAbilityRank(abilities, absentAbilities, 'dex');
  const rcEntries = skills.filter((s) => s.skillId === 'ranged_combat' && s.subtype);

  for (let i = 1; i <= 3; i++) {
    const entry = rcEntries[i - 1];
    if (entry) {
      const ranks = entry.ranks;
      const total = dexVal + ranks;
      setField(form, `RC ${i}`,       entry.subtype ?? '');
      setField(form, `RCAb ${i}`,     String(dexVal));
      setField(form, `RCRa ${i}`,     String(ranks));
      setField(form, `RCOth ${i}`,    '');
      setField(form, `RCTotal ${i}`,  String(total));
    } else {
      setField(form, `RC ${i}`,      '');
      setField(form, `RCAb ${i}`,    rcDef ? String(dexVal) : '');
      setField(form, `RCRa ${i}`,    '');
      setField(form, `RCOth ${i}`,   '');
      setField(form, `RCTotal ${i}`, rcDef ? String(dexVal) : '');
    }
  }

  // ── 4. Expertise subtypes (EX 1-4) ────────────────────────
  const exDef = defMap.get('expertise');
  const intVal = getEffectiveAbilityRank(abilities, absentAbilities, 'int');
  const exEntries = skills.filter((s) => s.skillId === 'expertise' && s.subtype);

  for (let i = 1; i <= 4; i++) {
    const entry = exEntries[i - 1];
    if (entry) {
      const ranks = entry.ranks;
      const total = intVal + ranks;
      setField(form, `EX ${i}`,       entry.subtype ?? '');
      setField(form, `ExAb ${i}`,     String(intVal));
      setField(form, `ExRa ${i}`,     String(ranks));
      setField(form, `ExOth ${i}`,    '');
      setField(form, `ExTotal ${i}`,  String(total));
    } else {
      setField(form, `EX ${i}`,      '');
      setField(form, `ExAb ${i}`,    exDef ? String(intVal) : '');
      setField(form, `ExRa ${i}`,    '');
      setField(form, `ExOth ${i}`,   '');
      setField(form, `ExTotal ${i}`, exDef ? String(intVal) : '');
    }
  }
}
