import { advantage as a, affliction, component as c, damage, enhanced, enhancedAdv, modifier as m, options, power, skill as k, text, type Archetype } from './model';
import { advOptions, movement, ranged, senses, vehicle, weaponAdvantages } from './common';
const warriorAdvantages=[...advOptions(['accurate_attack','all_out_attack','animal_empathy','benefit','defensive_attack','fearless','improved_disarm']),...options(['favored_environment:Choose','Favored Environment','Ambiente Favorecido'],['favored_foe:Choose','Favored Foe','Inimigo Favorecido'],['improved_critical:Unarmed','Improved Critical (Unarmed)','Crítico Aprimorado (Desarmado)'],['languages:Choose','Languages','Idiomas'],['leadership','Leadership','Liderança'],['precise_attack:Close, Cover','Precise Attack (Close, Cover)','Ataque Preciso (Corpo a corpo, Cobertura)'],['precise_attack:Ranged, Cover','Precise Attack (Ranged, Cover)','Ataque Preciso (À distância, Cobertura)'],['precise_attack:Close, Concealment','Precise Attack (Close, Concealment)','Ataque Preciso (Corpo a corpo, Camuflagem)'],['precise_attack:Ranged, Concealment','Precise Attack (Ranged, Concealment)','Ataque Preciso (À distância, Camuflagem)'],['skill_mastery:Choose','Skill Mastery','Maestria em Perícia'],['tracking','Tracking','Rastrear'])];
export const batch5: Archetype[] = [
  {id:'speedster',name:text('Speedster','Velocista'),summary:text('Lightning-fast movement, initiative, defenses and rapid strikes.','Movimento, iniciativa, defesas e golpes extremamente rápidos.'),page:47,printed:[36,67,5,25,17],build(d){
    d.abilities([2,4,4,1,2,3,0,2]);d.defenses(0,0,8,9);d.advantages(a('defensive_roll',3),'instant_up','move_by_action');
    d.skills(k('acrobatics',4),k('athletics',8),k('close_combat',6,'Unarmed'),k('deception',6),k('perception',8),k('ranged_combat',6,'Thrown'),k('technology',6));d.expertise();
    d.addPower('Fast attack','Ataque rápido',[damage(3,[m('multiattack'),m('selective')],true)],[power(d.label('Burst attack','Ataque em explosão'),[damage(3,[m('area',1,{shape:'burst'}),m('selective')],true)])]);
    d.addPower('Super-speed defenses','Defesas de supervelocidade',[enhanced({kind:'defense',key:'dodge'},11),enhanced({kind:'defense',key:'parry'},11)]);
    d.addPower('Super-speed','Supervelocidade',[enhancedAdv('improved_initiative',3),c('quickness',10),c('speed',15)],[],d.label('Improved Initiative 3 is granted by this power, not purchased twice.','Iniciativa Aprimorada 3 é concedida pelo poder, sem compra duplicada.'));
    d.addPower('Water running','Correr sobre a água',[movement(1,'Water Walking',true)],[],d.label('Only while moving.','Apenas enquanto se move.'));
    d.addPower('Wall running','Correr pelas paredes',[movement(2,'Wall Crawling',true)],[],d.label('Only while moving.','Apenas enquanto se move.'));
  }},
  {id:'warrior',name:text('Warrior','Guerreiro'),summary:text('A powerful warrior with exceptional combat training and a chosen gift.','Um guerreiro poderoso com grande treinamento de combate e um dom escolhido.'),page:48,printed:[94,12,14,18,12],build(d){
    d.abilities([10,6,10,4,8,4,1,4]);d.defenses(4,0,2,6);
    const variant=d.select('variant',text('Variant','Variante'),options(['standard','Standard','Padrão'],['strong','Strong warrior','Guerreiro forte'],['weapon','Weapon warrior','Guerreiro armado']),true,'standard');
    if(variant==='strong'){d.character.abilities.str+=2;d.character.abilities.fgt-=2;}
    if(variant==='weapon'){d.character.abilities.str-=3;const weapon=power(d.label('Unique weapon','Arma única'),[damage(3,[m('penetrating',5)],true)]);weapon.removable='easily_removable';d.resource(weapon,'device');}
    d.advantages('agile_feint',a('defensive_roll',2),'move_by_action','power_attack',a('ranged_attack',4),'takedown');d.chosenAdvantages('advantages',variant==='weapon'?6:4,warriorAdvantages);
    for(const adv of d.character.advantages.filter(item=>item.subtype==='Choose'))adv.subtype=d.input(`specialization-${adv.advantageId}`,text(`Specialization: ${adv.advantageId}`,`Especialização: ${adv.advantageId}`));
    const expertise=d.select('expertise',text('Expertise','Conhecimento'),options(['History','History','História'],['Mythology','Mythology','Mitologia'],['Tactics','Tactics','Táticas']));
    d.skills(k('acrobatics',6),k('athletics',5),k('expertise',4,expertise),k('insight',6),k('intimidation',5),k('perception',6),k('stealth',4));
    d.addPower('Super-strength','Superforça',[enhanced({kind:'ability',key:'str'},2,true)],[],d.label('Adds two Strength ranks only for lifting.','Acrescenta duas graduações de Força apenas para levantar peso.'));
    const gift=d.select('gift',text('Choose a gift','Escolha um dom'),options(['aquatic','Aquatic','Aquático'],['fast','Fast','Veloz'],['leaping','Leaping','Saltador'],['senses','Super-senses','Supersentidos'],['flight','Wind-riding','Cavaleiro dos ventos']));
    if(gift==='aquatic')d.addPower('Aquatic','Aquático',[c('immunity',1,[],{fieldValues:{immunity:'Drowning'}}),c('swimming',6),movement(1,'Environmental Adaptation: Aquatic'),senses([{id:'low_light_vision',ranks:1}])]);
    if(gift==='fast')d.addPower('Fast','Veloz',[c('quickness',5),c('speed',5)]);
    if(gift==='leaping')d.addPower('Super-leaping','Supersalto',[c('leaping',10)]);
    if(gift==='flight')d.addPower('Wind-riding','Cavaleiro dos ventos',[c('flight',5)]);
    if(gift==='senses'){
      const mode=d.select('senses-mode',text('Super-senses configuration','Configuração dos supersentidos'),options(['listed','Listed senses','Sentidos do arquétipo'],['custom','Choose other senses','Escolher outros sentidos']),true,'listed');
      if(mode==='listed')d.addPower('Super-senses','Supersentidos',[senses([{id:'accurate',ranks:2,senseType:'Auditory',scope:'sense'},{id:'analytical',ranks:1,senseType:'Auditory',scope:'sense'},{id:'danger_sense',ranks:1,senseType:'Auditory'},{id:'extended',ranks:1,senseType:'Auditory'},{id:'extended',ranks:1,senseType:'Visual'},{id:'counters_illusion',ranks:2,senseType:'Auditory'},{id:'tracking',ranks:1,senseType:'Visual'},{id:'ultra_hearing',ranks:1}])]);
      else{const p=d.powers('senses',1,10)[0];if(p){if(p.components.some(item=>item.effectId!=='senses'||!item.senseTraits?.length)||p.components.reduce((sum,item)=>sum+item.ranks,0)!==10)d.missing.push('senses');d.character.powers.push(p);}}
    }
  }},
  {id:'weapon-master',name:text('Weapon Master','Mestre de Armas'),summary:text('A specialized weapon, a motorcycle and two chosen talents.','Uma arma especializada, uma motocicleta e dois talentos escolhidos.'),page:49,printed:[50,10,17,45,28],note:text('Some 7 PP Easily Removable options are printed as 5 PP. Rounding up gives a 4 PP discount and a 3 PP cost; the actual sheet total depends on the options selected.','Algumas opções Facilmente Removíveis de 7 PP estão impressas como 5 PP. O arredondamento para cima desconta 4 PP e resulta em 3 PP; o total da ficha depende das opções escolhidas.'),build(d){
    d.abilities([3,5,7,1,2,5,0,2]);d.defenses(7,7,6,8);d.advantages(a('defensive_roll',4),a('equipment',5),'evasion',a('improved_critical',1,'Weapon'));d.chosenAdvantages('advantages',6,weaponAdvantages);
    d.skills(k('acrobatics',8),k('athletics',8),k('close_combat',6,'Weapon'),k('deception',8),k('expertise',8,'Weapons'),k('intimidation',6),k('investigation',6),k('perception',8),k('ranged_combat',8,'Weapon'),k('sleight_of_hand',6),k('stealth',8),k('vehicles',4));d.expertise();
    const talents=d.many('talents',text('Choose two talents','Escolha dois talentos'),options(['blocking','Blocking','Bloqueio'],['crippling','Crippling strike','Golpe debilitante'],['fast','Fast','Veloz'],['gadgets','Gadgets','Dispositivos'],['healing','Healing factor','Fator de cura'],['improvised','Improvised weapons','Armas improvisadas'],['hearing','Super-hearing','Superaudição'],['vision','Super-vision','Supervisão'],['acrobat','Urban acrobat','Acrobata urbano']),2);
    for(const talent of talents){
      if(talent==='fast')d.addPower('Fast','Veloz',[c('quickness',3),c('speed',2)]);
      if(talent==='healing')d.addPower('Healing factor','Fator de cura',[c('regeneration',5)]);
      if(talent==='hearing')d.addPower('Super-hearing','Superaudição',[senses([{id:'accurate',ranks:2,senseType:'Auditory',scope:'sense'},{id:'danger_sense',ranks:1,senseType:'Auditory'},{id:'extended',ranks:1,senseType:'Auditory'},{id:'ultra_hearing',ranks:1}])]);
      if(talent==='vision')d.addPower('Super-vision','Supervisão',[senses([{id:'darkvision',ranks:2},{id:'extended',ranks:1,senseType:'Visual'},{id:'microscopic_vision',ranks:2}])]);
      if(talent==='acrobat')d.addPower('Urban acrobat','Acrobata urbano',[c('leaping',1),movement(2,'Safe Fall; Swinging')]);
      if(['blocking','crippling','gadgets','improvised'].includes(talent)){
        const comp=talent==='blocking'?c('deflect',7):talent==='crippling'?affliction(7,['impaired','hindered','incapacitated']):talent==='gadgets'?c('variable',1):damage(2,[ranged()],true);
        const label=talent==='blocking'?d.label('Blocking','Bloqueio'):talent==='crippling'?d.label('Crippling strike','Golpe debilitante'):talent==='gadgets'?d.label('Gadgets','Dispositivos'):d.label('Improvised weapons','Armas improvisadas');
        const item=power(label,[comp],[],talent==='gadgets'?d.label('5 PP pool for gadgets, configured manually.','Reserva de 5 PP para dispositivos, configurada manualmente.'):'');item.removable='easily_removable';d.resource(item,'device');
      }
    }
    const weapon=d.select('weapon',text('Weapon','Arma'),options(['bow','Bow / Crossbow','Arco / Besta'],['daggers','Daggers / Knives','Adagas / Facas'],['gun','Gun','Pistola'],['sword','Sword / Katana','Espada / Katana'],['whip','Whip','Chicote']));
    if(weapon){
      const label=d.label('Weapon','Arma');let components: ReturnType<typeof c>[]=[];let alternates: ReturnType<typeof power>[]=[];
      if(weapon==='bow'){
        const type=d.select('bow-type',text('Bow configuration','Configuração do arco'),options(['multiattack','Multiattack','Ataque Múltiplo'],['arrows','Five trick arrows','Cinco flechas especiais']));
        components=[damage(5,type==='multiattack'?[ranged(),m('multiattack')]:[ranged()])];if(type==='arrows')alternates=d.powers('arrows',5,10,3,true);
      }
      if(weapon==='gun')components=[damage(5,[ranged(),m('multiattack')])];
      if(weapon==='daggers')components=[damage(2,[ranged(),m('multiattack')],true),enhancedAdv('improved_critical',1,'Weapon'),enhancedAdv('improved_defense'),enhancedAdv('improved_disarm')];
      if(weapon==='sword')components=[damage(2,[m('multiattack'),m('penetrating',5)],true),enhancedAdv('improved_defense'),enhancedAdv('improved_disarm'),enhancedAdv('improved_smash')];
      if(weapon==='whip'){components=[damage(4,[m('multiattack'),m('reach',3)]),enhancedAdv('improved_grab'),enhancedAdv('improved_hold'),enhancedAdv('improved_trip')];alternates=[power(d.label('Swinging','Balançar-se'),[movement(1,'Swinging')])];}
      d.resource(power(label,components,alternates,d.label(`Selected weapon: ${weapon}. Granted advantages apply while this equipment is in use.`,`Arma escolhida: ${weapon}. As vantagens concedidas se aplicam enquanto este equipamento estiver em uso.`)));
    }
    vehicle(d);
  }}
];
