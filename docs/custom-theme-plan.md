# Plano: tema personalizado da interface

Data: 2026-10-02. Estado: implementado em cinco steps. O comportamento entregue
está documentado em [Temas personalizados](./custom-themes.md). O seletor usa
o nome **Tema personalizado** e mostra essa opção somente após salvar uma
paleta válida, preservando os quatro temas padrão.

## Objetivo e comportamento

Adicionar um botão quadrado ao lado da seleção de temas em Configurações,
inclusive no menu móvel. O botão abre um editor para criar ou modificar um
único tema personalizado, persistido no navegador. Cada papel de cor da
interface pode ser alterado, incluindo estados e transparências relevantes.

O seletor continua oferecendo os quatro temas existentes. Após o primeiro
salvamento, passa a oferecer também **Personalizado**. Trocar para um tema
pronto preserva a paleta personalizada para uso posterior.

## Leitura do sistema atual

- `src/app/theme.css` define Dark Knight, Arc Reactor, Cyberpunk e Light Print
  com variáveis CSS semânticas. Existem 20 variáveis `--c-*` definidas: 18
  papéis de cor e duas representações RGB auxiliares.
- `src/shared/ui/ThemeSelector.tsx` já é compartilhado por MenuBar e
  MobileDrawer, portanto o novo botão pode ter uma implementação única.
- `src/store/appStore.ts` persiste a seleção na chave
  `mm3e-app-preferences`; as fichas usam armazenamento separado.
- A aplicação do tema está repetida em `App.tsx`, `setTheme` e no hook
  `useTheme`, que atualmente não tem consumidores. Deve existir um único
  responsável pela aplicação da paleta ao documento.
- Há cores fixas em condições, categorias de vantagens, badges e estados do
  PowerBuilder. Há também preto fixo no fundo dos modais e nas sombras.
  Apenas editar as variáveis atuais deixaria partes da página sem personalização.
- Algumas ações usam o fundo da página como cor do texto sobre um botão;
  outras usam texto inverso. O tema customizado precisa tratar o contraste
  entre conteúdo e preenchimento como um par explícito.
- A ação existente **Limpar todos os dados locais** informa que remove também
  preferências e executa `localStorage.clear()`. Ela continuará removendo o
  tema, conforme seu escopo atual. Restaurar cores no editor terá outro escopo:
  altera somente o rascunho da paleta.

## Base de design

