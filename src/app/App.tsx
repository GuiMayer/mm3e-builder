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
    </ErrorBoundary>
  )
}
