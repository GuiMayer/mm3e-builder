import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'
import { ReferencesView } from '../features/references/ReferencesView'
import { ErrorBoundary } from '../shared/ui/ErrorBoundary'
import { ErrorFallback } from '../shared/ui/ErrorBoundary/ErrorFallback'
import { useAutoLoadDraft } from '../shared/hooks/useAutoLoadDraft'
import { DraftNotification } from '../shared/ui/DraftNotification'
import { useCharStore } from '../store/charStore'
import { clearDraft } from '../services/fileService'

export type AppView = 'sheet' | 'references';

export function App() {
  const { t, i18n } = useTranslation()
  const [activeView, setActiveView] = useState<AppView>('sheet');
  const resetCharacter = useCharStore((s) => s.resetCharacter);
  
  // Auto-load draft from localStorage on mount
  const draftInfo = useAutoLoadDraft();
  const [showDraftNotification, setShowDraftNotification] = useState(false);

  // Show notification when draft is loaded
  useEffect(() => {
    if (draftInfo.loaded && draftInfo.character) {
      setShowDraftNotification(true);
    }
  }, [draftInfo.loaded, draftInfo.character]);

  // Sync <html lang> and <title> with the active i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = t('app.title') + ' — ' + t('app.subtitle')
  }, [i18n.language, t])

  const handleDismissNotification = () => {
    setShowDraftNotification(false);
  };

  const handleStartNew = () => {
    clearDraft();
    resetCharacter();
    setShowDraftNotification(false);
  };

  return (
    <ErrorBoundary
      fallback={(error) => <ErrorFallback error={error} />}
      onError={(error, errorInfo) => {
        // Log errors in development
        if (import.meta.env.DEV) {
          console.error('App Error Boundary caught:', error, errorInfo);
        }
      }}
    >
      <div className="app-root">
        {showDraftNotification && draftInfo.character && (
          <DraftNotification
            character={draftInfo.character}
            onDismiss={handleDismissNotification}
            onStartNew={handleStartNew}
          />
        )}
        <MenuBar activeView={activeView} onViewChange={setActiveView} />
        <ErrorBoundary
          fallback={(error) => <ErrorFallback error={error} />}
          resetKeys={[activeView]}
        >
          <main className="app-main">
            {activeView === 'sheet' ? <SheetView /> : <ReferencesView />}
          </main>
        </ErrorBoundary>
      </div>

      <style>{`
        /* Global mobile UX improvements */
        @media (max-width: 768px) {
          /* Smooth scrolling for better UX */
          html {
            scroll-behavior: smooth;
          }

          /* Optimize touch scrolling */
          * {
            -webkit-overflow-scrolling: touch;
          }

          /* Prevent text size adjustment on orientation change */
          html {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
          }

          /* Improve tap highlight */
          * {
            -webkit-tap-highlight-color: rgba(var(--c-primary-rgb, 59, 130, 246), 0.1);
          }

          /* Better focus visibility for keyboard navigation */
          *:focus-visible {
            outline: 2px solid var(--c-primary);
            outline-offset: 2px;
          }

          /* Optimize app-main padding for mobile */
          .app-main {
            padding: var(--s-sm);
          }
        }
      `}</style>
    </ErrorBoundary>
  )
}
