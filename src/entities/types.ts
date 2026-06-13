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

// ── Configurable Field Types ──
export type ConfigurableFieldControl = 'dropdown' | 'text' | 'multi-select' | 'multiselect';

export interface IConfigurableFieldOption {
  value: string;
  label: string;
  description?: string;
  cost?: number;              // For options affecting cost (Illusion: 1-5, Transform: 2-5, etc.)
  i18n?: Record<string, {
    label?: string;
    description?: string;
  }>;
}

export interface IConfigurableField {
  id: string;                  // e.g., "resistance", "sense_medium", "trait_target"
  label: string;               // Display label
  control: ConfigurableFieldControl;
  required: boolean;
  options?: IConfigurableFieldOption[];  // For dropdown/multi-select only
  placeholder?: string;        // For text inputs
  i18n?: Record<string, {
    label?: string;
    placeholder?: string;
  }>;
}

// ── Variable Cost Option (for effects like Senses, Immunity) ──
export interface IVariableCostOption {
  name: string;
  cost: number;
}

// ── Modifier Subtype (for modifiers with variable cost per chosen option) ──
// e.g. Alternate Resistance: Will (+1/rank), Fortitude (+2/rank), Dodge (+1/rank)
export interface IModifierSubtype {
  id: string;
  label: string;
  costValue: number;   // overrides the parent modifier's costValue
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
  subtypes?: IModifierSubtype[];  // variable-cost sub-choices (e.g. Alternate Resistance)
  appliesToPower?: boolean;       // true = power-level flaw (e.g. Removable), not per-component
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
  configurableFields?: IConfigurableField[];  // NEW: configurable fields at acquisition
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
  otherBonus?: number;           // F-11: optional situational modifier column
}

// ── Character Advantage Entry ──
export interface ICharacterAdvantage {
  advantageId: string;
  ranks: number;
  subtype?: string | null;  // For advantages like Skill Mastery, Fascinate, Improved Critical, etc.
}

// ── Applied Modifier (on a power component) ──
export interface IAppliedModifier {
  modifierId: string;
  ranks: number;                 // flat_ranked: ranks of the MODIFIER; per_rank: always 1
  isPowerSpecific?: boolean;     // modifier comes from power's own extras/flaws list
  option?: string;               // selected sub-option (e.g. "Burst" for Area)
  options?: Record<string, boolean | number | string>; // flexible flags; string used for subtypeId
}

// ── Power Component (a single effect within a power) ──
export interface ICharacterPowerComponent {
  id: string;                    // uuid for keying
  effectId: string;
  ranks: number;
  modifiers: IAppliedModifier[];
  variableCostOption?: string;   // selected variable cost option name (for effects like Affliction, Illusion)
  fieldValues?: Record<string, string | string[]>;  // NEW: configurable field values { "resistance": "fortitude", "sense_types": ["visual", "auditory"] }
}

// ── Alternate Effect (nested inside a power) ──
// Uses the same components[] contract as ICharacterPower,
// enabling Linked Powers within a single array slot (canonical MM3e technique).
export interface IAlternateEffect {
  id: string;
  name: string;
  components: ICharacterPowerComponent[];   // same format as ICharacterPower
  dynamic: boolean;
  notes: string;
}

// ── Character Power ──
// IMPORTANT: components[] replaces the old effectId + ranks + modifiers fields.
// The migration utility (powerMigration.ts) handles backward compatibility.
export interface ICharacterPower {
  id: string;
  name: string;
  descriptors?: string[];           // Power descriptors (Fire, Ice, Magic, Technology, etc.)
  components: ICharacterPowerComponent[];
  notes: string;
  alternateEffects: IAlternateEffect[];
  removable?: 'none' | 'removable' | 'easily_removable'; // F-06: device discount
}

// ── Equipment Item (F-15: structured equipment system) ──
// Reuses the same component structure as powers for consistency.
// Equipment items are essentially powers with the "Easily Removable" flaw built-in.
// Cost: 1 EP (Equipment Point) = 1 PP after the Easily Removable discount.
export interface IEquipmentItem {
  id: string;
  name: string;
  components: ICharacterPowerComponent[];
  notes?: string;
  alternateEffects?: IAlternateEffect[];   // For equipment arrays (e.g., utility belt)
}

// ── Complication Type ──
export type ComplicationType =
  | 'motivation' | 'enemy' | 'identity' | 'relationship'
  | 'responsibility' | 'secret' | 'weakness' | 'accident'
  | 'social' | 'disability' | 'power_loss';

