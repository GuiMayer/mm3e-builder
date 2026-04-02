/* ================================================
   M&M 3e Builder — Core Type Definitions
   All interfaces follow the I* prefix convention.
   ================================================ */

// ── Ability Keys ──
export type AbilityKey = 'str' | 'sta' | 'agl' | 'dex' | 'fgt' | 'int' | 'awe' | 'pre';

// ── Cost Types for Modifiers ──
export type CostType = 'per_rank' | 'flat';

// ── Modifier Category ──
export type ModifierCategory = 'extra' | 'flaw';

// ── Power Effect Types ──
export type EffectType = 'attack' | 'defense' | 'movement' | 'sensory' | 'general' | 'control';

// ── Action Types ──
export type ActionType = 'standard' | 'move' | 'free' | 'reaction' | 'none';

// ── Range Types ──
export type RangeType = 'personal' | 'close' | 'ranged' | 'perception';

// ── Duration Types ──
export type DurationType = 'instant' | 'concentration' | 'sustained' | 'continuous' | 'permanent';

// ── Variable Cost Option (for effects like Senses, Immunity) ──
export interface IVariableCostOption {
  name: string;
  cost: number;
}

// ── Power Effect (from powers.json) ──
export interface IPowerEffect {
  id: string;
  name: string;
  type: EffectType;
  baseCost: number;
  action: ActionType;
  range: RangeType;
  duration: DurationType;
  description: string;
  variableCost: { options: IVariableCostOption[] } | null;
}

// ── Modifier (from modifiers.json) ──
export interface IModifierDef {
  id: string;
  name: string;
  category: ModifierCategory;
  costType: CostType;
  costValue: number;
  description: string;
  incompatibleWith: string[];
}

// ── Advantage (from advantages.json) ──
export interface IAdvantageDef {
  id: string;
  name: string;
  ranked: boolean;
  description: string;
}

// ── Skill Definition (from skills.json) ──
export interface ISkillDef {
  id: string;
  name: string;
  baseAbility: AbilityKey;
  subtyped: boolean;
}

// ── Character Abilities ──
export type Abilities = Record<AbilityKey, number>;

// ── Character Defenses (bought ranks only, not totals) ──
export interface IDefenses {
  dodge: number;
  parry: number;
  fortitude: number;
  will: number;
}

// ── Character Skill Entry ──
export interface ICharacterSkill {
  skillId: string;
  ranks: number;
  subtype: string | null;
}

// ── Character Advantage Entry ──
export interface ICharacterAdvantage {
  advantageId: string;
  ranks: number;
}

// ── Applied Modifier (on a character's power) ──
export interface IAppliedModifier {
  modifierId: string;
  ranks: number;
}

// ── Alternate Effect (nested inside a power) ──
export interface IAlternateEffect {
  id: string;
  name: string;
  effectId: string;
  ranks: number;
  modifiers: IAppliedModifier[];
  dynamic: boolean;
  notes: string;
}

// ── Character Power ──
export interface ICharacterPower {
  id: string;
  name: string;
  effectId: string;
  ranks: number;
  modifiers: IAppliedModifier[];
  notes: string;
  alternateEffects: IAlternateEffect[];
}

// ── Complication ──
export interface IComplication {
  title: string;
  description: string;
}

// ── Character Header ──
export interface ICharacterHeader {
  name: string;
  player: string;
  identity: string;
  base: string;
  powerLevel: number;
  heroPoints: number;
}

// ── Full Character ──
export interface ICharacter {
  header: ICharacterHeader;
  abilities: Abilities;
  absentAbilities: AbilityKey[];
  defenses: IDefenses;
  skills: ICharacterSkill[];
  advantages: ICharacterAdvantage[];
  powers: ICharacterPower[];
  complications: IComplication[];
}

// ── Exported File Schema ──
export interface ICharacterFile {
  schemaVersion: string;
  exportedAt: string;
  language?: string;
  character: ICharacter;
}

// ── App Preferences ──
export interface IAppPreferences {
  theme: string;
  strictMode: boolean;
}
