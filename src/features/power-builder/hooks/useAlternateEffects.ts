import type {
  ICharacterPower,
  IAlternateEffect,
  IPowerEffect,
  ICharacterPowerComponent,
} from '../../../entities/types';
import { createId } from '../../../shared/lib/identity';

interface UseAlternateEffectsParams {
  setPower: React.Dispatch<React.SetStateAction<ICharacterPower>>;
  /** Needed by addModifierToAEComponent to detect power-specific mods */
  powerDefs: IPowerEffect[];
  /** Read by removeAlternateEffect to clear expanded state when the open AE is deleted */
  expandedAEId: string | null;
  setExpandedAEId: (id: string | null) => void;
  setActiveAEComponentId: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

function getNextAlternateEffectName(alternateEffects: IAlternateEffect[]): string {
  const existingNames = new Set(
    alternateEffects.map((ae) => ae.name.trim().toLowerCase()).filter(Boolean)
  );
  let index = alternateEffects.length + 1;

  while (existingNames.has(`ae ${index}`.toLowerCase())) {
    index += 1;
  }

  return `AE ${index}`;
}

export function useAlternateEffects({
  setPower,
  powerDefs,
  expandedAEId,
  setExpandedAEId,
  setActiveAEComponentId,
}: UseAlternateEffectsParams) {
  function addAlternateEffect() {
    const newAEId = createId();
    const newComponentId = createId();
    const newAE: IAlternateEffect = {
      id: newAEId,
      name: '',
      components: [{ id: newComponentId, effectId: '', ranks: 1, modifiers: [], fieldValues: {} }],
      dynamic: false,
      notes: '',
    };
    setPower((p) => ({
      ...p,
      alternateEffects: [
        ...p.alternateEffects,
        { ...newAE, name: getNextAlternateEffectName(p.alternateEffects) },
      ],
    }));
    setExpandedAEId(newAEId);
    setActiveAEComponentId((prev) => ({ ...prev, [newAEId]: newComponentId }));
  }

  function removeAlternateEffect(id: string) {
    setPower((p) => {
      const alternateEffects = p.alternateEffects.filter((a) => a.id !== id);
      return {
        ...p,
        alternateEffects,
        baseDynamic: alternateEffects.some((a) => a.dynamic) ? p.baseDynamic : false,
      };
    });
    if (expandedAEId === id) setExpandedAEId(null);
  }

  function updateAlternateEffect(id: string, update: Partial<IAlternateEffect>) {
    setPower((p) => {
      const alternateEffects = p.alternateEffects.map((a) =>
        a.id === id ? { ...a, ...update } : a
      );
      return {
        ...p,
        alternateEffects,
        baseDynamic: alternateEffects.some((a) => a.dynamic) ? p.baseDynamic : false,
      };
    });
  }

  // ── AE Component CRUD ──

  function addAEComponent(aeId: string) {
    const newComp: ICharacterPowerComponent = { id: createId(), effectId: '', ranks: 1, modifiers: [], fieldValues: {} };
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : { ...ae, components: [...ae.components, newComp] }
      ),
    }));
    setActiveAEComponentId((prev) => ({ ...prev, [aeId]: newComp.id }));
  }

  function removeAEComponent(aeId: string, compId: string) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) => {
        if (ae.id !== aeId || ae.components.length <= 1) return ae;
        return { ...ae, components: ae.components.filter((c) => c.id !== compId) };
      }),
    }));
  }

  function updateAEComponent(
    aeId: string,
    compId: string,
    update: Partial<ICharacterPowerComponent>
  ) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : {
          ...ae,
          components: ae.components.map((c) => c.id !== compId ? c : { ...c, ...update }),
        }
      ),
    }));
  }

  function addModifierToAEComponent(
    aeId: string,
    compId: string,
    modId: string,
    isPowerSpecific?: boolean
  ) {
    const allSpecific = powerDefs.flatMap((p) => [...(p.extras || []), ...(p.flaws || [])]);
    const isSpecific = isPowerSpecific ?? allSpecific.some((m) => m.id === modId);
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : {
          ...ae,
          components: ae.components.map((comp) => {
            if (comp.id !== compId) return comp;
            const already = comp.modifiers.find((m) => m.modifierId === modId);
            if (already) {
              return {
                ...comp,
                modifiers: comp.modifiers.map((m) =>
                  m.modifierId === modId ? { ...m, ranks: m.ranks + 1 } : m
                ),
              };
            }
            return {
              ...comp,
              modifiers: [...comp.modifiers, { modifierId: modId, ranks: 1, isPowerSpecific: isSpecific }],
            };
          }),
        }
      ),
    }));
  }

  function removeModifierFromAEComponent(aeId: string, compId: string, modId: string) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : {
          ...ae,
          components: ae.components.map((comp) =>
            comp.id !== compId
              ? comp
              : { ...comp, modifiers: comp.modifiers.filter((m) => m.modifierId !== modId) }
          ),
        }
      ),
    }));
  }

  function updateAEModifierRanks(aeId: string, compId: string, modId: string, ranks: number) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : {
          ...ae,
          components: ae.components.map((comp) =>
            comp.id !== compId ? comp : {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, ranks: Math.max(1, ranks) } : m
              ),
            }
          ),
        }
      ),
    }));
  }

  function updateAEModifierOption(aeId: string, compId: string, modId: string, option: string) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : {
          ...ae,
          components: ae.components.map((comp) =>
            comp.id !== compId ? comp : {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, option } : m
              ),
            }
          ),
        }
      ),
    }));
  }

  function updateAEModifierOptions(
    aeId: string,
    compId: string,
    modId: string,
    options: Record<string, boolean | number | string>
  ) {
    setPower((p) => ({
      ...p,
      alternateEffects: p.alternateEffects.map((ae) =>
        ae.id !== aeId ? ae : {
          ...ae,
          components: ae.components.map((comp) =>
            comp.id !== compId ? comp : {
              ...comp,
              modifiers: comp.modifiers.map((m) =>
                m.modifierId === modId ? { ...m, options } : m
              ),
            }
          ),
        }
      ),
    }));
  }

  return {
    addAlternateEffect,
    removeAlternateEffect,
    updateAlternateEffect,
    addAEComponent,
    removeAEComponent,
    updateAEComponent,
    addModifierToAEComponent,
    removeModifierFromAEComponent,
    updateAEModifierRanks,
    updateAEModifierOption,
    updateAEModifierOptions,
  };
}
