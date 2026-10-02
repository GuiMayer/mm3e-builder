import type { IAppliedModifier, ICharacterPowerComponent, IModifierDef, IPowerEffect } from '../../entities/types';
import { resolveModifierDefinition, type ModifierResolutionSource } from '../../shared/lib/rulesCatalog';

export interface ModifierReference {
  applied: IAppliedModifier;
  definition?: IModifierDef;
  source: ModifierResolutionSource;
}
export interface ComponentReference {
  component: ICharacterPowerComponent;
  definition?: IPowerEffect;
  modifiers: ModifierReference[];
}

export function localizeReference<T extends IModifierDef | IPowerEffect>(definition: T, language: string): T {
  const text = definition.i18n?.[language];
  return { ...definition, name: text?.name ?? definition.name, description: text?.description ?? definition.description,
    longDescription: text?.longDescription ?? (text?.description || definition.longDescription) };
}

/** Resolve read-only reference text in the same effect/source context as pricing. */
export function buildPowerReferences(components: readonly ICharacterPowerComponent[], effects: readonly IPowerEffect[], modifiers: readonly IModifierDef[], language: string): ComponentReference[] {
  return components.map(component => {
    const effect = effects.find(definition => definition.id === component.effectId);
    return {
      component, definition: effect && localizeReference(effect, language),
      modifiers: component.modifiers.map(applied => {
        const resolved = effect ? resolveModifierDefinition(applied, effect, modifiers) : undefined;
        return { applied, definition: resolved?.definition && localizeReference(resolved.definition, language), source: resolved?.source ?? 'missing' };
      }),
    };
  });
}
