# Plano: biblioteca de poderes do Power Profiles

Data: 2026-10-03. Estado: em implementação; receitas auditadas em lotes de três capítulos.
Versão proposta: 1.20.0, após a versão atual 1.19.0.

## Objetivo

Escolher uma receita de poder do Power Profiles diretamente no Power Builder.
A receita preenche efeitos, extras, flaws e configurações; o usuário define a
graduação e continua editando com os controles existentes. A biblioteca aparece
por um botão com quatro quadrados no cabeçalho de cada destino: efeito-base,
efeito alternativo e componente vinculado, inclusive dentro de um alternativo.

O catálogo é conteúdo do aplicativo. Um poder aplicado vira uma cópia completa
no formato atual da ficha, sem depender do catálogo para abrir, calcular ou
exportar. Alterações futuras na biblioteca não atualizam poderes já salvos.

## Leitura do livro e do projeto

Fonte estudada: [Power Profiles](sources/Mutants%20%26%20Masterminds%203%20-%20Power%20Profiles.md).
O estudo cobre a introdução e o sumário, receitas de Ar e Armadura e exemplos
de Ilusão, Vida, Mental, Magia, Meta, Invocação, Teleporte e Clima. A catalogação
completa e a auditoria de cada receita fazem parte da implementação.

O formato recorrente é nome temático, explicação, composição mecânica e custo.
Os capítulos agrupam poderes por tema, geralmente com subseções ofensivas,
defensivas, de movimento e utilidade. Algumas seções fogem desse padrão:
Magia tem feitiços, por exemplo. Há variações da mesma receita, valores fixos,
custos mistos, escolhas em aberto e referências a outros capítulos. Nem toda
menção a um poder ou sugestão de array é uma receita completa.

| Exemplo estudado | Consequência para a biblioteca |
| --- | --- |
| Air Blast, p. 6 | Damage com alcance aumentado; graduação variável começa em 1. |
| Air Burst, p. 6 | Affliction precisa vir com resistência, condições e formato de área preenchidos. |
| Air Supply, p. 7 | Immunity 2 tem função específica; reduzir para 1 altera a receita. |
| Homing Missile, p. 11 | Damage variável, Homing 2 e Senses 1: nem todos os números acompanham a graduação principal. |
| Surface Shock, p. 11 | Duas construções possíveis; apresentar variantes separadas, sem aplicar ambas. |
| Air Form, p. 8 | Combinação de efeitos com valores diferentes; não confundir qualquer pacote com o extra Linked. |
| Mist, p. 7 | Escolha de intensidade determina a configuração e o custo de Environment. |
| Power Mimicry, p. 135 | Variable representa um orçamento; a biblioteca não gera automaticamente os poderes copiados. |
| Duplication, pp. 182–183 | Há informações de criatura e dependência da ficha; carregar o efeito não equivale a gerar outra ficha. |
| Weather Arrays, p. 215 | É orientação de montagem; não inventar um array completo sem composição definida. |

No projeto, `ICharacterPower` contém `components[]` e `alternateEffects[]`;
cada `IAlternateEffect` também contém `components[]`. Os componentes guardam
`effectId`, `ranks`, `modifiers`, `fieldValues`, `variableCostOption` e
`senseTraits`. O modelo já representa a maioria dessas receitas.

O custo deve continuar vindo de `calculatePowerPricing`, com resolução dos
modificadores por `resolveModifierDefinition`. O catálogo não terá outro motor
de cálculo. Preservar a política atual: extras e flaws genéricos ficam a critério
do jogador; os específicos continuam limitados ao próprio efeito. Avisos de
regras permanecem avisos, com as exigências estruturais atuais para salvar.

## 1. Interface e fluxo

### Entradas no Builder

- Usar `Grid2X2` do conjunto de ícones existente, com tooltip **Biblioteca de
  poderes** e nome acessível indicando o destino.
- Colocar o botão no cabeçalho de cada cartão de efeito-base ou vinculado e no
  cabeçalho do AE. Nos componentes do AE, permitir também aplicar a um único
  componente. O destino é identificado por IDs, não pela posição na lista.
- O botão do AE continua disponível quando ele está colapsado. Clicar na
  biblioteca não deve colapsar, excluir ou trocar o componente ativo por acidente.
- No mobile, reservar alvo de toque adequado e agrupar as ações do cabeçalho
  sem espremer nome, custo ou graduação.

### Navegação da biblioteca

Abrir um diálogo sobre o Builder, reutilizando tema, foco e componentes de
diálogo. Cabeçalho: título, destino explícito e busca. Desktop: navegação por
capítulo à esquerda, resultados e detalhes à direita. Mobile: uma coluna;
capítulo por seletor e detalhes em uma etapa própria, com **Voltar** preservando
busca e posição. Usar a largura disponível, evitando muitas colunas estreitas.

