# Comparação de Custos Base - MM3E Builder vs Regras Oficiais

## Data da Auditoria
**Data**: 14/05/2026  
**Versão Auditada**: 1.4.1  
**Auditor**: Sistema Automatizado

---

## 1. ABILITIES (Habilidades)

| Aspecto | Regra Oficial | Implementação | Status |
|---------|---------------|---------------|--------|
| **Custo por Rank** | 2 PP/rank | 2 PP/rank | ✅ CONFORME |
| **Fórmula** | `cost = rank × 2` | `total += value * 2` | ✅ CONFORME |
| **Range de Valores** | -5 a 20 | Não limitado no código | ⚠️ OBSERVAÇÃO |
| **Habilidades Ausentes** | Permitido (construtos, etc.) | Suportado via `absentAbilities[]` | ✅ CONFORME |
| **Referência Oficial** | Hero's Handbook p.107 | - | - |

**Arquivo**: `src/shared/lib/mathEngine.ts:267-276`

**Código Implementado**:
```typescript
export function calculateAbilitiesCost(
  abilities: Record<string, number>,
  absentAbilities: string[]
): number {
  let total = 0;
  for (const [key, value] of Object.entries(abilities)) {
    if (absentAbilities.includes(key)) continue;
    total += value * 2;
  }
  return total;
}
```

**Análise**: 
- ✅ Fórmula correta: multiplica rank por 2
- ✅ Trata habilidades ausentes corretamente (não conta no custo)
- ⚠️ Não valida range -5 a 20 no cálculo (validação pode estar em outro lugar)

---

## 2. SKILLS (Perícias)

| Aspecto | Regra Oficial | Implementação | Status |
|---------|---------------|---------------|--------|
| **Custo** | 1 PP por 2 ranks | 1 PP por 2 ranks | ✅ CONFORME |
| **Fórmula** | `cost = ceil(skill_ranks / 2)` | `Math.ceil(totalSkillRanks / 2)` | ✅ CONFORME |
| **Arredondamento** | Para cima | `Math.ceil()` | ✅ CONFORME |
| **Referência Oficial** | Hero's Handbook p.113, Skills p.38-39 | - | - |

**Arquivo**: `src/shared/lib/mathEngine.ts:289-290`

**Código Implementado**:
```typescript
export function calculateSkillsCost(totalSkillRanks: number): number {
  return Math.ceil(totalSkillRanks / 2);
}
```

**Testes de Validação**:
- 1 rank = 1 PP ✅
- 2 ranks = 1 PP ✅
- 3 ranks = 2 PP ✅
- 5 ranks = 3 PP ✅

**Análise**: 
- ✅ Fórmula exata conforme regras oficiais
- ✅ Arredondamento correto para cima

---

## 3. ADVANTAGES (Vantagens)

| Aspecto | Regra Oficial | Implementação | Status |
|---------|---------------|---------------|--------|
| **Custo** | 1 PP por rank | 1 PP por rank | ✅ CONFORME |
| **Fórmula** | `cost = sum(advantage_ranks)` | `reduce((sum, a) => sum + a.ranks, 0)` | ✅ CONFORME |
| **Vantagens Ranqueadas** | Algumas podem ter múltiplos ranks | Suportado | ✅ CONFORME |
| **Referência Oficial** | Hero's Handbook p.131, Advantages p.8 | - | - |

**Arquivo**: `src/shared/lib/mathEngine.ts:296-298`

**Código Implementado**:
```typescript
export function calculateAdvantagesCost(advantages: { ranks: number }[]): number {
  return advantages.reduce((sum, a) => sum + a.ranks, 0);
}
```

**Análise**: 
- ✅ Soma simples de todos os ranks
- ✅ Suporta vantagens com múltiplos ranks

---

## 4. DEFENSES (Defesas)

