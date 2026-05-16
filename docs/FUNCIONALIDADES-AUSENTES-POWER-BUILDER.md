# Estado Atual do Power Builder e Funcionalidades Ausentes

**Data de atualizacao:** 16 de maio de 2026  
**Versao analisada:** 1.9.0  
**Escopo:** estado atual do criador de poderes/equipamentos em `src/features/power-builder/`, regras puras em `src/shared/lib/`, calculos globais em `src/shared/hooks/`, dados em `src/data/` e tipos em `src/entities/`.

---

## Resumo Executivo

O Power Builder ja e utilizavel para montar poderes comuns de M&M 3E: nome, descritores, efeitos, ranks, modificadores, custo por componente, custo fracionario, Alternate Effects, Removable, validacao de campos obrigatorios, custo variavel e validacao local de PL estao integrados ao fluxo principal.

Os antigos bloqueadores criticos B1-B4 foram corrigidos no codigo. O projeto agora esta proximo de um criador de ficha usavel, mas ainda nao deve ser chamado de **feature-complete** enquanto puder salvar poderes com inconsistencias legais silenciosas ou mostrar custo divergente entre builder e ficha.

Para feature-complete, o foco restante nao e adicionar conveniencias; e fechar validacoes defensivas e consistencia de calculo.

---

## Ja Implementado

| Area | Estado atual | Evidencia |
|---|---|---|
| Power Descriptors | Implementado | `ICharacterPower.descriptors`, UI em `PowerBuilderOverlay.tsx`, exibicao em `PowersList.tsx` |
| Empty Component Detection | Implementado | `handleSave()` bloqueia salvar sem componente valido |
| Variable Cost Powers UI | Implementado | `VariableCostSelector` no poder principal e em AEs |
| Configurable Fields UI | Implementado | `ConfigurableFieldSelector` no poder principal e em AEs |
| Required Field Validation | Implementado | `validatePowerComponents()` chamado no salvamento |
| Reset de dados obsoletos ao trocar efeito | Implementado | `variableCostOption` e `fieldValues` sao limpos ao trocar efeito |
| Local PL validation no builder | Implementado | `usePowerCostCalculation.ts` usa `calcAttackBonus()` e considera AEs |
| No-roll attack cap | Implementado | ataques sem rolagem usam limite `rank <= PL` |
| Modifier incompatibility warnings | Implementado como aviso | `modifierIncompatibilities` no builder e em AEs |
| Modifier max ranks na UI | Parcial | `NumberInput` recebe `max={def.maxRanks}` |
| Fractional cost engine | Implementado | `calculateCostPerRank()` e breakdown indicam custo fracionario |
| Alternate Effects basicos | Implementado | `useAlternateEffects.ts`, `AltEffectCard.tsx`, `calculateArrayCost()` |
| Equipment EP engine | Implementado fora do builder | `calcEquipmentEPCost()`, `EquipmentNotesPanel.tsx`, `useCalculatedPP.ts` |

---

## Essenciais Para Feature-Complete

### E1. Validacao defensiva de `maxRanks` no salvamento

**Estado:** parcial.

A UI limita ranks de modificadores com `max={def.maxRanks}`, mas o salvamento ainda deve bloquear dados invalidos vindos de estado antigo, importacao futura, bugs de UI ou edicao programatica.

**Criterio de aceitacao:**

- `handleSave()` bloqueia modificador com `ranks > def.maxRanks` no poder principal.
- `handleSave()` bloqueia o mesmo caso em AEs.
- A mensagem indica componente/AE, modificador e limite.

### E2. Consistencia de custo em Equipment Mode

**Estado:** parcial.

O custo de equipamento da ficha usa `calcEquipmentEPCost()`, mas o footer do builder em `equipmentMode` exibe `mainCost`. Isso pode divergir quando o equipamento tem Alternate Effects/dynamic AEs, pois `calcEquipmentEPCost()` soma o custo de array em EP.

**Criterio de aceitacao:**

- Builder em `equipmentMode` exibe o mesmo total que `calcEquipmentEPCost()`.
- Removable continua indisponivel/ignorado em equipamento.
- O texto da UI deixa claro quando o total esta em EP, nao PP.

### E3. Modifier stacking rules

**Estado:** ausente como bloqueio, parcialmente coberto por avisos.

O builder avisa incompatibilidades declaradas nos dados, mas ainda falta bloquear ou validar empilhamentos ilegais/ambiguous. Exemplos: duplicar modificadores que deveriam ser unicos, combinar alteracoes mutuamente exclusivas nao mapeadas em `incompatibleWith`, ou acumular ranks alem de limites por regra.

**Criterio de aceitacao:**

