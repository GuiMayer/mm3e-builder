# Regras e compatibilidade da biblioteca

As receitas do Power Profiles e os poderes de exemplo do Deluxe Hero’s Handbook
(fontes locais em `docs/sources/`)
usam efeitos e modificadores normais, com preços calculados pelas
[regras compartilhadas](REGRAS_CALCULO_MM3E.md). A composição mecânica é a entrada;
o preço impresso é referência editorial, nunca um override do cálculo.

## Autoria de receitas

- Receitas de livros diferentes coexistem, mesmo quando têm nomes semelhantes.
  O campo de catálogo `book` identifica o Handbook; sua ausência mantém Power
  Profiles como origem. A origem aparece na prévia e nas notas, sem acrescentar
  campos ao JSON da ficha ou exigir migração.
- O Handbook fornece 21 poderes de exemplo em 22 entradas, incluindo as duas
  compras fixas de Invisibilidade. Forma Alternativa não define efeitos nem um
  custo fechado: permanece como referência, sem inventar uma compra ou preço.
- Campos livres de catálogo são escolhas obrigatórias e acompanham as notas
  aplicadas. Políticas como `chooseEnhancedTrait` são descartadas na instanciação;
  a característica escolhida e os modificadores são campos normais do efeito.

- Efeitos escaláveis começam em graduação 1. Compras fixas que definem uma função
  mantêm as graduações necessárias, como imunidades, formas e sentidos.
- Componentes podem escalar independentemente. Compras integrais de Penetrante
  ou Afeta Corpóreo acompanham a graduação escolhida na prévia; depois de aplicar,
  são compras normais editáveis, sem vínculo vivo com a receita.
- Modificadores parciais indicam suas graduações afetadas. Duas condições distintas
  de Limitado podem ser aplicações independentes, sem agregar ou descartar entradas.
- Sentidos e defesas pareadas são compras independentes. Não mover descontos entre
  componentes para forçar um total; respeitar os arredondamentos de cada compra.
- Um componente de graduação zero pode representar extras fixos sobre um atributo
  existente, sem comprar o efeito-base novamente. Não adicionar Feature fictício
  ou preço manual para ajustar o resultado.
- Extra Aprimorado registra um orçamento de melhorias sobre um atributo existente,
  conforme a opção de 1, 2 ou 3 PP por graduação. Não modifica o alvo automaticamente.
- Configurações globais, como Ativação e Removível, pertencem ao poder inteiro.
  Duração aumentada de Dano para Concentração é um extra; não é a flaw Concentração
  aplicada a efeitos sustentados.
- Condições, gatilhos e restrições sem campo estruturado acompanham as notas.
  A aplicação copia dados para o rascunho e exige o salvamento normal do Builder.

## Invocar: Múltiplos Lacaios

O Deluxe Hero's Handbook define +2 por graduação de Invocar para cada compra
que dobra a quantidade de lacaios. `multiple_minions_ranked` representa essa
regra com `per_rank`, custo 2 e progressão repetível. O identificador legado
`multiple_minions` continua com preço fixo para preservar as fichas existentes.
Não substituí-lo automaticamente.

Animal Summoning (Power Profiles, p. 18) usa cinco compras, Invocar 3, Broad Type,
Horde e Self-Powered, totalizando 42 PP pelo motor normal. Self-Powered é uma
flaw específica de Invocar (p. 181), −1 por graduação: os agentes chegam usando
seu próprio deslocamento. A receita não cria a ficha da criatura invocada.

## Opções específicas e definições legadas

