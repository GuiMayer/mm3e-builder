import { useEffect, useRef } from 'react';
import { useCharactersStore } from '../../store/charactersStore';
import { useAppDialog } from './appDialogContext';

/** Surfaces protected load failures instead of silently leaving autosave off. */
export function DraftStorageStatus() {
  const draftLoadError = useCharactersStore((state) => state.draftLoadError);
  const dialog = useAppDialog();
  const shownErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!draftLoadError || shownErrorRef.current === draftLoadError) return;
    shownErrorRef.current = draftLoadError;
    void dialog.alert({ title: 'Draft recovery needed', message: `${draftLoadError}\n\nNo local data was replaced.` });
  }, [dialog, draftLoadError]);

  return null;
}
