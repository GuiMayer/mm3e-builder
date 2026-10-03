import type { MeasurementSystem } from './measurements';

export type ReferenceText = readonly [en: string, pt: string];
export type ReferenceCategory = 'measurements' | 'combat' | 'conditions' | 'checks' | 'hero';
export interface ReferenceRow { id: string; cells: readonly ReferenceText[]; }
export interface ReferenceSection { id: string; category: ReferenceCategory; title: ReferenceText; pages: string; columns: readonly ReferenceText[]; rows: readonly ReferenceRow[]; note?: ReferenceText; }
export const referenceText = (text: ReferenceText, language: string): string => text[language.toLowerCase().startsWith('pt') ? 1 : 0];
const row = (id: string, ...cells: ReferenceText[]): ReferenceRow => ({ id, cells });
const name: ReferenceText = ['Rule / situation', 'Regra / situação'];
const effect: ReferenceText = ['Quick reference', 'Consulta rápida'];
const standard: ReferenceText = ['Standard', 'Padrão'];
const move: ReferenceText = ['Move', 'Movimento'];
const free: ReferenceText = ['Free', 'Livre'];

/** Paraphrased reference summaries, checked against the supplied Deluxe Handbook.
 * These are display data, deliberately independent from the character rule engine. */
export const REFERENCE_SECTIONS: readonly ReferenceSection[] = [
  { id: 'turn', category: 'combat', title: ['Your turn', 'Seu turno'], pages: '235–237', columns: [name, effect], rows: [
    row('round', ['Round', 'Rodada'], ['About 6 seconds; act in descending initiative order.', 'Cerca de 6 segundos; aja em ordem decrescente de iniciativa.']),
    row('actions', ['Actions', 'Ações'], ['One standard + one move, or two moves; free actions within the GM’s limits. Reactions respond to triggers.', 'Uma padrão + uma de movimento, ou dois movimentos; ações livres conforme o mestre. Reações respondem a gatilhos.']),
    row('initiative', ['Initiative', 'Iniciativa'], ['d20 + Agility + modifiers. Ties: higher Dodge, then Agility, then Awareness; roll again if still tied.', 'd20 + Agilidade + modificadores. Empate: maior Esquiva, depois Agilidade, depois Prontidão; role novamente se persistir.']),
  ] },
  { id: 'actions', category: 'combat', title: ['Combat actions', 'Ações de combate'], pages: '246–248', columns: [['Action','Ação'], ['Type','Tipo'], effect], rows: [
    row('aid', ['Aid','Ajudar'], standard, ['Attack vs. DC 10: +2 to an ally’s attack or defense against that foe; +5 with 3+ success degrees. Lasts through the ally’s next turn.', 'Ataque contra CD 10: +2 no ataque ou defesa de um aliado contra esse oponente; +5 com 3+ graus de sucesso. Dura até o fim do próximo turno do aliado.']),
    row('aim', ['Aim','Mirar'], standard, ['+5 on a close attack or ranged attack at close range; +2 at greater range. You are vulnerable; maintain aim with a free action and attack next.', '+5 no ataque corpo a corpo ou à distância a curta distância; +2 de mais longe. Você fica vulnerável; mantenha a mira com ação livre e ataque em seguida.']),
    row('attack', ['Attack','Atacar'], standard, ['Attack vs. 10 + Parry (close) or Dodge (ranged). Area/perception effects need no attack check.', 'Ataque contra 10 + Aparar (corpo a corpo) ou Esquiva (à distância). Área/percepção dispensam teste de ataque.']),
    row('charge', ['Charge','Investida'], standard, ['Move your speed in a fairly straight line, then make a close attack at −2. A separate move can precede the charge.', 'Mova sua velocidade em linha relativamente reta e ataque corpo a corpo com −2. Um movimento separado pode preceder a investida.']),
    row('command', ['Command','Comandar'], move, ['Give one command to a controlled character or group; separate commands take separate move actions.', 'Dê um comando a um personagem ou grupo controlado; comandos distintos exigem movimentos separados.']),
    row('crawl', ['Crawl','Rastejar'], move, ['While prone, ground speed −1 rank (normally half speed); Slither can override this.', 'Prostrado: velocidade terrestre −1 graduação (normalmente metade); Deslizar pode alterar isso.']),
    row('defend', ['Defend','Defender'], standard, ['Oppose each attack with your active defense until your next turn. Add 10 to die rolls of 10 or less; the attacker must equal or beat your total.', 'Oponha sua defesa ativa a cada ataque até seu próximo turno. Some 10 a resultados de 10 ou menos no dado; o atacante precisa igualar ou superar seu total.']),
    row('delay', ['Delay','Adiar'], ['None','Nenhuma'], ['Delay your entire turn and move initiative when you act. If your next turn arrives first, the delayed turn is lost.', 'Adie o turno inteiro e mude a iniciativa quando agir. Se seu próximo turno chegar antes, perde o turno adiado.']),
    row('disarm', ['Disarm','Desarmar'], standard, ['Attack at −2 close / −5 ranged, then oppose your damage against target Strength. A failed weapon disarm can allow a counter-disarm.', 'Ataque com −2 corpo a corpo / −5 à distância; depois oponha seu dano à Força do alvo. Falhar ao desarmar com arma pode permitir um contradesarme.']),
    row('drop', ['Drop item / prone','Soltar item / deitar'], free, ['Release a held item or drop prone. Throwing to hurt a target is an attack, not a free drop.', 'Solte um item ou fique prostrado. Arremessar para ferir é um ataque, não uma ação livre.']),
    row('escape', ['Escape','Escapar'], move, ['Athletics or Acrobatics vs. 10 + holder’s Strength/grab rank. Success ends the grab; you may move at ground speed −1 rank.', 'Atletismo ou Acrobacia contra 10 + Força/graduação do agarrão do oponente. Sucesso encerra o agarrão; pode mover-se com velocidade terrestre −1 graduação.']),
    row('grab', ['Grab','Agarrar'], standard, ['Hit, then target resists DC 10 + Strength/grab rank with the better of Strength or Dodge. 1 failure degree: restrained; 2+: bound. Holder is hindered and vulnerable; maintain as free.', 'Acerte; o alvo resiste a CD 10 + Força/graduação do agarrão com o melhor de Força ou Esquiva. 1 grau de falha: contido; 2+: preso. Quem agarra fica impedido e vulnerável; manter é livre.']),
    row('move', ['Move','Mover'], move, ['Travel your speed rank. Athletics DC 15 as a free action grants +1 ground speed rank for one round on success.', 'Percorra sua graduação de velocidade. Atletismo CD 15 como ação livre concede +1 graduação terrestre por uma rodada em caso de sucesso.']),
    row('ready', ['Ready','Preparar'], standard, ['Specify one standard, move or free action and its trigger; perform it as a reaction before your next turn, changing initiative to that point.', 'Defina uma ação padrão, movimento ou livre e seu gatilho; realize-a como reação antes do próximo turno, mudando a iniciativa para esse momento.']),
    row('recover', ['Recover','Recuperar'], standard, ['Spend the whole turn: remove the highest damage/fatigue level, or make an extra resistance check vs. an ongoing effect. Once per conflict; +2 active defenses until next turn.', 'Gaste o turno inteiro: remova o maior nível de dano/fadiga ou faça resistência extra contra efeito contínuo. Uma vez por conflito; +2 nas defesas ativas até o próximo turno.']),
    row('smash', ['Smash','Esmagar'], standard, ['Attack an opponent’s held/worn object using their defense; −5 to hit a held object. Damage the object instead of its owner.', 'Ataque um objeto segurado/vestido usando a defesa do portador; −5 para acertar objeto segurado. O dano atinge o objeto.']),
    row('stand', ['Stand','Levantar'], move, ['Stand from prone; free with Acrobatics DC 20 or Instant Up.', 'Levante-se de prostrado; ação livre com Acrobacia CD 20 ou Levantar Instantaneamente.']),
    row('trip', ['Trip','Derrubar'], standard, ['Close attack vs. Parry at −2; oppose the better of Athletics/Acrobatics on each side. Winner makes target prone; losing allows a counter-trip.', 'Ataque corpo a corpo contra Aparar com −2; oponha o melhor de Atletismo/Acrobacia de cada lado. Sucesso deixa o alvo prostrado; falha permite uma tentativa de derrubar você.']),
  ] },
  { id: 'maneuvers', category: 'combat', title: ['Combat maneuvers','Manobras de combate'], pages: '249–251', columns: [name, effect], note: ['Basic trade-offs are up to 2; the matching advantage raises this to 5. Declare before the check; the traded values cannot fall below 0 or more than double. Read each maneuver’s applicability.', 'Trocas básicas vão até 2; a vantagem correspondente amplia para 5. Declare antes do teste; valores trocados não podem cair abaixo de 0 ou mais que dobrar. Observe a aplicação de cada manobra.'], rows: [
    row('accurate', ['Accurate Attack','Ataque Preciso'], ['Trade effect −1/−2 for attack +1/+2, through your next turn.', 'Troque −1/−2 no efeito por +1/+2 no ataque, até seu próximo turno.']),
    row('allout', ['All-out Attack','Ataque Total'], ['Trade Dodge/Parry −1/−2 for attack +1/+2, through your next turn.', 'Troque −1/−2 em Esquiva/Aparar por +1/+2 no ataque, até seu próximo turno.']),
    row('defensive', ['Defensive Attack','Ataque Defensivo'], ['Trade attack −1/−2 for Dodge/Parry +1/+2; needs an attack and resistance check.', 'Troque −1/−2 no ataque por +1/+2 em Esquiva/Aparar; exige testes de ataque e resistência.']),
    row('power', ['Power Attack','Ataque Poderoso'], ['Trade attack −1/−2 for effect +1/+2; needs an attack and resistance check.', 'Troque −1/−2 no ataque por +1/+2 no efeito; exige testes de ataque e resistência.']),
    row('demoralize', ['Demoralize','Desmoralizar'], ['Standard: Intimidation vs. best Insight/Will. Success: impaired; 4+ degrees: disabled, through the end of your next turn.', 'Padrão: Intimidação contra melhor Intuição/Vontade. Sucesso: prejudicado; 4+ graus: disabled (−5 nos testes), até o fim de seu próximo turno.']),
    row('feint', ['Feint','Fintar'], ['Standard: Deception vs. best Deception/Insight. Success makes target vulnerable to your next attack through the end of your next turn.', 'Padrão: Enganação contra melhor Enganação/Intuição. Sucesso deixa o alvo vulnerável ao seu próximo ataque até o fim de seu próximo turno.']),
    row('finishing', ['Finishing Attack','Ataque Finalizador'], ['Defenseless close target: routine attack, or roll vs. DC 10 for an automatic critical on a hit (+5 resistance DC). Intent to kill + 3 failure degrees of damage can kill.', 'Alvo indefeso corpo a corpo: ataque rotineiro, ou role contra CD 10 para crítico automático ao acertar (+5 CD de resistência). Intenção de matar + 3 graus de falha no dano pode matar.']),
    row('slam', ['Slam Attack','Ataque de Impacto'], ['Charge: damage is the greater of speed rank or normal damage +1; another +1 after a full-speed move. You resist damage of half the slam rank, rounded down.', 'Investida: dano é o maior entre graduação de velocidade e dano normal +1; mais +1 após movimento completo. Você resiste a dano de metade da graduação do impacto, arredondada para baixo.']),
    row('surprise', ['Surprise Attack','Ataque Surpresa'], ['A surprised target is vulnerable to the attack; concealment, stealth or unusual tactics may enable this.', 'O alvo surpreendido fica vulnerável ao ataque; camuflagem, furtividade ou táticas incomuns podem permitir isso.']),
    row('team', ['Team Attack','Ataque em Equipe'], ['Same effect/resistance; ranks within 5; act together. Use the highest rank that hits. Other hits total 1–2 success degrees: +2; 3+: +5. Misses add nothing.', 'Mesmo efeito/resistência; graduações com diferença até 5; ataquem juntos. Use a maior graduação que acertar. Outros acertos somam 1–2 graus de sucesso: +2; 3+: +5. Erros não contribuem.']),
  ] },
  { id: 'damage', category: 'combat', title: ['Damage resistance','Resistência a dano'], pages: '241, 243–244, 346', columns: [['Failure margin','Margem de falha'], effect], note: ['DC = 15 + Damage rank. Damage penalties accumulate. Another staggered result incapacitates; damage to an incapacitated target can cause dying, then death. Rest removes one damage condition per minute, worst first.', 'CD = 15 + graduação de Dano. Penalidades de dano acumulam. Outro resultado oscilante (staggered) incapacita; dano em alvo incapacitado pode causar morrendo, depois morte. Descanso remove uma condição de dano por minuto, da pior para a menor.'], rows: [
    row('0', ['Success','Sucesso'], ['No effect.', 'Sem efeito.']),
    row('1', ['1–5 · 1 degree','1–5 · 1 grau'], ['−1 on further resistance checks against damage.', '−1 em novos testes de resistência contra dano.']),
    row('2', ['6–10 · 2 degrees','6–10 · 2 graus'], ['Dazed through the end of your next turn, and −1 against damage.', 'Atordoado até o fim do próximo turno e −1 contra dano.']),
    row('3', ['11–15 · 3 degrees','11–15 · 3 graus'], ['Staggered and −1 against damage.', 'Oscilante (staggered) e −1 contra dano.']),
    row('4', ['16+ · 4 degrees','16+ · 4 graus'], ['Incapacitated.', 'Incapacitado.']),
  ] },
  { id: 'defenses', category: 'combat', title: ['Attacks, range & cover','Ataques, alcance e cobertura'], pages: '240–246', columns: [name, effect], rows: [
    row('defense', ['Defense classes','Classes de defesa'], ['Close: 10 + Parry. Ranged: 10 + Dodge. General resistance: 10 + effect rank; Damage uses 15 + rank.', 'Corpo a corpo: 10 + Aparar. À distância: 10 + Esquiva. Resistência geral: 10 + efeito; Dano usa 15 + graduação.']),
    row('critical', ['Critical / miss','Crítico / erro'], ['Natural 20 always hits; if the total also meets defense, critical: +5 resistance DC, added effect (rank 0) or alternate effect. Natural 1 always misses.', '20 natural sempre acerta; se o total também igualar ou superar a defesa, crítico: +5 CD de resistência, efeito adicional (graduação 0) ou efeito alternativo. 1 natural sempre erra.']),
    row('range', ['Ranged distances','Distâncias de ataque'], ['Short: rank × 25 ft., no penalty; medium: × 50 ft., −2; long: × 100 ft., −5. Beyond long range: cannot attack.', 'Curto: graduação × 25 pés, sem penalidade; médio: × 50 pés, −2; longo: × 100 pés, −5. Além do longo: não pode atacar.']),
    row('area', ['Area / perception','Área / percepção'], ['No attack check or critical; normal attack-check maneuvers do not apply. Area normally allows Dodge DC 10 + rank for half rank, before effect resistance.', 'Sem teste de ataque ou crítico; manobras de teste de ataque não se aplicam. Área normalmente permite Esquiva CD 10 + graduação para metade da graduação, antes da resistência ao efeito.']),
    row('concealment', ['Concealment','Camuflagem'], ['Partial −2 / total −5 on attack checks. Total requires knowing or guessing the target’s location.', 'Parcial −2 / total −5 nos ataques. Total exige conhecer ou adivinhar a posição do alvo.']),
    row('cover', ['Cover','Cobertura'], ['Partial −2 / total −5 to attack; matching +2/+5 to Dodge vs. area from that direction. Completely blocked: cannot target, but can attack cover.', 'Parcial −2 / total −5 no ataque; +2/+5 correspondente em Esquiva contra área daquela direção. Bloqueado por completo: não pode atacar o alvo, mas pode atacar a cobertura.']),
    row('vulnerable', ['Vulnerable / defenseless','Vulnerável / indefeso'], ['Vulnerable halves active defense ranks, rounding up. Defenseless sets them to 0 (normally defense DC 10).', 'Vulnerável reduz graduações de defesa ativa à metade, arredondando para cima. Indefeso as reduz a 0 (normalmente CD de defesa 10).']),
    row('minions', ['Minions','Capangas'], ['Non-minions may use routine attacks against them. Minions cannot critically hit non-minions; a failed resistance takes the worst effect degree.', 'Não capangas podem usar ataques rotineiros contra eles. Capangas não causam críticos em não capangas; falhar na resistência aplica o pior grau do efeito.']),
  ] },
  { id: 'checks', category: 'checks', title: ['Checks & degrees','Testes e graus'], pages: '12–16', columns: [name, effect], rows: [
    row('check', ['Trait check','Teste de característica'], ['d20 + modifier vs. DC. Meeting DC is one success degree; every full 5 above adds a degree. Failing by 1–5 is one failure degree; 6–10 is two, and so on.', 'd20 + modificador contra CD. Igualar a CD é um grau de sucesso; cada 5 completos acima soma um grau. Falhar por 1–5 é um grau de falha; 6–10 são dois, e assim por diante.']),
    row('routine', ['Routine check','Teste rotineiro'], ['Use 10 + modifier in safe, unhurried circumstances; the GM decides availability. Skill Mastery permits routine checks with chosen skills under pressure.', 'Use 10 + modificador em situação segura e sem pressa; o mestre decide quando cabe. Maestria em Perícia permite testes rotineiros nas perícias escolhidas sob pressão.']),
    row('opposed', ['Opposed check','Teste oposto'], ['Higher total wins; ties favor the higher modifier, then another roll. An inactive opponent can use 10 + modifier.', 'O maior total vence; empate favorece o maior modificador, depois nova rolagem. Um oponente inativo pode usar 10 + modificador.']),
    row('team-check', ['Team check','Teste em equipe'], ['Assistants check DC 10; combine their success and failure degrees. Net 1–2 success degrees: +2; 3+: +5. Net 1 failure degree: no modifier; 2+ failure: −2.', 'Ajudantes testam CD 10; combine seus graus de sucesso e falha. Saldo de 1–2 graus de sucesso: +2; 3+: +5. Saldo de 1 grau de falha: sem modificador; 2+ de falha: −2.']),
  ] },
  { id: 'difficulty', category: 'checks', title: ['Difficulty classes','Classes de dificuldade'], pages: '13', columns: [['DC','CD'], name, ['Example','Exemplo']], rows: [
    row('0', ['0','0'], ['Very easy','Muito fácil'], ['See something in plain sight.', 'Ver algo à vista.']),
    row('5', ['5','5'], ['Easy','Fácil'], ['Climb a knotted rope.', 'Escalar uma corda com nós.']),
    row('10', ['10','10'], ['Average','Média'], ['Hear a guard approaching.', 'Ouvir um guarda se aproximando.']),
    row('15', ['15','15'], ['Tough','Difícil'], ['Disarm an explosive.', 'Desarmar um explosivo.']),
    row('20', ['20','20'], ['Challenging','Desafiadora'], ['Swim against a strong current.', 'Nadar contra correnteza forte.']),
    row('25', ['25','25'], ['Formidable','Formidável'], ['Climb wet, slippery rock.', 'Escalar rocha molhada e escorregadia.']),
    row('30', ['30','30'], ['Heroic','Heroica'], ['Beat advanced security.', 'Superar segurança sofisticada.']),
    row('35', ['35','35'], ['Super-heroic','Super-heroica'], ['Convince guards to admit an unauthorized visitor.', 'Convencer guardas a admitir visitante sem autorização.']),
    row('40', ['40','40'], ['Nigh-impossible','Quase impossível'], ['Track a commando after days of rain.', 'Rastrear um comando após dias de chuva.']),
  ] },
  { id: 'limits', category: 'checks', title: ['Power level limits','Limites de nível de poder'], pages: '24–25', columns: [name, effect], rows: [
    row('skills', ['Skills','Perícias'], ['Total modifier ≤ PL + 10.', 'Modificador total ≤ NP + 10.']),
    row('attack', ['Attack + effect','Ataque + efeito'], ['Attack bonus + effect rank ≤ 2 × PL.', 'Bônus de ataque + graduação do efeito ≤ 2 × NP.']),
    row('no-attack', ['No attack check','Sem teste de ataque'], ['If resisted but no attack check is needed, effect rank ≤ PL.', 'Se permite resistência e dispensa ataque, graduação do efeito ≤ NP.']),
    row('active', ['Active defense + Toughness','Defesa ativa + Resistência'], ['Dodge + Toughness ≤ 2 × PL; Parry + Toughness ≤ 2 × PL.', 'Esquiva + Resistência ≤ 2 × NP; Aparar + Resistência ≤ 2 × NP.']),
    row('fort-will', ['Fortitude + Will','Fortitude + Vontade'], ['Fortitude + Will ≤ 2 × PL.', 'Fortitude + Vontade ≤ 2 × NP.']),
  ] },
  { id: 'materials', category: 'checks', title: ['Material Toughness','Resistência de materiais'], pages: '244', columns: [['Material','Material'], ['Toughness','Resistência']], note: ['Values for about 1 inch thickness. +1 per doubling, −1 per halving. Inanimate objects: 2 damage failure degrees break them, 3+ destroy them; they require repair.', 'Valores para cerca de 1 polegada de espessura. +1 a cada duplicação, −1 a cada redução à metade. Objetos inanimados: 2 graus de falha no dano quebram, 3+ destroem; exigem reparo.'], rows: [
    row('paper', ['Paper / soil','Papel / solo'], ['0','0']), row('glass', ['Glass / ice / rope','Vidro / gelo / corda'], ['1','1']), row('wood',['Wood','Madeira'],['3','3']), row('stone',['Stone','Pedra'],['5','5']), row('iron',['Iron','Ferro'],['7','7']), row('concrete',['Reinforced concrete','Concreto armado'],['8','8']), row('steel',['Steel','Aço'],['9','9']), row('titanium',['Titanium','Titânio'],['15','15']), row('alloy',['Super-alloys','Superligas'],['20+','20+']),
  ] },
  { id: 'hero-points', category: 'hero', title: ['Hero points','Pontos heroicos'], pages: '20–21', columns: [name, effect], note: ['Each option costs 1 hero point; normally a reaction. These reminders do not spend points on the sheet.', 'Cada opção custa 1 ponto heroico; normalmente uma reação. Estes lembretes não gastam pontos da ficha.'], rows: [
    row('reroll', ['Improve roll','Melhorar rolagem'], ['Reroll your die before the outcome is announced; keep the better roll. Add 10 to a reroll of 1–10 (minimum 11).', 'Role seu dado novamente antes de anunciar o resultado; fique com o melhor. Some 10 à nova rolagem de 1–10 (mínimo 11).']),
    row('recover', ['Recover','Recuperar'], ['Remove dazed, fatigued or stunned immediately, or reduce exhausted to fatigued.', 'Remova imediatamente atordoado (dazed), fatigado ou sem ações (stunned); ou reduza exausto a fatigado.']),
    row('feat', ['Heroic feat','Feito heroico'], ['Gain one rank of an eligible advantage through the end of your next turn; meet prerequisites, no fortune advantages.', 'Ganhe uma graduação de vantagem elegível até o fim do próximo turno; cumpra pré-requisitos, sem vantagens de fortuna.']),
    row('scene', ['Edit scene','Editar cena'], ['Add a useful scene detail with GM approval; do not undo established events.', 'Acrescente um detalhe útil à cena com aprovação do mestre; não desfaça eventos estabelecidos.']),
    row('inspiration', ['Inspiration','Inspiração'], ['Ask the GM for a significant hint or clue.', 'Peça ao mestre uma pista ou ajuda significativa.']),
    row('counter', ['Instant counter','Contra-atacar instantaneamente'], ['Attempt to counter an incoming effect as a reaction.', 'Tente anular um efeito que o atinge como reação.']),
  ] },
  { id: 'effort', category: 'hero', title: ['Extra effort','Esforço extra'], pages: '19–20', columns: [name, effect], note: ['Free action on your turn, once per turn. At the start of your next turn: fatigued → exhausted → incapacitated. A hero point can prevent the fatigue. Exceptional benefits can exceed PL.', 'Ação livre no seu turno, uma vez por turno. No início do próximo: fatigado → exausto → incapacitado. Um ponto heroico pode evitar a fadiga. Benefícios excepcionais podem superar NP.'], rows: [
    row('action', ['Action','Ação'], ['One additional standard action.', 'Uma ação padrão adicional.']),
    row('bonus', ['Bonus','Bônus'], ['+2 circumstance on one check; raise existing +2 to +5; cancel −2 or reduce −5 to −2.', '+2 circunstancial em um teste; amplie +2 existente a +5; anule −2 ou reduza −5 a −2.']),
    row('power', ['Power','Poder'], ['One non-permanent effect +1 rank until your next turn.', '+1 graduação em um efeito não permanente até seu próximo turno.']),
    row('stunt', ['Power stunt','Façanha de poder'], ['Temporary Alternate Effect until scene end or duration expires; no permanent effects.', 'Efeito Alternativo temporário até o fim da cena ou da duração; sem efeitos permanentes.']),
    row('resist', ['Resistance','Resistência'], ['One immediate extra resistance check against an ongoing effect.', 'Uma resistência adicional imediata contra efeito contínuo.']),
    row('retry', ['Retry','Tentar novamente'], ['Allows a new attempt for effects that specifically require extra effort to retry.', 'Permite nova tentativa em efeitos que exigem especificamente esforço extra para repetir.']),
    row('speed', ['Speed / Strength','Velocidade / Força'], ['+1 rank to either speed or Strength until your next turn.', '+1 graduação em velocidade ou Força até seu próximo turno.']),
  ] },
];

