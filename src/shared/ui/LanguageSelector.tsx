import { Globe } from 'lucide-react';

interface Language {
  id: string;
  label: string;
}

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  languages: Language[];
}

/**
 * Language selector dropdown component.
 * Displays available languages and applies the selected language.
 */
export function LanguageSelector({ language, onLanguageChange, languages }: LanguageSelectorProps) {
  return (
    <div className="menubar-setting">
      <label>
        <Globe size={14} />
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
