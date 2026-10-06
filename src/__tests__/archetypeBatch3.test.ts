import { expect, it } from 'vitest';
import { batch3 } from '../data/archetypes/batch3';
import { instantiateArchetype, power, damage, modifier } from '../data/archetypes/model';
import { validateImportedReferences } from '../services/character-file/validateImportedReferences';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { POWER_DEFS } from '../entities/gameDataLoaders';
import { getPricingStrength } from '../shared/lib/pricingStrength';
for(const entry of batch3)it(`${entry.id}: purchased ranks, arrays and limited Strength`,()=>{
  const result=instantiateArchetype(entry,entry.id==='mystic'?{alternates:Array.from({length:5},()=>power('Spell',[damage(12,[modifier('increased_range')])]))}:{expertise:'Acting'},'en');
  const s=result.summary;
  expect([s.abilitiesCost,s.powersCost,s.advantagesCost,s.skillsCost,s.defensesCost]).toEqual(entry.printed);
  expect(result.valid).toBe(true);
  expect(()=>validateImportedReferences([result.character],result.resources)).not.toThrow();
  if(entry.id==='mystic')expect(deriveCharacterDefenses(result.character,POWER_DEFS,result.resources).toughnessTotal).toBe(12);
  if(entry.id==='paragon')expect(getPricingStrength(result.character,result.resources)).toBe(12);
});