const sizes = [[3,250,-10,-20,10,20,20,2],[2,120,-8,-16,8,16,16,2],[1,60,-6,-12,6,12,12,1],[0,30,-4,-8,4,8,8,1],[-1,15,-2,-4,2,4,4,0],[-2,6,0,0,0,0,0,0],[-3,3,2,4,-2,-1,0,0],[-4,1,4,8,-4,-2,0,-1],[-5,.5,6,12,-6,-3,0,-1],[-6,.25,8,16,-8,-4,0,-2],[-7,1/12,10,20,-10,-5,0,-2]];
export const SIZE_SECTION: ReferenceSection = { id: 'size', category: 'measurements', title: ['Size rank modifiers','Modificadores por tamanho'], pages: '347', columns: [['Size rank','Grad. tamanho'],['Height / length','Altura / comprimento'],['Active defense','Defesa ativa'],['Stealth','Furtividade'],['Intimidation','Intimidação'],['STR','FOR'],['STA','VIG'],['Speed','Velocidade']], note: ['Human size is rank −2. Size rank is not Growth/Shrinking effect rank. Lengths below are the original imperial benchmarks, not the metric Measurements column.', 'Tamanho humano é graduação −2. Graduação de tamanho não é graduação de Crescimento/Encolhimento. As dimensões abaixo são os parâmetros imperiais originais, não a coluna métrica de Medidas.'], rows: sizes.map(values => row(String(values[0]), ...values.map((value, index): ReferenceText => {
  if (index === 1) {
    const length = value < 1 ? `${Math.round(value * 12)} in.` : `${value} ft.`;
    const translated = value < 1 ? `${Math.round(value * 12)} pol.` : `${value} pés`;
    return [length, translated];
  }
  const number = index > 1 && value > 0 ? `+${value}` : String(value);
  return [number, number];
}))) };

