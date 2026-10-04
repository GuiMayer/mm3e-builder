import type { IPowerEffect, IModifierDef } from '../../entities/types';
export type PDFLabels = (label: string) => string;
export const englishPDFLabels: PDFLabels = label => label;
const portuguese: Record<string, string> = {
  'Trait modifiers': 'Modificadores de traços',
  'Circumstance': 'Circunstância',
  'Check only': 'Somente teste',
  'Active defense': 'Defesa ativa',
  'Active': 'Ativo',
  'Inactive': 'Inativo',
  'Purchased ranks retain their original cost. Circumstance modifiers apply only in the stated situation.': 'Graduações compradas conservam seu custo de origem. Modificadores de circunstância aplicam-se somente na situação indicada.',
  "Degree 1": "1º grau",
  "Degree 2": "2º grau",
  "Degree 3": "3º grau",
  "Variable degrees": "Graus variáveis",
  "Recovery resistance": "Resistência de recuperação",
  "Conditions": "Condições",
  "Clear All": "Limpar Tudo",
  "{{count}} active": "{{count}} ativa(s)",
  "Basic": "Básicas",
  "Combined": "Combinadas",
  "Compelled": "Compelido",
  "Controlled": "Controlado",
  "Dazed": "Atordoado",
  "Debilitated": "Debilitado",
  "Defenseless": "Indefeso",
  "Disabled": "Incapacitado",
  "Fatigued": "Fatigado",
  "Hindered": "Impedido",
  "Immobile": "Imóvel",
  "Impaired": "Prejudicado",
  "Normal": "Normal",
  "Stunned": "Paralisado",
  "Transformed": "Transformado",
  "Unaware": "Inconsciente",
  "Vulnerable": "Vulnerável",
  "Weakened": "Enfraquecido",
  "Asleep": "Dormindo",
  "Blind": "Cego",
  "Bound": "Preso",
  "Deaf": "Surdo",
  "Dying": "Morrendo",
  "Entranced": "Hipnotizado",
  "Exhausted": "Exausto",
  "Incapacitated": "Incapacitado",
  "Paralyzed": "Paralisado",
  "Prone": "Prostrado",
  "Restrained": "Contido",
  "Staggered": "Oscilante",
  "Surprised": "Surpreso",
  'PP after entry':'PP após lançamento',
  'Campaign History':'Histórico de campanha','Campaign active':'Campanha ativa','Campaign disabled':'Campanha desativada','Starting PP':'PP iniciais','Available PP':'PP disponíveis','Date':'Data','Session':'Sessão','Amount':'Quantidade','Campaign budget after entry':'Orçamento de campanha após lançamento',
  'Name':'Nome','Identity Type':'Tipo de identidade','Description':'Descrição','Modifiers':'Modificadores','Descriptors':'Descritores','Cost':'Custo','Total':'Total','Other':'Outros',
  'Abilities':'Atributos','Defenses':'Defesas','Skills':'Perícias','Advantages':'Vantagens','Powers':'Poderes','Targeted Effects':'Ataques e efeitos direcionados','Devices & Resources':'Dispositivos e recursos','Complications':'Complicações','Notes':'Notas',
  'Strength':'Força','Stamina':'Vigor','Agility':'Agilidade','Dexterity':'Destreza','Fighting':'Luta','Intellect':'Intelecto','Awareness':'Prontidão','Presence':'Presença',
  'Dodge':'Esquiva','Parry':'Aparar','Fortitude':'Fortitude','Will':'Vontade','Toughness':'Resistência','Initiative':'Iniciativa','Base':'Base','Bonus':'Bônus',
  'Player':'Jogador','Identity':'Identidade','Base of Operations':'Base de operações','Gender':'Gênero','Age':'Idade','Height':'Altura','Weight':'Peso','Eyes':'Olhos','Hair':'Cabelo','Group Affiliation':'Grupo','Series':'Série','Game Master':'Mestre',
  'PL':'NP','Hero Points':'Pontos heroicos','Points Remaining':'PP restantes','Over Budget!':'Orçamento excedido!','Campaign Adjustment':'Ajuste de campanha','Unnamed Hero':'Herói sem nome','Unnamed Power':'Poder sem nome','Unnamed Equipment':'Equipamento sem nome','Unnamed Resource':'Recurso sem nome','Unnamed':'Sem nome',
  'Attack':'Ataque','Range':'Alcance','Effect':'Efeito','Unarmed':'Desarmado','Damage':'Dano','Alternate Effect':'Efeito alternativo','Dynamic Alternate Effect':'Efeito alternativo dinâmico','Dynamic base effect':'Efeito base dinâmico','Activation':'Ativação',
  'No powers defined.':'Nenhum poder definido.','No skills trained.':'Nenhuma perícia treinada.','No advantages selected.':'Nenhuma vantagem selecionada.','No offense entries defined.':'Nenhum ataque definido.','No complications defined.':'Nenhuma complicação definida.',
  'ranks':'ranks','other':'outros','Page':'Página','continued':'continuação','close':'Corpo a corpo','ranged':'À distância','perception':'Percepção','personal':'Pessoal','move':'Movimento','standard':'Padrão','secret':'Secreta','public':'Pública','DC':'CD',
  'attack':'ataque','resistance':'resistência','area':'área','affects-others':'afeta outros','dynamic':'dinâmico','Resource':'Recurso','Equipment':'Equipamento','Free':'Gratuito','Shared':'Compartilhado','Features':'Características','Systems':'Sistemas','Effects':'Efeitos',
  'Movement':'Movimento','Alternate':'Alternativo','Defense System':'Sistema de defesa','Occupants':'Ocupantes','Resource and occupants':'Recurso e ocupantes','Removable':'Removível','Easily Removable':'Facilmente removível',
  'Vehicle':'Veículo','Headquarters':'Quartel-general','Gadget':'Dispositivo','Gear':'Equipamento','Custom':'Personalizado','Speed':'Velocidade','Defense':'Defesa','Miniscule':'Minúsculo','Fine':'Ínfimo','Diminutive':'Diminuto','Tiny':'Miúdo','Small':'Pequeno','Medium':'Médio','Large':'Grande','Huge':'Enorme','Gargantuan':'Imenso','Colossal':'Colossal','Awesome':'Titânico',
  'Burst':'Explosão','Cone':'Cone','Line':'Linha','Cloud':'Nuvem','Cylinder':'Cilindro','Shapeable':'Moldável','Perception':'Percepção','Visual':'Visual','Auditory':'Auditivo','Olfactory':'Olfativo','Tactile':'Tátil','Mental':'Mental','Radio':'Rádio',
  'sense':'sentido','type':'tipo','subtypeId':'Tipo','Accurate':'Acurado','Acute':'Aguçado','Analytical':'Analítico','Communication Link':'Elo de comunicação','Counters Concealment':'Anula ocultação','Counters Illusion':'Anula ilusão','Danger Sense':'Sentido de perigo','Darkvision':'Visão no escuro','Detect':'Detectar','Direction Sense':'Senso de direção','Distance Sense':'Senso de distância','Extended':'Estendido','Infravision':'Infravisão','Low-Light Vision':'Visão na penumbra','Microscopic Vision':'Visão microscópica','Penetrates Concealment':'Penetra ocultação','Postcognition':'Pós-cognição','Precognition':'Pré-cognição','Rapid':'Rápido','Time Sense':'Senso de tempo','Tracking':'Rastreamento','Ultra-Hearing':'Ultra-audição','Ultravision':'Ultravisão',
};
export function pdfLanguage(language = 'en'): 'en' | 'pt-BR' { return language.startsWith('pt') ? 'pt-BR' : 'en'; }
export function createPDFLabels(language: string): PDFLabels { return pdfLanguage(language) === 'pt-BR' ? label => portuguese[label] ?? label : englishPDFLabels; }

/** Copy presentation fields only. IDs and mechanical fields remain unchanged. */
export function localizePDFDefinition<T extends { name: string }>(definition: T, language: string): T {
  const localized = (definition as T & { i18n?: Record<string, { name?: string }> }).i18n?.[pdfLanguage(language)];
  return { ...definition, name: localized?.name ?? definition.name };
}
export function localizePDFModifiers(definitions: IModifierDef[], language: string): IModifierDef[] {
  return definitions.map(def => ({ ...localizePDFDefinition(def, language), subtypes: def.subtypes?.map(subtype => ({ ...subtype, label: subtype.i18n?.[pdfLanguage(language)]?.label ?? subtype.label })) }));
}
export function localizePDFPowers(definitions: IPowerEffect[], language: string): IPowerEffect[] {
  return definitions.map(def => ({ ...localizePDFDefinition(def, language), extras: localizePDFModifiers(def.extras, language), flaws: localizePDFModifiers(def.flaws, language), configurableFields: def.configurableFields?.map(field => ({ ...field, label: field.i18n?.[pdfLanguage(language)]?.label ?? field.label, options: field.options?.map(option => ({ ...option, label: option.i18n?.[pdfLanguage(language)]?.label ?? option.label })) })) }));
}
