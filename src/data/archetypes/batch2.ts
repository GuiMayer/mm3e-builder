import { advantage as a, component as c, damage, modifier as m, power, skill as k, text, type Archetype } from './model';
import { dazzle, martialAdvantages, ranged, shield } from './common';
export const batch2: Archetype[] = [
  {id:'energy-controller',name:text('Energy Controller','Controlador de Energia'),summary:text('Energy blasts, a reactive aura and an adaptable energy array.','Rajadas de energia, aura reativa e um repertório de efeitos alternativos.'),page:38,printed:[36,79,5,15,15],build(d){
    d.abilities([1,4,4,2,2,3,0,2]);d.defenses(4,0,5,6);
    d.advantages('accurate_attack','all_out_attack','power_attack',a('precise_attack',1,'Ranged, Cover'),'taunt');
    d.skills(k('acrobatics',6),k('deception',7),k('insight',4),k('perception',4),k('persuasion',4),k('ranged_combat',5,'Energy'));
    const descriptor=d.input('energy',text('Energy descriptor','Descritor de energia'));
    d.addPower('Energy aura','Aura de energia',[damage(3,[m('reaction')])],[],descriptor);
    d.addPower('Energy control','Controle de energia',[damage(12,[ranged()])],d.powers('alternates',3,24,1),descriptor);
    d.addPower('Energy immunity','Imunidade à energia',[c('immunity',5,[],{fieldValues:{immunity:descriptor}})]);
    d.addPower('Energy flight','Voo de energia',[c('flight',7)]);d.addPower('Force field','Campo de força',[shield(10)]);
    d.addPower('Quick change','Troca rápida',[c('feature',1,[],{fieldValues:{feature:'Quick Change'}})]);
  }},
  {id:'gadgeteer',name:text('Gadgeteer','Inventor'),summary:text('A brilliant inventor with a blaster, protective belt and jetpack.','Um inventor brilhante com blaster, cinto protetor e mochila a jato.'),page:39,printed:[48,42,16,22,22],note:text('The book discounts the 21 PP shield belt by 4 PP. The Removable rule rounds up: the discount is 5 PP, so this sheet costs 149 PP.','O livro desconta 4 PP do cinto de 21 PP. A regra de Removível arredonda para cima: o desconto é 5 PP, e esta ficha custa 149 PP.'),build(d){
    d.abilities([0,2,4,5,0,3,10,0]);d.defenses(6,4,7,5);
    d.advantages('beginners_luck',a('defensive_roll',2),'eidetic_memory','improved_initiative','improvised_tools',a('inspire',2),'inventor','luck',a('ranged_attack',5),a('skill_mastery',1,'Technology'));
    d.skills(k('expertise',5,'Engineering'),k('expertise',10,'Science'),k('insight',5),k('investigation',4),k('perception',5),k('technology',10),k('vehicles',5));
    const blaster=power(d.label('Blaster','Blaster'),[damage(12,[ranged()])],[power(d.label('Dazzle','Ofuscar'),[dazzle(12)])],d.label('Dazzle is limited to vision.','Ofuscar é limitado à visão.'));blaster.removable='easily_removable';d.resource(blaster,'device');
    const belt=power(d.label('Force shield belt','Cinto de campo de força'),[{...shield(10),modifiers:[...shield(10).modifiers,m('precise')]}]);belt.removable='removable';d.resource(belt,'device');
    const jet=power(d.label('Jetpack','Mochila a jato'),[c('flight',5)]);jet.removable='removable';d.resource(jet,'device');
    d.addPower('Quick thinking','Pensamento rápido',[c('quickness',4,[m('limited')])],[],d.label('Limited to mental tasks.','Limitado a tarefas mentais.'));
  }},
  {id:'martial-artist',name:text('Martial Artist','Artista Marcial'),summary:text('A master of close combat, acrobatics and martial techniques.','Um mestre do combate corpo a corpo, acrobacia e técnicas marciais.'),page:40,printed:[70,0,31,30,19],build(d){
    d.abilities([4,6,13,5,3,4,0,0]);d.defenses(7,0,8,4);martialAdvantages(d);
    d.skills(k('acrobatics',10),k('athletics',10),k('close_combat',3,'Unarmed'),k('expertise',5,'Philosophy'),k('insight',8),k('intimidation',8),k('perception',8),k('stealth',8));
  }}
];
