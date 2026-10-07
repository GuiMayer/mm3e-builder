import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacter, IValidationRules } from '../entities/types';
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';
import { usePLValidation } from '../shared/hooks/usePLValidation';
const state = vi.hoisted(() => ({ character: null as unknown as ICharacter, rules: null as unknown as IValidationRules }));
vi.mock('react', async original => ({ ...await original<typeof import('react')>(), useMemo: (factory: () => unknown) => factory() }));
vi.mock('../shared/hooks/useActiveCharacter', () => ({ useActiveCharacter: () => ({ character: state.character }) }));
vi.mock('../store/appStore', () => ({ useAppStore: (selector: (data: unknown) => unknown) => selector({ validationRules: state.rules }) }));
vi.mock('../store/resourcesStore', () => ({ useResourcesStore: (selector: (data: unknown) => unknown) => selector({ resources: [] }) }));
vi.mock('../shared/hooks/useLocalizedData', () => ({ useLocalizedData: (defs: unknown) => defs }));
beforeEach(() => { state.character = createDefaultCharacter(); state.rules = { ...DEFAULT_VALIDATION_RULES }; });

describe('PL validation audit (Handbook p.24)', () => {
  it('checks the total for untrained skills, including abilities with no purchased skill row', () => {
    state.character.header.powerLevel = 5;
    state.character.abilities.pre = 16;
    expect(usePLValidation().some(notice => notice.rule === 'validation.skill')).toBe(true);
  });
  it('includes combat advantage modifiers in the skill cap', () => {
    state.character.abilities.dex = 5;
    state.character.skills = [{ skillId: 'ranged_combat', subtype: 'Bow', ranks: 12 }];
    state.character.advantages = [{ advantageId: 'ranged_attack', ranks: 4 }];
    expect(usePLValidation().some(notice => notice.rule === 'validation.skill')).toBe(true);
  });
  it('keeps circumstance bonuses out of the PL cap', () => {
    state.character.abilities.dex = 5;
    state.character.skills = [{ skillId: 'ranged_combat', subtype: 'Bow', ranks: 8 }];
    state.character.advantages = [{ advantageId: 'ranged_attack', ranks: 4 }];
    state.character.traitModifiers = [{ id: 'circumstance', source: 'Circumstance', value: 50, active: true, scope: 'check', target: { kind: 'skill', skillId: 'ranged_combat', subtype: 'Bow' } }];
    expect(usePLValidation().some(notice => notice.rule === 'validation.skill')).toBe(false);
  });
  it('continues to respect the existing setting for PL notices', () => {
    state.character.header.powerLevel = 5;
    state.character.abilities.pre = 16;
    state.rules.enforcePLLimits = false;
    expect(usePLValidation().some(notice => notice.rule === 'validation.skill')).toBe(false);
  });
  it('validates a frozen saved sheet without changing purchased ranks or optional fields', () => {
    state.character.abilities.dex = 5;
    state.character.skills = [{ skillId: 'ranged_combat', subtype: 'Bow', ranks: 12, otherBonus: 0 }];
    state.character.advantages = [{ advantageId: 'ranged_attack', ranks: 4 }];
    const serialized = JSON.stringify(state.character);
    function freeze(value: unknown) {
      if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); }
    }
    freeze(state.character);
    expect(usePLValidation().some(notice => notice.rule === 'validation.skill')).toBe(true);
    expect(JSON.stringify(state.character)).toBe(serialized);
  });
});
