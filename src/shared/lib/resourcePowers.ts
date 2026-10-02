import type { ICharacterPower, IResource } from '../../entities/types';
import type { ResourceBuilderContext } from './resourceContext';

export interface ResourcePowerTarget { resourceId: string; kind: ResourceBuilderContext['kind']; powerId?: string; }
export type ResourceEditTarget = ResourcePowerTarget | { resourceId: string; kind: 'traits' };

/** Read-only entries shared by the sheet and library; identities select the editor. */
export function getResourcePowers(resource: IResource): { power: ICharacterPower; target: ResourcePowerTarget }[] {
  if (resource.type === 'vehicle') return [
    ...(resource.movement ? [{ power: resource.movement, target: { resourceId: resource.id, kind: 'movement' as const, powerId: resource.movement.id } }] : []),
    ...resource.systems.map(power => ({ power, target: { resourceId: resource.id, kind: 'system' as const, powerId: power.id } })),
  ];
  if (resource.type === 'headquarters') return resource.effects.map(power => ({ power, target: { resourceId: resource.id, kind: 'headquarters-effect' as const, powerId: power.id } }));
  return [{ power: resource.power, target: { resourceId: resource.id, kind: 'power', powerId: resource.power.id } }];
}

export function resolveResourceEditTarget(resources: readonly IResource[], target?: ResourceEditTarget) {
  const resource = resources.find(item => item.id === target?.resourceId);
  if (!resource || !target) return null;
  if (target.kind === 'traits') return { resource, target };
  const entry = getResourcePowers(resource).find(entry => entry.target.kind === target.kind && entry.power.id === target.powerId);
  return entry ? { resource, target: entry.target } : null;
}
