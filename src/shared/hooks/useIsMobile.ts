import { useSyncExternalStore } from 'react';

const query = '(max-width: 768px)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
/** Match the CSS breakpoint so hidden palettes never register duplicate drag items. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
