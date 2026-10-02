import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './theme.css'
import '../locales'
import { applyTheme } from '../features/themes/applyTheme'
import { useAppStore } from '../store/appStore'
import { useCustomThemeStore } from '../features/themes/customThemeStore'

applyTheme(document.documentElement, useAppStore.getState().theme, useCustomThemeStore.getState().palette);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
