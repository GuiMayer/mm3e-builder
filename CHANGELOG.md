# Changelog

All notable changes to the MM3E Character Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added — Favorite references
- Add independent favorite stars to every reference section header and show Favorites as the first category only while at least one section is starred.
- Persist stable section IDs in a dedicated browser preference, preserving selections across characters, languages and reloads; fall back to session memory when storage is blocked.
- Scope search to starred sections within Favorites, reuse existing tables and calculators, and return to At the table with keyboard focus when the last favorite is removed.
- Keep character data, export formats, rule calculations and migrations unchanged.

### Fixed — Imports containing unconfigured resources
- Accept the untouched initial resource power slot in character appendices, Drafts and resource libraries, matching the resource editor's supported state without removing or rewriting data.
- Keep invalid character powers and partially configured resource effects rejected; report resource validation failures under their own resource path rather than character powers.

### Added — Portable local portraits
- Offer optional ZIP export when characters or full Drafts contain manually uploaded portraits; keep standalone JSON/JSONL and URL-based portraits unchanged.
- Import ZIP through existing character/Draft actions, preserving tabs, resources, fit and identity conflict choices. Restore imported portraits to IndexedDB, with new associations for copied characters.
- Validate archive paths, expansion limits, image signatures and identity references before persistence; compensate image and data writes on failure. Preserve already-sized image bytes without recompression.
- Keep character schema 2.3.0 and Draft version 1 unchanged. Update portrait guidance and remove the completed portability backlog item.

### Added — Optional trait adjustments and explicit enhancement targets
- Add per-trait controls for scoped circumstance bonuses and targeting or creating Enhanced Trait powers. Keep natural purchases separate from effective values and offer source editing shortcuts.
- Resolve active, exclusive and dynamically allocated enhancements, including resource recipient choices and Permanent duration; use shared projections in rolls, PL checks, PDF and Excel without double charging.
- Character schema 2.3.0 introduces optional targets, modifiers and usage state. Legacy targetless enhancements and manual skill bonuses remain unchanged until explicit editing.

### Fixed — Legacy modifier source recovery and import compatibility
- Distinguish invalid explicit origins, ambiguous legacy origins and unknown modifier identifiers. Review selected repairs before persistence, with canonical before/after costs and verified original backups.
- Cover character/resource imports, JSONL, local drafts, storage snapshots and the Builder; preserve independent modifier instances and project shared-resource costs into open linked sheets.
- Include zero-rank skills with manual bonuses in filled PDFs, preserve optional cost categories/configuration from flat legacy powers, and keep enhancement projections and exports consistent after edits.

### Added — Builder budgets and optional Affliction configuration
- Show saved/draft costs, projected PP/EP and remaining budget using the canonical summary. Keep the character of origin fixed; shared-resource details cover linked sheets open in this browser.
- Add optional degree/condition/recovery fields for Affliction, including Limited Degree, simultaneous Extra Conditions and Variable Conditions. Preserve legacy notes; references, PDF and Excel show stored selections.

### Fixed — Rule diagnostics and catalog references
- Translate semantic, required-field, pricing and nested import diagnostics at presentation time. Preserve severity, save policy and user-authored text.
- Resolve usage action, maintenance and duration through generic/specific definitions and order-independent supported transitions. Ambiguous combinations remain advisory and provisional; prices are unchanged.
- Connect trained-only skill warnings to skills and advantage roll shortcuts, with Jack-of-all-trades support and independent preferences. Manual rolls and history are unchanged.
- Identify legacy/recommended Summon and Healing modifier definitions and correct their reference descriptions without converting IDs or historical costs.
- Keep four Sustained Affliction recipes reference-only pending a supported general composition; no invented modifier or price override.

### Changed — Duplicate modifier notices
- List every repeated modifier and its application count as an advisory Builder notice, localized in English and Portuguese, including linked and alternate effects.
- Settings on desktop and mobile can hide only these notices. Reuse the existing browser preference; keep other warnings, saving, costs and character JSON unchanged.
- Verified with 83 files / 1,904 passing tests, typecheck, lint, production build and static verification; browser checks confirmed independent visibility and persistence after reload.

