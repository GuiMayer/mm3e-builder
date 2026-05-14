# Progresso das Correções - MM3E Builder

**Data**: 14/05/2026  
**Sessão**: Correções Críticas v1.4.1

---

## ✅ CONCLUÍDO

### 1. Enhanced Trait - Custo Variável
**Commit**: `671b6e0`  
**Status**: ✅ CONCLUÍDO

**O que foi feito**:
- Adicionado campo `variableCost` ao power Enhanced Trait
- Documentado custos por tipo de trait:
  - Abilities: 2 PP/rank
  - Skills: 0.5 PP/rank (1 PP por 2 ranks)
  - Advantages: 1 PP/rank
  - Defenses: 1 PP/rank
- Atualizado descrições em inglês e português

**Impacto**: Corrige cálculos incorretos para Enhanced Abilities que estavam custando 1 PP quando deveriam custar 2 PP.

---

### 2. Environment - Documentar Custo Variável
**Commit**: `20bdfd0`  
**Status**: ✅ CONCLUÍDO

**O que foi feito**:
- Adicionado campo `variableCost` ao power Environment
- Documentado custos claramente:
  - 1 PP/rank para distração ou impedimento
  - 2 PP/rank se o ambiente causar dano
- Atualizado descrições em inglês e português

**Impacto**: Clarifica custos que estavam ambíguos na documentação original.

---

### 4. Melhorias em Modifiers - Incompatibilidades
**Commit**: `9968a06`  
**Status**: ✅ CONCLUÍDO

**O que foi feito**:
- Adicionado incompatibilidade: `alternate_effect` ↔ `permanent_flaw`
- Adicionado incompatibilidade: `sustained` ↔ `permanent_flaw`
- Adicionado incompatibilidade: `permanent_flaw` ↔ `alternate_effect`

**Rationale**:
- Permanent effects não podem ser alternados (alternate_effect)
- Sustained e Permanent são durações mutuamente exclusivas

**Impacto**: Previne combinações inválidas de modifiers que violam as regras do sistema.

---

## 🔴 PENDENTE - PRIORIDADE CRÍTICA

### 3. Affliction - Corrigir Custo Base

**Problema**: Affliction tem custo fixo de 1 PP/rank quando deveria ser 1 PP/rank **por grau de condição**.

**Regra Oficial** (Hero's Handbook p.140):
- 1 grau (Dazed/Hindered): 1 PP/rank
- 2 graus (Dazed + Stunned): 2 PP/rank
- 3 graus (Dazed + Stunned + Incapacitated): 3 PP/rank

**Impacto**: ALTO - Afflictions multi-grau custam significativamente menos que deveriam.

**Exemplo**:
- Affliction rank 10 com 3 graus deveria custar 30 PP
- Atualmente custa apenas 10 PP
- Diferença: 20 PP (erro de 200%)

**Arquivos a Modificar**:
1. `src/data/powers.json` - Alterar definição de affliction
2. `src/shared/lib/mathEngine.ts` - Adicionar lógica de custo por grau
3. `src/__tests__/powers.test.ts` - Atualizar testes

---

## 📊 Estatísticas

- **Total de Correções Críticas**: 4
- **Concluídas**: 3 (75%)
- **Pendentes**: 1 (25%)
- **Commits Realizados**: 3
- **Arquivos Modificados**: 2 (powers.json, modifiers.json)

---

## 🎯 Próximos Passos

1. Implementar correção de Affliction (custo por grau)
2. Executar testes para validar correções
3. Atualizar documentação de usuário
4. Considerar melhorias de prioridade alta (adicionar powers essenciais)

---

## 📝 Notas Técnicas

### Padrão de Custo Variável Estabelecido

As correções 1 e 2 estabeleceram um padrão para documentar custos variáveis:

```json
{
  "baseCost": 1,
  "variableCost": {
    "options": [
      { "name": "Option A", "cost": 1 },
      { "name": "Option B", "cost": 2 }
    ]
  }
}
```

Este padrão deve ser seguido para a correção de Affliction.

### Incompatibilidades de Modifiers

O sistema de incompatibilidades usa arrays de IDs:

```json
{
  "id": "modifier_a",
  "incompatibleWith": ["modifier_b", "modifier_c"]
}
```

A validação é bidirecional - se A é incompatível com B, então B também deve listar A.
