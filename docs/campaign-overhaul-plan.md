# Modo campanha: auditoria e plano implementado

Data: 2026-10-02. Código revisado: `083256f` (aplicativo 1.16.0 com correções posteriores).
Estado: **implementado na v1.17.0**. A auditoria abaixo descreve o snapshot antigo;
o fluxo atual está em [Modo campanha](./campaign-mode.md). A decisão posterior do
usuário substituiu a política legada congelada por migração para base fixa, com
revisão do NP/PP inicial no popup antes de concluir.

## O que existia no snapshot auditado

O modo campanha é um recurso por personagem para ajustar o orçamento de PP.
Não é um gerenciador de campanhas, grupos ou sessões compartilhadas.

- `campaignMode` habilita a contabilização do histórico.
- `ppLog` contém lançamentos `{ id, date, amount, note }`, positivos ou negativos.
- Disponível = `NP atual × 15 + soma(ppLog.amount)` quando o modo está ligado.
- No modo padrão, disponível = `NP atual × 15`; lançamentos existentes continuam
  armazenados, mas o painel desaparece e os ajustes deixam de entrar no orçamento.
- Gasto é derivado dos atributos, defesas, perícias, vantagens e poderes da ficha.
- Há adição e remoção com confirmação, sem edição, sessão estruturada ou estorno.
- O painel fica próximo do final da ficha. O botão nas configurações impede desligar
  o modo enquanto houver entradas e orienta apagar o histórico antes de desligar.
- JSON e rascunho armazenam o registro. Excel inclui uma aba de histórico apenas
  quando o modo está ligado e há lançamentos; o PDF/HTML atual mostra o ajuste líquido,
  sem uma seção de histórico de sessões.
- A conferência de orçamento pode ser desligada globalmente. Isso não elimina os
  totais calculados, mas a interface substitui disponível/restante por infinito.

Referências: `src/features/sheet-core/PPLogPanel.tsx`,
`src/shared/lib/pointSummary.ts`, `src/shared/hooks/useCharacterActions.ts`,
`src/shared/ui/MenuBar.tsx`, `src/shared/ui/MobileDrawer.tsx` e
`src/services/excelGenerator.ts`.

## Problemas encontrados

| Prioridade | Problema | Evidência e consequência |
|---|---|---|
| Alta | NP e orçamento de avanço estão acoplados | NP 10 + 15 PP resulta em 165. Subir para NP 11 resulta em 180, sem novo prêmio. Pode contar os mesmos 15 PP de avanço duas vezes. Confirmado no calculador real. |
| Alta | Exportação reduz NP acima de 15 | Cabeçalho e schema aceitam NP 16; `sanitizeCharacterForExport` limita a 15. NP 16 + 15 PP passa de 255 para 240 no roundtrip JSON. Bug geral da exportação, relevante para campanhas longas. |
| Alta | Entrada numérica não coincide com o schema | A ação aceita 1,5 PP e o formulário só recusa vazio/zero. O schema exige inteiro: o JSON gerado não é reimportável. O carregador multi-personagem tolerante recupera o valor, sem o corrigir; isso não resolve a incompatibilidade do arquivo. |
| Média | Saldo negativo é mostrado como zero | `ppEarned > 0 ? ... : '0 PP'` faz um ajuste líquido de -5 aparecer como 0 PP no cabeçalho, embora o calculador retorne 145. Confirmado na renderização do componente. |
| Média | Data padrão usa UTC | Às 23:30 de 02/10 em São Paulo, `toISOString().slice(0, 10)` produz 03/10. Além disso, a data é inicializada uma vez, não ao abrir cada lançamento. |
| Média | Formulário não pertence explicitamente à ficha | Seus estados locais sobrevivem à troca de personagem; as ações consultam o personagem ativo no momento de executar. Uma ação capturada na ficha A grava na B após a troca. Confirmado no hook; a permanência do formulário foi constatada por leitura do componente, sem ensaio interativo entre abas. |
| Média | Desligar exige apagar o histórico | Bloqueio deliberado na interface, embora a ação e o modelo já permitam preservar o registro com `campaignMode=false`. É um problema de desenho, não uma necessidade técnica. |
| Média | Confirmação descreve uma exclusão irreversível | `ppLog.confirmRemove` afirma que não se pode desfazer, mas o histórico da ficha restaura a entrada. Desfazer foi testado no store real; continua temporário e não sobrevive ao fechamento da sessão. |
| Baixa | Leitura, acessibilidade e tradução incompletas | Notas longas são truncadas sem expansão; remover fica com opacidade zero até hover, sem regra equivalente para foco/toque; labels não estão associados aos inputs; exemplo da nota e a aba/cabeçalhos do Excel continuam em inglês. Constatação no código/CSS. |

