import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { inspectModifierSources } from '../lib/modifierSourceRecovery';
import { useAppDialog } from './appDialogContext';
import { Button } from './Button';
import { serializeDraftBundle } from '../../services/draftTransfer';

export function ModifierRecoveryNotice() {
  const { t } = useTranslation();
  const dialog = useAppDialog();
  const tabs = useCharactersStore(state => state.tabs);
  const hydrated = useCharactersStore(state => state.isDraftHydrated);
  const resources = useResourcesStore(state => state.resources);
  if (!hydrated || !inspectModifierSources({ tabs, resources }).length) return null;
  async function review() {
    const original = JSON.stringify({ tabs, resources });
    const result = await dialog.reviewModifierSources({ tabs, resources }, serializeDraftBundle(tabs, useCharactersStore.getState().activeCharacterId, resources));
    if (!result) return;
    if (original !== JSON.stringify({ tabs: useCharactersStore.getState().tabs, resources: useResourcesStore.getState().resources })) { await dialog.alert({ message: t('recovery.changed') }); return; }
    if (!useResourcesStore.getState().replaceResources(result.resources)) { await dialog.alert({ message: t('resources.error.storageWrite') }); return; }
    result.tabs.forEach(tab => { if (JSON.stringify(tab.character) !== JSON.stringify(tabs.find(item => item.id === tab.id)?.character)) useCharactersStore.getState().updateCharacter(tab.id, tab.character); });
  }
  return <div className="pl-violation-banner"><span>{t('recovery.pending')}</span><Button variant="ghost" onClick={() => void review()}>{t('recovery.review')}</Button></div>;
}
