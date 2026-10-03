# Regras utilizadas pela biblioteca

## Invocar: Múltiplos Lacaios

O Deluxe Hero's Handbook, em Summon → Multiple Minions, define +2 de custo por
graduação de Invocar para cada compra que dobra a quantidade de lacaios.
A receita Animal Summoning do Power Profiles p. 18 utiliza cinco compras,
Invocar 3, Broad Type, Horde e Self-Powered, totalizando 42 PP.

O cadastro anterior `multiple_minions` usava custo fixo. Ele permanece intacto
para conservar o preço das fichas existentes. A definição nova
`multiple_minions_ranked` usa `per_rank`, custo 2 e compras repetíveis. O motor
calcula o preço normalmente, sem reconhecer nomes de receitas.

Self-Powered é uma flaw específica de Invocar descrita no Power Profiles
p. 181: os agentes precisam chegar usando seu próprio deslocamento, -1 por
graduação. Sua definição foi acrescentada sem modificar os dados existentes.

## Ambiente

Acrescentadas as opções de intensidade para redução de visibilidade (-2/-5)
e redução de velocidade (1/2 graduações), com custos 1/2 por graduação de
Ambiente. As opções antigas mantêm seus nomes e custos para preservar fichas.

## Divergências da fonte

Não inventar modificadores para fazer uma receita alcançar um número impresso.
Quando composição e custo impresso discordarem, registrar a composição, o
custo calculado e a justificativa com a regra base, tornando a diferença visível
na prévia e na auditoria. Os números de auditoria nunca entram no motor.

## Movimento e temperatura

Portal foi cadastrado também como extra específico de Movimento (+2 por
 graduação), para receitas de Viagem Espacial/Dimensional como Space Warp.
Isso não libera um modificador específico de Teleporte em outro efeito: cada
cadastro continua pertencendo ao próprio poder. Novas opções de Frio e Calor
em Ambiente usam 1/2 por graduação, sem alterar opções antigas.

## Definições adicionais e compatibilidade

Condições Variáveis (+2, ou +1 para um único grau) e Fundir-se ao Alvo (+1) pertencem a Aflição. Fonte (-1) e Efeito Adicional (+1) de Absorção Elétrica pertencem a Cura. Persistente de Cura tem uma compra fixa de +1, sem alterar o identificador legado que cobrava por graduação. Exige Teste de Ataque (-1) pertence a Dano, e Fonte (-1) de Absorção de Radiação pertence a Atributo Aprimorado. As opções Extra Aprimorado registram o orçamento de melhorias de atributos existentes conforme seu custo real; não modificam outros poderes automaticamente.

Todas as definições anteriores ao pacote foram comparadas com `00b0ffd`: nenhum custo ou campo anterior mudou. As receitas não carregam custos de auditoria para a ficha. A lista completa de divergências e referências está na [auditoria](testing/power-library-audit.md).
