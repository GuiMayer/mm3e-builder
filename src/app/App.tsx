import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'
import { ReferencesView } from '../features/references/ReferencesView'
import { ErrorBoundary } from '../shared/ui/ErrorBoundary'
import { ErrorFallback } from '../shared/ui/ErrorBoundary/ErrorFallback'
import { useAutoLoadDraft } from '../shared/hooks/useAutoLoadDraft'

export type AppView = 'sheet' | 'references';

export function App() {
  const { t, i18n } = useTranslation()
  const [activeView, setActiveView] = useState<AppView>('sheet');
  
  // Auto-load draft from localStorage on mount
  useAutoLoadDraft();

  // Sync <html lang> and <title> with the active i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = t('app.title') + ' — ' + t('app.subtitle')
  }, [i18n.language, t])

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
