/**
 * gameDataLoaders.ts
 *
 * Single, documented point for importing game data JSON files and
 * casting them to the domain types they satisfy.
 *
 * The `as unknown as T[]` casts here are intentional and justified:
 * TypeScript infers JSON imports as literal types (e.g. `"attack" | "movement"`)
 * while IPowerEffect uses the broader `EffectType = string`. The runtime shapes
 * are guaranteed to match because the JSON files are validated against the
 * same schemas used by the importer (fileService + schemas.ts).
 *
 * All other files in the codebase should import from here instead of
 * casting raw JSON imports directly.
 */

import powersRaw from '../data/powers.json';
import modifiersRaw from '../data/modifiers.json';
import advantagesRaw from '../data/advantages.json';
import skillsRaw from '../data/skills.json';

import type { IPowerEffect, IModifierDef, IAdvantageDef, ISkillDef } from './types';

export const POWER_DEFS = powersRaw as unknown as IPowerEffect[];
export const MODIFIER_DEFS = modifiersRaw as unknown as IModifierDef[];
export const ADVANTAGE_DEFS = advantagesRaw as unknown as IAdvantageDef[];
export const SKILL_DEFS = skillsRaw as unknown as ISkillDef[];
