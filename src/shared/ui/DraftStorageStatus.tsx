import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { downloadBlob } from '../../services/downloadHelper';
import { captureDraftStorageSnapshot, serializeDraftStorageSnapshot } from '../../services/storage/draftUpdateBackup';
import { useAppDialog } from './appDialogContext';

const APP_VERSION = __APP_VERSION__;

/** Surfaces recovery options while autosave remains usable for new work. */
export function DraftStorageStatus() {
  const { t } = useTranslation();
  const draftLoadError = useCharactersStore((state) => state.draftLoadError);
  const dialog = useAppDialog();
  const shownErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!draftLoadError || shownErrorRef.current === draftLoadError) return;
    shownErrorRef.current = draftLoadError;
    void (async () => {
      if (draftLoadError === 'draft.recovery.resourceWriteFailed') {
        await dialog.alert({ title: t('draft.recoveryTitle'), message: t(draftLoadError) });
        return;
      }

      const shouldExport = await dialog.confirm({
        title: t('draft.recoveryTitle'),
        message: t(draftLoadError),
        confirmLabel: t('draft.exportRecovery'),
        cancelLabel: t('draft.continue'),
      });
      if (!shouldExport) return;
      const snapshot = captureDraftStorageSnapshot(APP_VERSION);
      if (!snapshot) {
        await dialog.alert({ title: t('draft.export'), message: t('draft.exportError') });
        return;
      }
      await downloadBlob(
        new Blob([serializeDraftStorageSnapshot(snapshot)], { type: 'application/x-ndjson' }),
        `mm3e-recovery-${new Date().toISOString().slice(0, 10)}.jsonl`
      );
    })();
  }, [dialog, draftLoadError, t]);

  return null;
}
