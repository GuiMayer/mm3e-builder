import type { IAppliedModifier } from '../../../entities/types';
import type { LibraryText, PowerTemplate, PowerTemplateComponent } from '../../../features/power-library/types';

const text = (en: string, pt: string): LibraryText => ({ en, pt });
const modifier = (modifierId: string, ranks = 1, isPowerSpecific = false, options?: IAppliedModifier['options']): IAppliedModifier =>
  ({ modifierId, ranks, isPowerSpecific, ...(options ? { options } : {}) });
const effect = (effectId: string, modifiers: IAppliedModifier[] = [], fields: Partial<PowerTemplateComponent> = {}): PowerTemplateComponent =>
  ({ effectId, ranks: 1, scalable: true, modifiers, ...fields });
const ranged = () => modifier('increased_range');
const perception = (ranks: number) => modifier('increased_range', ranks);
const move = () => modifier('action_variable', 1, true, { subtypeId: 'move' });
const damage = (modifiers: IAppliedModifier[] = []) => effect('damage', modifiers, { fieldValues: { damageBasis: 'effect-only' } });
const affliction = (conditions: string[][], modifiers: IAppliedModifier[], resistance = 'fortitude', recovery?: string) =>
  effect('affliction', modifiers, { fieldValues: { resistance, afflictionDegrees: conditions.map((_, index) => String(index + 1)),
    ...Object.fromEntries(conditions.map((values, index) => [`afflictionDegree${index + 1}`, values])),
    ...(recovery ? { afflictionRecovery: recovery } : {}) } });
const choice = (id: string, en: string, pt: string) => ({ id, label: text(en, pt) });

/** Handbook sample powers, not replacements for similarly named Power Profiles recipes. */
function recipe(id: string, en: string, pt: string, page: number, summary: LibraryText, components: PowerTemplateComponent[], formula: string, perRank: number, extra: Partial<PowerTemplate> = {}): PowerTemplate {
  return { id: `handbook-${id}`, profileId: 'handbook', book: 'handbook', name: text(en, pt),
    section: text('Sample powers', 'Poderes de exemplo'), page, summary, components,
    sourceFormula: formula, audit: { formula, fixed: 0, perRank }, ...extra };
}

