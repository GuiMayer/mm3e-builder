# Estatísticas de uso

Cloudflare Web Analytics fornece um panorama agregado de visitas, visualizações e
distribuição por país. O serviço também oferece dados gerais de dispositivo,
navegador, origem e desempenho. Visitas não representam pessoas únicas.

## Preferência do navegador

O último item das configurações, no desktop e no mobile, é **Permitir estatísticas
de uso**. A opção começa ligada e fica salva como `analyticsEnabled` em
`mm3e-app-preferences`. Preferências antigas sem o campo usam o padrão ligado;
uma escolha desligada é preservada. Não há mudança no formato das fichas,
migração de personagens ou inclusão dessa preferência em exportações.

A alteração vale no próximo carregamento da página. O app informa quando há uma
mudança pendente e não recarrega automaticamente, preservando edições abertas.
Desativar não apaga estatísticas já recebidas pelo provedor. O controle é uma
opção de recusa, não uma solicitação de consentimento prévio.

## Integração

- O script é carregado uma única vez no início, depois da restauração das
  preferências. Uma falha na leitura impede seu carregamento.
- A coleta funciona apenas no build de produção servido em
  `https://guimayer.github.io/mm3e-builder/`; desenvolvimento e prévias locais são
  excluídos.
- O token público está em `.env.production`, na variável
  `VITE_CLOUDFLARE_ANALYTICS_TOKEN`. O ambiente do build pode sobrescrevê-lo. Não é
  uma credencial de acesso ao painel. Outro domínio requer atualizar a restrição
  de endereço e o cadastro na Cloudflare.
- O script não é inserido estaticamente no HTML. Com a preferência desligada no
  início, nenhuma requisição de analytics é iniciada pelo aplicativo.
- Não enviamos eventos personalizados, conteúdo ou identificadores de fichas.
  Cookies e armazenamento local não são utilizados pelo serviço para rastrear
  visitantes; o armazenamento local do app guarda apenas a preferência.
- Falhas de rede e bloqueadores não impedem o uso do app. Bloqueadores podem
  reduzir a contagem. O script externo executa no contexto da página; a alegação
  de coleta limitada refere-se à integração padrão do provedor.

O módulo do coletor é uma importação dinâmica opcional, com tratamento de falha,
executada depois de solicitar a renderização da interface. As configurações não
dependem desse módulo. Isso também protege o desenvolvimento local contra regras
como `/WebAnalytics.` da EasyPrivacy: a recusa dessa requisição não interrompe o
carregamento da ficha. Nenhuma exceção ou desativação do bloqueador é necessária;
as requisições à Cloudflare continuam sujeitas aos filtros do navegador.

As estatísticas são consultadas no painel privado da Cloudflare. A integração
não oferece uma garantia jurídica universal de dispensa de consentimento; a
avaliação depende da configuração e da legislação aplicável.

Referências: [instalação](https://developers.cloudflare.com/web-analytics/get-started/),
[métricas](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)
e [privacidade](https://www.cloudflare.com/trust-hub/gdpr/).
