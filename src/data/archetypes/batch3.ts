import { advantage as a, component as c, damage, enhanced, modifier as m, power, skill as k, specific as s, text, type Archetype } from './model';
import { awareness, ranged, shield } from './common';
export const batch3: Archetype[] = [
  {id:'mimic',name:text('Mimic','Mímico'),summary:text('Duplicates the traits of one subject with a Variable power pool.','Duplica as características de um alvo com uma reserva de poder Variável.'),page:41,printed:[32,84,1,12,21],build(d){
    d.abilities([1,1,8,1,1,1,1,2]);d.defenses(7,0,7,7);d.advantages('assessment');
    d.skills(k('deception',6),k('insight',8),k('perception',6));d.expertise('expertise',4);
    d.addPower('Mimic','Mimetismo',[c('variable',12,[m('increased_duration',1,{subtypeId:'one_step'}),s('action_variable',1,{subtypeId:'move'}),s('limited_variable'),m('resistible')],{fieldValues:{resistance:'dodge'}})],[],d.label('60 PP to duplicate one subject’s traits. Move action to reconfigure; Continuous; resisted by Dodge DC 22. Configure copied traits manually, within PL limits.','60 PP para duplicar características de um alvo. Ação de movimento para reconfigurar; Contínuo; resistido por Esquiva CD 22. Configure as características copiadas manualmente, respeitando o NP.'));
  }},
  {id:'mystic',name:text('Mystic','Místico'),summary:text('An occult hero with astral projection and a versatile spell array.','Um herói ocultista com projeção astral e um repertório versátil de feitiços.'),page:42,printed:[42,64,8,14,22],build(d){
    d.abilities([0,1,4,6,0,3,3,4]);d.defenses(7,2,6,7);d.advantages('fearless',a('ranged_attack',5),'ritualist','trance');
    d.skills(k('expertise',10,'Magic'),k('insight',6),k('intimidation',4),k('perception',4),k('sleight_of_hand',4));
    const astral=d.addPower('Astral projection','Projeção astral',[c('remote-sensing',10,[m('limited'),s('subtle',2)],{variableCostOption:'Four sense types',fieldValues:{senses:['visual','auditory','mental']}})],[power(d.label('Levitation','Levitação'),[c('flight',4),shield(12)])],d.label('While projecting, the physical body is defenseless (Limited). Vision counts as two sense types. Levitation and its linked force field are initially selected to match the printed defenses.','Durante a projeção, o corpo físico fica indefeso (Limitado). Visão conta como dois tipos de sentidos. Levitação e seu campo de força vinculado começam selecionados para reproduzir as defesas impressas.'));
    d.character.powerUsage={[`power:${astral.id}`]:{branchId:astral.alternateEffects[0].id}};
    d.addPower('Mystic senses','Sentidos místicos',[awareness('Magic')]);
    d.addPower('Spellcasting','Feitiços',[damage(12,[ranged()])],d.powers('alternates',5,24),d.label('Magic damage and five chosen alternate spells.','Dano mágico e cinco feitiços alternativos escolhidos.'));
  }},
  {id:'paragon',name:text('Paragon','Paragão'),summary:text('A flying powerhouse with superhuman strength and resilience.','Um herói voador com força sobre-humana e resistência extraordinária.'),page:43,printed:[36,84,1,17,12],build(d){
    d.abilities([2,3,8,1,2,1,0,1]);d.defenses(5,0,0,7);d.advantages('power_attack');
    d.skills(k('insight',6),k('perception',8),k('persuasion',6),k('ranged_combat',7,'Throwing'));d.expertise('expertise',7);
    d.addPower('Flight','Voo',[c('flight',9)]);
    d.addPower('Invulnerability','Invulnerabilidade',[enhanced({kind:'ability',key:'sta'},10),c('immunity',10,[],{fieldValues:{immunity:'Life Support'}}),c('enhanced-trait',12,[],{variableCostOption:'Enhanced Extra',fieldValues:{extra:'Impervious Toughness 12'}})],[],d.label('Impervious Toughness 12 is an enhanced extra, not 12 additional Toughness ranks.','Resistência Impenetrável 12 é um extra aprimorado, e não mais 12 graduações de Resistência.'));
    d.addPower('Super-speed','Supervelocidade',[c('quickness',2)]);
    d.addPower('Super-strength','Superforça',[enhanced({kind:'ability',key:'str'},10),enhanced({kind:'ability',key:'str'},2,true)],[],d.label('Strength 12 for attacks; lifting Strength 14.','Força 12 para ataques; Força 14 para levantar peso.'));
  }}
];
