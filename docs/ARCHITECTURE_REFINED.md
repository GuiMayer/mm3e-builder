# Refined architecture

## Product boundary

MM3E Builder is intentionally a static, local-first application. GitHub Pages
serves the compiled assets; the browser owns runtime state, persistence, and
exports. A backend, user account, remote database, and network synchronization
are outside the current product boundary.

Campaign mode is per character: fixed starting PP plus `ppLog`, independent of
current PL. Character schema 2.1.0 adds versioned campaign metadata without
replacing legacy entries. `DraftStartupController` gates loading/autosave while
old local campaign budgets are reviewed; `services/storage/campaignMigration`
saves and verifies raw backups before additive writes. Standard unused sheets
do not receive campaign metadata. See [Campaign mode](./campaign-mode.md).

## Responsibilities

### `entities`

Owns the character model, runtime schemas, default factories, and pure character
operations. Code here must not depend on React, Zustand, DOM APIs, or storage.

### `store`

Owns current UI/application state. `charactersStore` coordinates immutable tab
updates and delegates reusable character transformations to `entities`.
`resourcesStore` owns the independent Resource library and its runtime-only
history.

### `services/storage`

Owns browser persistence, draft recovery, and established localStorage keys.
All external data is validated before entering a store. Invalid drafts are
preserved rather than deleted automatically, and a failed write must not mark a
tab as persisted.

### `services/character-file`

Owns JSON import, normalization, semantic validation, sanitization, and export,
including the Resource appendix linked to a character file. The `fileService.ts`
facade remains for source compatibility; new code should import the focused
module it needs.

### `features`

Owns user workflows and presentation. Complex editors may expose a colocated
pure model module, as the Power Builder does, without moving transient editor
state into a global store. The Resource library and the Targeted Effects view
reuse the shared character-power model instead of defining parallel effect
formats.

### Export services

PDF and Excel generation remain browser-only and are loaded on demand. User
text embedded in generated HTML must pass through `escapeHtml` or `nl2br`.
The default PDF path renders once through `jsPDF.html()`; pagination may measure
a disposable DOM copy, but only a clean render tree is passed to jsPDF.

## Resource library

Resources are reusable items stored outside individual characters. Supported
types are Gadget, Gear, Vehicle, Headquarters, and Custom. A character keeps
only a link to a resource, not a second copy of it.

- `resourceId` is the stable UUID; character schema remains 2.1.0.
- Resource library/appendix version 2 adds acquisition, movement and headquarters
  context, while accepting version 1 and preserving unknown Resource fields.
- `costMode` selects Device PP or Equipment EP independently of the display type.
  `getLinkedResourceCharges` allocates free items, shared contributions and
  alternate groups for point summaries, panels, HTML PDF and Excel. Device powers
  are never duplicated in the character's power array.
- `resourceContext` supplies vehicle Strength or headquarters PL to the Builder
  and targeted profiles; Defense Systems use headquarters PL for attack bonus.
- `resourceReview` changes only explicitly reviewed ambiguous metadata.
  The first original raw library is verified before upgrade/review/replacement;
  imported v2 metadata is covered too. Review can be deferred without guessing.
- `resourceLibraryStorage` fully validates powers/features, preserves readable
  records and quarantines invalid records, refusing ordinary writes over
  unreadable/future libraries. Resource store mutations and undo/redo publish
  only after verified writes, with an original-byte guard against stale windows.
- Character imports compare matching Resource UUID contents. Keep/update/copy
  choices are staged until character identity conflicts are resolved; independent
  copies remap only incoming links. Missing references/invalid appendices fail
  before mutation. Updating shared identities affects every linked character.
- Resource JSONL manifests use version 2; whole-Draft JSONL remains version 1.
  Recovery and import backups are included in pre-update raw snapshots.

See [Resources](./resources.md) for rules, migration keys, examples, persistence
limits and export coverage. Calculation revision 6 announces corrected Resource
pricing; existing modifier warning texts and generic selection policy remain.

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
- `mm3e-resource-library`

Before a release changes persisted data, startup can capture a pre-update JSONL
snapshot. Draft loading and migration are gated until that one-time backup
prompt is resolved. Recovery copies are retained when a legacy or unreadable
draft cannot be safely replaced.

## Interface themes

Interface themes have a separate presentation boundary in `features/themes`.
The immutable built-in palettes retain their original values; one custom palette
uses `mm3e-custom-theme-v1`, independently of character/Resource storage. The
existing app preference selects its `custom` identifier only after a valid
palette is saved. A single controller applies allowed CSS variables before
rendering and on changes, removing custom overrides when a built-in theme is
selected. The editor's local draft never updates character data or export
palettes. See [custom-themes.md](./custom-themes.md).

## Temporary editing history

The session dice roller also uses runtime-only state, independently of editing
history. Its colocated `features/dice-roller/rollSessionStore` retains up to 15
results by default with a user-editable capacity. Rolls snapshot their source
and reuse existing derived bonuses; they never mutate characters or enter
Draft persistence or exports. See [dice-roller.md](./dice-roller.md).

Undo/redo is runtime-only. `charactersStore` maintains one independent history
per tab, plus a separate recent-close history. `resourcesStore` maintains its
own independent Resource-library history. Character snapshots contain only
`ICharacter` data; no history enters localStorage, JSON files, PDF, or Excel
exports.

- A history stores at most 50 past and 50 future snapshots.
- Power and equipment changes are recorded when the editor is saved, not while
  its local draft is being edited.
- Consecutive updates to the same text or numeric field are grouped for 700 ms.
- Undo and redo restore a dirty tab so the existing auto-save flow persists the
  restored character normally.
- Loading saved tabs starts a fresh history. New and duplicated tabs start
  empty.
- Closing a tab is reversible for the current browser session; restoring it
  also restores its editing history. Creating, duplicating, editing, or
  reordering tabs clears the recent-close history.

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
