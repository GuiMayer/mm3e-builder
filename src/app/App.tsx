import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuBar } from '../shared/ui/MenuBar'
import { SheetView } from '../features/sheet-core/SheetView'

export function App() {
  const { t, i18n } = useTranslation()

  // Sync <html lang> and <title> with the active i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = t('app.title') + ' — ' + t('app.subtitle')
  }, [i18n.language, t])

  return (
    <div className="app-root">
      <MenuBar />
      <main className="app-main">
        <SheetView />
      </main>
    </div>
  )
}
