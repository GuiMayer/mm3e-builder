const resistanceKeys: Record<string, string> = {
  toughness: 'defenses.toughness',
  fortitude: 'defenses.fortitude',
  will: 'defenses.will',
  dodge: 'defenses.dodge',
  parry: 'defenses.parry',
  resistance: 'targeted.fact.resistance',
};
const phrases: Record<string, string> = {
  Nullify: 'targeted.nullifyCheck',
  'Opposed check': 'targeted.opposedCheck',
  'effect rank': 'targeted.effectRank',
  'On the subject: effect rank only': 'targeted.nullifySubject',
  DC: 'targeted.dc',
};

/** Translate generated resistance labels only at display time; keep the DC and custom names intact. */
export function formatResistanceLabel(resistance: string | undefined, t: (key: string) => string): string {
  return formatResistanceDescription(resistance, phrase => {
    const key = Object.hasOwn(resistanceKeys, phrase.toLowerCase()) ? resistanceKeys[phrase.toLowerCase()] : Object.hasOwn(phrases, phrase) ? phrases[phrase] : undefined;
    return key ? t(key) : phrase;
  });
}

/** Shared with exports, whose translation catalog is indexed by English phrases. */
export function formatResistanceDescription(resistance: string | undefined, labels: (phrase: string) => string): string {
  if (!resistance) return '—';
  const opposed = resistance.match(/^Nullify (-?\d+) vs max\(effect rank, (.+)\); subject: effect rank$/);
  if (opposed) {
    return `${labels('Nullify')} ${opposed[1]} · ${labels('Opposed check')}: max(${labels('effect rank')}, ${labels(opposed[2])}) · ${labels('On the subject: effect rank only')}`;
  }
  const match = resistance.match(/^(.+?) DC (-?\d+)$/);
  if (!match) return resistance;
  return `${labels(match[1])} ${labels('DC')} ${match[2]}`;
}
