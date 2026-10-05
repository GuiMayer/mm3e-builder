export const REFERENCE_FAVORITES_KEY = 'mm3e-reference-favorites';

export function loadReferenceFavorites(validIds: ReadonlySet<string>, storage?: Pick<Storage, 'getItem'>): Set<string> {
  try {
    const raw = (storage ?? localStorage).getItem(REFERENCE_FAVORITES_KEY);
    if (!raw) return new Set();
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== 'object' || !('version' in saved) || saved.version !== 1 ||
      !('sectionIds' in saved) || !Array.isArray(saved.sectionIds)) return new Set();
    return new Set(saved.sectionIds.filter((id): id is string => typeof id === 'string' && validIds.has(id)));
  } catch {
    // Consultation remains available if storage is blocked or its contents are invalid.
    return new Set();
  }
}

export function saveReferenceFavorites(favorites: ReadonlySet<string>, storage?: Pick<Storage, 'setItem'>): void {
  try {
    (storage ?? localStorage).setItem(REFERENCE_FAVORITES_KEY, JSON.stringify({ version: 1, sectionIds: [...favorites] }));
  } catch { /* Keep favorites usable in the mounted view when persistence is unavailable. */ }
}
