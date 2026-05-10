import { useMemo } from 'react';
import type { IPowerEffect, IModifierDef } from '../../../entities/types';
import { MODIFIER_DEFS } from '../../../entities/gameDataLoaders';

/**
 * Hook: useValidModifiers
 * 
 * Filters modifiers to show only those valid for the selected power effect.
 * Returns universal modifiers + power-specific extras/flaws.
 * 
 * Phase 4: UI Filtering for Power-Specific Modifiers
 */

interface UseValidModifiersResult {
  validModifiers: IModifierDef[];
  universalModifiers: IModifierDef[];
  powerSpecificModifiers: IModifierDef[];
  isModifierValid: (modifierId: string) => boolean;
}

export function useValidModifiers(
  selectedEffect: IPowerEffect | undefined,
  allModifiers: IModifierDef[] = MODIFIER_DEFS
): UseValidModifiersResult {
  return useMemo(() => {
    // Universal modifiers are always valid
    const universalModifiers = allModifiers;

    // Power-specific modifiers from the selected effect
    const powerSpecificModifiers: IModifierDef[] = selectedEffect
      ? [
          ...(selectedEffect.extras || []),
          ...(selectedEffect.flaws || []),
        ]
      : [];

    // Build set of valid modifier IDs for quick lookup
    const validModifierIds = new Set<string>([
      ...universalModifiers.map((m) => m.id),
      ...powerSpecificModifiers.map((m) => m.id),
    ]);

    // Combined list of all valid modifiers (no duplicates)
    const validModifiers = [
      ...universalModifiers,
      ...powerSpecificModifiers.filter(
        (pm) => !universalModifiers.some((um) => um.id === pm.id)
      ),
    ];

    return {
      validModifiers,
      universalModifiers,
      powerSpecificModifiers,
      isModifierValid: (modifierId: string) => validModifierIds.has(modifierId),
    };
  }, [selectedEffect, allModifiers]);
}
