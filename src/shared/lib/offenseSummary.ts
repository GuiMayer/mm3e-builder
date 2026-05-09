/* ================================================
   Offense Summary — Pure derivation function
   PDF-compatible: no React, no store imports.
   ================================================ */

import type {
  ICharacter,
  IPowerEffect,
  IModifierDef,
  ISkillDef,
  IAdvantageDef,
  ICharacterPowerComponent,
} from '../../entities/types';

/**
 * A single row in the Offense panel table.
 * isAE: true = this row is an Alternate Effect sub-row (indented, dimmed).
 * isManual: true = user-created custom attack row.
 * isNoRoll: true = perception/area range (no attack check, effect capped at PL).
 */
export interface IOffenseEntry {
  id: string;               // unique key for React rendering
  name: string;             // display name
  bonus: string;            // attack bonus string, e.g. "+8" or "—" for no-roll
  bonusValue: number | null;// numeric bonus for PL validation; null = no-roll
  bonusBreakdown: string;   // tooltip: "FGT 4 + Accurate 2 = +6"
  range: string;            // "close" | "ranged" | "perception" | "personal"
  effect: string;           // e.g. "Damage 12" or "Affliction 8"
  notes: string;            // extra info: Crit 19-20, Multiattack, etc.
  isAE: boolean;            // true = indented AE sub-row
  isManual: boolean;        // true = custom attack row from IManualOffenseRow
  isNoRoll: boolean;        // true = perception/area range, no attack check
  parentId?: string;        // parent power id when isAE = true
}

/**
 * Calculate the effective range of a component, accounting for modifiers.
 * Rules: Increased Range moves range up one step per rank: close → ranged → perception.
 */
function getEffectiveRange(
  baseRange: string,
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): string {
  let effectiveRange = baseRange;

  // 1. Affects Others changes Personal to Close
  if (effectiveRange === 'personal' && hasAffectOthers(comp, modifierDefs)) {
    effectiveRange = 'close';
  }

  // 2. Find Increased Range or Reduced Range modifiers
  let rangeShift = 0;
  for (const m of comp.modifiers) {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    if (def?.id === 'increased_range') rangeShift += m.ranks;
    if (def?.id === 'reduced_range')   rangeShift -= m.ranks;
  }

  if (rangeShift === 0) {
    return effectiveRange;
  }

  const rangeSteps = ['close', 'ranged', 'perception'];
  const currentIndex = rangeSteps.indexOf(effectiveRange);

  if (currentIndex === -1) {
    // Other ranges (like Personal) not affected by Range modifiers
    return effectiveRange;
  }

  const newIndex = Math.max(0, Math.min(currentIndex + rangeShift, rangeSteps.length - 1));
  return rangeSteps[newIndex];
}

/** Check if a component has the Area extra (any variant) — makes it no-roll. */
function hasAreaExtra(
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): boolean {
  return comp.modifiers.some((m) => {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    // Area extras have ids like 'burst_area', 'cone_area', 'line_area', 'cloud_area', 'shapeable_area'
    return def?.id.includes('area') ?? false;
  });
}

/** Check if a component has the Affect Others extra. */
function hasAffectOthers(
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): boolean {
  return comp.modifiers.some((m) => {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    return def?.id === 'affect_others';
  });
}

/** Ranks of 'Accurate' extra on a component (+2 to attack per rank). */
function getAccurateBonus(
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): number {
  const acc = comp.modifiers.find((m) => {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    return def?.id === 'accurate';
  });
  return acc ? acc.ranks * 2 : 0;
}

/**
 * F-12: Derive attack bonus with full breakdown for a given component.
 *
 * Rules (per M&M 3e):
 * - Close attack:  FGT + Close Attack advantage + matching Close Combat skill + Accurate ×2
 * - Ranged attack: DEX + Ranged Attack advantage + matching Ranged Combat skill + Accurate ×2
 * - Perception or Area range: no attack roll (returns null + isNoRoll = true)
 * - Personal range: no attack roll (returns null + isNoRoll = true)
 */
