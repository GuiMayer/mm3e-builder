# Regras e compatibilidade da biblioteca

As receitas do Power Profiles (fonte local em `docs/sources/`)
usam efeitos e modificadores normais, com preços calculados pelas
[regras compartilhadas](REGRAS_CALCULO_MM3E.md). A composição mecânica é a entrada;
o preço impresso é referência editorial, nunca um override do cálculo.

## Autoria de receitas

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

Receitas que exigem atributos ausentes do personagem ou Aflição Sustentada não
representada pelo modelo ficam apenas para consulta. O [guia da biblioteca](power-library.md)
identifica essas entradas. Não aplicar versões incompletas nem introduzir
mudanças de atributos disfarçadas de flaws. Trabalho aberto sobre duração e
apresentação de definições legadas consta em [Pendências](PENDENCIAS.md).

Aplicar uma receita não grava preço editorial, política de graduação ou
identificador vivo do catálogo na ficha. Importar e salvar preserva aplicações,
opções e identificadores legados; qualquer conversão futura exige revisão
explícita e backup.
