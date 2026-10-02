import { useTranslation } from 'react-i18next';
import { useCharactersStore } from '../../store/charactersStore';
import { useRollSession } from './rollSessionStore';
import { D20Icon } from './D20Icon';

interface Props {
  bonus: number;
  label: string;
  section: string;
  detail?: string;
  breakdown?: string[];
  routine?: boolean;
  showLabel?: boolean;
}

export function RollButton({ bonus, label, section, detail, breakdown, routine = false, showLabel = false }: Props) {
  const { t } = useTranslation();
  const hasCharacter = useCharactersStore(state => state.tabs.some(tab => tab.id === state.activeCharacterId));
  const signedBonus = bonus < 0 ? `− ${Math.abs(bonus)}` : `+ ${bonus}`;
  const description = t(routine ? 'dice.routineNamed' : 'dice.rollNamed', { name: label, bonus: signedBonus });
  return <button type="button" className={`roll-button${showLabel ? ' roll-button--label' : ''}`} disabled={!hasCharacter || !Number.isSafeInteger(bonus) || !Number.isSafeInteger(bonus + 20)} title={description} aria-label={description}
    onClick={event => {
      event.stopPropagation();
      const state = useCharactersStore.getState();
      const tab = state.tabs.find(value => value.id === state.activeCharacterId);
      if (!tab) return;
      useRollSession.getState().roll({ bonus, mode: routine ? 'routine' : 'd20', source: {
        characterId: tab.id, characterName: tab.character.header.name || t('tabs.unnamed'), section, label, detail, breakdown,
      } });
    }}>
    {routine ? <span className="roll-routine-icon">10</span> : <D20Icon size={20} />}
    {showLabel && <span>{label}</span>}
  </button>;
}
