/* ================================================
   M&M 3e Builder — Core Type Definitions
   All interfaces follow the I* prefix convention.
   ================================================ */

// ── Ability Keys ──
export type AbilityKey = 'str' | 'sta' | 'agl' | 'dex' | 'fgt' | 'int' | 'awe' | 'pre';

// ── Cost Types for Modifiers ──
// per_rank:    costValue × rank_of_POWER  (e.g. Area: +1 per rank of the power)
// flat:        fixed cost added once to total  (e.g. Innate: always +1pp)
// flat_ranked: costValue × ranks_of_MODIFIER  (e.g. Accurate 3: +3pp regardless of power rank)
export type CostType = 'per_rank' | 'flat' | 'flat_ranked';

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

// ── Modifier Definition (from modifiers.json or powers.json extras/flaws) ──
export interface IModifierDef {
  id: string;
  name: string;
  category: ModifierCategory;
  costType: CostType;
  costValue: number;
  maxRanks?: number;             // max ranks purchasable (e.g. Indirect=4, Accurate=PL)
  description: string;
  longDescription?: string;      // full rulebook text
  options?: { label: string; notes: string }[];  // sub-options (e.g. Area shapes)
  incompatibleWith: string[];
  i18n?: Record<string, {
    name?: string;
    description?: string;
    longDescription?: string;
  }>;
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
  longDescription?: string;
  enhancesDefense?: string;      // technical debt flag: effect boosts a defense/resistance
  variableCost: { options: IVariableCostOption[] } | null;
  extras: IModifierDef[];        // power-specific extras
  flaws: IModifierDef[];         // power-specific flaws
  i18n?: Record<string, {
    name?: string;
    description?: string;
    longDescription?: string;
  }>;
}

// ── Advantage Category Types ──
export type AdvantageType = 'combat' | 'fortune' | 'general' | 'skill';

// ── Advantage (from advantages.json) ──
export interface IAdvantageDef {
  id: string;
  name: string;
  advantageType: AdvantageType;
  ranked: boolean;
  maxRank: number | null;
  description: string;
  longDescription: string;
}

// ── Skill Usage (sub-section within skill description) ──
export interface ISkillUsage {
  title: string;
  description: string;
}

// ── Skill Definition (from skills.json) ──
export interface ISkillDef {
  id: string;
  name: string;
  baseAbility: AbilityKey;
  subtyped: boolean;
  trainedOnly: boolean;
  interaction: boolean;
  manipulation: boolean;
  requiresTools: boolean;
  description: string;
  longDescription: string;
  usages: ISkillUsage[];
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

// ── Applied Modifier (on a power component) ──
export interface IAppliedModifier {
  modifierId: string;
  ranks: number;                 // flat_ranked: ranks of the MODIFIER; per_rank: always 1
  isPowerSpecific?: boolean;     // modifier comes from power's own extras/flaws list
  option?: string;               // selected sub-option (e.g. "Burst" for Area)
}

// ── Power Component (a single effect within a power) ──
export interface ICharacterPowerComponent {
  id: string;                    // uuid for keying
  effectId: string;
  ranks: number;
  modifiers: IAppliedModifier[];
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
// IMPORTANT: components[] replaces the old effectId + ranks + modifiers fields.
// The migration utility (powerMigration.ts) handles backward compatibility.
export interface ICharacterPower {
  id: string;
  name: string;
  components: ICharacterPowerComponent[];
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
