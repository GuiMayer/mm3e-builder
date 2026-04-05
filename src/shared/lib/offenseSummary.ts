/* ================================================
   Offense Summary — Pure derivation function
   PDF-compatible: no React, no store imports.
   ================================================ */

import type {
  ICharacter,
  IPowerEffect,
  ISkillDef,
  IAdvantageDef,
} from '../../entities/types';

/**
 * A single row in the Offense panel table.
 * isAE: true = this row is an Alternate Effect sub-row (indented, dimmed).
 */
export interface IOffenseEntry {
  id: string;           // unique key for React rendering
  name: string;         // display name
  bonus: string;        // attack bonus string, e.g. "+8" or "—" for perception range
  range: string;        // "close" | "ranged" | "perception" | "personal"
  effect: string;       // e.g. "Damage 12" or "Affliction 8"
  notes: string;        // extra info: Crit 19-20, Multiattack, Resisted by Will, etc.
  isAE: boolean;        // true = indented AE sub-row
  parentId?: string;    // parent power id when isAE = true
}

/** Derive attack bonus and range label for a given effect range. */
function deriveAttackBonus(
  effectRange: string,
  character: ICharacter,
  attackName: string,
  skillDefs: ISkillDef[]
): { bonus: number | null; rangeLabel: string } {
  const { abilities, skills, advantages } = character;

  if (effectRange === 'perception') return { bonus: null, rangeLabel: 'perception' };
  if (effectRange === 'personal')   return { bonus: null, rangeLabel: 'personal' };

  if (effectRange === 'close') {
    let bonus = abilities.fgt;
    const skillEntry = skills.find((s) => {
      const def = skillDefs.find((d) => d.id === s.skillId);
      return def?.id === 'close_combat' && s.subtype?.toLowerCase() === attackName.toLowerCase();
    });
    if (skillEntry) bonus += skillEntry.ranks;
    return { bonus, rangeLabel: 'close' };
  }

  // ranged
  let bonus = abilities.dex;
  const rangedAttackAdv = advantages.find((a) => a.advantageId === 'ranged_attack');
  if (rangedAttackAdv) bonus += rangedAttackAdv.ranks;
  const skillEntry = skills.find((s) => {
    const def = skillDefs.find((d) => d.id === s.skillId);
    return def?.id === 'ranged_combat' && s.subtype?.toLowerCase() === attackName.toLowerCase();
  });
  if (skillEntry) bonus += skillEntry.ranks;
  return { bonus, rangeLabel: 'ranged' };
}

/** Extract notable modifier notes from a component (Crit, Multiattack, etc.). */
function extractNotes(comp: ICharacter['powers'][number]['components'][number]): string {
  const flags: string[] = [];
  for (const mod of comp.modifiers) {
    if (mod.modifierId === 'multiattack')       flags.push('Multiattack');
    if (mod.modifierId === 'improved_critical')  flags.push('Crit 19–20');
    if (mod.modifierId === 'penetrating')        flags.push(`Penetrating ${mod.ranks}`);
  }
  return flags.join(', ');
}

/**
 * Build the complete offense summary from a character's current state.
 *
 * Pure function — no React, no store. Safe to call in PDF generator.
 *
 * Rules:
 * - Unarmed attack is always shown (even with Damage 0).
 * - Only powers with at least one attack-type component generate rows.
 * - Each AE with attack-type components generates an indented sub-row.
 * - Perception-range and Personal-range attacks show "—" for the bonus column.
 *
 * @param _advantageDefs — reserved for future use; advantage data is read from character.advantages
 */
export function buildOffenseSummary(
  character: ICharacter,
  powerDefs: IPowerEffect[],
  skillDefs: ISkillDef[],
  _advantageDefs: IAdvantageDef[]
): IOffenseEntry[] {
  const entries: IOffenseEntry[] = [];
  const { abilities, skills } = character;

  // ── 1. Unarmed attack (always first) ───────────────────────────
  {
    let bonus = abilities.fgt;
    const unarmedSkill = skills.find((s) => {
      const def = skillDefs.find((d) => d.id === s.skillId);
      return def?.id === 'close_combat' && s.subtype?.toLowerCase() === 'unarmed';
    });
    if (unarmedSkill) bonus += unarmedSkill.ranks;

    entries.push({
      id: '__unarmed__',
      name: 'Unarmed',
      bonus: `+${bonus}`,
      range: 'close',
      effect: `Damage ${abilities.str}`,
      notes: '',
      isAE: false,
    });
  }

  // ── 2. Powers with attack-type components ──────────────────────
  for (const power of character.powers) {
    const attackComps = power.components.filter((comp) => {
      const def = powerDefs.find((d) => d.id === comp.effectId);
      return def?.type === 'attack';
    });

    if (attackComps.length === 0) continue;

    const primaryComp = attackComps.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
    const primaryDef  = powerDefs.find((d) => d.id === primaryComp.effectId)!;

    const { bonus, rangeLabel } = deriveAttackBonus(
      primaryDef.range,
      character,
      power.name,
      skillDefs
    );

    const effectStr = attackComps
      .map((comp) => {
        const def = powerDefs.find((d) => d.id === comp.effectId);
        return def ? `${def.name} ${comp.ranks}` : '';
      })
      .filter(Boolean)
      .join(' + ');

    const resistedNote = primaryDef.range === 'perception' ? 'Resisted by Will' : '';

    entries.push({
      id: power.id,
      name: power.name || primaryDef.name,
      bonus: bonus === null ? '—' : `+${bonus}`,
      range: rangeLabel,
      effect: effectStr,
      notes: [extractNotes(primaryComp), resistedNote].filter(Boolean).join(', '),
      isAE: false,
    });

    // AE sub-rows
    for (const ae of power.alternateEffects) {
      const aeAttackComps = ae.components.filter((comp) => {
        const def = powerDefs.find((d) => d.id === comp.effectId);
        return def?.type === 'attack';
      });

      if (aeAttackComps.length === 0) continue;

      const aePrimary    = aeAttackComps.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
      const aePrimaryDef = powerDefs.find((d) => d.id === aePrimary.effectId)!;

      const { bonus: aeBonus, rangeLabel: aeRange } = deriveAttackBonus(
        aePrimaryDef.range,
        character,
        ae.name,
        skillDefs
      );

      const aeEffect = aeAttackComps
        .map((comp) => {
          const def = powerDefs.find((d) => d.id === comp.effectId);
          return def ? `${def.name} ${comp.ranks}` : '';
        })
        .filter(Boolean)
        .join(' + ');

      entries.push({
        id: ae.id,
        name: ae.name,
        bonus: aeBonus === null ? '—' : `+${aeBonus}`,
        range: aeRange,
        effect: aeEffect,
        notes: extractNotes(aePrimary),
        isAE: true,
        parentId: power.id,
      });
    }
  }

  return entries;
}
