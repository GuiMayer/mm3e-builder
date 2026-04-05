import { create } from 'zustand';
import type { IAppPreferences } from '../entities/types';

/* ================================================
   App Store — Global Preferences
   Theme selection, strict mode toggle, language and other flags.
   All preferences are persisted under a single localStorage key.
   ================================================ */

interface AppStoreState extends IAppPreferences {
  setTheme: (theme: string) => void;
  toggleStrictMode: () => void;
  setStrictMode: (value: boolean) => void;
  setLanguage: (lang: string) => void;
}

const STORAGE_KEY = 'mm3e-app-preferences';

function loadPreferences(): IAppPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<IAppPreferences>;
      return {
        theme: parsed.theme ?? 'dark-knight',
        strictMode: parsed.strictMode ?? true,
        // Migrate: read from old separate key if not present in preferences yet
        language: parsed.language ?? localStorage.getItem('mm3e-language') ?? 'en',
      };
    }
  } catch { /* ignore */ }
  return { theme: 'dark-knight', strictMode: true, language: 'en' };
}

function savePreferences(prefs: IAppPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore quota errors */ }
}

const initial = loadPreferences();

export const useAppStore = create<AppStoreState>((set) => ({
  theme: initial.theme,
  strictMode: initial.strictMode,
  language: initial.language,

  setTheme: (theme) =>
    set((state) => {
      const next: IAppPreferences = { theme, strictMode: state.strictMode, language: state.language };
      savePreferences(next);
      document.documentElement.setAttribute('data-theme', theme);
      return { theme };
    }),

  toggleStrictMode: () =>
    set((state) => {
      const strictMode = !state.strictMode;
      savePreferences({ theme: state.theme, strictMode, language: state.language });
      return { strictMode };
    }),

  setStrictMode: (value) =>
    set((state) => {
      savePreferences({ theme: state.theme, strictMode: value, language: state.language });
      return { strictMode: value };
    }),

  setLanguage: (language) =>
    set((state) => {
      savePreferences({ theme: state.theme, strictMode: state.strictMode, language });
      return { language };
    }),
}));

