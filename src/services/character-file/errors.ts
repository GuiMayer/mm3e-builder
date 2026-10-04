import type { RuleDiagnostic } from '../../shared/lib/diagnostics';
/** Error carrying an i18n key that the UI resolves at the presentation layer. */
export class I18nError extends Error {
  i18nKey: string;
  i18nParams?: Record<string, string>;
  diagnostic?: RuleDiagnostic;

  constructor(i18nKey: string, i18nParams?: Record<string, string>, diagnostic?: RuleDiagnostic) {
    super(i18nKey);
    this.name = 'I18nError';
    this.i18nKey = i18nKey;
    this.i18nParams = i18nParams;
    this.diagnostic = diagnostic;
  }
}
