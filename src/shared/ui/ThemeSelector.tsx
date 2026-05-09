import { Sun, Moon } from 'lucide-react';

interface Theme {
  id: string;
  label: string;
}

interface ThemeSelectorProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  themes: Theme[];
}

/**
 * Theme selector dropdown component.
 * Displays available themes and applies the selected theme.
 */
export function ThemeSelector({ theme, onThemeChange, themes }: ThemeSelectorProps) {
  const isDark = theme !== 'light-print';

  return (
    <div className="menubar-setting">
      <label>
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
        <select value={theme} onChange={(e) => onThemeChange(e.target.value)}>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
