# Progresso das Correções - MM3E Builder

> **Registro histórico da v1.4.1.** Este arquivo preserva decisões daquele ciclo e não é um retrato do catálogo atual. A seção de Affliction abaixo foi explicitamente corrigida pela revisão de cálculo 3; poderes listados nos “Próximos Passos” podem já existir na v1.11.0.

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

### 3. Affliction - correção histórica revertida
**Commits**: `10869d3`, `f55eb13`, `ebe74d7`  
**Status**: ✅ CONCLUÍDO

> **Correção posterior (revisão de cálculo 3):** esta conclusão estava errada. Affliction custa sempre 1 PP/rank; os três graus são resultados possíveis de falha no teste de resistência, não graus comprados separadamente. O catálogo, os testes e a documentação atuais foram corrigidos. Assim, Affliction rank 10 custa 10 PP antes de extras e flaws.

---

## 📊 Estatísticas

- **Total de Correções Críticas**: 4
- **Concluídas**: 4 (100%)
- **Pendentes**: 0 (0%)
- **Commits Realizados**: 6
- **Arquivos Modificados**: 3 (powers.json, modifiers.json, affliction.test.ts)

---

## 🎯 Próximos Passos

1. ✅ ~~Implementar correção de Affliction (custo por grau)~~ - CONCLUÍDO
2. ✅ ~~Executar testes para validar correções~~ - CONCLUÍDO
3. Considerar melhorias de prioridade alta:
   - Adicionar 8 powers essenciais faltando (Protection, Move Object, Senses, Speed, Teleport, Nullify, Weaken, Regeneration)
   - Documentar Environment custo variável (1-2 PP/rank)
4. Atualizar documentação de usuário com exemplos de Afflictions multi-grau

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
