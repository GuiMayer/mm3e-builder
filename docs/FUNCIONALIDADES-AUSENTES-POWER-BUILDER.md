# Estado Atual do Power Builder e Roadmap Feature-Complete

> **Avaliação histórica (v1.9.0).** Este roadmap foi congelado para preservar o diagnóstico daquela versão. Não use seus estados de implementação, contagens de testes ou próximos passos como descrição do produto atual. Para a arquitetura atual, consulte [ARCHITECTURE_REFINED.md](./ARCHITECTURE_REFINED.md).

**Data de atualizacao:** 17 de maio de 2026  
**Versao analisada:** 1.9.0 (commits recentes: f169a0f, 7b104d9, fcc7cf7)  
**Escopo:** criador de poderes/equipamentos em `src/features/power-builder/`, validacoes puras em `src/shared/lib/`, calculos globais em `src/shared/hooks/`, dados em `src/data/` e tipos em `src/entities/`.

---

## Avaliacao Geral de Utilidade (17/05/2026)

**Score: 8/10 — Strong**

A aplicacao e **altamente funcional e completa** para criacao de personagens de M&M 3e. Para um jogador real, ela resolve os principais problemas do sistema: calculo automatico de PP, validacao de regras complexas, e construcao de poderes com arrays. E **utilizavel em producao hoje**.

### Cobertura por Arquetipo

- **70-80% dos arquetipos** (Paragon, Powerhouse, Mystic, Speedster, Energy Controller): ferramenta **completa**
- **20-30% restantes** (Battlesuit, Gadgeteer, Summoner): **funcional mas incompleta** (falta Equipment Builder detalhado, Minions/Sidekicks)

### Lacunas Criticas Identificadas

- **MEDIUM**: Equipamentos limitados (falta detalhamento de armas, veiculos, headquarters)
- **MEDIUM**: Sem Minions/Sidekicks (personagens summoners precisam de ficha separada)
- **LOW**: Validacao de Complicacoes aceita texto livre sem guidance
- **LOW**: Sem testes E2E (regressoes em integracoes podem passar despercebidas)

### Proximos Passos Recomendados

1. Equipment Builder basico (maior impacto funcional)
2. Testes E2E com Playwright (maior impacto em confiabilidade)
3. Minions/Sidekicks (completa arquetipos restantes)

---

## Resumo Executivo

O Power Builder ja e utilizavel para criar poderes comuns e moderadamente complexos de M&M 3E. O fluxo atual cobre nome, descritores, efeitos, ranks, modificadores, custo por componente, custo fracionario no motor, Alternate Effects, Removable, custo variavel, campos configuraveis obrigatorios, validacao local de PL e modo de equipamento em EP.

**Atualizacao 17/05/2026:** Tres itens essenciais foram implementados e verificados:

- **E7**: Comunicacao visual de custo fracionario (`1 PP / N ranks`)
- **E3**: Validacao de modificadores duplicados com flag `enforceDuplicateModifiers`
- **E6**: Identidade de Alternate Effects com nomes padrao estaveis e validacao de duplicacao

O projeto ainda nao deve ser chamado de **feature-complete** porque restam lacunas que podem deixar a ficha ambigua ou ilegal sem aviso claro: impacto de PP/EP antes de salvar e validacao de economia de acao.

---

## Ja Implementado

