# Modifiers Checklist - M&M 3E Hero's Handbook

This document tracks which modifiers from the official M&M 3E Hero's Handbook are implemented in `modifiers.json`.

## Extras (Hero's Handbook p.136-145)

| Modifier | Cost | Implemented | Notes |
|----------|------|-------------|-------|
| Accurate | +1/rank (flat) | ✅ | maxRanks limited by PL |
| Affects Corporeal | +1/rank (flat) | ✅ | For insubstantial effects |
| Affects Insubstantial | +1/rank (flat) | ✅ | Rank 1: half effect, Rank 2: full |
| Affects Objects | +0 or +1/rank | ✅ | Special logic needed |
| Affects Others | +0 or +1/rank | ✅ | Special logic needed |
| Alternate Effect | +1 or +2 (flat) | ✅ | Dynamic costs +2 |
| Alternate Resistance | +0 to +2/rank | ✅ | Has subtypes for different defenses |
| Area | +1/rank | ✅ | 7 shape options |
| Attack | +0/rank | ✅ | Makes personal effect an attack |
| Contagious | +1/rank | ✅ | Effect spreads to others |
| Dimensional | +1/rank (flat) | ✅ | Each rank = 1 dimension |
| Extended Range | +1/rank (flat) | ✅ | Doubles range per rank |
| Extra Subjects | +1/rank (flat) | ✅ | Add more simultaneous targets |
| Feature | +1 (flat) | ✅ | Minor beneficial effect |
| Homing | +1/rank (flat) | ✅ | Attack tries again if it misses |
| Improved Critical | +1/rank (flat) | ✅ | Expands critical threat range |
| Improved Range | +1/rank | ✅ | Increases range category |
| Incurable | +1 (flat) | ✅ | Damage can't be healed normally |
| Increased Duration | +1/rank | ✅ | Extends duration one step |
| Increased Mass | +1/rank (flat) | ✅ | Affects larger objects |
| Increased Range | +1/rank | ✅ | Extends range one step |
| Indirect | +1/rank (flat) | ✅ | Attack comes from different direction |
| Innate | +1 (flat) | ✅ | Can't be nullified |
| Insidious | +1 (flat) | ✅ | Hard to detect with senses |
| Linked | +0/rank | ✅ | Ties effects together |
| Multiattack | +1/rank | ✅ | Attack multiple targets |
| Penetrating | +1/rank (flat) | ✅ | Bypasses Impervious |
| Precise | +1 (flat) | ✅ | Fine control |
| Ranged | +1/rank | ✅ | Makes close effect ranged |
| Reach | +1/rank (flat) | ✅ | Extends close range by 5ft/rank |
| Reaction | +1 or +3/rank | ✅ | Activates as reaction |
| Reversible | +1 (flat) | ✅ | Can undo effect at will |
| Ricochet | +1/rank (flat) | ✅ | Bounce attack off surfaces |
| Secondary Effect | +1/rank | ✅ | Effect hits twice |
| Selective | +1/rank | ✅ | Choose targets in area |
| Sleep | +0/rank | ✅ | Incapacitated = asleep |
| Split | +1/rank (flat) | ✅ | Divide effect between targets |
| Subtle | +1/rank (flat) | ✅ | Hard to detect (max rank 2) |
| Sustained | +0/rank | ✅ | Makes permanent effect sustained |
| Triggered | +1/rank (flat) | ✅ | Set conditions for activation |
| Variable Descriptor | +1 or +2 (flat) | ✅ | Change descriptors |

**Total Extras in Book:** 40
**Implemented:** 40 ✅
**Missing:** 0

## Flaws (Hero's Handbook p.145-150)

| Modifier | Cost | Implemented | Notes |
|----------|------|-------------|-------|
| Activation | -1 or -2 (flat) | ✅ | Requires action to activate |
| Check Required | -1/rank (flat) | ✅ | Must pass skill check |
| Concentration | -1/rank | ✅ | Requires standard action to maintain |
| Diminished Range | -1/rank (flat) | ✅ | Reduces range multipliers (max 3) |
| Distracting | -1/rank | ✅ | Causes vulnerable condition |
| Fades | -1/rank | ✅ | Loses 1 rank per use |
| Feedback | -1/rank | ✅ | Damage to manifestation hurts you |
| Grab-Based | -1/rank | ✅ | Must grab target first |
| Inaccurate | -1/rank (flat) | ✅ | -2 to attack per rank |
| Increased Action | -1/rank | ✅ | Requires longer action |
| Limited | -1/rank | ✅ | Only works in specific situations |
| Noticeable | -1 (flat) | ✅ | Continuous effect is obvious |
| Permanent | -1/rank | ✅ | Can't be turned off |
| Quirk | -1/rank (flat) | ✅ | Minor nuisance |
| Reduced Range | -1/rank | ✅ | Drops range one step |
| Removable | -1 or -2/5pp (flat) | ✅ | Device can be taken away |
| Resistible | -1/rank | ✅ | Adds resistance check |
| Sense-Dependent | -1/rank | ✅ | Target must perceive effect |
| Side Effect | -1 or -2/rank | ✅ | Harmful effect on user |
| Tiring | -1/rank | ✅ | Causes fatigue |
| Uncontrolled | -1/rank | ✅ | GM decides when it works |
| Unreliable | -1/rank | ✅ | Roll to see if it works |

**Total Flaws in Book:** 22
**Implemented:** 22 ✅
**Missing:** 0

## Summary

- **Total Modifiers in Book:** 62
- **Total Implemented:** 62 ✅
- **Implementation Rate:** 100%

## Notes

All modifiers from the M&M 3E Hero's Handbook are implemented in `modifiers.json`. The implementation includes:
- Correct cost types (per_rank, flat, flat_ranked)
- Correct cost values
- Proper maxRanks where applicable
- Complete descriptions in English
- Portuguese translations (pt-BR)
- Incompatibility rules where documented

## Sources

- Mutants & Masterminds Hero's Handbook, 3rd Edition (Green Ronin Publishing)
- Pages 136-150: Powers Modifiers
- d20herosrd.com for online reference
