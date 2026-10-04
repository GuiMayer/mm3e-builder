# Pendências e manutenção

Revisão: 04/10/2026, sobre o commit `c621750` (v1.20.0).
Este é o ponto central para trabalho ainda aberto. As constatações abaixo vieram
da comparação entre documentação e código; não constituem uma nova certificação
das regras nem uma rodada de testes de navegador.

Manter apenas pendências, decisões abertas e limitações relevantes. Quando um
item terminar, removê-lo daqui. Descrever o comportamento resultante no guia
correspondente, sem criar relatório de conclusão, arquivo de auditoria encerrada
ou lista histórica de documentos removidos.

## Pendências confirmadas no código

### P02 — Aflição Sustentada na biblioteca — prioridade média

Friction Blindness, Friction Muzzle, Blinding Aura e Fifth Wheel of Weyan
continuam apenas para consulta. O Handbook define Duração Aumentada como
Instantâneo→Concentração ou Sustentado→Contínuo, e Sustentado genérico como
Permanente→Sustentado. A exceção de Anular não autoriza a mesma transição para
Aflição. O Power Profiles usa Aflição Sustentada nessas quatro receitas, mas
as fontes consultadas não definem uma composição geral com custo inequívoco.

Habilitar essas receitas depende de fundamentar essa definição ou aprovar uma
convenção explícita. Não usar um custo manual nem Sustentado genérico +0 para
forçar a fórmula impressa. A resolução geral de ação/duração está documentada
no [guia de cálculo](REGRAS_CALCULO_MM3E.md).

### P03 — Preferências de validação sem integração — prioridade média

**Contexto:** `enforceTrainedOnlySkills` aparece em tipos, presets e descrição,
mas não é consumido por uma validação de perícias/rolagens. `validateAffliction`
possui testes próprios, mas não é chamado pelo fluxo de validação de poderes.
Aflição declara apenas o campo estruturado de resistência no catálogo atual.
O `ConfigurableFieldSelector` genérico já existe, mas condições por grau não
estão ligadas a ele; receitas podem registrar condições nas notas.

**Escopo:** integrar as preferências como diagnósticos informativos, preservando
suas escolhas e defaults. Para Aflição, introduzir configuração opcional de
condições por grau nos campos existentes e adaptar o validador a Grau Limitado,
Condição Extra e Condições Variáveis. Não inferir condições a partir das notas
nem transformar ausência de dados legados em impedimento de salvamento.

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

## Plano de execução — prioridades alta e média

Escopo restante: P02–P04. P06 e possibilidades opcionais continuam fora desta execução.
Este plano deve ser removido por etapa concluída, mantendo o comportamento
resultante nos guias vigentes e apenas o trabalho aberto neste arquivo.

### Diretrizes de compatibilidade

- Reutilizar cálculos e resolução de fontes existentes. Nenhum orçamento ou
  preço editorial será armazenado como novo valor autoritativo da ficha.
- Prévia, diagnósticos e metadados de apresentação não entram em JSON/JSONL,
  histórico de edição ou armazenamento de personagens/recursos.
- Preservar IDs, graduações, opções, aplicações repetidas, notas, vínculos,
  base de campanha e preços das definições legadas.
- Avisos novos são informativos. Extras/flaws genéricos continuam disponíveis;
  modificadores específicos continuam restritos ao próprio efeito. Preservar
  os bloqueios estruturais atuais e a confirmação existente do limite de AE.
- Ação/duração efetivas são valores derivados; não reescrever poderes antigos
  para gravá-los. Não usar a ação derivada para alterar o preço contextual de
  Reação, que hoje depende da ação padrão do efeito.
- Condições estruturadas de Aflição serão opcionais, gravadas apenas por edição
  explícita em `fieldValues`, cujo contrato já aceita strings/arrays. Fichas
  antigas permanecem sem esses valores; as notas não serão apagadas ou convertidas.
  A abordagem proposta dispensa migração em massa e mudança do schema 2.2.0.
- Antes de qualquer necessidade adicional de formato, revisar arquivos históricos
  e atuais de teste. Se surgir alteração estrutural incompatível, definir versão,
  backup e migração antes da implementação; não preencher defaults por suposição.

### Sequência e commits propostos

| Etapa | Pendência | Entrega | Commit proposto |
| --- | --- | --- | --- |
| 7 | P03 | Configuração opcional e validação contextual de Aflição | `feat(power-builder): integrate optional affliction condition diagnostics` |
| 8 | P04 | Identificação de definições legadas e orientação de compra | `fix(catalog): distinguish legacy modifier definitions` |

P05 precede os novos diagnósticos de P02/P03 para
que eles já usem o contrato de tradução. P03/Aflição depende dos parâmetros e da
resolução de fontes de P02. A etapa 5 é condicional: se a fonte não definir uma
composição inequívoca, manter as quatro receitas para consulta, documentar a
decisão aberta em P02 e não criar um commit que habilite receitas incompletas.
Cada commit inclui testes relevantes e atualização do guia correspondente.
Não atribuir uma versão nova antes de consolidar o escopo implementado.

