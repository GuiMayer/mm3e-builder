import { useState } from 'react';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActiveCharacter } from '../../shared/hooks/useActiveCharacter';
import { usePortrait } from './usePortrait';
import { PortraitEditor } from './PortraitEditor';
import './portraits.css';

export function CharacterPortrait() {
  const { t } = useTranslation();
  const { character, characterId: tabId } = useActiveCharacter();
  const characterId = character.characterId;
  const url = character.header.portraitUrl;
  const portrait = usePortrait(characterId, url);
  const [openIdentity, setOpenIdentity] = useState<string>();
  const [failed, setFailed] = useState('');
  const src = portrait.thumbnail;
  return <div className={`portrait-avatar-wrap ${src && failed !== src ? 'portrait-avatar-wrap--filled' : ''}`}>
    <button type="button" className="hero-avatar" disabled={!tabId || !characterId} aria-label={t('portrait.edit')} title={t(portrait.local ? 'portrait.localSaved' : 'portrait.edit')} onClick={() => setOpenIdentity(characterId)}>
      {src && failed !== src ? <img src={src} referrerPolicy="no-referrer" alt={t('portrait.alt', { name: character.header.name })} onError={() => setFailed(src)} /> : <User size={32} />}
    </button>
    {portrait.local && <span className="portrait-local-label">{t('portrait.local')}</span>}
    {openIdentity === characterId && tabId && characterId && <PortraitEditor key={characterId} tabId={tabId} characterId={characterId} portraitUrl={url} currentImage={portrait.image} local={portrait.local} cached={portrait.cached} onClose={() => setOpenIdentity(undefined)} />}
  </div>;
}
