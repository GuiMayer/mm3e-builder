import { lazy, Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'
import { CharacterTabs } from '../features/sheet-core/CharacterTabs'
import { ErrorBoundary } from '../shared/ui/ErrorBoundary'
import { ErrorFallback } from '../shared/ui/ErrorBoundary/ErrorFallback'
import { usePDFExport } from '../shared/hooks/usePDFExport'
import { useTheme } from '../shared/hooks/useTheme'
import { AppDialogProvider } from '../shared/ui/AppDialog'
import { DraftStorageStatus } from '../shared/ui/DraftStorageStatus'
import { DraftPersistenceController } from '../shared/ui/DraftPersistenceController'
import { DraftStartupController } from '../shared/ui/DraftStartupController'
import { PointCalculationUpdateNotice } from '../shared/ui/PointCalculationUpdateNotice'
import { DiceRoller } from '../features/dice-roller/DiceRoller'
import { ResourceStorageStatus } from '../shared/ui/ResourceStorageStatus'
import { ResourceReviewController } from '../features/resources/ResourceReviewController'
import type { ResourceEditTarget } from '../shared/lib/resourcePowers'
import type { ResourceType } from '../entities/types'
import { ModifierRecoveryNotice } from '../shared/ui/ModifierRecoveryNotice'
import { useCharactersStore } from '../store/charactersStore'
import { resolveLibraryPowerSave, type LibraryPowerEdit } from '../features/power-library/libraryCharacterEditing'

const PDFPreviewDialog = lazy(() => import('../features/sheet-core/PDFPreviewDialog').then((module) => ({ default: module.PDFPreviewDialog })));
const PDFOverflowModal = lazy(() => import('../features/sheet-core/PDFOverflowModal').then((module) => ({ default: module.PDFOverflowModal })));

const ReferencesView = lazy(() =>
  import('../features/references/ReferencesView').then((module) => ({ default: module.ReferencesView }))
);
const ResourcesView = lazy(() =>
  import('../features/resources/ResourcesView').then((module) => ({ default: module.ResourcesView }))
);
const PowerLibraryView = lazy(() => import('../features/power-library/PowerLibraryView').then(module => ({ default: module.PowerLibraryView })));
const PowerBuilderOverlay = lazy(() => import('../features/power-builder/PowerBuilderOverlay').then(module => ({ default: module.PowerBuilderOverlay })));

export type AppView = 'sheet' | 'resources' | 'power-library' | 'references';

export function App() {
  const { t, i18n } = useTranslation()
  const [activeView, setActiveView] = useState<AppView>('sheet');
  const [resourceEditTarget, setResourceEditTarget] = useState<ResourceEditTarget>();
  const [resourceCreateType, setResourceCreateType] = useState<ResourceType>();
  const [powerEdit, setPowerEdit] = useState<LibraryPowerEdit | null>(null);
  const [powerEditError, setPowerEditError] = useState<string | null>(null);
  
  // PDF export with preview dialog
  const {
    exportPDF,
    isPreviewOpen,
    isGeneratingPreview,
    pdfPreviewUrl,
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
  useTheme();

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
      <ResourceStorageStatus />
      <ResourceReviewController />
      <PointCalculationUpdateNotice />
      <div className="app-root">
        <MenuBar 
          activeView={activeView} 
          onViewChange={(view) => { setResourceEditTarget(undefined); setResourceCreateType(undefined); setActiveView(view); }}
          onExportPDF={exportPDF}
          isGeneratingPreview={isGeneratingPreview}
        />
        {activeView === 'sheet' && <CharacterTabs />}
        <ErrorBoundary
          fallback={(error) => <ErrorFallback error={error} />}
          resetKeys={[activeView]}
        >
          <main className="app-main">
            <ModifierRecoveryNotice />
            {activeView === 'sheet' ? (
              <SheetView
                onEditResource={(target) => { setResourceCreateType(undefined); setResourceEditTarget(target); setActiveView('resources'); }}
                onCreateResource={(type) => { setResourceEditTarget(undefined); setResourceCreateType(type); setActiveView('resources'); }}
              />
            ) : activeView === 'resources' ? (
              <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
                <ResourcesView initialEditTarget={resourceEditTarget} initialCreateType={resourceCreateType}/>
              </Suspense>
            ) : activeView === 'power-library' ? (
              <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
                <PowerLibraryView onOpenPower={edit => {
                  const store = useCharactersStore.getState();
                  if (!store.tabs.some(tab => tab.id === edit.tabId)) return;
                  store.setActiveCharacter(edit.tabId); setPowerEditError(null); setPowerEdit(edit); setActiveView('sheet');
                }}/>
              </Suspense>
            ) : (
              <Suspense fallback={<div className="panel">{t('common.loading')}</div>}>
                <ReferencesView />
              </Suspense>
            )}
          </main>
        </ErrorBoundary>

        <DiceRoller />
        {powerEdit && <Suspense fallback={<div role="status">{t('common.loading')}</div>}>
          <PowerBuilderOverlay existingPower={powerEdit.draft} isNewPower={!powerEdit.original} sourceCharacterId={powerEdit.tabId} saveError={powerEditError} onClose={() => setPowerEdit(null)} onSave={power => {
            const store = useCharactersStore.getState();
            const next = resolveLibraryPowerSave(store.tabs, powerEdit, power);
            if (!next) { setPowerEditError('personalLibrary.stalePower'); return; }
            store.updateCharacter(powerEdit.tabId, { powers: next.powers }); setPowerEdit(null);
          }}/>
        </Suspense>}

        {isPreviewOpen && (
          <Suspense fallback={<div role="status">{t('common.loading')}</div>}>
            <PDFPreviewDialog
              isOpen={isPreviewOpen}
              isGenerating={isGeneratingPreview}
              pdfUrl={pdfPreviewUrl}
              characterName={pdfCharacterName}
              customizationOptions={customizationOptions}
              onCustomizationChange={handleCustomizationChange}
              onClose={closePreview}
              onGeneratePdf={generateAndOpenPdf}
              onDownloadHtml={downloadHtmlFromPreview}
            />
          </Suspense>
        )}
        {pdfOverflow.length > 0 && (
          <Suspense fallback={<div role="status">{t('common.loading')}</div>}>
            <PDFOverflowModal
              report={pdfOverflow}
              onConfirm={confirmAndExportPDF}
              onCancel={clearOverflow}
            />
          </Suspense>
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
