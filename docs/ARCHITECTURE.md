# Character Sheet Manager & Power Builder — Mutants & Masterminds 3e

Engineering plan for the M&M 3e character builder, focused on the visual Power Builder. Scalable architecture, SOLID principles applied in practice, and a clear phased delivery schedule.

> [!IMPORTANT]
> This document was refactored based on rigorous critical analysis. All identified gaps have been addressed. Awaiting final approval to begin execution.

---

## 1. Delivery Phases (MVP → V2)

To mitigate scope risk, the project is divided into phases with concrete, testable deliverables:

### Phase 1 — Functional MVP (Priority Delivery)
1. Vite + React + TS + Zustand scaffolding
2. Theme system (CSS Custom Properties + 4 pre-made themes)
3. Complete Single Page character sheet (Abilities, Defenses, Skills, Advantages, Complications)
4. Fullscreen Overlay Power Builder with Drag & Drop (`@dnd-kit/core`)
5. Math engine (`mathEngine`) with unit tests
6. New / Export / Import JSON flow (with schema versioning)
7. Menu Bar with Settings Dropdown (Strict Mode toggle + Theme selector)
8. Explanatory tooltips on Effects and Modifiers (essential for Power Builder usability from day one)

### Phase 2 — Polish & Export
9. PDF Generator (template filling with `pdf-lib`)
10. `.xlsx` spreadsheet exporter (`exceljs`)
11. Undo/Redo system in the Power Builder (`Ctrl+Z` / `Ctrl+Y` via Zustand temporal middleware)
12. Guided onboarding (interactive tour for new users)

### Phase 3 — Future Expansions
13. Visual custom theme editor (Color Picker)
14. Vehicle / Base (HQ) builder
15. Pre-built Powers library (community presets)
16. Responsive support for tablets and touch devices

### Complexity Estimates by Phase

| Phase | Most complex item | Relative effort |
|---|---|---|
| **Phase 1** | Power Builder (Drag & Drop + Engine) | ~60% of total phase effort — the feature requiring the most visual iteration and mathematical logic |
| **Phase 1** | Single Page sheet | ~20% — standard form components |
| **Phase 1** | Themes + Menu Bar + File I/O | ~20% — infrastructure |
| **Phase 2** | PDF Generator | ~40% — field-by-field template mapping |
| **Phase 2** | Undo/Redo | ~30% — requires history middleware in Zustand |
| **Phase 2** | Excel + Onboarding | ~30% — lib integration + guided UX |

> [!TIP]
> If scope needs to be cut, the sacrifice order is: Excel → PDF → Undo/Redo → Onboarding Tour. The Power Builder, the Math Engine, and the Tooltips will **never** be cut.

---

## 2. Engineering Principles (Applied in Practice)

| Principle | Concrete Implementation |
|---|---|
| **SRP** | `charStore.ts` only manages sheet state. `fileService.ts` handles I/O (import/export). `mathEngine.ts` handles calculations. `validation.ts` handles PL limits. |
| **OCP** | New Effects and Modifiers are added exclusively via data JSONs, without touching code. |
| **DIP** | `mathEngine` receives data via TypeScript interfaces (`IPower`, `IModifier`), never imports stores directly. |
| **Feature-Sliced** | Each domain (`power-builder/`, `sheet-core/`, `dashboard/`) encapsulates its own components, hooks, and local types. |
| **Mutable Configuration** | `appStore.ts` stores preferences (Strict Mode, active theme). `mathEngine` receives flags as parameters, with no direct store coupling. |

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| TypeScript interfaces | `I` prefix + PascalCase | `IPower`, `IModifier`, `ICharacter` |
| TypeScript types | PascalCase, no prefix | `AbilityKey`, `CostType` |
| Component files | PascalCase | `PowerCard.tsx`, `EffectPalette.tsx` |
| Service/lib files | camelCase | `mathEngine.ts`, `fileService.ts` |
| JSON data keys | camelCase | `baseCost`, `costType`, `baseAbility` |
| Ability abbreviations | 3 lowercase letters (official M&M standard) | `str`, `sta`, `agl`, `dex`, `fgt`, `int`, `awe`, `pre` |
| JSON data IDs | snake_case | `"power_attack"`, `"close_combat"` |
| CSS Custom Properties | kebab-case with `--c-` (color) or `--s-` (spacing) prefix | `--c-primary`, `--c-surface`, `--s-gap` |

