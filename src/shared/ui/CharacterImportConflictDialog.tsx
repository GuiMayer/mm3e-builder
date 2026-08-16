import { useTranslation } from 'react-i18next';
import type { PendingCharacterImport } from '../hooks/useFileOperations';
import { Button } from './Button';
import { Modal } from './Modal';

interface CharacterImportConflictDialogProps {
  pendingImport: PendingCharacterImport | null;
  onUpdate: (tabId: string) => void;
  onOpenAsCopy: () => void;
  onCancel: () => void;
}

/** Lets the user resolve an imported file that matches an open character. */
export function CharacterImportConflictDialog({
  pendingImport,
  onUpdate,
  onOpenAsCopy,
  onCancel,
}: CharacterImportConflictDialogProps) {
  const { t } = useTranslation();
  const matches = pendingImport?.matchingTabs ?? [];

  return (
    <Modal
      isOpen={pendingImport !== null}
      onClose={onCancel}
      title={t('characterImport.conflict.title')}
      compact
    >
      <div className="character-import-conflict">
        <p>{t('characterImport.conflict.description', { count: matches.length })}</p>
        <div className="character-import-conflict__matches">
          {matches.map((tab) => (
            <Button key={tab.id} variant="secondary" onClick={() => onUpdate(tab.id)}>
              {t('characterImport.conflict.update', { name: tab.label })}
            </Button>
          ))}
        </div>
        <div className="character-import-conflict__actions">
          <Button variant="primary" onClick={onOpenAsCopy}>
            {t('characterImport.conflict.openCopy')}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>

      <style>{`
        .character-import-conflict { display: flex; flex-direction: column; gap: var(--s-md); }
        .character-import-conflict p { color: var(--c-text-secondary); font-size: .88rem; line-height: 1.5; margin: 0; }
        .character-import-conflict__matches { display: flex; flex-direction: column; gap: var(--s-xs); }
        .character-import-conflict__matches .btn { justify-content: flex-start; text-align: left; white-space: normal; }
        .character-import-conflict__actions { display: flex; flex-wrap: wrap; gap: var(--s-sm); justify-content: flex-end; }
      `}</style>
    </Modal>
  );
}
