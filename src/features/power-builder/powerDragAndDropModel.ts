import type { IModifierDef, IPowerEffect } from '../../entities/types';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';

export interface ModifierDragData {
  kind: 'modifier';
  modifier: IModifierDef;
  isPowerSpecific: boolean;
  sourceEffectId?: string;
}
export interface ModifierDropData {
  kind: 'modifier-target';
  componentId: string;
  aeId?: string;
  effectId: string;
  label: string;
}

/** Preserve the exact catalog source; never infer it from a shared modifier ID. */
export function resolveModifierDrop(
  drag: ModifierDragData | undefined | null,
  target: ModifierDropData | undefined | null,
  powerDefs: IPowerEffect[],
  modifierDefs: IModifierDef[],
) {
  if (drag?.kind !== 'modifier' || target?.kind !== 'modifier-target' || !target.componentId) return null;
  const effect = powerDefs.find((definition) => definition.id === target.effectId);
  if (!effect || (drag.isPowerSpecific && drag.sourceEffectId !== effect.id)) return null;
  const modifierId = drag.modifier.id;
  if (!resolveModifierDefinition({ modifierId, ranks: 1, isPowerSpecific: drag.isPowerSpecific }, effect, modifierDefs).definition) return null;
  return { componentId: target.componentId, aeId: target.aeId, modifierId, isPowerSpecific: drag.isPowerSpecific };
}

/** Keyboard arrows cycle real eligible targets, rather than moving a ghost 25 px. */
export function nextDropTargetIndex(key: string, currentIndex: number, count: number): number | null {
  if (!count || !['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(key)) return null;
  if (currentIndex < 0) return 0;
  const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
  return (currentIndex + direction + count) % count;
}
