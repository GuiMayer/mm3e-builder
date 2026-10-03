import { describe, expect, it } from 'vitest';
import { createInstance } from 'i18next';
import { formatMeasure } from '../features/references/measurements';
import english from '../locales/en/translation.json';
import portuguese from '../locales/pt-BR/translation.json';

describe('Reference localization', () => {
  it('formats localized units and singular/plural result messages', async () => {
    const i18n = createInstance();
    await i18n.init({ lng: 'pt-BR', keySeparator: false, resources: { en: { translation: english }, 'pt-BR': { translation: portuguese } } });
    expect(formatMeasure([1,'week'], 'pt-BR', (unit,count) => i18n.t(`ref119.unit.${unit}`, { count }))).toBe('1 semana');
    expect(i18n.t('ref119.failure', { count: 1 })).toBe('1 grau de falha');
    expect(i18n.t('ref119.failure', { count: 2 })).toBe('2 graus de falha');
    expect(i18n.t('ref119.success', { count: 1, lng: 'en' })).toBe('1 degree of success');
  });
});
