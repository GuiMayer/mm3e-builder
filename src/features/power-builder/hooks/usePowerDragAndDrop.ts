import { useState, useCallback } from 'react';
import {
  useSensor, useSensors, PointerSensor, KeyboardSensor, pointerWithin, closestCenter,
  type DragStartEvent, type DragEndEvent, type CollisionDetection, type KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import type { IModifierDef, IPowerEffect } from '../../../entities/types';
import { nextDropTargetIndex, resolveModifierDrop, type ModifierDragData, type ModifierDropData } from '../powerDragAndDropModel';

interface UsePowerDragAndDropProps {
  powerDefs: IPowerEffect[];
  modifierDefs: IModifierDef[];
  onDropToComponent: (componentId: string, modifierId: string, isPowerSpecific?: boolean) => void;
  onDropToAEComponent: (aeId: string, componentId: string, modifierId: string, isPowerSpecific?: boolean) => void;
}

export function usePowerDragAndDrop({ powerDefs, modifierDefs, onDropToComponent, onDropToAEComponent }: UsePowerDragAndDropProps) {
  const [activeDrag, setActiveDrag] = useState<ModifierDragData | null>(null);
  const collisionDetection: CollisionDetection = useCallback((args) => {
    const droppableContainers = args.droppableContainers.filter((target) =>
      resolveModifierDrop(args.active.data.current as ModifierDragData, target.data.current as ModifierDropData, powerDefs, modifierDefs));
    const eligible = { ...args, droppableContainers };
    // Pointer drops outside a target do nothing. Keyboard movement snaps to targets.
    return args.pointerCoordinates ? pointerWithin(eligible) : closestCenter(eligible);
  }, [powerDefs, modifierDefs]);

  const keyboardCoordinates: KeyboardCoordinateGetter = useCallback((event, { currentCoordinates, context }) => {
    const { active, over, collisionRect, droppableContainers, droppableRects } = context;
    if (!active || !collisionRect) return undefined;
    const targets = droppableContainers.getEnabled().filter((target) => droppableRects.has(target.id)
      && resolveModifierDrop(active.data.current as ModifierDragData, target.data.current as ModifierDropData, powerDefs, modifierDefs));
    const next = nextDropTargetIndex(event.code, targets.findIndex((target) => target.id === over?.id), targets.length);
    if (next === null) return undefined;
    event.preventDefault();
    const rect = droppableRects.get(targets[next].id)!;
    return {
      x: currentCoordinates.x + rect.left + rect.width / 2 - collisionRect.left - collisionRect.width / 2,
      y: currentCoordinates.y + rect.top + rect.height / 2 - collisionRect.top - collisionRect.height / 2,
    };
  }, [powerDefs, modifierDefs]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates }),
  );
  function handleDragStart(event: DragStartEvent) { setActiveDrag(event.active.data.current as ModifierDragData); }
  function handleDragCancel() { setActiveDrag(null); }
  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    const drop = resolveModifierDrop(event.active.data.current as ModifierDragData, event.over?.data.current as ModifierDropData, powerDefs, modifierDefs);
    if (!drop) return;
    if (drop.aeId) onDropToAEComponent(drop.aeId, drop.componentId, drop.modifierId, drop.isPowerSpecific);
    else onDropToComponent(drop.componentId, drop.modifierId, drop.isPowerSpecific);
  }
  return { sensors, activeDrag, activeId: activeDrag?.modifier.id ?? null, collisionDetection, handleDragStart, handleDragEnd, handleDragCancel };
}