| Area | Estado atual | Evidencia |
|---|---|---|
| Power Descriptors | Implementado | `ICharacterPower.descriptors`, UI em `PowerBuilderOverlay.tsx`, exibicao em `PowersList.tsx` |
| Empty Component Detection | Implementado | `handleSave()` bloqueia salvar sem componente valido |
| Variable Cost Powers UI | Implementado | `VariableCostSelector` no poder principal e em AEs |
| Configurable Fields UI | Implementado | `ConfigurableFieldSelector` no poder principal e em AEs |
| Required Field Validation | Implementado | `validatePowerForSave()` valida campos obrigatorios via `validateRequiredPowerFields()` |
| Reset de dados obsoletos ao trocar efeito | Implementado | `variableCostOption` e `fieldValues` sao limpos ao trocar efeito |
| Local PL validation no builder | Implementado | `usePowerCostCalculation.ts` usa `calcAttackBonus()` e considera AEs |
| No-roll attack cap | Implementado | ataques sem rolagem usam limite `rank <= PL` |
| Modifier incompatibility validation | Implementado | `validateIncompatibleModifiers()` roda via `validateComponentModifiers()` quando a regra esta ativa |
| Modifier max ranks defensivo | Implementado | `validateModifierMaxRanks()` roda no salvamento via `validatePowerForSave()` |
| Modifier duplicate validation | Implementado | `validateDuplicateModifiers()` detecta modificadores duplicados, flag `enforceDuplicateModifiers` em `IValidationRules` |
| Fractional cost engine | Implementado no motor | `getComponentCostBreakdown()` retorna `isFractional` e `ranksPerPP` |
| Fractional cost UI | Implementado | `PowerBuilderOverlay.tsx` e `AltEffectCard.tsx` mostram `1 PP / N ranks` quando `isFractional` |
| Alternate Effects basicos | Implementado | `useAlternateEffects.ts`, `AltEffectCard.tsx`, `calculateArrayCost()` |
| AE name uniqueness | Implementado | `getNextAlternateEffectName()` gera nomes padrao estaveis, `validatePowerForSave()` detecta duplicacao |
| Equipment EP engine | Implementado | `calcEquipmentEPCost()`, `EquipmentNotesPanel.tsx`, `useCalculatedPP.ts` |
| Equipment Mode cost no builder | Implementado | footer do builder usa `equipmentEPCost` quando `equipmentMode` esta ativo |

---

## Essenciais Ainda Pendentes

### E4. Action economy validation

**Estado:** ausente.

Os dados de efeito possuem `action`, mas o builder ainda nao valida combinacoes que geram economia de acao contraditoria ou mecanicamente suspeita. Esse item precisa consultar as regras do livro antes de virar bloqueio duro, porque parte dos modificadores de acao pode depender de interpretacao ou de contexto.

**Criterio de aceitacao:**

- O builder identifica modificadores que alteram acao do efeito.
- Combinacoes impossiveis ou contraditorias geram erro ou aviso conforme `validationRules`.
- A validacao cobre componentes principais e AEs.
- Casos incertos entram como warning, nao como bloqueio, ate a regra estar bem modelada.

### E5. PP/EP budget awareness no fluxo de criacao

**Estado:** ausente no builder, implementado fora dele.

A ficha ja calcula o total de PP e o painel de equipamento ja calcula limite de EP pela vantagem Equipment. O builder, porem, ainda nao mostra claramente o impacto antes de salvar um poder/equipamento e nao alerta no proprio fluxo se a nova entrada estourar o orcamento.

**Criterio de aceitacao:**

- Ao criar ou editar poder, o builder mostra impacto estimado em PP.
- Ao criar ou editar equipamento, o builder mostra impacto estimado em EP.
- Se `enforcePPBudget` estiver desligado, o builder nao pinta nem bloqueia por estouro de PP.
- Se o modo equipamento estiver ativo, o aviso usa o limite de EP, nao o limite de PP.
- O salvamento avisa antes de confirmar algo que estoure o orcamento quando a regra estiver ativa.

---

## Fases De Implementacao

### ✅ Fase 1 - Comunicacao de custo fracionario (CONCLUIDA)

**Status:** Implementado em commit `fcc7cf7`.

**Itens cobertos:** E7.

**Arquivos modificados:**

- `src/features/power-builder/PowerBuilderOverlay.tsx`
- `src/features/power-builder/AltEffectCard.tsx`

**Resultado:**

- Badge visual mostra `1 PP / N ranks` quando `breakdown.isFractional` e verdadeiro.
- Estilo diferenciado para custo fracionario.
- Componentes principais e AEs exibem a informacao.