| Aspecto | Regra Oficial | Implementação | Status |
|---------|---------------|---------------|--------|
| **Custo** | 1 PP por rank comprado | 1 PP por rank | ✅ CONFORME |
| **Defesas Compráveis** | Dodge, Parry, Fortitude, Will | Dodge, Parry, Fortitude, Will | ✅ CONFORME |
| **Toughness** | NÃO pode ser comprado diretamente | Não incluído no cálculo | ✅ CONFORME |
| **Fórmula** | `sum(bought_ranks)` | `dodge + parry + fortitude + will` | ✅ CONFORME |
| **Referência Oficial** | Hero's Handbook p.24-26 | - | - |

**Arquivo**: `src/shared/lib/mathEngine.ts:282-284`

**Código Implementado**:
```typescript
export function calculateDefensesCost(defenses: IDefenses): number {
  return defenses.dodge + defenses.parry + defenses.fortitude + defenses.will;
}
```

**Análise**: 
- ✅ Soma apenas ranks comprados
- ✅ Toughness corretamente excluído (calculado via Protection power + Defensive Roll advantage)
- ✅ Não inclui bônus de habilidades (apenas ranks comprados)

---

## 5. TOUGHNESS (Resistência) - Cálculo Derivado

| Aspecto | Regra Oficial | Implementação | Status |
|---------|---------------|---------------|--------|
| **Fórmula Base** | STA + Protection + Defensive Roll | STA + Protection + Defensive Roll | ✅ CONFORME |
| **Protection Power** | Adiciona ranks ao Toughness | Busca `enhancesDefense === 'toughness'` | ✅ CONFORME |
| **Defensive Roll** | Adiciona ranks ao Toughness (ativo) | Soma ranks da advantage | ✅ CONFORME |
| **Alternate Effects** | AEs com Protection também contam | Verifica AE components | ✅ CONFORME |
| **Referência Oficial** | Hero's Handbook p.88 | - | - |

**Arquivo**: `src/shared/lib/mathEngine.ts:359-396`

**Código Implementado**:
```typescript
export function calcToughnessBonus(
  powers: ICharacterPower[],
  advantages: { advantageId: string; ranks: number }[],
  powerDefs: IPowerEffect[]
): { bonus: number; breakdown: string[] } {
  // Busca Protection em components principais
  // Busca Protection em AE components
  // Soma Defensive Roll advantage
}
```

**Análise**: 
- ✅ Implementação completa e correta
- ✅ Considera Protection em poderes principais e AEs
- ✅ Fornece breakdown para UI

---

## 6. INITIATIVE (Iniciativa) - Cálculo Derivado

| Aspecto | Regra Oficial | Implementação | Status |
|---------|---------------|---------------|--------|
| **Base** | AGL rank | AGL rank | ✅ CONFORME |
| **Improved Initiative** | +4 por rank | +4 por rank | ✅ CONFORME |
| **Enhanced Initiative** | +rank do power | +rank do power | ✅ CONFORME |
| **Referência Oficial** | Hero's Handbook p.94 | - | - |

**Arquivo**: `src/shared/lib/mathEngine.ts:407-436`

**Análise**: 
- ✅ Implementação completa
- ✅ Considera todas as fontes de bônus

---

## RESUMO GERAL - CUSTOS BASE

| Categoria | Status | Observações |
|-----------|--------|-------------|
| Abilities | ✅ CONFORME | Fórmula exata, suporte a ausentes |
| Skills | ✅ CONFORME | Arredondamento correto |
| Advantages | ✅ CONFORME | Soma simples de ranks |
| Defenses | ✅ CONFORME | Apenas ranks comprados |
| Toughness (derivado) | ✅ CONFORME | Cálculo completo |
| Initiative (derivado) | ✅ CONFORME | Todas as fontes |

**Taxa de Conformidade**: 100% (6/6)

**Conclusão**: Todos os cálculos de custos base estão implementados corretamente conforme as regras oficiais do M&M 3e Hero's Handbook.
