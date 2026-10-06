import { expect, it } from 'vitest';
import { batch4 } from '../data/archetypes/batch4';
import { instantiateArchetype } from '../data/archetypes/model';
import { validateImportedReferences } from '../services/character-file/validateImportedReferences';
for(const entry of batch4)it(`${entry.id}: source values and documented editorial differences`,()=>{
  const result=instantiateArchetype(entry,{expertise:'Acting'},'en');const s=result.summary;
  expect([s.abilitiesCost,s.powersCost,s.advantagesCost,s.skillsCost,s.defensesCost]).toEqual(entry.id==='psychic'?[32,78,1,12,27]:entry.printed);
  expect({missing:result.missing,diagnostics:result.summary.diagnostics}).toEqual({missing:[],diagnostics:[]});validateImportedReferences([result.character],result.resources);
});