---

## 3. Styling & Themes (Industry Standard)

- **CSS Custom Properties standard**: Zero hardcoded colors. The entire design system is governed by CSS variables injected into `:root`, toggled via a `data-theme` attribute on `<html>`.
- **Included pre-made themes** (4 defaults):

| Theme | Profile | Primary | Surface |
|---|---|---|---|
| `dark-knight` | Premium dark mode | `#6C63FF` Purple | `#0D0D14` Deep black |
| `arc-reactor` | Technological neon | `#00D4FF` Electric blue | `#0A1628` Dark blue |
| `cyberpunk` | Vibrant & warm | `#FF2D6B` Neon pink | `#1A0A1E` Dark purple |
| `light-print` | Print/reading | `#2563EB` Classic blue | `#FAFAFA` White |

- **Theme switching**: Via selector in the Menu Bar Dropdown. Persists in `localStorage`.
- **Future customisation (V3)**: The variables system will allow a visual color editor without code changes.

---

## 4. Premium UX: Single Page Sheet + Fullscreen Overlay

### Single Page Sheet (Main View)
All character data on a single continuous scrollable page: Header → Abilities → Defenses → Skills → Advantages → Powers List → Complications.

### Power Builder (Fullscreen Modal Overlay)
In the Powers section of the sheet, "**+ New Power**" and "**Edit**" buttons (per power) open the builder in a fullscreen overlay with an animated transition.

**Overlay internal layout:**
```
┌─────────────────────────────────────────────────────┐
│ [Top Menu Bar]  Filters | + Array | Expand | Close  │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  PALETTE     │    CONSTRUCTION WORKBENCH            │
│  (Sidebar)   │                                      │
│              │  ┌─────────────────────────────┐     │
│  🔍 Search   │  │ Effect: Damage (Rank 10)    │     │
│              │  │ ┌───────┐ ┌───────┐         │     │
│  ▸ Extras    │  │ │Ranged │ │ Area  │ ← DROP  │     │
│  ▸ Flaws     │  │ └───────┘ └───────┘         │     │
│  ▸ Effects   │  │ Cost: (1+1+1)×10 = 30 PP   │     │
│              │  └─────────────────────────────┘     │
│              │                                      │
│  [DRAG >>>]  │  [Dropzone: Drop modifiers here]     │
│              │                                      │
├──────────────┴──────────────────────────────────────┤
│ [Footer] Total: 30 PP  │  Save  │  Cancel           │
└─────────────────────────────────────────────────────┘
```

**Detailed UX features:**

