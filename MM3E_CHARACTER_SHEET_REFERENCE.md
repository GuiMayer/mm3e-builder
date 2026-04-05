# Mutants & Masterminds 3rd Edition — Character Sheet Field Reference

> Technical reference for all fields, attributes, and data structures present on the official M&M 3e character sheet, supplemented with archetype examples from the Deluxe Hero's Handbook.
> Intended as a specification document for application development.

---

## 1. Character Identity

Fields that identify the character and establish their place in the game world.

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Hero name / code name used in the field |
| `player` | `string` | Real name of the player controlling the character |
| `identity` | `string` | Civilian identity name; may be secret or public |
| `identity_type` | `enum` | `Secret` or `Public` — affects social interaction rules |
| `gender` | `string` | Character gender (free-form text) |
| `age` | `string` | Character age (may be relative, e.g. "immortal") |
| `height` | `string` | Physical height (e.g. `6'2"`) |
| `weight` | `string` | Physical weight (e.g. `195 lbs`) |
| `eyes` | `string` | Eye color or description |
| `hair` | `string` | Hair color or description |
| `group_affiliation` | `string` | Team, organization, or faction the character belongs to |
| `base_of_operations` | `string` | Primary city, headquarters, or location |
| `series` | `string` | Campaign or series name (set by GM) |
| `gamemaster` | `string` | Name of the Game Master running the series |

---

## 2. Power Level & Power Points

The two primary mechanical parameters governing a character's overall power.

| Field | Type | Description |
|---|---|---|
| `power_level` | `integer` | Power Level (PL). Sets the caps for the character's offensive and defensive traits. Standard starting PL is 10 (150 PP). |
| `power_points_hero` | `integer` | PP earned through play as a hero (used for advancement) |
| `power_points_earned` | `integer` | Total PP earned since character creation |
| `power_points_spent` | `integer` | Total PP spent on traits (must equal sum of section costs) |
| `hero_points` | `integer` | Meta-currency earned in play; spent to improve rolls or resist effects |

### Power Point Totals (breakdown)

The sheet tracks points allocated to each category separately, which must sum to the total spent.

| Field | Type | Description |
|---|---|---|
| `pp_abilities` | `integer` | PP spent on the eight base Ability scores |
| `pp_powers` | `integer` | PP spent on Powers and Devices |
| `pp_advantages` | `integer` | PP spent on Advantages (1 PP each) |
| `pp_skills` | `integer` | PP spent on Skills (1 PP per 2 ranks) |
| `pp_defenses` | `integer` | PP spent on bought-up Defense ranks |

---

## 3. Abilities

Eight core attributes that form the foundation of all trait checks. Each ability has a **rank** (the base score, positive or negative) and costs **2 PP per rank**. An ability may be designated as **Absent** (—), meaning the character lacks it entirely (constructs without Stamina, for example), which costs 0 PP.

| Abbreviation | Full Name | Primary use |
|---|---|---|
| `STR` | **Strength** | Close damage, Athletics, lifting/carrying |
| `STA` | **Stamina** | Base Toughness, base Fortitude, physical endurance |
| `AGL` | **Agility** | Base Dodge, Acrobatics, vehicle checks |
| `DEX` | **Dexterity** | Ranged attack bonus, Stealth, Sleight of Hand |
| `FGT` | **Fighting** | Base Parry, close attack bonus |
| `INT` | **Intellect** | Investigation, Technology, Expertise (knowledge) |
| `AWE` | **Awareness** | Base Will, Insight, Perception |
| `PRE` | **Presence** | Deception, Intimidation, Persuasion |

Each ability field stores a single integer (e.g., `str: 12`, `sta: -1`). A value of `null` or a special flag indicates the absent state.

---

## 4. Defenses

Defenses represent how well a character resists various threats. Each defense has a **base** derived from an ability and **purchased ranks** that add to it. The combined total is what opponents roll against.

