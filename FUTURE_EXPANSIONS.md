# MM3e Builder — Future Expansions

This file documents features that are **intentionally deferred** from the current implementation scope.
Each item includes the rationale for deferral, the UX vision, and the architecture notes needed
for the current code to remain compatible when the feature is eventually implemented.

---

## FX-01 · PDF Export — Character Sheet

**Priority when tackled:** High
**Effort estimate:** ~24h (new service + document layout)

### Vision
Generate a print-ready `.pdf` file of the full character sheet — text-selectable, styled for A4,
suitable for use at the table without a laptop.

### UX
- Button in the MenuBar Export group, alongside the existing JSON and Excel buttons.
- Generates and downloads directly in the browser (no backend required).
- Layout: clean, light background (print-optimized), regardless of active app theme.
- Multi-page A4. Page breaks between major sections (abilities/defenses, skills, powers, equipment).
- All sections visible: Offense panel, Initiative, Toughness breakdown, Equipment notes.

### Technology decision
`@react-pdf/renderer` — client-side, declarative Flexbox layout, produces text-selectable PDF.
No Puppeteer (requires backend). No jsPDF (screenshot-based, non-selectable text).

### Architecture compatibility requirements (already enforced in current codebase)
The following decisions made during the current implementation cycle **intentionally preserve**
PDF compatibility:

| Decision | Why it matters for PDF |
|---|---|
| All calculation logic in pure functions in `mathEngine.ts` | PDF generator can call the same functions without React hooks |
| `ExportLabels` interface in `excelGenerator.ts` | PDF generator will reuse the same `PDFLabels` pattern (labels passed in, not fetched inside) |
| `downloadBlob` supports any MIME type | Adding `.pdf` entry requires only 2 lines |
| `gameDataLoaders.ts` as single import point | PDF generator imports game data from the same source |
| `ICharacter` shape is stable and versioned | PDF generator receives one `ICharacter` object — no additional fetching |

### Files to create when implemented
- `src/services/pdfGenerator.tsx` — React-PDF document component
- `src/locales/en/translation.json` + `pt-BR` — `"menu.exportPdf"`, `"pdf.title"` keys
- `src/services/downloadHelper.ts` — add `pdf` entry to `FILE_TYPES`
- `src/shared/ui/MenuBar.tsx` — add PDF button

---

## FX-02 · Character Notes & Illustration

**Priority when tackled:** Low
**Effort estimate:** ~4h

### Vision
- **Notes:** A free-form `<textarea>` panel at the bottom of the sheet (after Complications),
  labelled "Notes & Background". Stores character background, GM notes, session history.
  Field: `character.notes: string`.

- **Character Illustration:** An avatar/image area in `HeaderPanel` (the existing `<User>` icon placeholder).
  Strategy: **URL-based first** (`header.imageUrl?: string` — user pastes an image link).
  Base64 in-save encoding is v1.2+ only (file size concerns).
  When set, the URL renders as a 64×64 thumbnail in the header with a click-to-expand modal.

### Architecture note
`ICharacter` will gain `notes?: string`.
`ICharacterHeader` will gain `imageUrl?: string`.
Both fields are **optional with `?`** so existing save files remain valid (no migration needed).
The PDF generator will render `notes` in an appendix page and `imageUrl` as a header image if present.

---

## FX-03 · Full Equipment System (Vehicles & Headquarters)

**Priority when tackled:** Medium (post-v1.0)
**Effort estimate:** ~20h

### Current implementation (v1.0)
Equipment is implemented as a single **free-text block** (`character.equipmentNotes: string`),
preserving content without any structure. This is sufficient for recording what a character carries.
See current `EquipmentNotesPanel` component.

### Full vision (v1.1+)

**Equipment Items:**
Structured list of items purchased with Equipment Points (EP), derived from the Equipment advantage
(`EP budget = ranks × 5`). Each item has `name`, `description`, `epCost`.

**Vehicles:**
Standard M&M 3e vehicle stat block: Size, Strength, Speed, Defense, Toughness.
Each vehicle has its own sub-sheet similar to a character sheet section.

**Headquarters:**
M&M 3e HQ schema: Size, Toughness, EP-based feature checklist
(Communications, Computer, Defense System, Dock, Garage, Gym, Hangar, Infirmary, Laboratory,
Living Space, Personnel, Pool, Power System, Security System, Workshop).

**Tab layout:** `[Items] [Vehicles] [Headquarters]` within a single `EquipmentPanel`.

### Architecture compatibility (current code)
The current `equipmentNotes: string` field is **preserved** and displayed in the expanded structured view,
allowing players to migrate their free-text content manually. The field is not removed — it becomes
an optional `legacyNotes` string when the full system is added.

```typescript
// v1.0 shape (current)
ICharacter.equipmentNotes: string

// v1.1 shape (future — backward compatible)
ICharacter.equipmentNotes?: string          // legacy free text, kept for migration
ICharacter.equipment: IEquipmentItem[]      // structured items
ICharacter.vehicles: IVehicle[]
ICharacter.headquarters: IHeadquarters[]
```

The `charStore.ts` will gain `setEquipment`, `setVehicles`, `setHeadquarters` actions
following the same encapsulation pattern as `setSkills`, `setPowers`, `setAdvantages`.

---

## FX-04 · PP Advancement Tracking

**Priority when tackled:** Low (post-v1.0)
**Effort estimate:** ~8h

### Vision
Track PP earned through play as a log visible in the header area:
```
PP: 162 total (150 creation + 12 earned) | Spent: 155 | Remaining: 7
```

Log entries:
```
[ + Award PP ]  Date: ___  Amount: ___  Note: ________________  [Add]
─────────────────────────────────────────────────────────────────────
2026-03-15:  +5 PP  — Session 12: defeated the Collective
2026-03-22:  +2 PP  — Character milestone: identity revealed
```

### Architecture note
`ICharacter` gains `ppLog: IPPLogEntry[]` where `IPPLogEntry = { date: string, amount: number, note: string }`.
The total PP available becomes `PL × 15 + ppLog.reduce(sum)`, replacing the current hardcoded formula.
The header PP display gains a second line.
This is backward compatible: `ppLog` defaults to `[]`, preserving the `PL × 15` result for all existing saves.

---

## FX-05 · Active Conditions Tracker

**Priority when tackled:** Low (would make the builder also a session-play companion)
**Effort estimate:** ~6h

### Vision
An in-play panel showing a checklist of active conditions (Dazed, Stunned, Staggered, etc.)
derived from the official conditions reference. Conditions persist during a session but are
cleared on new session. Not exported to JSON as persistent data.

### Architecture note
This is **session state**, not character state. It would live in `appStore` or a dedicated
`sessionStore`, never in `charStore` or the save file. Zero impact on existing architecture.

---

*Last updated: 2026-04-05*
