import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createNameComparator, sortByDisplayName } from '../lib/alphabeticalOrder';

export function useNameComparator() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return useMemo(() => createNameComparator(language), [language]);
}

export function useAlphabeticalList<T extends { name: string }>(items: readonly T[]): T[] {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return useMemo(() => sortByDisplayName(items, language), [items, language]);
}
