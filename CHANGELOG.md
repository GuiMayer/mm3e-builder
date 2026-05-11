# Changelog

All notable changes to the MM3E Character Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-05-10

### Added
- **Complete Powers Modifiers Audit**: Verified all 40 powers against official M&M 3e Hero's Handbook
  - 209 modifiers verified across all powers
  - 92.5% accuracy rate (37/40 powers perfectly aligned)
  - Only 3 minor discrepancies found (structural differences, not errors)
- **Power-Specific Modifiers System**: 45+ power-specific modifiers added
  - High-priority modifiers (25): Accurate, Affects Corporeal, Affects Objects, etc.
  - Medium-priority modifiers (20): Alternate Resistance, Contagious, Dimensional, etc.
  - UI filtering to show only relevant modifiers per power
- **Automated Validation Scripts**: 
  - scripts/verify-powers-modifiers.js for continuous validation
  - Structural validation for modifiers.json
  - Incompatibility rules verification
  - Comparison with official rulebook

### Fixed
- AFFLICTION Progressive modifier cost (1 → 2 per rank)
- MORPH missing modifiers (Continuous, Precise, Selective)
- SENSES missing modifiers (Acute, Accurate, Extended, etc.)
- ILLUSION invalid modifiers removed
- Enhanced Trait duplicate Limited modifier removed
- Multiple power-specific modifiers corrections across 10+ powers

### Documentation
- Complete audit reports for all 4 phases
- Corrected powers-modifiers-status report
- Detailed analysis documents in docs/analysis/

---

## [1.3.0] - 2026-04-28

### Added
- **Complete M&M 3e Rules Validation System**
  - Modular validation engine with 8 validation phases
  - Official builds tests (Daredevil, Battlesuit, Powerhouse, Paragon)
  - PL limits enforcement (Attack+Damage ≤ 2×PL, Dodge+Toughness ≤ 2×PL)
  - Skill rank caps (PL + 10 for trained skills)
  - Absent abilities validation
  - Affliction degree progression validation
  - Edge cases coverage (zero-rank powers, negative abilities)
- **Test Suite**: 50+ test cases covering all validation rules
- **Golden Fixture Tests**: Data integrity validation for powers.json and modifiers.json

### Changed
- Validation now runs automatically on character changes
- PL validation warnings displayed in real-time

---

## [1.2.0] - 2026-04-15

### Added
- **Power Builder v2**: Complete redesign with multi-component architecture
  - Multi-component powers (Linked Powers support)
  - Each component has independent effect, ranks, and modifiers
  - Real-time cost calculation per component
  - SCHEMA_VERSION 2.0.0 introduced
- **Alternate Effects v2**: Full multi-component support in arrays
  - Multi-component AEs (e.g., "Taser Blade: Damage 5 + Affliction 5")
  - Collapsible AE cards with cost badges
  - Cost validation per AE with ✅/⚠️ indicators
  - Dynamic array checkbox with tooltip
  - Contextual palette with orange "Editing: [AE name]" badge
- **Migration Layer**: Automatic v1.0 → v2.0 migration
  - powerMigration.ts handles backward compatibility
  - Legacy format (effectId + ranks) → new format (components[])
  - Zero data loss on import
  - Supports mixed formats (v1 powers + v2 AEs)
- **Drag-and-Drop System**: @dnd-kit integration
  - Drag modifiers from palette to component dropzones
  - UUID-safe dropzone IDs prevent fragmentation
  - Visual feedback during drag operations

### Changed
- Power structure: effectId + ranks + modifiers → components[]
- Alternate Effect structure: flat → components[]
- File schema validation accepts both v1.0 and v2.0 formats

### Fixed
- AE cost validation edge cases
- Dropzone ID collisions in nested components

---

## [1.1.0] - 2026-04-08

### Added
- **PDF Export System**: Complete implementation
  - Fill all 211 fields of official M&M 3e fillable sheet
  - 3-phase modular implementation
  - Abilities, defenses, skills, advantages, powers, complications
  - Offense table with attack bonuses
  - Initiative and movement calculations
  - Equipment notes section
- **Campaign Mode (F-17)**: PP advancement tracking
  - Opt-in toggle in Settings
  - PP log panel with date, amount, and notes
  - Persistent storage in character file
- **Custom Offense Rows (F-13)**: Manual attack entries
  - User-defined attack name, bonus, range, effect
  - Supports close, ranged, and perception attacks
- **Physical Description Fields (F-07)**: Character appearance
  - Gender, age, height, weight, eyes, hair
  - Group affiliation, series, game master
  - Collapsible accordion in header
