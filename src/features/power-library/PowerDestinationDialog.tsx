import { useTranslation } from 'react-i18next';
import { Plus, UserRound } from 'lucide-react';
import type { ICharacterPower } from '../../entities/types';
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
import { useCharactersStore } from '../../store/charactersStore';
import { useResourcesStore } from '../../store/resourcesStore';
import { calculatePowerPricing } from '../../shared/lib/mathEngine';
import { Modal } from '../../shared/ui/Modal';
import { getLibraryDestinationStrength } from './libraryPricing';

export function PowerDestinationDialog({ power, onSelect, onCreate, onClose, error }: {
  power: ICharacterPower; onSelect: (tabId: string) => void; onCreate: () => void; onClose: () => void; error?: string | null;
}) {
  const { t, i18n } = useTranslation();
  const tabs = useCharactersStore(state => state.tabs);
  const resources = useResourcesStore(state => state.resources);
  const sorted = [...tabs].sort((a, b) => (a.character.header.name || t('tabs.unnamed')).localeCompare(b.character.header.name || t('tabs.unnamed'), i18n.language));
  return <Modal isOpen compact title={t('personalLibrary.targetCharacter')} onClose={onClose}>
    <div className="power-destination">
      <p className="power-destination-power"><strong>{power.name || t('powers.unnamed')}</strong></p>
      <p className="personal-notes">{t('personalLibrary.destinationHelp')}</p>
      <div className="power-destination-list" role="group" aria-label={t('personalLibrary.currentCharacters')}>
        {sorted.map(tab => <button type="button" className="power-library-result" key={tab.id} onClick={() => onSelect(tab.id)}>
          <strong><UserRound size={16}/>{tab.character.header.name || t('tabs.unnamed')}</strong>
          <small>{t('header.powerLevel')} {tab.character.header.powerLevel} · {calculatePowerPricing(power, POWER_DEFS, MODIFIER_DEFS, getLibraryDestinationStrength(power, tab.character, resources)).total} PP</small>
        </button>)}
        {!tabs.length && <p>{t('personalLibrary.noCurrentCharacters')}</p>}
      </div>
      {error && <p role="alert">{t(error)}</p>}
      <button type="button" className="power-library-apply power-destination-create" onClick={onCreate}><Plus size={16}/>{t('tabs.newCharacter')}</button>
    </div>
  </Modal>;
}
