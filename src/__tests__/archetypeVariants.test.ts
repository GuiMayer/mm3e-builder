import { expect, it } from 'vitest';
import { ARCHETYPES } from '../data/archetypes';
import { instantiateArchetype, component, damage, power, modifier, type Answers } from '../data/archetypes/model';
import { validateImportedReferences } from '../services/character-file/validateImportedReferences';
import { CharacterSchema } from '../entities/schemas';
import { ResourceSchema } from '../services/storage/resourceLibraryStorage';
import { generateCharacterPDF } from '../services/pdf/pdfGenerator';
import { POWER_DEFS, MODIFIER_DEFS, SKILL_DEFS, ADVANTAGE_DEFS } from '../entities/gameDataLoaders';
import { serializeCharacterJSON } from '../services/character-file/exportCharacter';
import { importCharacterJSON } from '../services/character-file/importCharacter';
import { buildTargetedEffectProfiles } from '../shared/lib/offenseSummary';
import { resolveTraitState } from '../shared/lib/traitValues';
import { normalizeCharacter } from '../services/character-file/normalizeCharacter';
function create(id:string,answers:Answers) { return instantiateArchetype(ARCHETYPES.find(item=>item.id===id)!,answers,'pt-BR'); }
function assertReady(result:ReturnType<typeof create>,cost=150) {
  expect(result.valid).toBe(true);expect(result.summary.totalSpent).toBe(cost);
  CharacterSchema.parse(result.character);result.resources.forEach(resource=>ResourceSchema.parse(resource));
  validateImportedReferences([result.character],result.resources);
  const ids=[result.character.characterId,...result.resources.map(item=>item.id),...result.character.resourceLinks!.map(item=>item.id)];
  expect(new Set(ids).size).toBe(ids.length);
}
for(const nature of ['elemental','soldier','undead','wraith'])it(`Construct variant: ${nature}`,()=>assertReady(create('construct',{nature,weapon:'Fire'})));
for(const gift of ['aquatic','fast','leaping','senses','flight'])it(`Warrior gift: ${gift}`,()=>assertReady(create('warrior',{gift,expertise:'History',advantages:['accurate_attack','all_out_attack','animal_empathy','fearless']})));
it('Strong and weapon Warriors preserve their 150 PP budget',()=>{
  assertReady(create('warrior',{variant:'strong',gift:'fast',expertise:'Tactics',advantages:['accurate_attack','all_out_attack','animal_empathy','fearless']}));
  assertReady(create('warrior',{variant:'weapon',gift:'fast',expertise:'Tactics',advantages:['accurate_attack','all_out_attack','animal_empathy','fearless','improved_disarm','leadership']}));
});
for(const weapon of ['bow','daggers','gun','sword','whip'])it(`Weapon Master equipment: ${weapon}`,()=>{
  const result=create('weapon-master',{weapon,'bow-type':'multiattack',expertise:'History',talents:['fast','healing'],advantages:['accurate_attack','agile_feint','assessment','connected','contacts','defensive_attack']});assertReady(result);expect(result.summary.totalEPUsed).toBe(25);
  const attack=buildTargetedEffectProfiles(result.character,POWER_DEFS,SKILL_DEFS,ADVANTAGE_DEFS,MODIFIER_DEFS,undefined,result.resources).find(item=>item.sourceType==='resource'&&item.effectRank&&item.requiresAttackCheck);
  expect(attack?.bonusValue).toBe(13);
});
for(const talent of ['blocking','crippling','gadgets','improvised','fast','hearing','vision','acrobat'])it(`Weapon Master talent: ${talent}`,()=>{
  const result=create('weapon-master',{weapon:'gun',expertise:'History',talents:[talent,'healing'],advantages:['accurate_attack','agile_feint','assessment','connected','contacts','defensive_attack']});assertReady(result,['blocking','crippling','gadgets','improvised'].includes(talent)?148:150);
});
it('Crime Fighter variants preserve the budget and use linked resources',()=>{
  const base={expertise:'Law',advantages:['agile_feint','assessment','contacts','power_attack']};
  assertReady(create('crime-fighter',{...base,variant:'vehicle','vehicle-model':'motorcycle'}));
  const custom=power('Device',[component('flight',5)]);
  assertReady(create('crime-fighter',{...base,variant:'gimmick',device:[custom]}));
  const purchased=component('senses',3,[],{senseTraits:[{id:'darkvision',ranks:2},{id:'direction_sense',ranks:1}]});
  assertReady(create('crime-fighter',{...base,variant:'sentinel','sentinel-senses':[power('Senses',[purchased])]}));
});
it('Rejects incomplete, nested, over-budget and unsupported chosen compositions',()=>{
  const source={energy:'Fire'};const alternatives=Array.from({length:3},()=>power('Effect',[damage(12,[modifier('increased_range')])]));
  expect(create('energy-controller',source).valid).toBe(false);
  expect(create('energy-controller',{...source,alternates:alternatives}).valid).toBe(true);
  alternatives[0].components[0].ranks=13;
  expect(create('energy-controller',{...source,alternates:alternatives}).valid).toBe(false);
  alternatives[0]=power('Nested',[damage(1)],[power('AE',[damage(1)])]);
  expect(create('energy-controller',{...source,alternates:alternatives}).valid).toBe(false);
});
it('Explicit Impervious Extra is reported without adding Toughness or unresolved trait warnings',()=>{
  const result=create('paragon',{expertise:'Journalism'});
  expect(resolveTraitState(result.character).warnings).toEqual([]);
});
it('A created suit round-trips through JSON and produces PDF HTML',async()=>{
  const result=create('battlesuit',{expertise:'Engineering'});
  const blob=serializeCharacterJSON(result.character,'pt-BR',result.resources);
  const restored=await importCharacterJSON(new File([blob],'archetype.json',{type:'application/json'}));
  expect(restored).toEqual(normalizeCharacter(result.character));
  const pdf=await generateCharacterPDF({character:restored,resources:result.resources,powerDefs:POWER_DEFS,modifierDefs:MODIFIER_DEFS,skillDefs:Object.fromEntries(SKILL_DEFS.map(item=>[item.id,item])),advantageDefs:Object.fromEntries(ADVANTAGE_DEFS.map(item=>[item.id,item])),language:'pt-BR'});
  expect(pdf.success).toBe(true);expect(pdf.html).toContain('Armadura de Combate');
});
