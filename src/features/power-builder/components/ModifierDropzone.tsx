import { useDroppable } from '@dnd-kit/core';

/* ================================================
   ModifierDropzone Component
   Droppable zone for modifiers in PowerBuilder
   ================================================ */

interface ModifierDropzoneProps {
  componentId: string;
  activeId: string | null;
  children: React.ReactNode;
}

export function ModifierDropzone({
  componentId,
  activeId,
  children,
}: ModifierDropzoneProps) {
  const droppableId = `dropzone-${componentId}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  return (
    <div
      ref={setNodeRef}
      className={`build-dropzone ${isOver || activeId ? 'build-dropzone--active' : ''}`}
      role="region"
      aria-label={`Drop zone for component ${componentId}`}
    >
      {children}
    </div>
  );
}