### Changed — Independent modifier applications
- Adding an extra/flaw again creates a separate application, with independent ranks, affected ranks, options, notes and removal on base, linked and alternate components.
- Repeated applications are numbered in the Builder. Player/GM choices remain saveable with the existing diagnostic messages and power-specific scoping.
- Optional modifier instance IDs survive JSON import/export. Legacy sheets remain valid; identities are prepared only in an editing draft, with no automatic rewrite or price migration.
- Verified with 82 files / 1,900 passing tests, including independent partial-rank costs and legacy/JSON round trips.

## [1.20.0] - 2026-10-03

### Added — Power Profiles library
- Four-square library actions on base, linked and alternate effect headers.
- 39 book chapters with 982 bilingual recipes/variants, searchable without accent sensitivity, source configuration, editable previews and costs from the normal rules engine.
- 13 catalog commits containing three chapters each. Fixed functional ranks remain intact; scalable effects start at one.
- Seven reference-only recipes clearly identify character-level changes or unsupported Sustained Affliction duration; partial recipes cannot be applied.
- Editorial price discrepancies are shown and documented rather than forced with artificial modifiers.
- Chapter chunks load on demand. Applied powers are independent copies in the existing sheet format; no migration or legacy price changes.

### Validation
- Full suite: 81 files / 1,893 passing tests, including all recipes at ranks 1, 5 and 10; typecheck, lint, production build and static verification.


### Changed — Power Builder layout
- Fit existing power and alternate-effect notes when their editor opens,
  retaining manual vertical resizing and the two-row minimum for empty notes.
  Keep sizing out of sheet data.
- Clarify the Dynamic toggle as an additional 1 PP (2 PP total per alternate),
  with localized explanations of the shared budget and the separate 1 PP
  charge for a Dynamic base effect. Preserve the existing pricing rules.
- Remove the redundant Add Modifier selector from alternate effects; keep
  palette click-to-add, drag-and-drop and the mobile palette action.
- Improve desktop reference readability with a wider description column,
  14px text, balanced line spacing and a separate metadata row. Preserve
  the existing mobile reference typography and spacing.
- Show alternate and their linked effect descriptions in the same responsive
  reference panel as the base effect. Render only one plus icon on the linked
  and alternate effect buttons in both languages.
- Tighten wrapped PP summary rows with a 4px vertical gap and compact line
  height, preserving horizontal spacing and all cost calculations.
- Present mobile modifiers as compact rectangular cards with name, cost and
  removal in the header, labeled rank controls and full-width options. Reuse
  the layout for base, linked and alternate effects without changing values.
- Place the effect description and reference metadata to the right of the
  selector, ranks and modifiers. Stack the panels when the component card is
  narrow, preserving rules, warnings, costs and character data.

### Added — Sheet preferences
- Remember the Character Details accordion state per persistent character ID in
  localStorage. Keep new sheets collapsed by default and UI preferences out of
  character JSON, calculations and undo history.

### Added — Character portraits
- Click the sheet avatar to choose an HTTPS image link or a browser-local file,
  preview, enlarge, replace, refresh or remove the portrait.
- Store image files separately in IndexedDB; keep optional portrait URL and
  display fit in character schema 2.2.0, preserving older sheet compatibility.
- Preview and save portrait fit: preserve proportions with borders, center crop
  or stretch to fill. Reuse the choice in the sheet and HTML/PDF without changing
  the original image; allow fitting an existing portrait without reloading it.
- Share the portrait frame between the sheet and editor preview, using the
  actual responsive frame dimensions and preserving proportions when enlarged.
- Explain local-only persistence before file selection and during JSON export;
  preserve local portraits across character copies and include them in clear-all.
- Enlarge the HTML/PDF portrait to span the entire header, including details
  and point totals, with its bottom aligned to the section separator. Preserve
  contain/cover/stretch in PDF canvas rendering without rasterizing sheet text.
- Add opt-in portrait inclusion in the compact HTML/PDF header, preserving text
  selection and exporting without the image when it is unavailable.
