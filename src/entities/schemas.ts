import { z } from 'zod';

/* ================================================
   Zod Schemas — Runtime validation for file import
   Types are derived from these via z.infer<>
   ================================================ */

const AbilityKeySchema = z.enum(['str', 'sta', 'agl', 'dex', 'fgt', 'int', 'awe', 'pre']);

const AppliedModifierSchema = z.object({
  modifierId: z.string(),
  ranks: z.number().int().min(1),
  isPowerSpecific: z.boolean().optional(),
  option: z.string().optional(),
  options: z.record(z.string(), z.any()).optional(),
  affectedRanks: z.number().int().min(1).optional(),
});

const SenseTraitPurchaseSchema = z.object({
  id: z.string(), ranks: z.number().int().min(1), senseType: z.string().optional(),
  scope: z.enum(['sense', 'type']).optional(), detail: z.string().optional(),
});

const FieldValueSchema = z.union([z.string(), z.array(z.string())]);

const CharacterPowerComponentSchema = z.object({
  id: z.string(),
  effectId: z.string(),
  ranks: z.number().int().min(0),
  modifiers: z.array(AppliedModifierSchema),
  variableCostOption: z.string().optional(),
  fieldValues: z.record(z.string(), FieldValueSchema).optional(),
  senseTraits: z.array(SenseTraitPurchaseSchema).optional(),
});

// Accept both v2 (components[]) and v1 legacy (effectId + ranks) formats
const AlternateEffectSchema = z.union([
  // v2 — new format with components[] (Linked Powers support)
  z.object({
    id: z.string(),
    name: z.string(),
    components: z.array(CharacterPowerComponentSchema),
    dynamic: z.boolean(),
    notes: z.string(),
  }),
  // v1 — legacy format, migrated at load time by migrateAlternateEffect()
  z.object({
    id: z.string(),
    name: z.string(),
    effectId: z.string(),
    ranks: z.number().int().min(0),
    modifiers: z.array(AppliedModifierSchema),
    dynamic: z.boolean(),
    notes: z.string(),
  }),
]);

// Accept both old (effectId at top level) and new (components[]) formats
const CharacterPowerSchema = z.union([
  // New format
  z.object({
    id: z.string(),
    name: z.string(),
    descriptors: z.array(z.string()).optional(),
    components: z.array(CharacterPowerComponentSchema),
    notes: z.string(),
    alternateEffects: z.array(AlternateEffectSchema),
    baseDynamic: z.boolean().optional(),
    activation: z.enum(['move', 'standard']).optional(),
    removable: z.enum(['none', 'removable', 'easily_removable']).optional(),
  }),
  // Legacy format (will be migrated at load time)
  z.object({
    id: z.string(),
    name: z.string(),
    descriptors: z.array(z.string()).optional(),
    effectId: z.string(),
    ranks: z.number().int().min(0),
    modifiers: z.array(AppliedModifierSchema),
    notes: z.string(),
    alternateEffects: z.array(AlternateEffectSchema),
    baseDynamic: z.boolean().optional(),
    activation: z.enum(['move', 'standard']).optional(),
    removable: z.enum(['none', 'removable', 'easily_removable']).optional(),
  }),
]);

const CharacterSkillSchema = z.object({
  skillId: z.string(),
  ranks: z.number().int().min(0),
  subtype: z.string().nullable(),
  otherBonus: z.number().int().optional(), // F-11
});

const CharacterAdvantageSchema = z.object({
  advantageId: z.string(),
  ranks: z.number().int().min(1),
  subtype: z.string().nullable().optional(),  // For advantages like Skill Mastery, Fascinate, Improved Critical, etc.
});

const ComplicationTypeSchema = z.enum([
  'motivation', 'enemy', 'identity', 'relationship',
  'responsibility', 'secret', 'weakness', 'accident',
  'social', 'disability', 'power_loss',
]);

const ComplicationSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: ComplicationTypeSchema.optional(), // F-08
});

const CharacterHeaderSchema = z.object({
  name: z.string(),
  player: z.string(),
  identity: z.string(),
  identityType: z.enum(['secret', 'public']).optional(),  // F-03
  base: z.string(),
  powerLevel: z.number().int().min(1),
  heroPoints: z.number().int().min(0),
  // F-07: Physical description (all optional strings for backward compat)
  gender: z.string().optional(),
  age: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  eyes: z.string().optional(),
  hair: z.string().optional(),
  groupAffiliation: z.string().optional(),
  series: z.string().optional(),
  gameMaster: z.string().optional(),
});

const AbilitiesSchema = z.object({
  str: z.number().int(),
  sta: z.number().int(),
  agl: z.number().int(),
  dex: z.number().int(),
  fgt: z.number().int(),
  int: z.number().int(),
  awe: z.number().int(),
  pre: z.number().int(),
});

const DefensesSchema = z.object({
  dodge: z.number().int().min(0),
  parry: z.number().int().min(0),
  fortitude: z.number().int().min(0),
  will: z.number().int().min(0),
});

// F-13: custom attack row
const ManualOffenseRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  bonus: z.number().int(),
  range: z.enum(['close', 'ranged', 'perception']),
  effect: z.string(),
  notes: z.string(),
});

// F-17: PP advancement log entry
const PPLogEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number().int(),
  note: z.string(),
});

const CharacterResourceLinkSchema = z.object({
  id: z.string(),
  resourceId: z.string().uuid(),
  isFree: z.boolean(),
  contributionEP: z.number().int().min(0).optional(),
  alternateSetId: z.string().optional(),
});

// F-15: Equipment Item — now uses same schema as powers (ICharacterPower)
// Old format (IEquipmentItem with optional notes/AEs) is also accepted for migration
const EquipmentItemSchema = z.union([
  CharacterPowerSchema,
  // Legacy equipment format (notes optional, alternateEffects optional)
  z.object({
    id: z.string(),
    name: z.string(),
    descriptors: z.array(z.string()).optional(),
    components: z.array(CharacterPowerComponentSchema),
    notes: z.string().optional(),
    alternateEffects: z.array(AlternateEffectSchema).optional().default([]),
    removable: z.enum(['none', 'removable', 'easily_removable']).optional(),
  }),
]);

export const CharacterSchema = z.object({
  characterId: z.string().uuid().optional(),  // Unique immutable ID for cross-device sync
  header: CharacterHeaderSchema,
  abilities: AbilitiesSchema,
  absentAbilities: z.array(AbilityKeySchema),
  defenses: DefensesSchema,
  skills: z.array(CharacterSkillSchema),
  advantages: z.array(CharacterAdvantageSchema),
  powers: z.array(CharacterPowerSchema),
  complications: z.array(ComplicationSchema),
  equipmentNotes: z.string().default(''),  // F-09: optional in old files, defaults to ''
  equipment: z.array(EquipmentItemSchema).optional().default([]), // F-15: structured equipment
  resourceLinks: z.array(CharacterResourceLinkSchema).optional().default([]),
  notes: z.string().optional(),            // F-14: background & notes
  manualOffenseRows: z.array(ManualOffenseRowSchema).optional(), // F-13
  campaignMode: z.boolean().optional(),    // F-17: opt-in mode (default off)
  ppLog: z.array(PPLogEntrySchema).optional(), // F-17: PP award log
});

export const CharacterFileSchema = z.object({
  schemaVersion: z.string(),
  exportedAt: z.string(),
  language: z.string().optional(),
  character: CharacterSchema,
  appendix: z.object({ resources: z.unknown().optional() }).optional(),
});

export type CharacterFileInferred = z.infer<typeof CharacterFileSchema>;
