/**
 * Add Medium Priority Power-Specific Modifiers Script
 * 
 * Adds missing power-specific modifiers for medium priority powers:
 * - Insubstantial (11 missing)
 * - Enhanced Trait (4 missing)
 * - Extra Limbs (4 missing)
 * - Growth (1 missing)
 * 
 * Usage: npx tsx scripts/addMediumPriorityModifiers.ts
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
// INSUBSTANTIAL MODIFIERS (Reference: Hero's Handbook p.1620-1770)
// ============================================================================

const INSUBSTANTIAL_EXTRAS: PowerModifier[] = [
  {
    id: 'affects_corporeal',
    name: 'Affects Corporeal',
    category: 'extra',
    costType: 'flat_ranked',
    costValue: 1,
    description: 'Required for any effect that works on corporeal targets while you are incorporeal.',
    longDescription: 'This extra is required for any effect that works on corporeal targets while you are incorporeal. See the Affects Corporeal extra description for details and cost.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'affects_others_insubstantial',
    name: 'Affects Others',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'Allows you to extend your Insubstantial effect to another character by touch.',
    longDescription: 'This modifier allows you to extend your Insubstantial effect to another character by touch, taking them Insubstantial with you. If you ever withdraw the effect while someone is inside a solid object, see the effect\'s description for the unpleasant results.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'attack_insubstantial',
    name: 'Attack',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'Makes Insubstantial into a close range effect able to turn targets Insubstantial.',
    longDescription: 'Applied to Insubstantial, this extra makes it into a close range effect able to turn targets Insubstantial. You must be able to physically touch the target to make an Insubstantial Attack, meaning it must have the Affects Corporeal modifier to use it while you are incorporeal. This modifier is most effective for ranks 2 through 4, since the victim loses some or all ability to interact with the physical world. The default resistance for an Insubstantial Attack is Dodge, although it can be Fortitude or Will, as best suits the effect\'s descriptors.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'continuous_insubstantial',
    name: 'Continuous',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Allows you to remain Insubstantial until you choose to return to corporeal form.',
    longDescription: 'Extending the effect\'s duration to continuous allows you to remain Insubstantial until you choose to return to your corporeal form.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'innate_insubstantial',
    name: 'Innate',
    category: 'extra',
    costType: 'flat',
    costValue: 1,
    description: 'Your character\'s form is naturally or innately Insubstantial, particularly if the effect is permanent.',
    longDescription: 'Use this modifier if your character\'s form is naturally or innately Insubstantial, particularly if the effect is permanent in duration.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'precise_insubstantial',
    name: 'Precise',
    category: 'extra',
    costType: 'flat',
    costValue: 1,
    description: 'Allows you to selectively make some portions of your body insubstantial while keeping others substantial.',
    longDescription: 'This modifier allows you to selectively make some portions of your body insubstantial while keeping others substantial (or vice versa). This allows you to do things like reach through a wall, solidify your hand to pick up an object or tap someone on the shoulder (or punch them in the face), and become incorporeal again to withdraw it on the following round.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'progressive_insubstantial',
    name: 'Progressive',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'You can assume lower ranked forms of Insubstantial, but must progress through them in order.',
    longDescription: 'You can assume lower ranked forms of Insubstantial, but you must progress through them in order to reach the higher-ranked ones. For example if you have Progressive Insubstantial 3, you can assume fluid, gaseous, or energy forms, but to assume energy form, you must first progress through fluid and gaseous, becoming less and less substantial. Since you can only activate the effect once per turn, it takes you three turns to get there.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'reaction_insubstantial',
    name: 'Reaction',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Allows you to switch forms "reflexively" in response to hazards, even if it is not your turn.',
    longDescription: 'Becoming Insubstantial is normally a free action, meaning you can\'t switch to an Insubstantial form when surprised or otherwise unable to take action. At the GM\'s option, applying the Action extra to use Insubstantial as a reaction allows you to switch forms "reflexively" in response to such hazards, even if it is not your turn.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'subtle_insubstantial',
    name: 'Subtle',
    category: 'extra',
    costType: 'flat',
    costValue: 1,
    description: 'Makes your Insubstantial nature less noticeable to observers.',
    longDescription: 'This extra makes your Insubstantial nature less noticeable to observers. Rank 1 requires a Perception check (DC 20) to detect that you are Insubstantial, while 2 ranks mean you look entirely normal in Insubstantial form (which may cause opponents to waste effort on you, not knowing you are immune to their attacks, for example).',
    incompatibleWith: [],
    maxRanks: 2,
    i18n: {},
  },
];

const INSUBSTANTIAL_FLAWS: PowerModifier[] = [
  {
    id: 'absent_strength',
    name: 'Absent Strength',
    category: 'flaw',
    costType: 'flat',
    costValue: -1,
    description: 'Applies only to rank 1 Insubstantial. Removes your effective Strength while in that form.',
    longDescription: 'This flaw applies only to rank 1 Insubstantial and removes your effective Strength while in that form, leaving you with limited ability to affect the physical world like the higher ranks of the effect.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'permanent_insubstantial',
    name: 'Permanent',
    category: 'flaw',
    costType: 'per_rank',
    costValue: 0,
    description: 'You are always Insubstantial; you cannot assume solid form.',
    longDescription: 'You are always Insubstantial; you cannot assume solid form, although your Insubstantial effect can still be Nullified unless it is also Innate.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// ENHANCED TRAIT MODIFIERS (Reference: Hero's Handbook p.900-925)
// ============================================================================

const ENHANCED_TRAIT_EXTRAS: PowerModifier[] = [
  {
    id: 'limited_enhanced_trait',
    name: 'Limited',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'Enhanced Trait only works under certain conditions (Nighttime Only, While Angry, Underwater, etc.).',
    longDescription: 'Your Enhanced Trait only works under certain conditions, such as Nighttime (or Daytime) Only, While Angry (or in another emotional state), Underwater (or in some other environment), and so forth. A limit that rarely comes into play—like losing your Enhanced Trait during a new moon—can be handled as a power loss complication.',
    incompatibleWith: [],
    i18n: {},
  },
];

const ENHANCED_TRAIT_FLAWS: PowerModifier[] = [
  {
    id: 'limited_enhanced_trait_flaw',
    name: 'Limited',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Enhanced Trait only works under certain conditions (Nighttime Only, While Angry, Underwater, etc.).',
    longDescription: 'Your Enhanced Trait only works under certain conditions, such as Nighttime (or Daytime) Only, While Angry (or in another emotional state), Underwater (or in some other environment), and so forth. A limit that rarely comes into play—like losing your Enhanced Trait during a new moon—can be handled as a power loss complication.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'permanent_enhanced_trait',
    name: 'Permanent',
    category: 'flaw',
    costType: 'per_rank',
    costValue: 0,
    description: 'Your Enhanced Trait is a permanent improvement. Cannot be turned on/off or improved by extra effort.',
    longDescription: 'At no change in cost, your Enhanced Trait may be a permanent improvement, rather than a sustained effect. The primary difference is that your permanent enhancement cannot be turned on and off and cannot be improved by extra effort, including using it to perform power stunts. There is no action to use a Permanent Enhanced Trait, as it is always active.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'reduced_trait',
    name: 'Reduced Trait',
    category: 'flaw',
    costType: 'flat',
    costValue: -1,
    description: 'One or more of your traits is lowered while others are enhanced.',
    longDescription: 'One or more of your traits is lowered while others are enhanced. This flaw is worth as many points as the reduction in the affected trait(s). So, for example, if you lose Intellect while you gain in Strength, treat the value of the lost Intellect ranks as the value of the flaw. As with all flaws, the effect must still cost at least 1 power point.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// EXTRA LIMBS MODIFIERS (Reference: Hero's Handbook p.1100-1159)
// ============================================================================

const EXTRA_LIMBS_EXTRAS: PowerModifier[] = [
  {
    id: 'continuous_extra_limbs',
    name: 'Continuous',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Your Extra Limbs are continuous duration, always present.',
    longDescription: 'Your Extra Limbs have continuous duration, meaning they are always present and do not require concentration to maintain.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'projection_extra_limbs',
    name: 'Projection',
    category: 'extra',
    costType: 'per_rank',
    costValue: 1,
    description: 'Your Extra Limbs can be projected at range.',
    longDescription: 'Your Extra Limbs can be projected at range, allowing you to manipulate objects or attack from a distance.',
    incompatibleWith: [],
    i18n: {},
  },
  {
    id: 'sustained_extra_limbs',
    name: 'Sustained',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'Your Extra Limbs require sustained concentration to maintain.',
    longDescription: 'Your Extra Limbs require sustained concentration to maintain. This is the default duration for Extra Limbs.',
    incompatibleWith: [],
    i18n: {},
  },
];

const EXTRA_LIMBS_FLAWS: PowerModifier[] = [
  {
    id: 'distracting_extra_limbs',
    name: 'Distracting',
    category: 'flaw',
    costType: 'per_rank',
    costValue: -1,
    description: 'Using your Extra Limbs is distracting, making you vulnerable.',
    longDescription: 'Using your Extra Limbs is distracting, making you vulnerable (see the Vulnerable condition) while using them.',
    incompatibleWith: [],
    i18n: {},
  },
];

// ============================================================================
// GROWTH MODIFIERS (Reference: Hero's Handbook p.1256-1285)
// ============================================================================

const GROWTH_EXTRAS: PowerModifier[] = [
  {
    id: 'permanent_growth',
    name: 'Permanent',
    category: 'extra',
    costType: 'per_rank',
    costValue: 0,
    description: 'Your Growth is permanent. You are always at your increased size.',
    longDescription: 'Your Growth is permanent. You are always at your increased size and cannot return to normal size, although the effect can still be Nullified unless it is also Innate.',
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
console.log('🔧 Adding medium priority power-specific modifiers...\n');

const powers = loadPowers();
let totalAdded = 0;
let powersModified = 0;

// Insubstantial
console.log('📦 Processing: Insubstantial');
if (addModifiersToPower(powers, 'insubstantial', INSUBSTANTIAL_EXTRAS, INSUBSTANTIAL_FLAWS)) {
  powersModified++;
  totalAdded += INSUBSTANTIAL_EXTRAS.length + INSUBSTANTIAL_FLAWS.length;
}
console.log('');

// Enhanced Trait
console.log('📦 Processing: Enhanced Trait');
if (addModifiersToPower(powers, 'enhanced-trait', ENHANCED_TRAIT_EXTRAS, ENHANCED_TRAIT_FLAWS)) {
  powersModified++;
  totalAdded += ENHANCED_TRAIT_EXTRAS.length + ENHANCED_TRAIT_FLAWS.length;
}
console.log('');

// Extra Limbs
console.log('📦 Processing: Extra Limbs');
if (addModifiersToPower(powers, 'extra-limbs', EXTRA_LIMBS_EXTRAS, EXTRA_LIMBS_FLAWS)) {
  powersModified++;
  totalAdded += EXTRA_LIMBS_EXTRAS.length + EXTRA_LIMBS_FLAWS.length;
}
console.log('');

// Growth
console.log('📦 Processing: Growth');
if (addModifiersToPower(powers, 'growth', GROWTH_EXTRAS, [])) {
  powersModified++;
  totalAdded += GROWTH_EXTRAS.length;
}
console.log('');

// Save changes
savePowers(powers);

console.log('✨ Summary:');
console.log(`  - Powers modified: ${powersModified}`);
console.log(`  - Modifiers added: ${totalAdded}`);
console.log(`  - File saved: src/data/powers.json`);
console.log('\n✅ Phase 2 (Medium Priority) complete!');
