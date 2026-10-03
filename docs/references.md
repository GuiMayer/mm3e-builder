# Referências — v1.19.0

A aba reúne 16 painéis de consulta sem editar o personagem. A entrada
“Durante o jogo” mostra medidas, turno, dano e graus de teste. As outras
categorias separam medidas/tamanho, combate, condições, testes/características
e recursos heroicos. “Todos os assuntos” começa com os painéis recolhidos.

A busca consulta todos os assuntos, independentemente da categoria. Aceita
nomes e descrições em português ou inglês, ignora acentos e exige todas as
palavras digitadas. Expandir/recolher resultados conserva a busca. Cada painel
indica as páginas **impressas** do livro, não as linhas do Markdown.

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
linha seleciona essa graduação. Para valores intermediários, consulte a próxima
medida maior. Tamanho humano corresponde à graduação −2 de **tamanho**, não à
graduação de Crescimento/Encolhimento; suas dimensões conservam as unidades
imperiais do apêndice, com indicação explícita.

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

## Auditoria e pesquisa de interface

A fonte normativa foi o arquivo fornecido
[`Mutants & Masterminds 3 - Heros Handbook Deluxe.md`](sources/Mutants%20%26%20Masterminds%203%20-%20Heros%20Handbook%20Deluxe.md).
Os novos resumos são paráfrases de consulta, não uma reprodução integral do
livro. Os dados de condições existentes são reutilizados; nomes em inglês junto
à tradução distinguem termos que compartilham rótulos no catálogo português.

Os resumos anteriores de Aid, Aim, Defend, Disarm, Escape, Grab, Recover, Trip,
Slam e Team Attack foram corrigidos ou substituídos conforme as páginas acima.
Exemplos: Aid concede +5 com **três** graus; Defend soma 10 ao dado quando ele
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
`features/references`. Não dependem dos stores de fichas/recursos, não gravam
no localStorage e não alteram exportações, histórico, custos ou avisos.
Schema de personagem 2.1.0, biblioteca/apêndice de recursos 2, rascunho 1 e
revisão de cálculo 6 permanecem iguais. Não há migração nesta atualização.
A rotina preventiva de backup já existente continua seguindo a versão do app.
