# Changelog

All notable changes to the MM3E Character Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Added a structured **Impervious Resistance** utility effect for Impervious bought directly on an existing resistance. It costs 1 PP/rank and never increases the underlying defense.
- Added a reproducible community-sheet audit command that validates and recalculates the 63 generated character files with the production pricing engine.
- Added an explicit, backward-compatible **Strength-based Damage** option. It contributes effective Strength to effect rank and resistance DC without charging those ranks again.
- Added optional absent-ability warnings for dependent skills, purchased defenses, and Strength-based Damage.

### Changed
- The Power Builder now uses one shared parameter editor for main and alternate effects, including modifier ranks, affected ranks, localized subtypes, and canonical cost previews.
- Repeatable per-rank modifiers are declared explicitly. Adding an ordinary non-repeatable modifier twice no longer changes its price accidentally.
- Configurable effect fields and their options now use the active game-data translation.
- Effective ability ranks are derived in one place across the sheet, PL validation, targeted effects, PDF, and Excel; stored ranks remain intact while an ability is absent.
- Range and duration applicability warnings now appear live in the Power Builder without preventing saves.

### Fixed
- Corrected Affliction to 1 PP/rank regardless of its three failure degrees.
- Corrected Teleport Increased Mass to charge every purchased modifier rank.
- Corrected Variable Action pricing for Move (+1/rank), Free (+2/rank), and Reaction (+3/rank), while preserving legacy JSON records that encoded the choice as ranks 1–3.
- Corrected each absent ability to cost −10 PP and contribute rank 0 mechanically, as defined by the source rules.
- Corrected Increased Duration to one application: Instant becomes Concentration and Sustained becomes Continuous. Legacy rank values remain readable but are not charged repeatedly.
- Added a one-time calculation revision 4 notice for existing priced drafts. Persisted character data and the character JSON schema are unchanged.

### Quality
- Replaced or removed all 16 pending tests: obsolete/duplicated cases were deleted and valid rule expectations became executable regressions.
- Expanded the verified suite to 46 test files and 657 passing tests with no pending tests.
- Recalculated all 63 generated community sheets: all remain structurally and semantically valid, and 34 of 57 complete sources match their independently published sums under revision 4.

---

## [1.11.0] - 2026-08-16

### Added
- **Resources Library**: Added a reusable library for Gadgets, Gear, Vehicles, Headquarters, and custom resources. Characters now link to library items instead of copying them, with Equipment Point calculation and a GM-granted/free toggle.
- **Vehicle and Headquarters resources**: Added structured sizes, traits, features, systems/effects, and Power Builder integration for Vehicles and Headquarters.
- **Targeted Effects view**: Replaced the attack-only presentation with a grouped view of attack rolls, resistance-based effects, areas, Perception effects, Affects Others effects, linked resource effects, and custom entries.
- **Draft and Resource transfer**: Added JSONL export/import for the complete Draft (characters, open tabs, active tab, and Resources) and for the Resource library by itself.
- **Update safety backup**: When a new application version can migrate existing local data, the user can export a pre-update JSONL snapshot before migration continues.
- **Per-character undo/redo refinements**: Added restoration of recently closed character tabs, continued field-edit grouping, and independent runtime-only history for the Resource library.
- **Power Builder refinements**: Added multi-descriptor editing, structured Senses trait purchases, partial modifier ranks, conditional modifier costs, and further fixed, fractional, and variable-cost rule support.

### Changed
- **Architecture**: Refined the internal architecture without changing the public product scope: the application remains static, local-first, and deployable to GitHub Pages. Character defaults, operations, file processing, draft persistence, editor models, and exports now have focused boundaries.
- **Identity and import behavior**: Centralized UUID generation across characters, tabs, and Resources. Imports resolve identity conflicts without replacing an existing character unintentionally.
- **Persistence**: Draft saves now use revision-aware, transactional writes. Legacy drafts and legacy equipment are preserved, recoverable, and migrated only after validation.
- **PDF export**: The default exporter uses `jsPDF.html()` with selectable text and measured pagination. It keeps supported entries together when possible, while the official fillable PDF remains available as the legacy exporter.
- **UI consistency**: Replaced browser-native confirmation prompts with themed application dialogs; standardized form controls and translated the new Resource, recovery, and dialog flows in English and Brazilian Portuguese.
- **Build and deploy**: PDF and Excel code remains loaded on demand; static-build verification and deployment safeguards are part of the standard pipeline.

### Quality
- Expanded the automated suite to 42 test files and 626 passing tests, covering character and Resource persistence, migrations, identity, imports, histories, targeted effects, Power Builder behavior, PDF safety, and pagination.
- Kept strict type checking, linting, production build, and static-build verification as release gates.

### Documentation
- Updated the README, architecture guide, and future-expansions roadmap for the current Resource, draft, export, and PDF behavior.

---

## [1.10.0] - 2026-06-13

