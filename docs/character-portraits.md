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

> Esta imagem será salva apenas neste navegador. Para levá-la a outro navegador
> ou dispositivo, escolha incluir as imagens ao exportar a ficha ou o rascunho
> em ZIP. O JSON e o JSONL isolados não incluem imagens. Se você limpar os dados
> do site, poderá restaurá-la pelo ZIP ou carregá-la novamente.

O arquivo é carregado localmente, sem upload para um servidor. A imagem é
associada ao identificador persistido do personagem no IndexedDB. O cabeçalho
identifica o modo **Local**. Ao exportar, você escolhe entre os dados isolados
e um pacote ZIP que também transporta a imagem.

Trocar um link por arquivo remove o endereço anterior da ficha. Uma imagem
local não recebe caminho, base64 ou referência de mídia dentro do JSON.

## Exportação e importação ZIP

**Exportar** pergunta se deseja incluir o retrato quando a ficha tem uma imagem
local associada. **Exportar Rascunho** faz uma única pergunta para todas as imagens
locais das abas exportadas. Você pode cancelar, exportar apenas JSON/JSONL ou
incluir as imagens em ZIP. A escolha vale somente para aquela exportação.
Sem retrato local, o download mantém o formato habitual e não apresenta a pergunta.
Retratos por URL continuam representados pelo link, sem incluir seu cache no ZIP.

Use **Importar** para ZIP de personagem e **Importar Rascunho** para ZIP de
rascunho. A importação aplica as mesmas validações, revisões e escolhas dos
formatos originais. Ao atualizar uma ficha, o retrato do pacote substitui o
retrato local dessa identidade; ao abrir como cópia, é associado à nova identidade,
preservando o original. Imagens ausentes no pacote não apagam retratos locais.
O rascunho mantém suas abas, seleção ativa e biblioteca de recursos.

O ZIP contém `manifest.json`, `character.json` ou `draft.jsonl`, e os arquivos
em `portraits/`. O manifesto usa formato `mm3e-portrait-bundle`, versão `1`,
tipo `character` ou `draft`, `dataFile` e associações `{ characterId, path, mime }`.
O JSON/JSONL interno é o mesmo usado na exportação isolada; pode ser extraído
e importado por versões anteriores do app, sem transportar as imagens.
Backups automáticos de recuperação e pré-atualização continuam em JSONL.

Antes de gravar, o importador valida estrutura, nomes, associações, formato real
e decodificação de todas as imagens. Limites: 100 MiB para o ZIP, 200 MiB após
descompactar, 20 MiB de JSON/JSONL, 1.000 arquivos e os limites de imagem abaixo.
Pacotes incompletos ou com arquivos adicionais não são aceitos. Os dados e as
associações anteriores são restaurados se uma etapa de persistência falhar;
IndexedDB e localStorage não constituem uma transação única.
Imagens já limitadas a 1024 pixels são preservadas sem nova recompressão;
miniaturas são regeneradas no navegador de destino.

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

Schema de ficha **2.2.0** adicionou `header.portraitUrl` e `header.portraitFit`,
ambos opcionais. Schemas
1.0.0, 2.0.0 e 2.1.0 continuam aceitos, sem migração em massa. Uma ficha sem link
não recebe campos de retrato automaticamente. Nenhum atributo, poder, recurso, regra ou cálculo é alterado.
Versões anteriores do app podem descartar o URL ao reexportar, preservando os
dados de jogo suportados por elas.
O ZIP não adiciona campos nem altera a versão atual do schema de ficha (2.3.0).
