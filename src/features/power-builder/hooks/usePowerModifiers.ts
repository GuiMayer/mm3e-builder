import type {
  ICharacterPower,
  IAppliedModifier,
} from '../../../entities/types';
import { createId } from '../../../shared/lib/identity';
import { removeComponentModifier, updateComponentModifier } from '../modifierInstances';

/* ================================================
   usePowerModifiers Hook
   Manages power modifier state and operations
   ================================================ */

interface UsePowerModifiersParams {
  setPower: React.Dispatch<React.SetStateAction<ICharacterPower>>;
}

export function usePowerModifiers({
  setPower,
}: UsePowerModifiersParams) {
  
  function addModifierToComponent(compId: string, modifier: IAppliedModifier) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? { ...c, modifiers: [...c.modifiers, { ...modifier, instanceId: createId() }] }
          : c
      ),
    }));
  }

  function removeModifierFromComponent(compId: string, instanceKey: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? removeComponentModifier(c, instanceKey)
          : c
      ),
    }));
  }

  function updateModifierRanks(compId: string, instanceKey: string, ranks: number) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? updateComponentModifier(c, instanceKey, { ranks })
          : c
      ),
    }));
  }

  function updateModifierOption(compId: string, instanceKey: string, option: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? updateComponentModifier(c, instanceKey, { option })
          : c
      ),
    }));
  }

  function updateModifierOptions(
    compId: string,
    instanceKey: string,
    options: Record<string, boolean | number | string>
  ) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? updateComponentModifier(c, instanceKey, { options, ...(typeof options.affectedRanks === 'number' ? { affectedRanks: options.affectedRanks } : {}) })
          : c
      ),
    }));
  }

  return {
    addModifierToComponent,
    removeModifierFromComponent,
    updateModifierRanks,
    updateModifierOption,
    updateModifierOptions,
  };
}