### Added
- **Multi-Character Tabs System**: Work on multiple characters simultaneously with full tab management
  - Character tabs with drag-and-drop reordering
  - Per-tab auto-save with dirty state tracking (• indicator)
  - Smart import based on characterId matching to prevent duplicates
  - Duplicate character functionality with automatic characterId regeneration
  - Tab labels showing character name or "Unnamed Character"
  - Multi-character persistence system with charactersStore
  - useActiveCharacter hook for accessing active character state
- **Advantage Subtypes System**: Take advantages multiple times with different subtypes
  - 8 advantages with subtype support: Skill Mastery, Favored Foe, Favored Environment, Ultimate Effort, Benefit, Daze, Fascinate, Second Chance
  - Hybrid mode for Improved Critical (stack ranks OR create multiple instances)
  - Automatic migration for existing characters (adds subtype: null field)
  - Subtype validation logic ensuring required subtypes are provided
  - Multi-instance UI with dropdown/autocomplete for subtype selection
- **Skill Mastery Dropdown**: Replaced text autocomplete with smart dropdown
  - Shows only character's actual skills
  - Excludes skills that already have Skill Mastery
  - Handles subtyped skills correctly (e.g., "Expertise: Magic")
  - Works in both hybrid mode and regular mode
- **Portal Rendering Fix**: Modal overflow clipping resolved for autocomplete dropdowns
  - Renders dropdowns directly to document.body using React Portal
  - Dynamic positioning with fixed coordinates
  - z-index: 10000 to appear above modals

### Changed
- **Performance Optimizations**: Significantly improved load times and caching
  - Lazy loading for heavy features (ReferencesView, PowerBuilderOverlay)
  - Vendor chunk splitting into 9 separate chunks (excel, pdf, dnd, icons, react, i18n, validation, state, game-data, locales)
  - Better browser caching for production builds
- **UI Improvements**: Enhanced user experience across multiple areas
  - Fractional cost display in Power Builder UI
  - PP budget toggle respected in menu indicator
  - Character reset now requires confirmation dialog
  - Skill validation corrected to follow official M&M 3e rules (PL + 10 limit)

### Fixed
- **Data Quality - Advantages**: 7 corrections to match official M&M 3e Hero's Handbook
  - **Improved Hold**: Corrected escape penalty description (-5 circumstance penalty)
  - **Languages**: Fixed to exponential progression formula (2^(rank-1): 1→2→4→8→16→32→64 languages)
  - **Beginner's Luck**: Expanded description with full Hero Point mechanics and routine check limitations
  - **Daze**: Expanded with complete interaction check mechanics, immunity rules, and dazed vs stunned effects
  - **Improvised Weapon**: Enhanced description with damage bonus details and weapon proficiency clarification
  - **Fascinate**: Expanded with target count mechanics, interaction requirements, and entranced condition details
  - **Takedown**: Corrected to remove "close attack" restriction and clarify "same attack modifiers" rule
- **Validation Improvements**: Enhanced rules enforcement
  - Luck advantage PL validation (max rank = PL ÷ 2, rounded down)
  - Effect-specific extras now validated as proper modifiers
  - Alternate Effects validation: unique names enforced, duplicate modifiers prevented
  - Skill rank cap corrections (PL + 10 for trained skills per official rules)
- **Export Fixes**:
  - PDF: Power Point Totals now show numeric values instead of strings
- **Multi-Character System Fixes**:
  - Fixed infinite loops in useAutoLoadDraftMulti
  - Regenerate characterId when duplicating characters
  - Mark new character tabs as dirty to enable auto-save
  - Remove markCharacterClean after load/clear to enable auto-save
  - Migrate MenuBar to use multi-character draft APIs
  - Flush draft to localStorage before export
- **Schema Compatibility**:
  - Added descriptors field to schema for JSON import compatibility
  - Added equipmentNotes property to character schema
- **TypeScript Fixes**:
  - Resolved TypeScript errors in Phase 3.5 of multi-character implementation
  - Fixed configurable fields and validation test errors

### Documentation
- Complete audit reports for advantages corrections in docs/audit/
- Commits analysis document: docs/analysis/commits-v1.9.0-to-v1.10.0.txt

---

## [1.9.0] - 2026-05-14

### Added
- **Empty Component Detection**: Automatic cleanup of empty power components
- **Visual Incompatibility Warnings**: Real-time warnings for incompatible modifiers in UI

### Fixed
- React StrictMode race condition in draft auto-load
- sessionStorage blocking draft reload
- isDirty flag reset after successful auto-save

### Documentation
- Updated checklist marking empty component detection as completed

---

## [1.8.0] - 2026-05-14

### Added
- **Power Descriptors System**: Visual descriptor tags for powers
- **Modifier Incompatibilities**: Validation system for incompatible modifiers
- **Variable Cost Powers**: Support for powers with variable cost per rank
  - Affliction variable cost by condition degree
  - Enhanced Trait variable cost support
  - Environment variable cost documentation

### Changed
- Device toggle replaced with Removable modifier badge in PowerBuilder
- Equipment now uses PowerBuilder for consistent power creation
- Optimized Zustand selectors to prevent unnecessary re-renders