Há também uma ambiguidade conceitual: uma dedução no registro reduz o orçamento,
não representa a compra de um atributo. Se o usuário registra “-3 PP comprados”
e também adiciona uma característica de 3 PP, o saldo cai duas vezes. O exemplo
de um teste antigo usa justamente uma nota de gasto para um ajuste negativo.
Não se deve reinterpretar notas antigas automaticamente: não sabemos a intenção.

O default atual de +5 PP não é um bug matemático, mas é uma escolha pouco clara.
O livro apresenta 1 PP como prêmio usual e permite que o mestre varie o valor.

## O que está funcionando e deve ser preservado

- O resumo central soma ajustes positivos e negativos e já é compartilhado entre
  ficha, Resources e exportações. Não criar outro calculador de campanha.
- JSON preserva `campaignMode` e todos os quatro campos dos lançamentos válidos,
  inclusive quando o modo está desligado.
- Rascunhos e migrações existentes mantêm os IDs do histórico; duplicar uma ficha
  cria novos IDs, como esperado para uma cópia independente.
- Adicionar/remover participa do undo/redo da ficha durante a sessão.
- O modo campanha não muda, por si, os limites de NP nem a seleção de modificadores.

## Direção do overhaul

### 1. Um painel compacto de Campanha por personagem

Colocar o painel logo após o cabeçalho. Fechado, mostrar nome da campanha, se
informado, ajuste líquido e saldo. Aberto, mostrar quatro valores:

| PP iniciais | Ajustes de campanha | PP gastos na ficha | PP restantes |
|---:|---:|---:|---:|
| 150 | +15 | 158 | 7 |

Não esconder valores quando a conferência de orçamento estiver desativada:
mostrar os números e um texto curto “Conferência de orçamento desativada”.
Isso mantém a informação sem alterar a opção global de validação.

Nome da campanha, série e mestre aproveitam `header.series` e `header.gameMaster`.
Não criar campos duplicados nem cadastro obrigatório de grupo.

### 2. Separar NP atual de orçamento inicial

Para campanhas novas, congelar um orçamento inicial, sugerido como `NP × 15`
na ativação e editável pelo usuário. O cálculo fica:

`disponível = PP iniciais + ajustes; restante = disponível − gasto atual`

Alterar NP passa a alterar os limites da ficha, sem conceder PP automaticamente.
O mestre continua decidindo NP e prêmios; não criar avanço automático a cada
15 PP ou adicionar uma concessão escondida ao mudar o NP.

Fichas antigas salvas no navegador são migradas para o modelo novo após revisar
NP/PP inicial e total antes/depois no popup. Não há política `legacy-pl` disponível.
O formato antigo não informava o NP inicial: não deduzir pela nota, pelo gasto ou
pela soma do histórico. A sugestão conservadora é NP atual × 15, ajustável antes
de concluir. NP atual 11 com +15 e NP inicial revisado 10 resulta em base 150 e
total 165, corrigindo a contagem dupla sem excluir o prêmio.
O popup aparece para fichas com campanha ativa ou histórico antigo preservado;
fichas padrão sem histórico e fichas já migradas ficam fora dessa revisão.

### 3. Um registro claro, sem contabilizar compras duas vezes

Ações principais: **Registrar PP** e, nas opções da linha, **Editar**, **Estornar**
e **Remover**. O lançamento mostra data, PP com sinal e nota completa expansível.
Sessão/número de sessão é opcional. Busca e ordenação aparecem apenas quando
o tamanho do histórico justificar; não adicionar tabelas vazias obrigatórias.

- Novos lançamentos: “Prêmio” ou “Ajuste”; o ajuste aceita positivo/negativo.
- Valor inteiro, finito, não zero, dentro de um limite seguro; validar no formulário
  e na ação. Não arredondar silenciosamente. Sugestão inicial +1, sem restringir
  decisões do mestre. Datas novas válidas e geradas no fuso local.
- Mostrar a prévia do orçamento resultante antes de salvar.
- Gasto é o custo atual da ficha, não uma dedução a lançar no registro.
- Estorno cria um novo lançamento com valor oposto e referência ao original.
  Ambos permanecem no histórico e entram uma vez na soma.
- Remover exige confirmação e oferece undo da sessão com mensagem verdadeira.
- Datas inválidas e notas antigas continuam acessíveis exatamente como salvas.
- Ordenar uma projeção para exibição, mantendo a ordem persistida do legado.
  Um eventual acumulado será “orçamento disponível após o lançamento”, não um
  saldo histórico de PP gastos: o sistema não tem snapshots desses gastos.

Não incluir neste escopo controle de combate, distribuição coletiva de PP, mestre
online, sincronização, autenticação ou snapshots completos a cada alteração.

