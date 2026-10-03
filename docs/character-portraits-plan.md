# Plano: retratos por link e por arquivo local

Data: 2026-10-03. Estado: implementado. Comportamento e limites documentados em [Retratos de personagens](character-portraits.md).

## Objetivo

Exibir um retrato no cabeçalho da ficha e substituir o ícone de pessoa atual.
Ao clicar nesse espaço, o usuário pode escolher um arquivo, informar um link,
visualizar o retrato maior, substituir ou remover a imagem.

Oferecer dois modos:

| Origem | JSON e rascunho da ficha | IndexedDB | Outro navegador/dispositivo |
| --- | --- | --- | --- |
| Link | Apenas `header.portraitUrl`, opcional | Cópia da imagem quando o servidor permite baixá-la | Recupera pelo link enquanto ele estiver disponível |
| Arquivo local | Nenhuma imagem ou referência de arquivo | Imagem associada ao `characterId` existente | Não acompanha o JSON; é necessário escolher o arquivo novamente |

O endereço também será salvo no rascunho existente em localStorage, como os
demais campos da ficha. Os bytes da imagem nunca entram nesse armazenamento
nem no JSON. URLs temporárias `blob:`, imagens `data:` e caminhos locais não
são endereços portáveis e não devem ser gravados em `portraitUrl`.

## Leitura do projeto atual

- `features/sheet-core/HeaderPanel.tsx` exibe `User` dentro de uma `div`
  `hero-avatar`, sem ação. Será convertido em botão com nome acessível.
- `entities/types.ts` já possui `characterId`, distinto do ID de aba retornado
  por `useActiveCharacter`. Usar a identidade persistida do personagem.
- `entities/schemas.ts` valida o cabeçalho; `sanitizeCharacterForExport`
  seleciona explicitamente os campos exportados. Ambos precisam aceitar o URL.
- `characterOperations` e `characterImport` geram nova identidade ao duplicar.
  A associação de mídia local deve acompanhar essa operação de forma explícita.
- Fechar uma aba pode ser desfeito. Fechamento não equivale a exclusão definitiva
  de seu retrato.
- O produto é estático, sem servidor de uploads. Escolher um arquivo significa
  carregar no navegador, sem envio para um serviço externo.
- O PDF usa HTML com `jsPDF.html()` e `html2canvas` com `useCORS`. Retratos no PDF
  exigem resolução da imagem antes da paginação/renderização.

## Aviso obrigatório e experiência

Na opção **Arquivo deste dispositivo**, antes do seletor de arquivo e também
enquanto o retrato local estiver selecionado no editor:

> Esta imagem será salva apenas neste navegador. Ela não será incluída no JSON
> da ficha e não aparecerá ao importá-lo em outro navegador ou dispositivo.
> Se você limpar os dados do site, precisará carregar a imagem novamente.

Após salvar, apresentar **Retrato salvo neste navegador**. O cabeçalho oferece
essa informação por uma indicação discreta acessível, sem repetir um alerta
modal em cada abertura da ficha. Não exigir um segundo aceite: o aviso visível
antes da escolha e o retorno após salvar explicam a limitação.

Texto equivalente em inglês, seguindo a tradução atual do app.

Para links, explicar **O link acompanha o JSON. A cópia offline depende de o
servidor permitir o download.** Se não houver cache disponível, mostrar o
estado **Disponível apenas pelo link**.

Fluxo do editor:

1. Clicar no avatar abre um diálogo com opções **Link da imagem** e
   **Arquivo deste dispositivo**, prévia, origem atual e ações de remoção.
2. Escolher imagem/link modifica apenas o rascunho do diálogo; Cancelar
   preserva o retrato anterior.
3. Validar e preparar a imagem; exibir carregamento e resultado antes de aplicar.
4. Aplicar somente após sucesso. Em falhas, conservar o retrato anterior.
5. Trocar de link para arquivo remove `portraitUrl` ao aplicar, evitando que o
   JSON compartilhe um retrato diferente do que aparece na tela.
6. Trocar de arquivo para link ativa o URL; uma cópia local antiga não deve
   prevalecer sobre o link selecionado.
