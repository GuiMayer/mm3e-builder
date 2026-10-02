import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { SKILL_DEFS } from '../entities/gameDataLoaders';
import { advantageSkillChecks } from '../features/dice-roller/advantageChecks';
import { createRoll } from '../features/dice-roller/rollModel';
import { calculateSkillCheck } from '../shared/lib/skillCheck';
import { useCharactersStore } from '../store/charactersStore';
import { useRollSession } from '../features/dice-roller/rollSessionStore';

describe('Sheet check sources', () => {
  it('uses the displayed skill total, including negative miscellaneous bonuses and absent abilities', () => {
    const character = createDefaultCharacter();
    character.abilities.agl = 6;
    const skill = { skillId: 'acrobatics', ranks: 4, subtype: null, otherBonus: -2 };
    const definition = SKILL_DEFS.find(def => def.id === skill.skillId)!;
    expect(calculateSkillCheck(character, skill, definition).total).toBe(8);
    character.absentAbilities = ['agl'];
    expect(calculateSkillCheck(character, skill, definition)).toEqual({ ability: 0, ranks: 4, other: -2, total: 2 });
  });

  it('resolves legacy skill references after switching the catalog language', () => {
    const skill = { skillId: 'acrobatics', ranks: 4, subtype: null };
    const definition = SKILL_DEFS.find(def => def.id === skill.skillId)!;
    const portuguese = { ...definition, name: 'Acrobacia' };
    for (const reference of ['Acrobatics', 'Acrobacia']) {
      const checks = advantageSkillChecks({ advantageId: 'skill_mastery', ranks: 1, subtype: reference }, [skill], [portuguese]);
      expect(checks).toHaveLength(1);
      expect(checks[0].routine).toBe(true);
    }
  });

  it('keeps scoped skill subtypes distinct', () => {
    const skills = ['Magic', 'History'].map(subtype => ({ skillId: 'expertise', ranks: 3, subtype }));
    const checks = advantageSkillChecks({ advantageId: 'skill_mastery', ranks: 1, subtype: 'Expertise: Magic' }, skills, SKILL_DEFS);
    expect(checks.map(check => check.skill.subtype)).toEqual(['Magic']);
  });

  it('uses skill bonuses rather than advantage ranks and offers no check for passive advantages', () => {
    const character = createDefaultCharacter();
    character.abilities.pre = 2;
    const skills = [{ skillId: 'deception', ranks: 5, subtype: null, otherBonus: 1 }];
    const [check] = advantageSkillChecks({ advantageId: 'taunt', ranks: 99, subtype: null }, skills, SKILL_DEFS);
    expect(calculateSkillCheck(character, check.skill, check.definition).total).toBe(8);
    expect(advantageSkillChecks({ advantageId: 'luck', ranks: 3, subtype: null }, skills, SKILL_DEFS)).toEqual([]);
    expect(advantageSkillChecks({ advantageId: 'daze', ranks: 1, subtype: 'Unknown skill' }, skills, SKILL_DEFS)).toEqual([]);
  });

  it('records Skill Mastery as a fixed 10 with the selected skill total', () => {
    const character = createDefaultCharacter();
    character.abilities.agl = 3;
    const [check] = advantageSkillChecks({ advantageId: 'skill_mastery', ranks: 1, subtype: 'Acrobatics' }, [{ skillId: 'acrobatics', ranks: 4, subtype: null }], SKILL_DEFS);
    const result = createRoll({ bonus: calculateSkillCheck(character, check.skill, check.definition).total, mode: check.routine ? 'routine' : 'd20', source: { characterId: 'a', characterName: 'Hero', section: 'Advantages', label: 'Skill Mastery · Acrobatics' } }, 1);
    expect(result).toMatchObject({ die: 10, total: 17, mode: 'routine' });
  });

  it('leaves character contents, dirty revisions and undo histories intact while rolling and switching sheets', () => {
    const previous = useCharactersStore.getState();
    try {
      const first = previous.addCharacter({ header: { ...createDefaultCharacter().header, name: 'Hero A' } });
      const second = previous.addCharacter({ header: { ...createDefaultCharacter().header, name: 'Hero B' } });
      const before = useCharactersStore.getState();
      const snapshots = JSON.stringify({ tabs: before.tabs, histories: before.historyByTabId });
      before.setActiveCharacter(first);
      useRollSession.getState().roll({ bonus: 3, source: { characterId: first, characterName: 'Hero A', section: 'Skills', label: 'Acrobatics' } });
      before.setActiveCharacter(second);
      useRollSession.getState().roll({ bonus: 1, source: null });
      const after = useCharactersStore.getState();
      expect(JSON.stringify({ tabs: after.tabs, histories: after.historyByTabId })).toBe(snapshots);
      expect(useRollSession.getState().history[1].source?.characterName).toBe('Hero A');
    } finally {
      useCharactersStore.setState(previous);
      useRollSession.setState({ history: [], notice: null, sequence: 0, limit: 15, isOpen: false });
    }
  });
});
