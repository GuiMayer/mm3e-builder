# MM3e Builder — Future Expansions

This document records intentionally deferred work. It describes the codebase at
**v1.11.0** (2026-08-16), not the original pre-release feature plan.

The product remains a static, local-first application. A backend, user accounts,
and mandatory cloud synchronization are outside the current scope.

---

## Delivered foundation

The following former expansion areas are now part of the product and are no
longer roadmap items:

- **PDF export:** the default selectable-text HTML-to-PDF export and the
  official fillable-PDF exporter are both available.
- **Campaign PP tracking:** Campaign Mode and the PP log are available.
- **Character notes:** the character notes field is available.
- **Resource library:** Gadgets, Gear, Vehicles, Headquarters, and custom
  resources are managed outside a character and linked to it by UUID.
- **Vehicle and Headquarters basics:** structured sizes, traits, features, and
  systems/effects are available in the Resource library.
- **Draft protection:** automatic local drafts, JSONL export/import, a
  pre-update backup prompt, and recovery safeguards are available.

The Resource library intentionally keeps free/GM-granted resources visible on a
character sheet while assigning them zero EP cost. This is a table decision, not
a rules restriction imposed by the application.

---

## FX-02 · Character Illustration

**Priority:** Low

### Vision

Add an optional character illustration to the sheet header. Start with a URL so
character files stay small; any embedded-image design must account for file size
and export compatibility.

### Compatibility notes

- Add an optional `imageUrl` field to the character header and its runtime
  schema/default factory.
- Preserve the current text-only header when no image is present.
- Treat externally hosted images as optional: failed loads must fall back to the
  standard header without blocking the sheet or an export.

---

## FX-03 · Resource library enrichment

**Priority:** Medium, after real community use identifies the highest-value data
and workflows.

### Current state

The library already supports resource types, character links, EP calculations,
free/GM-granted resources, Vehicle traits, Headquarters traits, linked effects,
JSON appendices, JSONL library transfer, and PDF/Excel inclusion.

### Deferred possibilities

- Curated templates or reference data for common Gear, Vehicles, and
  Headquarters features.
- Dedicated UI controls for shared EP contributions and Alternate Equipment
  sets; the persisted link model already reserves `contributionEP` and
  `alternateSetId` for these cases.
- Richer presentation and print layouts for large Vehicle or Headquarters
  collections.

These should remain optional helpers. The current application deliberately
allows tables to decide which resources are free and does not attempt to make
arbitrary GM rulings.

---

## FX-04 · Desktop file storage and optional folder sync

**Priority:** Deferred product exploration

### Vision

A future desktop wrapper could save the same versioned draft bundle to a local
folder chosen by the user. That folder could be synchronized by Google Drive,
OneDrive, Dropbox, or another file-sync tool without introducing a project-owned
cloud backend.

### Scope boundary

- Keep the web version on `localStorage` and JSON/JSONL transfer.
- Introduce a storage adapter rather than replacing the character domain or
  current migrations.
- Use atomic local writes and backup files.
- Treat simultaneous edits on multiple devices as a file-level conflict to be
  resolved explicitly; do not add real-time collaboration or CRDTs without a
  demonstrated need.

---

## FX-05 · Rules coverage and data review

**Priority:** Ongoing

M&M 3e has broad edge-case coverage. The builder supports the current catalog,
cost models, validation, and Power Builder workflows, but rule/data verification
remains continuous work.

When expanding a rule:

1. Verify the source material and the JSON definitions.
2. Preserve compatible imported characters through normalization/migration.
3. Add calculation, validation, and import/export coverage.
4. Keep generic modifiers available by default; restrict only modifiers that
   are explicitly power-specific.

---

*Last updated: 2026-08-16 — v1.11.0 release documentation.*
