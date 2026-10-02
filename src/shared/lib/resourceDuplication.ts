import type { ICharacterPower, IResource } from '../../entities/types';
import { createId } from './identity';

/** A new library item, without touching any character or original reference. */
export function duplicateResource(resource: IResource, name: string): IResource {
  const copy = structuredClone(resource);
  copy.id = createId();
  copy.name = name;
  copy.createdAt = copy.updatedAt = new Date().toISOString();
  function remapPower(power: ICharacterPower) {
    power.id = createId();
    for (const slot of [power, ...power.alternateEffects]) {
      if (slot !== power) slot.id = createId();
      for (const component of slot.components) component.id = createId();
    }
  }
  if (copy.type === 'vehicle') {
    copy.features.forEach(feature => { feature.id = createId(); });
    if (copy.movement) remapPower(copy.movement);
    copy.systems.forEach(remapPower);
  } else if (copy.type === 'headquarters') {
    copy.features.forEach(feature => { feature.id = createId(); });
    for (const power of copy.effects) {
      const previousId = power.id;
      remapPower(power);
      if (copy.effectSettings?.[previousId]) {
        copy.effectSettings[power.id] = copy.effectSettings[previousId];
        delete copy.effectSettings[previousId];
      }
    }
  } else remapPower(copy.power);
  return copy;
}

export function getResourceCopyName(base: string, resources: readonly IResource[]): string {
  const names = new Set(resources.map(resource => resource.name.trim().toLocaleLowerCase()));
  let name = base, count = 2;
  while (names.has(name.trim().toLocaleLowerCase())) name = `${base} ${count++}`;
  return name;
}
