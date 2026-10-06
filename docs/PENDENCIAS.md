# Pendências e manutenção

Revisão: 05/10/2026 (versão declarada: v1.21.3).
Este é o ponto central para trabalho ainda aberto. As constatações abaixo vieram
da comparação entre documentação, código e fontes de regras; não constituem
uma certificação completa das regras.

Manter apenas pendências, decisões abertas e limitações relevantes. Quando um
item terminar, removê-lo daqui. Descrever o comportamento resultante no guia
correspondente, sem criar relatório de conclusão, arquivo de auditoria encerrada
ou lista histórica de documentos removidos.

## Pendências confirmadas no código

### P06 — Manutenção do Builder e do menu — prioridade baixa

**Contexto:** o PowerBuilderOverlay e o MenuBar concentram responsabilidades de
interface e coordenação; já existem funções, hooks e componentes extraídos.
O tamanho sozinho não comprova defeito. Scripts antigos de auditoria/adicionamento
de modificadores não são gates do projeto e podem recriar relatórios superados.

**Escopo:** quando houver evolução nesses fluxos, extrair responsabilidades
concretas, mantendo contratos atuais. Avaliar a retirada dos scripts de uso
único, separadamente da exclusão dos documentos. Não executar scripts antigos
que reescrevem o catálogo para tentar cumprir roadmaps encerrados.

**Critérios de aceite:** mudanças pequenas com testes de regressão relevantes, sem reformular o
domínio ou introduzir infraestrutura por conveniência. Scripts mantidos têm
uso atual, entrada/saída documentadas e não repovoam `docs/` com snapshots.

## Validações adicionais e possibilidades opcionais

Não são compromissos de implementação nem impedimentos para usar a versão atual.

- **QA acessível e toque real:** completar verificação em aparelho com toque,
  leitor de tela e foco/diálogos empilhados, incluindo o editor de modelos e o
  popup de destino da biblioteca. Cobrir listas extensas, retorno de foco ao
  fechar e edição concorrente em outra janela. Avaliar automatizar poucos
  fluxos essenciais de navegador; os gates atuais não possuem uma suíte E2E
  dedicada. Testes em viewport mobile não substituem toque real ou leitor de tela.
- **Templates de recursos e personagens auxiliares:** avaliar demanda por
  itens comuns de equipamento/veículos/bases e fichas vinculadas de invocações,
  minions ou sidekicks. As três receitas que alteram atributos ausentes não
  devem ser liberadas como simples poderes por causa dessa possibilidade.
- **Armazenamento em pasta:** explorar apenas se houver decisão de criar uma
  versão desktop. Contas, backend e sincronização obrigatória continuam fora
  do escopo atual.

### Criação assistida e interoperabilidade — propostas opcionais