/** Size benchmarks use physical conversion, unlike the rounded game measure scale. */
export function getSizeSection(system: MeasurementSystem): ReferenceSection {
  if (system === 'imperial') return SIZE_SECTION;
  return { ...SIZE_SECTION, note: [
    'Human size is rank −2, not a Growth/Shrinking effect rank. Metric heights convert the original imperial benchmarks (1 ft. = 0.3048 m), rounded to two decimals; they are not the metric Measurements scale.',
    'Tamanho humano é graduação −2, não a graduação de Crescimento/Encolhimento. Alturas métricas convertem os parâmetros imperiais originais (1 pé = 0,3048 m), com duas casas decimais; não são a escala métrica de Medidas.',
  ], rows: SIZE_SECTION.rows.map((item, index) => {
    const metres = sizes[index][1] * .3048;
    const unit = metres >= 1 ? 'm' : 'cm';
    const value = metres >= 1 ? metres : metres * 100;
    const length: ReferenceText = [
      `${new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value)} ${unit}`,
      `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)} ${unit}`,
    ];
    return { ...item, cells: item.cells.map((cell, column) => column === 1 ? length : cell) };
  }) };
}

const benchmarks: [number, string, string][] = [[-5,'Completely inept or disabled','Completamente inapto'],[-4,'Weak / infant','Fraco / bebê'],[-3,'Young child','Criança pequena'],[-2,'Child / elderly / impaired','Criança / idoso / prejudicado'],[-1,'Below average / teenager','Abaixo da média / adolescente'],[0,'Average adult','Adulto médio'],[1,'Above average','Acima da média'],[2,'Well above average','Muito acima da média'],[3,'Gifted','Talentoso'],[4,'Highly gifted','Muito talentoso'],[5,'Best in a nation','Melhor de uma nação'],[6,'Among the world’s best','Entre os melhores do mundo'],[7,'Peak human achievement','Ápice humano'],[8,'Low superhuman','Super-humano baixo'],[10,'Moderate superhuman','Super-humano moderado'],[13,'High superhuman','Super-humano alto'],[15,'Very high superhuman','Super-humano muito alto'],[20,'Cosmic','Cósmico']];
export const BENCHMARK_SECTION: ReferenceSection = { id: 'benchmarks', category: 'checks', title: ['Ability benchmarks','Parâmetros de habilidades'], pages: '107', columns: [['Rank','Graduação'], ['Benchmark','Parâmetro']], rows: benchmarks.map(([rank,en,pt]) => row(String(rank), [String(rank),String(rank)], [en,pt])) };

export function normalizeReferenceQuery(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}
export function filterReferenceSection(section: ReferenceSection, query: string): ReferenceSection | null {
  const terms = normalizeReferenceQuery(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return section;
  const title = [section.title.join(' '), ...section.columns.flat()].join(' ');
  const rows = section.rows.filter(row => {
    const haystack = normalizeReferenceQuery([title, row.id, ...row.cells.flat()].join(' '));
    return terms.every(term => haystack.includes(term));
  });
  if (rows.length) return { ...section, rows };
  const sectionText = normalizeReferenceQuery(`${title} ${section.note?.join(' ') ?? ''}`);
  return terms.every(term => sectionText.includes(term)) ? section : null;
}