### Fixed
- **Auto-Save System Fixes** (5-phase refactoring):
  - Infinite loop in useDraftAutoSave
  - loadCharacter dependency issues in useAutoLoadDraft
  - isDirty flag reset after successful auto-save
  - Loop protection in saveDraft
  - Removed debug logs
- **Equipment Fixes**:
  - EP cost calculation corrected
  - Removed false removable flag
  - EP limit exceeded warning with calculation breakdown
  - Cached getSnapshot result to prevent infinite loop
  - Removed duplicate useCalculatedPP declaration
- **Mobile Refinements**:
  - Header color in unlimited mode
  - Mobile menu translation
  - NumberInput button sizes for mobile
  - Panel layouts optimized for mobile
- **Power Builder**:
  - Mobile drawer with 3-phase implementation
  - UX and accessibility improvements
  - Performance optimizations
  - Modifier layout for mobile devices
- Sustained/Permanent_flaw bidirectional incompatibility
- TypeScript errors in usePLValidation
- Reverted to stable hooks version (commit 43078d9)

### Documentation
- Complete MM3E v1.4.1 audit
- Environment variable cost documentation
- Affliction correction documentation
- Progress tracking document

---

## [1.7.0] - 2026-05-13

### Added
- **Equipment System (F-15)**: Complete equipment builder
  - IEquipmentItem type and schema with migration support
  - useEquipmentCalculations hook for EP tracking
  - EquipmentBuilder component with PowerBuilder integration
  - Equipment integration in CharacterSheet
  - Full i18n translations for equipment system
  - Shows only when Equipment advantage is selected

---

## [1.6.0] - 2026-05-13

### Added
- **Complete Mobile Responsiveness**: Full mobile optimization
  - Responsive design system with breakpoints and tokens
  - Navigation drawer with hamburger menu
  - Responsive layouts for SheetView, PowerBuilder, and all core panels
  - WCAG 2.1 AA compliant touch targets (44×44px minimum)
  - Mobile-optimized AbilitiesPanel, SkillsPanel, DefensesPanel, AdvantagesPanel
  - Floating Action Button (FAB) for mobile navigation
  - Theme and language selectors in mobile drawer
  - Validation rules toggle in mobile drawer

### Fixed
- NumberInput double-increment bug on touch devices
- Mobile drawer height issue
- Desktop-specific hiding of mobile drawer and FAB
- strictMode parameter in usePowerCostCalculation

---

## [1.5.0] - 2026-05-11

### Added
- **Draft Auto-Load System**: Automatic recovery of unsaved work
  - Auto-load draft functionality on app start
  - Draft notification banner with metadata
  - Clear draft option in settings
  - Comprehensive test coverage for draft recovery
- **Custom NumberInput Component**: Themed spinbox controls
  - Integrated across all panels (Abilities, Skills, Defenses, Advantages)
  - Improved accessibility and touch targets
  - Consistent styling with app theme

### Technical
- Refactored NumberInput integration in 3 phases
- Added draft metadata tracking

---

## [1.4.1] - 2026-05-11

### Fixed
- **Excel Export Corrections**:
  - Fixed PP calculation in campaign mode to include PP Log adjustments
  - Added missing Toughness stat to Defenses sheet
  - Added missing Initiative stat to Defenses sheet
  - Corrected total PP calculation to use actual spent PP instead of PL-based estimate
- **PDF Export Corrections**:
  - Fixed Toughness calculation to include both STA and purchased ranks
  - Fixed Initiative display to show AGL bonus correctly

### Added
- **Campaign Mode Enhancements**:
  - New PP Log sheet in Excel export showing full award/deduction history
  - Running total display for PP tracking
  - Color-coded positive/negative PP adjustments
- **Test Coverage**:
  - Added comprehensive tests for export corrections
  - Validates PP calculations in campaign mode
  - Tests defense stats inclusion (Toughness, Initiative)
  - Validates skill formatting with/without subtypes

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
| 1.11.0 | 2026-08-16 | Resources, draft recovery, Targeted Effects, and PDF export | 2.0.0 |
| 1.10.0 | 2026-06-13 | Multi-Character Tabs + Advantage Subtypes | 2.0.0 |
| 1.9.0 | 2026-05-14 | Empty Component Detection | 2.0.0 |
| 1.8.0 | 2026-05-14 | Power Descriptors + Variable Cost | 2.0.0 |
| 1.7.0 | 2026-05-13 | Equipment System | 2.0.0 |
| 1.6.0 | 2026-05-13 | Mobile Responsiveness | 2.0.0 |
| 1.5.0 | 2026-05-11 | Draft Auto-Load + NumberInput | 2.0.0 |
| 1.4.1 | 2026-05-11 | Export Corrections | 2.0.0 |
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

[1.11.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.10.0...v1.11.0
[1.10.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/GuiMayer/mm3e-builder/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/GuiMayer/mm3e-builder/releases/tag/v1.0.0