### ✅ Fase 2 - Validacao de stacking/duplicacao de modificadores (CONCLUIDA)

**Status:** Implementado em commit `7b104d9`.

**Itens cobertos:** E3.

**Arquivos modificados:**

- `src/shared/lib/modifierValidation.ts` — nova funcao `validateDuplicateModifiers()`
- `src/shared/lib/semanticValidation.ts` — integrado em `validateComponentModifiers()`
- `src/entities/types.ts` — adicionado `enforceDuplicateModifiers` em `IValidationRules`
- `src/shared/lib/validationRules.ts` — defaults, permissive, strict, sandbox
- `src/shared/ui/MenuBar.tsx` — toggle no menu de validacao
- `src/locales/en/translation.json` e `src/locales/pt-BR/translation.json` — traducoes
- `src/__tests__/modifierRestrictions.test.ts` — testes de duplicacao
- `src/__tests__/powerSpecificModifiers.test.ts` — ajustes

**Resultado:**

- Salvamento detecta `modifierId` duplicado em componentes principais e AEs.
- Mensagem indica modificador duplicado e sugere usar ranks.
- Flag `enforceDuplicateModifiers` controla a validacao.

### ✅ Fase 3 - Identidade de Alternate Effects (CONCLUIDA)

**Status:** Implementado em commit `f169a0f`.

**Itens cobertos:** E6.

**Arquivos modificados:**

- `src/features/power-builder/hooks/useAlternateEffects.ts` — funcao `getNextAlternateEffectName()`
- `src/shared/lib/semanticValidation.ts` — validacao de nomes vazios e duplicados
- `src/features/power-builder/PowerBuilderOverlay.tsx` — fallback `AE N` em mensagens
- `src/__tests__/semanticValidation.test.ts` — novo arquivo de testes

**Resultado:**

- Novos AEs recebem nome padrao estavel (`AE 1`, `AE 2`, etc.)
- Nomes vazios geram warning no salvamento.
- Nomes duplicados geram erro no salvamento (case-insensitive).
- Mensagens de validacao usam nome ou fallback confiavel.

### Fase 4 - PP/EP budget awareness dentro do builder (PENDENTE)

**Objetivo:** mostrar o impacto antes de salvar e avisar quando o usuario vai estourar PP/EP.

**Itens cobertos:** E5.

**Arquivos provaveis:**

- `src/features/power-builder/PowerBuilderOverlay.tsx`
- `src/shared/hooks/useCalculatedPP.ts`
- `src/shared/lib/mathEngine.ts`
- `src/features/sheet-core/EquipmentNotesPanel.tsx`, se precisar alinhar mensagens de EP

**Saida esperada:**

- Indicador de impacto de PP para poderes.
- Indicador de impacto de EP para equipamentos.
- Respeito total a `enforcePPBudget`.
- Aviso antes de salvar quando a regra estiver ativa e houver estouro.

### Fase 5 - Action economy validation

**Objetivo:** validar ou avisar sobre combinacoes de acao mecanicamente contraditorias.

**Itens cobertos:** E4.

**Arquivos provaveis:**

- `docs/sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md`
- `docs/sources/Mutants & Masterminds 3 - Powers.md`
- `docs/sources/Mutants & Masterminds 3 - Modifiers.md`
- `src/shared/lib/modifierValidation.ts`
- `src/shared/lib/semanticValidation.ts`
- `src/shared/lib/validationRules.ts`

**Saida esperada:**

- Levantamento das regras oficiais relevantes.
- Validacao inicial para casos seguros.
- Casos interpretativos como warning.
- Cobertura para componentes principais e AEs.

---

## QOL Importante, Mas Nao Essencial

Estes itens melhoram velocidade, onboarding e ergonomia, mas nao impedem uma ficha legal/usavel se as validacoes essenciais acima existirem.

