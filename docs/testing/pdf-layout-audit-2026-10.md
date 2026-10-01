# Auditoria de layout HTML → PDF

Data: 01/10/2026. Base: commit `03a74dd`, branch `main`.

## Conclusão

O desperdício principal vem da organização vertical e da paginação por seções inteiras. O modo compacto apenas reduz espaçamentos; não corrige a distribuição do conteúdo. A recomendação é uma ficha de consulta com cabeçalho curto, números essenciais em faixas, tabelas compactas e detalhes em continuação. Primeiro corrigir visibilidade, completude e paginação; depois aplicar o novo desenho.

Esta auditoria não modifica código de produção, cálculos, armazenamento, migrações nem personagens existentes. A amostra é fictícia, criada em memória, sem acesso aos stores. Nenhum resultado constitui uma validação da legalidade do personagem pelas regras.

## Evidência da exportação atual

Usei `generateCharacterPDF` e `convertHtmlToPdf` reais, com o mesmo personagem fictício nos dois modos, fonte média e tema padrão. Conteúdo: identidade e descrição física preenchidas, 12 perícias, 8 vantagens, 7 poderes, 1 efeito alternativo com Área, equipamento em texto, 3 complicações e um parágrafo de notas.

Os dois modos geraram **4 páginas A4**. Todas as oito páginas foram inspecionadas visualmente após renderização. Os arquivos de evidência estão em `output/pdf/`, junto de `audit-metrics.json` e `audit-contact-sheet.png`.

| Modo | Página | Conteúdo dominante | Altura útil restante abaixo do último texto |
| --- | --- | --- | --- |
| Normal | 1 | Identificação, atributos e defesas | 13,1 mm |
| Normal | 2 | Ataques, perícias e vantagens | 131,9 mm, cerca de 48% |
| Normal | 3 | Poderes e equipamento | 0,9 mm |
| Normal | 4 | Complicações e notas | 203,0 mm, cerca de 73% |
| Compacto | 1 | Identificação, atributos, defesas e ataques | 17,5 mm |
| Compacto | 2 | Perícias e vantagens | 196,7 mm, cerca de 71% |
| Compacto | 3 | Poderes, equipamento e complicações | 23,2 mm |
| Compacto | 4 | Apenas notas | 251,5 mm, cerca de 91% |

Métrica: distância vertical entre o limite inferior do último caractere e o limite inferior útil da página, com margem de 10 mm; altura útil de 277 mm. Não representa área de tinta nem soma de todos os espaços internos. A amostra comprova o comportamento atual, não uma taxa universal para todas as fichas.

## Problemas confirmados

