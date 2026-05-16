# Estado Atual do Power Builder e Funcionalidades Ausentes

**Data de atualizacao:** 16 de maio de 2026  
**Versao do MM3E Builder analisada:** 1.9.0  
**Escopo:** comparacao entre o documento anterior e o estado real do codigo em `src/features/power-builder/`, `src/shared/lib/`, `src/shared/hooks/`, `src/data/` e `src/entities/`.

---

## Resumo Executivo

O Power Builder ja e utilizavel para poderes simples: nome, descritores, efeitos, ranks, modificadores, notas, efeitos alternativos, custos basicos, arrays, Removable e avisos de incompatibilidade existem no fluxo principal.

Ainda havia quatro bloqueadores criticos para o app ser um criador de ficha confiavel em M&M 3E:

1. **Opcoes de custo variavel nao estavam integradas ao fluxo principal do builder.**
2. **Campos obrigatorios/configuraveis de poderes nao estavam integrados ao fluxo principal nem aos efeitos alternativos.**
3. **Validacao de campos obrigatorios existia em biblioteca, mas nao era executada no salvamento.**
4. **Validacao local de PL no builder usava `attackBonus = 0`, diferente da validacao global da ficha.**

Esses pontos afetam poderes comuns como Affliction, Illusion, Environment, Transform, Weaken, Nullify e Concealment. Sem eles, uma ficha podia ser salva com custos errados ou poderes mecanicamente incompletos.

---

## Estado Real Encontrado

### Ja implementado

| Item | Estado atual | Evidencia |
|---|---|---|
| 1.1 Power Descriptors | Implementado | `ICharacterPower.descriptors`, UI no `PowerBuilderOverlay.tsx`, exibicao no `PowersList.tsx` |
| 2.5 Modifier Incompatibility Warnings | Implementado | `modifierIncompatibilities` em `PowerBuilderOverlay.tsx` e `AltEffectCard.tsx` |
| 3.1 Modifier Max Ranks Enforcement | Parcialmente implementado | `NumberInput` recebe `max={def.maxRanks}`; faltava validacao final defensiva |
| 3.4 Fractional Cost | Calculo implementado, aviso visual limitado | `mathEngine.ts` retorna `isFractional` e `ranksPerPP` |
| 3.8 Empty Component Detection | Implementado | `handleSave()` filtra componentes vazios e bloqueia salvar sem efeito valido |
| Alternate Effects basicos | Implementado | `useAlternateEffects.ts`, `AltEffectCard.tsx`, `calculateArrayCost()` |
| Equipment EP cost engine | Parcialmente implementado | `calcEquipmentEPCost()` existe; UI ainda incompleta |
| PL global da ficha | Implementado fora do builder | `usePLValidation.ts` calcula ataque real com `calcAttackBonus()` |

### Parcialmente implementado, mas incompleto no fluxo principal

| Item | Estado atual | Problema |
|---|---|---|
| 1.2 Variable Cost Powers UI | Componentes e engine existem | `PowerBuilderOverlay.tsx` nao renderizava `VariableCostSelector` no fluxo principal |
| 1.8 Weaken/Transform Target Selection | Dados existem via `configurableFields` | Builder principal e AEs nao renderizavam `ConfigurableFieldSelector` |
| Required configurable fields validation | Funcoes existem | `validatePowerComponents()` nao era chamado no salvamento |
| 3.2 PL limits no builder | Existe uma checagem local | Usava `attackBonus = 0`, produzindo aviso incompleto |

### Ausente ou backlog

| Item | Impacto |
|---|---|
| 2.2 Duplicate Power/Component | Conveniencia, nao bloqueador |
| 2.3 Modifier Search in Applied List | UX para poderes complexos |
| 2.4 Cost Breakdown Tooltip | Clareza de calculo |
| 2.6 Undo/Redo | Conveniencia |
| 2.7 Power Comparison View | Otimizacao |
| 2.8 Modifier Recommendations | Onboarding |
| 2.9 Bulk Modifier Operations | Conveniencia |
| 2.10 Rich Text Notes | Conveniencia |
| 2.12 Keyboard Shortcuts | Conveniencia |
| 2.13 Power Import/Export | Compartilhamento/backup |
| 3.7 AE Name Uniqueness | Qualidade de dados |
| 3.9 Modifier Stacking Rules | Legalidade avancada |
| 3.10 Action Economy Validation | Legalidade avancada |
| 4.1 Auto-Calculate Accurate Ranks | Otimizacao |
| 4.2 Power Point Budget Tracker | Importante para ficha completa |
| 4.5 Equipment Mode Integration | Parcial, precisa completar |
| 4.6 Power to Equipment Converter | Conveniencia |
| 4.8 Power Dependencies | Validacao avancada |
| 4.9 Character Sheet Preview | UX |
| 4.11 Community Power Library | Longo prazo |
| 4.12 AI Power Assistant | Longo prazo |

---

## Bloqueadores Criticos

### B1. Variable Cost Powers UI

**Estado antes da correcao:** parcialmente implementado, nao integrado ao fluxo principal.

O projeto ja possuia:

