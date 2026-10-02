import type { ICharacterPower, IModifierDef, IPowerEffect, IResource } from '../entities/types';
import type { PDFLabels } from './pdf/pdfMessages';
import { formatComponentDetails } from './pdf/components/powerDetails';

export function describeResourcePower(power: ICharacterPower, powers: IPowerEffect[], modifiers: IModifierDef[], labels: PDFLabels): string {
  const effects = power.components.map(component => formatComponentDetails(component, powers, modifiers, labels)).join(' + ');
  const alternates = power.alternateEffects.map(alternate => [alternate.dynamic ? labels('Dynamic Alternate Effect') : labels('Alternate Effect'), alternate.name, ...alternate.components.map(component => formatComponentDetails(component, powers, modifiers, labels)), alternate.notes].filter(Boolean).join(': '));
  return [power.name, effects, power.removable ? labels(power.removable === 'removable' ? 'Removable' : 'Easily Removable') : '', power.baseDynamic ? labels('Dynamic base effect') : '', power.activation ? `${labels('Activation')}: ${labels(power.activation)}` : '', power.descriptors?.join(', '), ...alternates, power.notes].filter(Boolean).join(' — ');
}

/** Complete, localized plain text used in HTML and spreadsheet exports. */
export function describeResource(resource: IResource, powers: IPowerEffect[], modifiers: IModifierDef[], labels: PDFLabels): string[] {
  const power = (item: ICharacterPower) => describeResourcePower(item, powers, modifiers, labels);
  if (resource.type !== 'vehicle' && resource.type !== 'headquarters') return [power(resource.power)];
  const features = resource.features.length ? `${labels('Features')}: ${resource.features.map(feature => `${feature.name}${(feature.ranks ?? 1) > 1 ? ` ${feature.ranks}` : ''}${feature.notes ? ` (${feature.notes})` : ''}`).join(', ')}` : '';
  const size = labels(resource.size.charAt(0).toUpperCase() + resource.size.slice(1));
  if (resource.type === 'vehicle') return [size, `${labels('Strength')} ${resource.strength}`, resource.movement ? `${labels('Movement')}: ${power(resource.movement)}` : `${labels('Speed')} ${resource.speed}`, `${labels('Defense')} ${resource.defense}`, `${labels('Toughness')} ${resource.toughness}`, features, resource.systems.length ? `${labels('Systems')}: ${resource.systems.map(power).join(' | ')}` : ''].filter(Boolean);
  return [size, `${labels('PL')} ${resource.powerLevel ?? 10}`, `${labels('Toughness')} ${resource.toughness}`, features, ...resource.effects.map(effect => {
    const setting = resource.effectSettings?.[effect.id];
    const kind = labels(setting?.kind === 'defense-system' ? 'Defense System' : 'Effect');
    const target = labels(setting?.target === 'occupants' ? 'Occupants' : setting?.target === 'both' ? 'Resource and occupants' : 'Resource');
    return `${kind} (${target}): ${power(effect)}`;
  })];
}
