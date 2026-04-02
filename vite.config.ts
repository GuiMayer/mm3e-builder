import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages: use relative paths so assets load from /repo-name/
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
