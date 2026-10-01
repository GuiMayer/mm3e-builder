import type { IAppliedModifier, ICharacterPowerComponent, IModifierDef, IPowerEffect } from '../../entities/types';
import { isRankedModifier } from '../../shared/lib/mathEngine';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';

/** Generic modifiers belong to every effect. Explicit specific choices stay scoped. */
export function addComponentModifier(
  component: ICharacterPowerComponent,
  effect: IPowerEffect | undefined,
  genericDefinitions: IModifierDef[],
  modifierId: string,
  isPowerSpecific?: boolean,
): ICharacterPowerComponent {
  if (!effect) return component;
  const resolution = resolveModifierDefinition({ modifierId, ranks: 1, isPowerSpecific }, effect, genericDefinitions);
  if (!resolution.definition) return component;
  const specific = resolution.source === 'power-specific';
  const added: IAppliedModifier = { modifierId, ranks: 1, isPowerSpecific: specific };
  const existing = component.modifiers.find(modifier => modifier.modifierId === modifierId);
  if (!existing) return { ...component, modifiers: [...component.modifiers, added] };
  const previous = resolveModifierDefinition(existing, effect, genericDefinitions);
  if (previous.source !== resolution.source) {
    return { ...component, modifiers: component.modifiers.map(modifier => modifier === existing ? added : modifier) };
  }
  if (!isRankedModifier(resolution.definition)) return component;
  return { ...component, modifiers: component.modifiers.map(modifier => modifier === existing ? { ...modifier, ranks: modifier.ranks + 1 } : modifier) };
}
