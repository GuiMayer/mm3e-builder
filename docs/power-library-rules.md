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
