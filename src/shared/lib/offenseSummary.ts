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
  IResource,
} from '../../entities/types';
import { getEffectiveAbilityRank } from './abilityRanks';

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
  /** Mechanical classification for the Targeted Effects view. */
  interaction: 'attack' | 'resistance' | 'targeted';
  requiresAttackCheck: boolean;
  causesResistance: boolean;
  tags: Array<'attack' | 'resistance' | 'area' | 'perception' | 'affects-others' | 'dynamic'>;
  sourceType: 'power' | 'equipment' | 'resource' | 'manual' | 'unarmed';
  sourceName?: string;
  componentName?: string;
  relationship: 'base' | 'alternate' | 'dynamic-alternate' | 'manual' | 'unarmed';
  resistance?: string;
  effectRank: number | null;
}

export function parseEffectRank(effect: string): number | null {
  const match = effect.match(/\b(?:damage|affliction|nullify|weaken)\s+(\d+)/i)
    ?? effect.match(/\b(\d+)\b/);
  return match ? Number(match[1]) : null;
}

function hasModifier(comp: ICharacterPowerComponent, modifierId: string): boolean {
  return comp.modifiers.some((modifier) => modifier.modifierId === modifierId);
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
  if (effectiveRange === 'personal' && (hasAffectOthers(comp, modifierDefs) || hasAttackExtra(comp))) {
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
    return def?.id === 'area' || def?.id.endsWith('_area') === true;
  });
}

/** Check if a component has the Affect Others extra. */
function hasAffectOthers(
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): boolean {
  return comp.modifiers.some((m) => {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    return def?.id === 'affects_others';
  });
}

/** The Attack extra makes a non-attack effect require an attack check. */
function hasAttackExtra(comp: ICharacterPowerComponent): boolean {
  return hasModifier(comp, 'attack');
}

/** Power-specific Resistible flaws use ids such as resistible_illusion. */
function hasResistibleModifier(comp: ICharacterPowerComponent): boolean {
  return comp.modifiers.some((modifier) => modifier.modifierId === 'resistible' || modifier.modifierId.startsWith('resistible_'));
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
  const inaccurate = comp.modifiers.find((m) => {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    return def?.id === 'inaccurate';
  });
  return (acc?.ranks ?? 0) * 2 - (inaccurate?.ranks ?? 0) * 2;
}

