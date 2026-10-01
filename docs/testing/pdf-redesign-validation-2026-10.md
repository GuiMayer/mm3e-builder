# Validação do redesenho de PDF — 01/10/2026

Complementa a [auditoria anterior](pdf-layout-audit-2026-10.md). Os resultados abaixo foram medidos depois da implementação, com personagens fictícios e os geradores de produção.

## Resultado

| Caso | Antes | Depois |
| --- | --- | --- |
| Amostra da auditoria, normal | 4 páginas | 2 páginas |
| Mesmo conteúdo, compacto | 4 páginas | 2 páginas |
| Ficha mínima | Não medido | 1 página |
| Amostra com Noto Serif e tema econômico | Não medido | 2 páginas |
| Ficha extensa | Não medido | 10 páginas |

A amostra possui 12 perícias, 8 vantagens, 7 poderes, 1 efeito alternativo, 3 complicações, equipamento textual e notas. A redução de 50% se refere a essa amostra; a quantidade de páginas depende do conteúdo de cada personagem.

O caso extenso acrescenta 9 poderes, 10 alternativos dinâmicos, um dispositivo, equipamento legado, veículo e quartel-general compartilhado/gratuito, 24 ataques manuais, 35 especialidades e 25 vantagens com subtipo. Inclui notas de poder com 110 repetições de uma frase, história com 140 repetições e uma sequência sem espaços de 900 caracteres. As notas completas foram comparadas após a paginação, além de marcadores de início/fim e dos últimos itens de cada lista.

## Mudanças verificadas

- Cabeçalho curto, atributos/defesas em faixas, perícias e vantagens em duas colunas, ataques em tabela e poderes em blocos compactos.
- Páginas A4 com margem de 10 mm, títulos de continuação, cabeçalhos de tabela repetidos e espaço reservado para o rodapé.
- Fragmentação de textos extensos sem truncamento; identificação do poder repetida nas continuações.
- Efeitos alternativos com componentes, modificadores, parâmetros e notas completos; os modificadores permanecem associados ao respectivo componente vinculado.
- Noto Sans/Serif incorporadas ao PDF. O HTML baixado também incorpora as fontes, para uso offline. O menor tamanho extraído foi aproximadamente 7,94 pt por arredondamento do conversor, para estilos declarados em 8 pt; texto principal em 10 pt.
- Rótulos em português/inglês e nomes traduzidos pelo catálogo. Nomes, descritores e textos escritos pelo usuário não são traduzidos. Definições sem tradução usam o nome original.
- Tema econômico e opção de ocultar listas vazias.
- Prévia do próprio arquivo exportado via [PDF.js](https://mozilla.github.io/pdf.js/examples/), com navegação e zoom. Somente uma página é rasterizada por vez na prévia; o PDF exportado conserva o texto pesquisável.
- PDF em cache para a ação de abrir/exportar; gerações antigas não substituem a seleção mais recente. Renderizações são serializadas para evitar mistura de estilos.

Todas as páginas dos PDFs normal, compacto, serifado, mínimo e extenso foram renderizadas com Poppler e inspecionadas. Foram conferidos os marcadores no texto extraído do PDF extenso. A medição das páginas permaneceu dentro do orçamento de altura, com tolerância de 0,5 px.

A janela de prévia foi exercitada em 1280, 960 e 375 px: navegação entre páginas, zoom, gaveta de personalização, alterações rápidas de fonte/tema/layout e preparação de HTML offline. Em 375 px, a largura do documento e sua largura de rolagem eram ambas 375 px; o zoom usa rolagem interna.

## Preservação das fichas

Estes commits de PDF não alteram entidades de personagem, schemas, migrações, catálogos de regras, stores ou as funções canônicas de cálculo. A exportação faz cópias apenas dos campos de apresentação do catálogo. Os testes comparam os objetos de entrada antes/depois, incluindo recursos no caso de navegador. Nenhuma ficha existente foi aberta ou gravada durante a validação visual. As preferências de exportação continuam no armazenamento separado de personalização de PDF.

Essa afirmação se refere ao redesenho do PDF. O commit anterior `a4b788b`, de regras, faz parte de uma etapa distinta e não é reavaliado como simples alteração visual aqui.

## Reproduzir

1. Iniciar o projeto com `npm run dev`.
2. Abrir `/scripts/fixtures/pdf-layout-check.html` no endereço local informado pelo servidor.
3. Executar um caso por vez: normal, compacto, mínimo, serifado ou conteúdo longo. Os dados são sintéticos, sem acesso aos stores de personagens.
4. Conferir as métricas e usar o link para baixar o PDF. O caso extenso falha se faltar texto completo, marcador, espaço de página ou se os objetos de entrada forem modificados.
5. Inspecionar todas as páginas baixadas.

## Verificações automatizadas

- `npm run test -- --run`: 703 testes em 49 arquivos passaram.
- `npm run lint`: passou.
- `npm run build`: passou, incluindo o worker do visualizador e as fontes.
- `npm run build:verify`: 13 referências estáticas verificadas.

Os arquivos gerados e capturas ficam em `output/pdf/`, ignorado pelo Git. O exportador legado continua disponível e não recebeu este redesenho.