### 4. Ativar/desativar sem apagar dados

Desativar suspende a participação do histórico no cálculo e restaura o orçamento
do modo padrão, com prévia numérica. O histórico permanece consultável e exportável.
Reativar recupera a mesma base e os lançamentos. Não usar “limpe primeiro”.

Cada editor fica vinculado ao ID da ficha e a uma revisão do lançamento. Trocar
de ficha fecha ou guarda o formulário apenas para sua origem; confirmações tardias
nunca executam sobre o personagem que passou a ficar ativo. Se a origem foi removida,
cancelar a ação. Undo/redo e autosave continuam operando no store existente.

### 5. Exportações e uso no celular

- JSON/JSONL: transportar todo o estado de campanha mesmo desativado.
- Excel: aba de Campanha traduzida, base, estado, histórico e acumulado; incluir
  histórico preservado com indicação de inatividade.
- PDF/HTML: resumo compacto e opção de incluir o histórico, desligada por padrão
  para não aumentar a ficha sem necessidade. Não inserir tabelas vazias no modo normal.
- Mobile: linhas viram cartões compactos, notas expandem e ações têm área de toque
  visível. Desktop/teclado: foco visível, labels associados, confirmações com foco
  restaurado e leitura acessível de valores negativos.

## Compatibilidade e migração sem perda

### Modelo aditivo implementado

Manter `campaignMode` e **`ppLog` como única fonte dos ajustes monetários de PP**.
Adicionar um objeto opcional de configuração:

```ts
campaign?: {
  version: 1;
  initialPowerLevel: number;
  initialPP: number;
};
```

Os registros mantêm `id`, `date`, `amount`, `note`. Metadados opcionais de tipo,
sessão e estorno podem ser adicionados sem substituir o conteúdo antigo. Não
manter uma segunda lista de eventos que também seja somada ao orçamento.

O schema é 2.1.0 para campos aditivos, mantendo importação de 1.0.0/2.0.0.
O envelope do rascunho permanece na versão 1; sua validação inclui o campo novo.
Versionar a configuração de campanha separadamente da versão do aplicativo.

### Contrato obrigatório

1. Ler o payload original sem gravar nem limpar nenhuma chave. Fazer backup exato
   dos rascunhos e dados relacionados antes da primeira regravação da migração,
   reaproveitando o fluxo de snapshot pré-atualização. Um backup persistente dedicado
   não pode ser apagado automaticamente pela limpeza dos backups temporários atuais.
2. Migrar uma cópia em memória após revisar a base no popup, adicionando `campaign`;
   conservar `campaignMode` inclusive quando desligado ou ausente. Importações
   diretas de arquivos antigos usam base fixa conservadora revisável no painel.
3. Conservar quantidade, ordem, IDs, datas, valores e notas de **todas** as entradas.
   Não converter negativos em positivos, não inferir “gasto” pela nota, não deduplicar
   IDs ou datas, não arredondar frações e não preencher datas inválidas com hoje.
4. Valores fracionários finitos criados pela UI antiga precisam de um caminho de
   leitura compatível e indicação de revisão, sem alterar o valor. A validação de
   novas entradas deve ser mais estrita que a leitura do legado.
5. Payloads realmente inválidos devem permanecer em recuperação com os bytes
   originais. Não descartar a linha/ficha nem substituir automaticamente por vazio.
6. Comparar o personagem completo antes/depois, excetuando apenas novos metadados
   permitidos. Identidade, poderes, modificadores, Resources, equipamentos, notas,
   PP registrados e NP atual não são modificados pela migração de campanha.
7. Calcular e comparar o orçamento: o total corresponde à base revisada no popup
   mais os ajustes, corrigindo a duplicação quando o NP inicial é informado.
   Com o modo desligado, o orçamento atual continua NP × 15.
8. A migração deve ser idempotente: executar novamente não cria lançamentos,
   estornos, IDs novos ou outra base; não altera a base já revisada.
9. Validar, persistir e reler a cópia candidata. Em falha/quota insuficiente,
   interromper e restaurar a origem, mantendo autosave protegido. Não tratar um
   aviso opcional de download como garantia de que existe um backup recuperável.
10. Atualizar **todos** os caminhos: tipos, defaults, schemas, normalização,
    sanitização JSON, importação, draft simples/múltiplo, snapshot JSONL,
    operações de duplicação, undo/redo e exportações. Campo novo declarado só
    no TypeScript será removido pelo schema ou pelo sanitizador atual.

Compatibilidade aqui significa que a versão nova carrega a antiga sem perder dados.
Uma versão antiga do app pode remover metadados novos ao reexportar e não entende
orçamento fixo. Não prometer ida/volta completa pela versão antiga. Qualquer formato
de exportação legado deve anunciar essa limitação; o backup completo continua sendo
o caminho para preservar todos os dados novos.

