import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import {
  POINT_CALCULATION_NOTICE_KEY,
  POINT_CALCULATION_REVISION,
  shouldShowPointCalculationNotice,
} from '../lib/pointCalculationVersion';
import { useAppDialog } from './appDialogContext';

export function PointCalculationUpdateNotice() {
  const { t } = useTranslation();
  const dialog = useAppDialog();
  const tabs = useCharactersStore((state) => state.tabs);
  const isDraftHydrated = useCharactersStore((state) => state.isDraftHydrated);
  const draftLoadError = useCharactersStore((state) => state.draftLoadError);
  const resources = useResourcesStore((state) => state.resources);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current || !isDraftHydrated || draftLoadError !== null) return;

    let storedRevision: string | null = null;
    try {
      storedRevision = localStorage.getItem(POINT_CALCULATION_NOTICE_KEY);
    } catch {
      // A blocked read behaves like an unseen revision. The alert remains safe.
    }

    handledRef.current = true;
    const shouldShow = shouldShowPointCalculationNotice({
      storedRevision,
      isDraftHydrated,
      draftLoadError,
      tabs,
      resources,
    });

    void (async () => {
      if (shouldShow) {
        await dialog.alert({
          title: t('calculationUpdate.title'),
          message: t('calculationUpdate.message'),
          confirmLabel: t('common.ok'),
        });
      }

      try {
        localStorage.setItem(
          POINT_CALCULATION_NOTICE_KEY,
          POINT_CALCULATION_REVISION
        );
      } catch {
        // The calculation remains correct; only the notice may repeat.
      }
    })();
  }, [dialog, draftLoadError, isDraftHydrated, resources, t, tabs]);

  return null;
}
