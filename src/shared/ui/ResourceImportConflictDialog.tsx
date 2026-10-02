import { useTranslation } from 'react-i18next';
import type { IResource } from '../../entities/types';
import type { ResourceImportChoice } from '../lib/resourceImport';
import { Button } from './Button';
import { Modal } from './Modal';

export function ResourceImportConflictDialog({ conflicts, onChoose }: { conflicts: IResource[] | null; onChoose: (choice: ResourceImportChoice | null) => void }) {
  const { t } = useTranslation();
  return <Modal isOpen={conflicts !== null} onClose={() => onChoose(null)} title={t('resources.import.conflictTitle')} compact>
    <p>{t('resources.import.conflictDescription')}</p>
    <ul>{conflicts?.map(resource => <li key={resource.id}>{resource.name || t('resources.unnamed')}</li>)}</ul>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-sm)' }}>
      {(['keep', 'copy', 'update'] as const).map(choice => <Button key={choice} variant={choice === 'copy' ? 'primary' : 'secondary'} onClick={() => onChoose(choice)}>{t(`resources.import.${choice}`)}</Button>)}
      <Button variant="ghost" onClick={() => onChoose(null)}>{t('common.cancel')}</Button>
    </div>
  </Modal>;
}
