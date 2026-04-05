import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'
import { ReferencesView } from '../features/references/ReferencesView'

export type AppView = 'sheet' | 'references';

export function App() {
  const { t, i18n } = useTranslation()
  const [activeView, setActiveView] = useState<AppView>('sheet');

  // Sync <html lang> and <title> with the active i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = t('app.title') + ' — ' + t('app.subtitle')
  }, [i18n.language, t])

  return (
    <div className="app-root">
      <MenuBar activeView={activeView} onViewChange={setActiveView} />
      <main className="app-main">
        {activeView === 'sheet' ? <SheetView /> : <ReferencesView />}
      </main>
    </div>
  )
}
