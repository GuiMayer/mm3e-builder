# Refined architecture

## Product boundary

MM3E Builder is intentionally a static, local-first application. GitHub Pages
serves the compiled assets; the browser owns runtime state, persistence, and
exports. A backend, user account, remote database, and network synchronization
are outside the current product boundary.

## Responsibilities

### `entities`

Owns the character model, runtime schemas, default factories, and pure character
operations. Code here must not depend on React, Zustand, DOM APIs, or storage.

### `store`

Owns current UI/application state. Zustand actions coordinate immutable state
updates but delegate reusable character transformations to `entities`.

### `services/storage`

Owns browser persistence and established localStorage keys. All external data is
validated before entering the store. Invalid drafts are preserved rather than
deleted automatically.

### `services/character-file`

Owns JSON import, normalization, semantic validation, sanitization, and export.
The `fileService.ts` facade remains for source compatibility; new code should
import the focused module it needs.

### `features`

Owns user workflows and presentation. Complex editors may expose a colocated
pure model module, as the Power Builder does, without moving transient editor
state into a global store.

### Export services

PDF and Excel generation remain browser-only and are loaded on demand. User
text embedded in generated HTML must pass through `escapeHtml` or `nl2br`.

## Persisted character pipeline

```text
unknown JSON
  -> structural validation
  -> legacy migration
  -> current-model normalization
  -> semantic validation (file imports)
  -> application state
```

The multi-character draft keeps these public keys for compatibility:

- `mm3e-draft-characters`
- `mm3e-draft-metadata`
- `mm3e-draft-character` (legacy migration only)

## Temporary editing history

Undo/redo is a runtime-only concern owned by `charactersStore`. Each tab has an
independent history keyed by tab ID, while snapshots contain only `ICharacter`
data. History never enters localStorage, JSON files, PDF, or Excel exports.

- A history stores at most 50 past and 50 future snapshots.
- Power and equipment changes are recorded when the editor is saved, not while
  its local draft is being edited.
- Consecutive updates to the same text or numeric field are grouped for 700 ms.
- Undo and redo restore a dirty tab so the existing auto-save flow persists the
  restored character normally.
- Loading saved tabs starts a fresh history. New and duplicated tabs start
  empty; removing a tab discards its history.
- Tab creation, removal, activation, and reordering are deliberately outside
  this feature's scope.

The UI exposes buttons for all devices plus `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`,
and `Ctrl/Cmd+Y` on desktop. Shortcuts do not override native text editing or
the Power Builder's unsaved local draft.

## Adding a character field

1. Add the field to `entities/types.ts`.
2. Add its runtime representation and backward-compatible default to
   `entities/schemas.ts`.
3. Add its new-character value to `entities/characterDefaults.ts`.
4. Update import normalization only if an older shape needs migration.
5. Update JSON/PDF/Excel output where applicable.
6. Add tests for default, round-trip, migration, and affected calculations.

## Compatibility policy

- Current JSON export uses `SCHEMA_VERSION`.
- Supported historical versions remain listed in `entities/constants.ts`.
- Existing files and local drafts must be migrated, not rewritten manually.
- Structurally valid unknown versions retain the previous tolerant behavior and
  emit a warning; changing that policy requires a deliberate product decision.

## Verification gates

Every change must pass lint, strict type checking, all Vitest suites, and a
production build. Pull requests run all gates but cannot deploy. Only a push to
`main` can upload and deploy the GitHub Pages artifact.

## Deliberate non-goals

Do not introduce Redux, dependency-injection containers, repositories for every
function, a backend, IndexedDB, or a monorepo without a demonstrated product
need. Prefer functions, focused modules, and the existing libraries.
