/**
 * Add Missing Power-Specific Modifiers Script
 * 
 * Adds missing power-specific modifiers to powers.json based on
 * official M&M 3e Hero's Handbook references.
 * 
 * Phase 2: High Priority Powers
 * - Flight (6 missing)
 * - Healing (11 missing)
 * - Illusion (6 missing)
 * - Affliction (2 missing)
 * 
 * Usage: npx tsx scripts/addMissingModifiers.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PowerModifier {
  id: string;
  name: string;
  category: 'extra' | 'flaw';
  costType: 'per_rank' | 'flat' | 'flat_ranked';
  costValue: number;
  description: string;
  longDescription?: string;
  incompatibleWith: string[];
  maxRanks?: number;
  i18n: {
    'pt-BR'?: {
      name: string;
      description: string;
      longDescription?: string;
    };
  };
}

interface Power {
  id: string;
  name: string;
  extras: PowerModifier[];
  flaws: PowerModifier[];
  [key: string]: unknown;
}

// ============================================================================
// FLIGHT MODIFIERS (Reference: Hero's Handbook p.1161-1255)
// ============================================================================

const FLIGHT_EXTRAS: PowerModifier[] = [
  {
    id: 'aquatic',
    name: 'Aquatic',
    category: 'extra',
    costType: 'flat',
    costValue: 1,
    description: 'You can move underwater as easily as in the air. Water speed = Flight rank - 2.',
    longDescription: 'You can move underwater as easily as in the air. You have a water speed equal to your Flight rank, minus 2, subject to the usual rules for swimming. You can make Athletics checks to swim as routine checks. This power does not allow you to breathe underwater (for that see Immunity). This is the Swimming power as an Alternate Effect.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'continuous_flight',
    name: 'Continuous',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Flight operates even when incapacitated. You remain hanging in the air or float safely down.',
    longDescription: 'Continuous Flight operates even when the user is incapacitated or otherwise unable to sustain it. The user remains hanging in the air, maintaining relative position to the ground, if necessary. Alternately, the user might float safely down to the ground when unable to maintain Flight as a kind of "safety net," your choice when you apply the modifier.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'subtle_flight',
    name: 'Subtle',
    category: 'extra',
    costType: 'flat',
    costValue: 1,
    description: 'Reduces or eliminates flight traces (rush of air, jet roar, contrail). Completely Subtle = automatic silent movement.',
    longDescription: 'The default Flight effect is noticeable, whether from the rush of air, the roar of jets, or a glowing contrail or aurora. This modifier reduces, and then eliminates, these traces. If your Flight is completely Subtle, you do not need to make Stealth checks to move silently while flying (you do so automatically), although you may still need to do so to avoid being seen or otherwise detected.',
    incompatibleWith: [],
    maxRanks: 2,
    i18n: {},
  },
];

const FLIGHT_FLAWS: PowerModifier[] = [
  {
    id: 'concentration_flight',
    name: 'Concentration',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'You can fly, but can\'t do much else at the same time.',
    longDescription: 'Flight requiring concentration means you can fly, but can\'t do much else at the same time. You must maintain concentration to keep flying.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'distracting_flight',
    name: 'Distracting',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'You are not very maneuverable and therefore vulnerable while flying.',
    longDescription: 'You are not very maneuverable and therefore vulnerable while flying (see the Vulnerable condition). This represents poor control or difficulty maintaining flight.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'platform',
    name: 'Platform',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Flight relies on a platform. If knocked off or grabbed from ground, you cannot fly until reactivated.',
    longDescription: 'Your Flight is reliant on some sort of platform on which you stand or sit. If you fail a resistance check while flying, or you are grabbed by someone standing on the ground, you\'re knocked or pulled off your platform and cannot fly. You can regain the use of your flying platform by reactivating your Flight effect on your next turn.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// HEALING MODIFIERS (Reference: Hero's Handbook p.1286-1378)
// ============================================================================

const HEALING_EXTRAS: PowerModifier[] = [
  {
    id: 'action_healing',
    name: 'Action',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Reduces the action required to use Healing. Cannot use more than once per turn.',
    longDescription: 'This extra reduces the action required for you to use Healing. You cannot use Healing more than once per turn regardless. To heal multiple subjects at once, apply the Area modifier.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'affects_objects_healing',
    name: 'Affects Objects',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Your Healing can also "heal" damage to non-living subjects.',
    longDescription: 'Your Healing can also "heal" damage to non-living subjects. You make a Healing check against the subject\'s worst damage condition, as normal.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'area_healing',
    name: 'Area',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Healing grants the same benefit to all subjects in the affected area.',
    longDescription: 'Healing with this extra grants the same benefit to all subjects in the affected area. Area Empathic Healing is an unwise combination, as the healer takes on all of the damage conditions of the affected subjects at once!',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'energizing',
    name: 'Energizing',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Can heal fatigued and exhausted conditions. DC 10: one degree for fatigued, two for exhausted. You take on the removed conditions.',
    longDescription: 'You can heal the fatigued and exhausted conditions as well as damage conditions: DC 10, one degree of success for fatigued, two degrees of success for exhausted. However, you take on the removed conditions and cannot use Healing to eliminate your own fatigue (although you can still use hero points to recover from them). If the Healing check fails, you must wait the normal recovery time or use extra effort to try again.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'perception_healing',
    name: 'Perception',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Applied to Ranged Healing, does not require an attack check to "touch" the subject.',
    longDescription: 'Applied to Ranged Healing, Perception Ranged Healing does not require an attack check to "touch" the subject. You must still be able to perceive the target.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'ranged_healing',
    name: 'Ranged',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Ranged Healing requires an attack check to "touch" the subject.',
    longDescription: 'Ranged Healing requires an attack check to "touch" the subject with the Healing effect. The GM may waive the check for a willing subject holding completely still, but the subject is defenseless that round, making it an unwise decision in the midst of combat.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'resurrection',
    name: 'Resurrection',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Can restore life to the dead! DC 20 check if dead for fewer minutes than your rank.',
    longDescription: 'You can restore life to the dead! If the subject has been dead for fewer minutes than your Healing rank, make a DC 20 Healing check. If successful, the patient\'s condition becomes incapacitated, as if just stabilized. If the check fails, you can only try again using extra effort.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'selective_healing',
    name: 'Selective',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Area Healing may have this extra, allowing you to choose who in the area does and does not gain the benefits.',
    longDescription: 'Area Healing may have this extra, allowing you to choose who in the area does and does not gain the benefits.',
    incompatibleWith: [],
    i18n: {},
  },
];

const HEALING_FLAWS: PowerModifier[] = [
  {
    id: 'empathic',
    name: 'Empathic',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'When you cure someone else of a condition, you acquire the condition yourself.',
    longDescription: 'When you successfully cure someone else of a condition, you acquire the condition yourself and must recover from it normally. You can use Healing and Regeneration to cure your own conditions. You can have the Resurrection modifier for Healing, but if you successfully use it, you die! This may not be as bad as it seems if you have Immortality, allowing you to return to life.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'limited_healing',
    name: 'Limited',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Healing is limited in some way (One Type of Damage, Objects only, Others only, Self only).',
    longDescription: 'Examples of ways in which Healing may be Limited include: One Type of Damage (such as energy or bludgeoning damage), Objects (in conjunction with Affects Objects), Others (you can\'t use Healing on yourself), or Self (you can only use Healing on yourself).',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'temporary_healing',
    name: 'Temporary',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Benefits last one hour. Subject then regains any damage conditions you healed.',
    longDescription: 'The benefits of your Healing are temporary, lasting for one hour. The subject then regains any damage conditions you healed. These conditions stack with others the subject acquired since the initial healing, which may result in more severe damage or even death.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// ILLUSION MODIFIERS (Reference: Hero's Handbook p.1379-1522)
// ============================================================================

const ILLUSION_EXTRAS: PowerModifier[] = [
  {
    id: 'independent_illusion',
    name: 'Independent',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Active illusions only require a free action to maintain, rather than a standard action.',
    longDescription: 'Your active illusions only require a free action to maintain, rather than a standard action. This allows you to maintain complex, moving illusions while still taking other actions.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'selective_illusion',
    name: 'Selective',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'You choose who perceives your Illusion and who doesn\'t.',
    longDescription: 'You choose who perceives your Illusion and who doesn\'t. This allows you to create illusions visible only to specific targets.',
    incompatibleWith: [],
    i18n: {},
  },
];

const ILLUSION_FLAWS: PowerModifier[] = [
  {
    id: 'feedback_illusion',
    name: 'Feedback',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'A successful damaging attack on one of your illusions causes you to suffer damage.',
    longDescription: 'Although Illusion does not have a physical "manifestation" per se, it can apply this flaw, in which case a successful damaging attack on one of your illusions causes you to suffer damage, using the guidelines given in the description of the Feedback flaw.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'limited_one_subject',
    name: 'Limited to One Subject',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Only a single subject at a time can perceive your Illusion.',
    longDescription: 'Only a single subject at a time can perceive your Illusion. This significantly limits the utility of the power.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'ranged_illusion',
    name: 'Ranged',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Illusion\'s range is reduced. Being able to perceive the affected area is important.',
    longDescription: 'It is left to the GM\'s discretion whether or not Illusion\'s range can be reduced at all, since being able to perceive the affected area is important in creating and directing the illusion. In order to solely alter your own appearance, see the Morph effect, possibly with the Resistible modifier.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'resistible_illusion',
    name: 'Resistible',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Illusions Resistible by Will (hallucinatory) or Fortitude (biochemical). Targets immune to the resistance are unaffected.',
    longDescription: 'Illusions Resistible by Will are typically hallucinatory effects projected into the target\'s mind. This flaw is commonly combined with Selective, so only the targets you choose perceive your illusions. Illusions Resistible by Fortitude may represent a hallucinatory drug or similar biochemical effect. As usual, targets immune to effects targeting the resistance are unaffected by the illusion as well. This resistance check is in addition to the usual Insight check.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// AFFLICTION MODIFIERS (Reference: Hero's Handbook p.3-180)
// ============================================================================

const AFFLICTION_EXTRAS: PowerModifier[] = [
  {
    id: 'alternate_resistance',
    name: 'Alternate Resistance',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'Some Afflictions may be initially resisted by Dodge. Later resistance checks are typically still Fortitude or Will.',
    longDescription: 'Some Afflictions may be initially resisted by Dodge, representing the need for quick reaction time or reflexes to avoid the effect. In this case, the later resistance checks to remove the Affliction\'s conditions are typically still based on Fortitude or Will. For example, a target might make a Dodge check to avoid a blinding light or spray of liquid, but a Fortitude check to eliminate the effect if the initial Dodge fails.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'concentration_affliction',
    name: 'Concentration',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Once you hit, so long as you take a standard action each turn to maintain, the target must make a new resistance check with no attack check required.',
    longDescription: 'Once you have hit with a Concentration Affliction, so long as you continue to take a standard action each turn to maintain the effect, the target must make a new resistance check against it, with no attack check required.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// MAIN SCRIPT
// ============================================================================

function loadPowers(): Power[] {
  const powersPath = path.join(__dirname, '../src/data/powers.json');
  const content = fs.readFileSync(powersPath, 'utf-8');
  return JSON.parse(content);
}

function savePowers(powers: Power[]): void {
  const powersPath = path.join(__dirname, '../src/data/powers.json');
  fs.writeFileSync(powersPath, JSON.stringify(powers, null, 2) + '\n');
}

function addModifiersToPower(
  powers: Power[],
  powerId: string,
  newExtras: PowerModifier[],
  newFlaws: PowerModifier[]
): boolean {
  const power = powers.find(p => p.id === powerId);
  if (!power) {
    console.error(`❌ Power "${powerId}" not found`);
    return false;
  }

  let addedCount = 0;

  // Add extras
  for (const extra of newExtras) {
    const exists = power.extras.some(e => e.id === extra.id);
    if (!exists) {
      power.extras.push(extra);
      addedCount++;
      console.log(`  ✅ Added extra: ${extra.name}`);
    } else {
      console.log(`  ⚠️  Extra already exists: ${extra.name}`);
    }
  }

  // Add flaws
  for (const flaw of newFlaws) {
    const exists = power.flaws.some(f => f.id === flaw.id);
    if (!exists) {
      power.flaws.push(flaw);
      addedCount++;
      console.log(`  ✅ Added flaw: ${flaw.name}`);
    } else {
      console.log(`  ⚠️  Flaw already exists: ${flaw.name}`);
    }
  }

  return addedCount > 0;
}

// Main execution
console.log('🔧 Adding missing power-specific modifiers...\n');

const powers = loadPowers();
let totalAdded = 0;
let powersModified = 0;

// Flight
console.log('📦 Processing: Flight');
if (addModifiersToPower(powers, 'flight', FLIGHT_EXTRAS, FLIGHT_FLAWS)) {
  powersModified++;
  totalAdded += FLIGHT_EXTRAS.length + FLIGHT_FLAWS.length;
}
console.log('');

// Healing
console.log('📦 Processing: Healing');
if (addModifiersToPower(powers, 'healing', HEALING_EXTRAS, HEALING_FLAWS)) {
  powersModified++;
  totalAdded += HEALING_EXTRAS.length + HEALING_FLAWS.length;
}
console.log('');

// Illusion
console.log('📦 Processing: Illusion');
if (addModifiersToPower(powers, 'illusion', ILLUSION_EXTRAS, ILLUSION_FLAWS)) {
  powersModified++;
  totalAdded += ILLUSION_EXTRAS.length + ILLUSION_FLAWS.length;
}
console.log('');

// Affliction
console.log('📦 Processing: Affliction');
if (addModifiersToPower(powers, 'affliction', AFFLICTION_EXTRAS, [])) {
  powersModified++;
  totalAdded += AFFLICTION_EXTRAS.length;
}
console.log('');

// Save changes
savePowers(powers);

console.log('✨ Summary:');
console.log(`  - Powers modified: ${powersModified}`);
console.log(`  - Modifiers added: ${totalAdded}`);
console.log(`  - File saved: src/data/powers.json`);
console.log('\n✅ Phase 2 (High Priority) complete!');
