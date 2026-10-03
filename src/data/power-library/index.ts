import type { LibraryText, PowerTemplate } from '../../features/power-library/types';
export { POWER_PROFILES } from './profiles';
export { POWER_LIBRARY_INDEX } from './catalogIndex';
export interface LibraryEntry {
  id: string; profileId: string; name: LibraryText; section: LibraryText;
  summary: LibraryText; page: number; effectIds: string[];
}
const profiles = import.meta.glob<PowerTemplate[]>('./profiles/*.ts', { import: 'default' });
const cache = new Map<string, Promise<PowerTemplate[]>>();
export function loadPowerProfile(id: string): Promise<PowerTemplate[]> {
  const loader = profiles[`./profiles/${id}.ts`];
  if (!loader) return Promise.reject(new Error('Unknown power profile'));
  if (!cache.has(id)) {
    cache.set(id, loader().catch(error => { cache.delete(id); throw error; }));
  }
  return cache.get(id)!;
}
export function searchLibrary(entries: LibraryEntry[], query: string, profileId: string, language: string): LibraryEntry[] {
  const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase();
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return entries.filter(entry => (!profileId || entry.profileId === profileId) && words.every(word => normalize([
    entry.name.en, entry.name.pt, entry.summary.en, entry.summary.pt, ...entry.effectIds,
  ].join(' ')).includes(word))).sort((a, b) =>
    (language.startsWith('pt') ? a.name.pt : a.name.en).localeCompare(language.startsWith('pt') ? b.name.pt : b.name.en, language));
}