Agrupar pelos 39 temas do sumário: Ar, Armadura, Animais, Frio, Cósmicos,
Escuridão, Morte, Dimensões, Sonhos, Terra, Eletricidade, Elementos, Fogo,
Gravidade, Ilusão, Cinéticos, Vida, Luz, Sorte, Magia, Magnetismo, Marciais,
Mentais, Meta, Transformação, Plantas, Radiação, Sensoriais, Tamanho, Sônicos,
Velocidade, Força, Invocação, Talentos, Tecnologia, Teleporte, Tempo, Água e
Clima. Gerar a contagem exibida na interface a partir do catálogo.
Preservar também as subseções reais do livro; não inventar subseções para
capítulos que usam outra organização. Textos “By Design”, descritores e
complicações não aparecem como receitas aplicáveis.

Cada resultado mostra nome traduzido, nome original quando ajuda a localizar,
subseção, resumo curto e composição compacta. Ordenar nomes alfabeticamente
na língua exibida, com busca sem distinção de acentos ou maiúsculas. Buscar
também nomes originais, variantes, efeitos e descritores. A busca global pode
localizar poderes de todos os capítulos, mantendo indicação de origem.

Selecionar um resultado abre sua prévia. A alteração só ocorre em **Aplicar
poder**, depois de conferir nome, componentes, configurações e custo. Prévia:

1. Nome, capítulo/subseção e página do livro.
2. Resumo próprio curto e referência mecânica dos efeitos/modificadores.
3. Graduação inicialmente 1 para a parte escalável.
4. Valores fixos claramente separados e variantes, quando existirem.
5. Campos obrigatórios ainda indefinidos pelo livro, como uma categoria de
   alvos. Pedir apenas escolhas realmente necessárias.
6. Custo calculado da receita e impacto previsto no poder/array atual,
   identificando o uso de PP ou EP conforme o Builder aberto.
7. Uma descrição objetiva do que será substituído e do que será acrescentado.

Cancelar, fechar ou Escape preservam o rascunho. Escape fecha primeiro a
biblioteca. Ao aplicar, fechar o diálogo, destacar o destino e manter a edição
no Builder. O botão **Salvar** do Builder continua sendo quem salva o poder.

## 2. Graduações, escolhas e variantes

Diretriz confirmada pelo usuário: efeitos escaláveis começam em graduação 1;
valores fixos necessários à receita seguem o livro.

- Um Damage sem valor numérico começa em 1; editar sua graduação altera o
  componente normalmente.
- Homing 2 continua em 2 quando Damage passa de 1 para 10; o Senses associado
  permanece em 1. Modificadores por graduação continuam cobrando sobre as
  graduações do efeito por meio do motor existente.
- Immunity 2, opções discretas de Movement e compras de Senses conservam as
  configurações que definem sua função. Não multiplicar a lista de sentidos ou
  trocar a imunidade ao mudar a graduação de outro componente.
- Quando mais de um componente realmente usa a mesma graduação variável,
  a prévia permite configurá-los em conjunto. Após aplicar, usar os controles
  independentes atuais: nenhuma sincronização invisível ou vínculo novo no JSON.
- Receitas com várias graduações independentes oferecem os campos necessários;
  não reduzir tudo a um único número quando isso muda a construção.
- `affectedRanks` deve preservar a distinção entre modificador aplicado ao
  efeito inteiro e modificação parcial. Não escalar automaticamente as
  graduações do modificador, seus parâmetros de área ou seus custos fixos.
- Variantes explícitas são opções identificadas dentro da mesma receita.
  Sugestões narrativas opcionais não entram como extras obrigatórios.
- Valores personalizados continuam editáveis depois da aplicação. Valores
  fixos do catálogo são padrões fiéis, não novos impedimentos ao jogador.

## 3. Aplicação em cada destino

Definir um alvo explícito: efeito-base, AE ou componente vinculado, incluindo
`alternateId` quando o componente pertencer a um AE.

| Destino | Comportamento |
| --- | --- |
| Efeito-base | Substituir o componente-base selecionado pela receita; componentes adicionais da receita entram imediatamente depois. Preservar os outros componentes e AEs existentes. |
| Cabeçalho do AE | Preencher a composição daquele AE, preservando os demais AEs e o poder-base. Manter a configuração Dynamic do AE existente. |
| Componente vinculado | Substituir somente o componente selecionado; se a receita exige outros componentes, mostrar e inserir o conjunto naquele mesmo ramo. |
| Receita com array explícito | Oferecer aplicação como poder completo no destino principal. Não inserir um array dentro de outro AE, pois o modelo atual não representa AEs aninhados. |

