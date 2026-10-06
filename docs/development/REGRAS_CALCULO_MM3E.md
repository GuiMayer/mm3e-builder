# Regras de cálculo

Este guia descreve os contratos de cálculo utilizados pelo aplicativo. A fonte
normativa é o [Deluxe Hero's Handbook](<../sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md>),
com complementos do Power Profiles para suas receitas. O catálogo contém
configurações e descrições; não substitui a interpretação do jogador/narrador.
Limitações verificadas estão em [Pendências](../PENDENCIAS.md).

## Módulos canônicos

| Responsabilidade | Implementação |
| --- | --- |
| Preço de componentes, modificadores, arrays, Ativação e Removível | [mathEngine.ts](../../src/shared/lib/mathEngine.ts) |
| Resumo de PP/EP do personagem | [pointSummary.ts](../../src/shared/lib/pointSummary.ts) |
| Graduações efetivas e Dano baseado em Força | [componentRanks.ts](../../src/shared/lib/componentRanks.ts) |
| Cobrança de recursos e alocação dos vínculos | [resourceCalculations.ts](../../src/shared/lib/resourceCalculations.ts) |
| Alcance e duração efetivos | [effectParameters.ts](../../src/shared/lib/effectParameters.ts) |
| Diagnósticos de poderes importados/editados | [semanticValidation.ts](../../src/shared/lib/semanticValidation.ts) |

Ficha, Builder e exportações devem reutilizar esses módulos. Não calcular preços
por nome da receita nem manter fórmulas paralelas na interface ou nos exportadores.

## Características e orçamento

| Categoria | Custo |
| --- | --- |
| Habilidades presentes | 2 PP por graduação; valores negativos reduzem o custo |
| Habilidade ausente | −10 PP fixos, independentemente do valor preservado no arquivo |
| Defesas compradas | 1 PP por graduação de Esquiva, Aparar, Fortitude ou Vontade |
| Perícias | `ceil(soma das graduações compradas / 2)`; arredondar o total, não cada linha |
| Vantagens | Soma das graduações, 1 PP por graduação |
| Poderes | Preço dos poderes próprios mais a cobrança em PP de recursos vinculados |
| Equipamento | Reserva de 5 EP por graduação da vantagem Equipamento |

Resistência não é comprada no bloco de defesas; deriva das características
aplicáveis. Uma habilidade ausente tem valor efetivo zero nos cálculos derivados,
sem apagar o valor original. Essa convenção numérica não concede a capacidade
de realizar ações que exigem uma habilidade ausente.

Em modo padrão, PP disponíveis = NP atual × 15. Em campanha, PP disponíveis =
base inicial fixa + soma dos lançamentos; elevar NP muda os limites, sem conceder
PP automaticamente. Restante = disponíveis − gastos. Consultar
[Modo campanha](../guides/campaign-mode.md) para revisão da base e migração.

`calculateCharacterPointSummary` agrega os valores canônicos. Dispositivos
vinculados entram uma única vez em PP; equipamento legado e recursos pagos em
EP entram na reserva de equipamento, sem copiar seus poderes para o personagem.

## Preço de componentes

Cada componente resolve seu efeito e os modificadores aplicados. A resolução
considera a origem genérica ou específica, o subtipo e a opção de custo variável.
`per_rank`, `flat` e `flat_ranked` são modalidades distintas:

- `per_rank`: altera o preço por graduação do efeito. A graduação do modificador
  multiplica sua contribuição somente quando a definição admite essa progressão.
- `flat`: soma ou desconta uma compra fixa.
- `flat_ranked`: valor fixo multiplicado pelas graduações do modificador.

`affectedRanks` indica quantas graduações do efeito recebem uma aplicação;
quando ausente, ela afeta todas. Não confundir esse campo com as graduações do
modificador. Aplicações independentes do mesmo extra/flaw são calculadas
separadamente, conforme [Política de modificadores](../guides/power-builder-modifier-policy.md).

### Progressão fracionária

Seja `t` o custo base ajustado por extras e flaws por graduação. Para bases
fracionárias `b`, o motor usa a posição equivalente `t = 2 − 1/b` antes dos ajustes.

| Posição ajustada | Preço |
| --- | --- |
| `t >= 1` | `t` PP por graduação |
| `t = 0` | 1 PP por 2 graduações |
| `t = -1` | 1 PP por 3 graduações |
| `t = -2` | 1 PP por 4 graduações |
| `t < 1` | `ceil(graduações / (2 − t))` PP |

O aplicativo não impõe um piso arbitrário de 1 PP/5 graduações. Modificadores
parciais dividem o efeito em grupos de graduações com o mesmo preço; cada grupo
fracionário é arredondado para cima. Somam-se os grupos e as compras fixas,
respeitando o mínimo de 1 PP por componente.

Exemplo: Dano 7 custa 7 PP. Área +1 por graduação aplicada apenas às primeiras
quatro graduações resulta em `4 × 2 + 3 × 1 = 11 PP`, antes de compras fixas.

Opções de custo variável podem representar preço por graduação ou pacote fixo.
Uma Imunidade funcional de 10 PP não é uma compra de 10 PP por graduação. Sentidos
estruturados preservam cada compra e seu escopo; não substituir essas compras
por um preço final arbitrário.

### Dano baseado em Força

A opção explícita soma a Força efetiva às graduações compradas de Dano para
perfil e CD. O preço base da Força não é comprado novamente. Extras sobre sua
contribuição podem gerar custo adicional; flaws não devolvem o preço da Força
natural. `affectedRanks` continua limitando a incidência dos modificadores.
Sem a opção, arquivos antigos usam somente as graduações do efeito.

## Vinculados, alternativos e desconto global

Os componentes vinculados do efeito principal são somados. O custo dos
componentes de um alternativo é calculado integralmente para comparar com o
orçamento principal; a cobrança pelo slot do array é separada.

```text
array = principal + alternativos estáticos × 1
                  + alternativos dinâmicos × 2
                  + (base dinâmica ? 1 : 0)
após Ativação = max(1, array − desconto de Ativação)
PP final = max(1, após Ativação − desconto Removível)
EP final = após Ativação
```

Um alternativo estático já custa +1 PP. Marcá-lo como dinâmico muda o slot para
+2 PP, portanto acrescenta somente 1 PP ao total. A base dinâmica custa +1 PP.

Ativação global desconta 1 PP por ação de movimento ou 2 PP por ação padrão.
Removível desconta `ceil(custo / 5)` PP; Facilmente removível desconta o dobro.
O cálculo usa o custo após Ativação, incluindo os slots do array. Equipamento
não recebe esse desconto novamente, pois sua aquisição já usa EP.

A aplicação de Linked ou Alternate Effect não calcula automaticamente a
alocação durante o jogo. Trocas, uso simultâneo em arrays dinâmicos e
restrições ficcionais permanecem sob adjudicação da mesa.

## Limites de NP e diagnósticos

| Regra | Limite |
| --- | --- |
| Ataque que exige teste | Bônus de ataque + graduação do efeito ≤ 2 × NP |
| Efeito de Área ou Percepção sem teste de ataque | Graduação ≤ NP |
| Esquiva e Resistência | Soma ≤ 2 × NP |
| Aparar e Resistência | Soma ≤ 2 × NP |
| Fortitude e Vontade | Soma ≤ 2 × NP |
| Perícias não ofensivas | Bônus total ≤ NP + 10 |

As somas permitem compensações; não existe um teto isolado de NP para cada
defesa. Bônus de perícia inclui habilidade, compra e outros ajustes aplicáveis.
Perícias de ataque participam do limite ofensivo correspondente. Resistência
Impenetrável protege uma resistência existente; não aumenta o bônus de defesa.

Preferências controlam diagnósticos específicos. Avisos de aplicabilidade,
incompatibilidade e repetição de modificadores não são proibições de compra.
O salvamento exige estrutura válida, efeito selecionado, fonte resolvível dos
modificadores e configuração obrigatória. Não afirmar que todos os flags de
validação estão integrados: as lacunas atuais constam em Pendências.

## Consultas e rolagens

Dano usa CD 15 + graduação; Aflição e Enfraquecer usam CD 10 + graduação.
A consulta de dano recebe o total final da resistência: falhas de 1–5, 6–10,
11–15 e 16+ representam um a quatro graus. A consulta não aplica condições nem
simula recuperação. Medidas usam tabelas oficiais arredondadas e extrapolação
por duplicação fora do intervalo publicado; ver [Referências](../guides/references.md).

O [painel de dados](../guides/dice-roller.md) reutiliza os bônus derivados e registra o
resultado da sessão. Não decide sucesso, crítico, elegibilidade ou dano nem
altera a ficha.

## Compatibilidade e verificação

Definições legadas cujo preço difere de uma compra nova são preservadas por
identificador. Uma correção de catálogo não autoriza conversão silenciosa das
fichas. Os casos de Invocar e Cura estão em
[Regras da biblioteca](power-library-rules.md); recursos têm revisão própria em
[Recursos](../guides/resources.md).

Testes devem comparar entradas mecânicas com resultados fundamentados na fonte,
incluindo graduações parciais, frações, contexto de Força e exportações.
Expectativas da biblioteca são dados de teste, nunca parâmetros do motor.
Ver [Guia de testes](../../src/__tests__/README.md).

## Parâmetros efetivos de ação e duração

`effectParameters` deriva parâmetros sem gravar valores na ficha nem alterar
o preço. A resolução usa a definição específica/genérica correspondente à
origem do modificador. Referências do Builder, ficha, recursos e biblioteca
usam a mesma resolução; combinações ambíguas exibem parâmetros provisórios.

| Modificação | Transição / comportamento | Fonte |
| --- | --- | --- |
| Reação | Padrão ou livre → reação; custo usa a ação impressa original | Handbook, p. 196 |
| Ação Aumentada | Reação → livre → movimento → padrão | Handbook, p. 200 |
| Ação de Variável | Movimento, livre ou reação; respeita subtipo e tier legado | Handbook, Variável |
| Duração Aumentada | Instantâneo → concentração → sustentado → contínuo; +1 PP/graduação por etapa | Interpretação do DC Adventures adotada pelo app; estende Handbook, p. 192 |
| Concentração (falha) | Sustentado → concentração | Handbook, Modificadores |
| Permanente (falha genérica) | Contínuo → permanente | Handbook, Modificadores |
| Sustentado (genérico/Proteção/Imunidade/Membros Extras) | Permanente → sustentado | Handbook, p. 198 e efeitos específicos |
| Anular: Concentração + Sustentado | Instantâneo → concentração → sustentado | Handbook, Anular |
| Permanente específico de Criar/Crescimento/Insubstancial/Atributo Aprimorado | Sustentado → permanente, pelo preço específico preservado | Handbook, efeitos específicos |

Transições válidas são compostas independentemente da ordem dos modificadores.
Duração Aumentada permite selecionar uma, duas ou três etapas; aplicações
independentes somam etapas. O percurso termina em Contínuo; compras excedentes,
ciclos e destinos concorrentes exigem revisão do narrador. Sustentado genérico
+0 continua exclusivo da transição Permanente → Sustentado. A aplicação
genérica continua permitida. Registros sem `options.subtypeId` preservam uma
etapa e +1 por graduação, independentemente de `ranks` legado; não há migração
nem recálculo de preços antigos. O contexto e as receitas sustentadas estão nas
[regras da biblioteca](power-library-rules.md#aflição-sustentada).

Ação de uso, manutenção e gatilho são apresentados separadamente. Ativação
global não muda a ação do componente. Concentração específica de Aflição e
Enfraquecer permite repetir testes mediante ação padrão; não é a falha genérica
nem uma autorização automática para transformar Aflição em sustentada.

## Traços aprimorados e circunstâncias

[Modificadores de traços](../guides/trait-modifiers.md) descreve os destinos opcionais e o
estado de uso. Traço Aprimorado usa a categoria do destino no catálogo; a projeção
altera valores associados e treinamento sem recomprar graduações naturais. Arrays
consideram a opção ativa ou alocação dinâmica, não a soma de todos os alternativos.
Poderes antigos sem destino não são interpretados por notas.

Circunstâncias novas aplicam-se somente ao âmbito registrado e não compram
traços. `otherBonus` legado mantém sua interpretação histórica. O preço de extras
de dano baseado em Força considera a capacidade comprada; ativação não altera
PP. Consultas, referências e diagnóstico de origem não autorizam reprecificação
automática de modificadores legados: a correção exige revisão e backup.
