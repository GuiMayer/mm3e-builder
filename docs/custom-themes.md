# Temas personalizados

## Uso

Em Configurações, clique no botão quadrado de paleta ao lado da lista de temas.
O mesmo botão aparece no menu do celular. O editor inicia com a paleta já salva
ou, no primeiro uso, com as cores do tema selecionado.

Edite as cores nos grupos Destaques, Fundos, Textos, Bordas, Estados, Efeitos,
Cores das habilidades e Categorias dos efeitos. São 36 papéis de cor. Cada um
tem seletor visual, campo hexadecimal e botão para restaurar o valor da base;
papéis transparentes também oferecem opacidade de 0 a 100%.

A prévia acompanha as alterações. **Salvar e aplicar** grava a paleta no
navegador e acrescenta **Tema personalizado** ao seletor. Essa opção aparece
somente quando existe uma paleta salva e válida; os quatro temas padrão
continuam disponíveis, com suas cores originais. Selecionar outro tema preserva
a paleta personalizada. Existe um único tema personalizado, editável novamente
pelo mesmo botão.

**Cancelar**, X e Escape descartam a edição sem gravar nem mudar o tema ativo.
Selecionar uma base atualiza imediatamente o rascunho, os campos e a prévia.
**Restaurar cores da base** desfaz as edições do rascunho a partir dessa base.
É necessário salvar para aplicar essas mudanças à página.

Formato hexadecimal inválido mantém a última cor válida da prévia e desabilita
o salvamento até ser corrigido. Avisos de contraste são informativos e não
impedem salvar. A janela do editor acompanha o tema ativo do aplicativo;
somente a prévia usa as cores do rascunho até o salvamento.

## Armazenamento e isolamento

- A paleta usa a chave `mm3e-custom-theme-v1`, com versão 1, tema base e cores
  normalizadas no formato `{ hex: '#RRGGBB', alpha: 0..1 }`.
- A seleção continua no campo `theme` de `mm3e-app-preferences`. O identificador
  adicional é `custom`.
- Recarregar a página restaura a paleta e a seleção. Preferências são locais
  ao navegador e à origem; não há sincronização de contas ou servidores.
- JSON ou estruturas inválidas não impedem abrir o aplicativo. Versões
  desconhecidas e seleção customizada sem paleta válida usam Dark Knight como
  alternativa; cores faltantes de uma estrutura válida recuperam a base.
- A escrita acontece ao salvar. Se o navegador bloquear o armazenamento ou
  ficar sem espaço, o editor informa a falha e conserva o rascunho para tentar
  novamente. A paleta é gravada antes da seleção; uma falha ao persistir a
  seleção não remove uma paleta que já foi salva.
- A ação existente **Limpar todos os dados locais** continua removendo as
  preferências, inclusive o tema. Os botões de restaurar cores do editor não
  executam essa ação.
- Temas não entram nas fichas, revisões, undo/redo, JSON/JSONL, PDF ou Excel.
  A personalização de cores dos documentos PDF continua independente.

## Implementação

`features/themes/presetPalettes.ts` contém as cores originais dos quatro temas;
`themeModel.ts` define papéis, normalização, validação, derivados e contraste.
`themeStorage.ts` limita a persistência à chave da paleta. `customThemeStore`
mantém a paleta salva, enquanto o editor conserva seu rascunho local.

`applyTheme` aplica apenas propriedades permitidas ao documento. `main.tsx`
faz a aplicação inicial antes de renderizar, e `useTheme` sincroniza mudanças.
Ao retornar a um tema pronto, todas as substituições customizadas são removidas.
Variáveis auxiliares RGB, estados suaves e sombras são calculadas a partir
dos papéis editáveis. Cores antes fixas usam substituições apenas no tema
customizado, com os valores originais como fallback nos temas prontos.

O editor é carregado sob demanda e reutiliza o gerenciamento de foco do Modal.
O menu móvel fecha antes de abri-lo. Ao fechar, o foco retorna ao botão de
Configurações ou ao acionador do menu móvel.

## Verificação

- Testes de hexadecimal, cópia independente dos temas padrão, preenchimento
  de papéis ausentes, formatos inválidos, RGB, transparência e contraste.
- Testes de escrita exclusiva na chave do tema, recuperação da paleta, falhas
  de armazenamento, fallback e remoção de variáveis ao voltar a um tema pronto.
- Prévia local isolada: ausência da opção antes de salvar, cancelar sem criar
  tema, validação de campos, salvar, recarregar, alternar os quatro temas padrão,
  editar paletas clara/escura, transparência, Escape e retorno do foco.
- Layout observado em 320, 390, 768, 960 e 1280 px, além de 667 × 375 em
  orientação horizontal, com rodapé acessível e sem extravasar o diálogo.

O [plano original](./custom-theme-plan.md) registra as decisões e fontes de design.
