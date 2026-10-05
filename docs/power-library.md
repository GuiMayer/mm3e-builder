# Biblioteca de poderes

A aba **Biblioteca de poderes**, entre Recursos e Referências, oferece três
seções: Power Profiles, Poderes das fichas e Modelos. A navegação usa lista e
detalhes lado a lado no desktop; no mobile, selecionar uma entrada abre seus
detalhes e **Voltar aos resultados** recupera a lista. Busca e nomes são ordenados
conforme o idioma; a busca ignora acentos.

## Power Profiles

O catálogo do livro é somente para consulta. Graduações e escolhas necessárias
alteram uma prévia, sem editar receitas. **Usar na ficha** abre um popup com as
fichas atuais e a opção **Novo Personagem**. Escolher uma ficha abre uma cópia
no Power Builder; criar uma nova abre o Builder para essa ficha. É necessário
salvar no Builder para adicionar o poder. Cancelar o popup preserva as fichas e
a prévia. Entradas apenas para referência continuam bloqueadas.

## Poderes das fichas

Lista os poderes de todas as fichas locais abertas, com personagem de origem,
custo e filtro por personagem. Fichas em arquivos externos ou abas fechadas não
fazem parte desse índice. Poderes que foram copiados do livro também aparecem:
o formato da ficha não guarda um vínculo de autoria com o catálogo.

**Editar na ficha** seleciona o personagem correto e abre seu poder no Builder.
Ao salvar, o sistema verifica a identidade e a composição original: uma ficha
removida ou um poder alterado enquanto o editor estava aberto não é sobrescrito.
Mudanças em outros campos da ficha são preservadas. **Salvar como modelo** copia
o poder e abre o editor do modelo, sem mudar a ficha.

## Modelos pessoais

**Criar modelo** usa o Power Builder para montar a composição, mesmo sem uma
ficha aberta. Depois, o editor permite definir nome, descrição e políticas de
graduação. **Editar composição** retorna ao Builder para configurar efeitos,
modificadores, descritores, notas, componentes vinculados e alternativos.

Cada componente tem uma política independente:

- **Fixo** mantém as graduações configuradas. É o padrão ao copiar uma composição,
  para preservar compras cuja função depende de um valor específico.
- **Escalável** começa em graduação 1 ao usar o modelo. O multiplicador indica
  quantas graduações do efeito correspondem a cada graduação escolhida. Zero
  permite compras de extras sobre um efeito existente, sem comprar o efeito-base.
- As opções avançadas permitem escalar graduações de modificadores, graduações
  afetadas e compras de sentidos, com coeficientes próprios. Aplicações repetidas
  do mesmo modificador são independentes. Compras não configuradas ficam fixas.
- Sentidos estruturados somam suas compras. Alterar essas compras no editor
  limpa seu escalonamento anterior; trocar um efeito reinicia sua política.

**Usar modelo** abre o mesmo popup de destino, sem exigir uma ficha aberta antes.
Não há seletor de personagem na tela principal da biblioteca. A aplicação cria
novas identidades para o poder, componentes, alternativos e
aplicações de modificadores. A ficha recebe apenas a composição, sem políticas
de autoria ou vínculo com o modelo. Editar, duplicar ou excluir um modelo não
altera poderes já usados. PP/EP usam o motor normal; poderes baseados em Força
consideram o personagem de destino e seus aprimoramentos comprados. Nenhum preço
manual é armazenado. A prévia principal usa um contexto neutro; o popup mostra
o custo para cada personagem, incluindo sua Força, e o Builder recalcula o
destino escolhido. Campos obrigatórios são revisados no Builder antes de salvar.

Os modelos também aparecem no ícone de biblioteca do Power Builder. Arrays e
configurações globais exigem o destino principal, seguindo a mesma regra do
catálogo. Aplicar modifica apenas o rascunho em edição.

### Persistência e backup

Os modelos usam a chave própria `mm3e-personal-power-library` no localStorage e
o formato JSON `mm3e-personal-power-library`, versão 1. Não há alteração de schema
nem migração das fichas existentes. O limite do arquivo é 10 MB e 1.000 modelos.

