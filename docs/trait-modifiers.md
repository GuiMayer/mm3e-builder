# Modificadores de traços e aprimoramentos

## Controles da ficha

Atributos, defesas e perícias oferecem **Adicionar modificador**. Os campos
opcionais aparecem após essa ação. Um ajuste de circunstância registra valor,
origem/condição, âmbito e estado ativo; pode ser editado, removido ou desligado.
±2 e ±5 são orientações do Handbook para situações menores e maiores, sem
limite artificial no editor. Um ajuste em teste não compra graduações, concede
treinamento ou modifica todos os traços associados ao atributo.

Esquiva e Aparar permitem distinguir ajustes no teste de ajustes na defesa
ativa. Modificadores novos de circunstância não são tratados como graduações
para limites de NP. O usuário/narrador continua responsável pelas condições
e exceções específicas da origem indicada.

O campo de perícia `otherBonus` conserva a interpretação histórica, inclusive
valores negativos. Campos vazios ficam ocultos e podem ser adicionados pelo
mesmo botão; entradas preenchidas continuam visíveis. Não há conversão
automática desse bônus em circunstância ou aprimoramento. Perícias com bônus
manual e zero graduações também aparecem no PDF preenchido.

## Aprimoramento por poder

A opção de aprimoramento cria um poder no Builder ou direciona um componente
existente. A graduação é editada na compra original; a ficha mostra o valor
efetivo e a fonte com atalho para editar. Atributos/defesas/perícias mantêm
campos de compra natural separados. O destino também pode ser uma perícia com
especialização ainda não comprada naturalmente.

Traço Aprimorado usa o custo do destino no catálogo: atributo 2 PP/graduação,
defesa 1 PP/graduação, perícia 1 PP por duas graduações, antes dos modificadores
e arredondamento canônico. Força natural 2 e aprimoramento 5 resultam em Força
7 e custo total 14 PP. Não são cobradas novamente as cinco graduações como
naturais. Agilidade afeta Esquiva, iniciativa e perícias; Luta afeta Aparar e
ataques; Vigor afeta Fortitude e Resistência. Força aprimorada afeta dano
baseado em Força. Atributos ausentes não ganham aplicação automática.

Resistência não oferece compra natural direta. Criar um aprimoramento nessa
linha abre Proteção; poderes e Rolamento Defensivo continuam fontes de
Resistência. Ajustes de testes não equivalem a aumentar a defesa.

Definir um destino em poder antigo apresenta custo atual/proposto e aviso
sobre possível inclusão manual prévia do bônus. O sistema não deduz graduações
naturais nem interpreta notas. Cancelar o diálogo ou o Builder não grava dados.
Vantagens e extras de Traço Aprimorado conservam o preço, mas não recebem
aplicação automática como atributos, defesas ou perícias.

## Estado de uso

O painel recolhível **Uso dos aprimoramentos** aparece quando necessário,
incluindo fontes de Resistência como Proteção.
Poderes próprios começam ativos no efeito base. Alternativos comuns selecionam
uma opção; componentes Linked dessa opção são simultâneos. Em arrays dinâmicos,
a alocação permite distribuir graduações entre opções dinâmicas e compara seu
custo canônico ao orçamento base. Excesso gera aviso. Aprimoramentos Permanentes
continuam ativos quando se desliga uma opção que também contém outros efeitos.

As escolhas pertencem ao personagem e à origem do poder. Veículos e bases não
transferem aprimoramentos ao personagem sem escolha explícita. Equipamentos
seguem a política existente de fonte mais forte; suas contribuições não se
acumulam todas. Ligar, desligar e selecionar alternativos alteram valores em
uso, sem recalcular o preço da compra salva. Extras de dano baseado em Força
usam a capacidade de Força aprimorada comprada para precificação, independente
do estado ativo, para evitar mudanças de PP ao alternar poderes.

Ficha, rolagens, avisos de NP, PDF e Excel usam projeções compartilhadas. Os
resumos de pontos usam as compras originais. Exportações apresentam as fontes
dos modificadores separadas dos valores naturais.

## Persistência e compatibilidade

Schema de personagem 2.3.0 acrescenta somente contratos opcionais:

- `components[].enhancedTarget`: destino de atributo, defesa ou perícia/subtipo.
- `traitModifiers[]`: identidade, destino, valor, origem, âmbito e estado ativo.
- `powerUsage`: escolhas por chave `power:<id>`, `equipment:<id>` ou
  `resource:<resourceId>:<powerId>`, com opção, alocações e destinatário.

JSON, JSONL, rascunhos e recursos preservam esses campos. Duplicação troca
identidades próprias e remapeia suas escolhas; referências a recursos
compartilhados continuam compartilhadas. Abrir uma ficha antiga não cria esses
campos. Aprimoramentos sem destino mantêm valores e custos legados e mostram
aviso para revisão explícita. Importação do formato plano 1.0 preserva categoria
de custo e configuração opcionais presentes no arquivo ao criar o componente.

## Fontes e manutenção

Handbook Deluxe: circunstâncias p. 15; atributos aprimorados p. 108; defesas e
Resistência p. 110–111; perícias p. 112; Traço Aprimorado p. 158. A apresentação
por botão é uma decisão de interface, mantendo a distinção entre compra e uso.

`traitValues`, `powerUsage`, `traitTargets` e `pricingStrength` concentram as
projeções. `traitContracts`, `traitValues`, `powerUsage` e `traitCompatibility`
cobrem contratos, preços, propagação, arrays e importação/exportação histórica.
