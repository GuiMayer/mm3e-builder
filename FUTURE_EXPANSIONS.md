# MM3e Builder — Future Expansions

This file documents features that are **intentionally deferred** from the current implementation scope.
Each item includes the rationale for deferral, the UX vision, and the architecture notes needed
for the current code to remain compatible when the feature is eventually implemented.

---

## ~~FX-01~~ · PDF Export — ✅ Implemented in v1.0

**Original plan ID:** F-23  
**Shipped:** v1.0 (2026-04)

### What was delivered
The official M&M 3e fillable PDF (`MnM3_charsheet_color_fillable.pdf`) is now filled programmatically
using `pdf-lib`. All 211 fields across 3 pages are covered:

- **Page 1:** Header (Hero, Player, Identity, Base, Group, PL, PP Earned/Spent/Total, Age, Gender,
  Height, Weight, Eyes, Hair, Hero Points, Public/Secret checkboxes), Abilities (8 fields +
  `fmtAbility()` for absent abilities), Defenses (Dodge, Parry, Fortitude, Will, Toughness,
  Initiative), Offense table (Attack 1–4, Offense 1–4 with auto-calculated DC, Description 1–4),
  compact Skills/Advantages/Powers text blocks, Notes and Conditions.
- **Page 2:** Structured skill grid (13 fixed skills + Close Combat 1–3 + Ranged Combat 1–3 +
  Expertise 1–4), Advantages 1–11, Equipment 1–10, Complications 1–11 (`[Type]: Description`
  format), Notes 1–7 (character.notes + advantage overflow).
- **Overflow modal:** When limits are exceeded (> 4 attacks, > 11 advantages, > 11 complications,
  > 18 powers, > 3 CC/RC subtypes, > 4 Expertise subtypes), a modal warns the user and lists the
  overflowing items with their destination field.

### Architecture delivered
Highly modular: `pdfFillService.ts` is a pure orchestrator (< 145 lines) that delegates to
10 independent section modules under `src/services/pdf/sections/`. Each module is a single
pure function — testable without a real PDF. `overflowCollector.ts` and `helpers.ts` are
fully isolated utilities with zero cross-module dependencies.

> See `src/services/pdf/` for the full implementation.

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
// Current shape
ICharacter.equipmentNotes: string

// Future extension — backward compatible
ICharacter.equipmentNotes: string            // now displayed in the "Notes" tab
ICharacter.equipment?: IEquipmentItem[]
ICharacter.vehicles?: IVehicle[]
ICharacter.headquarters?: IHeadquarters[]
```

The multi-character `charactersStore.ts` should evolve through its `updateCharacter`
action (or a focused entity operation if reuse is needed), without reintroducing the
removed single-character `charStore.ts`.

A new pure function `calcEquipmentBudget(advantages, advantageDefs)` will be added to
`mathEngine.ts` for PDF and Excel compatibility.

---

## FX-04 · Character Notes & Background

**Original plan ID:** F-14 (notes portion), FX-02 (illustration — see above)
**Status:** Text notes are implemented. Illustration support remains deferred.

> The general notes field (`character.notes?: string`) is part of the active Tier 4 plan under F-14.
> It will be a collapsible "Background & Notes" panel at the bottom of the sheet.

---

## FX-05 · PP Advancement Tracking

**Original plan ID:** F-17
**Status:** Implemented as an opt-in **Campaign Mode** toggle with a PP log.

> When Campaign Mode is OFF (default), PP = PL × 15 as today — zero visual impact.
> When ON, a PP log accordion expands with award entries. PP = PL × 15 + Σ ppLog.

---

*Last updated: 2026-08-15 — compatibility notes revised after the architecture refactor*
