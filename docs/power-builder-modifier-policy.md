# Power Builder modifier policy

The Power Builder leaves choices about generic Extras and Flaws to the player. The catalog's generic modifier list is available for every selected effect, in both the main power and Alternate Effects. For example, generic Limited can be applied to Movement or Senses.

## Effect-specific modifiers

Modifiers declared in an effect's own Extras or Flaws list are available only while editing that effect. The saved `isPowerSpecific` source flag keeps that choice tied to its effect, including when a generic modifier elsewhere shares the same ID. A modifier with an unknown or mismatched source is still rejected when saving.

## Diagnostics and saving

The Builder continues to calculate costs using the selected modifiers and show its existing diagnostics. Applicability warnings, modifier incompatibility warnings, maximum-rank diagnostics, and Accurate/Power Level diagnostics do not block saving the player's chosen combination. These messages are guidance for the player and GM.

Saving still requires a selected effect, a resolvable modifier source, and required configuration for effects that need it. Alternate Effects also use their dedicated array controls and retain their structural requirements.

## Character data

This policy changes no character schema, migration, or cost formula. Existing saved powers keep their modifier entries. New generic choices are stored as generic; choices from an effect-specific tab are stored as effect-specific.

The behavior is implemented by `src/features/power-builder/modifierApplication.ts` and `src/features/power-builder/powerSavePolicy.ts`, with regression coverage in `src/__tests__/modifierApplicationPolicy.test.ts`.
