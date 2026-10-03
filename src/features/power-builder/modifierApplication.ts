import type { IAppliedModifier, ICharacterPowerComponent, IModifierDef, IPowerEffect } from '../../entities/types';
import { resolveModifierDefinition } from '../../shared/lib/rulesCatalog';
import { createId } from '../../shared/lib/identity';

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
  const added: IAppliedModifier = { instanceId: createId(), modifierId, ranks: 1, isPowerSpecific: specific };
  return { ...component, modifiers: [...component.modifiers, added] };
}