| Defense | Base Ability | Formula | Resists |
|---|---|---|---|
| `dodge` | AGL | `AGL + bought_dodge` | Ranged attacks, area effects |
| `parry` | FGT | `FGT + bought_parry` | Close attacks |
| `fortitude` | STA | `STA + bought_fortitude` | Physical afflictions, poison, disease |
| `toughness` | STA | `STA + Equipment/Powers` | Damage (passive, not bought up directly) |
| `will` | AWE | `AWE + bought_will` | Mental effects, fear, social manipulation |

> **Toughness** is unique: it cannot be purchased directly with PP. It is improved via the Protection power, Defensive Roll advantage, or armor (Equipment). The sheet tracks its final total.

The sheet also tracks:

| Field | Description |
|---|---|
| `initiative` | Bonus to initiative rolls = `AGL modifier`. May be enhanced by powers or advantages. |

### Power Level Defense Caps (Strict Mode)

PL limits enforce trade-off pairs. Neither combination may exceed `PL × 2`.

| Pair | Limit |
|---|---|
| Dodge + Toughness | ≤ PL × 2 |
| Parry + Toughness | ≤ PL × 2 |
| Fortitude + Will | ≤ PL × 2 |

---

## 5. Offense

Summary of the character's primary attack options. Each entry in the Offense block represents one attack mode.

| Field | Description |
|---|---|
| `attack_name` | Label for the attack (e.g., "Force Beam", "Unarmed", "Spellcasting") |
| `attack_bonus` | Total bonus to the attack check (e.g., `+8`) |
| `attack_range` | `Close`, `Ranged`, or `Perception` |
| `attack_effect` | Effect name and rank (e.g., `Damage 12`, `Affliction 7`) |
| `attack_notes` | Additional descriptors (e.g., `Crit. 19–20`, `Multiattack 5`, `Resisted by Will`) |

### Attack Bonus Sources

- **Close attacks:** `FGT + close_combat_skill_ranks`
- **Ranged attacks:** `DEX + ranged_attack_advantage + ranged_combat_skill_ranks`
- Specific weapon groups may purchase skill ranks separately (e.g., `Close Combat: Unarmed`, `Ranged Combat: Thrown`)

### Power Level Attack Cap (Strict Mode)

| Pair | Limit |
|---|---|
| Attack bonus + Effect rank (damage/affliction) | ≤ PL × 2 |

---

## 6. Skills

Skills are purchased at 1 PP per 2 ranks. Each skill's total bonus = `skill_ranks + base_ability_modifier`. Many skills allow sub-specializations (subtypes).

| Skill | Base Ability | Notes |
|---|---|---|
| `Acrobatics` | AGL | Stunts, balance, tumbling |
| `Athletics` | STR | Climbing, jumping, swimming |
| `Close Combat` | FGT | Specialization: type of weapon/style (e.g., `Close Combat: Unarmed`) |
| `Deception` | PRE | Lying, disguise, feinting in combat |
| `Expertise` | INT | Knowledge field; subtype required (e.g., `Expertise: Science`) |
| `Insight` | AWE | Read emotions, detect lies |
| `Intimidation` | PRE | Cowing opponents, coercion |
| `Investigation` | INT | Research, searching, forensics |
| `Perception` | AWE | Notice things, spot hidden objects or creatures |
| `Persuasion` | PRE | Convince, negotiate, perform |
| `Ranged Combat` | DEX | Specialization: type of weapon/style (e.g., `Ranged Combat: Thrown`) |
| `Sleight of Hand` | DEX | Pickpocket, conceal items, manual dexterity tricks |
| `Stealth` | AGL | Moving unseen and unheard |
| `Technology` | INT | Electronics, computers, gadgets, inventing |
| `Treatment` | INT | First aid, medicine |
| `Vehicles` | DEX | Driving, piloting aircraft and watercraft |

Each skill entry on the sheet stores:

| Field | Type | Description |
|---|---|---|
| `skill_id` | `string` | Identifier matching the canonical skill name |
| `ranks` | `integer` | Purchased ranks (0 to any positive integer) |
| `subtype` | `string \| null` | Specialization label (required for Close Combat, Ranged Combat, Expertise; optional for Deception, Persuasion) |
| `total` | `derived` | `ranks + base_ability_value` |

> The sheet tracks **Ability**, **Ranks**, and **Other** (situational modifiers) in separate columns, then shows the final **Total**.

