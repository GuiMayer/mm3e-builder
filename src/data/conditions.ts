/* ================================================
   Conditions data — F-16
   Source: Conditions.md (MM3e Deluxe Hero's Handbook)
   ================================================ */

export interface ICondition {
  id: string;
  name: string;
  combined: boolean;       // false = basic, true = combined
  components?: string[];   // IDs of basic conditions included
  description: string;
  supersededBy?: string[]; // which conditions supersede this one
}

export const CONDITIONS: ICondition[] = [
  // ── Basic Conditions ──────────────────────────────────────────
  {
    id: 'compelled',
    name: 'Compelled',
    combined: false,
    supersededBy: ['controlled'],
    description:
      'A compelled character is directed by an outside force, but struggling against it; the character is limited to free actions and a single standard action per turn, with both types of action being chosen by another, controlling character. As usual, this standard action can be traded for a move action. Controlled supersedes compelled.',
  },
  {
    id: 'controlled',
    name: 'Controlled',
    combined: false,
    description:
      'A controlled character has no free will; the character\'s actions each turn are dictated by another, controlling, character.',
  },
  {
    id: 'dazed',
    name: 'Dazed',
    combined: false,
    supersededBy: ['stunned'],
    description:
      'A dazed character is limited to free actions and a single standard action per turn, although the character may use that action to perform a move, as usual. Stunned supersedes dazed.',
  },
  {
    id: 'debilitated',
    name: 'Debilitated',
    combined: false,
    description:
      'The character has one or more abilities lowered below –5.',
  },
  {
    id: 'defenseless',
    name: 'Defenseless',
    combined: false,
    description:
      'A defenseless character has active defense bonuses of 0. Attackers can make attacks on defenseless opponents as routine checks. If the attacker chooses to forgo the routine check and make a normal attack check, any hit is treated as a critical hit. Defenseless characters are often prone.',
  },
  {
    id: 'disabled',
    name: 'Disabled',
    combined: false,
    supersededBy: ['debilitated'],
    description:
      'A disabled character is at a –5 circumstance penalty on checks. If the penalty applies to specific checks, they are added to the name of the condition, such as Attack Disabled, Fighting Disabled, Perception Disabled, and so forth.',
  },
  {
    id: 'fatigued',
    name: 'Fatigued',
    combined: false,
    description:
      'Fatigued characters are hindered. Characters recover from a fatigued condition after an hour of rest.',
  },
  {
    id: 'hindered',
    name: 'Hindered',
    combined: false,
    supersededBy: ['immobile'],
    description:
      'A hindered character moves at half normal speed (–1 speed rank). Immobile supersedes hindered.',
  },
  {
    id: 'immobile',
    name: 'Immobile',
    combined: false,
    description:
      'Immobile characters have no movement speed and cannot move from the spot they occupy, although they are still capable of taking actions unless prohibited by another condition.',
  },
  {
    id: 'impaired',
    name: 'Impaired',
    combined: false,
    supersededBy: ['disabled'],
    description:
      'An impaired character is at a –2 circumstance penalty on checks. If the impairment applies to specific checks, they are added to the name of the condition. Disabled supersedes impaired.',
  },
  {
    id: 'normal',
    name: 'Normal',
    combined: false,
    description:
      'The character is unharmed and unaffected by other conditions, acting normally.',
  },
  {
    id: 'stunned',
    name: 'Stunned',
    combined: false,
    description: 'Stunned characters cannot take any actions, including free actions.',
  },
  {
    id: 'transformed',
    name: 'Transformed',
    combined: false,
    description:
      'Transformed characters have some or all of their traits altered by an outside agency. This may range from a change in appearance to a complete change in trait ranks. The character\'s power point total cannot increase during the transformation.',
  },
  {
    id: 'unaware',
    name: 'Unaware',
    combined: false,
    description:
      'The character is completely unaware of surroundings, unable to make interaction or Perception checks or perform any action based on them. Subjects have full concealment from all unaware senses.',
  },
  {
    id: 'vulnerable',
    name: 'Vulnerable',
    combined: false,
    supersededBy: ['defenseless'],
    description:
      'Vulnerable characters are limited in their ability to defend themselves, halving their active defenses (round up the final value). Defenseless supersedes vulnerable.',
  },
  {
    id: 'weakened',
    name: 'Weakened',
    combined: false,
    supersededBy: ['debilitated'],
    description:
      'The character has temporarily lost power points in a trait. Debilitated supersedes weakened.',
  },

  // ── Combined Conditions ──────────────────────────────────────
  {
    id: 'asleep',
    name: 'Asleep',
    combined: true,
    components: ['defenseless', 'stunned', 'unaware'],
    description:
      'While asleep, a character is defenseless, stunned, and unaware. A hearing Perception check with three or more degrees of success wakes the character and removes all these conditions, as does any sudden movement or any effect allowing a resistance check.',
  },
  {
    id: 'blind',
    name: 'Blind',
    combined: true,
    components: ['hindered', 'unaware', 'vulnerable'],
    description:
      'The character cannot see. Everything effectively has full visual concealment from him. He is hindered, visually unaware, and vulnerable, and may be impaired or disabled for activities where vision is a factor.',
  },
  {
    id: 'bound',
    name: 'Bound',
    combined: true,
    components: ['defenseless', 'immobile', 'impaired'],
    description: 'A bound character is defenseless, immobile, and impaired.',
  },
  {
    id: 'deaf',
    name: 'Deaf',
    combined: true,
    components: ['unaware'],
    description:
      'The character cannot hear, giving everything total auditory concealment from him. Interaction with other characters is limited to sign-language and lip-reading.',
  },
  {
    id: 'dying',
    name: 'Dying',
    combined: true,
    components: ['defenseless', 'stunned', 'unaware'],
    description:
      'A dying character is incapacitated (defenseless, stunned, and unaware) and near death. When the character gains this condition, immediately make a Fortitude check (DC 15). With two degrees of success, the character stabilizes. Three or more total degrees of failure mean the character dies.',
  },
  {
    id: 'entranced',
    name: 'Entranced',
    combined: true,
    components: ['stunned'],
    description:
      'An entranced character is stunned, taking no actions other than paying attention to the entrancing effect. Any obvious threat automatically breaks the trance. An ally can also shake a character free with an interaction skill check (DC 10 + effect rank).',
  },
  {
    id: 'exhausted',
    name: 'Exhausted',
    combined: true,
    components: ['impaired', 'hindered'],
    description:
      'Exhausted characters are near collapse. They are impaired and hindered. Characters recover from exhausted after an hour of rest in comfortable surroundings.',
  },
  {
    id: 'incapacitated',
    name: 'Incapacitated',
    combined: true,
    components: ['defenseless', 'stunned', 'unaware'],
    description:
      'An incapacitated character is defenseless, stunned, and unaware. Incapacitated characters generally also fall prone, unless some outside force or aid keeps them standing.',
  },
  {
    id: 'paralyzed',
    name: 'Paralyzed',
    combined: true,
    components: ['defenseless', 'immobile', 'stunned'],
    description:
      'A paralyzed character is defenseless, immobile, and physically stunned, frozen in place and unable to move, but still aware and able to take purely mental actions involving no physical movement.',
  },
  {
    id: 'prone',
    name: 'Prone',
    combined: true,
    components: ['hindered'],
    description:
      'A prone character is lying on the ground, receiving a –5 circumstance penalty on close attack checks. Opponents receive a +5 circumstance bonus to close attack checks but a –5 penalty to ranged attack checks (effectively giving the prone character total cover against ranged attacks). Prone characters are hindered. Standing up from a prone position is a move action.',
  },
  {
    id: 'restrained',
    name: 'Restrained',
    combined: true,
    components: ['hindered', 'vulnerable'],
    description:
      'A restrained character is hindered and vulnerable. If the restraints are anchored to an immobile object, the character is immobile rather than hindered. If restrained by another character, the restrained character is immobile but may be moved by the restraining character.',
  },
  {
    id: 'staggered',
    name: 'Staggered',
    combined: true,
    components: ['dazed', 'hindered'],
    description: 'A staggered character is dazed and hindered.',
  },
  {
    id: 'surprised',
    name: 'Surprised',
    combined: true,
    components: ['stunned', 'vulnerable'],
    description:
      'A surprised character is stunned and vulnerable, caught off-guard and therefore unable to act, and less able to avoid attacks.',
  },
];

export const BASIC_CONDITIONS    = CONDITIONS.filter((c) => !c.combined);
export const COMBINED_CONDITIONS = CONDITIONS.filter((c) => c.combined);
