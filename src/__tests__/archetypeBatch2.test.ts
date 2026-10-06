import { expect, it } from 'vitest';
import { batch2 } from '../data/archetypes/batch2';
import { instantiateArchetype, power, damage, modifier } from '../data/archetypes/model';
import { validateImportedReferences } from '../services/character-file/validateImportedReferences';
for(const entry of batch2)it(`${entry.id}: calculated costs and valid references`,()=>{
  const result=instantiateArchetype(entry,entry.id==='energy-controller'?{energy:'Fire',alternates:Array.from({length:3},()=>power('Chosen',[damage(12,[modifier('increased_range')])]))}:{},'en');
  const s=result.summary;
  expect([s.abilitiesCost,s.powersCost,s.advantagesCost,s.skillsCost,s.defensesCost]).toEqual(entry.id==='gadgeteer'?[48,41,16,22,22]:entry.printed);
  expect(result.valid).toBe(true);
  expect(()=>validateImportedReferences([result.character],result.resources)).not.toThrow();
});