| Feature | Description |
|---|---|
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` library. Drag Extras/Flaws from the Palette to the power's Dropzone. Visual feedback (ghost, zone highlight) during drag. |
| **Text Search** | Filter field in the Palette to type "area" and show only modifiers containing that term (name or description). Essential with hundreds of entries. |
| **Explanatory Tooltips** | Hovering over any Effect or Modifier renders a rich tooltip with: rule description, cost, action type, and book page reference. |
| **Inline Validation Feedback** | If the user applies an incompatible Extra or exceeds PL limits (in Strict Mode), the block pulses red with a contextual message. Never silent. |
| **Undo / Redo (V2)** | Action stack with `Ctrl+Z` / `Ctrl+Y` inside the Builder. Implemented via history middleware in Zustand (`temporal` pattern). |
| **Live Calculation** | On dropping a block, the footer updates instantly: `Base (X) + Extras (Y) - Flaws (Z) = Cost/Rank × Ranks + Flats = Total PP`. |
| **Synchronisation** | On clicking "Save" and closing the overlay, the power appears immediately in the sheet list (Single Source of Truth via Zustand). |

### Responsiveness & Platform

- **Desktop-first**: The app is primarily designed for desktop/laptop use with mouse and keyboard. The two-column Power Builder layout (Palette + Workbench) and Drag & Drop are pointer-optimised.
- **Tablet (V3)**: On smaller screens, the Palette will collapse to a sliding drawer and Drag & Drop will use `@dnd-kit`'s touch sensors (`TouchSensor` + `KeyboardSensor` as fallback). "Tap-to-Add" buttons will be offered as an alternative to dragging.
- **Mobile**: Not supported in V1/V2. The Power Builder's complexity requires minimum visual space.

### Accessibility (a11y)

- **WCAG AA contrast**: All 4 pre-built themes will be validated to maintain a minimum ratio of `4.5:1` for text and `3:1` for interactive elements. Neon themes (arc-reactor, cyberpunk) will use slightly desaturated versions for small text.
- **Keyboard navigation**: `@dnd-kit` natively supports `KeyboardSensor` — palette items can be moved via `Tab` + `Enter` + arrow keys. All buttons and inputs will have `tabIndex` and styled `focus-visible`.
- **Aria Labels**: Dropzones, modifier chips, and power cards will receive descriptive `aria-label` attributes (e.g. `aria-label="Extra Modifier: Ranged, cost +1 per rank"`).
- **Reduced motion preference**: CSS animations will respect `prefers-reduced-motion: reduce` to disable transitions and micro-animations.

---

## 5. Complete M&M 3e Sheet Mapping

### 5.1 Character Header & Metadata
| Field | Type | Note |
|---|---|---|
| `name` | `string` | Hero/villain name |
| `player` | `string` | Player name |
| `identity` | `string` | Secret/public identity |
| `base` | `string` | Base of operations |
| `powerLevel` | `number` | **PL** — defines all mathematical caps |
| `heroPoints` | `number` | Starting Hero Points |
| `totalPP` | `number` | Calculated: usually `PL × 15` |

### 5.2 Abilities — Cost: 2 PP / rank
| Ability | Abbreviation | Description |
|---|---|---|
| Strength | `str` | Physical capacity, melee damage |
| Stamina | `sta` | Endurance and health |
| Agility | `agl` | Reflexes, dodge, initiative |
| Dexterity | `dex` | Fine coordination, aim |
| Fighting | `fgt` | Melee combat, parry |
| Intellect | `int` | Reasoning, knowledge |
| Awareness | `awe` | Perception, willpower |
| Presence | `pre` | Charisma, intimidation |

> [!NOTE]
> **Absent ability (`absent`)**: An attribute can be marked as `--` (absent). Cost = `0 PP`. The character cannot use checks for that ability. This must be supported in the interface (e.g. Constructs without `sta`).

### 5.3 Defenses — Cost: 1 PP / rank purchased above base attribute
| Defense | Base Attribute | Notes |
|---|---|---|
| Dodge | `agl` | Total rank = `agl` + purchased ranks |
| Parry | `fgt` | Total rank = `fgt` + purchased ranks |
| Fortitude | `sta` | Total rank = `sta` + purchased ranks |
| Will | `awe` | Total rank = `awe` + purchased ranks |
| Toughness | `sta` | **Cannot be purchased directly.** Increases only via `Protection` Effect or `Defensive Roll` Advantage. |
| Initiative | `agl` | Calculated: `agl` + Advantage bonuses (e.g. `Improved Initiative`). Does not cost PP. |

### 5.4 Skills — Cost: 1 PP per 2 ranks
| Skill | Base Attribute |
|---|---|
| Acrobatics | `agl` |
| Athletics | `str` |
| Close Combat (by type) | `fgt` |
| Ranged Combat (by type) | `dex` |
| Deception | `pre` |
| Expertise (Knowledge) | `int` |
| Stealth | `agl` |
| Intimidation | `pre` |
| Investigation | `int` |
| Perception | `awe` |
| Persuasion | `pre` |
| Sleight of Hand | `dex` |
| Technology | `int` |
| Treatment | `int` |
| Vehicles | `dex` |

> [!NOTE]
> **Combat Skills** (Close and Ranged Combat) are *sub-typed* — the player must specify the weapon/attack type (e.g. "Close Combat: Swords"). Each sub-type is purchased separately.

### 5.5 Advantages — Cost: 1 PP / rank
List populated by the `advantages.json` file. Each advantage has: `name`, `ranked` (boolean), `description`.

### 5.6 Powers — Math Engine
- **Cost per Rank** = `effectBaseCost + sumExtrasPerRank - sumFlawsPerRank`
- If this result is `≤ 0`, the fractional formula applies: `1 PP per N ranks` (where N = `2 - netCost`).
- **Total Cost** = `(costPerRank × ranks) + sumFlatExtras - sumFlatFlaws` (minimum 1 PP).
- **Alternate Effects (Arrays)**: Alternate Effect costs **+1 PP flat**. Dynamic Alternate Effect costs **+2 PP flat**. The total array cost is the most expensive effect + flats of the alternates.

> [!NOTE]
> **Effects with Variable Base Cost**: Some effects have costs that depend on internal sub-options. Examples:
> - `Senses`: Cost varies by type of sense acquired (1 PP for Darkvision, 2 PP for Radio, etc.). The `powers.json` schema provides the optional `variableCost` field for these cases — the Power Builder will render a sub-option selector before calculating.
> - `Affliction`: Fixed base cost (1/rank), but the player chooses 3 progressive conditions. This is handled as descriptive metadata (fields `condition1`, `condition2`, `condition3`), with no cost impact.
> - `Immunity`: Cost varies from 1 to 80 PP depending on breadth (e.g. "Immunity to Cold" vs "Immunity to All Effects").

### 5.7 Power Level Limits (PL Trade-Off Limits)

These are the **core mathematical rules** that `validation.ts` will enforce when **Strict Mode** is active. The user will receive visual feedback (yellow/red highlight) if any cap is exceeded:

| Rule | Formula | Example (PL 10) |
|---|---|---|
| Attack + Effect (Damage/Affliction) | `attackBonus + effectRank ≤ PL × 2` | Attack 10 + Damage 10 = 20 ≤ 20 ✅ |
| Dodge + Toughness | `dodge + toughness ≤ PL × 2` | Dodge 8 + Toughness 12 = 20 ≤ 20 ✅ |
| Parry + Toughness | `parry + toughness ≤ PL × 2` | Parry 13 + Toughness 8 = 21 > 20 ❌ |
| Fortitude + Will | `fortitude + will ≤ PL × 2` | Fortitude 10 + Will 10 = 20 ≤ 20 ✅ |
| Non-combat Skill rank | `abilityBase + ranks ≤ PL + 10` | INT 5 + Technology 15 = 20 ≤ 20 ✅ |
| Combat Skill rank | `abilityBase + ranks ≤ PL × 2` | FGT 8 + Close Combat: Swords 12 = 20 ≤ 20 ✅ |

> [!WARNING]
> With **Strict Mode disabled** (via Menu Bar), all validations are **ignored** and no visual alerts are generated. Ideal for creating NPCs, deities, or experimental characters without restrictions.

### 5.8 Complications
Free-form text list: `{ title: string, description: string }`. No PP cost — narrative source of Hero Points in play.

---

## 6. JSON Data File Schemas

Exact contracts so that manual data entry is fast and unambiguous.

### `powers.json`
```json
[
  {
    "id": "damage",
    "name": "Damage",
    "type": "attack",
    "baseCost": 1,
    "action": "standard",
    "range": "close",
    "duration": "instant",
    "description": "Inflicts physical or energy damage on the target.",
    "variableCost": null
  },
  {
    "id": "senses",
    "name": "Senses",
    "type": "sensory",
    "baseCost": 1,
    "action": "none",
    "range": "personal",
    "duration": "permanent",
    "description": "Grants additional or enhanced senses.",
    "variableCost": {
      "options": [
        { "name": "Darkvision", "cost": 1 },
        { "name": "Radio Sense", "cost": 1 },
        { "name": "X-Ray Vision", "cost": 4 }
      ]
    }
  }
]
```

> [!NOTE]
> The `variableCost` field is **null** for fixed-cost effects (the majority). When populated, the Power Builder renders a sub-option selector that replaces `baseCost` with the selected value. This keeps the JSON simple for common effects and extensible for variable ones.

### `modifiers.json`
```json
[
  {
    "id": "ranged",
    "name": "Ranged",
    "category": "extra",
    "costType": "per_rank",
    "costValue": 1,
    "description": "Changes the effect's range from Close to Ranged.",
    "incompatibleWith": []
  },
  {
    "id": "tiring",
    "name": "Tiring",
    "category": "flaw",
    "costType": "per_rank",
    "costValue": -1,
    "description": "Using the effect causes a fatigue condition.",
    "incompatibleWith": []
  },
  {
    "id": "homing",
    "name": "Homing",
    "category": "extra",
    "costType": "flat",
    "costValue": 1,
    "description": "The attack attempts to hit the target again if it misses.",
    "incompatibleWith": []
  }
]
```

### `advantages.json`
```json
[
  {
    "id": "power_attack",
    "name": "Power Attack",
    "ranked": false,
    "description": "Trade attack bonus for damage in melee attacks."
  }
]
```

### `skills.json`
```json
[
  {
    "id": "acrobatics",
    "name": "Acrobatics",
    "baseAbility": "agl",
    "subtyped": false
  },
  {
    "id": "close_combat",
    "name": "Close Combat",
    "baseAbility": "fgt",
    "subtyped": true
  }
]
```

### Exported character sheet schema (`.json`)
```json
{
  "schemaVersion": "1.0.0",
  "exportedAt": "2026-04-02T14:00:00Z",
  "character": {
    "header": { "name": "", "player": "", "identity": "", "base": "", "powerLevel": 10, "heroPoints": 1 },
    "abilities": { "str": 0, "sta": 0, "agl": 0, "dex": 0, "fgt": 0, "int": 0, "awe": 0, "pre": 0 },
    "absentAbilities": [],
    "defenses": { "dodge": 0, "parry": 0, "fortitude": 0, "will": 0 },
    "skills": [
      { "skillId": "acrobatics", "ranks": 4, "subtype": null }
    ],
    "advantages": [
      { "advantageId": "power_attack", "ranks": 1 }
    ],
    "powers": [
      {
        "id": "auto-generated-uuid",
        "name": "Arcane Blast",
        "effectId": "damage",
        "ranks": 10,
        "modifiers": [
          { "modifierId": "ranged", "ranks": 1 },
          { "modifierId": "homing", "ranks": 2 }
        ],
        "notes": "Pure arcane energy",
        "alternateEffects": [
          {
            "id": "uuid-alt",
            "name": "Arcane Shield",
            "effectId": "protection",
            "ranks": 10,
            "modifiers": [],
            "dynamic": false,
            "notes": ""
          }
        ]
      }
    ],
    "complications": [
      { "title": "Motivation", "description": "Protect the innocent" }
    ]
  }
}
```

> [!NOTE]
> **Internal structure of a saved Power**: Each power references the `effectId` (link to `powers.json`) and its modifiers via `modifierId` (link to `modifiers.json`). `alternateEffects` are a nested list with the same structure, plus the `dynamic` flag (false = +1 PP, true = +2 PP). Power IDs are UUIDs generated at creation time to guarantee uniqueness.

> [!WARNING]
> The `schemaVersion` field is **mandatory**. On import, `fileService.ts` will validate the version and, if the schema is outdated, will run automatic migrations. Files without a version or corrupted files will be rejected with a user-friendly message.

---

## 7. Resilience & Error Handling

| Scenario | Solution |
|---|---|
| Closing tab without exporting | **Auto-save** to `localStorage` on every change. On reopening, asks "Restore draft?" |
| Importing corrupted JSON | `fileService.ts` validates against the Zod schema (runtime type checking). Displays a descriptive error modal indicating the problematic field. |
| Importing outdated schema | Versioned automatic migration (`v1.0 → v1.1`). Informs the user that the file has been updated. |
| Clearing browser cache | Permanent UI warning: "Export your sheet to avoid losing data". Export button always visible in the Menu Bar. |
| Incompatible Extras | Inline validation in the Power Builder with contextual message: "This Extra is not compatible with Instant duration effects". |
| localStorage full (~5-10MB limit) | Auto-save will use `try/catch` on write. On `QuotaExceededError` failure, automatically triggers a `.json` download as emergency backup and displays alert: "Local storage full. Your sheet was automatically exported". |

---

## 8. Testing Strategy

| Layer | Tool | What it tests |
|---|---|---|
| **Unit: mathEngine** | `vitest` | Power cost calculations (fractional, arrays, flats). Test case: Damage 10 + Ranged + Area - Tiring = `(1+1+1-1)×10 = 20 PP`. |
| **Unit: fileService** | `vitest` | Serialisation, deserialisation, schema validation, version migration. |
| **Unit: validation** | `vitest` | PL limits (attack+damage ≤ 2×PL, dodge+toughness ≤ 2×PL, skill caps). |
| **Integration: stores** | `vitest` | Zustand store reacts to ability changes and recalculates total PP. |
| **E2E / Visual** | Browser (manual) | Full flow: new → fill → power builder → export → reimport. |

---

## 9. Dependency Stack

| Package | Use |
|---|---|
| `react` + `react-dom` | UI Framework |
| `typescript` | Static typing |
| `zustand` | State management |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag and Drop (accessible, modern, lightweight) |
| `pdf-lib` | Client-side PDF generation/filling (V2) |
| `exceljs` | Client-side `.xlsx` generation (V2) |
| `lucide-react` | SVG icons |
| `vitest` | Unit testing |
| `zod` | Runtime JSON schema validation (sheet import) |

---

## 10. Definitive Directory Structure

```
mm3e-builder/
├── vite.config.ts              ← base configured for GitHub Pages
├── vitest.config.ts            ← test configuration
├── public/
│   └── template_ficha.pdf      ← official PDF template (V2)
└── src/
    ├── app/
    │   ├── App.tsx             ← Root: renders MenuBar + SheetView
    │   ├── main.tsx            ← React entry point
    │   └── theme.css           ← CSS Custom Properties (4 themes + tokens)
    │
    ├── entities/
    │   ├── types.ts            ← Interfaces: ICharacter, IPower, IModifier, IAdvantage, ISkill
    │   └── schemas.ts          ← Zod schemas for runtime validation
    │
    ├── store/
    │   ├── charStore.ts        ← Active sheet state (state only)
    │   └── appStore.ts         ← Global preferences (theme, strict mode, flags)
    │
    ├── services/
    │   ├── fileService.ts      ← Import/Export JSON + validation + schema migration
    │   ├── pdfGenerator.ts     ← PDF template filling (V2)
    │   └── excelGenerator.ts   ← .xlsx generation (V2)
    │
    ├── shared/
    │   ├── lib/
    │   │   ├── mathEngine.ts   ← Pure calculations (receives interfaces, returns numbers)
    │   │   └── validation.ts   ← PL limit rules (consulting strict mode flags)
    │   ├── hooks/
    │   │   ├── useCalculatedPP.ts   ← Reactive hook: sums total PP spent on sheet
    │   │   ├── useDraftAutoSave.ts  ← Hook: persists draft to localStorage with try/catch
    │   │   ├── useTheme.ts          ← Hook: reads/switches active theme via appStore
    │   │   └── usePLValidation.ts   ← Hook: returns real-time PL limit violations
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Modal.tsx        ← Fullscreen Overlay wrapper
    │       ├── Tooltip.tsx
    │       ├── MenuBar.tsx
    │       └── DropZone.tsx     ← DnD-Kit wrapper
    │
    ├── data/
    │   ├── powers.json         ← Base Effects (schema documented above)
    │   ├── modifiers.json      ← Extras and Flaws
    │   ├── advantages.json     ← Advantages
    │   └── skills.json         ← Skills
    │
    ├── features/
    │   ├── dashboard/
    │   │   └── DashboardBar.tsx ← New / Import / Export / PDF / Excel
    │   ├── sheet-core/
    │   │   ├── SheetView.tsx    ← Complete Single Page sheet
    │   │   ├── AbilitiesPanel.tsx
    │   │   ├── DefensesPanel.tsx
    │   │   ├── SkillsPanel.tsx
    │   │   ├── AdvantagesPanel.tsx
    │   │   ├── PowersList.tsx   ← Summary list + "Open Builder" button
    │   │   └── ComplicationsPanel.tsx
    │   └── power-builder/
    │       ├── PowerBuilderOverlay.tsx  ← Fullscreen Modal root
    │       ├── BuilderMenuBar.tsx       ← Filters, shortcuts, arrays
    │       ├── EffectPalette.tsx        ← Sidebar with text search
    │       ├── PowerCard.tsx            ← Visual block of power under construction
    │       └── ModifierChip.tsx         ← Draggable piece (Extra/Flaw)
    │
    └── __tests__/
        ├── mathEngine.test.ts
        ├── fileService.test.ts
        └── validation.test.ts
```
