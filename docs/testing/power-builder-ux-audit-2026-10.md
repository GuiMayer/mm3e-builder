# Auditoria de usabilidade do PowerBuilder — 01/10/2026

## Problemas corrigidos

- O arraste identificava modificadores apenas pelo ID. Agora leva a origem genérica ou específica e o efeito de origem, evitando trocar a definição e o preço quando dois catálogos compartilham um ID.
- A soltura usa os IDs do componente e do efeito alternativo em metadados. Só aceita destinos com efeito escolhido e definição compatível; soltar fora de uma área não altera o poder.
- As áreas reais de modificadores recebem destaque de compatibilidade e confirmação visual do destino. O efeito alternativo inteiro deixou de funcionar como alvo invisível.
- A alça de arraste ficou separada dos botões de detalhes e adição. O teclado usa Espaço/Enter para pegar/soltar, setas para navegar entre destinos e Escape para cancelar, com anúncios traduzidos.
- Cancelar limpa o item de prévia e mantém o editor aberto. O editor, os detalhes e a paleta móvel compartilham contenção/restauração de foco e bloqueio de rolagem para diálogos empilhados.
- A paleta mostra nomes completos, custo na linha seguinte, destino selecionado e busca sem resultados. Os controles móveis têm pelo menos 44 px; a adição por toque usa o botão +, preservando a rolagem da lista.
- O painel móvel inicia fechado em cada editor. A antiga altura persistida podia renderizar um painel visível com aria-hidden=true, cobrindo controles. Ele agora abre expandido, e sua alça também aceita teclado.
- O botão móvel da paleta fica no rodapé, sem flutuar sobre campos. O rodapé pode rolar quando acumula avisos; corpo e área de trabalho preservam espaço para rolagem em telas baixas.
- A seleção de modificadores de um efeito alternativo oferece somente os genéricos e os específicos daquele efeito, identificando as versões específicas.

## Otimizações

- Um único bloco de estilos substitui a repetição do mesmo CSS em cada item da paleta (37 blocos removidos na aba padrão).
- Apenas a paleta da largura atual é montada. A paleta móvel fechada não mantém itens de arraste ocultos ou registros duplicados.
- A precificação mantém um cache por editor sobre os campos que alteram custos. Nome, notas e descritores reutilizam o resultado; mudanças em componentes, alternativos, ativação, remoção ou dados de regras recalculam.
- Custos dos alternativos e validação de PL são memorizados. Callbacks estáveis e itens memorizados reduzem trabalho durante mudanças de estado da tela.

## Validação

- `npm test -- --run`: **697 testes aprovados em 48 arquivos**, incluindo 12 regressões novas para origem do modificador, IDs de alternativos, destinos inválidos, navegação por setas e cache de preços.
- `npm run lint`, `npm run build` e `npm run build:verify` aprovados; 13 referências a arquivos estáticos verificadas.
- No navegador: arraste por mouse, repetição de Accurate, soltura fora do alvo, adição por teclado, cancelamento, detalhes sem arraste acidental e aplicação de Sustained específico somente ao alternativo Protection.
- No fluxo móvel: adicionar com +, redimensionar por setas/Enter, fechar/reabrir, Tab reverso contido na paleta e retorno de foco ao editor e ao botão de abertura.
- Sem rolagem horizontal no documento ou na área de trabalho em 320×640, 390×844, 480×800, 768×800, 769×800, 960×800, 1280×800, 1920×1080 e 960×360. Rodapé permaneceu dentro da altura disponível.
- Paleta aberta verificada em 320 e 390 px, sem transbordamento horizontal. Nenhuma paleta montada no celular quando fechada; uma paleta montada no desktop ou quando aberta no celular.
- Após recarga limpa, nenhum erro/aviso de console no fluxo final de teclado, cancelamento, detalhes, adição móvel e fechamento. Rascunhos de teste foram descartados sem salvar poderes.

## Limites da verificação

A validação móvel usou dimensões de navegador e os controles de adição. Gestos físicos em um aparelho com tela de toque, feedback háptico, leitores de tela e medições de FPS/tempo de interação precisam de verificação específica. As otimizações acima eliminam trabalho redundante identificado no código; não representam um ganho percentual medido.
