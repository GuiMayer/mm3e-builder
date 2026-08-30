import { lazy, Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'
import { CharacterTabs } from '../features/sheet-core/CharacterTabs'
import { PDFPreviewDialog } from '../features/sheet-core/PDFPreviewDialog'
import { PDFOverflowModal } from '../features/sheet-core/PDFOverflowModal'
import { ErrorBoundary } from '../shared/ui/ErrorBoundary'
import { ErrorFallback } from '../shared/ui/ErrorBoundary/ErrorFallback'
import { usePDFExport } from '../shared/hooks/usePDFExport'
import { useAppStore } from '../store/appStore'
import { AppDialogProvider } from '../shared/ui/AppDialog'
import { DraftStorageStatus } from '../shared/ui/DraftStorageStatus'
import { DraftPersistenceController } from '../shared/ui/DraftPersistenceController'
import { DraftStartupController } from '../shared/ui/DraftStartupController'
import { PointCalculationUpdateNotice } from '../shared/ui/PointCalculationUpdateNotice'

const ReferencesView = lazy(() =>
  import('../features/references/ReferencesView').then((module) => ({ default: module.ReferencesView }))
);
const ResourcesView = lazy(() =>
  import('../features/resources/ResourcesView').then((module) => ({ default: module.ResourcesView }))
);

export type AppView = 'sheet' | 'resources' | 'references';

export function App() {
  const { t, i18n } = useTranslation()
  const [activeView, setActiveView] = useState<AppView>('sheet');
  
  // PDF export with preview dialog
  const {
    exportPDF,
    isPreviewOpen,
    isGeneratingPreview,
    pdfPreviewHtml,
    pdfCharacterName,
    customizationOptions,
    handleCustomizationChange,
    generateAndOpenPdf,
    downloadHtmlFromPreview,
    closePreview,
    pdfOverflow,
    confirmAndExportPDF,
    clearOverflow,
  } = usePDFExport();

  // Sync <html lang> and <title> with the active i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = t('app.title') + ' — ' + t('app.subtitle')
  }, [i18n.language, t])

  // Apply persisted theme on mount and changes
  const theme = useAppStore(state => state.theme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
      <AppDialogProvider>
      <DraftStartupController />
      <DraftPersistenceController />
      <DraftStorageStatus />
      <PointCalculationUpdateNotice />
      <div className="app-root">
        <MenuBar 
          activeView={activeView} 
          onViewChange={setActiveView}
          onExportPDF={exportPDF}
          isGeneratingPreview={isGeneratingPreview}
        />
        {activeView === 'sheet' && <CharacterTabs />}
        <ErrorBoundary
          fallback={(error) => <ErrorFallback error={error} />}
          resetKeys={[activeView]}
        >
          <main className="app-main">
            {activeView === 'sheet' ? (
              <SheetView />
            ) : activeView === 'resources' ? (
              <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
                <ResourcesView />
              </Suspense>
            ) : (
              <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
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
          customizationOptions={customizationOptions}
          onCustomizationChange={handleCustomizationChange}
          onClose={closePreview}
          onGeneratePdf={generateAndOpenPdf}
          onDownloadHtml={downloadHtmlFromPreview}
        />

        {/* PDF Overflow Modal */}
        {pdfOverflow.length > 0 && (
          <PDFOverflowModal
            report={pdfOverflow}
            onConfirm={confirmAndExportPDF}
            onCancel={clearOverflow}
          />
        )}
      </div>
      </AppDialogProvider>

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
