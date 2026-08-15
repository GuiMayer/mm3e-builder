import { v4 as uuidv4 } from 'uuid';
import type {
  ICharacterPower,
  IModifierDef,
  IPowerEffect,
} from '../../entities/types';

export function createPowerDraft(existingPower?: ICharacterPower): ICharacterPower {
  return existingPower ?? {
    id: uuidv4(),
    name: '',
    components: [{
      id: uuidv4(),
      effectId: '',
      ranks: 1,
      modifiers: [],
      fieldValues: {},
    }],
    notes: '',
    alternateEffects: [],
  };
}

export function collectModifierDefinitions(
  power: ICharacterPower,
  powerDefs: IPowerEffect[],
  generalModifierDefs: IModifierDef[]
): IModifierDef[] {
  const specificModifiers: IModifierDef[] = [];
  const collectForEffect = (effectId: string) => {
    const effect = powerDefs.find((definition) => definition.id === effectId);
    if (effect) specificModifiers.push(...effect.extras, ...effect.flaws);
  };

  power.components.forEach((component) => collectForEffect(component.effectId));
  power.alternateEffects.forEach((alternate) =>
    alternate.components.forEach((component) => collectForEffect(component.effectId))
  );

  const seen = new Set<string>();
  return [...generalModifierDefs, ...specificModifiers].filter((modifier) => {
    if (seen.has(modifier.id)) return false;
    seen.add(modifier.id);
    return true;
  });
}

export function findModifierIncompatibilities(
  power: ICharacterPower,
  modifierDefs: IModifierDef[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const inspect = (
    prefix: string,
    component: ICharacterPower['components'][number]
  ) => {
    const appliedIds = component.modifiers.map((modifier) => modifier.modifierId);
    for (const applied of component.modifiers) {
      const definition = modifierDefs.find(
        (modifier) => modifier.id === applied.modifierId
      );
      const conflicts = definition?.incompatibleWith.filter((id) => appliedIds.includes(id));
      if (conflicts?.length) result[`${prefix}${applied.modifierId}`] = conflicts;
    }
  };

  power.components.forEach((component) => inspect(`${component.id}:`, component));
  power.alternateEffects.forEach((alternate) =>
    alternate.components.forEach((component) =>
      inspect(`${alternate.id}:${component.id}:`, component)
    )
  );
  return result;
}

export function getPaletteContext(
  power: ICharacterPower,
  powerDefs: IPowerEffect[],
  activeComponentId: string,
  expandedAlternateId: string | null,
  activeAlternateComponents: Record<string, string>
) {
  if (expandedAlternateId !== null) {
    const alternate = power.alternateEffects.find(
      (candidate) => candidate.id === expandedAlternateId
    );
    const componentId = activeAlternateComponents[expandedAlternateId]
      ?? alternate?.components[0]?.id;
    const component = alternate?.components.find(
      (candidate) => candidate.id === componentId
    );
    const componentIndex = alternate?.components.findIndex(
      (candidate) => candidate.id === componentId
    ) ?? -1;
    return {
      selectedEffect: component
        ? powerDefs.find((definition) => definition.id === component.effectId)
        : undefined,
      contextName: alternate
        ? `${alternate.name || 'AE'} · Comp. ${componentIndex + 1}`
        : null,
      fabLabel: alternate?.name || 'AE',
    };
  }

  const component = power.components.find(
    (candidate) => candidate.id === activeComponentId
  );
  const selectedEffect = component
    ? powerDefs.find((definition) => definition.id === component.effectId)
    : undefined;
  return {
    selectedEffect,
    contextName: null,
    fabLabel: selectedEffect?.name || 'Main',
  };
}
