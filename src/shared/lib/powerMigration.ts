import { v4 as uuidv4 } from 'uuid';
import type { ICharacterPower, IAlternateEffect, IAppliedModifier, ICharacterPowerComponent, ICharacterAdvantage } from '../../entities/types';

/**
 * Factory for a safe, empty AE fallback — used when input is malformed.
 * Preserves the id if present so array slots remain stable.
 */
function safeFallbackAE(raw: unknown): IAlternateEffect {
  const id = typeof raw === 'object' && raw !== null && 'id' in raw
    ? String((raw as Record<string, unknown>).id)
    : uuidv4();
  const name = typeof raw === 'object' && raw !== null && 'name' in raw
    ? String((raw as Record<string, unknown>).name)
    : '';
  return { id, name, dynamic: false, components: [], notes: '' };
}

/**
 * Migrate an Alternate Effect from legacy v1 format (effectId + ranks + modifiers)
 * to the new v2 format (components[]).
 *
 * Safety guarantees:
 * - Non-object inputs → safe empty AE
 * - v2 (components[]) → pass through
 * - v1 (effectId flat) → wrap in components[0]
 * - Completely unknown shape → safe empty AE instead of phantom component
 */
export function migrateAlternateEffect(raw: unknown): IAlternateEffect {
  // Guard: must be a plain object
  if (typeof raw !== 'object' || raw === null) {
    return safeFallbackAE(raw);
  }

  const obj = raw as Record<string, unknown>;

  // v2 format: components[] present
  if (Array.isArray(obj.components)) {
    return obj as unknown as IAlternateEffect;
  }

  // v1 format: must have effectId to be a valid legacy AE
  if (typeof obj.effectId === 'string' && obj.effectId.length > 0) {
    return {
      id: (obj.id as string) ?? uuidv4(),
      name: (obj.name as string) ?? '',
      components: [
        {
          id: uuidv4(),
          effectId: obj.effectId,
          ranks: (obj.ranks as number) ?? 1,
          modifiers: (obj.modifiers as IAppliedModifier[]) ?? [],
        },
      ],
      dynamic: (obj.dynamic as boolean) ?? false,
      notes: (obj.notes as string) ?? '',
    };
  }

  // Unknown shape → safe empty AE (no phantom component with empty effectId)
  return safeFallbackAE(obj);
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

/**
 * Migrate an equipment item from old IEquipmentItem format to ICharacterPower.
 * Equipment items are now stored as ICharacterPower with removable='easily_removable'.
 */
export function migrateEquipmentItem(raw: Record<string, unknown>): ICharacterPower {
  // Migrate alternateEffects if present
  const migratedAEs = ((raw.alternateEffects as unknown[]) ?? []).map((ae) =>
    migrateAlternateEffect(ae as Record<string, unknown>)
  );

  return {
    id: (raw.id as string) ?? uuidv4(),
    name: (raw.name as string) ?? '',
    components: (raw.components as ICharacterPowerComponent[]) ?? [],
    notes: (raw.notes as string) ?? '',
    alternateEffects: migratedAEs,
    removable: 'none', // Equipment EP cost does not use removable discount
  };
}

/**
 * Migrate all equipment items in a character to ICharacterPower format.
 */
export function migrateEquipment(rawEquipment: unknown[]): ICharacterPower[] {
  if (!Array.isArray(rawEquipment)) return [];
  return rawEquipment.map((e) => migrateEquipmentItem(e as Record<string, unknown>));
}

/**
 * Migrate an advantage from old format (without subtype) to new format (with subtype).
 * Old format: { advantageId: string, ranks: number }
 * New format: { advantageId: string, ranks: number, subtype: string | null }
 */
export function migrateAdvantage(raw: Record<string, unknown>): ICharacterAdvantage {
  return {
    advantageId: (raw.advantageId as string) ?? '',
    ranks: (raw.ranks as number) ?? 1,
    subtype: (raw.subtype as string | null) ?? null,
  };
}

/**
 * Migrate all advantages in a character to include subtype field.
 */
export function migrateAdvantages(rawAdvantages: unknown[]): ICharacterAdvantage[] {
  if (!Array.isArray(rawAdvantages)) return [];
  return rawAdvantages.map((a) => migrateAdvantage(a as Record<string, unknown>));
}
