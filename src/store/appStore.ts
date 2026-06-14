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
  setUseLegacyPdfExporter: (value: boolean) => void;
}

export const useAppStore = create<AppStoreState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark-knight',
        language: 'en',
        validationRules: DEFAULT_VALIDATION_RULES,
        useLegacyPdfExporter: false,

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

        setUseLegacyPdfExporter: (value) =>
          set({
            useLegacyPdfExporter: value,
          }),
      }),
      {
        name: 'mm3e-app-preferences',
        migrate: (persistedState: unknown) => {
          if (!persistedState) return persistedState;
          const state = persistedState as {
            language?: string;
            strictMode?: boolean;
            validationRules?: Partial<IValidationRules>;
            useLegacyPdfExporter?: boolean;
          };
          
          // Migrate from old separate language key if needed
          if (!state.language) {
            const oldLang = localStorage.getItem('mm3e-language');
            if (oldLang) {
              state.language = oldLang;
              localStorage.removeItem('mm3e-language');
            }
          }
          
          // Migrate strictMode to enforcePLLimits
          if (state.strictMode === false) {
            if (!state.validationRules) {
              state.validationRules = { ...DEFAULT_VALIDATION_RULES };
            }
            state.validationRules.enforcePLLimits = false;
          }
          delete state.strictMode;
          
          // Ensure useLegacyPdfExporter has default value
          if (!('useLegacyPdfExporter' in state)) {
            state.useLegacyPdfExporter = false;
          }
          
          return state;
        },
      }
    ),
    { name: 'AppStore' }
  )
);
