/** Compare displayed names using the active language, ignoring case and accents. */
export function createNameComparator(language: string) {
  const collator = new Intl.Collator(language, { usage: 'sort', sensitivity: 'base', numeric: true });
  return (first: { name: string }, second: { name: string }) => collator.compare(first.name, second.name);
}

/** Sort a presentation copy so catalog and character data retain their order. */
export function sortByDisplayName<T extends { name: string }>(items: readonly T[], language: string): T[] {
  return [...items].sort(createNameComparator(language));
}