### Skill PL Cap (Strict Mode)

| Skill type | Limit |
|---|---|
| Combat skills (Close Combat, Ranged Combat) | `ranks + base_ability ≤ PL × 2` |
| Non-combat skills | `ranks + base_ability ≤ PL + 10` |

---

## 7. Advantages

Advantages are special traits purchased at **1 PP each**. They provide combat maneuvers, social capabilities, or passive benefits. Some are **Ranked** (can be purchased multiple times for stacking effect) while others are a single flat benefit.

The sheet lists all purchased advantages in a free-form text block. The builder tracks:

| Field | Type | Description |
|---|---|---|
| `advantage_id` | `string` | Canonical identifier (e.g., `defensive_roll`, `ranged_attack`) |
| `ranks` | `integer` | Number of times purchased (1 for non-ranked; 1–N for ranked) |

### Advantage Categories

| Category | Examples |
|---|---|
| **Combat** | Accurate Attack, All-out Attack, Defensive Attack, Power Attack, Chokehold, Improved Grab, Improved Initiative, Move-by Action, Takedown |
| **Fortune** | Beginner's Luck, Inspire, Leadership, Luck |
| **General** | Eidetic Memory, Equipment, Fearless, Inventor, Languages, Ritualist, Trance, Ultimate Effort |
| **Skill** | Daze, Hide in Plain Sight, Skill Mastery, Uncanny Dodge |

---

## 8. Powers & Devices

The most complex section of the sheet. Powers are custom-constructed effects with a base cost per rank, modified by extras and flaws.

### Power Structure

```
Power (named)
├── name:           string
├── notes:          string         (descriptors: Fire, Magic, Sonic, etc.)
├── total_cost:     integer (PP)
└── components[]:                  (one or more linked effects)
    ├── effect_id:  string         (canonical effect, e.g. "damage", "flight")
    ├── ranks:      integer
    ├── modifiers[]:               (extras and flaws applied to this component)
    │   ├── modifier_id: string
    │   ├── cost_type:   "per_rank" | "flat"
    │   ├── cost_value:  integer   (positive = extra, negative = flaw)
    │   └── ranks:       integer   (for stackable modifiers)
    └── cost:       derived (PP)
```

### Alternate Effects

A Power Array allows multiple effects to share a pool of PP, with only one active at a time (free action to switch).

```
Power.alternate_effects[]:
├── id:         string (uuid)
├── name:       string
├── dynamic:    boolean      (Dynamic Array: +2 PP, allows simultaneous use with base)
├── components[]: ...        (same structure as base power components)
└── cost:       integer (PP) (capped at base power cost; 1 PP for standard AEs)
```

### Device / Removable Modifier

Powers may be attached to devices, applying a PP discount:

| Modifier | Cost reduction |
|---|---|
| `Removable` | −5 PP per −2 PP off total cost |
| `Easily Removable` | −10 PP per −2 PP off total cost |

The sheet tracks devices with the same structure as powers, with the `removable` flag and discount value noted.

### Power Effect Categories

Effects are classified by their primary purpose:

| Category | Examples |
|---|---|
| **Attack** | Damage, Affliction, Weaken, Nullify |
| **Defense** | Protection, Immunity, Regeneration, Immortality |
| **Movement** | Flight, Speed, Teleport, Leaping, Swimming |
| **Sensory** | Senses, Communication, Mind Reading |
| **Control** | Move Object (Telekinesis), Illusion, Environment, Create, Luck Control |
| **General** | Enhanced Trait, Feature, Insubstantial, Growth, Shrinking, Morph |

### Power Cost Formula

```
component_cost = (base_cost_per_rank + extras_sum − flaws_sum) × ranks + flat_modifiers
array_cost     = main_component_cost + alternate_effect_count × 1 + dynamic_count × 2
```

---

## 9. Equipment, Vehicles & Headquarters

Equipment is purchased via the **Equipment** advantage (1 rank = 5 Equipment Points). Vehicles, weapons, and HQ each have their own sub-schema.