## Etapas entregues em commits lógicos

| Etapa | Entrega revisável | Verificação antes do commit |
|---|---|---|
| 1 — Integridade do modo atual | Validar novos PP/datas, data local, saldo negativo, mensagem de undo, correção do teto silencioso de NP na exportação | Roundtrip de NP acima de 15; rejeição de novas entradas inválidas; recuperação de frações legadas sem arredondamento |
| 2 — Modelo e migração | Configuração opcional, leitura aditiva, revisão de base e backup/rollback | Conteúdo preservado, total revisado, idempotência, quota e bytes originais |
| 3 — Orçamento central | Base fixa em todas as campanhas, prévia da migração, resumo compartilhado | NP muda limites sem conceder PP; ficha/Resources/PDF/Excel concordam |
| 4 — Painel e registro | Painel compacto, edição/estorno, sessão opcional, modo desativável sem apagar, vínculo explícito ao personagem | Adicionar/editar/estornar/remover/undo; troca de aba durante formulário e confirmação; negativos, datas e notas longas |
| 5 — Exportações | JSON/JSONL completos, Excel traduzido, histórico opcional no PDF/HTML | Exportar/importar/reabrir sem perda; campanha inativa; estorno soma uma vez; PDF não aumenta quando a opção está desligada |
| 6 — Acabamento e versão | PT/EN, foco/toque, documentação e versão minor do overhaul | Suite completa, lint, tipos, build, assets; navegador em 320/390/768/960px e desktop |

As etapas 1–3 foram agrupadas em `46b5a7c`; popup/painel em `7912e3f`, exportações
em `bc9e233` e acabamento de histórico/backup em `359f6f3`. A migração e o suporte de leitura vêm
antes de a interface produzir novos campos. Não mudar as mensagens existentes
do motor de regras ou sua política de modificadores neste overhaul.

## Critérios de aceite e evidência da auditoria

- Ficha antiga NP 10 com +15 continua com 165 após migração.
- Ficha antiga NP 11 com +15 e NP inicial revisado 10 migra para 165, mantendo +15.
- Campanha nova com base 150 e +15 continua com 165 ao subir NP 10 → 11.
- Compra de 3 PP na ficha reduz restante em 3, sem pedir dedução no registro.
- Desativar/reativar preserva 100% dos lançamentos e a configuração.
- JSON, JSONL e draft mantêm IDs/notas/valores; execução duplicada da migração
  não muda conteúdo; exportação não reduz NP maior que 15.
- UI não permite inserir frações novas; dados antigos com frações ficam íntegros.
- Estorno não apaga o original; undo é por ficha; formulários não vazam entre abas.
- Backup recuperável e rollback são testados com armazenamento cheio e falhas de escrita.

Foram executados **8 diagnósticos temporários**, com dados sintéticos, exercitando
calculador, ações, renderização SSR do painel, importação JSON e carregador de draft.
Confirmaram os seis comportamentos defeituosos descritos como reproduzidos e os
dois caminhos funcionais (undo e histórico inativo). Os diagnósticos ficaram em
`output/pdf/campaign-audit.test.ts`, fora da suíte versionada, pois descrevem o estado
auditado, não os comportamentos desejados, e foram removidos após criar regressões
permanentes. **33 testes existentes**, em cinco arquivos
de exportação/importação, migração, storage e histórico, também passaram.
Não foram acessados ou modificados rascunhos reais do navegador.

Os testes antigos de `exportCorrections.test.ts` para orçamento e acumulado somam
valores manualmente, sem executar o resumo central ou gerar o workbook. Por isso
seu sucesso não cobre os bugs de NP/orçamento nem garante a exportação de campanha.
O overhaul acrescentou regressões sobre as funções reais e workbooks gerados.
Resultado final: 64 arquivos / 792 testes, com migração revisada, backup/rollback,
ações por ID, roundtrip, exportações e verificação interativa de histórico longo.

## Referência de regras

O Hero's Handbook trata PP como orçamento de criação/progressão e NP como limite
decidido pelo mestre. O exemplo de avanço leva NP 10/150 PP a NP 11/**165 PP** após
15 PP concedidos, sem adicionar mais 15 só pela mudança de NP. A recomendação
de considerar +1 NP a cada 15 PP não é concessão automática nem deve virar bloqueio.

- [Advancement — d20HeroSRD](https://www.d20herosrd.com/character-creation/advancement/), consultado em 2026-10-02.
- Referência primária local: `docs/sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md`, seção “Hero Advancement & Improvement / Increasing Power Level”, perto das linhas 3113–3167.