7. **Atualizar imagem** tenta renovar o cache do mesmo link. Se falhar,
   preservar a última cópia válida e indicar a falha.
8. **Remover retrato** remove a referência ativa e a associação local desse
   personagem, restaurando o ícone. Não apagar mídias usadas por outras fichas.

O diálogo reutiliza os componentes existentes, respeita o tema e a prioridade
do menu de configurações. Navegação por teclado, foco inicial/restaurado,
Escape e alvos de toque adequados devem funcionar no desktop e no celular.

## Modelo e persistência

Adicionar somente `portraitUrl?: string` ao cabeçalho. A propriedade ausente
continua significando ficha sem retrato remoto. Exportação omite a propriedade
quando o modo ativo é arquivo local; não incluir IDs de mídia, blobs, base64,
caminhos de arquivo ou URLs temporárias.

Tratar a alteração como extensão opcional do schema de ficha, documentando a
nova versão aditiva conforme a convenção de releases do projeto. Aceitar todos
os schemas anteriores e não regravar fichas antigas em massa. Nenhuma mudança
na versão das regras, nos cálculos, nos recursos ou nas mensagens de aviso.
Versões anteriores do app podem descartar o campo novo ao importar/exportar;
documentar essa limitação sem sugerir perda dos dados de jogo existentes.

Criar `services/storage/portraitStorage` com banco IndexedDB próprio versionado,
operações assíncronas e validação dos registros:

- Mídias por chave interna: imagem normalizada, miniatura, tipo e dimensões.
- Cache remoto por URL: referência à mídia e data da atualização.
- Associação local por `characterId`: referência à mídia de arquivo escolhida.

Compartilhar a mídia ao duplicar; associações diferentes permitem substituir
ou remover um retrato sem afetar a outra ficha. O cache por URL também evita
salvar várias cópias para fichas que usam o mesmo endereço. Não usar o nome do
personagem nem o ID temporário da aba como chave.

Fechar uma aba não remove mídia. Substituir/remover deve tratar referências
compartilhadas. Não executar limpeza automática agressiva de arquivos sem
ficha aberta: o usuário pode reimportar um JSON com a mesma identidade depois.
Integrar o banco à ação existente de limpar todos os dados locais, atualizando
o texto de confirmação para mencionar os retratos e tratando falhas de limpeza.

Erros de quota, permissões ou abertura do banco não podem quebrar a ficha ou
ser apresentados como salvamento bem-sucedido. Persistência do navegador pode
ser solicitada, mas não garante backup nem evita exclusão manual dos dados.

## Resolução e processamento de imagens

Para URL ativo: procurar cache do endereço, exibir a cópia válida e baixar
somente quando ausente ou por atualização explícita. Para arquivo local sem
URL ativo: buscar a associação pelo `characterId`. Sem imagem disponível,
usar o ícone e permitir configurar o retrato.

Validar URLs HTTPS de imagens; não adicionar uploads públicos, proxy ou contas.
O download remoto usa CORS e valida resposta, tipo, tamanho e decodificação.
Se o servidor bloquear o download, tentar exibir o URL diretamente, informar
que não há cópia offline e permitir escolher o arquivo como alternativa.
Se nem a exibição funcionar, manter o ícone com ação de corrigir o retrato.
Não contornar CORS com `no-cors`: a resposta não expõe os bytes ao JavaScript.

Limites iniciais propostos: JPEG, PNG e WebP, até 10 MiB de arquivo e 20
megapixels de imagem decodificada. Normalizar para no máximo 1024 pixels no
maior lado e gerar miniatura de até 256 pixels, preservando proporção e
transparência quando existente. Ajustar limites apenas se a validação no
celular justificar. Sem editor de recorte nesta primeira entrega; avatar usa
`object-fit: cover` e a visualização ampliada mostra a imagem completa.

Criar URLs de objeto somente em memória e revogá-las ao substituir/desmontar.
Cancelar requisições obsoletas e verificar identidade/URL antes de aplicar
resultados assíncronos. Trocar rapidamente de personagem não pode exibir ou
salvar a imagem de outro. Carregamento de retrato não bloqueia importação,
autosave ou abertura da ficha.

## Importação, duplicação e exportação

