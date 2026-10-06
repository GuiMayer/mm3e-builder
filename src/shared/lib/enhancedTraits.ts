import type { ICharacterPowerComponent } from '../../entities/types';
import { ADVANTAGE_DEFS } from '../../entities/gameDataLoaders';

/** Explicit associations use the existing, serialized fieldValues contract. */
export function enhancedAdvantage(component: ICharacterPowerComponent) {
  const id = component.fieldValues?.enhancedAdvantageId;
  if (component.effectId !== 'enhanced-trait' || component.variableCostOption !== 'Enhanced Advantage'
    || typeof id !== 'string' || !ADVANTAGE_DEFS.some(def => def.id === id)) return undefined;
  const subtype = component.fieldValues?.enhancedAdvantageSubtype;
  return { advantageId: id, subtype: typeof subtype === 'string' ? subtype : null };
}

export function liftingOnly(component: ICharacterPowerComponent): boolean {
  return component.effectId === 'enhanced-trait' && component.enhancedTarget?.kind === 'ability'
    && component.enhancedTarget.key === 'str' && component.fieldValues?.enhancedScope === 'lifting';
}
