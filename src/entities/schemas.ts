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
});

const CharacterPowerComponentSchema = z.object({
  id: z.string(),
  effectId: z.string(),
  ranks: z.number().int().min(0),
  modifiers: z.array(AppliedModifierSchema),
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
    components: z.array(CharacterPowerComponentSchema),
    notes: z.string(),
    alternateEffects: z.array(AlternateEffectSchema),
    removable: z.enum(['none', 'removable', 'easily_removable']).optional(),
  }),
  // Legacy format (will be migrated at load time)
  z.object({
    id: z.string(),
    name: z.string(),
    effectId: z.string(),
    ranks: z.number().int().min(0),
    modifiers: z.array(AppliedModifierSchema),
    notes: z.string(),
    alternateEffects: z.array(AlternateEffectSchema),
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

// F-15: Equipment Item (structured equipment system)
// Reuses CharacterPowerComponentSchema and AlternateEffectSchema for consistency
const EquipmentItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  components: z.array(CharacterPowerComponentSchema),
  notes: z.string().optional(),
  alternateEffects: z.array(AlternateEffectSchema).optional().default([]),
});

const CharacterSchema = z.object({
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
});

export type CharacterFileInferred = z.infer<typeof CharacterFileSchema>;