- Document persistence, CORS fallback, image limits and legacy PDF limitations.


### Fixed
- Save the language-based measurement default on the first References visit even without clicking the toggle. Later language changes preserve that preference; explicit unit selections continue updating it.
- Allow an intermediate minus sign/empty value while typing measurement ranks, retaining the last valid result until the number is complete. Preserve keyboard arrows and rank selection without changing the shared character inputs.
- Pack References panels independently into the available column height, removing gaps caused by a taller neighbouring card. Reflow on expansion, search and resizing without remounting query fields; retain wide tables and the single-column mobile layout.

### Added
- Persist the reference measurement system under its own localStorage preference key; restore it across view/app reopening, with language defaults and graceful handling of unavailable storage.
- Visible Metric/Imperial toggles on Measurements and Size tables, sharing the current consultation selection. Convert size heights to metres/centimetres while preserving all official modifiers and the original imperial benchmarks.
- Remove the Measurements rank field's −5/30 bounds. Extrapolate from the official endpoints by doubling/halving each measure per rank, preserving published rounded values and both unit systems; show scientific notation for extreme magnitudes without infinity/underflow.

The retrospective commit packages and preserved historical tags are documented
in [Version history](docs/version-history.md). Release dates identify the
completion commit, not a verified deployment date.

---

## [1.19.0] - 2026-10-03

### Added
- Official imperial/metric Measurements Table (ranks −5 to 30), size modifiers, DC examples, ability benchmarks, material Toughness and PL limits. Printed Handbook page references accompany every panel.
- Read-only degree/damage query tools and an optional 35 × 20 damage resistance matrix. Metric values preserve the official rounded scale instead of converting imperial values.
- Resource power/effect/modifier quick references and sheet shortcuts opening the selected resource/power directly in Resources, including vehicle movement and alternate effects.
- Independent resource duplication with localized unique names and fresh nested IDs, preserving notes/extensions/HQ settings and original links/costs. These three Resource follow-up commits were already deployed after the v1.18.0 tag.

### Changed
- Replace the long References view with 16 collapsible panels, topic navigation, bilingual/accent-insensitive global search, keyboard controls and mobile summaries. Wide tables scroll within their own panels; the damage matrix mounts only when expanded.
- Review combat summaries against the supplied Deluxe Handbook, correcting Aid/Defend/Disarm/Escape/Grab/Recover/Trip/Slam/Team Attack reminders. Reuse existing condition data without changing shared names or mechanics.
- Character schema 2.1.0, Resource version 2, Draft version 1 and calculation revision 6 remain unchanged. No migration, character store writes, cost changes or warning changes. [References guide](docs/references.md) records sources and compatibility.

### Quality
- 72 test files / 853 passing tests; lint, TypeScript/production build and static-asset verification passed. New checks cover literal rounded scales, fractions, degree boundaries, bilingual search, size baselines and localization.
- Isolated browser checks covered Portuguese/English, search, rank selection, units, damage matrix, collapse/expand and 390px layout with contained table scrolling. The existing update backup gate restored the synthetic 16/150 PP sheet unchanged; real user drafts were not accessed.

---

## [1.18.0] - 2026-10-02

### Added
- Explicit PP Device/EP Equipment acquisition, full vehicle movement powers and headquarters PL, Effect/Defense System and target settings. Contextual Builder and resource attack profiles use vehicle Strength or headquarters rules.
- Reviewed legacy acquisition/movement/PL migration with before/after costs, deferral, stable identities, verified original backups and preservation of configured movement. Character schema remains 2.1.0; Resource library/appendix is version 2 with version 1 reading.
- Ownership controls for free resources, shared EP contributions and alternate groups, structured features with notes, and collapsible cost details.
- Explicit local/shared/independent import conflict choices; independent copies only remap imported links. Missing references, duplicate identities and malformed appendices fail before changes.

