import { describe, expect, it } from 'vitest';
import { CUSTOM_THEME_KEY, readCustomTheme, writeCustomTheme } from '../features/themes/themeStorage';
import { createCustomTheme } from '../features/themes/themeModel';
import { applyTheme, resolvedThemeId } from '../features/themes/applyTheme';

describe('Custom theme persistence and application', () => {
  it('writes only the dedicated theme key and restores the saved colors', () => {
    const values = new Map([['mm3e-draft-characters', 'unchanged sheet'], ['mm3e-app-preferences', 'unchanged preferences']]);
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
    const palette = createCustomTheme('light-print');
    palette.colors.primary.hex = '#123456';
    expect(writeCustomTheme(palette, storage)).toBe(true);
    expect(readCustomTheme(storage)).toEqual(palette);
    expect(values.get('mm3e-draft-characters')).toBe('unchanged sheet');
    expect(values.get('mm3e-app-preferences')).toBe('unchanged preferences');
    expect([...values.keys()]).toEqual(['mm3e-draft-characters', 'mm3e-app-preferences', CUSTOM_THEME_KEY]);
  });
  it('handles malformed JSON and blocked reads or writes without throwing', () => {
    expect(readCustomTheme({ getItem: () => '{bad' })).toBeNull();
    expect(readCustomTheme({ getItem: () => { throw new Error('blocked'); } })).toBeNull();
    expect(writeCustomTheme(createCustomTheme('dark-knight'), { setItem: () => { throw new Error('quota'); } })).toBe(false);
  });
  it('falls back when custom is missing or a theme identifier is unknown', () => {
    expect(resolvedThemeId('custom', null)).toBe('dark-knight');
    expect(resolvedThemeId('unknown', null)).toBe('dark-knight');
    expect(resolvedThemeId('custom', createCustomTheme('dark-knight'))).toBe('custom');
  });
  it('removes custom-only overrides when returning to an unchanged built-in palette', () => {
    const values = new Map<string, string>([['--unrelated', 'keep']]);
    const root = { dataset: {}, style: { setProperty: (key: string, value: string) => values.set(key, value), removeProperty: (key: string) => values.delete(key) } } as unknown as HTMLElement;
    const custom = createCustomTheme('dark-knight');
    custom.colors.primary.hex = '#123456';
    applyTheme(root, 'custom', custom);
    expect(values.get('--c-primary')).toBe('#123456');
    expect(values.has('--c-overlay')).toBe(true);
    applyTheme(root, 'light-print', custom);
    expect(values.get('--c-primary')).toBe('#2563EB');
    expect(values.has('--c-overlay')).toBe(false);
    expect(values.has('--c-success-rgb')).toBe(false);
    expect(values.get('--unrelated')).toBe('keep');
    expect(root.dataset.theme).toBe('light-print');
  });
});
