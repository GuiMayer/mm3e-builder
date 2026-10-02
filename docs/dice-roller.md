# Session dice roller

## User workflow

The roller starts hidden. On desktop, a semicircular d20 button on the right
edge opens a floating panel. At widths up to 768 px, a floating button opens
a bottom drawer. The opener disappears while the drawer is open. The panel
slides in from the right on desktop and from below on mobile, reversing that
movement when closed; reduced-motion preferences disable the transition.
Results appear immediately, without dice animation.

The manual form rolls **d20 + an integer bonus**, initially 0. Negative bonuses
are supported. A manual result contains only the formula and result: it has no
character, section, action label, or source.

Sheet buttons reuse the displayed check bonus. They record the character,
section, action, and applicable power/resource/component details at the time
of the roll. Later sheet edits and language changes do not rewrite old results.
Rolling from the sheet leaves the panel closed and shows a dismissible result
notice for five seconds. Opening the panel removes that notice.

## Available checks

| Location | Behavior |
| --- | --- |
| Abilities | d20 + the present ability's rank; absent abilities have no button |
| Skills | d20 + effective ability + skill ranks + miscellaneous bonus |
| Defenses | Initiative, Fortitude, Will, and derived Toughness; Dodge and Parry remain static defenses |
| Targeted Effects | The existing attack bonus for profiles requiring an attack check, including power, alternate-effect, linked resource, unarmed, and custom sheet profiles |
| Advantages | Explicit shortcuts to the relevant skill, initiative, resistance, or attack; advantage ranks are never used directly as a die bonus |
| Skill Mastery | A distinct **10** button for a routine check, using the selected skill's total; the ordinary skill button still rolls d20 |

Skill shortcuts cover Assessment, Agile Feint, Startle, Taunt, Tracking,
Inventor, Ritualist, Well-informed, Fascinate, and Daze when their associated
skill can be identified. Multiple possible skills or attacks open a compact
choice list. Ritualist offers the character's Expertise entries for the player
to select the appropriate one. Legacy skill subtype references in either
supported language remain readable. Passive advantages have no arbitrary roll.

Area and Perception profiles without an attack check have no attack button.
The roller displays numbers; the player determines eligibility, circumstances,
success, critical effects, and damage. Existing calculations and warnings are
unchanged.

## History and data boundaries

- History starts with capacity **15**, newest first, and spans character tabs.
- The field at the bottom accepts a positive safe integer, such as 30. Enter
  or leaving the field applies it. Empty, fractional, zero, and negative values
  do not change the current capacity.
- Reducing capacity discards the oldest entries. Increasing it does not restore
  discarded entries. Clear removes results without changing capacity.
- Closing the panel and switching app views retain history. **Reloading or
  closing the application clears history and restores capacity 15.**
- `useRollSession` stores these values only in memory. It has no persistence
  middleware and writes neither localStorage nor sessionStorage.
- Rolls never update character fields, dirty revisions, character undo history,
  JSON/JSONL, PDF, or Excel. No schema or migration was added.
- `randomD20` uses Web Crypto with rejection sampling to avoid modulo bias.

## Implementation steps and validation

1. Session model/store, hidden responsive panel, manual form, and configurable history.
2. Sheet check buttons, immutable source snapshots, shared skill totals, and explicit advantage shortcuts.
3. Responsive/accessibility refinements, documentation, and complete validation.

`diceRoller.test.ts` covers random generation, manual/source behavior, history
limits, notices, and routine checks. `diceCheckSources.test.ts` covers shared
skill totals, bilingual references, scoped skills, advantage handling, and
preservation of character contents/revisions/edit histories while rolling.

The actual App was checked with isolated synthetic characters at 390, 960,
and 1280 px, plus 667 × 375 landscape. Checks included collapsed defaults,
source-free manual rolls, contextual notices, multi-choice advantages,
cross-character history, capacity 30, trimming, and reset after reload.
