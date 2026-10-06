import { advantage, affliction, component, modifier as m, options, specific as s, text, type Option, type Recipe } from './model';

export const ranged = () => m('increased_range');
export const perception = () => m('increased_range', 2);
export function shield(ranks: number, impervious = ranks) {
  return component('protection', ranks, [m('impervious', 1, { affectedRanks: impervious }), s('sustained_protection')]);
}
export function senses(traits: NonNullable<ReturnType<typeof component>['senseTraits']>) {
  return component('senses', traits.reduce((sum, trait) => sum + trait.ranks, 0), [], { senseTraits: traits });
}
export function awareness(detail: string) { return senses([{ id: 'awareness', ranks: 1, senseType: 'Mental', detail }, { id: 'radius', ranks: 1, senseType: 'Mental', scope: 'sense' }]); }
export function movement(ranks: number, detail: string, limited = false) {
  return component('movement', ranks, limited ? [m('limited')] : [], { fieldValues: { movement: detail } });
}
export function dazzle(ranks: number, singleSense = true, burst = false) {
  return affliction(ranks, ['impaired','disabled','unaware'], [s('cumulative'), ranged(), ...(singleSense ? [m('limited')] : []), ...(burst ? [m('area', 1, { shape: 'burst' })] : [])], 'fortitude');
}
export function vehicle(d: Recipe, cost20 = false) {
  d.link({ id: crypto.randomUUID(), type: 'vehicle', name: d.label(cost20 ? 'Car' : 'Motorcycle', cost20 ? 'Carro' : 'Motocicleta'), notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), size: cost20 ? 'large' : 'medium', strength: cost20 ? 5 : 1, speed: cost20 ? 5 : 6, defense: cost20 ? -1 : 0, toughness: cost20 ? 8 : 8, features: [], systems: [] });
}
const advantageNames: Record<string, [string,string]> = {
  agile_feint:['Agile Feint','Finta Ágil'], assessment:['Assessment','Avaliação'], benefit:['Benefit','Benefício'], contacts:['Contacts','Contatos'], connected:['Connected','Conectado'], defensive_attack:['Defensive Attack','Ataque Defensivo'], hide_in_plain_sight:['Hide in Plain Sight','Esconder-se à Vista'], jack_of_all_trades:['Jack of All Trades','Faz-Tudo'], power_attack:['Power Attack','Ataque Poderoso'], startle:['Startle','Assustar'], takedown:['Takedown','Ataque Dominó'], throwing_mastery:['Throwing Mastery','Maestria em Arremesso'], accurate_attack:['Accurate Attack','Ataque Acurado'], all_out_attack:['All-out Attack','Ataque Imprudente'], improved_defense:['Improved Defense','Defesa Aprimorada'], improved_disarm:['Improved Disarm','Desarmar Aprimorado'], improved_initiative:['Improved Initiative','Iniciativa Aprimorada'], improved_smash:['Improved Smash','Quebrar Aprimorado'], improved_trip:['Improved Trip','Derrubar Aprimorado'], taunt:['Taunt','Provocar'], uncanny_dodge:['Uncanny Dodge','Esquiva Sobrenatural'], fearless:['Fearless','Destemido'], great_endurance:['Great Endurance','Grande Fortitude'], interpose:['Interpose','Interpor-se'], teamwork:['Teamwork','Trabalho em Equipe'], quick_draw:['Quick Draw','Saque Rápido'], weapon_break:['Weapon Break','Quebrar Arma'], animal_empathy:['Animal Empathy','Empatia com Animais'], diehard:['Diehard','Duro de Matar'], chokehold:['Chokehold','Estrangular'], improved_grab:['Improved Grab','Agarrar Aprimorado'], improved_hold:['Improved Hold','Segurar Aprimorado']
};
export function advOptions(ids: string[]): Option[] { return ids.map(id => ({ value: id, label: text(...advantageNames[id]) })); }
export const crimeAdvantages = [...advOptions(['agile_feint','assessment','benefit','contacts','defensive_attack','hide_in_plain_sight','jack_of_all_trades','power_attack','startle','takedown','throwing_mastery']), ...options(['daze:Intimidation','Daze (Intimidation)','Fascinar (Intimidação)'],['precise_attack:Close, Concealment','Precise Attack (Close, Concealment)','Ataque Preciso (Corpo a corpo, Camuflagem)'],['skill_mastery:Stealth','Skill Mastery (Stealth)','Maestria em Perícia (Furtividade)'],['ultimate_effort:Investigation','Ultimate Effort (Investigation)','Esforço Supremo (Investigação)'])];
export const weaponAdvantages = [...advOptions(['accurate_attack','agile_feint','assessment','connected','contacts','defensive_attack','improved_defense','improved_disarm','improved_initiative','improved_smash','improved_trip','power_attack','takedown','taunt','uncanny_dodge']), ...options(['improved_critical:Weapon','Improved Critical (Weapon)','Crítico Aprimorado (Arma)'], ['precise_attack:Close, Cover','Precise Attack (Close, Cover)','Ataque Preciso (Corpo a corpo, Cobertura)'],['precise_attack:Ranged, Cover','Precise Attack (Ranged, Cover)','Ataque Preciso (À distância, Cobertura)'],['precise_attack:Close, Concealment','Precise Attack (Close, Concealment)','Ataque Preciso (Corpo a corpo, Camuflagem)'],['precise_attack:Ranged, Concealment','Precise Attack (Ranged, Concealment)','Ataque Preciso (À distância, Camuflagem)'])];
export function martialAdvantages(d: Recipe) {
  d.advantages(...['accurate_attack','agile_feint','all_out_attack','assessment','chokehold','defensive_attack','evasion','improved_defense','improved_disarm','improved_grab','improved_initiative','improved_smash','improved_trip','instant_up','move_by_action','power_attack','prone_fighting','redirect','seize_initiative','takedown','trance','uncanny_dodge','weapon_break'], advantage('defensive_roll',4), advantage('daze',1,'Intimidation'), advantage('improved_critical',1,'Unarmed'), advantage('precise_attack',1,'Close, Concealment'), advantage('skill_mastery',1,'Acrobatics'));
}