| Item | Motivo |
|---|---|
| Duplicate Power/Component | Acelera montagem de poderes parecidos |
| Modifier Search in Applied List | Ajuda em poderes muito carregados |
| Cost Breakdown Tooltip detalhado | Melhora explicabilidade do calculo, mas nao substitui E7 |
| Power Comparison View | Ajuda otimizacao, nao legalidade basica |
| Modifier Recommendations | Onboarding e sugestoes |
| Bulk Modifier Operations | Conveniencia para edicoes repetitivas |
| Rich Text Notes | Organizacao narrativa |
| Keyboard Shortcuts | Produtividade |
| Power Import/Export JSON | Compartilhamento e backup individual |
| Templates/Presets | Criacao mais rapida |
| Power to Equipment Converter | Conveniencia entre fluxos |
| Character Sheet Preview dentro do builder | UX; a ficha ja existe fora do modal |
| Undo/Redo | Conforto e seguranca de edicao |

---

## Fora Do Escopo De Feature-Complete Local

Esses recursos podem ser bons para produto, mas nao devem bloquear o marco de feature-complete do criador local.

| Item | Classificacao |
|---|---|
| Community Power Library | Produto/comunidade |
| AI Power Assistant | Produto/assistente |
| Suggested Alternate Effects | Assistencia criativa |
| Power History/Changelog detalhado | Auditoria avancada |
| Marketplace/importacao remota | Ecossistema |

---

## Observacoes Tecnicas

- `PowerBuilderOverlay.tsx` ainda concentra muita UI e regra inline. As proximas fases devem preferir funcoes puras em `src/shared/lib/` e apenas integrar o resultado no componente.
- `validatePowerForSave()` ja e o ponto correto para validacoes de salvamento do builder.
- `validateComponentModifiers()` ja centraliza validacoes de modificador; stacking/duplicacao deve entrar nesse fluxo.
- `calcEquipmentEPCost()` e a fonte correta para total de EP. Qualquer UI de equipamento deve convergir para essa funcao.
- O custo fracionario ja esta no breakdown; a lacuna e visual, nao matematica.
- Se houver duvida de regra, consultar `docs/sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md`, `docs/sources/Mutants & Masterminds 3 - Powers.md` e `docs/sources/Mutants & Masterminds 3 - Modifiers.md`.

---

## Sequencia Recomendada

1. ✅ ~~Fase 1: aviso visual de custo fracionario~~ (CONCLUIDA)
2. ✅ ~~Fase 2: stacking/duplicacao de modificadores~~ (CONCLUIDA)
3. ✅ ~~Fase 3: identidade e nomes de AEs~~ (CONCLUIDA)
4. Fase 4: impacto PP/EP no builder (PENDENTE)
5. Fase 5: economia de acao com consulta nas regras oficiais (PENDENTE)

---

## Conclusao

O projeto ja cobre os requisitos basicos para criar poderes usaveis, incluindo custo variavel, campos obrigatorios, PL local, AEs e EP de equipamento.

**Progresso recente (17/05/2026):** Tres fases essenciais foram concluidas:

- ✅ **Fase 1 (E7):** Comunicacao visual de custo fracionario implementada
- ✅ **Fase 2 (E3):** Validacao de modificadores duplicados implementada
- ✅ **Fase 3 (E6):** Identidade de Alternate Effects implementada

**Criterio restante para feature-complete:** O Power Builder ainda precisa de duas implementacoes finais:

1. **Fase 4 (E5):** Mostrar impacto de PP/EP antes de salvar e avisar quando o usuario vai estourar o orcamento
2. **Fase 5 (E4):** Avisar combinacoes de acao problematicas conforme regras oficiais

Com essas duas fases, o builder nao permitira estado ambiguo de modificadores, nao escondera identidade de AEs, comunicara custo fracionario, mostrara impacto de PP/EP antes de salvar e avisara combinacoes de acao problematicas.

**Avaliacao geral:** Score 8/10 — A aplicacao e altamente funcional e utilizavel em producao hoje para 70-80% dos arquetipos de M&M 3e. As lacunas restantes sao features avancadas (Equipment Builder detalhado, Minions/Sidekicks) e polish (testes E2E), nao problemas fundamentais.
