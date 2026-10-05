export const REFERENCE_FAVORITES_KEY = 'mm3e-reference-favorites';
let sessionFavorites = new Set<string>();

export function loadReferenceFavorites(validIds: ReadonlySet<string>, storage?: Pick<Storage, 'getItem'>): Set<string> {
  let raw: string | null;
  try {
    raw = (storage ?? localStorage).getItem(REFERENCE_FAVORITES_KEY);
  } catch {
    // A blocked store still permits favorites while navigating in this session.
    return new Set([...(!storage ? sessionFavorites : [])].filter(id => validIds.has(id)));
  }
  if (!raw) return new Set();
  try {
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== 'object' || !('version' in saved) || saved.version !== 1 ||
      !('sectionIds' in saved) || !Array.isArray(saved.sectionIds)) return new Set();
    return new Set(saved.sectionIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)));
  } catch {
    return new Set();
  }
}

export function saveReferenceFavorites(favorites: ReadonlySet<string>, storage?: Pick<Storage, 'setItem'>): void {
  if (!storage) sessionFavorites = new Set(favorites);
  try {
    (storage ?? localStorage).setItem(REFERENCE_FAVORITES_KEY, JSON.stringify({ version: 1, sectionIds: [...favorites] }));
  } catch { /* Keep favorites usable across view changes when persistence is unavailable. */ }
}
