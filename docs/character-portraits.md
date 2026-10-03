# Retratos de personagens

Clique no ícone de pessoa ou no retrato no cabeçalho da ficha para abrir o
editor. A prévia pode ser ampliada; escolher uma nova imagem não modifica a
ficha até clicar em **Salvar retrato**. Cancelar mantém o retrato anterior.

## Link da imagem

Informe um endereço HTTPS direto de imagem e carregue a prévia. Ao salvar,
`header.portraitUrl` acompanha o JSON da ficha, junto do modo de encaixe
quando ele foi escolhido. A imagem fica em um
banco IndexedDB separado sempre que o servidor permite baixá-la.

O app usa essa cópia local nas próximas aberturas. **Atualizar imagem** permite
renovar o conteúdo quando o endereço continua igual. Em outro navegador, o
app tenta baixar novamente pelo endereço exportado.

Alguns servidores permitem mostrar a imagem, mas bloqueiam o download por
CORS. Nesses casos, o editor informa **Disponível apenas pelo link; sem cópia
offline**. É possível salvar o link após a prévia carregar; a imagem depende
de conexão e da disponibilidade do servidor. Links que não carregam não podem
ser aplicados pelo editor. Arquivos locais são uma alternativa.

## Arquivo deste dispositivo

O aviso aparece antes da seleção:

> Esta imagem será salva apenas neste navegador. Ela não será incluída no JSON
> da ficha e não aparecerá ao importá-lo em outro navegador ou dispositivo.
> Se você limpar os dados do site, precisará carregar a imagem novamente.

O arquivo é carregado localmente, sem upload para um servidor. A imagem é
associada ao identificador persistido do personagem no IndexedDB. O cabeçalho
identifica o modo **Local**, e a exportação JSON apresenta um aviso de que a
imagem não foi incluída. O arquivo também não acompanha backups JSON de
rascunhos: reimportá-los em outro navegador não transporta o retrato.

Trocar um link por arquivo remove o endereço anterior da ficha. Uma imagem
local não recebe caminho, base64 ou referência de mídia dentro do JSON.

## Encaixe da imagem

Antes de salvar, escolha **Manter com bordas** (imagem inteira, proporção
preservada), **Cortar pelo centro** (preenche com corte central, sem distorção)
ou **Esticar para preencher** (preenche todo o espaço, podendo mudar a proporção).
A prévia usa o mesmo componente de moldura da ficha, com as mesmas bordas,
fundo e proporção do espaço disponível na largura atual da tela. Ampliar
preserva essa proporção. A imagem original permanece disponível e o corte
não é destrutivo. O mesmo encaixe é usado no cabeçalho e no PDF.

É possível abrir um retrato existente e salvar apenas a mudança de encaixe,
sem carregar novamente a imagem. Cancelar mantém a escolha anterior.
`header.portraitFit` guarda apenas `contain`, `cover` ou `fill` e acompanha
as cópias e a exportação JSON. Não contém imagem ou referência ao arquivo local.
Sem esse campo, o retrato mostra a imagem inteira com bordas.

## Persistência, cópias e limites

- Renomear ou recarregar a ficha mantém o retrato local.
- Duplicar uma ficha ou importar como cópia associa a imagem local conhecida
  ao novo personagem. Substituir/remover uma cópia não muda o original.
- Fechar uma aba mantém a associação para desfazer o fechamento ou reimportar
  a mesma identidade neste navegador.
- **Remover** desassocia o retrato desse personagem e restaura o ícone.
- **Limpar todos os dados locais** também apaga o banco de retratos. O texto
  da confirmação inclui essa informação.
- IndexedDB não é backup nem sincronização. A persistência solicitada ao
  navegador pode ser negada, e a limpeza manual do site remove as imagens.
- JPEG, PNG e WebP: limite de 10 MiB de arquivo e 20 megapixels. Imagens são
  reduzidas a no máximo 1024 pixels no maior lado; miniaturas usam até 256 pixels.
- O retrato acompanha toda a altura do cabeçalho no desktop, incluindo os
  indicadores de NP, pontos heroicos, Power Points e a linha de detalhes, mostrando
  a imagem conforme o encaixe escolhido. No celular, usa espaço vertical
  de 120 × 160 pixels acima dos campos. A prévia também pode ser ampliada.
- O histórico de desfazer/refazer da ficha continua cobrindo o link como campo
  do cabeçalho; arquivos locais são operações independentes no banco de imagens.

## PDF e compatibilidade

Na personalização do PDF, marque **Incluir retrato**. Essa opção começa
desativada e é salva junto das preferências de exportação existentes.
O retrato fica ao lado de todo o cabeçalho (nome, detalhes e resumo de pontos),
com 112 pixels de largura e altura acompanhando essa seção. A base do retrato
fica alinhada à linha inferior de separação, inclusive no modo para preencher
a lápis. O exportador aplica o encaixe à cópia usada no PDF, sem alterar
a mídia original; o restante do documento continua em texto selecionável.
O PDF e o HTML exportado podem incorporar a imagem; o JSON continua sem bytes.
Se a imagem estiver indisponível para renderização, o app avisa e gera a ficha
sem retrato. O texto do PDF continua selecionável. O exportador PDF legado
com formulário fixo não inclui retratos.

Schema de ficha **2.2.0** adiciona `header.portraitUrl` e `header.portraitFit`,
ambos opcionais. Schemas
1.0.0, 2.0.0 e 2.1.0 continuam aceitos, sem migração em massa. Uma ficha sem link
não recebe campos de retrato automaticamente. Nenhum atributo, poder, recurso, regra ou cálculo é alterado.
Versões anteriores do app podem descartar o URL ao reexportar, preservando os
dados de jogo suportados por elas.

O plano de implementação está em [Plano de retratos](character-portraits-plan.md).
Exportação ZIP de ficha + imagem permanece uma evolução posterior.

## Validação desta entrega

- 78 arquivos de teste e 900 testes aprovados, além de lint, typecheck, build
  e verificação de 16 referências a arquivos estáticos.
- Testes dirigidos cobrem fichas antigas, round-trip do link, payload real do
  JSON sem imagem local, cópias independentes, falha de escrita/quota, remoção,
  cache por URL e inclusão opcional no HTML/PDF.
- Verificação no navegador com personagens de teste: escolher arquivo,
  salvar/recarregar, duplicar, cancelar, carregar link com cache, fallback de
  exibição sem CORS, PDF com retrato e texto disponível na camada selecionável.
- Testes de encaixe cobrem os três modos no JSON e no HTML/PDF; verificação no
  navegador cobre prévia, cancelamento, mudança sem recarregar o arquivo e
  persistência para imagem local e por link.
- Diálogo conferido em desktop e celular de 390 pixels, com aviso local antes
  da seleção, controles acessíveis e ausência de transbordamento horizontal.
