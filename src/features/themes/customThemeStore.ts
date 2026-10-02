import { create } from 'zustand';
import { readCustomTheme, writeCustomTheme } from './themeStorage';
import { validateCustomTheme, type CustomTheme } from './themeModel';

function load(): CustomTheme | null {
  try { return readCustomTheme(localStorage); } catch { return null; }
}
export const useCustomThemeStore = create<{
  palette: CustomTheme | null;
  save: (palette: CustomTheme) => boolean;
}>((set) => ({
  palette: load(),
  save: palette => {
    try {
      const valid = validateCustomTheme(palette);
      if (!valid || !writeCustomTheme(valid, localStorage)) return false;
      set({ palette: valid });
      return true;
    } catch { return false; }
  },
}));
