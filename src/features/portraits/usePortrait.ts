import { useEffect, useState, useSyncExternalStore } from 'react';
import { getPortrait, portraitRevision, subscribePortraits } from '../../services/storage/portraitStorage';
import { resolvePortrait } from '../../services/portraits/portraitImages';

export function usePortrait(characterId?: string, url?: string) {
  const revision = useSyncExternalStore(subscribePortraits, portraitRevision);
  const key = `${characterId ?? ''}|${url ?? ''}|${revision}`;
  const [state, setState] = useState<{ key: string; thumbnail?: string; image?: string; local: boolean; cached: boolean }>({ key: '', local: false, cached: false });
  useEffect(() => {
    const controller = new AbortController();
    const objects: string[] = [];
    void (async () => {
      let thumbnail: string | undefined;
      let image: string | undefined;
      let cached = false;
      try {
        const media = await resolvePortrait(characterId, url, controller.signal);
        if (controller.signal.aborted) return;
        if (media) {
          thumbnail = URL.createObjectURL(media.thumbnail);
          image = URL.createObjectURL(media.image);
          objects.push(thumbnail, image);
          cached = Boolean(await getPortrait(characterId, url).catch(() => undefined));
        }
      } catch { /* Display-only fallback for servers without CORS permission. */ }
      if (!controller.signal.aborted) setState({ key, thumbnail: thumbnail ?? url, image: image ?? url, local: Boolean(image && !url), cached });
    })();
    return () => { controller.abort(); objects.forEach(object => URL.revokeObjectURL(object)); };
  }, [characterId, url, key]);
  return state.key === key ? state : { key, thumbnail: undefined, image: undefined, local: false, cached: false };
}

export function useBlobUrl(blob?: Blob) {
  const [state, setState] = useState<{ blob?: Blob; url?: string }>({});
  useEffect(() => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    // Keep URL creation out of render and revoke on replacement/unmount.
    queueMicrotask(() => setState({ blob, url }));
    return () => URL.revokeObjectURL(url);
  }, [blob]);
  return state.blob === blob ? state.url : undefined;
}
