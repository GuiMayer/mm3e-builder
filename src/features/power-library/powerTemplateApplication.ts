import type { ICharacterPower, ICharacterPowerComponent } from '../../entities/types';
import type { PowerLibraryTarget } from './types';

export function canApplyPowerTemplate(power: ICharacterPower, recipe: ICharacterPower, target: PowerLibraryTarget): boolean {
  const globalConfiguration = !!recipe.activation || (!!recipe.removable && recipe.removable !== 'none') || !!recipe.baseDynamic;
  const alternate = 'alternateId' in target && target.alternateId
    ? power.alternateEffects.find(ae => ae.id === target.alternateId) : undefined;
  if (target.kind === 'alternate') return !!alternate && !recipe.alternateEffects.length && !globalConfiguration;
  const components = target.alternateId ? alternate?.components : power.components;
  if (!components?.some(component => component.id === target.componentId)) return false;
  const isMain = !target.alternateId && power.components[0]?.id === target.componentId;
  return isMain || (!recipe.alternateEffects.length && !globalConfiguration);
}

/** Applies to a draft only; does not touch storage or the original catalog. */
export function applyPowerTemplate(power: ICharacterPower, recipe: ICharacterPower, target: PowerLibraryTarget, useName = false): ICharacterPower {
  if (!canApplyPowerTemplate(power, recipe, target)) throw new Error('Template cannot be applied to this target');
  const copy = structuredClone(recipe);
  const notes = (existing: string) => [existing.trim(), copy.notes.trim()].filter(Boolean).join('\n\n');
  const replace = (components: ICharacterPowerComponent[]) => components.flatMap(component =>
    target.kind === 'component' && component.id === target.componentId
      ? copy.components.map((next, index) => ({ ...next, id: index === 0 ? component.id : next.id })) : [component]);
  if (target.kind === 'alternate' || target.alternateId) {
    return { ...power, alternateEffects: power.alternateEffects.map(alternate => {
      if (alternate.id !== target.alternateId) return alternate;
      return { ...alternate,
        components: target.kind === 'alternate' ? copy.components : replace(alternate.components),
        name: useName || !alternate.name.trim() ? copy.name : alternate.name,
        notes: notes(alternate.notes),
      };
    }) };
  }
  const wholeArray = copy.alternateEffects.length > 0;
  return { ...power,
    name: useName || !power.name.trim() ? copy.name : power.name,
    notes: notes(power.notes),
    descriptors: [...new Set([...(power.descriptors ?? []), ...(copy.descriptors ?? [])])],
    components: wholeArray ? copy.components : replace(power.components),
    alternateEffects: wholeArray ? copy.alternateEffects : power.alternateEffects,
    ...(wholeArray || copy.baseDynamic !== undefined ? { baseDynamic: copy.baseDynamic ?? false } : {}),
    ...(copy.activation ? { activation: copy.activation } : {}),
    ...(copy.removable ? { removable: copy.removable } : {}),
  };
}
