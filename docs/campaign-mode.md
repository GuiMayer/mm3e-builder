# Modo campanha / Campaign mode — v1.17.0

## Português

O modo campanha controla o avanço de PP de cada personagem. O painel fica logo
após o cabeçalho e aproveita Série e Mestre nos detalhes existentes da ficha.
Não há cadastro de campanha, conta, grupo compartilhado ou sincronização.

**Disponível = PP iniciais + soma do histórico; restante = disponível − custo da ficha.**
Ao ativar pela primeira vez, a base sugerida é NP × 15. A base fica fixa e pode
ser editada em Opções de orçamento, com prévia. Subir o NP muda os limites de
construção, sem conceder PP. Uma ficha com base 150 e prêmio +15 tem 165 PP,
mesmo depois de subir do NP 10 para 11.

Comprar características já aumenta o custo da ficha. Uma dedução no histórico é
um ajuste do orçamento, não uma compra; registrar ambos para a mesma compra
reduziria o restante duas vezes. O painel mantém os números mesmo quando a
conferência global do orçamento está desligada.

### Registro e controles

- Registrar PP sugere um prêmio de +1. Prêmios são positivos; ajustes aceitam
  valores positivos ou negativos. Novos valores são inteiros, diferentes de zero,
  entre -1.000.000 e 1.000.000 PP; a data é válida e usa o dia local.
- Sessão é opcional. Notas completas podem ser expandidas. Editar conserva o ID;
  estornar acrescenta o valor oposto com referência ao original. Estornar não
  apaga o original nem recalcula um estorno anterior ao editar outro lançamento.
- Remover exige confirmação. Adição, edição, estorno, base e ativação participam
  do desfazer/refazer da ficha, disponível apenas durante a sessão atual.
- A partir de dez lançamentos aparecem busca e ordem de exibição. Essas opções
  não mudam a ordem persistida. A busca inclui nota, sessão, data e valor.
- Trocar de aba fecha o formulário; confirmações pendentes continuam vinculadas
  à ficha original e recusam lançamentos alterados enquanto estavam abertas.
- Desativar preserva a base e o histórico e usa novamente NP atual × 15.
  Reativar recupera a mesma base e lançamentos.

### Migração dos rascunhos antigos

Ao abrir o app, um popup aparece **somente se um personagem antigo no
localStorage usava campanha**: `campaignMode=true` ou histórico não vazio,
inclusive quando o modo havia sido desativado. Fichas padrão sem histórico e
fichas já migradas não recebem esse popup. O aviso geral de backup antes de uma
atualização continua separado e pode aparecer para qualquer rascunho.

O formato antigo não guardava o NP inicial. Por isso, o popup pede revisão por
personagem antes de concluir a migração: informe o NP inicial ou os PP iniciais
personalizados e confira o total antes/depois. Exemplo: NP atual 11, prêmio +15,
NP inicial 10 → base 150 e total 165, corrigindo os 180 do cálculo anterior.
O app não tenta adivinhar a base por notas ou apagar PP aparentemente duplicados.

Antes de gravar, salva e relê uma cópia exata dos dados originais em
`mm3e-campaign-migration-backup-v1`. O popup permite baixá-la; após migrar, o botão
permanece em Opções de orçamento. Esse backup inclui todos os personagens e
Resources daquele momento e pode ser restaurado por Importar Rascunho. Restaurar
substitui o conjunto local inteiro após confirmação e exige revisar a migração
novamente. A limpeza automática de backups temporários não remove essa cópia;
Limpar todos os dados, ação explícita do usuário, remove os dados locais.

Se o backup ou a gravação falha, a migração é interrompida e o autosave permanece
protegido; falhas de gravação tentam restaurar a origem. Se outra aba alterou os
rascunhos, o app pede recarregamento e não sobrescreve a versão nova.

A migração adiciona apenas `{version:1, initialPowerLevel, initialPP}` ao
personagem. Conserva NP atual, IDs, ordem, datas, notas e valores dos lançamentos,
inclusive frações, datas antigas inválidas e IDs duplicados. Frações antigas podem
ser lidas e estornadas ou ter notas editadas sem arredondamento; novos prêmios e
ajustes precisam respeitar a validação atual. Poderes, modificadores, custos de
características e avisos do motor não foram alterados por este overhaul.

### Arquivos e exportações

- JSON usa schema **2.1.0**; importação continua aceitando 1.0.0/2.0.0.
  JSON e JSONL preservam configuração e histórico mesmo com campanha desligada,
  inclusive NP acima de 15. O envelope dos rascunhos continua na versão 1.
- Arquivos antigos importados diretamente usam uma base fixa conservadora de
  NP atual × 15, mantendo o total inicial. Revise a base em Opções de orçamento.
  O popup de revisão é para os rascunhos antigos já salvos no localStorage.
- Excel inclui aba Campanha traduzida, estado, NP inicial/atual, base, totais e
  registros em ordem persistida, mesmo com o modo desativado. O acumulado é o
  orçamento de campanha após cada lançamento; não é um histórico de gastos.
- No PDF/HTML padrão, Histórico de campanha é uma opção desligada por padrão,
  independente do modo Preencher à mão. Quando escolhida, inclui resumo e tabela,
  com cabeçalhos repetidos nas continuações. O template oficial legado conserva
  seu layout fixo e não oferece essa seção adicional.
- Versões antigas do app não entendem a base fixa e podem remover os novos
  metadados ao reexportar. A compatibilidade garantida é ler fichas antigas no
  aplicativo novo, preservando seus dados.

## English

Campaign budgets use fixed starting PP plus the ledger. PL controls character
limits and never grants PP by itself. Purchases are already counted in character
costs; do not add another ledger deduction for the same purchase.

The compact panel supports awards, signed adjustments, optional sessions, full
notes, editing, reversal entries, confirmation before removal and session undo.
New amounts must be nonzero integers within ±1,000,000; dates use the local day.
Search and display order appear at ten entries. Switching tabs closes the form;
pending confirmations remain attached to their original character. Disabling
preserves the ledger/configuration while using the standard current PL × 15.

Startup review is shown only for old locally saved characters that used campaign
mode or retain a ledger. Users review starting PL/PP and before/after totals before
migration. A verified full raw backup is saved first and can be downloaded from
the popup or campaign budget options. Original ledger IDs, order, notes, dates
and finite fractions are preserved. Repeated loads do not migrate again.

JSON 2.1.0 and JSONL preserve inactive campaigns; historical JSON 1.0/2.0 remains
readable. Direct imports of older files conservatively freeze current PL × 15;
users can review the starting budget in the panel. Excel includes a localized
campaign sheet, including inactive history. HTML-based PDF offers opt-in campaign
history, disabled by default. Older app versions do not support the new fixed
budget. Characteristic pricing, modifier policy and rule warnings are unchanged.

Validation: 64 test files / 792 tests, type checking, lint, production build and
static assets; isolated browser checks at 320/390/768/960px and desktop, reviewed
legacy migration, tab isolation and seven-page PDF history with an oversized note.
