import { describe, expect, it } from 'vitest';
import { getSkillTrainingWarning } from '../shared/lib/skillEligibility';
import { calculateSkillCheck } from '../shared/lib/skillCheck';
import { advantageSkillChecks } from '../features/dice-roller/advantageChecks';
import { SKILL_DEFS } from '../entities/gameDataLoaders';
import { createDefaultCharacter } from '../entities/characterDefaults';

describe('advisory training eligibility', () => {
  const definition = SKILL_DEFS.find(skill => skill.id === 'technology')!;
  const skill = { skillId: 'technology', ranks: 0, subtype: null, otherBonus: 12 };
  it('requires purchased ranks rather than ability or situational bonuses', () => {
    expect(getSkillTrainingWarning(skill, definition, [], true)).not.toBeNull();
    expect(getSkillTrainingWarning({ ...skill, ranks: 1 }, definition, [], true)).toBeNull();
    expect(getSkillTrainingWarning(skill, { ...definition, trainedOnly: false }, [], true)).toBeNull();
  });
  it('respects the flag and Jack-of-all-trades without changing the check bonus', () => {
    const character = createDefaultCharacter();
    const before = calculateSkillCheck(character, skill, definition);
    expect(getSkillTrainingWarning(skill, definition, [], false)).toBeNull();
    expect(getSkillTrainingWarning(skill, definition, [{ advantageId: 'jack_of_all_trades', ranks: 1, subtype: null }], true)).toBeNull();
    expect(calculateSkillCheck(character, skill, definition)).toEqual(before);
  });
  it('covers a skill-based advantage shortcut even when the skill is not purchased', () => {
    const choices = advantageSkillChecks({ advantageId: 'inventor', ranks: 1, subtype: null }, [], SKILL_DEFS);
    expect(choices).toHaveLength(1);
    expect(getSkillTrainingWarning(choices[0].skill, choices[0].definition, [], true)).not.toBeNull();
  });
  it('does not treat Skill Mastery as training or erase subtype-specific choices', () => {
    const mastery = { advantageId: 'skill_mastery', ranks: 1, subtype: 'Technology' };
    expect(getSkillTrainingWarning(skill, definition, [mastery], true)).not.toBeNull();
    const expertise = SKILL_DEFS.find(skill => skill.id === 'expertise')!;
    expect(getSkillTrainingWarning({ skillId: 'expertise', ranks: 0, subtype: 'Magic' }, { ...expertise, trainedOnly: true }, [], true)).not.toBeNull();
  });
});
