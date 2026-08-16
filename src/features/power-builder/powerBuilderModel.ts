import type {
  ICharacterPower,
  IModifierDef,
  IPowerEffect,
} from '../../entities/types';
import { createId } from '../../shared/lib/identity';

export function createPowerDraft(existingPower?: ICharacterPower): ICharacterPower {
  return existingPower ?? {
    id: createId(),
    name: '',
    components: [{
      id: createId(),
      effectId: '',
      ranks: 1,
      modifiers: [],
      fieldValues: {},
    }],
    notes: '',
    alternateEffects: [],
  };
}

/**
 * Descriptors are player-authored labels, so keep them readable and safe to
 * compare before they enter a character draft. Control characters can arrive
 * through pasted text, while repeated whitespace makes duplicate detection
 * unreliable.
 */
export function normalizeDescriptor(value: string): string {
  const withoutControlCharacters = Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127 ? ' ' : character;
  }).join('');

  return withoutControlCharacters
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Finds a descriptor without treating capitalization as a different value.
 * `excludedIndex` lets an already selected descriptor keep or change its own
 * capitalization without being considered a duplicate of itself.
 */
export function hasDuplicateDescriptor(
  descriptors: readonly string[],
  candidate: string,
  excludedIndex?: number | null
): boolean {
  const normalizedCandidate = normalizeDescriptor(candidate).toLocaleLowerCase();
  if (!normalizedCandidate) return false;

  return descriptors.some(
    (descriptor, index) =>
      index !== excludedIndex
      && normalizeDescriptor(descriptor).toLocaleLowerCase() === normalizedCandidate
  );
}

/**
 * Adds a new descriptor or replaces the descriptor selected in the editor.
 * Invalid or duplicate values leave the current list untouched.
 */
export function applyDescriptor(
  descriptors: readonly string[],
  value: string,
  selectedIndex: number | null
): string[] {
  const descriptor = normalizeDescriptor(value);
  if (!descriptor || hasDuplicateDescriptor(descriptors, descriptor, selectedIndex)) {
    return [...descriptors];
  }

  if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < descriptors.length) {
    return descriptors.map((current, index) =>
      index === selectedIndex ? descriptor : current
    );
  }

  return [...descriptors, descriptor];
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
