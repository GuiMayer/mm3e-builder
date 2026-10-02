import { PRESET_PALETTES, type PresetTheme } from './presetPalettes';

export const PRESET_THEMES = [
  { id: 'dark-knight', label: 'Dark Knight' }, { id: 'arc-reactor', label: 'Arc Reactor' },
  { id: 'cyberpunk', label: 'Cyberpunk' }, { id: 'light-print', label: 'Light Print' },
] as const;
export const COLOR_GROUPS = ['highlights', 'surfaces', 'text', 'borders', 'states', 'effects', 'abilities', 'categories'] as const;
export const COLOR_ROLES = [
  ['primary', 'highlights'], ['primary-hover', 'highlights'], ['primary-muted', 'highlights', true], ['accent', 'highlights'],
  ['bg', 'surfaces'], ['surface', 'surfaces'], ['surface-elevated', 'surfaces'], ['surface-glass', 'surfaces', true],
  ['text', 'text'], ['text-secondary', 'text'], ['text-muted', 'text'], ['text-inverse', 'text'],
  ['action-text', 'text'], ['danger-text', 'text'],
  ['border', 'borders', true], ['border-active', 'borders', true],
  ['success', 'states'], ['warning', 'states'], ['error', 'states'], ['info', 'states'],
  ['overlay', 'effects', true], ['shadow', 'effects', true],
  ['ability-agl', 'abilities'], ['ability-str', 'abilities'], ['ability-fgt', 'abilities'], ['ability-dex', 'abilities'],
  ['ability-pre', 'abilities'], ['ability-int', 'abilities'], ['ability-awe', 'abilities'], ['ability-sta', 'abilities'],
  ['category-attack', 'categories'], ['category-defense', 'categories'], ['category-movement', 'categories'],
  ['category-sensory', 'categories'], ['category-control', 'categories'], ['category-general', 'categories'],
] as const;
export type ColorRole = typeof COLOR_ROLES[number][0];
export interface ThemeColor { hex: string; alpha: number }
export interface CustomTheme { version: 1; baseTheme: PresetTheme; colors: Record<ColorRole, ThemeColor> }

