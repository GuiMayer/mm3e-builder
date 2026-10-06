# Test suite

Vitest covers pure calculations, data contracts, storage coordination, editor
models and export generation. Test counts and coverage percentages are properties
of a particular run; obtain current results from the suite rather than treating
historical reports as a compliance guarantee.

## Commands

Run from the repository root:

```sh
npm test -- --run
npm test -- mathEngine.test.ts
npm test -- --run characterFile.integration.test.ts campaignMigration.test.ts
```

`npm test` starts watch mode. CI additionally runs lint, strict type checking,
a production build and static-asset verification. Optional UI/coverage commands
in package.json may require their matching Vitest packages; they are not CI gates.

## Coverage by contract

| Area | Representative suites |
| --- | --- |
| Costs and contextual ranks | `mathEngine`, `auditedPricing`, `modifierRanks`, `altEffects`, `absentAbilities`, `pointSummary` |
| Modifier applications and policy | `modifierInstances`, `modifierApplicationPolicy`, `duplicateModifierWarnings`, `effectSpecificExtras` |
| Trait projections and recovery | `traitContracts`, `traitValues`, `traitCompatibility`, `powerUsage`, `modifierSourceRecovery` |
| Imports and schemas | `characterFile.integration`, `characterImport`, `fileService`, `importTesterFiles`, `identity` |
| Drafts and editing history | `characterDraftStorage`, `draftAutoLoad`, `draftUpdateBackup`, `characterHistory`, `charactersStore.integration` |
| Campaign | `campaign`, `campaignActions`, `campaignMigration`, `campaignExports` |
| Resources | `resourceRules118`, `resourceStorageSafety`, `resourceReview`, `resourceImport`, `resourceActions`, `resourceExports` |
| Library | `powerLibrary`, `powerLibraryCatalog`, `powerLibraryRules`, `personalPowerModel` |
| Portraits | `portraitStorage`, `portraitCompatibility`, `portraitJsonExport`, `portraitPdf`, `portraitBundle`, `portraitBundleExport`, `portraitImages` |
| References and localization | `references119`, `referenceLocalization119`, `measurementPreferences`, `localizationCoverage`, `offenseLocalization` |
| Themes and dice | `customTheme`, `customThemeStorage`, `colorInput`, `diceRoller`, `diceCheckSources`, `diceWindowPosition` |
| Export content and safety | `exportCorrections`, `pdfHtmlSafety`, `campaignExports`, `resourceExports` |

Names in the table identify `.test.ts` files in this directory. A unit test for
an isolated helper does not demonstrate integration in the user workflow. Known
validation flags without integration are tracked in
[Pending work](../../docs/PENDENCIAS.md).

## Calculation regressions

Use the official source and a concrete mechanical composition to derive expected
results independently of the implementation. Cover relevant fractional boundaries,
partial ranks, repeated applications, dynamic arrays, global discounts and
Strength/Resource context. A test that simply copies an implementation formula
does not independently verify the rule.

Library expectations belong to test/recipe metadata. The runtime engine must
calculate from effects and modifiers without recognizing recipe names or using
printed prices as input. Preserve documented editorial differences.

## Compatibility and storage regressions

Use historical and current fixtures to check import, normalization, round-trip
and idempotence. Verify identifiers, order, original text, modifier options,
legacy pricing and supported extensions. Review migrations against actual saved
shapes before changing schemas; a new default must not silently erase old data.

Storage tests should exercise rejected/quota writes, verified backups, stale
windows, malformed records and recovery preservation where applicable. Mutations
must not report successful persistence after a failed write. Browser storage mocks
and fake IndexedDB are test tools, not substitutes for manual browser validation.

Dice, themes, consultation preferences and portrait bytes have separate data
boundaries. Check that they do not enter character JSON or editing history when
their contract excludes them.

## Export and UI verification

Inspect generated files, not only generator return values. Reopen Excel workbooks;
check HTML escaping, localized labels, point totals and linked Resource charges.
PDF changes also need visual inspection of pagination, repeated headers, clipping
and selectable text. `scripts/fixtures/pdf-layout-check.html` is an available
layout fixture.

Use synthetic data and an isolated browser origin for manual UI checks. Check
narrow/wide layouts, keyboard access, focus restoration, dialogs, touch targets,
source snapshots and both languages as relevant. There is no dedicated E2E suite
in the current CI workflow; manual checks and model tests cover different risks.

## References

- [Calculation contracts](../../docs/development/REGRAS_CALCULO_MM3E.md)
- [Architecture and persisted pipeline](../../docs/development/ARCHITECTURE_REFINED.md)
- [Contribution guide](../../CONTRIBUTING.md)
- Official rules in `docs/sources/`

One-off scripts that rewrite catalogs or generate old reports are not validation
gates. Do not execute them to reproduce obsolete documentation; review their
current purpose and output before using them.