### Fixed
- Devices enter PP once without being copied into character powers; ordinary equipment retains EP pricing without Removable discounts. Vehicle movement uses its actual effect cost; alternate groups charge the most expensive plus 1 EP per additional item, with shared headquarters paid separately.
- Preserve valid resources when another record is invalid, retain original bytes and unknown fields, and prevent normal writes over unreadable/future libraries. Verified writes precede store/history updates; quota, backup and stale-window failures preserve pending edits.
- Preserve feature IDs/notes and purchased trait improvements when changing vehicle size. Device protection uses personal-power stacking; ordinary equipment retains non-stacking protection.
- Match allocated PP/EP costs across sheet, PDF HTML, legacy PDF fields and Excel; include actual movement, feature notes, HQ context and localized descriptions in complete exports.
- Correct internal EP labels, resource-source translation, empty movement editing, extension-field retention and mobile footer wrapping without altering existing modifier diagnostics or adding generic modifier blockers.

### Quality
- 69 test files / 825 passing tests, type checking, lint, production build and static-asset verification. Added recovery, reviewed migration, official cost/context examples, import conflicts, quota/backup/stale-window checks and real PDF/Excel reopening.
- Isolated browser checks with synthetic sheets covered 10 EP → 8 PP acquisition, Flight 7 review, 18 EP vehicle systems, generic Limited on movement with undo, nonblocking headquarters effect budgets, feature notes, import cancellation/copies, English/Portuguese and 390px layouts. Real user browser drafts were not accessed; native Save dialogs were not automated.
- [Resources guide](docs/resources.md) and [commit packages](docs/version-history.md) document compatibility. Calculation revision is 6; no push/deploy is implied by this local release.

---

## [1.17.0] - 2026-10-02

### Added
- Reviewed startup migration only for old saved campaign characters, including inactive histories: starting PL/PP review, before/after totals, verified original local backup, download and storage-conflict protection. No frozen legacy budget policy remains.
- Compact campaign panel after the header, with optional sessions, full notes, editing, reversal entries, preview, session undo, per-character forms and search/order for histories of ten or more entries.
- Localized Excel Campaign sheet, including inactive campaigns; opt-in history in HTML-based PDF with repeated headings and budget context. JSON/JSONL transport the complete campaign state using additive character schema 2.1.0.

### Changed
- Campaign available PP now uses fixed starting PP plus the ledger. Raising PL changes character limits without granting PP again. Disabling preserves history/configuration and temporarily uses standard PL × 15.
- Preserve every old ledger ID, date, note, amount and order, including finite fractional amounts; validate new entries as nonzero integers with local valid dates. Expose the original migration backup in budget options.
- Characteristic pricing, modifier availability and existing rule warning messages remain unchanged. [Campaign guide](docs/campaign-mode.md) explains migration and compatibility.

### Fixed
- Prevent double-counting campaign advancement after raising PL, show signed negative adjustments correctly, retain PL above 15 on JSON export and keep pending campaign actions attached to their original tab.
- Translate effect names in Targeted Effects using the active-language catalog, including Affliction, power components, alternate effects and equipment. Keep custom names and manually typed effect text unchanged.
- Translate the Targeted Effects resistance column and difficulty abbreviation at display time (e.g. Toughness DC 16 → Resistência CD 16), retaining the original numerical DCs and calculation profiles.

### Quality
- 64 test files / 792 passing tests, type checking, lint, production build and static-asset verification. Migration tests cover original bytes, idempotence, quota, rollback and cross-tab conflicts; action tests cover targeted edits, duplicate legacy IDs and undo; Excel tests reopen real generated workbooks.
- Isolated browser checks cover reviewed migration (180 → 165 PP), NP changes, disable/reactivate, tab isolation, 320/390/768/960px layouts, long-history controls and seven-page PDF pagination with an oversized note. Real user drafts were not accessed.

---

## [1.16.0] - 2026-10-02

### Added
- Read-only rules dialogs directly on the sheet for powers, component effects, modifiers, whole-power Activation/Removable and alternate effects. Include localized descriptions, relevant catalog metadata, selected options, notes and descriptors; resolve effect-specific modifiers in their own effect's context.

