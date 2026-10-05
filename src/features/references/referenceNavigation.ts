import { filterReferenceSection, type ReferenceCategory, type ReferenceSection } from './referenceCatalog';

export type Category = 'favorites' | 'quick' | 'all' | ReferenceCategory;
const CATEGORIES: Category[] = ['quick', 'measurements', 'combat', 'conditions', 'checks', 'hero', 'all'];
export const QUICK = new Set(['measurements', 'damage', 'turn', 'checks']);

export function referenceCategories(favorites: ReadonlySet<string>): Category[] {
  return favorites.size ? ['favorites', ...CATEGORIES] : [...CATEGORIES];
}

export function selectReferenceSections(catalog: readonly ReferenceSection[], category: Category, query: string, favorites: ReadonlySet<string>): ReferenceSection[] {
  const searching = query.trim().length > 0;
  return catalog.filter(section => category === 'favorites' ? favorites.has(section.id) :
    searching || category === 'all' || (category === 'quick' ? QUICK.has(section.id) : section.category === category))
    .map(section => filterReferenceSection(section, query))
    .filter((section): section is ReferenceSection => !!section);
}