export function calcAttackBonus(
  effectRange: string,
  powerName: string,
  component: ICharacterPowerComponent,
  character: ICharacter,
  skillDefs: ISkillDef[],
  modifierDefs: IModifierDef[]
): { value: number | null; breakdown: string; isNoRoll: boolean } {
  const { abilities, skills, advantages } = character;

  // Calculate effective range (accounting for Increased Range modifier)
  const effectiveRange = getEffectiveRange(effectRange, component, modifierDefs);

  // ── Perception or personal range → no attack check ──
  if (effectiveRange === 'perception' || effectiveRange === 'personal') {
    return { value: null, breakdown: '—', isNoRoll: true };
  }

  // ── Area extras → no attack check (auto-hit) ──
  if (hasAreaExtra(component, modifierDefs)) {
    return { value: null, breakdown: 'Area (auto)', isNoRoll: true };
  }

  const accurate = getAccurateBonus(component, modifierDefs);
  const parts: string[] = [];

  if (effectiveRange === 'close') {
    const base = abilities.fgt;
    parts.push(`FGT ${base}`);

    // Close Attack advantage (generic all-close bonus)
    const closeAttackAdv = advantages.find((a) => a.advantageId === 'close_attack');
    const closeAdvRanks = closeAttackAdv?.ranks ?? 0;
    if (closeAdvRanks > 0) parts.push(`Close Atk ${closeAdvRanks}`);

    // Close Combat skill with matching subtype
    const skillEntry = skills.find((s) => {
      const def = skillDefs.find((d) => d.id === s.skillId);
      return def?.id === 'close_combat' && s.subtype?.toLowerCase() === powerName.toLowerCase();
    });
    const skillRanks = skillEntry?.ranks ?? 0;
    if (skillRanks > 0) parts.push(`Close Combat: ${powerName} ${skillRanks}`);

    if (accurate > 0) parts.push(`Accurate ${accurate}`);

    const total = base + closeAdvRanks + skillRanks + accurate;
    return { value: total, breakdown: parts.join(' + '), isNoRoll: false };
  }

  // ── Ranged ──────────────────────────────────────────────────────
  const base = abilities.dex;
  parts.push(`DEX ${base}`);

  const rangedAttackAdv = advantages.find((a) => a.advantageId === 'ranged_attack');
  const rangedAdvRanks = rangedAttackAdv?.ranks ?? 0;
  if (rangedAdvRanks > 0) parts.push(`Ranged Atk ${rangedAdvRanks}`);

  const skillEntry = skills.find((s) => {
    const def = skillDefs.find((d) => d.id === s.skillId);
    return def?.id === 'ranged_combat' && s.subtype?.toLowerCase() === powerName.toLowerCase();
  });
  const skillRanks = skillEntry?.ranks ?? 0;
  if (skillRanks > 0) parts.push(`Ranged Combat: ${powerName} ${skillRanks}`);

  if (accurate > 0) parts.push(`Accurate ${accurate}`);

  const total = base + rangedAdvRanks + skillRanks + accurate;
  return { value: total, breakdown: parts.join(' + '), isNoRoll: false };
}

/** Extract notable modifier notes from a component (Crit, Multiattack, etc.). */
function extractNotes(comp: ICharacterPowerComponent): string {
  const flags: string[] = [];
  for (const mod of comp.modifiers) {
    if (mod.modifierId === 'multiattack')       flags.push('Multiattack');
    if (mod.modifierId === 'improved_critical')  flags.push('Crit 19–20');
    if (mod.modifierId === 'penetrating')        flags.push(`Penetrating ${mod.ranks}`);
  }
  return flags.join(', ');
}

/**
 * Determine if a component qualifies as an "attack" for the offense table.
 *
 * F-12 rule (per user directive and M&M 3e):
 * - effect type === 'attack'  (Damage, Affliction, Weaken, Nullify) → always attack
 * - any effect type + 'affect_others' extra → becomes an attack against the target
 */
function isAttackComponent(
  comp: ICharacterPowerComponent,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[]
): boolean {
  const def = powerDefs.find((d) => d.id === comp.effectId);
  if (!def) return false;
  if (def.type === 'attack') return true;
  if (hasAffectOthers(comp, modifierDefs)) return true;
  return false;
}

/**
 * Build the complete offense summary from a character's current state.
 *
 * Pure function — no React, no store. Safe to call in PDF generator.
 */
