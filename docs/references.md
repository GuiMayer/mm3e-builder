# Referências

A aba reúne 16 painéis de consulta sem editar o personagem. A entrada
“Durante o jogo” mostra medidas, turno, dano e graus de teste. As outras
categorias separam medidas/tamanho, combate, condições, testes/características
e recursos heroicos. “Todos os assuntos” começa com os painéis recolhidos.

A busca consulta todos os assuntos nas categorias regulares; em Favoritos,
consulta apenas as seções marcadas. Aceita
nomes e descrições em português ou inglês, ignora acentos e exige todas as
palavras digitadas. Expandir/recolher resultados conserva a busca. Cada painel
indica as páginas **impressas** do livro, não as linhas do Markdown.

## Favoritos

Cada seção tem uma estrela no cabeçalho, à direita das páginas do livro.
A estrela contornada adiciona a seção aos favoritos; a preenchida a remove.
Esse botão é independente de expandir/recolher o painel e oferece rótulo
traduzido, estado pressionado, foco visível e área de toque de 44 px.

A categoria “Favoritos” aparece como primeira opção somente quando existe
pelo menos uma seção marcada. Reutiliza as tabelas e calculadoras das outras
categorias, na ordem do catálogo; ao selecioná-la, os painéis começam abertos.
Adicionar um favorito não muda a categoria atual. A abertura inicial da tela
continua em “Durante o jogo”, mesmo quando existem favoritos.

Na categoria Favoritos, o campo e a contagem identificam a busca restrita;
uma busca sem correspondências não esconde a categoria. Remover uma seção
retira seu painel imediatamente e mantém o foco na navegação. Ao remover o
último favorito nessa categoria, a tela retorna a “Durante o jogo”, limpa a
busca e posiciona o foco nessa opção; a categoria Favoritos desaparece.

A preferência é global para o navegador, independente do personagem e do
idioma. A chave `mm3e-reference-favorites` contém
`{"version":1,"sectionIds":["turn","damage"]}`. A leitura valida o formato,
elimina duplicatas e ignora IDs desconhecidos. Se o armazenamento estiver
bloqueado, os favoritos continuam disponíveis em memória ao navegar pelo
aplicativo durante a sessão, mas não são garantidos após recarregar a página.

## Tabelas e consultas

| Conteúdo | Fonte no Deluxe Hero’s Handbook |
|---|---|
| Medidas imperiais e métricas, graduações −5 a 30 | 10–11, 347 |
| Modificadores por graduação de tamanho | 347 |
| Turno e iniciativa | 235–237 |
| Ações de combate | 246–248 |
| Manobras de combate | 249–251 |
| Resistência a dano e matriz de dano | 241, 243–244, 346 |
| Ataques, críticos, alcance, cobertura e camuflagem | 240–246 |
| Condições básicas e combinadas | 17–19 |
| Graus, testes rotineiros/opostos e ajuda em equipe | 12–16 |
| Exemplos de dificuldades | 13 |
| Limites de NP | 24–25 |
| Resistência de materiais | 244 |
| Parâmetros de habilidades | 107 |
| Pontos heroicos e esforço extra | 19–21 |

As tabelas métrica e imperial foram transcritas separadamente: os valores
oficiais são escalas arredondadas de jogo, não conversões físicas exatas.
Selecionar uma graduação mostra massa, tempo, distância e volume; clicar numa
linha seleciona essa graduação. O campo aceita graduações inteiras sem limite
máximo de jogo: acima de 30, dobra cada medida a cada graduação; abaixo de −5,
reduz cada medida à metade. O resumo identifica a extrapolação e mantém as
unidades do extremo correspondente. Números extremos usam notação científica
para evitar infinito ou zero por limites numéricos. Os valores −5 a 30
permanecem os arredondamentos publicados, e a tabela não cresce indefinidamente.
O campo usa inteiros representáveis com precisão pelo JavaScript.
Para valores intermediários, consulte a próxima
medida maior. Tamanho humano corresponde à graduação −2 de **tamanho**, não à
graduação de Crescimento/Encolhimento. O toggle Métrico/Imperial aparece nos
dois painéis e compartilha a seleção. A escolha é salva em
`mm3e-reference-measurement-system` e restaurada ao reabrir a aba ou o app.
Na primeira abertura, sem preferência salva, o padrão é métrico em português
e imperial em inglês. Essa escolha inicial já é salva, mesmo sem clicar no
toggle; mudar o idioma depois não a substitui. As próximas escolhas no toggle
atualizam a preferência normalmente.
Se o navegador bloquear a gravação, o toggle continua funcionando na sessão.
O campo de graduação aceita o sinal `-` e o campo vazio durante a digitação,
sem substituir o último resultado válido; ao sair do campo, normaliza o texto.
Setas do teclado e botões aumentam/diminuem uma graduação. Na tabela de tamanho,
a opção métrica converte pés/polegadas para metros/centímetros (1 pé = 0,3048 m),
arredondando para duas casas decimais; os modificadores não mudam. Essa
conversão de altura é distinta da escala métrica arredondada de Medidas.

