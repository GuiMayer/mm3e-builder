import { create } from 'zustand';
import type { IAppPreferences } from '../entities/types';

/* ================================================
   App Store — Global Preferences
   Theme selection, strict mode toggle, language and other flags.
   ================================================ */

interface AppStoreState extends IAppPreferences {
  language: string;
  setTheme: (theme: string) => void;
  toggleStrictMode: () => void;
  setStrictMode: (value: boolean) => void;
  setLanguage: (lang: string) => void;
}

const STORAGE_KEY = 'mm3e-app-preferences';

function loadPreferences(): IAppPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { theme: 'dark-knight', strictMode: true };
}

function savePreferences(prefs: IAppPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore quota errors */ }
}

const initial = loadPreferences();
const initialLanguage = localStorage.getItem('mm3e-language') || 'en';

export const useAppStore = create<AppStoreState>((set) => ({
  theme: initial.theme,
  strictMode: initial.strictMode,
  language: initialLanguage,

  setTheme: (theme) =>
    set((state) => {
      const next = { ...state, theme };
      savePreferences({ theme: next.theme, strictMode: next.strictMode });
      document.documentElement.setAttribute('data-theme', theme);
      return { theme };
    }),

  toggleStrictMode: () =>
    set((state) => {
      const strictMode = !state.strictMode;
      savePreferences({ theme: state.theme, strictMode });
      return { strictMode };
    }),

  setStrictMode: (value) =>
    set((state) => {
      savePreferences({ theme: state.theme, strictMode: value });
      return { strictMode: value };
    }),
    
  setLanguage: (language) => 
    set(() => {
      localStorage.setItem('mm3e-language', language);
      return { language };
    }),
}));
