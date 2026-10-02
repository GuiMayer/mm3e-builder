import { Sun, Moon, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCustomThemeStore } from '../../features/themes/customThemeStore';
import { isDarkPalette } from '../../features/themes/themeModel';
import { resolvedThemeId } from '../../features/themes/applyTheme';
import '../../features/themes/customTheme.css';

interface Theme {
  id: string;
  label: string;
}

interface ThemeSelectorProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  themes: Theme[];
  onCustomize: () => void;
}

/**
 * Theme selector dropdown component.
 * Displays available themes and applies the selected theme.
 */
export function ThemeSelector({ theme, onThemeChange, themes, onCustomize }: ThemeSelectorProps) {
  const { t } = useTranslation();
  const palette = useCustomThemeStore(s => s.palette);
  const selected = resolvedThemeId(theme, palette);
  const isDark = selected === 'custom' && palette ? isDarkPalette(palette) : selected !== 'light-print';
  const options = palette ? [...themes, { id: 'custom', label: t('theme.custom') }] : themes;

  return (
    <div className="theme-selector-row"><div className="menubar-setting">
      <label>
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
        <select aria-label={t('menu.theme')} value={selected} onChange={(e) => onThemeChange(e.target.value)}>
          {options.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
    </div><button className="theme-custom-button" type="button" aria-label={t('theme.customize')} title={t('theme.customize')} onClick={onCustomize}><Palette size={20} /></button></div>
  );
}
