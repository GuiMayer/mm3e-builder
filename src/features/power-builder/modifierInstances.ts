import type { IAppliedModifier, ICharacterPower, ICharacterPowerComponent } from '../../entities/types';
import { createId } from '../../shared/lib/identity';

/** Definition IDs select rules; instance IDs select one editable application. */
export function modifierInstanceKey(modifier: IAppliedModifier, index: number): string {
  return modifier.instanceId || `legacy:${index}`;
}

/** Normalize only the editor draft. Opening/canceling never rewrites a saved sheet. */
export function prepareModifierInstances(power: ICharacterPower): ICharacterPower {
  const seen = new Set<string>();
  const prepare = (component: ICharacterPowerComponent): ICharacterPowerComponent => ({
    ...component,
    modifiers: component.modifiers.map(modifier => {
      let instanceId = modifier.instanceId;
      if (!instanceId || seen.has(instanceId)) instanceId = createId();
      seen.add(instanceId);
      return { ...modifier, instanceId };
    }),
  });
  return {
    ...power,
    components: power.components.map(prepare),
    alternateEffects: power.alternateEffects.map(alternate => ({ ...alternate, components: alternate.components.map(prepare) })),
  };
}

export function updateComponentModifier(
  component: ICharacterPowerComponent,
  instanceKey: string,
  update: Partial<Pick<IAppliedModifier, 'ranks' | 'option' | 'options' | 'affectedRanks'>>,
): ICharacterPowerComponent {
  const fields = { ...update, ...(typeof update.options?.affectedRanks === 'number' ? { affectedRanks: update.options.affectedRanks } : {}) };
  return { ...component, modifiers: component.modifiers.map((modifier, index) =>
    modifierInstanceKey(modifier, index) === instanceKey ? { ...modifier, ...fields } : modifier) };
}

export function removeComponentModifier(component: ICharacterPowerComponent, instanceKey: string): ICharacterPowerComponent {
  return { ...component, modifiers: component.modifiers.filter((modifier, index) => modifierInstanceKey(modifier, index) !== instanceKey) };
}
