import { useState } from 'react';
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';

/* ================================================
   usePowerDragAndDrop Hook
   Encapsulates drag-and-drop logic for PowerBuilder
   ================================================ */

interface UsePowerDragAndDropProps {
  onDropToComponent: (componentId: string, modifierId: string) => void;
  onDropToAEComponent: (aeId: string, componentId: string, modifierId: string) => void;
}

export function usePowerDragAndDrop({
  onDropToComponent,
  onDropToAEComponent,
}: UsePowerDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const modId = active.id as string;

    // AE dropzone uses '::' separator to avoid UUID hyphen fragmentation
    if (overId.startsWith('dropzone-ae::')) {
      const payload = overId.replace('dropzone-ae::', '');
      const sep = payload.indexOf('::');
      const aeId = payload.slice(0, sep);
      const compId = payload.slice(sep + 2);
      onDropToAEComponent(aeId, compId, modId);
      return;
    }

    // Regular component dropzone
    if (!overId.startsWith('dropzone-')) return;
    const targetComponentId = overId.replace('dropzone-', '');
    onDropToComponent(targetComponentId, modId);
  }

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}
