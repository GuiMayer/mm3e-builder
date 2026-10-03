import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ImagePlus, Link, RefreshCw, Trash2 } from 'lucide-react';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { useCharactersStore } from '../../store/charactersStore';
import { collectUnusedPortraitMedia, removeLocalPortrait, savePortrait, type PortraitMedia } from '../../services/storage/portraitStorage';
import { downloadPortrait, portraitErrorKey, preparePortrait, validatePortraitUrl } from '../../services/portraits/portraitImages';
import { useBlobUrl } from './usePortrait';
import { useToast } from '../../shared/hooks/useToast';
import './portraits.css';

interface Props { tabId: string; characterId: string; portraitUrl?: string; currentImage?: string; local: boolean; cached: boolean; onClose: () => void }

export function PortraitEditor({ tabId, characterId, portraitUrl, currentImage, local, cached, onClose }: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'link' | 'file'>(portraitUrl ? 'link' : 'file');
  const [address, setAddress] = useState(portraitUrl ?? '');
  const [prepared, setPrepared] = useState<PortraitMedia>();
  const [preparedUrl, setPreparedUrl] = useState('');
  const [fallback, setFallback] = useState('');
  const [fallbackReady, setFallbackReady] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const operation = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const preview = useBlobUrl(prepared?.image);
  const [expanded, setExpanded] = useState(false);
  const close = () => { operation.current++; controller.current?.abort(); onClose(); };
  const reset = () => { operation.current++; controller.current?.abort(); setBusy(false); setPrepared(undefined); setPreparedUrl(''); setFallback(''); setFallbackReady(false); setError(''); };
  const source = preview ?? fallback ?? currentImage;

  async function prepare(file?: File) {
    reset();
    const generation = operation.current;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    let url = '';
    try {
      if (!file) url = validatePortraitUrl(address);
      const media = file ? await preparePortrait(file) : await downloadPortrait(url, abort.signal);
      if (generation !== operation.current) return;
      setPrepared(media); setPreparedUrl(url);
    } catch (caught) {
      if (generation !== operation.current) return;
      setError(t(portraitErrorKey(caught)));
      if (url) setFallback(url);
    } finally { if (generation === operation.current) setBusy(false); }
  }

  async function apply(remove = false) {
    setSaving(true); setError('');
    try {
      // The original tab/identity are captured; switching active sheets cannot redirect a write.
      const tab = useCharactersStore.getState().getCharacterById(tabId);
      if (!tab || tab.character.characterId !== characterId) throw new Error('portrait.storageError');
      if (remove) await removeLocalPortrait(characterId);
      else if (mode === 'file' && prepared) await savePortrait(prepared, { characterId });
      else if (mode === 'link' && prepared) await savePortrait(prepared, { url: preparedUrl });
      const url = !remove && mode === 'link' ? preparedUrl || fallback : undefined;
      useCharactersStore.getState().updateCharacter(tabId, { header: { ...tab.character.header, portraitUrl: url } });
      void collectUnusedPortraitMedia().catch(() => undefined);
      // Persistence is best-effort; it is not a backup and may be declined by the browser.
      if (!remove) void navigator.storage?.persist?.().catch(() => undefined);
      showToast(t(remove ? 'portrait.removed' : mode === 'file' ? 'portrait.localSaved' : prepared ? 'portrait.linkSaved' : 'portrait.linkOnly'), 'info');
      close();
    } catch { setError(t('portrait.storageError')); }
    finally { setSaving(false); }
  }

  return <div className="portrait-dialog"><Modal isOpen title={t('portrait.title')} onClose={close} compact dismissible={!saving}>
    <div className="portrait-editor">
      <div className="portrait-modes" role="group" aria-label={t('portrait.source')}>
        <button type="button" aria-pressed={mode === 'link'} disabled={busy || saving} onClick={() => { reset(); setMode('link'); }}><Link size={17} />{t('portrait.link')}</button>
        <button type="button" aria-pressed={mode === 'file'} disabled={busy || saving} onClick={() => { reset(); setMode('file'); }}><ImagePlus size={17} />{t('portrait.file')}</button>
      </div>
      {mode === 'file' ? <>
        <p className="portrait-notice" id="portrait-local-notice">{t('portrait.localNotice')}</p>
        <label className="portrait-file-label">{t('portrait.chooseFile')}<input type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="portrait-local-notice portrait-limits" disabled={busy || saving} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void prepare(file); }} /></label>
        <p className="portrait-hint" id="portrait-limits">{t('portrait.limits')}</p>
      </> : <>
        <p className="portrait-hint">{t('portrait.linkNotice')}</p>
        <label className="portrait-address">{t('portrait.address')}<input type="url" placeholder="https://…" value={address} maxLength={2048} disabled={saving} onChange={event => { reset(); setAddress(event.target.value); }} /></label>
        <Button variant="secondary" disabled={!address.trim() || busy || saving} onClick={() => void prepare()}><RefreshCw size={15} />{address.trim() === portraitUrl ? t('portrait.refresh') : t('portrait.load')}</Button>
      </>}
      <button type="button" className={`portrait-preview ${expanded ? 'portrait-preview--expanded' : ''}`} disabled={!source || saving} onClick={() => setExpanded(!expanded)} aria-label={t(expanded ? 'portrait.reduce' : 'portrait.expand')}>
        {source ? <img key={source} src={source} referrerPolicy="no-referrer" alt={t('portrait.preview')} onLoad={() => { if (source === fallback) setFallbackReady(true); }} onError={() => { if (source === fallback) setFallbackReady(false); setError(t('portrait.displayError')); }} /> : <User size={48} />}
      </button>
      <div role="status" aria-live="polite" className="portrait-hint">{busy ? t('portrait.loading') : prepared ? t('portrait.ready') : fallbackReady ? t('portrait.linkOnly') : local ? t('portrait.localSaved') : currentImage ? t(cached ? 'portrait.linkSaved' : 'portrait.linkOnly') : t('portrait.empty')}</div>
      {error && <p role="alert" className="portrait-error">{error}</p>}
      <div className="portrait-actions">
        <Button variant="danger" disabled={saving || busy || (!local && !portraitUrl)} onClick={() => void apply(true)}><Trash2 size={15} />{t('portrait.remove')}</Button>
        <Button variant="ghost" disabled={saving} onClick={close}>{t('common.cancel')}</Button>
        <Button disabled={busy || saving || (!prepared && !fallbackReady)} onClick={() => void apply()}>{t(saving ? 'portrait.saving' : 'portrait.save')}</Button>
      </div>
    </div>
  </Modal></div>;
}
