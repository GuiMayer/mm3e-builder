import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface DropZoneProps {
  id: string;
  children: ReactNode;
  label?: string;
}

export function DropZone({ id, children, label }: DropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`dropzone ${isOver ? 'dropzone--over' : ''}`}
      aria-label={label || `Zona de soltar: ${id}`}
    >
      {children}

      <style>{`
        .dropzone {
          min-height: 80px;
          border: 2px dashed var(--c-border);
          border-radius: var(--r-md);
          padding: var(--s-md);
          transition: all var(--t-fast);
          display: flex;
          flex-wrap: wrap;
          gap: var(--s-sm);
          align-items: flex-start;
        }
        .dropzone--over {
          border-color: var(--c-primary);
          background: var(--c-primary-muted);
          box-shadow: var(--shadow-glow);
        }
      `}</style>
    </div>
  );
}
