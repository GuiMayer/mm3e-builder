import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { useAppDialog } from './appDialogContext';

/** Surfaces protected load failures instead of silently leaving autosave off. */
export function DraftStorageStatus() {
  const { t } = useTranslation();
  const draftLoadError = useCharactersStore((state) => state.draftLoadError);
  const dialog = useAppDialog();
  const shownErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!draftLoadError || shownErrorRef.current === draftLoadError) return;
    shownErrorRef.current = draftLoadError;
    void dialog.alert({ title: t('draft.recoveryTitle'), message: `${t(draftLoadError)}\n\n${t('draft.recovery.preserved')}` });
  }, [dialog, draftLoadError, t]);

  return null;
}
