const resistanceKeys: Record<string, string> = {
  toughness: 'defenses.toughness',
  fortitude: 'defenses.fortitude',
  will: 'defenses.will',
  dodge: 'defenses.dodge',
  parry: 'defenses.parry',
  resistance: 'targeted.fact.resistance',
};

/** Translate generated resistance labels only at display time; keep the DC and custom names intact. */
export function formatResistanceLabel(resistance: string | undefined, t: (key: string) => string): string {
  if (!resistance) return '—';
  const match = resistance.match(/^(.+?) DC (-?\d+)$/);
  if (!match) return resistance;
  const name = match[1].toLowerCase();
  const key = Object.hasOwn(resistanceKeys, name) ? resistanceKeys[name] : undefined;
  return `${key ? t(key) : match[1]} ${t('targeted.dc')} ${match[2]}`;
}
