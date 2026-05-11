import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { IAppPreferences, IValidationRules } from '../entities/types';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';

/* ================================================
   App Store — Global Preferences
   Theme selection, language and validation rules.
   All preferences are persisted automatically via Zustand middleware.
   ================================================ */

interface AppStoreState extends IAppPreferences {
  setTheme: (theme: string) => void;
  setLanguage: (lang: string) => void;
  setValidationRules: (rules: Partial<IValidationRules>) => void;
  resetValidationRules: () => void;
}

export const useAppStore = create<AppStoreState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark-knight',
        language: 'en',
        validationRules: DEFAULT_VALIDATION_RULES,

        setTheme: (theme) =>
          set(() => {
            document.documentElement.setAttribute('data-theme', theme);
            return { theme };
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
        migrate: (persistedState: any) => {
          if (!persistedState) return persistedState;
          
          // Migrate from old separate language key if needed
          if (!persistedState.language) {
            const oldLang = localStorage.getItem('mm3e-language');
            if (oldLang) {
              persistedState.language = oldLang;
              localStorage.removeItem('mm3e-language');
            }
          }
          
          // Migrate strictMode to enforcePLLimits
          if (persistedState.strictMode === false) {
            if (!persistedState.validationRules) {
              persistedState.validationRules = { ...DEFAULT_VALIDATION_RULES };
            }
            persistedState.validationRules.enforcePLLimits = false;
          }
          delete persistedState.strictMode;
          
          return persistedState;
        },
      }
    ),
    { name: 'AppStore' }
  )
);

