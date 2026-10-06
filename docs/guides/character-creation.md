# Criação de personagens

## Fluxo

O botão Novo Personagem abre um diálogo com Ficha limpa e Começar com um
arquétipo. A ficha limpa usa os valores padrão do aplicativo. Importação,
duplicação e recuperação de rascunhos mantêm seus próprios fluxos.

O catálogo oferece os 15 arquétipos do Deluxe Hero’s Handbook, páginas 35–49,
com NP 10 e orçamento publicado de 150 PP. Segue o padrão da Biblioteca de
poderes: busca bilíngue sem distinção de acentos, ordenação pelo nome exibido,
lista e prévia no desktop, navegação entre lista e detalhes no mobile.

O Nome do Herói recebe o nome do arquétipo no idioma ativo ao confirmar a
criação. Não existe um campo adicional para nome nessa etapa. Depois de criado,
o nome pode ser editado na ficha; mudar o idioma não renomeia personagens.

A prévia apresenta custos calculados por categoria, habilidades base e efetivas,
defesas, ataques, perícias, vantagens, poderes e recursos. Escolhas exigidas
pelo arquétipo devem ser preenchidas antes de confirmar. Variantes opcionais
ficam em uma seção recolhível. Identidade, histórico e complicações permanecem
editáveis na ficha, sem informações inventadas.

Composições abertas, como os efeitos alternativos do Controlador de Energia e
do Místico, podem ser montadas no Builder ou selecionadas na biblioteca e
revisadas no Builder. Cada escolha respeita seu orçamento; permite efeitos
vinculados, sem arrays internos ou Removível adicional. Compras de Sentidos
exigem configuração estruturada. Os pools de Variável do Mímico e Metamorfo
mantêm seus orçamentos e descrições; suas formas são configuradas manualmente.

## Criação e persistência

As fábricas em `src/data/archetypes/` produzem personagens e recursos novos.
Cada criação gera IDs independentes para personagens, poderes, componentes,
modificadores, alternativos, recursos e vínculos. A prévia fica em memória;
voltar ou cancelar não grava personagens nem recursos.

`features/character-creation/commitCharacterCreation.ts` valida o pacote antes
de gravar, aguarda a recuperação inicial dos rascunhos e coordena as stores de
personagens e recursos. Falhas de persistência restauram o estado anterior e
os dados duráveis. Se o navegador também impedir a recuperação, a interface
informa a necessidade de exportar as fichas ainda abertas antes de recarregar.

O atalho Novo Personagem do diálogo de destino da Biblioteca usa esse fluxo.
Cancelar preserva o poder pendente; concluir abre o poder no Builder da nova
ficha, para revisão antes de salvar.

## Cálculos e compatibilidade

Custos vêm do motor canônico, sem preços sobrescritos para alcançar 150 PP.
O schema permanece 2.3.0. Nenhuma migração ou alteração automática das fichas
existentes é realizada. Associações adicionais são opcionais e explícitas,
usando o registro `fieldValues` já suportado pelo formato:

- `enhancedAdvantageId` e `enhancedAdvantageSubtype`: identificam uma vantagem
  concedida por Traço Aprimorado. Seus valores efetivos aparecem na ficha e
  no PDF, mas não são gravados como vantagens compradas. A edição das compras
  usa a ficha original; concessões são alteradas no poder de origem.
- `enhancedScope: lifting`: Força limitada a levantar peso não aumenta Força
  geral, dano ou a base usada para precificar extras de ataques.
- `enhancedExtraId: impervious` e `enhancedExtraTarget: toughness`: associam
  Impenetrável à Resistência, sem adicionar Resistência novamente.
- `attackSkill`: associa o componente a uma especialização de perícia de
  combate. O Builder permite revisar essa associação. Sem o campo, permanece
  o comportamento existente de correspondência pelo nome do poder.

Traço Aprimorado legado sem associação explícita continua com aplicação manual.
Uso, alternativos e vínculos determinam quais concessões estão ativas. A
Armadura de Combate mantém seus sistemas comuns nos dois ramos do array.

Os ataques de arremesso registrados como efeitos manuais incluem uma nota para
revisar seu bônus e dano depois de mudar Força ou bônus de ataque. Os veículos
iniciais usam o motor de recursos atual e o orçamento de equipamento da opção.

## Diferenças editoriais

Diferenças entre os valores publicados e os preços calculados são indicadas
na prévia, preservando as características da receita:

| Arquétipo | Diferença |
| --- | --- |
| Inventor | O escudo de 21 PP recebe desconto Removível de 5 PP, resultando em 149 PP totais, em vez dos 150 impressos. |
| Psíquico | As compras de defesas publicadas somam 27 PP, embora o subtotal impresso seja 26; o total calculado é 151 PP. |
| Mestre de Armas | Talentos de 7 PP com Facilmente Removível recebem desconto de 4 PP e custam 3 PP, em vez de 5. O total depende dos talentos escolhidos. |

## Validação

Testes cobrem os 15 arquétipos, escolhas e variantes, preços por categoria,
valores derivados, independência de IDs, exportação/importação com recursos,
HTML do PDF e recuperação após falhas de armazenamento. O build e os testes
não dependem de `docs/sources/`, material local ignorado pelo Git.
