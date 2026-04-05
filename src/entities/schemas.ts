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
});

const AlternateEffectSchema = z.object({
  id: z.string(),
  name: z.string(),
  effectId: z.string(),
  ranks: z.number().int().min(0),
  modifiers: z.array(AppliedModifierSchema),
  dynamic: z.boolean(),
  notes: z.string(),
});

const CharacterPowerComponentSchema = z.object({
  id: z.string(),
  effectId: z.string(),
  ranks: z.number().int().min(0),
  modifiers: z.array(AppliedModifierSchema),
});

// Accept both old (effectId at top level) and new (components[]) formats
const CharacterPowerSchema = z.union([
  // New format
  z.object({
    id: z.string(),
    name: z.string(),
    components: z.array(CharacterPowerComponentSchema),
    notes: z.string(),
    alternateEffects: z.array(AlternateEffectSchema),
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
  }),
]);

const CharacterSkillSchema = z.object({
  skillId: z.string(),
  ranks: z.number().int().min(0),
  subtype: z.string().nullable(),
});

const CharacterAdvantageSchema = z.object({
  advantageId: z.string(),
  ranks: z.number().int().min(1),
});

const ComplicationSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const CharacterHeaderSchema = z.object({
  name: z.string(),
  player: z.string(),
  identity: z.string(),
  base: z.string(),
  powerLevel: z.number().int().min(1),
  heroPoints: z.number().int().min(0),
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

const CharacterSchema = z.object({
  header: CharacterHeaderSchema,
  abilities: AbilitiesSchema,
  absentAbilities: z.array(AbilityKeySchema),
  defenses: DefensesSchema,
  skills: z.array(CharacterSkillSchema),
  advantages: z.array(CharacterAdvantageSchema),
  powers: z.array(CharacterPowerSchema),
  complications: z.array(ComplicationSchema),
});

export const CharacterFileSchema = z.object({
  schemaVersion: z.string(),
  exportedAt: z.string(),
  language: z.string().optional(),
  character: CharacterSchema,
});

export type CharacterFileInferred = z.infer<typeof CharacterFileSchema>;
