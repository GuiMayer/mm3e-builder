import { validateCustomTheme, type CustomTheme } from './themeModel';

export const CUSTOM_THEME_KEY = 'mm3e-custom-theme-v1';
export interface ThemeStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export function readCustomTheme(storage: Pick<ThemeStorage, 'getItem'>): CustomTheme | null {
  try { return validateCustomTheme(JSON.parse(storage.getItem(CUSTOM_THEME_KEY) ?? 'null')); }
  catch { return null; }
}
export function writeCustomTheme(theme: CustomTheme, storage: Pick<ThemeStorage, 'setItem'>): boolean {
  const valid = validateCustomTheme(theme);
  if (!valid) return false;
  try { storage.setItem(CUSTOM_THEME_KEY, JSON.stringify(valid)); return true; }
  catch { return false; }
}
