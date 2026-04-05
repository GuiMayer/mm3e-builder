import { v4 as uuidv4 } from 'uuid';
import type { ICharacterPower, IAlternateEffect, IAppliedModifier } from '../../entities/types';

/**
 * Migrate a power from the legacy format (effectId + ranks + modifiers at top level)
 * to the new multi-component format (components[]).
 *
 * This is called whenever loading characters from localStorage or JSON files.
 */
export function migratePower(raw: Record<string, unknown>): ICharacterPower {
  // Already in new format
  if (Array.isArray(raw.components)) {
    return raw as unknown as ICharacterPower;
  }

  // Legacy format: effectId + ranks + modifiers at top level
  const legacyEffectId = (raw.effectId as string) ?? '';
  const legacyRanks = (raw.ranks as number) ?? 1;
  const legacyModifiers = (raw.modifiers as IAppliedModifier[]) ?? [];

  return {
    id: (raw.id as string) ?? uuidv4(),
    name: (raw.name as string) ?? '',
    components: [
      {
        id: uuidv4(),
        effectId: legacyEffectId,
        ranks: legacyRanks,
        modifiers: legacyModifiers,
      },
    ],
    notes: (raw.notes as string) ?? '',
    alternateEffects: ((raw.alternateEffects as IAlternateEffect[]) ?? []),
  };
}

/**
 * Migrate all powers in a character.
 */
export function migratePowers(rawPowers: unknown[]): ICharacterPower[] {
  return rawPowers.map((p) => migratePower(p as Record<string, unknown>));
}
