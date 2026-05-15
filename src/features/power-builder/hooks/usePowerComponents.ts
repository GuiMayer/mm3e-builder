import { v4 as uuidv4 } from 'uuid';
import type {
  ICharacterPower,
  ICharacterPowerComponent,
} from '../../../entities/types';

/* ================================================
   usePowerComponents Hook
   Manages power component state and operations
   ================================================ */

interface UsePowerComponentsParams {
  setPower: React.Dispatch<React.SetStateAction<ICharacterPower>>;
  setActiveComponentId: React.Dispatch<React.SetStateAction<string>>;
}

export function usePowerComponents({
  setPower,
  setActiveComponentId,
}: UsePowerComponentsParams) {
  
  function addComponent() {
    const newComp: ICharacterPowerComponent = {
      id: uuidv4(),
      effectId: '',
      ranks: 1,
      modifiers: [],
      fieldValues: {},
    };
    setPower((p) => ({ ...p, components: [...p.components, newComp] }));
    setActiveComponentId(newComp.id);
  }

  function removeComponent(compId: string) {
    setPower((p) => {
      if (p.components.length <= 1) return p;
      return { ...p, components: p.components.filter((c) => c.id !== compId) };
    });
  }

  function updateComponent(compId: string, update: Partial<ICharacterPowerComponent>) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) =>
        c.id === compId ? { ...c, ...update } : c
      ),
    }));
  }

  function updateComponentField(compId: string, fieldId: string, value: string | string[]) {
    setPower((p) => ({
      ...p,
      components: p.components.map((c) => {
        if (c.id !== compId) return c;
        return {
          ...c,
          fieldValues: {
            ...(c.fieldValues || {}),
            [fieldId]: value,
          },
        };
      }),
    }));
  }

  return {
    addComponent,
    removeComponent,
    updateComponent,
    updateComponentField,
  };
}
