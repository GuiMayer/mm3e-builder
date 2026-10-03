import { useEffect, useRef, useState } from 'react';
import { PortraitFrame, type PortraitFrameSize } from './PortraitFrame';
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
  const fit = character.header.portraitFit ?? 'contain';
  const portrait = usePortrait(characterId, url);
  const [openIdentity, setOpenIdentity] = useState<string>();
  const [failed, setFailed] = useState('');
  const src = portrait.thumbnail;
  const sizeProbe = useRef<HTMLSpanElement>(null);
  const [frameSize, setFrameSize] = useState<PortraitFrameSize>({ width: 224, height: 224 });
  useEffect(() => {
    const probe = sizeProbe.current;
    if (!probe) return;
    // Measure the filled frame even before the first image is chosen. The probe
    // shares its sizing rules but never changes the sheet's layout.
    const observer = new ResizeObserver(() => {
      const { width, height } = probe.getBoundingClientRect();
      if (width > 0 && height > 0) setFrameSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    });
    observer.observe(probe);
    return () => observer.disconnect();
  }, []);
  return <div className={`portrait-avatar-wrap ${src && failed !== src ? 'portrait-avatar-wrap--filled' : ''}`}>
    <span ref={sizeProbe} className="portrait-size-probe" aria-hidden="true" />
    <PortraitFrame src={src && failed !== src ? src : undefined} fit={fit} imageAlt={t('portrait.alt', { name: character.header.name })} onImageError={() => setFailed(src ?? '')} disabled={!tabId || !characterId} aria-label={t('portrait.edit')} title={t(portrait.local ? 'portrait.localSaved' : 'portrait.edit')} onClick={() => setOpenIdentity(characterId)} />
    {portrait.local && <span className="portrait-local-label">{t('portrait.local')}</span>}
    {openIdentity === characterId && tabId && characterId && <PortraitEditor key={characterId} tabId={tabId} characterId={characterId} portraitUrl={url} portraitFit={character.header.portraitFit} frameSize={frameSize} currentImage={portrait.image} local={portrait.local} cached={portrait.cached} onClose={() => setOpenIdentity(undefined)} />}
  </div>;
}
