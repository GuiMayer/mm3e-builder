import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower, ITraitTarget } from '../entities/types';
import { circumstanceBonus, effectiveTraitCharacter, resolveTraitState } from '../shared/lib/traitValues';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS } from '../entities/gameDataLoaders';
import { calculateSkillCheck } from '../shared/lib/skillCheck';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';
import { getSkillTrainingWarning } from '../shared/lib/skillEligibility';

function enhanced(target: ITraitTarget, ranks: number, id = 'enhancement'): ICharacterPower {
  return { id, name: 'Enhancement', notes: '', alternateEffects: [], components: [{ id: `${id}-c`, effectId: 'enhanced-trait', ranks, modifiers: [], enhancedTarget: target }] };
}
describe('effective trait projections', () => {
  it('derives Strength without double charging or mutating purchased ranks', () => {
    const character = createDefaultCharacter({ powers: [enhanced({ kind: 'ability', key: 'str' }, 5)] });
    character.abilities.str = 2;
    const before = JSON.stringify(character);
    const effective = effectiveTraitCharacter(character);
    expect(effective.abilities.str).toBe(7);
    expect(effectiveTraitCharacter(effective).abilities.str).toBe(7);
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).totalSpent).toBe(14);
    expect(buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [])[0].effectRank).toBe(7);
    expect(JSON.stringify(character)).toBe(before);
    const disabled = { ...character, powerUsage: { 'power:enhancement': { enabled: false } } };
    expect(effectiveTraitCharacter(disabled).abilities.str).toBe(2);
    expect(calculateCharacterPointSummary(disabled, [], POWER_DEFS, MODIFIER_DEFS).totalSpent).toBe(14);
  });
  it('propagates ability ranks into skills, defenses, initiative and attacks', () => {
    const character = createDefaultCharacter({ powers: [enhanced({ kind: 'ability', key: 'agl' }, 3, 'agility'), enhanced({ kind: 'ability', key: 'fgt' }, 4, 'fighting'), enhanced({ kind: 'defense', key: 'dodge' }, 2, 'dodge')] });
    const check = calculateSkillCheck(character, { skillId: 'acrobatics', ranks: 0, subtype: null }, SKILL_DEFS.find(def => def.id === 'acrobatics')!);
    expect(check.total).toBe(3);
    expect(deriveCharacterDefenses(character, POWER_DEFS)).toMatchObject({ dodgeTotal: 5, parryTotal: 4, initiativeTotal: 3 });
    expect(buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [])[0].bonusValue).toBe(4);
  });
  it('keeps circumstance modifiers scoped to their checks', () => {
    const character = createDefaultCharacter({ traitModifiers: [{ id: 'condition', target: { kind: 'ability', key: 'str' }, scope: 'check', value: 2, source: 'Tools', active: true }] });
    expect(circumstanceBonus(character, { kind: 'ability', key: 'str' })).toBe(2);
    expect(effectiveTraitCharacter(character).abilities.str).toBe(0);
    expect(buildTargetedEffectProfiles(character, POWER_DEFS, SKILL_DEFS, [])[0].effectRank).toBe(0);
    expect(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS).totalSpent).toBe(0);
  });
  it('grants skill training only through purchased enhanced ranks and includes it in PDF', async () => {
    const definition = SKILL_DEFS.find(def => def.id === 'technology')!;
    const character = createDefaultCharacter({ powers: [enhanced({ kind: 'skill', skillId: 'technology' }, 4)], skills: [{ skillId: 'technology', ranks: 0, subtype: null }] });
    const effective = effectiveTraitCharacter(character);
    expect(calculateSkillCheck(character, character.skills[0], definition).total).toBe(4);
    expect(getSkillTrainingWarning(effective.skills[0], definition, [], true)).toBeNull();
    const bonusOnly = { ...character, powers: [], traitModifiers: [{ id: 'b', target: { kind: 'skill' as const, skillId: 'technology' }, scope: 'check' as const, value: 4, active: true, source: 'Tools' }] };
    expect(getSkillTrainingWarning(effectiveTraitCharacter(bonusOnly).skills[0], definition, [], true)).not.toBeNull();
    const result = await generateCharacterPDF({ character, powerDefs: POWER_DEFS, modifierDefs: MODIFIER_DEFS, skillDefs: { technology: definition }, advantageDefs: {} });
    expect(result.success).toBe(true);
    expect(result.html).toContain('Technology');
    expect(result.html).toContain('+4');
  });
  it('keeps legacy targetless enhancements and absent abilities unchanged', () => {
    const power = enhanced({ kind: 'ability', key: 'str' }, 5);
    delete power.components[0].enhancedTarget;
    power.components[0].variableCostOption = 'Enhanced Ability';
    const legacy = createDefaultCharacter({ powers: [power] });
    expect(resolveTraitState(legacy).warnings[0].key).toBe('traits.missingTarget');
    expect(effectiveTraitCharacter(legacy).abilities.str).toBe(0);
    expect(effectiveTraitCharacter(createDefaultCharacter({ absentAbilities: ['str'], powers: [enhanced({ kind: 'ability', key: 'str' }, 5)] })).abilities.str).toBe(0);
  });
  it('prices Strength-based extras at purchased capacity independent of usage', () => {
    const strength = enhanced({ kind: 'ability', key: 'str' }, 5);
    const damage: ICharacterPower = { id: 'damage', name: 'Strike', notes: '', alternateEffects: [], components: [{ id: 'd', effectId: 'damage', ranks: 1, fieldValues: { damageBasis: 'strength-based' }, modifiers: [{ modifierId: 'multiattack', ranks: 1, isPowerSpecific: false }] }] };
    const character = createDefaultCharacter({ powers: [strength, damage] });
    const before = calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS);
    const after = calculateCharacterPointSummary({ ...character, powerUsage: { 'power:enhancement': { enabled: false } } }, [], POWER_DEFS, MODIFIER_DEFS);
    expect(before.totalSpent).toBe(17);
    expect(after.totalSpent).toBe(before.totalSpent);
  });
});
