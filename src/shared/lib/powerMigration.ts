import { v4 as uuidv4 } from 'uuid';
import type { ICharacterPower, IAlternateEffect, IAppliedModifier } from '../../entities/types';

/**
 * Migrate an Alternate Effect from legacy v1 format (effectId + ranks + modifiers)
 * to the new v2 format (components[]).
 *
 * This enables Linked Powers within a single array slot — a canonical MM3e technique
 * (e.g. "Taser Blade": Close Damage 5 + Affliction 5 linked in one AE slot).
 */
export function migrateAlternateEffect(raw: Record<string, unknown>): IAlternateEffect {
  // Already in v2 format
  if (Array.isArray(raw.components)) {
    return raw as unknown as IAlternateEffect;
  }

  // v1 format: effectId + ranks + modifiers → wrap in components[0]
  return {
    id: (raw.id as string) ?? uuidv4(),
    name: (raw.name as string) ?? '',
    components: [
      {
        id: uuidv4(),
        effectId: (raw.effectId as string) ?? '',
        ranks: (raw.ranks as number) ?? 1,
        modifiers: (raw.modifiers as IAppliedModifier[]) ?? [],
      },
    ],
    dynamic: (raw.dynamic as boolean) ?? false,
    notes: (raw.notes as string) ?? '',
  };
}

/**
 * Migrate a power from the legacy format (effectId + ranks + modifiers at top level)
 * to the new multi-component format (components[]).
 *
 * Also migrates all nested alternateEffects from v1 to v2 format.
 * Called whenever loading characters from localStorage or JSON files.
 */
export function migratePower(raw: Record<string, unknown>): ICharacterPower {
  // Migrate alternateEffects regardless of power format
  const migratedAEs = ((raw.alternateEffects as unknown[]) ?? []).map((ae) =>
    migrateAlternateEffect(ae as Record<string, unknown>)
  );

  // Already in new format
  if (Array.isArray(raw.components)) {
    return {
      ...(raw as unknown as ICharacterPower),
      alternateEffects: migratedAEs,
    };
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
    alternateEffects: migratedAEs,
  };
}

/**
 * Migrate all powers in a character.
 */
export function migratePowers(rawPowers: unknown[]): ICharacterPower[] {
  return rawPowers.map((p) => migratePower(p as Record<string, unknown>));
}