**Exportar modelos** e **Importar modelos** transferem a biblioteca separadamente.
Na importação, IDs existentes permitem manter os modelos locais, substituir
pelos importados ou importar novas cópias. Todo o arquivo é validado antes da
gravação. Dados ilegíveis não são substituídos; **Exportar dados originais**
permite preservar o conteúdo. Falhas de gravação e alterações em outra janela
mantêm os dados anteriores. Reabra um modelo após recarregar para editar sua
versão atual.

JSON de personagem e rascunhos JSONL/ZIP continuam com seus formatos anteriores
e **não incluem modelos**. Use a exportação da biblioteca para seu backup. Limpar
todos os dados do aplicativo ou os dados do site remove também os modelos locais.

## Biblioteca dentro do Builder

No Power Builder, clique no ícone de quatro quadrados no cabeçalho do efeito
base, componente vinculado ou efeito alternativo. Escolha um dos 39 capítulos,
ou busque pelo nome em português/inglês, sem precisar digitar acentos.

A biblioteca contém 982 receitas e variantes. A prévia permite escolher as
graduações variáveis, mantém as compras fixas do livro e pede escolhas que a
receita deixa em aberto. Os componentes podem ter graduações independentes.
Penetrante/Afeta Corpóreo declarados como compras integrais acompanham a
graduação escolhida; Compras fixas como Homing 2 continuam em 2.

O custo da prévia e do resultado usa o motor normal do aplicativo, incluindo
PP/EP e o contexto do Builder. Não existe preço de receita que substitua o
cálculo. Divergências entre a composição do livro e o total impresso aparecem
na prévia, com a composição e a justificativa da diferença.

**Aplicar poder** modifica apenas o rascunho do Builder. **Salvar** continua
sendo necessário para guardar o poder. Cancelar ou fechar a biblioteca mantém
o rascunho anterior. O nome existente é preservado, salvo quando vazio ou
quando o usuário escolhe usar o nome da receita. Notas existentes também são
preservadas, com a referência mecânica original acrescentada para condições,
gatilhos e restrições sem campo próprio.

Receitas de array e configurações globais, como Removível/Ativação, exigem o
destino principal; não podem ser inseridas parcialmente dentro de outro AE.
Substituir um componente preserva seus irmãos e os demais alternativos.

Sete entradas são **Apenas referência**: Ghost Form, Undead Form e Construct
Body exigem atributos ausentes do personagem; Friction Blindness, Friction
Muzzle, Blinding Aura e Fifth Wheel of Weyan exigem Aflição Sustentada não
representada pelo modelo atual. A aplicação é bloqueada para impedir carregar
uma receita incompleta. Invocações carregam o efeito, mas a criatura é criada
separadamente. Extras Aprimorados indicam a melhoria comprada sobre um atributo
existente; não modificam automaticamente outro poder da ficha.

Após aplicar, o poder é uma cópia independente no formato atual da ficha.
Nenhuma referência viva ao catálogo, preço editorial ou política de graduação
é gravada no JSON. Não há migração de fichas antigas nem alteração dos custos
anteriores. Cada capítulo é carregado sob demanda.

O Builder aceita aplicações independentes do mesmo extra/flaw. Ao adicioná-lo
novamente, aparece outra entrada, numerada quando houver repetição. Graduações,
graduações afetadas e opções são editadas separadamente; uma observação opcional
identifica a natureza/condição de cada aplicação. Remover uma mantém as demais.
Esse comportamento vale para componentes base, vinculados e alternativos,
inclusive no Builder de recursos. Os avisos existentes continuam presentes;
a escolha de combinação fica com o jogador/narrador e modificadores específicos
continuam limitados ao efeito ao qual pertencem.

`instanceId` é uma identidade opcional da aplicação, sem efeito nos custos.
Fichas antigas não precisam conter esse campo: ele é preparado no rascunho ao
abrir o editor e só é persistido ao salvar. Importação/exportação preservam
todas as aplicações, graduações e opções. Ativação e Removível continuam sendo
configurações globais do poder, com seus controles e cálculos próprios.

O aviso de modificadores duplicados lista todas as repetições do componente.
A preferência `enforceDuplicateModifiers` permite ocultar apenas esse diagnóstico;
não impede repetir compras nem oculta os outros avisos.

Os contratos de autoria e compatibilidade estão em
[Regras da biblioteca](power-library-rules.md). Limitações com trabalho aberto
estão em [Pendências](PENDENCIAS.md).