| Efeito | Contrato |
| --- | --- |
| Ambiente | Opções de visibilidade, deslocamento, frio e calor representam intensidades de custo 1/2 por graduação. Opções antigas preservam nomes e custos. |
| Movimento | Portal +2 por graduação pertence ao próprio efeito; não libera extras específicos de Teleporte em outros efeitos. |
| Aflição | Condições Variáveis (+2, ou +1 para um grau) e Fundir-se ao Alvo (+1) permanecem específicos. |
| Cura | `persistent_flat` cobra +1 fixo; `persistent` legado mantém preço por graduação. Fonte (−1) e Efeito Adicional (+1) são específicos. |
| Dano | Exige Teste de Ataque (−1) pertence ao próprio efeito. |
| Atributo Aprimorado | Fonte (−1) da absorção de radiação e opções de Extra Aprimorado não alteram outros poderes da ficha. |

A origem específica deve continuar resolvível após importação e edição, mesmo
quando um modificador genérico tem o mesmo identificador. A escolha de aplicar
modificadores genéricos permanece com o jogador/narrador.

## Divergências editoriais e limites

Quando composição e custo impresso discordam, a prévia apresenta a composição,
o resultado e a justificativa com a regra base. As anotações ficam junto da
receita no catálogo. Não inventar modificadores ou descontos para alcançar o
número impresso; divergência editorial não implica defeito do motor.

Receitas que exigem atributos ausentes do personagem ficam apenas para consulta.
O [guia da biblioteca](../guides/power-library.md) identifica essas entradas. Não aplicar
versões incompletas nem introduzir mudanças de atributos disfarçadas de flaws.

### Aflição Sustentada

O app adota a progressão do DC Adventures em Duração Aumentada:
Instantâneo → Concentração → Sustentado → Contínuo, por +1 PP por graduação
do efeito por etapa. É uma interpretação explicitamente adotada; a definição
genérica do Deluxe Hero's Handbook omite Concentração → Sustentado.
A [comparação dos textos](https://rpg.stackexchange.com/questions/56926/can-i-make-an-instant-duration-effect-sustained)
e o [relato da consulta à Green Ronin pelo desenvolvedor do Hero Lab](https://forums.wolflair.com/threads/increased-duration.12650/)
documentam o contexto, sem constituir uma errata oficial do Handbook.

Friction Blindness, Friction Muzzle, Blinding Aura e Fifth Wheel of Weyan usam
duas etapas (+2 PP/graduação), com manutenção por ação livre. A interpretação
aparece na prévia e acompanha as notas ao aplicar o poder. Resistência e
recuperação seguem as regras normais; Sustentado não elimina testes.

Os custos vêm da composição normal: os dois poderes de atrito custam
0,5 PP/graduação, arredondado por componente; Blinding Aura custa 4 PP/graduação
e inclui a dependência sensorial de Área de Percepção; Fifth Wheel of Weyan
custa 4 PP/graduação. As divergências dos valores impressos (1, 1 e 3,
respectivamente) aparecem na prévia, sem compensações artificiais.

As etapas usam `options.subtypeId` de Duração Aumentada. Sem essa opção,
uma aplicação continua comprando uma etapa por +1 PP/graduação, mesmo com
`ranks` legado maior que 1. Fichas existentes não são reescritas nem migradas.

Aplicar uma receita não grava preço editorial, política de graduação ou
identificador vivo do catálogo na ficha. Importar e salvar preserva aplicações,
opções e identificadores legados; qualquer conversão futura exige revisão
explícita e backup.

## Identificação de definições legadas

A paleta, modificadores aplicados e referências rápidas identificam as opções
Legado/Recomendado em Invocar e Cura. Tooltips/descrições explicam a modalidade
de preço real e a opção atual correspondente. A lista permanece alfabética no
idioma selecionado; a recomendação não oculta as definições antigas.

Persistente de Cura remove dano Incurável; não concede bônus temporário de
resistência a alvos saudáveis. `persistent` preserva +1 por graduação do efeito;
`persistent_flat` segue a compra fixa +1 do Handbook. Persistente de Regeneração
é outra definição e não recebe o rótulo legado de Cura. IDs, opções e preços
existentes permanecem intactos ao importar, editar sem trocar a compra e exportar.