1. **Seções inteiras são empurradas para a próxima página.** Em `src/services/pdf/pdfPagination.ts:185`, uma seção que cabe em uma página é mantida inteira, mesmo quando várias linhas poderiam aproveitar o espaço disponível na página anterior. Os poderes desta amostra ficam juntos e deixam a página 2 quase vazia. Unidades internas só são usadas quando a seção inteira excede a altura de uma página. Uma unidade maior que a página também não tem uma divisão semântica própria.
2. **Prévia diferente da exportação.** `PDFPreviewDialog.tsx:235` apresenta um iframe com o HTML contínuo. As quebras e os espaços inseridos pelo paginador aparecem somente na conversão. A prévia deve mostrar as mesmas páginas que serão exportadas.
3. **Cabeçalho ocupa muito espaço.** Identificação, dois indicadores, cinco linhas de custos, descrição física e informações adicionais aparecem empilhados. `pdfGenerator.ts:459` reserva quatro colunas para apenas dois indicadores. Atributos usam duas linhas de quatro cartões e repetem o mesmo rank como número e bônus.
4. **Grupo, série e mestre ficam invisíveis.** A função `renderAdditionalInfo` reutiliza `.header-field` fora do fundo azul. Essa classe define texto branco em `pdfGenerator.ts:500`. Os valores existem no HTML e no texto extraído do PDF, mas ficam brancos sobre branco na página. Portanto não são dados perdidos no personagem; é uma falha de apresentação.
5. **Informação de efeitos alternativos incompleta.** `PowersSection.ts:77` monta nome, efeitos, indicação dinâmica e notas, mas não chama o formatador de modificadores para os componentes alternativos. O efeito alternativo da amostra tem Área/Burst; sua descrição não mostra esse modificador, embora a tabela de ataques indique `area`. É preciso preservar modificadores e opções por componente, inclusive em poderes vinculados.
6. **Fonte e escala não correspondem à prévia.** O conversor usa A4, largura de 816 px e escala fixa de 0,23. O PDF desta amostra usa Helvetica, Helvetica-Bold e Helvetica-Oblique, apesar de a personalização selecionar Segoe UI. Há textos de aproximadamente 5,98 pt. Alguns espaços ficam visualmente comprimidos, como em nomes de efeitos. O problema pede fonte incorporada e escala coerente, não reduzir ainda mais o tamanho.
7. **Margens duplicadas e configurações dispersas.** Além da margem externa de 10 mm, o container tem padding de 0,3 in no CSS usado em tela. `--page-padding` é alterado pelo modo compacto, mas não controla esse padding. Há outras declarações para impressão e configurações Letter em arquivos auxiliares. A geometria precisa ter uma única origem.
8. **Cartões de poderes repetem separadores e intervalos.** Descritores, alternativos, ativação e notas usam blocos com margem, padding e borda próprios. É possível manter todos esses dados em linhas menores, com separação apenas entre poderes.
9. **Exportação sem localização completa.** O gerador declara `lang="en"`, títulos em inglês e recebe definições brutas no hook. A aplicação traduzida não implica PDF traduzido. O idioma da exportação deve controlar títulos, termos, opções e ordenação dos nomes exibidos.
10. **Arquitetura duplicada.** O fluxo ativo usa o CSS inline de `pdfGenerator.ts`. `templateRenderer.ts` ainda contém uma estrutura placeholder e carrega outra coleção de estilos. Alterar somente esses estilos auxiliares não redesenha o PDF ativo.

## Referências profissionais pesquisadas

As observações abaixo são convenções inferidas dos exemplos, não uma norma universal de fichas de RPG.

