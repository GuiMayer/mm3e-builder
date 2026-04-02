import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface I18nData {
  name: string;
  description?: string;
  i18n?: Record<string, any>;
}

/**
 * Resolves name and description based on the active i18next language.
 * Falls back to the root fields (English).
 */
export function useLocalizedData<T extends I18nData>(items: T[]): T[] {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return useMemo(() =>
    items.map((item) => {
      const localized = item.i18n?.[lang];
      return {
        ...item,
        name: localized?.name ?? item.name,
        description: localized?.description ?? item.description,
      };
    }),
    [items, lang]
  );
}
