import { expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { enhanced, enhancedAdv, damage, modifier, power } from '../data/archetypes/model';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { effectiveTraitCharacter } from '../shared/lib/traitValues';
import { deriveCharacterDefenses } from '../shared/lib/derivedDefenses';
import { getPricingStrength } from '../shared/lib/pricingStrength';
import { MODIFIER_DEFS, POWER_DEFS } from '../entities/gameDataLoaders';
import { CharacterSchema } from '../entities/schemas';

it('Enhanced Advantage projects active ranks without charging them twice',()=>{
  const p=power('Speed',[enhancedAdv('improved_initiative',3)]);
  const character=createDefaultCharacter({ powers:[p] }); character.abilities.agl=4;
  expect(deriveCharacterDefenses(character,POWER_DEFS).initiativeTotal).toBe(16);
  expect(calculateCharacterPointSummary(character,[],POWER_DEFS,MODIFIER_DEFS).advantagesCost).toBe(0);
  expect(character.advantages).toEqual([]);
  character.powerUsage={[`power:${p.id}`]:{enabled:false}};
  expect(deriveCharacterDefenses(character,POWER_DEFS).initiativeTotal).toBe(4);
  expect(CharacterSchema.parse(character).powers).toEqual(character.powers);
});
it('Lifting-only Strength never contributes to attack damage or purchased Strength extras',()=>{
  const character=createDefaultCharacter({powers:[power('Lifting',[enhanced({kind:'ability',key:'str'},4,true)]),power('Attack',[damage(2,[modifier('multiattack')],true)])]});character.abilities.str=10;
  expect(effectiveTraitCharacter(character).abilities.str).toBe(10);
  expect(getPricingStrength(character)).toBe(10);
  const summary=calculateCharacterPointSummary(character,[],POWER_DEFS,MODIFIER_DEFS);
  expect(summary.powerPricing.map(item=>item.total)).toEqual([4,14]);
});
it('Legacy Enhanced Advantage without an explicit association stays manual',()=>{
  const c=enhancedAdv('improved_initiative',3);delete c.fieldValues;
  const character=createDefaultCharacter({powers:[power('Manual',[c])]});
  expect(effectiveTraitCharacter(character).advantages).toEqual([]);
});