| Feature | EP Cost |
|---|---|
| Simple weapon (+0 damage) | 1 EP |
| Strength-based weapon (+1–5 damage) | 1–5 EP |
| Defensive armor (Protection 1–6) | 1–6 EP |
| Vehicle | Varies by Toughness, Speed, Size |
| Headquarters | Varies by Size, Toughness, Features |

The sheet tracks equipment in free-form text. The builder tracks items as power-like structures with `name`, `description`, `cost_ep`, and optional stat blocks for vehicles/HQ.

---

## 10. Complications

Complications are story hooks that the GM can invoke to award Hero Points. Each complication has a **type** and **description**. A character typically has 2–4 complications.

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Short label for the complication (e.g., `Motivation`, `Enemy`, `Weakness`) |
| `description` | `string` | Narrative detail explaining the complication |

### Common Complication Types

`Accident` · `Addiction` · `Disability` · `Enemy` · `Honor` · `Identity` · `Motivation` · `Power Loss` · `Prejudice` · `Relationship` · `Reputation` · `Responsibility` · `Secret` · `Weakness`

---

## 11. Combat Actions Reference

Tracked on the sheet's reference panel. Not stored as character data — informational only.

| Action | Attack Mod | Defense Mod | Type | Effect |
|---|---|---|---|---|
| Aid | — | — | Standard | +2 or +5 to ally's attack/defense |
| Aim | +5 | — | Standard | +2 at ranges beyond close |
| Charge | −2 | — | Standard | Move then attack in a straight line |
| Defend | — | — | Standard | Opposed check; add 10 to rolls of 10 or less |
| Disarm | −2 | — | Standard | Opposed Damage vs. target's STR |
| Escape | — | — | Move | Opposed Athletics/Sleight of Hand vs. STR or grab |
| Grab | — | — | Standard | Attack check; target resists with STR or Dodge |
| Recover | — | +2 | Standard | Remove highest damage/fatigue condition; once per combat |
| Smash | — | — | Standard | −5 attack penalty vs. held objects |
| Trip | −2 | — | Standard | Attack then opposed Acrobatics/Athletics |

### Combat Maneuvers

| Maneuver | Attack Mod | Defense Mod | Effect |
|---|---|---|---|
| Accurate Attack | +1 or +2 | — | −1 or −2 to effect rank |
| All-out Attack | +1 or +2 | −1 or −2 | — |
| Defensive Attack | −1 or −2 | +1 or +2 | — |
| Finishing Attack | — | — | Auto-hit or DC 10; treat as critical on success |
| Power Attack | −1 or −2 | — | +1 or +2 to effect rank |
| Slam Attack | −1 or −2 | +1 or +2 | Charge variant; attacker takes half Toughness damage |
| Team Attack | — | — | Simultaneous attack vs. same target and defense |

---

## 12. Conditions Reference

Tracked on the sheet's reference panel. Conditions are applied by GM rulings or effect results — they are not stored as persistent character data between scenes, but the builder may track active in-encounter conditions.

### Basic Conditions

| Condition | Effect |
|---|---|
| `Compelled` | Single standard action determined by another character |
| `Controlled` | Another character fully determines actions |
| `Dazed` | May take only one standard action per turn |
| `Debilitated` | One or more abilities reduced to −5 |
| `Defenseless` | Active defenses = 0; often prone (supersedes Vulnerable) |
| `Disabled` | −5 penalty on all checks (supersedes Impaired) |
| `Fatigued` | Hindered; recovers after 1 hour of rest |
| `Hindered` | Movement reduced by −1 speed rank |
| `Immobile` | No movement speed; cannot move but can act (supersedes Hindered) |
| `Impaired` | −2 penalty on all checks |
| `Normal` | Unaffected by other conditions |
| `Stunned` | Cannot take actions |
| `Transformed` | Traits altered by an outside agent (effect-dependent) |
| `Unaware` | Cannot make Interaction or Perception checks |
| `Vulnerable` | Active defenses halved (round up) |
| `Weakened` | Temporarily lost PP in a trait (effect-dependent) |

### Combined Conditions (pre-set groupings)