As consultas de graus recebem o **total final** do teste, incluindo penalidades.
O cálculo de dano usa CD 15 + graduação, com falhas de 1–5, 6–10, 11–15 e
16+ pontos. A matriz reproduz totais 1–35 versus Dano 1–20; números e rótulos
explicam os resultados além das cores. A graduação de dano pode ser −5 a 100;
o total pode ser −100 a 200. A consulta geral aceita CD −100 a 100.
Esses campos não rolam dados nem aplicam condições; resultados anteriores,
recuperação e exceções de poderes continuam relevantes.

No celular, resumos viram blocos com rótulos. Tabelas de medidas/matriz mantêm
rolagem própria e cabeçalhos fixos, com acesso por teclado. A matriz só é
montada ao expandi-la. A interface usa as cores semânticas do tema atual.

## Fontes e critérios de consulta

A fonte normativa foi o arquivo fornecido
[`Mutants & Masterminds 3 - Heros Handbook Deluxe.md`](sources/Mutants%20%26%20Masterminds%203%20-%20Heros%20Handbook%20Deluxe.md).
Os novos resumos são paráfrases de consulta, não uma reprodução integral do
livro. Os dados de condições existentes são reutilizados; nomes em inglês junto
à tradução distinguem termos que compartilham rótulos no catálogo português.

Os resumos seguem as regras das páginas indicadas. Exemplos: Aid concede +5 com **três** graus; Defend soma 10 ao dado quando ele
mostra 10 ou menos; Team Attack soma graus dos **outros** acertos. Teste em
equipe e ataque em equipe têm procedimentos diferentes. Recover conserva a
classificação de ação padrão do livro, mas exige o turno inteiro no resumo.
O desempate de iniciativa segue Dodge → Agility → Awareness da regra na p. 235;
o exemplo de combate na p. 241 usa uma ordem diferente e não foi adotado.

Referências de design consultadas:

- [GM’s Kit Revised Edition oficial](https://greenroninstore.com/products/mutants-masterminds-gamemaster-s-kit-revised-edition): escudo de três painéis, quatro cartões de consulta e rastreador de combate.
- [Apresentação dos kits pela editora](https://greenronin.com/blog/2015/11/02/ronin-round-table-game-masters-kits-are-coming/): acesso rápido a regras durante o jogo.
- [Anúncio oficial da edição revisada](https://greenronin.com/blog/2016/02/08/mm-gms-kit-revised-edition-mm-deluxe-heros-handbook-and-rogues-gallery-tun/).

Categorias, busca e painéis recolhíveis são nossa adaptação digital desse
princípio de consulta rápida. A pesquisa cobriu as descrições públicas da
editora, sem acesso ao interior do PDF comercial do escudo.

## Compatibilidade

O catálogo, as tabelas e os campos de consulta pertencem a
`features/references`. Não dependem dos stores de fichas/recursos e não alteram exportações,
histórico, custos ou avisos. As preferências de unidades e favoritos são gravadas
em chaves próprias do localStorage, fora dos dados do personagem.
O schema atual de personagem é 2.3.0, biblioteca/apêndice de recursos usam
versão 2 e rascunho usa versão 1. A consulta não exige migração ou alteração
da revisão de cálculo.
A rotina preventiva de backup já existente continua seguindo a versão do app.
