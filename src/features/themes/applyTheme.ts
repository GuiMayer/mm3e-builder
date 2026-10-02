import { PRESET_PALETTES } from './presetPalettes';
import { isDarkPalette, isPresetTheme, themeVariables, type CustomTheme } from './themeModel';

const managedProperties = new Set<string>();
export function resolvedThemeId(id: string, custom: CustomTheme | null): string {
  return id === 'custom' && custom ? 'custom' : isPresetTheme(id) ? id : 'dark-knight';
}
/** Apply only theme-owned properties, preserving unrelated document styles. */
export function applyTheme(root: HTMLElement, id: string, custom: CustomTheme | null): void {
  const selected = resolvedThemeId(id, custom);
  for (const property of managedProperties) root.style.removeProperty(property);
  managedProperties.clear();
  const variables: Record<string, string> = selected === 'custom' && custom ? themeVariables(custom) : {};
  if (isPresetTheme(selected)) {
    const palette = PRESET_PALETTES[selected];
    for (const [role, value] of Object.entries(palette)) variables[`--c-${role}`] = value;
    for (const role of ['primary', 'accent'] as const) {
      const hex = palette[role];
      variables[`--c-${role}-rgb`] = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16)).join(', ');
    }
  }
  for (const [property, value] of Object.entries(variables)) { root.style.setProperty(property, value); managedProperties.add(property); }
  root.dataset.theme = selected;
  root.style.colorScheme = selected === 'custom' && custom ? (isDarkPalette(custom) ? 'dark' : 'light') : selected === 'light-print' ? 'light' : 'dark';
}