Aplicar um array completo é uma ação distinta de preencher um componente:
mostrar **Aplicar array completo** e listar os componentes/AEs que substituirá.
Nunca apagar os AEs existentes como efeito colateral da aplicação comum.

Na prévia, receitas incompatíveis com o destino continuam consultáveis, com
motivo e indicação do destino correto. Não descartar componentes, transformar
um array em efeito único ou alterar a fórmula de custo para forçar a aplicação.
Aplicar um pacote de efeitos não significa adicionar automaticamente o extra
Linked: distinguir a composição que o livro exige das simples sugestões de
combinação. Auditar a representação de cada conjunto antes de disponibilizá-lo.

Nome, notas e descritores merecem tratamento explícito:

- Em um destino vazio, preencher o nome e resumo da receita.
- Preservar nomes personalizados e notas existentes por padrão. Na prévia,
  permitir **Usar nome da receita**; acrescentar o resumo/referência com
  identificação do componente, sem substituir observações do jogador.
- Descritores usam o campo atual no poder principal, com deduplicação. O AE
  não possui descritores próprios; informações exclusivas dele entram nas
  notas do AE, sem alterar silenciosamente os descritores de todos os irmãos.
- Removable e Activation são propriedades do poder inteiro. Receitas que as
  exigem não podem aplicá-las como se fossem flaws de um componente: mostrar
  o alcance da mudança na prévia e permitir somente destinos representáveis.
- Receitas de armadura não recebem Removable por pertencerem ao capítulo;
  adotar somente a configuração explícita da receita escolhida.

Gerar IDs novos para componentes e AEs novos; preservar as identidades dos
destinos substituídos quando isso mantém a seleção e as referências da edição.
Limpar opções incompatíveis do componente anterior; construir o novo objeto
completo, sem deixar resíduos de campos de outro efeito. Aplicar por uma
atualização imutável única do rascunho. Duas aplicações da mesma receita nunca
compartilham objetos mutáveis.

## 4. Catálogo e arquitetura

Separar receitas de `powers.json`, que define efeitos básicos e regras. Não
misturar receitas como Air Blast com definições de Damage ou mudar seus IDs.

Estrutura proposta:

- `src/data/power-library/index.ts`: capítulos, subseções e índice de busca.
- `src/data/power-library/profiles/*.ts`: receitas por capítulo, com tipos
  verificados e importação sob demanda.
- `src/features/power-library/types.ts`: contrato exclusivo do catálogo.
- `powerTemplateInstantiation.ts`: função pura que converte receita, variante
  e escolhas em objetos do modelo atual, usando IDs novos.
- `powerTemplateApplication.ts`: aplicação pura por destino e cálculo da prévia.
- `PowerLibraryDialog.tsx`, `PowerLibraryResults.tsx` e
  `PowerTemplatePreview.tsx`: busca, navegação e seleção.
- `PowerLibraryButton.tsx`: botão compartilhado por todos os cabeçalhos.

Cada receita deve guardar: ID estável; capítulo/subseção; nome PT/EN e aliases;
página; resumo próprio PT/EN; variante; forma da composição; componentes;
modificadores com origem genérica/específica; configurações e sentidos;
política de graduação por componente; escolhas necessárias; custos de referência
do livro para auditoria; restrições de representação por destino.

Não confiar em inferência automática do texto em tempo de execução. A fonte
tem cabeçalhos duplicados, linhas quebradas, tabelas de criaturas e múltiplas
receitas sob o mesmo título. Um script pode auxiliar o inventário, mas as
receitas publicadas devem ser curadas e validadas.

O estado temporário do diálogo contém alvo, filtros, receita selecionada,
variante e escolhas. Fechar a biblioteca descarta apenas essa seleção. Quando
o usuário remove ou troca o destino, impedir aplicação em um alvo desatualizado.
Uma falha de validação ou carregamento mantém o rascunho original intacto.

Guardar a origem e a política de graduação no catálogo, não como campos
obrigatórios da ficha. Referência textual opcional pode acompanhar as notas.
LocalStorage pode guardar somente preferência de capítulo/filtro, se necessário;
o catálogo não exige IndexedDB, conta, servidor ou duplicação no localStorage.

Carregar índice leve ao abrir a biblioteca e conteúdo dos capítulos sob demanda,
com cache em memória. Mostrar carregamento e permitir tentar novamente sem
alterar o Builder. Renderizar apenas resultados relevantes; considerar
virtualização somente se a medição com o catálogo completo justificar.

