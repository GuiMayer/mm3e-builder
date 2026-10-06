# Character sheet field reference

This document maps sheet sections to the current application model. The official
sheet and Deluxe Hero's Handbook define the game concepts; the serialized contract
is defined by [types.ts](src/entities/types.ts), [schemas.ts](src/entities/schemas.ts)
and [constants.ts](src/entities/constants.ts). Field names below use the application's
camelCase names. Display labels and derived totals are not a separate JSON schema.

## File envelope

`ICharacterFile` contains `schemaVersion`, `exportedAt`, optional `language`,
`character` and an optional `appendix.resources`. Current character exports use
schema 2.3.0; historical 1.0.0, 2.0.0, 2.1.0 and 2.2.0 remain accepted. The Resource
appendix uses its independent version 2. Whole-Draft JSONL has version 1.

Import validation, normalization and migration are coordinated by
`src/services/character-file`. Do not replace schemas with the conceptual layout
of the paper sheet. Compatibility requirements are documented in
[Architecture](docs/development/ARCHITECTURE_REFINED.md).

## Character sections

| Section | Primary fields | Derived or external data |
| --- | --- | --- |
| Identity | Optional `characterId`; `header.name`, `player`, `identity`, `identityType`, `base` | Character identity is retained across ordinary saves |
| Series and description | Optional `header.series`, `gameMaster`, `gender`, `age`, `height`, `weight`, `eyes`, `hair`, `groupAffiliation` | Display text; no mechanical bonus |
| Points | `header.powerLevel`, `heroPoints`; optional `campaignMode`, `campaign`, `ppLog` | Available/spent/remaining PP use the canonical summary |
| Portrait | Optional `header.portraitUrl`, `portraitFit` | Image bytes and local-file association reside in IndexedDB |
| Abilities | `abilities` keyed by `str`, `sta`, `agl`, `dex`, `fgt`, `int`, `awe`, `pre`; `absentAbilities` | Effective ability and cost are calculated separately |
| Defenses | `defenses.dodge`, `parry`, `fortitude`, `will` contain purchased ranks | Defense totals, Toughness and initiative are derived |
| Skills | `skills[]`: `skillId`, `ranks`, `subtype`, optional `otherBonus` | Total includes effective ability and applicable bonuses |
| Advantages | `advantages[]`: `advantageId`, `ranks`, optional `subtype` | Definitions and localization come from the catalog |
| Powers | `powers[]` with components and alternate effects | Prices and targeted attack profiles are derived |
| Equipment | Legacy `equipmentNotes`; optional `equipment[]`, `resourceLinks[]` | Resource data lives in the independent library |
| Complications | `complications[]`: `title`, `description`, optional `type` | Narrative hooks; no automatic PP credit |
| Optional trait adjustments | `traitModifiers[]`, `components[].enhancedTarget`, `powerUsage` | Natural purchases remain separate from effective values; see [Trait modifiers](docs/guides/trait-modifiers.md) |
| Other text | Optional `notes`, `manualOffenseRows[]` | Manual attacks preserve user-authored bonus, effect text and notes |

An absent ability is recorded in `absentAbilities`; its numeric value remains in
`abilities`. It contributes −10 PP and effective zero to derived calculations.
Do not encode absence as a null score or erase the original numeric value.

## Power structure

`ICharacterPower` has `id`, `name`, `notes`, `components`, `alternateEffects`,
optional `descriptors`, `baseDynamic`, `activation` and `removable`.

| Structure | Persisted fields |
| --- | --- |
| Component | `id`, `effectId`, `ranks`, `modifiers`; optional `variableCostOption`, `fieldValues`, `senseTraits` |
| Applied modifier | `modifierId`, `ranks`; optional `instanceId`, `isPowerSpecific`, `option`, `options`, `affectedRanks` |
| Alternate effect | `id`, `name`, `components`, `dynamic`, `notes` |
| Structured sense purchase | `id`, `ranks`; optional `senseType`, `scope`, `detail` |

Cost definitions belong to the catalog. An applied modifier stores the purchase
and its source/configuration, not an authoritative price. `instanceId` is optional;
legacy modifiers without it remain valid. Repeated applications remain independent.
See [Modifier policy](docs/guides/power-builder-modifier-policy.md).

Component costs include fractional progression, partial modifiers, variable
packages and contextual Strength. Linked components are summed. Array slots
cost +1 PP for static alternates or +2 PP for dynamic alternates, plus +1 PP for
a dynamic base. A dynamic alternate already includes its static +1 PP charge.

Activation and Removable apply to the whole power. Removable discounts 1 PP per
5 PP rounded up; Easily Removable discounts 2 PP per 5 PP rounded up. Equipment
uses EP without applying the Removable discount again. Exact formulas and canonical
functions are in [Calculation rules](docs/development/REGRAS_CALCULO_MM3E.md).

## Resources and campaign

A Resource link contains `id`, `resourceId`, `isFree`, optional `contributionEP`
and `alternateSetId`. The Resource library stores gadgets, gear, custom items,
vehicles and headquarters. Device PP, equipment EP, shared contributions and
alternate groups are allocated from links; do not duplicate Resource powers in
`character.powers`. See [Resources](docs/guides/resources.md).

Campaign metadata contains `version: 1`, `initialPP` and `initialPowerLevel`.
Ledger entries retain `id`, `date`, `amount`, `note` and optional `kind`, `session`,
`reversesEntryId`. Disabled campaign mode retains the configuration and ledger.
The available budget is fixed starting PP plus the ledger while enabled, or
current PL × 15 while disabled. See [Campaign mode](docs/guides/campaign-mode.md).

## Derived values and boundaries

`calculateCharacterPointSummary` supplies section totals, PP remaining and EP
usage. Defense and attack profiles reuse shared calculators, including powers,
advantages and Resource context; simple paper-sheet formulas are not complete
substitutes for those calculators. PL defense limits are paired sums, while
non-offensive skills use the total bonus limit PL + 10. Attacks use attack bonus
plus effect rank ≤ 2 × PL; Area/Perception effects without attack checks use
rank ≤ PL.

Interface themes, accordion state, measurement preferences, PDF preferences,
dice history and editing history are outside character JSON. Local portrait
bytes are also excluded; only the optional URL and display fit are portable.
See [Portraits](docs/guides/character-portraits.md) and [Dice roller](docs/guides/dice-roller.md).

## Adding fields

Update types, runtime schema and defaults together. Add normalization only when
an older shape requires migration. Verify old-file import, round-trip, defaults,
relevant calculations and affected exports. Preserve identifiers, original text,
unknown supported extensions and recovery backups. New UI preferences should
not become character fields without a data-model requirement.