- **Equipment Notes Panel (F-09)**: Free-text equipment block
- **Removable Powers (F-06)**: Device discount system
  - Removable (-1 PP/rank) and Easily Removable (-2 PP/rank)
  - Applied to entire power array
- **Complication Types (F-08)**: Structured badges
  - 11 types: Motivation, Enemy, Identity, Relationship, etc.
  - Optional emoji chips in complications panel
- **Skill Other Bonus (F-11)**: Manual skill adjustments
- **Identity Type Toggle (F-03)**: Secret vs Public identity

### Changed
- PDF export button always visible in MenuBar
- Settings panel expanded with new options

---

## [1.0.0] - 2026-04-01

### Added
- **Initial Release**: MM3E Character Builder with core features
- **Abilities System**: 8 core abilities (STR, STA, AGL, DEX, FGT, INT, AWE, PRE)
  - Automatic PP cost calculation (×2/rank)
  - Absent abilities support (Construct, Immortal, etc.) at −4 PP
- **Defenses System**: Dodge, Parry, Fortitude, Will
  - Automatic calculation based on ability scores + bought ranks
- **Skills System**: 28+ skills with subtypes
  - Auto-cost at 1 PP per 2 ranks
  - Searchable selector with colored badges
  - In-place subtype editing
  - Collapsible description modal
- **Advantages System**: 49 advantages
  - Searchable selector with category filters
  - Ranked/flat type display
  - Description modal with full rulebook text
- **Powers System (v1)**: Basic power builder
  - Single effect per power
  - Modifier system (extras/flaws)
  - Cost calculation engine
  - Notes field for descriptors
- **Complications System**: Free-form complications
  - Title + description fields
  - Supports all standard complication types
- **Character Management**:
  - JSON import/export
  - Auto-save to localStorage
  - Draft recovery on reload
  - Schema validation with Zod
- **Internationalization (i18n)**:
  - English and Portuguese (pt-BR) support
  - Language switcher in MenuBar
  - Localized game data (powers, modifiers, skills, advantages)
- **UI/UX**:
  - Modern, responsive design
  - Dark theme
  - Collapsible panels
  - Real-time PP calculation
  - PL validation warnings

### Technical
- React 19 + TypeScript
- Zustand for state management
- Vite build system
- Vitest for testing
- GitHub Pages deployment
- PDF-lib for PDF generation
- Zod for runtime validation

---

## Version History Summary

| Version | Date | Key Feature | Schema Version |
|---------|------|-------------|----------------|
| 1.4.0 | 2026-05-10 | Data Quality Complete | 2.0.0 |
| 1.3.0 | 2026-04-28 | Rules Validation System | 2.0.0 |
| 1.2.0 | 2026-04-15 | Power Builder v2 | 2.0.0 |
| 1.1.0 | 2026-04-08 | PDF Export Complete | 2.0.0 |
| 1.0.0 | 2026-04-01 | Initial Release | 2.0.0 |

---

## Schema Versioning

The project uses **SCHEMA_VERSION** to track character file format changes:

- **2.0.0** (current): Multi-component power format (components[])
  - Introduced in v1.2.0 with Power Builder v2
  - Supports Linked Powers and multi-component Alternate Effects
  - Backward compatible with v1.0 format via automatic migration

- **1.0.0** (legacy): Flat power format (effectId + ranks + modifiers)
  - Used in v1.0.0 and v1.1.0
  - Automatically migrated to 2.0.0 on import
  - Still supported for import (read-only compatibility)

**Note**: Application version (package.json) and Schema version (constants.ts) are independent. Schema version only changes when the character file format has breaking changes.

---

## Migration Guide

### Upgrading from v1.0/v1.1 Character Files

Character files created in v1.0.0 or v1.1.0 are **automatically migrated** to the new format when imported. No manual action required.

**What happens during migration:**
1. Legacy powers with effectId + ranks + modifiers are wrapped into components[0]
2. Legacy Alternate Effects are similarly wrapped
3. All data is preserved (ranks, modifiers, notes)
4. File is re-exported with schemaVersion: "2.0.0"

**Verification:**
- After import, verify power costs match expected values
- Check that all modifiers are present
- Confirm Alternate Effects display correctly

If you encounter issues, please report at: https://github.com/GuiMayer/mm3e-builder/issues

---

## Links

- **Live App**: https://guimayer.github.io/mm3e-builder/
- **Repository**: https://github.com/GuiMayer/mm3e-builder
- **Issues**: https://github.com/GuiMayer/mm3e-builder/issues
- **Documentation**: See docs/ folder

---

[1.4.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/GuiMayer/mm3e-builder/releases/tag/v1.0.0