## 5. Compatibilidade e cobertura editorial

Não há migração prevista: usar os campos que já existem no JSON. Fichas antigas
não ganham campos nem sofrem reprocessamento ao abrir a biblioteca. Exportação,
importação, PDF, recursos, duplicação, Targeted Effects e rolagens continuam
consumindo poderes comuns.

Antes da implementação, conferir novamente estado do repositório, schemas e
fixtures atuais. Se a auditoria encontrar algo impossível de representar,
documentar a lacuna antes de propor mudança de ficha. Não usar strings nas
notas como substituto de uma regra que o motor precisa calcular.

Criar um inventário auditado por capítulo com estados: receita pronta, variante,
depende de escolha, referência sem composição ou lacuna do modelo. Para a
versão final, todos os capítulos devem ter cobertura documentada; itens não
aplicáveis devem ter motivo, sem omissões silenciosas. Fichas completas de
criaturas e geração automática de minions não fazem parte desta funcionalidade.

Também ficam fora desta entrega biblioteca pessoal, compartilhamento online,
favoritos e atualizações automáticas de poderes usados. O foco é localizar e
aplicar receitas do livro com boa edição posterior.

## 6. Steps e commits lógicos

| Step | Entrega | Commit proposto |
| --- | --- | --- |
| 1 | Inventário dos capítulos/receitas, contrato do catálogo e política aprovada de graduações; matriz de compatibilidade. | `docs(power-library): define catalog coverage and application policy` |
| 2 | Conversão e aplicação por alvo, sem UI; validação dos IDs, campos, preços e isolamento do rascunho. | `feat(power-library): instantiate and apply power templates` |
| 3 | Diálogo responsivo, busca PT/EN, prévia, escolhas e custo contextual; catálogo pequeno representativo para validar o fluxo. | `feat(power-library): add searchable template picker` |
| 4 | Botões nos cabeçalhos principal, AE e vinculados; preservar foco, seleção, colapso, notas e os modos PP/EP. | `feat(power-builder): integrate library across effect headers` |
| 5 | Catálogo completo em lotes por capítulos, cada lote com auditoria mecânica, traduções e testes relevantes. | `feat(power-library): add audited <profile-group> templates` |
| 6 | QA com o catálogo completo, documentação de uso/cobertura, changelog e versão. | `docs(release): document power library for 1.20.0` |

Os primeiros capítulos servem para validar a arquitetura; não representam uma
redução definitiva do catálogo. Dividir o step 5 em commits que agrupem capítulos
prontos, evitando um commit enorme com conteúdo ainda não conferido.

## 7. Verificação e critérios de aceite

Testes relevantes da conversão e aplicação:

- Damage escalável, Affliction configurado, imunidade fixa, compras de Senses,
  Movement e modificadores genéricos/específicos.
- Homing Missile: Damage 1 e 10, Homing sempre 2, Senses sempre 1; conferir
  fórmula mista pelo motor atual, sem constantes compensatórias no catálogo.
- Valores fixos, custos variáveis, parâmetros de área e graduações parciais.
- Conjunto de componentes, AE com vinculados e array explícito; nenhum AE
  aninhado ou perda de componentes.
- Cancelamento sem mudança; aplicação preserva irmãos, notas e configurações
  fora do alvo; catálogo original e outra aplicação não são modificados.
- Template desconhecido, escolha incompleta ou ID inválido não alteram o
  rascunho; preservar as regras atuais de salvar e os avisos de modificadores.
- Exportar/importar poder aplicado preserva sua mecânica sem biblioteca;
  fixtures antigas e duplicação continuam funcionando.
- Custo da prévia e custo final idênticos, inclusive AE Dynamic e contexto EP.

Auditoria editorial: conferir contra a receita do livro em graduações 1, 5 e 10
quando escalável, e no valor definido quando fixa. Divergências de custo são
investigadas; não ajustar o motor global só para igualar uma transcrição. Cada
entrada aplicada precisa resolver efeitos, modificadores e opções reais.

QA visual e acessível: desktop 960px/1440px/2560px, mobile 320px/390px, teclado,
Escape, retorno de foco, tela com notas longas e listas grandes. A prévia usa
tooltips e referências existentes; nenhum hover é necessário para aplicar.
Testar ainda ausência de rolagem horizontal, custo/ações visíveis e respeito à
prioridade do menubar/configurações sobre a janela de dados.

Executar verificações de tipos, lint, testes apropriados, build e verificação
estática. A entrega só termina com cobertura dos capítulos documentada, fluxo
validado em todos os destinos e fichas antigas preservadas. Push e deploy são
uma etapa posterior quando solicitados.
