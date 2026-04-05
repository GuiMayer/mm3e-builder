# MM3e Builder — Future Expansions

This file documents features that are **intentionally deferred** from the current implementation scope.
Each item includes the rationale for deferral, the UX vision, and the architecture notes needed
for the current code to remain compatible when the feature is eventually implemented.

---

## FX-01 · PDF Export — Character Sheet

**Original plan ID:** F-23
**Priority when tackled:** High
**Effort estimate:** ~24h (new service + document layout)
**Dependency:** F-12 (attack bonus) should be implemented first so the Offense table in the PDF is accurate.

### Vision
Generate a print-ready `.pdf` file of the full character sheet — text-selectable, styled for A4,
suitable for use at the table without a laptop.

### UX
- Button in the MenuBar Export group, alongside the existing JSON and Excel buttons.
- Generates and downloads directly in the browser (no backend required).
- Layout: clean, light background (print-optimized), regardless of active app theme.
- Multi-page A4. Page breaks between major sections (abilities/defenses, skills, powers, equipment).
- All sections visible: Offense panel, Initiative, Toughness breakdown, Equipment notes, Character Notes.

### Technology decision
`@react-pdf/renderer` with **dynamic import** (lazy-loaded on demand) — client-side, declarative
Flexbox layout, produces text-selectable PDF. No Puppeteer (requires backend). No jsPDF
(coordinate-based, hard to maintain).

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
| `buildOffenseSummary()` is a pure function | PDF generator calls it directly — no hook wrapper needed |

### Files to create when implemented
- `src/services/pdfGenerator.tsx` — React-PDF document component
- `src/locales/en/translation.json` + `pt-BR` — `"menu.exportPdf"`, `"pdf.title"` keys
- `src/services/downloadHelper.ts` — add `pdf` entry to `FILE_TYPES`
- `src/shared/ui/MenuBar.tsx` — add PDF button

---

## FX-02 · Character Illustration

**Original plan ID:** F-18
**Priority when tackled:** Low
**Effort estimate:** ~3h

### Vision
An avatar/image area in `HeaderPanel` (the existing `<User>` icon placeholder).
Strategy: **URL-based first** — user pastes an image link (`header.imageUrl?: string`).
Base64 in-save encoding is v2.0+ only (file size concerns).

When set:
- The `<User>` icon is replaced by the thumbnail (64×64, `object-fit: contain`).
- Clicking the thumbnail opens a popover with a URL input field and a "clear" button.
- A click-to-expand modal shows the full image.
- Graceful fallback: if URL fails to load (broken link), falls back to `<User>` icon silently.

### Architecture note
`ICharacterHeader` gains `imageUrl?: string` — optional, backward compatible.
The PDF generator (FX-01) will render `imageUrl` in the header of page 1 if present.

### Files to create when implemented
- `src/entities/types.ts` — `imageUrl?` on `ICharacterHeader`
- `src/entities/schemas.ts` — `z.string().url().optional()`
- `src/features/sheet-core/HeaderPanel.tsx` — avatar popover + image render

---

## FX-03 · Full Equipment System (EP Tracker, Vehicles & HQ)

**Original plan IDs:** F-15 (EP tracker), F-21 (Vehicles), F-22 (HQ)
**Priority when tackled:** Medium (post-v1.0)
**Effort estimate:** ~24h total (all three implemented together in a single `EquipmentPanel` refactor)

### Current implementation (v1.0)
Equipment is implemented as a single **free-text block** (`character.equipmentNotes: string`),
preserving content without any structure. This is sufficient for recording what a character carries.
See current `EquipmentNotesPanel` component.

### Full vision (v1.1+)

**Tab layout:** `[Items] [Vehicles] [HQ] [Notes]` within a single expanded `EquipmentPanel`.

---

**Equipment Items (F-15):**
Structured list of items purchased with Equipment Points (EP).

- EP budget auto-calculated: `calcEquipmentBudget(advantages, advantageDefs)` → finds Equipment advantage ranks × 5.
- Budget bar: always-visible `EP used / EP budget` display + progress bar (green → red as limit approached).
- Item list: `[Name] [EP cost] [×]` inline rows. "Add item" as an inline form row at the bottom.
- Inline EP cost visible at a glance — no detail modal needed for simple items.

```typescript
interface IEquipmentItem {
  id: string;
  name: string;
  epCost: number;
  description?: string;
}
// ICharacter gains: equipment?: IEquipmentItem[]
```

---

**Vehicles (F-21):**
Standard M&M 3e vehicle stat block within the Vehicles tab.

Each vehicle has: Name, Size, Strength, Speed rank, Defense, Toughness.
Stat inputs use the same stepper UI as Abilities/Defenses for consistency.

```typescript
interface IVehicle {
  id: string;
  name: string;
  size: number;         // −2 to +8 (colossal)
  strength: number;
  speedRank: number;
  defense: number;
  toughness: number;
  notes?: string;
}
// ICharacter gains: vehicles?: IVehicle[]
```

---

**Headquarters (F-22):**
M&M 3e HQ schema within the HQ tab.

- HQ: Size, Toughness + EP-purchased feature checklist.
- Feature list (each costs 1 EP): Communications, Computer, Defense System, Dock, Garage,
  Gym, Hangar, Infirmary, Laboratory, Living Space, Personnel, Pool, Power System,
  Security System, Workshop.

```typescript
interface IHeadquarters {
  id: string;
  name: string;
  size: number;
  toughness: number;
  features: string[];   // list of selected feature IDs
  notes?: string;
}
// ICharacter gains: headquarters?: IHeadquarters[]
```

---

### Architecture compatibility (current code)
The current `equipmentNotes: string` field is **preserved** and displayed as the "Notes" tab in the
new panel, allowing players to migrate their free-text content manually. It is not removed —
it becomes the legacy notes tab when the full system is added.

```typescript
// v1.0 shape (current)
ICharacter.equipmentNotes: string

// v1.1 shape (future — backward compatible)
ICharacter.equipmentNotes: string            // now displayed in the "Notes" tab
ICharacter.equipment?: IEquipmentItem[]
ICharacter.vehicles?: IVehicle[]
ICharacter.headquarters?: IHeadquarters[]
```

The `charStore.ts` will gain `setEquipment`, `setVehicles`, `setHeadquarters` actions
following the same encapsulation pattern as `setSkills`, `setPowers`, `setAdvantages`.

A new pure function `calcEquipmentBudget(advantages, advantageDefs)` will be added to
`mathEngine.ts` for PDF and Excel compatibility.

---

## FX-04 · Character Notes & Background

**Original plan ID:** F-14 (notes portion), FX-02 (illustration — see above)
**Status:** F-14 (text notes) is **actively being implemented in Tier 4** — only the illustration portion is deferred.

> The general notes field (`character.notes?: string`) is part of the active Tier 4 plan under F-14.
> It will be a collapsible "Background & Notes" panel at the bottom of the sheet.

---

## FX-05 · PP Advancement Tracking

**Original plan ID:** F-17
**Status:** F-17 is **actively being implemented in Tier 4** as an **opt-in "Campaign Mode" toggle**.

> When Campaign Mode is OFF (default), PP = PL × 15 as today — zero visual impact.
> When ON, a PP log accordion expands with award entries. PP = PL × 15 + Σ ppLog.

---

*Last updated: 2026-04-05*
