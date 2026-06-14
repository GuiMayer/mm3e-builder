import { lazy, Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'
import { CharacterTabs } from '../features/sheet-core/CharacterTabs'
import { PDFPreviewDialog } from '../features/sheet-core/PDFPreviewDialog'
import { ErrorBoundary } from '../shared/ui/ErrorBoundary'
import { ErrorFallback } from '../shared/ui/ErrorBoundary/ErrorFallback'
import { useAutoLoadDraftMulti } from '../shared/hooks/useAutoLoadDraftMulti'
import { usePDFExport } from '../shared/hooks/usePDFExport'

const ReferencesView = lazy(() =>
  import('../features/references/ReferencesView').then((module) => ({ default: module.ReferencesView }))
);

export type AppView = 'sheet' | 'references';

export function App() {
  const { t, i18n } = useTranslation()
  const [activeView, setActiveView] = useState<AppView>('sheet');
  
  // Auto-load character tabs from localStorage on mount
  useAutoLoadDraftMulti();
  
  // PDF export with preview dialog
  const {
    isPreviewOpen,
    isGeneratingPreview,
    pdfPreviewHtml,
    pdfCharacterName,
    generateAndOpenPdf,
    downloadHtmlFromPreview,
    closePreview,
  } = usePDFExport();

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
        {activeView === 'sheet' && <CharacterTabs />}
        <ErrorBoundary
          fallback={(error) => <ErrorFallback error={error} />}
          resetKeys={[activeView]}
        >
          <main className="app-main">
            {activeView === 'sheet' ? (
              <SheetView />
            ) : (
              <Suspense fallback={<div className="panel">{t('common.loading', { defaultValue: 'Loading...' })}</div>}>
                <ReferencesView />
              </Suspense>
            )}
          </main>
        </ErrorBoundary>

        {/* PDF Preview Dialog */}
        <PDFPreviewDialog
          isOpen={isPreviewOpen}
          isGenerating={isGeneratingPreview}
          html={pdfPreviewHtml}
          characterName={pdfCharacterName}
          onClose={closePreview}
          onGeneratePdf={generateAndOpenPdf}
          onDownloadHtml={downloadHtmlFromPreview}
        />
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
