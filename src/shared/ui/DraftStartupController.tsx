import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  capturePendingDraftUpdateSnapshot,
  DRAFT_UPDATE_NOTICE_KEY,
  serializeDraftStorageSnapshot,
} from '../../services/storage/draftUpdateBackup';
import { downloadBlob } from '../../services/downloadHelper';
import { useAutoLoadDraftMulti } from '../hooks/useAutoLoadDraftMulti';
import { useAppDialog } from './appDialogContext';

const APP_VERSION = __APP_VERSION__;

interface PendingUpdateBackup {
  jsonl: string;
  fileName: string;
}

function prepareUpdateBackup(): PendingUpdateBackup | null {
  const snapshot = capturePendingDraftUpdateSnapshot(APP_VERSION);
  if (!snapshot) return null;
  return {
    // Serialization happens now, before the loader is allowed to migrate data.
    jsonl: serializeDraftStorageSnapshot(snapshot),
    fileName: `mm3e-pre-update-${APP_VERSION}-${new Date().toISOString().slice(0, 10)}.jsonl`,
  };
}

/** Gates startup migration until the pre-update backup choice is resolved. */
export function DraftStartupController() {
  const { t } = useTranslation();
  const dialog = useAppDialog();
  const [preparedBackup] = useState(prepareUpdateBackup);
  const [migrationAllowed, setMigrationAllowed] = useState(preparedBackup === null);
  const promptStartedRef = useRef(false);
  useAutoLoadDraftMulti(migrationAllowed);

  useEffect(() => {
    const backup = preparedBackup;
    if (!backup) {
      try {
        localStorage.setItem(DRAFT_UPDATE_NOTICE_KEY, APP_VERSION);
      } catch {
        // Storage failures are handled by the persistence layer.
      }
      return;
    }
    if (promptStartedRef.current) return;
    promptStartedRef.current = true;

    void (async () => {
      let resolved = false;
      while (!resolved) {
        const shouldExport = await dialog.confirm({
          title: t('draft.updateTitle'),
          message: t('draft.updateMessage'),
          confirmLabel: t('draft.export'),
          cancelLabel: t('draft.continue'),
        });
        if (!shouldExport) {
          resolved = true;
          continue;
        }
        try {
          const exported = await downloadBlob(
            new Blob([backup.jsonl], { type: 'application/x-ndjson' }),
            backup.fileName
          );
          resolved = exported;
        } catch {
          await dialog.alert({ title: t('draft.export'), message: t('draft.exportError') });
        }
      }

      try {
        localStorage.setItem(DRAFT_UPDATE_NOTICE_KEY, APP_VERSION);
      } catch {
        // The notice may repeat, but migration and persistence can still run.
      }
      setMigrationAllowed(true);
    })();
  }, [dialog, preparedBackup, t]);

  return null;
}
