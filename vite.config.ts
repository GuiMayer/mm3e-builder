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
    // ExcelJS remains a lazy export-only chunk close to 1 MB; warn above that.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/') || id.includes('/src/entities/gameDataLoaders')) return 'game-data';
          if (id.includes('/src/locales/')) return 'locales';

          if (!id.includes('node_modules')) return;

          if (id.includes('exceljs')) return 'vendor-excel';
          if (id.includes('pdf-lib')) return 'vendor-pdf';
          if (id.includes('@dnd-kit')) return 'vendor-dnd';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
          if (id.includes('i18next')) return 'vendor-i18n';
          if (id.includes('zod')) return 'vendor-validation';
          if (id.includes('zustand')) return 'vendor-state';
          // Let the bundler preserve dynamic-import boundaries for the
          // remaining packages instead of merging them into one large chunk.
          return;
        },
      },
    },
  },
})
