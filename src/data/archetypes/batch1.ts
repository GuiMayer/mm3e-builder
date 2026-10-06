import { advantage as a, component as c, damage, enhanced, enhancedAdv, modifier as m, options, power, skill as k, text, type Archetype } from './model';
import { crimeAdvantages, dazzle, movement, ranged, senses, vehicle } from './common';

export const batch1: Archetype[] = [
  { id: 'battlesuit', name: text('Battlesuit','Armadura de Combate'), summary: text('An inventor wearing a versatile powered suit.','Um inventor equipado com uma armadura tecnológica versátil.'), page:35, printed:[30,84,8,12,16], build(d) {
    d.abilities([0,1,4,2,1,2,5,0]); d.defenses(5,0,5,6);
    d.advantages('accurate_attack','improvised_tools','inventor',a('ranged_attack',4),a('second_chance',1,'Technology'));
    const expertise = d.select('expertise',text('Expertise','Conhecimento'),options(['Business','Business','Negócios'],['Engineering','Engineering','Engenharia'],['Science','Science','Ciência']));
    d.skills(k('expertise',5,expertise),k('insight',4),k('perception',3),k('persuasion',4),k('technology',8));
    const common = () => [c('protection',11,[m('impervious',1,{affectedRanks:11})]),c('flight',8),c('communication',2,[],{fieldValues:{medium:'Radio'}}),c('immunity',10,[],{fieldValues:{immunity:'Life Support'}}),senses([{id:'accurate',ranks:2,senseType:'Radio',scope:'sense'},{id:'extended',ranks:3,senseType:'Radio'},{id:'darkvision',ranks:2},{id:'direction_sense',ranks:1},{id:'distance_sense',ranks:1},{id:'infravision',ranks:1},{id:'time_sense',ranks:1},{id:'ultra_hearing',ranks:1}]),enhanced({kind:'defense',key:'dodge'},2),enhanced({kind:'ability',key:'fgt'},4),enhancedAdv('ranged_attack',2)];
    const suit=power(d.label('Powered armor','Armadura motorizada'),[...common(),enhanced({kind:'ability',key:'str'},12)],[power(d.label('Force beams','Raios de força'),[...common(),damage(12,[ranged()])])],d.label('Servo Strength and Force Beams are alternate configurations. Shared suit systems remain active in both. Ranged Attack 2 is granted by the suit, not purchased twice.','Força dos servos e Raios de força são configurações alternativas. Os sistemas comuns da armadura permanecem ativos em ambas. Ataque à Distância 2 é concedido pela armadura, sem compra duplicada.'));
    suit.removable='removable'; d.resource(suit,'device');
  } },
  { id:'construct', name:text('Construct','Construto'),summary:text('An artificial or unliving hero with exceptional resilience.','Um herói artificial ou não vivo de grande resistência.'),page:36,printed:[54,67,6,9,14],build(d) {
    d.abilities([11,3,9,1,0,3,5,0]); d.character.absentAbilities=['sta']; d.defenses(6,0,0,8);
    d.advantages('eidetic_memory',a('ranged_attack',5)); d.skills(k('investigation',2),k('perception',5),k('persuasion',4),k('technology',5),k('vehicles',2));
    d.addPower('Armored','Blindagem',[c('protection',11,[m('impervious',1,{affectedRanks:6})])]);
    d.addPower('Unliving','Não vivo',[c('immunity',30,[],{fieldValues:{immunity:'Fortitude effects'}})]);
    const choice=d.select('nature',text('Nature of the construct','Natureza do construto'),options(['elemental','Elemental','Elemental'],['soldier','Soldier','Soldado'],['undead','Undead revenant','Morto-vivo'],['wraith','Wraith','Espectro']));
    if(choice==='elemental'||choice==='soldier') { const descriptor=d.input('weapon',text('Attack descriptor','Descritor do ataque')); d.addPower('Built-in attack','Ataque integrado',[damage(10,[ranged()])],[],descriptor); }
    if(choice==='undead')d.addPower('Undead revenant','Morto-vivo',[c('immortality',5),c('regeneration',10)]);
    if(choice==='wraith')d.addPower('Incorporeal','Incorpóreo',[c('insubstantial',4)]);
  } },
  { id:'crime-fighter',name:text('Crime Fighter','Combatente do Crime'),summary:text('A trained investigator with a utility belt and specialized equipment.','Um investigador treinado com equipamentos e cinto de utilidades.'),page:37,printed:[84,0,12,39,15],build(d) {
    d.abilities([3,6,12,4,3,6,4,4]);d.defenses(6,0,3,6);
    const variant=d.select('variant',text('Variant','Variante'),options(['standard','Standard','Padrão'],['gimmick','Gimmick','Dispositivo'],['sentinel','Sentinel','Sentinela'],['vehicle','Vehicle','Veículo']),true,'standard');
    d.advantages(a('defensive_roll',3),'uncanny_dodge');
    d.skills(k('acrobatics',6),k('athletics',6),k('close_combat',2,'Unarmed'),k('deception',6),k('insight',6),k('intimidation',8),k('investigation',8),k('perception',6),k('ranged_combat',8,'Thrown'),k('sleight_of_hand',4),k('stealth',8),k('technology',2),k('vehicles',4));d.expertise('expertise',4);
    if(variant==='gimmick') { const device=d.powers('device',1,10,3)[0];if(device){device.removable='removable';d.resource(device,'device');}return; }
    d.advantages(a('equipment',variant==='sentinel'?1:variant==='vehicle'?8:4));
    d.resource(power(d.label('Costume','Traje'),[c('protection',2)]));d.resource(power(d.label('Grapple gun','Pistola de gancho'),[movement(1,'Swinging')]));
    if(variant==='sentinel') {
      d.resource(power(d.label('Tonfa','Tonfa'),[damage(1,[],true)]));
      const extra=Number(d.select('sentinel-extra',text('Trade optional advantages for more Senses','Trocar vantagens opcionais por mais Sentidos'),options(['0','Keep four advantages','Manter quatro vantagens'],['1','Trade one advantage','Trocar uma vantagem'],['2','Trade two advantages','Trocar duas vantagens'],['3','Trade three advantages','Trocar três vantagens'],['4','Trade all four advantages','Trocar as quatro vantagens']),true,'0'));
      const purchases=d.powers('sentinel-senses',1,3+extra)[0];if(purchases){if(purchases.components.some(item=>item.effectId!=='senses'||!item.senseTraits?.length)||purchases.components.reduce((sum,item)=>sum+item.ranks,0)!==3+extra)d.missing.push('sentinel-senses');d.character.powers.push(purchases);}
      if(extra<4)d.chosenAdvantages('advantages',4-extra,crimeAdvantages);return;
    }
    d.resource(power(d.label('Commlink','Comunicador'),[c('feature',1,[],{fieldValues:{feature:'Commlink'}})]));
    const belt=power(d.label('Utility belt','Cinto de utilidades'),[dazzle(3,false,true)],[power(d.label('Smoke bombs','Bombas de fumaça'),[c('concealment',4,[m('area',1,{shape:'cloud'}),m('attack')],{fieldValues:{senses:['visual']}})]),power(d.label('Sleep gas','Gás sonífero'),[c('affliction',4,[ranged(),m('area',1,{shape:'cloud'})],{fieldValues:{resistance:'fortitude',afflictionDegree1:['dazed'],afflictionDegree2:['stunned'],afflictionDegree3:['asleep']}})]),power(d.label('Boomerang','Bumerangue'),[damage(1,[ranged()],true)])],d.label('Flash-bangs affect visual and auditory senses.','Granadas de luz afetam os sentidos visuais e auditivos.'));
    d.resource(belt);
    if(variant==='vehicle') { const model=d.select('vehicle-model',text('Vehicle (up to 20 EP)','Veículo (até 20 EP)'),options(['motorcycle','Motorcycle','Motocicleta'],['car','Car','Carro']));if(model)vehicle(d,model==='car'); } else d.chosenAdvantages('advantages',4,crimeAdvantages);
  } }
];