- Regras de incompatibilidade marcadas como obrigatorias devem bloquear salvamento quando a validacao estiver ativa.
- Modificadores unicos nao devem ser duplicados silenciosamente.
- Casos permitidos por rank continuam funcionando.

### E4. Action economy validation

**Estado:** ausente.

Os dados de efeito possuem `action`, mas o builder ainda nao valida combinacoes que criam custo/acao mecanicamente suspeitos. Isso deve ser tratado como validacao/aviso, nao como assistente criativo.

**Criterio de aceitacao:**

- O builder identifica mudancas de acao relevantes quando modificadores alteram a economia de acao.
- Casos impossiveis ou contraditorios geram bloqueio ou aviso conforme `validationRules`.
- A validacao cobre componentes principais e AEs.

### E5. PP/EP budget awareness no fluxo de criacao

**Estado:** parcial fora do builder.

A ficha calcula PP total e o painel de equipamento calcula limite de EP pela vantagem Equipment, mas o builder ainda nao mostra claramente o impacto antes de salvar um poder/equipamento.

**Criterio de aceitacao:**

- Ao editar/criar poder, o builder mostra impacto estimado no total de PP.
- Ao editar/criar equipamento, o builder mostra impacto estimado no limite de EP.
- O app avisa antes de salvar algo que estoure o orcamento quando a regra estiver ativa.

### E6. AE name uniqueness e identidade de slots

**Estado:** ausente.

Nomes duplicados de AEs nao quebram custo, mas prejudicam leitura, validacao e relatorios. Para uma ficha final confiavel, cada slot de array deve ser distinguivel.

**Criterio de aceitacao:**

- AEs sem nome recebem nome padrao estavel ou sao bloqueados no salvamento.
- Nomes duplicados geram aviso ou bloqueio.
- Mensagens de validacao sempre apontam para o AE correto.

### E7. Aviso visual claro de custo fracionario

**Estado:** calculo implementado, comunicacao limitada.

O motor calcula corretamente custos fracionarios, mas o usuario precisa ver claramente quando o poder esta usando regra de `1 PP por N ranks`, porque isso muda como ranks e flaws sao interpretados.

**Criterio de aceitacao:**

- Breakdown mostra `1 PP / N ranks` quando `isFractional` for verdadeiro.
- O footer ou card do componente diferencia custo fracionario de custo normal por rank.

---

## QOL Importante, Mas Nao Essencial

Estes itens melhoram velocidade, onboarding e ergonomia, mas nao impedem uma ficha legal/usavel se as validacoes essenciais acima existirem.

| Item | Motivo |
|---|---|
| Duplicate Power/Component | Acelera montagem de poderes parecidos |
| Modifier Search in Applied List | Ajuda em poderes muito carregados |
| Cost Breakdown Tooltip detalhado | Melhora explicabilidade do calculo |
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

- `PowerBuilderOverlay.tsx` ainda contem muito JSX e regras inline. Isso aumenta o risco de divergencia com componentes como `PowerComponentEditor.tsx`.
- `PowerComponentEditor.tsx` parece ser uma versao reutilizavel/legada do editor de componente; antes de remover, e preciso confirmar se nenhum fluxo futuro depende dele.
- O builder ja calcula AEs e validacoes em `usePowerCostCalculation.ts`; novas validacoes devem ficar nesse hook ou em funcoes puras de `src/shared/lib/validation.ts` quando possivel.
- `calcEquipmentEPCost()` e a fonte correta para total de EP. Qualquer UI de equipamento deve convergir para essa funcao.
- Evitar duplicar regras do livro em componentes React; preferir funcoes puras testaveis.
- Se houver duvida de regra, consultar `docs/sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md`, `docs/sources/Mutants & Masterminds 3 - Powers.md` e `docs/sources/Mutants & Masterminds 3 - Modifiers.md`.

---

## Proxima Sequencia Recomendada

1. Corrigir custo exibido em Equipment Mode para usar `calcEquipmentEPCost()`.
2. Adicionar validacao defensiva de `maxRanks` no salvamento.
3. Extrair validacoes repetiveis para `src/shared/lib/validation.ts`.
4. Adicionar aviso visual de custo fracionario no card do componente.
5. Implementar regras de stacking/action economy com base nos dados oficiais e em `validationRules`.

---

## Conclusao

O projeto ja pode criar poderes simples e moderadamente complexos, incluindo efeitos com custo variavel e campos obrigatorios. Para chamar de feature-complete, o criterio deve ser: **nao salvar custo divergente, nao salvar modificador acima do limite, nao esconder estouro de PP/EP e nao permitir combinacoes mecanicamente ilegais sem aviso claro**.

QOL pode esperar; consistencia de calculo e validacao defensiva nao.
