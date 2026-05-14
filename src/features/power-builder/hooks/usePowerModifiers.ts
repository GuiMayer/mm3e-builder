import type {
  ICharacterPower,
  IAppliedModifier,
} from '../../../entities/types';

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
          ? { ...c, modifiers: [...c.modifiers, modifier] }
          : c
      ),
    }));
  }

  function removeModifierFromComponent(compId: string, modifierId: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? { ...c, modifiers: c.modifiers.filter((m) => m.modifierId !== modifierId) }
          : c
      ),
    }));
  }

  function updateModifierRanks(compId: string, modifierId: string, ranks: number) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? {
              ...c,
              modifiers: c.modifiers.map((m) =>
                m.modifierId === modifierId ? { ...m, ranks } : m
              ),
            }
          : c
      ),
    }));
  }

  function updateModifierOption(compId: string, modifierId: string, option: string) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? {
              ...c,
              modifiers: c.modifiers.map((m) =>
                m.modifierId === modifierId ? { ...m, option } : m
              ),
            }
          : c
      ),
    }));
  }

  function updateModifierOptions(
    compId: string,
    modifierId: string,
    options: Record<string, boolean | number | string>
  ) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId
          ? {
              ...c,
              modifiers: c.modifiers.map((m) =>
                m.modifierId === modifierId ? { ...m, options } : m
              ),
            }
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
