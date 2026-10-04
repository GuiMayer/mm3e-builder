# Power Builder modifier policy

The Power Builder leaves choices about generic Extras and Flaws to the player. The catalog's generic modifier list is available for every selected effect, in both the main power and Alternate Effects. For example, generic Limited can be applied to Movement or Senses.

## Effect-specific modifiers

Modifiers declared in an effect's own Extras or Flaws list are available only while editing that effect. The saved `isPowerSpecific` source flag keeps that choice tied to its effect, including when a generic modifier elsewhere shares the same ID. A modifier with an unknown or mismatched source is still rejected when saving.

## Diagnostics and saving

The Builder continues to calculate costs using the selected modifiers and show its existing diagnostics. Applicability warnings, modifier incompatibility warnings, maximum-rank diagnostics, and Accurate/Power Level diagnostics do not block saving the player's chosen combination. These messages are guidance for the player and GM.

Saving still requires a selected effect, a resolvable modifier source, and required configuration for effects that need it. Alternate Effects also use their dedicated array controls and retain their structural requirements.

## Independent applications

Generic and effect-specific modifiers may have multiple independent applications
on base, linked and alternate components, including Resource powers. Each entry
retains its own ranks, affected ranks, options and optional condition note.
Removing one application preserves the others. The catalog's `repeatable` flag
controls rank-based pricing within an application; it does not prohibit adding
another independent application.

`instanceId` is optional editing identity. Legacy entries remain valid without it;
the Builder creates identities in its draft and persists them only on save.
Activation and Removable retain their separate power-level controls.

The duplicate diagnostic lists every repeated modifier with its count.
`enforceDuplicateModifiers` controls only this warning's visibility. It is
available in desktop/mobile validation settings and persists with app preferences.
It does not impose a duplicate limit or hide other diagnostics.

## Character data

This policy changes no character schema, migration, or cost formula. Existing saved powers keep their modifier entries. New generic choices are stored as generic; choices from an effect-specific tab are stored as effect-specific.

The behavior is implemented by `src/features/power-builder/modifierApplication.ts` and `src/features/power-builder/powerSavePolicy.ts`, with regression coverage in `src/__tests__/modifierApplicationPolicy.test.ts`.

## Projected budgets

The editor shows the saved purchase/resource cost, draft cost and difference,
plus projected PP/EP spent, available and remaining. Preview uses temporary
replacements and the canonical point summary; it never mutates characters,
Resources, storage or history. Budget preferences control excess highlighting,
not visibility of the totals or permission to save.

The editor retains its original character context. Resource preview accounts
for free links, fixed contributions, alternate allocation, vehicle movement
and headquarters features. Unlinked Resources do not acquire an owner implicitly.
Expandable details cover other linked characters currently open in this browser.
Underlying headquarters effect PP and charged Resource EP remain distinct.
