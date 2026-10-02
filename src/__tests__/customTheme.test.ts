import { describe, expect, it } from 'vitest';
import { PRESET_PALETTES } from '../features/themes/presetPalettes';
import { composite, contrast, createCustomTheme, normalizeHex, themeVariables, validateCustomTheme } from '../features/themes/themeModel';

describe('Custom interface palette', () => {
  it('normalizes pasted hexadecimal colors without accepting CSS expressions', () => {
    expect(normalizeHex(' abc ')).toBe('#AABBCC');
    expect(normalizeHex('#123456')).toBe('#123456');
    for (const input of ['red', '#12345', 'url(example)', 'var(--bg)', '#12345678']) expect(normalizeHex(input)).toBeNull();
  });
  it('copies each built-in palette without changing the preset records', () => {
    const before = JSON.stringify(PRESET_PALETTES);
    for (const base of Object.keys(PRESET_PALETTES) as (keyof typeof PRESET_PALETTES)[]) {
      const copy = createCustomTheme(base);
      expect(copy.colors.primary.hex).toBe(PRESET_PALETTES[base].primary.toUpperCase());
      copy.colors.primary.hex = '#123456';
    }
    expect(JSON.stringify(PRESET_PALETTES)).toBe(before);
  });
  it('restores missing roles from the base and ignores foreign properties', () => {
    const input = { version: 1, baseTheme: 'light-print', colors: { primary: { hex: '#abc', alpha: 1 }, '--evil': 'url(example)' } };
    const result = validateCustomTheme(input)!;
    expect(result.colors.primary.hex).toBe('#AABBCC');
    expect(result.colors.surface.hex).toBe('#FFFFFF');
    expect(themeVariables(result)).not.toHaveProperty('--evil');
  });
  it('rejects malformed structures, versions, colors and alpha values', () => {
    const valid = createCustomTheme('dark-knight');
    for (const invalid of [null, {}, { ...valid, version: 2 }, { ...valid, baseTheme: 'unknown' }, { ...valid, colors: [] },
      { ...valid, colors: { primary: { hex: '#fff', alpha: .5 } } }, { ...valid, colors: { border: { hex: '#fff', alpha: 2 } } }]) expect(validateCustomTheme(invalid)).toBeNull();
  });
  it('derives RGB, tinted states and shadow colors from the edited colors', () => {
    const theme = createCustomTheme('dark-knight');
    theme.colors.primary = { hex: '#123456', alpha: 1 };
    theme.colors.error = { hex: '#ABCDEF', alpha: 1 };
    const vars = themeVariables(theme);
    expect(vars['--c-primary-rgb']).toBe('18, 52, 86');
    expect(vars['--c-error-bg']).toBe('rgba(171, 205, 239, 0.15)');
    expect(vars['--shadow-lg']).toBe('0 8px 32px rgba(0, 0, 0, 0.2)');
  });
  it('measures known contrast pairs and composes transparent colors first', () => {
    const white = { hex: '#FFFFFF', alpha: 1 }, black = { hex: '#000000', alpha: 1 };
    expect(contrast(white, black)).toBe(21);
    expect(contrast(white, white)).toBe(1);
    expect(composite({ ...white, alpha: .5 }, black).hex).toBe('#808080');
    expect(contrast({ ...white, alpha: .5 }, black)).toBeCloseTo(5.317, 2);
  });
});