| Combined Condition | Components |
|---|---|
| `Asleep` | Defenseless + Stunned + Unaware |
| `Blind` | Hindered + Visually Unaware + Vulnerable (may also Impair/Disable visual tasks) |
| `Bound` | Defenseless + Immobile + Impaired |
| `Deaf` | Auditory Unaware |
| `Dying` | Incapacitated; character may die |
| `Entranced` | Stunned; attention locked on entrancing effect; breaks if threatened |
| `Exhausted` | Impaired + Hindered; recovers after 1 hour of rest |
| `Incapacitated` | Defenseless + Stunned + Unaware (often prone) |
| `Paralyzed` | Defenseless + Immobile + Physically Stunned (mental actions may still be possible) |
| `Prone` | Hindered; −5 to own close attacks; +5 to attacker's close, −5 to attacker's ranged |
| `Restrained` | Hindered + Vulnerable; Immobile if anchored |
| `Staggered` | Dazed + Hindered |
| `Surprised` | Stunned + Vulnerable |

---

## 13. Character Notes

Free-form text fields for GM/player reference. Not mechanically parsed.

| Field | Description |
|---|---|
| `notes` | General notes, background, roleplaying reminders |
| `character_illustration` | Image placeholder for character art |
| `conditions_active` | Running record of current in-play conditions |

---

## 14. Derived / Calculated Fields

Values that the sheet displays but that are always computed from primary data.

| Field | Formula |
|---|---|
| `initiative_bonus` | `AGL` |
| `toughness_total` | `STA + protection_power_ranks + defensive_roll_ranks` |
| `dodge_total` | `AGL + bought_dodge + enhanced_dodge_powers` |
| `parry_total` | `FGT + bought_parry + enhanced_parry_powers` |
| `fortitude_total` | `STA + bought_fortitude` |
| `will_total` | `AWE + bought_will` |
| `pp_abilities` | `Σ (ability_value × 2)` for non-absent abilities |
| `pp_skills` | `Σ skill_ranks ÷ 2` (round up) |
| `pp_advantages` | `Σ advantage_ranks` |
| `pp_defenses` | `Σ bought_defense_ranks` (dodge, parry, fortitude, will — not toughness) |
| `pp_powers` | `Σ power_total_costs` |
| `pp_total_spent` | `pp_abilities + pp_powers + pp_advantages + pp_skills + pp_defenses` |
| `pp_remaining` | `(power_level × 15) − pp_total_spent` |

---

## 15. Archetype Summary (PL 10 Reference)

The following table summarises point allocations across the official archetypes provided in the Deluxe Hero's Handbook. All are built for PL 10 with 150 PP.

| Archetype | Abilities | Powers | Advantages | Skills | Defenses |
|---|---|---|---|---|---|
| Battlesuit | 30 | 84 | 8 | 12 | 16 |
| Construct | 54 | 67 | 6 | 9 | 14 |
| Crime Fighter | 84 | 0 | 12 | 39 | 15 |
| Energy Controller | 36 | 79 | 5 | 15 | 15 |
| Gadgeteer | 48 | 42 | 16 | 22 | 22 |
| Martial Artist | 70 | 0 | 31 | 30 | 19 |
| Mimic | 32 | 84 | 1 | 12 | 21 |
| Mystic | 42 | 64 | 8 | 14 | 22 |
| Paragon | 36 | 84 | 1 | 17 | 12 |
| Powerhouse | 36 | 85 | 3 | 16 | 10 |
| Psychic | 32 | 78 | 1 | 12 | 26 |
| Shapeshifter | 38 | 72 | 5 | 13 | 22 |
| Speedster | 36 | 67 | 5 | 25 | 17 |
| Warrior | 94 | 12 | 14 | 18 | 12 |
| Weapon Master | 50 | 10 | 17 | 45 | 28 |

> Archetypes with high Ability costs (Warrior at 94, Crime Fighter at 84) invest minimally in Powers; those with high Power costs (Battlesuit, Paragon, Mimic at 84) use powers to compensate for moderate or low ability scores.

---

*Reference compiled from the official Mutants & Masterminds 3rd Edition character sheet (Green Ronin Publishing, 2011) and archetype listings in the Deluxe Hero's Handbook.*
