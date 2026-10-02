import { useTranslation } from 'react-i18next';
import { useResourcesStore } from '../../store/resourcesStore';
import { downloadBlob } from '../../services/downloadHelper';
import { useAppDialog } from './appDialogContext';

export function ResourceStorageStatus() {
  const { t } = useTranslation();
  const loadError = useResourcesStore((state) => state.loadError);
  const storageError = useResourcesStore((state) => state.storageError);
  const source = useResourcesStore((state) => state.source);
  const count = useResourcesStore((state) => state.quarantined.length);
  const dialog = useAppDialog();
  async function exportSource() {
    try { if (source) await downloadBlob(new Blob([source], { type: 'application/json' }), 'mm3e-resource-original.json'); }
    catch { await dialog.alert({ title: t('resources.title'), message: t('draft.exportError') }); }
  }
  if (!loadError && !storageError) return null;
  return <div role="alert" className="panel" style={{ margin: 'var(--s-sm)', borderColor: 'var(--c-warning)', padding: 'var(--s-sm)' }}>
    {storageError && <p>{t(storageError)}</p>}
    {loadError && <p>{t(loadError, { count })}</p>}
    {source && loadError && <button type="button" onClick={() => void exportSource()}>{t('resources.storage.exportOriginal')}</button>}
  </div>;
}