- [Ficha oficial de Mutants & Masterminds 3e, Green Ronin](https://freeronin.com/3e_files/MnM3_charsheet_bw.pdf): identificação compacta, atributos agrupados, defesa ao lado de ataque e espaços claramente delimitados. As duas primeiras páginas contêm a ficha; a terceira é referência de ações. Adotar a hierarquia e a proximidade de informações; os grandes espaços para escrita manual não são necessários numa ficha preenchida automaticamente.
- [Ficha oficial D&D 2024](https://media.dndbeyond.com/compendium-images/free-rules/downloads/2024-character-sheet.pdf): blocos paralelos, valores usados no jogo destacados e ataques organizados em tabela. O desenho ornamentado é específico do produto; o agrupamento funcional é a parte útil para este projeto.
- [Paizo: fichas oficiais de Pathfinder 2e](https://cdn.paizo.com/blog/pathfinder-second-edition-character-sheets): oferece versões colorida e econômica para impressão, além de folhas expandidas. Isso apoia disponibilizar uma versão com pouca tinta e detalhes em páginas adicionais. Esta referência foi consultada como publicação oficial; não foi usada para medir o PDF de Pathfinder.

## Desenho recomendado

**Página principal, voltada ao uso durante a sessão:**

- Cabeçalho de cerca de 25–35 mm com nome, jogador, identidade, NP, pontos heroicos e orçamento de PP. Descrição física e campanha em uma ou duas linhas menores, sem cartões individuais.
- Uma faixa de oito atributos e outra de defesas/iniciativa, cada número principal exibido uma vez. Manter decomposições numéricas disponíveis em linhas secundárias ou na continuação.
- Tabela de ataques: nome, bônus, alcance, efeito, resistência/CD e observações. Alinhar números; usar rótulos legíveis em vez de identificadores internos.
- Perícias e vantagens lado a lado quando couberem. Perícias em tabela com total, ranks e outros bônus; vantagens em lista compacta com ranks e especialidades.
- Poderes em entradas de poucas linhas: nome e custo; efeitos e modificadores associados; descritores, ativação e notas. Alternativos indentados e completos. Usar a largura total para entradas longas, sem comprimir arbitrariamente todo poder em uma coluna estreita.

**Continuação:** detalhes extensos de poderes, dispositivos/recursos, complicações e história. O conteúdo deve fluir quando houver espaço, sem obrigar cada categoria a começar uma página. Repetir nome do personagem, número da página e título de seção quando necessário. Evitar páginas reservadas vazias e blocos “nenhum ...” quando a opção de ocultar seções vazias estiver ativa.

Visual: fundo branco, uma cor de destaque opcional, bordas finas, faixas suaves em tabelas e números alinhados. Corpo impresso de aproximadamente 9–10 pt; legendas menores apenas quando continuarem legíveis. Esses tamanhos são uma recomendação de projeto, a validar por impressão em escala real.

Meta para **esta amostra**: duas páginas completas, preservando a informação. É uma meta de aceitação do redesenho, ainda não um ganho demonstrado. Fichas com muitas matrizes e textos longos devem continuar em páginas adicionais.

## Ordem de implementação

| Prioridade | Trabalho | Resultado verificável |
| --- | --- | --- |
| 1 | Corrigir contraste e exportar modificadores dos alternativos | Campos visíveis e todas as propriedades exportadas |
| 2 | Paginar por linhas e unidades semânticas, permitindo divisão controlada de poderes longos | Reaproveitar o fim das páginas sem separar título da primeira linha |
| 3 | Centralizar papel, margem, escala e fonte incorporada | Medição e PDF usam as mesmas métricas, com texto selecionável |
| 4 | Redesenhar cabeçalho, faixas e tabelas | Amostra em duas páginas sem esconder dados nem diminuir indiscriminadamente a fonte |
| 5 | Prévia das páginas finais, idioma e versão econômica | Prévia corresponde ao arquivo exportado e aos termos da interface |

### Escolha do renderizador

Não é necessário trocar a biblioteca antes de corrigir as falhas acima. A documentação do [jsPDF HTML](https://parallax.github.io/jsPDF/docs/module-html.html) informa que `autoPaging: 'text'` funciona melhor com texto predominantemente em uma coluna; também explica que `width` não controla a escala quando `html2canvas.scale` está definido e que `fontFaces` evita a resolução antiga de fontes.

Por isso, o redesenho com colunas não deve depender apenas do autopaginador atual. Recomendo planejar páginas explicitamente, com uma responsabilidade única por quebras, e validar cada página no conversor existente. Se a fidelidade de CSS continuar insuficiente, comparar um protótipo com impressão nativa do navegador. Esta preserva o fluxo de impressão do usuário; geração direta com jsPDF/pdf-lib exigiria implementar medição, fontes e desenho das tabelas. Não transformar toda a ficha em uma imagem, pois isso prejudicaria seleção e pesquisa de texto.

### Validação antes de liberar

Comparar os valores exibidos com os cálculos canônicos, sem alterar suas funções. Exercitar ficha mínima, esta amostra, muitos poderes/alternativos, poderes vinculados, texto longo, recursos, campanha, habilidades ausentes, caracteres acentuados e os idiomas disponíveis. Conferir todas as páginas: sem cortes ou sobreposições, cabeçalhos de continuação, modificadores completos e fonte legível. Verificar que exportar não modifica o objeto do personagem nem aciona gravações. Testar a paginação com casos de limite reais, sem repetir testes puramente cosméticos.

## Limites desta auditoria

A renderização foi verificada no navegador local de inspeção e pelo arquivo PDF resultante. A amostra não representa todos os personagens e não inclui todos os recursos estruturados. Não foi implementado o redesenho nem medido seu ganho. Não houve alteração em arquivos de `src/`, fichas existentes ou commits durante esta etapa.