O [Material Web](https://material-web.dev/theming/color/) organiza temas por
papéis de cor, aplicados por variáveis CSS, incluindo cores de conteúdo sobre
superfícies. Adotar esse princípio aproveita o sistema existente sem instalar
Material UI nem criar um gerador de paletas que substitua escolhas do usuário.

Usar avisos de contraste com os parâmetros de referência da WCAG: 4,5:1 para
texto normal e 3:1 para texto grande. Ícones e pistas visuais necessárias para
identificar controles/estados têm referência de 3:1 contra cores adjacentes.
Esses números orientam o editor; não representam uma certificação automática
da página. Fontes: [contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
e [contraste de componentes](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

O [seletor de cor nativo](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color)
serve como controle principal. Um campo hexadecimal complementa o seletor
para permitir digitação e colagem. Cor e opacidade são armazenadas
separadamente, evitando depender do suporte a seletores nativos com alpha.

O [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
mantém dados entre sessões no mesmo navegador/origem, mas pode estar bloqueado.
O [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem)
também pode falhar por falta de espaço. A aplicação precisa tratar essas falhas
e informar corretamente se o tema foi salvo.

## Fluxo do editor

1. Botão quadrado com ícone de paleta, nome acessível **Personalizar tema**,
   tooltip e alvo de toque de 44 px. Fica à direita do seletor sem estourar
   a largura das configurações.
2. Abrir um diálogo próprio, montado fora do conteúdo descartável do menu.
   No celular, fechar o menu ao abri-lo, evitando dois elementos modais ativos.
3. Se já existir um tema personalizado, abrir sua paleta. Caso contrário,
   inicializar com uma cópia exata do tema selecionado. Oferecer **Usar como
   base** para copiar qualquer um dos quatro temas prontos para o rascunho.
4. Apresentar grupos de cores recolhíveis, cada linha com nome simples,
   amostra, seletor e hexadecimal. Opacidade de 0 a 100% aparece apenas nos
   papéis transparentes. Cada cor pode voltar ao valor do tema base.
5. Mostrar uma prévia isolada com fundo, cartão, campo, botão, foco, textos,
   badges e mensagens de estado. A prévia muda imediatamente; os controles
   do editor conservam uma paleta legível e independente do rascunho.
6. **Salvar e aplicar** valida, grava a paleta e ativa Personalizado. Não
   escrever no armazenamento a cada movimento do seletor de cor.
7. **Cancelar**, X ou Escape descartam o rascunho sem mudar o tema ativo.
   **Restaurar cores da base** muda somente o rascunho; exige Salvar e aplicar
   para persistir. Não apaga fichas, preferências ou a paleta já salva.
8. Na próxima abertura do aplicativo, restaurar a seleção e a paleta válidas.

## Cores editáveis e cobertura

| Grupo | Papéis existentes |
| --- | --- |
| Destaques | Principal, principal ao passar o mouse, principal suave, destaque secundário |
| Fundos | Página, superfície/cartões, superfície elevada, superfície translúcida |
| Textos | Principal, secundário, discreto, inverso |
| Bordas | Normal, ativa |
| Estados | Sucesso, aviso, erro, informação |

Esses grupos cobrem os 18 papéis existentes. Completar o inventário com cores
fixas da interface antes de fechar o catálogo: incluir cor da sobreposição de
modais e cor das sombras no grupo recolhível **Efeitos**, além de conteúdo sobre
ações preenchidas quando não houver um papel equivalente apropriado.

Estados suaves de sucesso/aviso/erro/informação derivam das cores escolhidas,
com opacidades consistentes. Gradientes e brilhos usam seus papéis existentes.
As variáveis RGB são calculadas, não editadas como cores duplicadas. Se houver
um tom visual independente sem equivalente semântico, adicioná-lo ao catálogo
editável; documentar o mapeamento em vez de conservar uma cor fixa silenciosa.

Converter cores fixas apenas na interface do aplicativo. As cores de documentos
exportados e de seu preview pertencem ao sistema de personalização do PDF e
permanecem independentes deste tema. Não mudar mensagens de validação nem regras.

## Aplicação, dados e persistência

- Criar um catálogo tipado de papéis, seus grupos, valores padrão e limites.
  Centralizar as paletas dos temas prontos para evitar duas cópias divergentes
  entre o CSS e a inicialização do editor; manter seus valores atuais.
- Usar um modelo versionado, por exemplo `{ version: 1, baseTheme, colors }`,
  com valores `{ hex, alpha }` normalizados. Permitir alpha apenas nos papéis
  aplicáveis. Aceitar hexadecimal curto/longo na digitação e salvar `#RRGGBB`.
- Guardar a paleta em chave própria, por exemplo `mm3e-custom-theme-v1`.
  Manter a seleção ativa no campo existente `theme`, acrescentando `custom`.
  A paleta fica independente de fichas, recursos e histórico de edição.
- Salvar primeiro a paleta validada, depois ativar/persistir a seleção. Tratar
  falhas em qualquer gravação: nunca mostrar sucesso completo se a persistência
  falhou. Uma paleta gravada continua recuperável mesmo que a seleção não seja
  gravada; informar a limitação e manter acesso ao rascunho.
- Na leitura, validar JSON, versão, identificador da base, papéis permitidos,
  valores e opacidades. Campos faltantes recuperam os padrões da base. Uma
  estrutura inválida ou versão desconhecida usa um tema pronto de fallback,
  sem limpar o restante do armazenamento nem causar falha de inicialização.
- Aplicar somente variáveis CSS do catálogo permitido. Não aceitar CSS livre,
  nomes arbitrários de propriedades ou URLs em valores de cor.
- Consolidar a aplicação do tema em um controlador/hook, incluindo aplicação
  inicial antes da primeira renderização quando possível. Ao trocar para um
  tema pronto, remover todas as substituições do customizado.
- Definir `color-scheme` claro/escuro conforme a base e o fundo efetivo da
  paleta para alinhar controles nativos. Revisar o ícone Sol/Lua do seletor:
  o identificador `custom` sozinho não informa se a paleta é clara ou escura.
- Alterações de cores afetam variáveis CSS; não precisam renderizar novamente
  toda a ficha nem disparar cálculo de regras ou gravação de personagens.

## Legibilidade e acessibilidade

- Indicar os pares problemáticos com mensagem objetiva, por exemplo
  **Texto principal sobre cartão: 2,1:1 — contraste baixo**. Calcular cores
  transparentes sobre seus fundos reais antes de medir o contraste.
- Verificar textos sobre as superfícies usadas, ações preenchidas em repouso
  e hover, ícones, bordas de campos e indicação de foco. A prévia deve mostrar
  esses casos, não somente quadrados de amostras.
- Avisos de contraste são informativos: o usuário conserva liberdade para
  salvar as cores. Não corrigir escolhas silenciosamente nem restringir a
  paleta a cores geradas.
- Validar formato de cor e faixa de opacidade; valores incompletos durante
  digitação permanecem no campo e não substituem a última cor válida da prévia.
- Manter nomes/textos/ícones nas mensagens de estado; cor não será a única
  forma de distinguir sucesso, aviso e erro.
- Reaproveitar `Modal` e `useDialogFocus` para foco contido, Escape e retorno
  ao acionador, ajustando o retorno quando o menu móvel tiver sido fechado.
  Manter rodapé visível e conteúdo rolável em telas pequenas.

## Steps e commits propostos

1. **Modelo de cores e catálogo** — centralizar paletas/papéis, normalização,
   derivados e contraste. Testes de cores, alpha e pares conhecidos.
   Commit: `refactor(theme): centralize semantic palettes and color utilities`.
2. **Persistência e aplicação** — chave versionada, leitura segura, salvar,
   seleção customizada, fallback e limpeza de substituições ao mudar de tema.
   Testar reload, conteúdo inválido, falhas de armazenamento e isolamento das
   fichas. Commit: `feat(theme): persist and apply a custom interface palette`.
3. **Editor e acesso nas configurações** — botão quadrado compartilhado,
   rascunho, base, grupos, picker/hex/alpha, prévia, avisos, cancelar e salvar;
   textos em português e inglês e comportamento móvel.
   Commit: `feat(theme): add accessible custom palette editor`.
4. **Cobertura das cores na página** — mapear cores fixas para os papéis em
   condições, vantagens, PowerBuilder, demais views, diálogos e rolagens;
   acrescentar papéis editáveis quando necessário e revisar estados de foco.
   Commit: `fix(theme): apply custom colors consistently across the interface`.
5. **Validação final e documentação** — verificar os quatro temas prontos e
   duas paletas customizadas (clara/escura), documentar armazenamento e fluxo,
   executar suíte, tipos, lint, build e verificação dos arquivos estáticos.
   Commit: `docs(theme): document custom themes and verified behavior`.

## Critérios de aceite

- Criar, salvar, selecionar e editar Personalizado pelo botão ao lado do seletor.
- Cada papel visual da interface altera os elementos correspondentes, incluindo
  transparências e estados; RGB e variantes derivadas acompanham a edição.
- Recarregar restaura cores e seleção; mudar de tema não perde a paleta salva.
- Cancelar não grava nada e não muda a página; restaurar a base não apaga dados.
- Dados inválidos e armazenamento indisponível não impedem abrir o aplicativo.
- Tema e editor funcionam a 320, 390, 768, 960 e 1280 px, com teclado e zoom 200%.
- Usar personagens sintéticos em origem local isolada para os testes visuais.
  Confirmar que personalizar cores não altera conteúdo, revisões ou histórico
  das fichas; nenhuma mudança em esquema, custos, avisos ou exportações.
- Testes, tipos, lint, build e verificação estática aprovados.

## Fontes adicionais

- [MDN: color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme)
- [WAI-ARIA: diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