### Changed
- Position shared tooltips with Floating UI, outside clipped panels and within viewport bounds. Long descriptions use a wider layout, readable line spacing and bounded scrolling; keyboard focus and Escape are supported.
- Use wider, responsive reference dialogs for skills, advantages, effects and modifiers in the sheet and Power Builder. Conditions and derived defense explanations use the shared tooltip/dialog presentation.
- Keep character data, schemas, calculation revision, rule calculations, modifier restrictions and warning messages unchanged. Consultations do not edit the sheet or catalog.

### Quality
- Four new tests cover modifier source resolution, localization fallbacks, alternate effects, missing catalog entries and preservation of input data.
- Verified with 58 test files and 770 passing tests, strict type checking, lint, production build and static-asset verification. Browser checks covered keyboard, descriptions and mobile widths of 320/390px without horizontal overflow.

---

## [1.15.0] - 2026-10-02

### Added
- Custom interface theme stored separately in localStorage, with 36 semantic color roles, opacity, isolated preview and informative contrast warnings. The Custom theme option appears only after a valid palette is saved.
- Modern color selection using react-colorful and colord, with typed/pasted HEX, RGB and HSL notation, alpha for compatible roles, and keyboard/touch controls.

### Fixed
- Apply custom colors consistently across the interface; retain the four built-in palettes.
- Let the editor inherit the active app theme; selecting a base immediately updates fields and preview before saving.
- Keep the top bar and settings above the draggable dice window.

### Documentation
- Group the commit history into annotated version tags, retain existing tags, and align current package metadata with 1.15.0. See the commit ranges and historical discrepancies in [Version history](docs/version-history.md).
- Theme and dice preferences do not change character schemas or exported character data. The existing pre-update backup notice follows the application version; no new migration was introduced.

### Quality
- Verified the consolidated version with 57 test files and 766 passing tests, strict type checking, lint, production build and static-asset verification (2026-10-02).

---

## [1.14.0] - 2026-10-02

### Added
- Hidden d20 roller with a desktop right-edge control and mobile bottom drawer, manual integer bonus, and session-only history: 15 results by default, configurable in the footer.
- Contextual rolls for abilities, skills, initiative, resistance checks and eligible attacks; explicit advantage shortcuts and Skill Mastery routine checks. Results snapshot their source, while manual rolls show only d20 plus bonus.
- Desktop dice window draggable by its header or keyboard, with session-only position and viewport bounds after resizing.

### Changed
- Slide the drawer into view, hide the opener while expanded, restore focus on close and respect reduced-motion preferences. Dice results remain immediate, without rolling animation.
- Align roll buttons at the right edge of rows/cards and group totals/actions consistently across the sheet, including mobile wrapping.

---

## [1.13.1] - 2026-10-02

### Fixed
- Allow generic Extras and Flaws on every effect, including Movement and Senses. Applicability, incompatibility, maximum-rank and PL diagnostics do not block Power Builder saves; effect-specific modifiers remain scoped to their own effect. Warning messages are retained.

### Documentation
- Document the player-controlled modifier policy and its limits.

---

## [1.13.0] - 2026-10-01

### Added
- Compact A4 HTML sheets with explicit pagination, embedded fonts and localized labels.
- Preview of the exported PDF, editable zoom with reasonable limits, discreet floating zoom controls, selectable text and an initial zoom of 100%.
- Printable worksheet mode with empty fields and writing space for filling by hand.
- Reproducible PDF stress fixture and documented layout checks.

### Changed
- Simplify content modes and optional sections, retaining customization without redundant controls.
- Preserve offline HTML export alongside PDF export.

### Fixed
- Preserve full alternate-effect and device details without changing stored character data.

---

## [1.12.1] - 2026-10-01

### Changed
- Adapt the top bar to desktop, intermediate and mobile widths; retain named actions and keep settings within the viewport.
- Improve PowerBuilder drag handles, explicit modifier sources, valid alternate-effect targets, keyboard navigation, full modifier labels and mobile palette controls.
- Sort and filter effect/modifier lists alphabetically by their displayed names in the active language, without mutating catalogs.
- Share point summaries, subscribe sheet panels to their own fields, cache pricing independently of descriptive edits and load PDF dialogs on demand.
- Price partial modifiers by rank boundaries instead of iterating through each rank; improve dialog focus and keyboard/touch access to derived defenses.

