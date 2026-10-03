import { describe, expect, it } from 'vitest';
import { loadMeasurementSystem, saveMeasurementSystem, MEASUREMENT_SYSTEM_KEY } from '../features/references/measurementPreferences';

describe('Reference measurement preference', () => {
  it('restores the saved choice regardless of the current language', () => {
    expect(loadMeasurementSystem('pt-BR', { getItem: () => 'imperial' })).toBe('imperial');
    expect(loadMeasurementSystem('en', { getItem: () => 'metric' })).toBe('metric');
  });
  it('uses language defaults for missing or invalid settings', () => {
    for (const saved of [null,'unknown','{"system":"metric"}']) {
      expect(loadMeasurementSystem('pt-BR', { getItem: () => saved })).toBe('metric');
      expect(loadMeasurementSystem('en', { getItem: () => saved })).toBe('imperial');
    }
  });
  it('round-trips only the dedicated preference key', () => {
    const stored = new Map([['mm3e-draft-characters','unchanged']]);
    saveMeasurementSystem('imperial', { setItem: (key,value) => { stored.set(key,value); } });
    expect(stored.get(MEASUREMENT_SYSTEM_KEY)).toBe('imperial');
    expect(loadMeasurementSystem('pt-BR', { getItem: key => stored.get(key) ?? null })).toBe('imperial');
    expect(stored.get('mm3e-draft-characters')).toBe('unchanged');
    expect(stored.size).toBe(2);
  });
  it.each([['pt-BR','en','metric'],['en','pt-BR','imperial']] as const)('keeps the first %s default after switching language to %s', (firstLanguage, nextLanguage, expected) => {
    const values = new Map<string,string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key,value); } };
    const initial = loadMeasurementSystem(firstLanguage, storage);
    saveMeasurementSystem(initial, storage);
    expect(loadMeasurementSystem(nextLanguage, storage)).toBe(expected);
    const chosen = expected === 'metric' ? 'imperial' : 'metric';
    saveMeasurementSystem(chosen, storage);
    expect(loadMeasurementSystem(firstLanguage, storage)).toBe(chosen);
  });
  it('keeps the view available when preference storage is blocked', () => {
    expect(loadMeasurementSystem('pt-BR', { getItem: () => { throw new Error('blocked'); } })).toBe('metric');
    expect(() => saveMeasurementSystem('imperial', { setItem: () => { throw new Error('quota'); } })).not.toThrow();
  });
});
