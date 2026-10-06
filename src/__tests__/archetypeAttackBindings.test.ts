import { expect, it } from 'vitest';
import { batch2 } from '../data/archetypes/batch2';
import { instantiateArchetype, power, damage, modifier } from '../data/archetypes/model';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../entities/gameDataLoaders';
it('Energy attacks retain their purchased combat specialization after localization',()=>{
  const result=instantiateArchetype(batch2[0],{energy:'Fire',alternates:Array.from({length:3},()=>power('Chosen',[damage(12,[modifier('increased_range')])]))},'pt-BR');
  const rows=buildTargetedEffectProfiles(result.character,POWER_DEFS,SKILL_DEFS,ADVANTAGE_DEFS,MODIFIER_DEFS,undefined,result.resources);
  expect(rows.filter(row=>row.componentId===result.character.powers[1].components[0].id)[0].bonusValue).toBe(8);
});
