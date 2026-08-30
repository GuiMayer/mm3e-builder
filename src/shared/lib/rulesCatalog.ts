import type {
  IAppliedModifier,
  IModifierDef,
  IPowerEffect,
} from '../../entities/types';

export type ModifierResolutionSource =
  | 'generic'
  | 'power-specific'
  | 'missing';

export interface ModifierResolution {
  definition: IModifierDef | undefined;
  source: ModifierResolutionSource;
  /** Legacy data may omit the source marker for an ID shared by both catalogs. */
  ambiguous: boolean;
}

/**
 * Resolves an applied modifier in the context of its effect.
 *
 * The source marker was added after the original character format. Legacy
 * entries therefore keep the historical generic-first behavior when an ID is
 * shared, while unique power-specific modifiers are recovered automatically.
 */
export function resolveModifierDefinition(
  applied: IAppliedModifier,
  effectDef: IPowerEffect,
  genericModifierDefs: readonly IModifierDef[]
): ModifierResolution {
  const generic = genericModifierDefs.find(
    (definition) => definition.id === applied.modifierId
  );
  const powerSpecific = [...effectDef.extras, ...effectDef.flaws].find(
    (definition) => definition.id === applied.modifierId
  );

  if (applied.isPowerSpecific === true) {
    return {
      definition: powerSpecific,
      source: powerSpecific ? 'power-specific' : 'missing',
      ambiguous: false,
    };
  }

  if (applied.isPowerSpecific === false) {
    return {
      definition: generic,
      source: generic ? 'generic' : 'missing',
      ambiguous: false,
    };
  }

  if (generic) {
    return {
      definition: generic,
      source: 'generic',
      ambiguous: powerSpecific !== undefined,
    };
  }

  return {
    definition: powerSpecific,
    source: powerSpecific ? 'power-specific' : 'missing',
    ambiguous: false,
  };
}

export function getModifierDefinitionsForEffect(
  effectDef: IPowerEffect,
  genericModifierDefs: readonly IModifierDef[]
): IModifierDef[] {
  return [...genericModifierDefs, ...effectDef.extras, ...effectDef.flaws];
}
