import { useTranslation } from 'react-i18next';
import { Archive, Library } from 'lucide-react';
import type { AppView } from '../../app/App';

interface ViewTabsProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

/**
 * View navigation tabs component.
 * Allows switching between sheet and references views.
 */
export function ViewTabs({ activeView, onViewChange }: ViewTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="menubar-tabs">
      <button
        className={`menubar-tab ${activeView === 'sheet' ? 'menubar-tab--active' : ''}`}
        onClick={() => onViewChange('sheet')}
        aria-label={t('nav.sheet')}
      >
        <span className="menubar-tab-label--full">{t('nav.sheet')}</span>
        <span className="menubar-tab-label--compact">{t('nav.sheetCompact')}</span>
      </button>
      <button
        className={`menubar-tab ${activeView === 'resources' ? 'menubar-tab--active' : ''}`}
        onClick={() => onViewChange('resources')}
      >
        <Archive size={13} />
        {t('nav.resources')}
      </button>
      <button
        className={`menubar-tab ${activeView === 'references' ? 'menubar-tab--active' : ''}`}
        onClick={() => onViewChange('references')}
      >
        <Library size={13} />
        {t('nav.references')}
      </button>
    </div>
  );
}