// ── Complication ──
export interface IComplication {
  title: string;
  description: string;
  type?: ComplicationType;       // F-08: optional structured type badge
}

// ── Character Header ──
export interface ICharacterHeader {
  name: string;
  player: string;
  identity: string;
  identityType?: 'secret' | 'public';  // F-03: optional identity type toggle
  base: string;
  powerLevel: number;
  heroPoints: number;
  // F-07: Physical description fields (all optional)
  gender?: string;
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  hair?: string;
  groupAffiliation?: string;
  series?: string;
  gameMaster?: string;
}

// ── Manual Offense Row (F-13 custom attack) ──
export interface IManualOffenseRow {
  id: string;
  name: string;
  bonus: number;                    // user-entered total bonus (positive or negative)
  range: 'close' | 'ranged' | 'perception';
  effect: string;                   // free text: "Damage 6", "Affliction 4", etc.
  notes: string;
}

// ── PP Advancement Log Entry (F-17 Campaign Mode) ──
export interface IPPLogEntry {
  id: string;       // uuid for keying
  date: string;     // ISO date: YYYY-MM-DD
  amount: number;   // positive = award, negative = deduction
  note: string;
}

// ── Full Character ──
export interface ICharacter {
  characterId?: string;          // Unique immutable ID for cross-device sync
  header: ICharacterHeader;
  abilities: Abilities;
  absentAbilities: AbilityKey[];
  defenses: IDefenses;
  skills: ICharacterSkill[];
  advantages: ICharacterAdvantage[];
  powers: ICharacterPower[];
  complications: IComplication[];
  equipmentNotes: string;        // F-09: free-text equipment block (v1.0, kept for migration)
  equipment?: ICharacterPower[]; // F-15: equipment items are powers with 'easily_removable'
  notes?: string;                // F-14: background & notes
  manualOffenseRows?: IManualOffenseRow[]; // F-13: custom attack rows
  campaignMode?: boolean;        // F-17: opt-in PP advancement tracking (default: false)
  ppLog?: IPPLogEntry[];         // F-17: PP award log (only used when campaignMode = true)
}

// ── Exported File Schema ──
export interface ICharacterFile {
  schemaVersion: string;
  exportedAt: string;
  language?: string;
  character: ICharacter;
}

// ── Validation Rule Configuration ──
// Allows GMs and players to toggle specific rules on/off
export interface IValidationRules {
  // Core limits (NEW - can disable fundamental rules)
  enforcePLLimits: boolean;                   // Enforce ALL PL trade-off limits (attack+damage, dodge+toughness, etc.)
  enforcePPBudget: boolean;                   // Enforce PP spending limit (prevent overspending)
  enforceMinimumAbilityScore: boolean;        // Enforce minimum ability score of -5
  enforceAlternateEffectCap: boolean;         // Alternate Effects cannot exceed base power cost
  enforceEquipmentPPLimit: boolean;           // Equipment limited to 5 PP per Equipment advantage rank
  
  // Modifier restrictions
  enforceIncompatibleModifiers: boolean;      // Prevent incompatible modifier combinations
  enforceDuplicateModifiers: boolean;         // Prevent duplicate modifier entries on the same component
  enforceModifierMaxRanks: boolean;           // Enforce maxRanks limits on modifiers
  enforceAccuratePLCap: boolean;              // Accurate modifier capped at PL
  enforcePowerSpecificModifiers: boolean;     // Only allow modifiers valid for the power
  
  // Power validations
  enforceAfflictionProgression: boolean;      // Validate Affliction condition degrees
  enforceAbsentAbilityRestrictions: boolean;  // Warn about powers requiring absent abilities
  
  // PL trade-offs (always enforced in strict mode, but can be warnings)
  plTradeOffsAsErrors: boolean;               // true = errors, false = warnings
  
  // Skill validations
  enforceTrainedOnlySkills: boolean;          // Prevent untrained use of trained-only skills
  enforceSkillAbilityRequirements: boolean;   // Warn about skills with absent base abilities
  
  // Power field validations
  enforceRequiredPowerFields: boolean;        // Require configurable power fields to be set at acquisition
}

// ── App Preferences ──
export interface IAppPreferences {
  theme: string;
  language: string;
  validationRules?: IValidationRules;         // Optional validation rule overrides
}