- Ficha antiga sem retrato continua abrindo normalmente, sem migração de dados.
- JSON com link mantém a propriedade na validação, normalização e exportação.
  O download ocorre depois da importação, na apresentação.
- Reimportar a mesma identidade sem link reutiliza o retrato local daquele
  personagem. O arquivo não passa a conter essa associação.
- Importar JSON como cópia gera nova identidade. Se houver retrato local
  conhecido na identidade original, copiar sua associação explicitamente.
- Duplicar uma ficha aberta preserva o retrato por associação independente.
- Atualizar uma ficha pelo JSON com outro link passa a usar o novo endereço.
- Exportar JSON com arquivo local continua exportando somente os dados da ficha;
  indicar de forma breve que o retrato local não foi incluído.

Incluir retrato no PDF por opção própria, mantendo o cabeçalho compacto e a
preferência desativada por padrão. Resolver a imagem antes de renderizar e
aguardar a decodificação. Se um link não puder ser usado pelo renderizador,
avisar e permitir exportar sem retrato, preservando a exportação da ficha.
Não alterar o modo de preenchimento com lápis nem a seleção de texto do PDF.

Exportação ZIP de ficha + imagem fica como evolução posterior, sem integrar
esse formato à primeira entrega. O aviso de arquivo local é obrigatório
independentemente da existência de uma exportação futura.

## Steps e commits lógicos

1. **Modelo e compatibilidade:** campo opcional, schema, sanitização/exportação,
   fixtures antigas e round-trip do URL. Nenhuma imagem no rascunho ou JSON.
2. **Armazenamento e processamento:** IndexedDB, cache por URL, associações,
   normalização, miniaturas, limites, falhas e atualização sem perder cache válido.
3. **Editor e cabeçalho:** avatar clicável, diálogo dos dois modos, prévia,
   troca/remoção, avisos PT/EN, estados de carregamento e acessibilidade.
4. **Ciclo de vida das fichas:** duplicação e cópia de importação, reimportação,
   fechamento/reabertura e limpeza de dados. Manter operações de mídia fora
   das transformações puras das entidades.
5. **PDF:** opção de retrato, resolução assíncrona, paginação e comportamento
   quando a imagem não pode ser exportada.
6. **Documentação e validação final:** descrever persistência e limites reais,
   registrar a release escolhida, revisar desktop/celular e rodar os checks.

Cada commit deve manter o app compilando e conter sua validação relevante.
Não publicar uma versão intermediária com retratos sem os avisos de persistência.

## Critérios de aceite

- Link e arquivo local aparecem na ficha e substituem o ícone atual.
- Aviso de arquivo local é visível antes da escolha e o estado continua
  identificável após o salvamento.
- Após recarregar, arquivo local reaparece no mesmo navegador e identidade.
- JSON de arquivo local não inclui imagem, referência local ou URL antigo.
- JSON de link inclui apenas o URL, e o cache pode ser recriado em outro navegador.
- Cache remoto existente funciona sem conexão; sem cache, ficha permanece usável.
- Link bloqueado por CORS não é anunciado como salvo offline.
- Cancelar, falha de quota e download inválido preservam o retrato anterior.
- Duplicar, fechar/desfazer fechamento e importar não confundem personagens.
- Trocar link durante um download não permite que a resposta antiga sobrescreva
  o novo retrato. Substituir um retrato compartilhado não altera a outra ficha.
- Limpar todos os dados locais também remove o banco de retratos.
- PDF com retrato mantém dimensões, paginação e texto selecionável.
- Importar/exportar fixtures antigas preserva dados de jogo e resultados dos cálculos.

Testar de forma dirigida persistência real em IndexedDB, falhas e corridas;
usar testes de integração para schema/exportação e duplicação. Complementar
com verificação visual desktop/mobile e lint, typecheck, testes existentes,
build e verificação de arquivos estáticos.

## Referências técnicas

- [IndexedDB: suporte a arquivos/blobs e operações assíncronas](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
- [Fetch: CORS, respostas opacas e leitura de blobs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
- [Imagens externas e restrições de canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/CORS_enabled_image).
- [Persistência e remoção de dados do navegador](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- [URLs de objeto para blobs](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static).
