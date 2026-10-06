import { describe, expect, it } from 'vitest';
import { batch1 } from '../data/archetypes/batch1';
import { instantiateArchetype, type Answers } from '../data/archetypes/model';
import { effectiveTraitCharacter } from '../shared/lib/traitValues';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { POWER_DEFS } from '../entities/gameDataLoaders';
import { CharacterSchema } from '../entities/schemas';
import { ResourceSchema } from '../services/storage/resourceLibraryStorage';

export const completedAnswers: Record<string, Answers> = {
  battlesuit:{expertise:'Engineering'}, construct:{nature:'soldier',weapon:'Energy'},
  'crime-fighter':{expertise:'Law',advantages:['agile_feint','assessment','contacts','power_attack']},
};
describe('Archetype creation catalog', () => {
  for(const entry of batch1) it(`${entry.id}: source subtotals and export contract`, () => {
    const result=instantiateArchetype(entry,completedAnswers[entry.id],'en');
    const s=result.summary;
    expect([s.abilitiesCost,s.powersCost,s.advantagesCost,s.skillsCost,s.defensesCost]).toEqual(entry.printed);
    expect(result.valid).toBe(true); expect(s.totalSpent).toBe(150);
    expect(CharacterSchema.safeParse(result.character).success).toBe(true);
    result.resources.forEach(resource=>expect(ResourceSchema.safeParse(resource).success).toBe(true));
  });
  it('Battlesuit keeps shared systems when switching from servos to beams',()=>{
    const result=instantiateArchetype(batch1[0],completedAnswers.battlesuit,'en');
    expect(effectiveTraitCharacter(result.character,result.resources).abilities.str).toBe(12);
    const resource=result.resources[0];if(resource.type==='vehicle'||resource.type==='headquarters')throw Error('Expected suit');
    result.character.powerUsage={[`resource:${resource.id}:${resource.power.id}`]:{branchId:resource.power.alternateEffects[0].id}};
    const effective=effectiveTraitCharacter(result.character,result.resources);
    expect(effective.abilities.str).toBe(0);expect(effective.abilities.fgt).toBe(8);
    expect(effective.advantages.find(item=>item.advantageId==='ranged_attack')?.ranks).toBe(6);
    expect(deriveCharacterDefenses(result.character,POWER_DEFS,result.resources).toughnessTotal).toBe(12);
  });
  it('Localized hero names are captured on creation, independently of later drafts',()=>{
    const first=instantiateArchetype(batch1[0],completedAnswers.battlesuit,'pt-BR');
    const second=instantiateArchetype(batch1[0],completedAnswers.battlesuit,'en');
    expect(first.character.header.name).toBe('Armadura de Combate');expect(second.character.header.name).toBe('Battlesuit');
    expect(first.character.characterId).not.toBe(second.character.characterId);
    expect(first.resources[0].id).not.toBe(second.resources[0].id);
    second.character.abilities.str=99;expect(first.character.abilities.str).toBe(0);
  });
  it('Incomplete required choices do not create a ready character',()=>{
    expect(instantiateArchetype(batch1[1],{},'en').valid).toBe(false);
  });
});
