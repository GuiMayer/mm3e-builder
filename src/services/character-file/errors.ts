/** Error carrying an i18n key that the UI resolves at the presentation layer. */
export class I18nError extends Error {
  i18nKey: string;
  i18nParams?: Record<string, string>;

  constructor(i18nKey: string, i18nParams?: Record<string, string>) {
    super(i18nKey);
    this.name = 'I18nError';
    this.i18nKey = i18nKey;
    this.i18nParams = i18nParams;
  }
}
