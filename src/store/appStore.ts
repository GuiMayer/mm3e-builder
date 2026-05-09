import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { IAppPreferences } from '../entities/types';

/* ================================================
   App Store — Global Preferences
   Theme selection, strict mode toggle, language and other flags.
   All preferences are persisted automatically via Zustand middleware.
   ================================================ */

interface AppStoreState extends IAppPreferences {
  setTheme: (theme: string) => void;
  toggleStrictMode: () => void;
  setStrictMode: (value: boolean) => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create<AppStoreState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark-knight',
        strictMode: true,
        language: 'en',

        setTheme: (theme) =>
          set(() => {
            document.documentElement.setAttribute('data-theme', theme);
            return { theme };
          }),

        toggleStrictMode: () =>
          set((state) => ({
            strictMode: !state.strictMode,
          })),

        setStrictMode: (value) =>
          set({
            strictMode: value,
          }),

        setLanguage: (language) =>
          set({
            language,
          }),
      }),
      {
        name: 'mm3e-app-preferences',
        // Migrate from old separate language key if needed
        migrate: (persistedState: any) => {
          if (persistedState && !persistedState.language) {
            const oldLang = localStorage.getItem('mm3e-language');
            if (oldLang) {
              persistedState.language = oldLang;
              localStorage.removeItem('mm3e-language');
            }
          }
          return persistedState;
        },
      }
    ),
    { name: 'AppStore' }
  )
);

