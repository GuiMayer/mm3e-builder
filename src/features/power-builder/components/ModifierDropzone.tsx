import { useDndContext, useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { POWER_DEFS, MODIFIER_DEFS } from '../../../entities/gameDataLoaders';
import { resolveModifierDrop, type ModifierDragData, type ModifierDropData } from '../powerDragAndDropModel';

interface ModifierDropzoneProps {
  componentId: string;
  effectId: string;
  label: string;
  aeId?: string;
  children: React.ReactNode;
}
export function ModifierDropzone({ componentId, effectId, label, aeId, children }: ModifierDropzoneProps) {
  const { t } = useTranslation();
  const data: ModifierDropData = { kind: 'modifier-target', componentId, aeId, effectId, label };
  const { active } = useDndContext();
  const eligible = !!resolveModifierDrop(active?.data.current as ModifierDragData, data, POWER_DEFS, MODIFIER_DEFS);
  const { setNodeRef, isOver } = useDroppable({ id: aeId ? `dropzone-ae::${aeId}::${componentId}` : `dropzone-${componentId}`, data, disabled: !effectId });
  return (
    <div ref={setNodeRef} className={`build-dropzone ${eligible ? 'build-dropzone--eligible' : ''} ${eligible && isOver ? 'build-dropzone--active' : ''}`}
      role="region" aria-label={t('builder.dropTarget', { name: label })} data-drop-component={componentId}>
      {children}
      {eligible && isOver && <span className="dropzone-feedback">{t('builder.releaseToAdd')}</span>}
    </div>
  );
}