- `IVariableCostOption` em `src/entities/types.ts`
- `variableCostOption` em `ICharacterPowerComponent`
- `VariableCostSelector.tsx`
- suporte em `calcComponentCost()` e `getComponentCostBreakdown()`
- opcoes em `src/data/powers.json`

Mas o fluxo renderizado diretamente em `PowerBuilderOverlay.tsx` nao mostrava a escolha de custo variavel. Assim, efeitos como Affliction, Illusion, Environment e Transform podiam cair no `baseCost` padrao e gerar custo incorreto.

**Criterio de aceitacao:**

- Cada componente principal com `effectDef.variableCost` deve renderizar seletor de custo.
- Cada componente de AE com `effectDef.variableCost` deve renderizar seletor de custo.
- Mudanca de efeito deve limpar `variableCostOption` anterior.
- O custo exibido deve usar a opcao escolhida.

### B2. Campos obrigatorios/configuraveis de poderes

**Estado antes da correcao:** parcialmente implementado, nao integrado ao fluxo principal.

O projeto ja possuia:

- `configurableFields` em `IPowerEffect`
- `fieldValues` em `ICharacterPowerComponent`
- `ConfigurableFieldSelector.tsx`
- dados em `powers.json` para Affliction, Concealment, Nullify, Weaken e outros

Mas a UI principal e os AEs nao renderizavam estes campos.

**Criterio de aceitacao:**

- Componentes principais devem renderizar `ConfigurableFieldSelector` quando o efeito tiver `configurableFields`.
- Componentes de AE devem renderizar os mesmos campos.
- Mudanca de efeito deve limpar `fieldValues` anteriores.

### B3. Validacao no salvamento

**Estado antes da correcao:** funcoes existiam, mas nao eram chamadas.

`validatePowerComponents()` e `validateRequiredPowerFields()` existem em `src/shared/lib/validation.ts`, mas o `handleSave()` do builder apenas filtrava componentes vazios e validava cap de AE.

**Criterio de aceitacao:**

- `handleSave()` deve bloquear salvamento quando qualquer componente principal valido estiver sem campo obrigatorio.
- `handleSave()` deve bloquear salvamento quando qualquer AE valido estiver sem campo obrigatorio.
- A mensagem deve indicar componente/AE e campo ausente.

### B4. Validacao local de PL no builder

**Estado antes da correcao:** incompleta.

`usePowerCostCalculation.ts` validava o maior rank contra PL usando `attackBonus = 0`. A validacao global em `usePLValidation.ts` e mais correta, pois usa `calcAttackBonus()` com dados reais da ficha.

**Criterio de aceitacao:**

- A validacao local do builder deve usar `calcAttackBonus()` quando possivel.
- Ataques `perception`/area/no-roll devem respeitar cap de rank <= PL.
- A validacao deve considerar componentes principais e AEs.

---

## Priorizacao Atual

### Fazer agora

1. Integrar custo variavel no `PowerBuilderOverlay.tsx`.
2. Integrar campos configuraveis no `PowerBuilderOverlay.tsx`.
3. Integrar campos configuraveis e custo variavel em `AltEffectCard.tsx`.
4. Bloquear salvamento com campos obrigatorios ausentes.
5. Corrigir validacao local de PL do builder para usar bonus de ataque real.
6. Adicionar testes de regressao para custo variavel/campos obrigatorios quando possivel.

### Proxima onda

1. Budget tracker real de PP total da ficha no builder.
2. Validacao defensiva final de `maxRanks` no salvamento.
3. Aviso visual claro para custo fracionario.
4. AE name uniqueness.
5. Action economy validation.
6. Modifier stacking rules.

### Backlog

1. Duplicate Power/Component.
2. Import/Export de poder em JSON.
3. Templates/Presets.
4. Recommendations.
5. Undo/Redo.
6. Community library e AI assistant.

---

## Observacoes Tecnicas

- Ha duplicacao entre `PowerComponentEditor.tsx` e o JSX inline de `PowerBuilderOverlay.tsx`. O ideal futuro e reutilizar `PowerComponentEditor` para reduzir divergencia, mas a correcao minima e integrar os seletores no fluxo inline existente.
- `ConfigurableFieldSelector.tsx` verifica `field.control === 'multi-select'`, enquanto o JSON usa ao menos um caso com `"control": "multiselect"`. Isso deve ser normalizado para evitar UI quebrada.
- O tipo `ConfigurableFieldControl` deve aceitar o formato usado pelos dados ou os dados devem ser migrados. A correcao minima e aceitar ambos na UI/tipo.
- `PowerCostFooter.tsx` parece legado ou nao usado pelo overlay principal. O footer inline de `PowerBuilderOverlay.tsx` e o fluxo atualmente relevante.
- O calculo de EP para equipamento existe em `mathEngine.ts`, mas a integracao de UI continua incompleta.

---

## Conclusao

O app ja funciona como criador de poderes simples, mas os bloqueadores criticos acima eram suficientes para impedir confiabilidade em fichas reais de M&M 3E. A prioridade correta e concluir a integracao de custo variavel, campos obrigatorios e validacoes no fluxo principal antes de investir em recursos de conveniencia.
