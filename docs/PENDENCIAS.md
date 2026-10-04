# Pendências e manutenção

Revisão: 04/10/2026, sobre o commit `19faac5` (v1.20.0).
Este é o ponto central para trabalho ainda aberto. As constatações abaixo vieram
da comparação entre documentação e código; não constituem uma nova certificação
das regras nem uma rodada de testes de navegador.

Manter apenas pendências, decisões abertas e limitações relevantes. Quando um
item terminar, removê-lo daqui. Descrever o comportamento resultante no guia
correspondente, sem criar relatório de conclusão, arquivo de auditoria encerrada
ou lista histórica de documentos removidos.

## Pendências confirmadas no código

### P01 — Prévia do impacto no orçamento — prioridade alta

**Contexto:** `src/features/power-builder/PowerBuilderOverlay.tsx` mostra o custo
do poder e confirma excesso de custo de alternativos. Não projeta o total da
ficha após substituir/criar o poder. `src/shared/hooks/useCalculatedPP.ts` expõe
PP/EP e excesso fora do editor; `getResourcePowerWarnings` trata avisos de bases,
não o orçamento do personagem após a edição.

**Escopo:** exibir custo anterior, diferença, orçamento e restante projetado,
reutilizando o resumo canônico. Distinguir poder próprio, dispositivo,
equipamento, contribuição compartilhada e recurso gratuito. A edição de um
recurso compartilhado pode afetar vários personagens e precisa identificar o
contexto da projeção.

**Critérios de aceite:** editar não conta o custo antigo e o novo simultaneamente; campanhas
usam sua base fixa; PP e EP respeitam suas preferências; avisos não impõem
bloqueios novos. Preview, ficha e exportações concordam sem gravar o rascunho.

### P02 — Ação efetiva e composições de duração — prioridade média

**Contexto:** `src/shared/lib/effectParameters.ts` resolve alcance e duração,
mas não ação. `semanticValidation.ts` tem verificações pontuais para Reaction
e Triggered. Na duração, somente o primeiro modificador é aplicado, com aviso
quando existem vários. Quatro receitas da biblioteca dependem de Aflição
Sustentada e permanecem apenas para consulta.

**Escopo:** consultar a fonte oficial antes de ampliar o modelo; separar
modificações na ação do efeito de Ativação global. Determinar quais composições
de duração são representáveis e quais exigem interpretação. Só então decidir
se as quatro receitas podem ser habilitadas.

**Critérios de aceite:** resolução e avisos consistentes para base, vinculados e alternativos,
incluindo modificadores repetidos. Manter escolhas do jogador/narrador e o
escopo dos modificadores específicos. Não corrigir preços de fichas antigas
silenciosamente nem habilitar receitas incompletas.

### P03 — Preferências de validação sem integração — prioridade média

**Contexto:** `enforceTrainedOnlySkills` aparece em tipos, presets e descrição,
mas não é consumido por uma validação de perícias/rolagens. `validateAffliction`
possui testes próprios, mas não é chamado pelo fluxo de validação de poderes.
A seleção de condições já tem interface; o problema é a integração, não criar
um seletor ausente.

**Escopo:** decidir se essas preferências devem produzir avisos na interface
ou deixar de ser anunciadas como funcionais. Para Aflição, adaptar os campos
reais e considerar Grau Limitado, Condição Extra e Condições Variáveis antes
de reutilizar um validador de configuração simplificada.

**Critérios de aceite:** cada preferência anunciada tem efeito observável e cobertura de
integração; não rejeita configurações válidas nem cria bloqueios para extras e
flaws genéricos. Preservar dados e escolhas de validação existentes.

### P04 — Apresentação de definições de regras legadas — prioridade média

**Contexto:** `src/data/powers.json` conserva `multiple_minions` com preço fixo
e `multiple_minions_ranked` por graduação do efeito; Cura conserva `persistent`
por graduação e `persistent_flat` fixo. A coexistência é deliberada para
preservar custos antigos, como explica `docs/power-library-rules.md`.

**Escopo:** tornar clara a diferença no catálogo e nas referências rápidas;
revisar descrições antigas contra a fonte oficial. Definir uma orientação para
novas compras sem substituir automaticamente os identificadores de poderes
existentes. Qualquer futura conversão requer revisão explícita, comparação
antes/depois e backup.

**Critérios de aceite:** o usuário identifica qual definição está usando; abrir, importar e
salvar sem conversão preserva o preço antigo. Divergências editoriais das
receitas continuam explicadas nos dados/na prévia e não viram correções
artificiais no motor.

### P05 — Tradução dos diagnósticos restantes — prioridade média

**Contexto:** `semanticValidation.ts` ainda cria mensagens diretamente em
inglês. O Builder usa `messageKey` quando disponível e mostra `message` nos
outros casos, inclusive em avisos sobre nomes vazios de alternativos.

**Escopo:** inventariar somente os diagnósticos que chegam ao usuário e
acrescentar chaves/parametrização nos dois idiomas. Tratar essa alteração em
um trabalho próprio: a limpeza documental não deve alterar mensagens.

**Critérios de aceite:** trocar idioma traduz avisos do aplicativo, preservando nomes e
notas do usuário, condições de disparo, severidade e política de salvamento.

### P06 — Manutenção do Builder e do menu — prioridade baixa

**Contexto:** o Builder tem aproximadamente 1.551 linhas e o MenuBar 781,
incluindo estilos; já existem funções, hooks e componentes extraídos. O tamanho
sozinho não comprova defeito. Scripts antigos de auditoria/adicionamento de
modificadores não são gates do projeto e podem recriar relatórios superados.

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
  leitor de tela e foco/diálogos empilhados. Avaliar automatizar poucos fluxos
  essenciais de navegador; os gates atuais não possuem uma suíte E2E dedicada.
- **Retrato portável:** estudar exportação/importação ZIP com ficha e imagem
  local, preservando JSON leve e o aviso sobre armazenamento no navegador.
- **Templates de recursos e personagens auxiliares:** avaliar demanda por
  itens comuns de equipamento/veículos/bases e fichas vinculadas de invocações,
  minions ou sidekicks. As três receitas que alteram atributos ausentes não
  devem ser liberadas como simples poderes por causa dessa possibilidade.
- **Armazenamento em pasta:** explorar apenas se houver decisão de criar uma
  versão desktop. Contas, backend e sincronização obrigatória continuam fora
  do escopo atual.
