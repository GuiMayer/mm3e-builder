import { POWER_DEFS } from '../../entities/gameDataLoaders';
import type { IResource, ResourceType } from '../../entities/types';
import { isDeviceResource } from '../../shared/lib/resourceCalculations';
import { getResourcePowers } from '../../shared/lib/resourcePowers';

export type ResourceTypeFilter = 'all' | ResourceType;
export type ResourceAcquisitionFilter = 'all' | 'device' | 'equipment';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

const effectNames = new Map(POWER_DEFS.map(effect => [effect.id, [
  effect.id, effect.name, ...Object.values(effect.i18n ?? {}).map(text => text.name ?? ''),
].join(' ')]));

function resourceText(resource: IResource): string {
  const parts = [resource.name, resource.notes];
  if (resource.type === 'vehicle' || resource.type === 'headquarters') {
    for (const feature of resource.features) parts.push(feature.name, feature.notes ?? '');
  }
  for (const { power } of getResourcePowers(resource)) {
    parts.push(power.name, power.notes, ...(power.descriptors ?? []));
    for (const effect of [power, ...power.alternateEffects]) {
      parts.push(effect.name, effect.notes);
      for (const component of effect.components) {
        parts.push(effectNames.get(component.effectId) ?? component.effectId);
      }
    }
  }
  return normalize(parts.join(' '));
}

/** Filters the library without changing resources, their order or their saved data. */
export function searchResources(resources: readonly IResource[], {
  query = '', type = 'all', acquisition = 'all', language = 'en',
}: {
  query?: string;
  type?: ResourceTypeFilter;
  acquisition?: ResourceAcquisitionFilter;
  language?: string;
} = {}): IResource[] {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return resources.filter(resource => {
    if (type !== 'all' && resource.type !== type) return false;
    const costMode = isDeviceResource(resource) ? 'device' : 'equipment';
    if (acquisition !== 'all' && costMode !== acquisition) return false;
    if (!words.length) return true;
    const text = resourceText(resource);
    return words.every(word => text.includes(word));
  }).sort((a, b) => a.name.localeCompare(b.name, language, { sensitivity: 'base', numeric: true }));
}
