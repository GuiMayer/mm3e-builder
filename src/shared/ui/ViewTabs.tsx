import { useTranslation } from 'react-i18next';
import { Library } from 'lucide-react';
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
      >
        {t('nav.sheet', { defaultValue: 'Sheet' })}
      </button>
      <button
        className={`menubar-tab ${activeView === 'references' ? 'menubar-tab--active' : ''}`}
        onClick={() => onViewChange('references')}
      >
        <Library size={13} />
        {t('nav.references', { defaultValue: 'References' })}
      </button>

      <style>{`
        /* Mobile optimizations for ViewTabs */
        @media (max-width: 768px) {
          .menubar-tabs {
            padding: 1px;
          }
          .menubar-tab {
            padding: 4px var(--s-xs);
            font-size: 0.7rem;
            min-height: 32px;
          }
          .menubar-tab svg {
            width: 11px;
            height: 11px;
          }
        }
      `}</style>
    </div>
  );
}