export default [
  recipe('alternate-form', 'Alternate Form', 'Forma Alternativa', 150,
    text('Build a form from the effects appropriate to its capabilities. Activation discounts the whole power by 1 PP (move) or 2 PP (standard).',
      'Monte uma forma com os efeitos apropriados às suas capacidades. Ativação desconta 1 PP (movimento) ou 2 PP (padrão) do poder inteiro.'),
    [], 'Varies, Activation • effects total –1 or 2 points', 0, {
      requiresCharacterChanges: text('This is an open composition, not a fixed recipe. Build its effects in the Power Builder and choose Activation there. The book suggests energy, gaseous, ghost, heroic, liquid, particulate, shadow, solid, swarm and two-dimensional forms.',
        'Esta é uma composição aberta, sem receita fixa. Monte seus efeitos no Power Builder e escolha Ativação ali. O livro sugere formas de energia, gasosa, fantasma, heroica, líquida, particulada, sombra, sólida, enxame e bidimensional.'),
    }),
  recipe('blast', 'Blast', 'Rajada', 151,
    text('A ranged damage attack. Choose its descriptors in the Builder.', 'Um ataque de dano à distância. Escolha seus descritores no Builder.'),
    [damage([ranged()])], 'Ranged Damage • 2 points per rank', 2),
  recipe('dazzle', 'Dazzle', 'Ofuscar', 155,
    text('Cumulatively impair, disable and overwhelm one chosen sense. Choose Fortitude or Will resistance.', 'Prejudica, debilita e anula cumulativamente um sentido escolhido. Escolha resistência por Fortitude ou Vontade.'),
    [{ ...affliction([['impaired'], ['disabled'], ['unaware']], [ranged(), modifier('cumulative', 1, true), modifier('limited', 1, false, { note: 'One chosen sense only' })]),
      choices: [choice('affectedSense', 'Affected sense', 'Sentido afetado'), { id: 'resistance', label: text('Resistance', 'Resistência'), options: [
        { value: 'fortitude', label: text('Fortitude', 'Fortitude') }, { value: 'will', label: text('Will', 'Vontade') },
      ] }],
    }],
    'Ranged Cumulative Affliction (Impaired, Disabled, Unaware; Fortitude or Will), Limited to One Sense • 2 points per rank', 2),
  recipe('duplication', 'Duplication', 'Duplicação', 156,
    text('Summon an active duplicate, still a minion. Each rank allows 15 PP of traits; the duplicate excludes this power and hero points.',
      'Invoca uma duplicata ativa, ainda um lacaio. Cada graduação permite 15 PP de características; a duplicata exclui este poder e pontos heroicos.'),
    [effect('summon', [modifier('active', 1, true)])], 'Summon Duplicate, Active • 3 points per rank', 3),
  recipe('element-control', 'Element Control', 'Controle de Elemento', 157,
    text('Move a chosen element within perception range. Effective Strength and mass rank equal the effect rank.', 'Move um elemento escolhido ao alcance da percepção. Força efetiva e graduação de massa são iguais à graduação do efeito.'),
    [effect('move-object', [perception(1), modifier('limited', 1, false, { note: 'Only the chosen element' })], {
      choices: [choice('element', 'Controlled element', 'Elemento controlado')],
    })], 'Perception Ranged Move Object, Limited to Element • 2 points per rank', 2),
  recipe('energy-aura', 'Energy Aura', 'Aura de Energia', 159,
    text('An aura that deals damage when you touch someone or someone touches you. It can be switched on or off as a free action.',
      'Uma aura que causa dano ao tocar alguém ou ser tocado. Pode ser ligada ou desligada como ação livre.'),
    [damage([modifier('reaction', 1, false, { trigger: 'Touching or being touched' })])], 'Damage, Reaction • 4 points per rank', 4),
  recipe('energy-control', 'Energy Control', 'Controle de Energia', 159,
    text('Project damaging energy. Additional uses are purchased separately as Alternate Effects.', 'Projeta energia que causa dano. Usos adicionais são comprados separadamente como Efeitos Alternativos.'),
    [damage([ranged()])], 'Ranged Damage • 2 points per rank', 2),
  recipe('energy-absorption', 'Energy Absorption', 'Absorção de Energia', 159,
    text('Enhance a chosen trait when hit by a chosen energy. The bonus is capped by the lesser of attack rank and power rank, then fades by 1 each turn. This does not resist the attack.',
      'Aprimora uma característica ao sofrer um tipo escolhido de energia. O bônus se limita à menor graduação entre ataque e poder, depois diminui em 1 por turno. Não oferece resistência ao ataque.'),
    [effect('enhanced-trait', [modifier('fades'), modifier('reaction', 1, false, { trigger: 'Hit by the chosen energy' })], {
      variableCostOption: 'Enhanced Ability', chooseEnhancedTrait: true,
      choices: [choice('absorbedEnergy', 'Absorbed energy', 'Energia absorvida')],
    })], 'Enhanced Trait, Fades, Reaction • as base trait', 2),
  recipe('force-field', 'Force Field', 'Campo de Força', 161,
    text('A protective field maintained with a free action. Impervious is optional and is not included.', 'Um campo protetor mantido com ação livre. Impenetrável é opcional e não está incluído.'),
    [effect('protection', [modifier('sustained_protection', 1, true)])], 'Protection, Sustained • 1 point per rank', 1),
  ...([['normal', 'normal sight', 'visão normal', 2], ['all', 'all visual senses', 'todos os sentidos visuais', 4]] as const).map(([id, en, pt, ranks]) =>
    recipe(`invisibility-${id}`, `Invisibility (${en})`, `Invisibilidade (${pt})`, 166,
      text(`Concealment from ${en}. The required ranks are fixed; visual senses cost twice as much.`, `Camuflagem contra ${pt}. As graduações necessárias são fixas; sentidos visuais custam o dobro.`),
      [effect('concealment', [], { ranks, scalable: false, fieldValues: { senses: ['visual'] } })],
      `Visual Concealment ${ranks} • ${ranks * 2} points`, 0, { audit: { formula: `Visual Concealment ${ranks}`, fixed: ranks * 2, perRank: 0 } })),
  recipe('mental-blast', 'Mental Blast', 'Rajada Mental', 168,
    text('Damage resisted by Will, at perception range. Subtle is optional and is not included.', 'Dano resistido por Vontade, ao alcance da percepção. Sutil é opcional e não está incluído.'),
    [damage([perception(2), modifier('alternate_resistance', 1, false, { subtypeId: 'will', alternateResistanceCost: 'advantageous' })])],
    'Perception Ranged Damage, Resisted by Will • 4 points per rank', 4),
  recipe('magic', 'Magic', 'Magia', 168,
    text('The default spell is a ranged magical blast. Other spells are separate Alternate Effects; speaking and gestures may be a Power Loss complication.',
      'A magia inicial é uma rajada mágica à distância. Outros feitiços são Efeitos Alternativos separados; fala e gestos podem ser uma complicação de Perda de Poder.'),
    [damage([ranged()])], 'Ranged Damage • 2 points per rank', 2, { descriptors: ['Magic'] }),
  recipe('mimic', 'Mimic', 'Mimetismo', 169,
    text('Use a move action to copy traits of a perceived character, with a pool of 5 PP per rank. Copied ranks cannot exceed the original traits.',
      'Usa ação de movimento para copiar características de um personagem percebido, com reserva de 5 PP por graduação. As graduações copiadas não podem superar as originais.'),
    [effect('variable', [move()])], 'Variable (traits of a perceived character), Move Action • 8 points per rank', 8),
  recipe('mind-control', 'Mind Control', 'Controle Mental', 169,
    text('Cumulative mental influence: dazed, compelled, then controlled. Subtle and Progressive are optional and are not included.',
      'Influência mental cumulativa: pasmo, compelido e controlado. Sutil e Progressivo são opcionais e não estão incluídos.'),
    [affliction([['dazed'], ['compelled'], ['controlled']], [perception(2), modifier('cumulative', 1, true)], 'will')],
    'Perception Ranged Cumulative Affliction (Dazed, Compelled, Controlled), Resisted by Will • 4 points per rank', 4),
  recipe('power-lifting', 'Power-Lifting', 'Erguer Peso', 175,
    text('Extra Strength for lifting and carrying only; it does not increase damage or other Strength traits.', 'Força adicional apenas para erguer e carregar; não aumenta dano nem outros usos de Força.'),
    [effect('enhanced-trait', [modifier('limited', 1, false, { note: 'Lifting only' })], {
      enhancedTarget: { kind: 'ability', key: 'str' }, variableCostOption: 'Enhanced Ability', fieldValues: { enhancedScope: 'lifting' },
    })], 'Enhanced Strength, Limited to Lifting • 1 point per rank', 1),
  recipe('shapeshift', 'Shapeshift', 'Metamorfose', 180,
    text('Use a move action to redistribute 5 PP per rank into the physical traits of an assumed form. Mental traits are not gained.',
      'Usa ação de movimento para redistribuir 5 PP por graduação nas características físicas de uma forma assumida. Não concede características mentais.'),
    [effect('variable', [move()])], 'Variable (assumed forms), Move Action • 8 points per rank', 8),
  recipe('sleep', 'Sleep', 'Sono', 181,
    text('Ranged fatigue, exhaustion and sleep, resisted by Fortitude. Cumulative and Progressive are optional and are not included.',
      'Fadiga, exaustão e sono à distância, resistidos por Fortitude. Cumulativo e Progressivo são opcionais e não estão incluídos.'),
    [affliction([['fatigued'], ['exhausted'], ['asleep']], [ranged()])], 'Ranged Affliction (Fatigued, Exhausted, Asleep), Resisted by Fortitude • 2 points per rank', 2),
  recipe('snare', 'Snare', 'Armadilha', 182,
    text('Cumulative bonds: hindered and vulnerable, then defenseless and immobile. Initially resisted by Dodge; escape with Damage or Sleight of Hand. No third degree.',
      'Amarras cumulativas: impedido e vulnerável, depois indefeso e imóvel. Resistência inicial por Esquiva; escape com Dano ou Prestidigitação. Não há terceiro grau.'),
    [affliction([['hindered', 'vulnerable'], ['defenseless', 'immobile']], [ranged(), modifier('cumulative', 1, true), modifier('extra_condition', 1, true),
      modifier('alternate_resistance', 1, false, { subtypeId: 'dodge' }), modifier('limited_degree', 1, true)], 'fortitude', 'damage-or-sleight-of-hand')],
    'Ranged Cumulative Affliction (Dodge; Hindered and Vulnerable, Defenseless and Immobile), Extra Condition, Limited Degree • 3 points per rank', 3),
  recipe('strike', 'Strike', 'Golpe', 182,
    text('Close damage, replacing Strength damage by default. Choose Strength-based in the Builder to add it to Strength instead.',
      'Dano corpo a corpo, substituindo o dano de Força por padrão. Escolha Baseado em Força no Builder para somá-lo à Força.'),
    [damage()], 'Damage • 1 point per rank', 1),
  recipe('super-speed', 'Super-Speed', 'Supervelocidade', 183,
    text('Each power rank grants one rank of Improved Initiative (+4 initiative), Quickness and Speed. Components start at matching ranks and can be adjusted in the preview.',
      'Cada graduação concede uma graduação de Iniciativa Aprimorada (+4 na iniciativa), Rapidez e Velocidade. Os componentes começam com graduações iguais e podem ser ajustados na prévia.'),
    [effect('enhanced-trait', [], { variableCostOption: 'Enhanced Advantage', fieldValues: { enhancedAdvantageId: 'improved_initiative' } }), effect('quickness'), effect('speed')],
    'Enhanced Initiative, Quickness, Speed • 3 points per rank', 3),
  recipe('suffocation', 'Suffocation', 'Sufocamento', 183,
    text('Prevent breathing: dazed, stunned and incapacitated. Progressive worsens the condition after failed recovery checks.',
      'Impede a respiração: pasmo, atordoado e incapacitado. Progressivo agrava a condição após falhas nos testes de recuperação.'),
    [affliction([['dazed'], ['stunned'], ['incapacitated']], [ranged(), modifier('progressive', 1, true)])],
    'Ranged Progressive Affliction (Dazed, Stunned, Incapacitated), Resisted by Fortitude • 4 points per rank', 4),
] satisfies PowerTemplate[];
