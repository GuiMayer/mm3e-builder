import { v4 as uuidv4 } from 'uuid';
import type { ICharacterPower, IAlternateEffect, IAppliedModifier, ICharacterPowerComponent, ICharacterAdvantage, IAdvantageDef } from '../../entities/types';

/**
 * Default subtype used when migrating legacy advantages that require a subtype but don't have one.
 * This allows backward compatibility with characters created before subtype requirements were enforced.
 */
const DEFAULT_SUBTYPE = 'Unspecified';

/**
 * Corrects persisted representations that the older UI could produce but the
 * rules do not support. Immunity selections are complete fixed-cost packages,
 * so the old mutable component rank never represented another legal rank.
 */
function migrateComponent(raw: ICharacterPowerComponent): ICharacterPowerComponent {
  if (raw.effectId === 'immunity' && raw.variableCostOption && raw.ranks !== 1) {
    return { ...raw, ranks: 1 };
  }
  return raw;
}

function migrateComponents(rawComponents: unknown[]): ICharacterPowerComponent[] {
  return rawComponents.map((component) => {
    const normalized = migrateComponent(component as ICharacterPowerComponent);
    return normalized.modifiers.some((modifier) => modifier.modifierId === 'activation')
      ? { ...normalized, modifiers: normalized.modifiers.filter((modifier) => modifier.modifierId !== 'activation') }
      : normalized;
  });
}

function migrateActivation(rawComponents: unknown[]): 'move' | 'standard' | undefined {
  const activation = rawComponents
    .flatMap((component) => (component as ICharacterPowerComponent).modifiers ?? [])
    .filter((modifier) => modifier.modifierId === 'activation');
  if (activation.length === 0) return undefined;
  return activation.some((modifier) => modifier.ranks >= 2) ? 'standard' : 'move';
}

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
    return {
      ...(obj as unknown as IAlternateEffect),
      components: migrateComponents(obj.components),
    };
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
    const activation = (raw as unknown as ICharacterPower).activation ?? migrateActivation(raw.components);
    return {
      ...(raw as unknown as ICharacterPower),
      components: migrateComponents(raw.components),
      alternateEffects: migratedAEs,
      ...(activation ? { activation } : {}),
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
    components: migrateComponents((raw.components as unknown[]) ?? []),
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
 * 
 * Backward compatibility: If the advantage definition requires a subtype but the legacy
 * advantage doesn't have one, automatically fills with DEFAULT_SUBTYPE to allow import.
 */
export function migrateAdvantage(
  raw: Record<string, unknown>,
  advantageDefs?: readonly IAdvantageDef[]
): ICharacterAdvantage {
  const advantageId = (raw.advantageId as string) ?? '';
  const ranks = (raw.ranks as number) ?? 1;
  let subtype = (raw.subtype as string | null) ?? null;

  // Apply default subtype for backward compatibility if:
  // 1. Legacy advantage has no subtype (null or empty)
  // 2. Advantage definition requires a subtype
  if (advantageDefs && (!subtype || subtype.trim() === '')) {
    const advantageDef = advantageDefs.find((def) => def.id === advantageId);
    if (advantageDef?.subtypeRequired) {
      subtype = DEFAULT_SUBTYPE;
    }
  }

  return {
    advantageId,
    ranks,
    subtype,
  };
}

/**
 * Migrate all advantages in a character to include subtype field.
 * Optionally accepts advantage definitions to enable smart migration with default subtypes.
 */
export function migrateAdvantages(
  rawAdvantages: unknown[],
  advantageDefs?: readonly IAdvantageDef[]
): ICharacterAdvantage[] {
  if (!Array.isArray(rawAdvantages)) return [];
  return rawAdvantages.map((a) => migrateAdvantage(a as Record<string, unknown>, advantageDefs));
}
