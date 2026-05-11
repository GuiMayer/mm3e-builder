import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { IAppPreferences, IValidationRules } from '../entities/types';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';

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
  setValidationRules: (rules: Partial<IValidationRules>) => void;
  resetValidationRules: () => void;
}

export const useAppStore = create<AppStoreState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark-knight',
        strictMode: true,
        language: 'en',
        validationRules: DEFAULT_VALIDATION_RULES,

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

        setValidationRules: (rules) =>
          set((state) => ({
            validationRules: {
              ...state.validationRules,
              ...rules,
            } as IValidationRules,
          })),

        resetValidationRules: () =>
          set({
            validationRules: DEFAULT_VALIDATION_RULES,
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