export function isPresetTheme(value: unknown): value is PresetTheme {
  return typeof value === 'string' && Object.hasOwn(PRESET_PALETTES, value);
}
export function normalizeHex(value: string): string | null {
  const hex = value.trim().replace(/^#/, '');
  if (/^[\da-f]{3}$/i.test(hex)) return '#' + [...hex].map(c => c + c).join('').toUpperCase();
  return /^[\da-f]{6}$/i.test(hex) ? '#' + hex.toUpperCase() : null;
}
export function rgb(hex: string): number[] {
  return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
}
export function cssColor(color: ThemeColor): string {
  return color.alpha === 1 ? color.hex : `rgba(${rgb(color.hex).join(', ')}, ${color.alpha})`;
}
function parsePresetColor(value: string): ThemeColor {
  const hex = normalizeHex(value);
  if (hex) return { hex, alpha: 1 };
  const parts = value.match(/[\d.]+/g)!.map(Number);
  return { hex: '#' + parts.slice(0, 3).map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase(), alpha: parts[3] };
}
export function createCustomTheme(baseTheme: PresetTheme): CustomTheme {
  const base = PRESET_PALETTES[baseTheme];
  const extras: Record<string, string> = {
    'action-text': base['text-inverse'], 'danger-text': '#FFFFFF', overlay: 'rgba(0, 0, 0, 0.6)', shadow: 'rgba(0, 0, 0, 0.2)',
    'ability-agl': '#22D3EE', 'ability-str': '#F87171', 'ability-fgt': '#FB923C', 'ability-dex': '#60A5FA',
    'ability-pre': '#F472B6', 'ability-int': '#4ADE80', 'ability-awe': '#FBBF24', 'ability-sta': '#94A3B8',
    'category-attack': '#F87171', 'category-defense': '#60A5FA', 'category-movement': '#34D399',
    'category-sensory': '#C084FC', 'category-control': '#FBBF24', 'category-general': '#9CA3AF',
  };
  const values: Record<string, string> = { ...base, ...extras };
  return { version: 1, baseTheme, colors: Object.fromEntries(COLOR_ROLES.map(([role]) => [role, parsePresetColor(values[role])])) as CustomTheme['colors'] };
}
export function validateCustomTheme(value: unknown): CustomTheme | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Partial<CustomTheme>;
  if (input.version !== 1 || !isPresetTheme(input.baseTheme) || !input.colors || typeof input.colors !== 'object' || Array.isArray(input.colors)) return null;
  const result = createCustomTheme(input.baseTheme);
  for (const [role, , transparent] of COLOR_ROLES) {
    if (!Object.hasOwn(input.colors, role)) continue;
    const color = input.colors[role];
    if (!color || typeof color.hex !== 'string') return null;
    const hex = normalizeHex(color.hex);
    if (!hex || !Number.isFinite(color.alpha) || color.alpha < 0 || color.alpha > 1 || (!transparent && color.alpha !== 1)) return null;
    result.colors[role] = { hex, alpha: color.alpha };
  }
  return result;
}
export function themeVariables(theme: CustomTheme): Record<string, string> {
  const variables: Record<string, string> = {};
  for (const [role] of COLOR_ROLES) {
    variables[`--c-${role}`] = cssColor(theme.colors[role]);
    variables[`--c-${role}-rgb`] = rgb(theme.colors[role].hex).join(', ');
  }
  for (const role of ['success', 'warning', 'error', 'info', 'accent'] as const) {
    variables[`--c-${role}-bg`] = cssColor({ ...theme.colors[role], alpha: .15 });
  }
  variables['--c-shadow-alpha'] = String(theme.colors.shadow.alpha);
  for (const [size, blur, factor] of [['sm', '0 1px 3px', .6], ['md', '0 4px 12px', .75], ['lg', '0 8px 32px', 1], ['xl', '0 12px 40px', 1.5]] as const) {
    variables[`--shadow-${size}`] = `${blur} ${cssColor({ ...theme.colors.shadow, alpha: Math.min(1, theme.colors.shadow.alpha * factor) })}`;
  }
  return variables;
}
export function composite(foreground: ThemeColor, background: ThemeColor): ThemeColor {
  const front = rgb(foreground.hex), back = rgb(background.hex);
  return { hex: '#' + front.map((n, i) => Math.round(n * foreground.alpha + back[i] * (1 - foreground.alpha)).toString(16).padStart(2, '0')).join(''), alpha: 1 };
}
function luminance(color: ThemeColor): number {
  const channels = rgb(color.hex).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
export function contrast(foreground: ThemeColor, background: ThemeColor): number {
  const a = luminance(composite(foreground, background)), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
export function isDarkPalette(theme: CustomTheme): boolean { return luminance(theme.colors.bg) < .4; }
export function contrastIssues(theme: CustomTheme): { foreground: ColorRole; background: ColorRole; ratio: number; minimum: number }[] {
  const pairs: [ColorRole, ColorRole, number][] = [];
  for (const background of ['bg', 'surface', 'surface-elevated', 'surface-glass'] as const) {
    for (const foreground of ['text', 'text-secondary', 'text-muted', 'primary', 'accent', 'success', 'warning', 'error', 'info'] as const) pairs.push([foreground, background, 4.5]);
    pairs.push(['border', background, 3], ['border-active', background, 3], ['primary', background, 3]);
  }
  pairs.push(['action-text', 'primary', 4.5], ['action-text', 'primary-hover', 4.5], ['danger-text', 'error', 4.5]);
  return pairs.flatMap(([foreground, background, minimum]) => {
    const back = composite(theme.colors[background], theme.colors.bg);
    const ratio = contrast(theme.colors[foreground], back);
    return ratio < minimum ? [{ foreground, background, ratio, minimum }] : [];
  });
}
