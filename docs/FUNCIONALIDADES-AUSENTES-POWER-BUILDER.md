# Estado Atual do Power Builder e Roadmap Feature-Complete

**Data de atualizacao:** 16 de maio de 2026  
**Versao analisada:** 1.9.0  
**Escopo:** criador de poderes/equipamentos em `src/features/power-builder/`, validacoes puras em `src/shared/lib/`, calculos globais em `src/shared/hooks/`, dados em `src/data/` e tipos em `src/entities/`.

---

## Resumo Executivo

O Power Builder ja e utilizavel para criar poderes comuns e moderadamente complexos de M&M 3E. O fluxo atual cobre nome, descritores, efeitos, ranks, modificadores, custo por componente, custo fracionario no motor, Alternate Effects, Removable, custo variavel, campos configuraveis obrigatorios, validacao local de PL e modo de equipamento em EP.

Depois do diagnostico mais recente, dois itens que ainda estavam marcados como parciais no documento foram reclassificados como **implementados no codigo atual**:

- Validacao defensiva de `maxRanks` no salvamento.
- Consistencia do total exibido em `equipmentMode` usando `calcEquipmentEPCost()`.

O projeto ainda nao deve ser chamado de **feature-complete** porque restam lacunas que podem deixar a ficha ambigua ou ilegal sem aviso claro: duplicacao/stacking de modificadores, nomes de Alternate Effects, comunicacao visual de custo fracionario, impacto de PP/EP antes de salvar e validacao de economia de acao.

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
| Fractional cost engine | Implementado no motor | `getComponentCostBreakdown()` retorna `isFractional` e `ranksPerPP` |
| Alternate Effects basicos | Implementado | `useAlternateEffects.ts`, `AltEffectCard.tsx`, `calculateArrayCost()` |
| Equipment EP engine | Implementado | `calcEquipmentEPCost()`, `EquipmentNotesPanel.tsx`, `useCalculatedPP.ts` |
| Equipment Mode cost no builder | Implementado | footer do builder usa `equipmentEPCost` quando `equipmentMode` esta ativo |

---

## Essenciais Ainda Pendentes

### E3. Modifier stacking rules

**Estado:** parcial.

O builder ja valida incompatibilidades declaradas em `incompatibleWith` e `maxRanks`, mas ainda falta bloquear duplicacao do mesmo modificador quando isso cria um estado ambiguo. Hoje um componente ainda pode receber o mesmo `modifierId` mais de uma vez se isso vier de estado antigo, importacao futura, bug de UI ou edicao programatica.

**Criterio de aceitacao:**

- O salvamento detecta `modifierId` duplicado em cada componente principal.
- O mesmo vale para componentes dentro de AEs.
- A mensagem indica componente/AE e modificador duplicado.
- Casos permitidos por ranks continuam usando um unico modificador com `ranks > 1`, nao entradas duplicadas.

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

### E6. AE name uniqueness e identidade de slots

**Estado:** ausente.

Nomes duplicados ou vazios de Alternate Effects nao quebram o custo, mas prejudicam leitura, validacao, relatorios e mensagens de erro. Para uma ficha final confiavel, cada slot de array precisa ser distinguivel.

**Criterio de aceitacao:**

- AEs sem nome recebem nome padrao estavel ou geram aviso no salvamento.
- Nomes duplicados geram erro ou aviso conforme regra ativa.
- Mensagens de validacao apontam para o AE correto mesmo quando o usuario nao nomeou o slot.

### E7. Aviso visual claro de custo fracionario

**Estado:** calculo implementado, comunicacao visual limitada.

O motor calcula corretamente custo fracionario (`1 PP por N ranks`), mas a UI ainda nao comunica isso com clareza suficiente. O usuario precisa ver quando ranks e flaws estao sendo interpretados por regra fracionaria.

**Criterio de aceitacao:**

- Componentes principais mostram `1 PP / N ranks` quando `breakdown.isFractional` for verdadeiro.
- AEs mostram a mesma informacao.
- O custo fracionario aparece no breakdown/card do componente, nao apenas em teste ou funcao interna.

---

## Fases De Implementacao

### Fase 1 - Comunicacao de custo fracionario

**Objetivo:** deixar explicito na UI quando um componente usa regra de custo fracionario.

**Itens cobertos:** E7.

**Arquivos provaveis:**

- `src/features/power-builder/PowerBuilderOverlay.tsx`
- `src/features/power-builder/AltEffectCard.tsx`
- possivelmente `src/features/power-builder/components/PowerComponentEditor.tsx`, se for manter consistencia com o componente reutilizavel

**Saida esperada:**

- Badge ou linha no breakdown: `1 PP / N ranks`.
- Visual diferenciado para custo fracionario.
- Teste ou verificacao manual com um poder de custo fracionario.

### Fase 2 - Validacao de stacking/duplicacao de modificadores

**Objetivo:** impedir estados ambiguos onde o mesmo modificador aparece duplicado no mesmo componente.

**Itens cobertos:** E3.

**Arquivos provaveis:**

- `src/shared/lib/modifierValidation.ts`
- `src/shared/lib/semanticValidation.ts`
- `src/entities/types.ts`
- `src/shared/lib/validationRules.ts`
- testes em `src/__tests__/`

**Saida esperada:**

- Nova validacao pura para duplicados.
- Flag em `IValidationRules` e defaults.
- Salvamento bloqueia duplicados quando a regra estiver ativa.

### Fase 3 - Identidade de Alternate Effects

**Objetivo:** garantir que cada AE seja identificavel em validacoes, relatorios e leitura da ficha.

**Itens cobertos:** E6.

**Arquivos provaveis:**

- `src/shared/lib/semanticValidation.ts`
- `src/features/power-builder/hooks/useAlternateEffects.ts`
- `src/features/power-builder/AltEffectCard.tsx`
- testes em `src/__tests__/`

**Saida esperada:**

- AEs novas recebem nome padrao estavel ou validacao clara.
- Nomes duplicados sao detectados.
- Mensagens usam indice/nome do AE de forma confiavel.

### Fase 4 - PP/EP budget awareness dentro do builder

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

1. Fase 1: aviso visual de custo fracionario.
2. Fase 2: stacking/duplicacao de modificadores.
3. Fase 3: identidade e nomes de AEs.
4. Fase 4: impacto PP/EP no builder.
5. Fase 5: economia de acao com consulta nas regras oficiais.

---

## Conclusao

O projeto ja cobre os requisitos basicos para criar poderes usaveis, incluindo custo variavel, campos obrigatorios, PL local, AEs e EP de equipamento. Para chamar o Power Builder de feature-complete, o criterio restante deve ser: **nao permitir estado ambiguo de modificadores, nao esconder identidade de AEs, comunicar custo fracionario, mostrar impacto de PP/EP antes de salvar e avisar combinacoes de acao problematicas**.