### Fixed
- Validate Accurate against the current character's PL, abilities and combat skills.
- Charge per-rank extras on Strength-based Damage's effective Strength contribution, consistently across the sheet, Builder, Resources, PDF and Excel.
- Separate partial Area and range attack profiles; preserve Alternate Resistance and combat-skill miscellaneous bonuses.
- Include linked armor in Toughness and PL checks without stacking equipment or activating alternate effects.
- Reject imported modifiers whose declared generic/effect-specific source does not resolve; correct legacy equipment costs and derived defenses in Excel.
- Clear cancelled drags and prevent saved drawer height from revealing a closed mobile palette.
- Announce calculation revision 5 once for existing priced drafts. Character JSON format remains unchanged.

---

## [1.12.0] - 2026-08-30

### Added
- Structured Impervious Resistance utility effect: 1 PP/rank, without increasing the underlying defense.
- Explicit Strength-based Damage option using effective Strength for rank and resistance DC without purchasing those ranks twice.
- Optional absent-ability warnings for dependent skills, purchased defenses and Strength-based Damage.
- Reproducible production-engine recalculation of the 63 generated community sheets.

### Changed
- Centralize contextual power costs and unify sheet/export totals, removing stale pricing paths.
- Share the parameter editor across main and alternate effects, including localized subtypes, modifier/affected ranks and canonical cost previews.
- Declare repeatable per-rank modifiers explicitly; ordinary non-repeatable duplicates no longer change prices accidentally.
- Derive effective ability ranks consistently while preserving stored ranks of absent abilities; show range/duration warnings without preventing saves.

### Fixed
- Price Affliction at 1 PP/rank regardless of its failure degrees, and charge every purchased rank of Teleport Increased Mass.
- Correct Variable Action pricing for Move (+1/rank), Free (+2/rank) and Reaction (+3/rank), preserving legacy rank-encoded choices.
- Charge each absent ability −10 PP and use effective rank 0 mechanically.
- Apply Increased Duration once: Instant → Concentration, Sustained → Continuous. Legacy repeated ranks remain readable without repeated charges.
- Add one-time calculation revision notices through revision 4, without changing the persisted character JSON schema.

### Quality
- Replaced or removed all 16 pending tests; retained valid rule expectations as executable regressions.
- Recalculated all 63 community sheets: all remain structurally and semantically valid; 34 of 57 complete sources match their independently published sums under revision 4.

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
  - Cost validation per AE with status indicators
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
| 1.16.0 | 2026-10-02 | Readable tooltips and direct power rules descriptions | 2.0.0 |
| 1.15.0 | 2026-10-02 | Custom themes and modern color picker | 2.0.0 |
| 1.14.0 | 2026-10-02 | Contextual dice rolls and draggable session window | 2.0.0 |
| 1.13.1 | 2026-10-02 | Player-controlled generic Extras and Flaws | 2.0.0 |
| 1.13.0 | 2026-10-01 | Compact A4 PDF, zoom preview and printable worksheet | 2.0.0 |
| 1.12.1 | 2026-10-01 | Rules corrections and responsive interface | 2.0.0 |
| 1.12.0 | 2026-08-30 | Central pricing, rules audit and structured power options | 2.0.0 |
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

[Unreleased]: https://github.com/GuiMayer/mm3e-builder/compare/v1.17.0...HEAD
[1.17.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.16.0...v1.17.0
[1.16.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.15.0...v1.16.0
[1.15.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.14.0...v1.15.0
[1.14.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.13.1...v1.14.0
[1.13.1]: https://github.com/GuiMayer/mm3e-builder/compare/v1.13.0...v1.13.1
[1.13.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.12.1...v1.13.0
[1.12.1]: https://github.com/GuiMayer/mm3e-builder/compare/v1.12.0...v1.12.1
[1.12.0]: https://github.com/GuiMayer/mm3e-builder/compare/v1.11.0...v1.12.0
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