### P03 — Integração das preferências

**Aflição:**

- Não conectar diretamente o helper atual, que exige uma condição em cada grau.
  Adaptar a configuração a arrays opcionais por grau, graus ativos e modo variável,
  usando `fieldValues` e opções de modificadores já aceitos pelo modelo.
- Acrescentar uma seção recolhível de condições. Ela deve permitir compras com
  Grau Limitado, seleção explícita dos graus usados em receitas do Power Profiles,
  múltiplas condições por Condição Extra e condições escolhidas no uso quando
  houver Condições Variáveis. Não esconder/apagar seleções ao remover um modifier.
- Validar somente informação estruturada disponível. Configuração legada apenas
  nas notas é não verificada, sem erro por condições vazias; não usar extração
  automática de texto. Compras novas podem receber orientação de preenchimento,
  sem novos campos obrigatórios no schema ou bloqueios de combinação.
- Consultar as regras do Handbook p. 149–150 e Power Profiles p. 80. Condição Extra
  acrescenta condições por grau; não é simplesmente uma alternativa escolhida
  depois do acerto. Resistência inicial, recuperação e Resistência Alternativa
  exigem avaliação conjunta; o helper simplificado não deve rejeitar variantes
  só por esperar Fortitude/Vontade em um único campo.
- Integrar avisos ao Builder para base/Linked/AE e recursos, com a preferência
  `enforceAfflictionProgression`, independentemente de `enforcePLLimits`.
  Preservar o default e presets atuais. As condições
  estruturadas devem aparecer nas referências e exportações, sem substituir notas.
- Testar configurações padrão; apenas um/dois graus; terceiro grau apenas;
  aplicações repetidas de Grau Limitado; Condição Extra; Condições Variáveis em
  todos/um grau; resistência alternativa; dados legados; aplicação de receita;
  flag ligado/desligado; abrir/salvar sem editar e round-trip dos novos valores.

**Aceite conjunto:** as duas preferências têm efeito observável e isolado, com
avisos traduzidos e testes de integração. Nenhuma delas cria um impedimento novo
para salvar extras/flaws genéricos ou reescreve a ficha ao carregar.

### P04 — Definições legadas no catálogo

**Implementação:**

1. Conferir nomes e descrições contra a fonte: Invocar/Múltiplos Lacaios no
   Handbook p. 181 e Cura/Persistente p. 163. Preservar `multiple_minions`,
   `multiple_minions_ranked`, `persistent` e `persistent_flat`, inclusive custos.
2. Acrescentar metadados de apresentação do catálogo, sem gravá-los na ficha:
   versão recomendada para novas compras, definição legada e ID correspondente.
   Mostrar rótulo Legado e modalidade real de preço na paleta, controles aplicados,
   tooltip e caixa de referência; não substituir a identidade por nomes traduzidos.
3. Ordenar/orientar novas compras para as definições atuais, mantendo acesso às
   anteriores. Poder já salvo com definição legada continua visível e editável.
   Texto de referência deve distinguir regra atual de preço legado preservado,
   sem afirmar que uma compra por graduação é a compra fixa do livro.
4. Confirmar que receitas usam as definições atuais e que importação/exportação
   mantêm as antigas. Não acrescentar conversão automática ou ação de conversão
   nesta etapa; uma futura conversão exigiria escopo próprio, comparação e backup.

**Regressões e aceite:** os quatro IDs nos dois idiomas; lista/tooltip/referência;
poder próprio e recurso; importação histórica; edição sem troca do modifier;
round-trip e custos antes/depois iguais. Haverá orientação clara de compra sem
alteração silenciosa de dados ou cálculos.

### Validação e encerramento

- Executar testes relevantes por etapa e os gates completos ao consolidar o
  pacote: lint, typecheck, Vitest, build e verificação de arquivos estáticos.
- Verificar a interface com fichas sintéticas em 390, 768, 960 e 1440 px, ambos
  os idiomas, teclado/foco e temas claro/escuro. Conferir orçamento sem ocupar
  excessivamente o rodapé nem ocultar controles de salvar/fechar.
- Conferir JSON/JSONL e abrir exportações reais PDF/Excel nos cenários afetados.
  Comparar custos de fixtures existentes; nenhuma mudança de diagnóstico ou
  apresentação deve produzir alteração de preço.
- Revisar o diff de persistência: novos valores de Aflição somente por edição
  explícita; nenhum rewrite ao abrir, nenhum descarte de notas/aplicações/IDs,
  nenhuma substituição de catálogo legado ou revisão automática de recursos.
- Atualizar guias de cálculo, política de modificadores, biblioteca, recursos,
  contribuição/testes quando afetados. Remover itens/etapas concluídos deste
  arquivo; manter apenas limitações realmente abertas. Notas de versão descrevem
  comportamento entregue, sem relatório de conclusão ou inventário de auditoria.
- Push, tag e acompanhamento de deploy ficam para solicitação de publicação.

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
