import { expect, it } from 'vitest';
import { batch5 } from '../data/archetypes/batch5';
import { instantiateArchetype } from '../data/archetypes/model';
import { validateImportedReferences } from '../services/character-file/validateImportedReferences';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { POWER_DEFS } from '../entities/gameDataLoaders';
const choices={speedster:{expertise:'Science'},warrior:{expertise:'History',gift:'fast',advantages:['accurate_attack','all_out_attack','animal_empathy','fearless']},'weapon-master':{expertise:'History',talents:['fast','healing'],weapon:'gun',advantages:['accurate_attack','agile_feint','assessment','connected','contacts','defensive_attack']}};
for(const entry of batch5)it(`${entry.id}: costs and effective initiative`,()=>{
  const result=instantiateArchetype(entry,choices[entry.id as keyof typeof choices],'en');const s=result.summary;
  expect([s.abilitiesCost,s.powersCost,s.advantagesCost,s.skillsCost,s.defensesCost]).toEqual(entry.printed);
  expect({missing:result.missing,diagnostics:result.summary.diagnostics}).toEqual({missing:[],diagnostics:[]});validateImportedReferences([result.character],result.resources);
  if(entry.id==='speedster')expect(deriveCharacterDefenses(result.character,POWER_DEFS).initiativeTotal).toBe(16);
  if(entry.id==='weapon-master')expect(s.totalEPUsed).toBe(25);
});
