# Architecture refactor baseline

This document records the functional and technical baseline that must remain
stable while the codebase is reorganized.

## Product invariants

- The application remains a static, client-only application deployable to GitHub Pages.
- Characters remain stored locally in `localStorage`.
- Existing character JSON files remain importable.
- JSON, PDF, and Excel exports keep their current user-visible behavior.
- Multi-character tabs, autosave, language, theme, and validation preferences remain supported.
- No backend, account, remote database, or network dependency is introduced.

## Verification baseline

Captured before the refactor:

- ESLint: passing.
- TypeScript: passing in strict mode.
- Vitest: 25 files passing, 523 tests passing, 16 tests marked TODO.
- Production build: passing.
- Main Power Builder chunk: approximately 84 kB minified.
- Excel vendor chunk: approximately 930 kB minified and loaded separately.
- Generic vendor chunk: approximately 1.57 MB minified.

## Required regression checks

Every architectural phase must pass:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test -- --run`
4. `npm run build`

Before release, manually verify:

1. Create, edit, duplicate, reorder, and remove character tabs.
2. Reload the page and restore the autosaved draft and active tab.
3. Export JSON and import the exported file again.
4. Import representative legacy JSON files.
5. Create and edit powers, modifiers, alternate effects, and equipment.
6. Export PDF with both supported renderers.
7. Export the Excel workbook.
8. Change language, theme, and validation preferences.
9. Open the production build from a repository-relative base path.