**Contexto:** a comparação de 05/10/2026 com o Mastermind Maker identificou
possibilidades de expansão, sem caracterizar defeitos no aplicativo. A
[descrição oficial](https://greenroninstore.com/products/mastermind-maker-character-creator-software-for-m-m-3e)
anuncia criação rápida, orientação para iniciantes, importação do Hero Lab,
conteúdo suplementar, regras opcionais e exportação em PNG/texto simples.
A comparação foi documental, sem execução da versão paga. A cobertura atual
dos poderes prontos anunciados precisa ser confirmada: o desenvolvedor
[relatou pendências no lançamento](https://www.reddit.com/r/mutantsandmasterminds/comments/1vcfrq8/power_profiles_in_mastermind_maker_deluxe/).

| Proposta | Escopo e decisões abertas |
| --- | --- |
| Checklist opcional de criação | Orientar atributos, defesas, perícias, vantagens, poderes e complicações. Reutilizar os diagnósticos existentes e distinguir orientação de limites de regras. Não impedir construções deliberadas do jogador/narrador. |
| Importação do Hero Lab | Investigar o formato `.por`, obter arquivos de teste autorizados e mapear efeitos, arrays, modificadores e recursos. Apresentar campos não suportados antes de salvar, preservar o original e nunca descartar dados silenciosamente. |
| Conteúdo de suplementos | Avaliar demanda por Gadget Guides, Cosmic Handbook, Superteam Handbook e outros. Conferir fontes, permissões de distribuição e suporte do motor antes de adicionar entradas; não presumir que uma descrição comercial comprova cobertura completa. |
| Regras opcionais | Avaliar opções concretas do Deluxe Gamemaster's Guide. Definir escopo por ficha ou campanha, efeito sobre cálculos e portabilidade; manter as regras básicas como padrão. |
| Exportação PNG e texto simples | Avaliar utilidade para compartilhar fichas e blocos de personagem. Reutilizar o resumo canônico e as opções de exportação, definir tratamento de múltiplas páginas e verificar legibilidade. |

**Ordem sugerida para avaliação:** checklist primeiro, por reduzir a
dificuldade inicial sem exigir um novo sistema de autoria.
Importação, suplementos e regras opcionais dependem de demanda e de validação
dos formatos e regras envolvidos. Não há versão ou prazo definido para essas
propostas. Rolagens, condições, referências, modelos pessoais e PDF
personalizável já existem e não precisam ser recriados para obter paridade.

**Tutorial do aplicativo — decisão de planejamento:** o mantenedor produzirá
o tutorial somente após concluir o escopo de funcionalidades (feature complete)
e passar à fase de manutenção. O material deve refletir a interface e os fluxos
estabilizados; não antecipar sua produção durante as expansões atuais.
O checklist opcional de criação permanece uma proposta independente.

### Aba Homebrew — proposta de expansão

**Objetivo:** adicionar uma aba principal chamada **Homebrew**, com editores
para criar novos poderes/efeitos, modificadores, perícias, vantagens e outras
definições de regras conforme o escopo aprovado. O conteúdo criado deve ficar
disponível nos seletores correspondentes da ficha e do Power Builder.
A funcionalidade ainda não foi implementada.

**Distinção da biblioteca pessoal:** modelos atuais são composições de efeitos
e modificadores já existentes, com políticas de graduação. Homebrew permite
definir novos elementos do catálogo. Manter os modelos na Biblioteca de
poderes e preservar o catálogo oficial, sem substituir suas definições.

**Escopo inicial a detalhar:**

- Organizar a aba por tipo de conteúdo, com busca, criação, edição, duplicação,
  exclusão e prévia. Identificar entradas personalizadas nos seletores.
- Poderes/efeitos: nome, descrição, custo por graduação ou fixo, ação, alcance,
  duração e parâmetros suportados pelo motor. Definir como associar ataques,
  resistências e aprimoramentos quando aplicável.
- Modificadores: extra/flaw, custo fixo ou por graduação, graduações afetadas,
  opções e eventual restrição a efeitos específicos. Preservar a política
  atual de aplicações repetidas e diagnósticos configuráveis.
- Perícias: habilidade-base, subtipos, treinamento e custo; vantagens:
  descrição, custo e política de graduação. Definir separadamente os vínculos
  necessários para bônus e atalhos de rolagem.
- Usar campos declarativos validados, sem executar código ou fórmulas
  arbitrárias importadas. Informar quando uma mecânica depende de adjudicação
  manual ou ainda não tem suporte de automação.

**Persistência, compatibilidade e critérios de aceite:**

- Armazenar definições em biblioteca local própria, com IDs estáveis, formato
  versionado e importação/exportação. Validar conflitos de IDs e arquivos
  inválidos antes de gravar; garantir cópia recuperável em caso de migração.
- Definir como fichas, recursos e modelos transportam as definições utilizadas,
  incluindo snapshots ou dependências versionadas. Uma ficha exportada deve
  continuar legível em outro navegador sem a biblioteca local de origem.
- Definir a política de atualização de definições usadas. Editar ou excluir
  conteúdo Homebrew não pode modificar silenciosamente fichas existentes,
  alterar seus custos ou deixar referências ilegíveis.
- Verificar o estado das fichas atuais antes de implementar. Introduzir
  migração somente se o contrato da ficha precisar mudar, preservando dados
  originais e a leitura dos formatos históricos.
- Reutilizar o motor canônico em ficha, Builder, recursos, modelos e
  exportações para mecânicas suportadas. Testar custos, dependências ausentes,
  importação em navegador sem Homebrew e edição/exclusão de conteúdo em uso.

**Decisões abertas:** tipos incluídos na primeira entrega, campos e mecânicas
automatizáveis, regras de atualização de dependências e inclusão nos backups
de rascunho/ZIP. A expansão requer plano próprio antes da implementação;
não há versão ou prazo definido.

### Modo offline — proposta opcional

**Objetivo:** permitir abrir e usar o aplicativo sem conexão durante uma sessão,
após um primeiro acesso conectado. Manter a hospedagem estática no GitHub Pages,
o motor de regras e os formatos atuais das fichas. A proposta está documentada
para avaliação; o suporte offline completo ainda não foi implementado.

**Estado atual:** fichas, recursos, modelos e retratos locais já são armazenados
no navegador, mas isso não garante reabrir o aplicativo sem internet. Partes da
interface, capítulos do Power Profiles e ferramentas de PDF/Excel são carregados
sob demanda. As fontes da interface usam Google Fonts.

**Custos e limitações:**

- Atualizações exigem gestão de versões do service worker e dos arquivos em
  cache. Evitar manter versões antigas indefinidamente ou misturar arquivos de
  builds diferentes; uma atualização não pode interromper a edição do usuário.
- Disponibilizar todas as funções offline aumenta o download inicial e o uso
  de armazenamento. Definir quais arquivos entram no cache antecipadamente e
  informar quando o conteúdo necessário estiver disponível.
- Ampliar a manutenção e os testes para instalação inicial, download
  interrompido, cache incompleto, múltiplas abas e atualização de versão.
- Fontes precisam ser distribuídas localmente. Retratos por link dependem de
  uma cópia armazenada e das permissões do servidor de origem; imagens ainda
  não disponíveis localmente não podem ser garantidas offline. Uma eventual
  integração com o Drive continua exigindo conexão para enviar e restaurar.
- O navegador pode remover armazenamento sob determinadas condições, e o
  usuário pode limpar os dados do site. O modo offline depende da preparação
  conectada e não substitui exportação ou backup de fichas, retratos e modelos.

**Decisões abertas e critérios de aceite:**

- Definir cobertura: ficha, Builder, recursos, referências, biblioteca completa
  e exportações. Para qualquer função excluída do pacote offline, comunicar a
  necessidade de conexão antes de permitir uma ação que dependa dela.
- Versionar o cache de arquivos do aplicativo e manter uma versão utilizável
  quando um novo download falhar. Restringir o service worker e a limpeza de
  seus caches ao projeto `/mm3e-builder/`.
- Avisar quando houver nova versão e permitir ao usuário escolher quando
  recarregar, preservando as fichas salvas. Testar coexistência de abas com
  versões diferentes e evitar troca forçada durante a edição.
- Separar caches descartáveis do aplicativo dos dados do usuário. Atualizar ou
  limpar o cache não pode excluir localStorage, retratos em IndexedDB ou modelos
  pessoais; não introduzir migração de fichas apenas para habilitar o offline.
- Verificar abertura sem rede após fechar o navegador e uso de funções ainda
  não visitadas, incluindo capítulos, PDF e Excel quando fizerem parte da
  cobertura. Testar recuperação de cache removido e falta de espaço em desktop
  e mobile, preservando os dados locais diante de falhas.

**Referências técnicas:** [cache de PWAs](https://web.dev/learn/pwa/caching),
[atualizações de PWAs](https://web.dev/learn/pwa/update) e
[cotas e remoção de armazenamento](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).

### Backup manual no Google Drive — proposta opcional

**Objetivo:** oferecer conexão opcional com o Drive para salvar e restaurar o
estado do aplicativo por ação do usuário, mantendo a hospedagem estática no
GitHub Pages. A proposta está documentada para avaliação; a integração ainda
não foi implementada.

**Fluxo proposto:** o botão “Salvar no Drive” gera um ZIP com as fichas abertas,
recursos, retratos locais, modelos pessoais de poderes e preferências. Reutilizar
o formato de rascunho e o empacotamento de retratos existentes, incluindo a
biblioteca no seu formato JSON versionado e definindo um arquivo separado para
as preferências. O catálogo do Power Profiles faz parte do aplicativo e não
precisa entrar no backup. Criar um backup na primeira gravação e atualizar o mesmo
arquivo nas seguintes. Oferecer “Restaurar do Drive” para recuperar o estado em outro
navegador. Não incluir tokens, caches, histórico temporário de rolagens ou
backups de recuperação no pacote.

**Limitação atual:** modelos pessoais têm exportação/importação própria e não
entram no JSON de personagem nem nos rascunhos JSONL/ZIP. Um backup completo
precisa preservar também essa biblioteca. Manter o formato das fichas e usar
o contrato de [persistência dos modelos](guides/power-library.md#persistência-e-backup).

**Requisitos de configuração pelo mantenedor:**

1. Ter uma conta Google, criar um projeto no Google Cloud Console e habilitar
   a Google Drive API.
2. Configurar o Google Auth Platform com nome do aplicativo, e-mail de suporte,
   contato do desenvolvedor e público `External`.
3. Declarar e solicitar somente o escopo não sensível
   `https://www.googleapis.com/auth/drive.file`, para acessar os arquivos criados
   pelo aplicativo ou explicitamente selecionados pelo usuário.
4. Criar um cliente OAuth do tipo “Aplicação da Web”. Registrar
   `https://guimayer.github.io` como origem JavaScript autorizada, sem o caminho
   `/mm3e-builder/`, e as origens locais necessárias aos testes, incluindo suas
   portas. Configurar o Client ID público no aplicativo; não publicar nem usar
   um client secret nesse fluxo executado no navegador.
5. Durante o desenvolvimento, cadastrar as contas de teste. O modo `Testing`
   permite até 100 usuários cadastrados e as autorizações expiram após sete
   dias. Para disponibilizar a integração ao público, usar `In production` e
   atender aos requisitos aplicáveis de verificação do Google.
6. Preparar uma página pública de apresentação e uma política de privacidade
   acessível pelo aplicativo e pela tela de consentimento, descrevendo acesso,
   uso, armazenamento, compartilhamento e desconexão dos dados do Google.
   Termos de uso são opcionais segundo a documentação de verificação de marca.
7. Para exibir nome e logo verificados na autorização, concluir a verificação
   de marca e comprovar a propriedade dos domínios associados no Search
   Console. Avaliar a viabilidade dessa comprovação no endereço atual antes
   da publicação; domínio próprio pode facilitar essa etapa, mas não é
   pré-requisito para iniciar testes.

**Requisitos para o usuário:** conta Google com Drive disponível, espaço para
o backup, conexão com a internet e autorização ao aplicativo. Contas Google
Workspace podem depender de autorização do administrador. Cada usuário utiliza
seu próprio Drive e não precisa criar um projeto no Google Cloud.

**Requisitos de implementação e critérios de aceite:**

- Usar Google Identity Services com autorização por token e chamadas diretas à
  API. Implementar conectar, desconectar e solicitar nova autorização quando
  necessário; tokens temporários permanecem em memória. Não exige backend
  próprio, conta de serviço ou sincronização com o aplicativo fechado.
- Manter metadados de conexão e do backup separados das fichas e associados à
  conta correta. Localizar o backup existente também em um navegador novo,
  evitando criar duplicatas apenas porque o identificador local foi perdido.
- Verificar alterações remotas antes de sobrescrever. Se houver versão remota
  desconhecida ou alterada desde a última sincronização, oferecer restaurar ou
  substituir explicitamente, sem mesclar fichas automaticamente.
- Exibir progresso, conclusão e horário da última gravação bem-sucedida. Tratar
  expiração de token, falhas de rede, limites da API e falta de armazenamento,
  preservando o estado local em caso de falha.
- Validar o pacote antes de restaurar e reutilizar as proteções de importação,
  identidade e rollback existentes. Validar também a versão e o conteúdo da
  biblioteca pessoal antes de gravar; definir a política para modelos locais
  existentes e garantir rollback entre fichas, recursos, retratos, modelos e
  preferências. Preferências precisam de formato validado; não copiar
  indiscriminadamente todo o local storage.
- Verificar salvar, atualizar, restaurar em outro navegador, trocar de conta,
  desconectar, falhar durante o envio e detectar conflito. Cobrir backups antigos
  sem modelos e modelos com IDs conflitantes, sem excluir a biblioteca local
  pela ausência do arquivo. Preservar os formatos atuais das fichas e as opções
  de exportação local.

**Custos e limites:** na consulta de 05/10/2026, a documentação informa que o uso
padrão da Drive API não tem custo adicional e prevê cobrança futura por exceder
determinados limites. Confirmar as condições vigentes na implementação e
acompanhar as cotas do projeto. O backup consome o armazenamento do usuário.

**Fontes oficiais:** [configuração de consentimento](https://developers.google.com/workspace/guides/configure-oauth-consent),
[escopos do Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth),
[cliente OAuth e origens](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid),
[autorização no navegador](https://developers.google.com/identity/oauth2/web/guides/use-token-model),
[público e publicação](https://support.google.com/cloud/answer/15549945?hl=en),
[verificação de marca e domínios](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification)
e [custos e limites](https://developers.google.com/workspace/drive/api/guides/limits).