function getInaccuratePenalty(
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): number {
  const inaccurate = comp.modifiers.find((m) => {
    const def = modifierDefs.find((d) => d.id === m.modifierId);
    return def?.id === 'inaccurate';
  });
  return (inaccurate?.ranks ?? 0) * 2;
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
  const { abilities, absentAbilities, skills, advantages } = character;

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
  const inaccuratePenalty = getInaccuratePenalty(component, modifierDefs);
  const accurateBonus = accurate + inaccuratePenalty;
  const parts: string[] = [];

  if (effectiveRange === 'close') {
    const base = getEffectiveAbilityRank(abilities, absentAbilities, 'fgt');
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

    if (accurateBonus > 0) parts.push(`Accurate ${accurateBonus}`);
    if (inaccuratePenalty > 0) parts.push(`Inaccurate -${inaccuratePenalty}`);

    const total = base + closeAdvRanks + skillRanks + accurate;
    return { value: total, breakdown: parts.join(' + '), isNoRoll: false };
  }

  // ── Ranged ──────────────────────────────────────────────────────
  const base = getEffectiveAbilityRank(abilities, absentAbilities, 'dex');
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

  if (accurateBonus > 0) parts.push(`Accurate ${accurateBonus}`);
  if (inaccuratePenalty > 0) parts.push(`Inaccurate -${inaccuratePenalty}`);

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

type SourceType = 'power' | 'equipment' | 'resource';

function getResistanceLabel(def: IPowerEffect, comp: ICharacterPowerComponent): string | undefined {
  const configured = comp.fieldValues?.resistance;
  const configuredValue = typeof configured === 'string' ? configured : undefined;
  const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

  if (def.id === 'damage') return `Toughness DC ${15 + comp.ranks}`;
  if (def.id === 'nullify') return `${hasModifier(comp, 'alternate_resistance') ? 'Fortitude' : 'Will'} DC ${10 + comp.ranks}`;
  if (configuredValue) return `${capitalize(configuredValue)} DC ${10 + comp.ranks}`;
  if (hasResistibleModifier(comp) || def.type === 'attack' || hasAttackExtra(comp)) return `Resistance DC ${10 + comp.ranks}`;
  return undefined;
}

function getInteraction(
  def: IPowerEffect,
  comp: ICharacterPowerComponent,
  modifierDefs: IModifierDef[]
): { interaction: IOffenseEntry['interaction']; requiresAttackCheck: boolean; causesResistance: boolean; isNoRoll: boolean } | null {
  const hasAttack = def.type === 'attack' || hasAttackExtra(comp);
  const hasArea = hasAreaExtra(comp, modifierDefs);
  const effectiveRange = getEffectiveRange(def.range, comp, modifierDefs);
  const causesResistance = hasAttack || hasResistibleModifier(comp);

  if (hasAttack) {
    const isNoRoll = hasArea || effectiveRange === 'perception';
    return {
      interaction: isNoRoll ? 'resistance' : 'attack',
      requiresAttackCheck: !isNoRoll,
      causesResistance: true,
      isNoRoll,
    };
  }

  if (causesResistance) {
    return { interaction: 'resistance', requiresAttackCheck: false, causesResistance: true, isNoRoll: true };
  }

  if (hasAffectOthers(comp, modifierDefs)) {
    return { interaction: 'targeted', requiresAttackCheck: false, causesResistance: false, isNoRoll: true };
  }

  return null;
}

function getTags(
  interaction: IOffenseEntry['interaction'],
  comp: ICharacterPowerComponent,
  effectiveRange: string,
  modifierDefs: IModifierDef[],
  dynamic: boolean
): IOffenseEntry['tags'] {
  const tags: IOffenseEntry['tags'] = [];
  if (interaction === 'attack') tags.push('attack');
  if (interaction === 'resistance') tags.push('resistance');
  if (hasAreaExtra(comp, modifierDefs)) tags.push('area');
  if (effectiveRange === 'perception') tags.push('perception');
  if (hasAffectOthers(comp, modifierDefs)) tags.push('affects-others');
  if (dynamic) tags.push('dynamic');
  return tags;
}

function createComponentProfile(
  character: ICharacter,
  def: IPowerEffect,
  comp: ICharacterPowerComponent,
  skillDefs: ISkillDef[],
  modifierDefs: IModifierDef[],
  source: { id: string; name: string; type: SourceType },
  relationship: Extract<IOffenseEntry['relationship'], 'base' | 'alternate' | 'dynamic-alternate'>,
  alternateName?: string
): IOffenseEntry | null {
  const interaction = getInteraction(def, comp, modifierDefs);
  if (!interaction) return null;

  const effectiveRange = getEffectiveRange(def.range, comp, modifierDefs);
  const profileName = alternateName || source.name || def.name;
  const bonus = interaction.requiresAttackCheck
    ? calcAttackBonus(def.range, profileName, comp, character, skillDefs, modifierDefs)
    : { value: null, breakdown: interaction.causesResistance ? 'No attack check' : 'Targeted effect', isNoRoll: true };

  return {
    id: `${source.type}:${source.id}:${relationship}:${comp.id}`,
    name: profileName,
    bonus: bonus.value === null ? '—' : `+${bonus.value}`,
    bonusValue: bonus.value,
    bonusBreakdown: bonus.breakdown,
    range: effectiveRange,
    effect: `${def.name} ${comp.ranks}`,
    notes: extractNotes(comp),
    isAE: relationship !== 'base',
    isManual: false,
    isNoRoll: interaction.isNoRoll,
    parentId: relationship === 'base' ? undefined : source.id,
    interaction: interaction.interaction,
    requiresAttackCheck: interaction.requiresAttackCheck,
    causesResistance: interaction.causesResistance,
    tags: getTags(interaction.interaction, comp, effectiveRange, modifierDefs, relationship === 'dynamic-alternate'),
    sourceType: source.type,
    sourceName: source.name || def.name,
    componentName: def.name,
    relationship,
    resistance: interaction.causesResistance ? getResistanceLabel(def, comp) : undefined,
    effectRank: comp.ranks,
  };
}

/**
 * Builds factual target-effect profiles from every source that can be applied
 * to another character. It deliberately does not infer an "offensive" or
 * "support" intent: filters are based only on roll, resistance and modifiers.
 */
export function buildTargetedEffectProfiles(
  character: ICharacter,
  powerDefs: IPowerEffect[],
  skillDefs: ISkillDef[],
  _advantageDefs: IAdvantageDef[],
  modifierDefs: IModifierDef[] = [],
  translations?: { unarmed: string; damage: string },
  resources: IResource[] = []
): IOffenseEntry[] {
  const entries: IOffenseEntry[] = [];
  const { abilities, absentAbilities, skills } = character;

  // ── 1. Unarmed attack (always first) ───────────────────────────
  {
    const base = getEffectiveAbilityRank(abilities, absentAbilities, 'fgt');
    const strength = getEffectiveAbilityRank(abilities, absentAbilities, 'str');
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
      name: translations?.unarmed ?? 'Unarmed',
      bonus: `+${total}`,
      bonusValue: total,
      bonusBreakdown: parts.join(' + '),
      range: 'close',
      effect: `${translations?.damage ?? 'Damage'} ${strength}`,
      notes: '',
      isAE: false,
      isManual: false,
      isNoRoll: false,
      interaction: 'attack',
      requiresAttackCheck: true,
      causesResistance: true,
      tags: ['attack', 'resistance'],
      sourceType: 'unarmed',
      sourceName: translations?.unarmed ?? 'Unarmed',
      componentName: translations?.damage ?? 'Damage',
      relationship: 'unarmed',
      resistance: `Toughness DC ${15 + strength}`,
      effectRank: strength,
    });
  }

  const appendSourceProfiles = (sourcePowers: ICharacter['powers'], sourceType: SourceType) => {
    for (const sourcePower of sourcePowers) {
      const source = { id: sourcePower.id, name: sourcePower.name, type: sourceType };
      for (const comp of sourcePower.components) {
        const def = powerDefs.find((effect) => effect.id === comp.effectId);
        if (!def) continue;
        const profile = createComponentProfile(character, def, comp, skillDefs, modifierDefs, source, 'base');
        if (profile) entries.push(profile);
      }
      for (const ae of sourcePower.alternateEffects ?? []) {
        const relationship = ae.dynamic ? 'dynamic-alternate' : 'alternate';
        for (const comp of ae.components) {
          const def = powerDefs.find((effect) => effect.id === comp.effectId);
          if (!def) continue;
          const profile = createComponentProfile(character, def, comp, skillDefs, modifierDefs, source, relationship, ae.name);
          if (profile) entries.push(profile);
        }
      }
    }
  };

  appendSourceProfiles(character.powers, 'power');
  appendSourceProfiles(character.equipment ?? [], 'equipment');
  for (const link of character.resourceLinks ?? []) {
    const resource = resources.find((item) => item.id === link.resourceId);
    if (!resource) continue;
    const powers = resource.type === 'vehicle'
      ? resource.systems
      : resource.type === 'headquarters'
        ? resource.effects
        : [resource.power];
    appendSourceProfiles(powers.map((power) => ({ ...power, name: resource.name || power.name })), 'resource');
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
      interaction: row.range === 'perception' ? 'resistance' : 'attack',
      requiresAttackCheck: row.range !== 'perception',
      causesResistance: true,
      tags: row.range === 'perception' ? ['resistance', 'perception'] : ['attack', 'resistance'],
      sourceType: 'manual',
      sourceName: row.name,
      componentName: row.name,
      relationship: 'manual',
      resistance: parseEffectRank(row.effect) === null ? undefined : `Resistance DC ${10 + parseEffectRank(row.effect)!}`,
      effectRank: parseEffectRank(row.effect),
    });
  }

  return entries;
}

/** Legacy export kept so existing PDF callers remain compatible. */
export const buildOffenseSummary = buildTargetedEffectProfiles;