export function buildOffenseSummary(
  character: ICharacter,
  powerDefs: IPowerEffect[],
  skillDefs: ISkillDef[],
  _advantageDefs: IAdvantageDef[],
  modifierDefs: IModifierDef[] = []
): IOffenseEntry[] {
  const entries: IOffenseEntry[] = [];
  const { abilities, skills } = character;

  // ── 1. Unarmed attack (always first) ───────────────────────────
  {
    const base = abilities.fgt;
    const closeAttackAdv = character.advantages.find((a) => a.advantageId === 'close_attack');
    const closeAdvRanks = closeAttackAdv?.ranks ?? 0;

    const unarmedSkill = skills.find((s) => {
      const def = skillDefs.find((d) => d.id === s.skillId);
      return def?.id === 'close_combat' && s.subtype?.toLowerCase() === 'unarmed';
    });
    const unarmedSkillRanks = unarmedSkill?.ranks ?? 0;

    const total = base + closeAdvRanks + unarmedSkillRanks;
    const parts = [`FGT ${base}`];
    if (closeAdvRanks > 0) parts.push(`Close Atk ${closeAdvRanks}`);
    if (unarmedSkillRanks > 0) parts.push(`Unarmed ${unarmedSkillRanks}`);

    entries.push({
      id: '__unarmed__',
      name: 'Unarmed',
      bonus: `+${total}`,
      bonusValue: total,
      bonusBreakdown: parts.join(' + '),
      range: 'close',
      effect: `Damage ${abilities.str}`,
      notes: '',
      isAE: false,
      isManual: false,
      isNoRoll: false,
    });
  }

  // ── 2. Powers with attack-type (or Affect Others) components ───
  for (const power of character.powers) {
    const attackComps = power.components.filter((comp) =>
      isAttackComponent(comp, powerDefs, modifierDefs)
    );

    if (attackComps.length === 0) continue;

    const primaryComp = attackComps.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
    const primaryDef  = powerDefs.find((d) => d.id === primaryComp.effectId)!;

    const { value: bonusValue, breakdown, isNoRoll } = calcAttackBonus(
      primaryDef.range,
      power.name,
      primaryComp,
      character,
      skillDefs,
      modifierDefs
    );

    // Calculate effective range for display (calcAttackBonus already uses it internally)
    const effectiveRange = getEffectiveRange(primaryDef.range, primaryComp, modifierDefs);

    const effectStr = attackComps
      .map((comp) => {
        const def = powerDefs.find((d) => d.id === comp.effectId);
        return def ? `${def.name} ${comp.ranks}` : '';
      })
      .filter(Boolean)
      .join(' + ');

    const resistedNote = isNoRoll && effectiveRange === 'perception' ? 'Resisted by Will' : '';

    entries.push({
      id: power.id,
      name: power.name || primaryDef.name,
      bonus: bonusValue === null ? '—' : `+${bonusValue}`,
      bonusValue,
      bonusBreakdown: breakdown,
      range: effectiveRange, // Use effective range for display
      effect: effectStr,
      notes: [extractNotes(primaryComp), resistedNote].filter(Boolean).join(', '),
      isAE: false,
      isManual: false,
      isNoRoll,
    });

    // AE sub-rows
    for (const ae of power.alternateEffects) {
      const aeAttackComps = ae.components.filter((comp) =>
        isAttackComponent(comp, powerDefs, modifierDefs)
      );

      if (aeAttackComps.length === 0) continue;

      const aePrimary    = aeAttackComps.reduce((a, b) => (a.ranks >= b.ranks ? a : b));
      const aePrimaryDef = powerDefs.find((d) => d.id === aePrimary.effectId)!;

      const { value: aeBonus, breakdown: aeBreakdown, isNoRoll: aeNoRoll } = calcAttackBonus(
        aePrimaryDef.range,
        ae.name,
        aePrimary,
        character,
        skillDefs,
        modifierDefs
      );

      // Calculate effective range for AE display
      const aeEffectiveRange = getEffectiveRange(aePrimaryDef.range, aePrimary, modifierDefs);

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
        bonusValue: aeBonus,
        bonusBreakdown: aeBreakdown,
        range: aeEffectiveRange,
        effect: aeEffect,
        notes: extractNotes(aePrimary),
        isAE: true,
        isManual: false,
        isNoRoll: aeNoRoll,
        parentId: power.id,
      });
    }
  }

  // ── 3. Manual offense rows (F-13) ──────────────────────────────
  for (const row of character.manualOffenseRows ?? []) {
    entries.push({
      id: row.id,
      name: row.name,
      bonus: row.bonus >= 0 ? `+${row.bonus}` : `${row.bonus}`,
      bonusValue: row.bonus,
      bonusBreakdown: 'Custom',
      range: row.range,
      effect: row.effect,
      notes: row.notes,
      isAE: false,
      isManual: true,
      isNoRoll: row.range === 'perception',
    });
  }

  return entries;
}
