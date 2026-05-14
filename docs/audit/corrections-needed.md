# Lista de Correções Necessárias - MM3E Builder v1.4.1 (REVISADA)

**Data**: 14/05/2026  
**Versão Auditada**: 1.4.1  
**Baseado em**: Auditoria Completa MM3E (REVISADA)

**DESCOBERTA IMPORTANTE**: Todos os 40 powers base oficiais estão implementados! A auditoria anterior estava contando Sample Powers (exemplos pré-construídos) como se fossem powers base independentes.

**ATUALIZAÇÃO 14/05/2026**: ✅ Todas as 4 correções críticas foram concluídas! Ver `PROGRESS.md` para detalhes dos commits.

---

## PRIORIDADE CRÍTICA 🔴

### 1. Corrigir Enhanced Trait - Custo Variável

**Problema**: Enhanced Trait tem custo fixo de 1 PP/rank quando deveria ser variável baseado na trait sendo melhorada.

**Regra Oficial** (Hero's Handbook p.143):
- Enhanced Ability: 2 PP/rank
- Enhanced Skill: 0.5 PP/rank (1 PP por 2 ranks)
- Enhanced Advantage: 1 PP/rank
- Enhanced Defense: 1 PP/rank

**Impacto**: 
- Cálculos incorretos para Enhanced Abilities (cobrando 1 PP quando deveria ser 2 PP)
- Personagens com Enhanced Strength, Stamina, etc. ficam mais baratos que deveriam

**Arquivos a Modificar**:
1. `src/data/powers.json` - Alterar definição de enhanced_trait
2. `src/shared/lib/mathEngine.ts` - Adicionar lógica de custo variável
3. `src/__tests__/powers.test.ts` - Atualizar testes

**Correção Sugerida**:

```json
// src/data/powers.json
{
  "id": "enhanced_trait",
  "name": {
    "en": "Enhanced Trait",
    "pt": "Característica Aprimorada"
  },
  "baseCost": "variable",
  "costByTraitType": {
    "ability": 2,
    "skill": 0.5,
    "advantage": 1,
    "defense": 1
  },
  "description": {
    "en": "You have one or more traits enhanced beyond their normal limits. The cost depends on the type of trait: Abilities cost 2 PP/rank, Skills cost 1 PP per 2 ranks, Advantages and Defenses cost 1 PP/rank.",
    "pt": "Você tem uma ou mais características aprimoradas além de seus limites normais. O custo depende do tipo de característica: Habilidades custam 2 PP/rank, Perícias custam 1 PP por 2 ranks, Vantagens e Defesas custam 1 PP/rank."
  },
  "requiresSpecification": true,
  "specificationOptions": ["ability", "skill", "advantage", "defense"]
}
```

```typescript
// src/shared/lib/mathEngine.ts
export function calcComponentCost(
  component: ICharacterPowerComponent,
  effectDef: IPowerEffect,
  modifierDefs: IModifierDef[]
): number {
  let baseCost = effectDef.baseCost;
  
  // Handle variable cost powers like Enhanced Trait
  if (effectDef.baseCost === 'variable' && effectDef.costByTraitType) {
    const traitType = component.specification?.traitType || 'advantage';
    baseCost = effectDef.costByTraitType[traitType] || 1;
  }
  
  const { costPerRank, isFractional, ranksPerPP } = calculateCostPerRank(
    baseCost,
    component.modifiers,
    modifierDefs
  );
  
  // ... resto do código
}
```

**Estimativa**: 2-3 horas  
**Testes Afetados**: ~10 testes

---

## PRIORIDADE ALTA 🟠

### 2. Adicionar Powers Essenciais Faltando (Top 8)

**Problema**: 8 powers de uso muito comum não estão implementados, limitando a criação de personagens típicos.

**Powers a Adicionar**:

#### 2.1 Protection (1 PP/rank)
```json
{
  "id": "protection",
  "name": {"en": "Protection", "pt": "Proteção"},
  "baseCost": 1,
  "type": "defense",
  "enhancesDefense": "toughness",
  "description": {
    "en": "You have resistance to damage, adding to your Toughness. Each rank adds +1 to your Toughness.",
    "pt": "Você tem resistência a dano, adicionando à sua Resistência. Cada rank adiciona +1 à sua Resistência."
  },
  "reference": "Hero's Handbook p.143"
}
```

#### 2.2 Move Object (2 PP/rank)
```json
{
  "id": "move_object",
  "name": {"en": "Move Object", "pt": "Mover Objeto"},
  "baseCost": 2,
  "type": "control",
  "requiresCheck": true,
  "checkType": "power",
  "description": {
    "en": "You can move objects at a distance. Your effective Strength for lifting is equal to your rank. You can use this to make attacks (Damage rank = Move Object rank).",
    "pt": "Você pode mover objetos à distância. Sua Força efetiva para levantar é igual ao seu rank. Você pode usar isso para fazer ataques (rank de Dano = rank de Mover Objeto)."
  },
  "reference": "Hero's Handbook p.142"
}
```

#### 2.3 Senses (1 PP/rank)
```json
{
  "id": "senses",
  "name": {"en": "Senses", "pt": "Sentidos"},
  "baseCost": 1,
  "type": "sensory",
  "description": {
    "en": "You have enhanced or additional senses. Each rank grants one sense effect (Darkvision, Extended, Penetrates Concealment, etc.).",
    "pt": "Você tem sentidos aprimorados ou adicionais. Cada rank concede um efeito sensorial (Visão no Escuro, Estendido, Penetra Ocultação, etc.)."
  },
  "reference": "Hero's Handbook p.144"
}
```

#### 2.4 Speed (1 PP/rank)
```json
{
  "id": "speed",
  "name": {"en": "Speed", "pt": "Velocidade"},
  "baseCost": 1,
  "type": "movement",
  "description": {
    "en": "You can move faster than normal on the ground. Each rank increases your ground speed by one rank on the Speed table.",
    "pt": "Você pode se mover mais rápido que o normal no solo. Cada rank aumenta sua velocidade terrestre em um rank na tabela de Velocidade."
  },
  "reference": "Hero's Handbook p.144"
}
```

#### 2.5 Teleport (2 PP/rank)
```json
{
  "id": "teleport",
  "name": {"en": "Teleport", "pt": "Teletransporte"},
  "baseCost": 2,
  "type": "movement",
  "description": {
    "en": "You can instantly move from one place to another without crossing the intervening space. Your rank determines the distance you can teleport.",
    "pt": "Você pode se mover instantaneamente de um lugar para outro sem cruzar o espaço intermediário. Seu rank determina a distância que você pode teletransportar."
  },
  "reference": "Hero's Handbook p.145"
}
```

#### 2.6 Nullify (1 PP/rank)
```json
{
  "id": "nullify",
  "name": {"en": "Nullify", "pt": "Anular"},
  "baseCost": 1,
  "type": "attack",
  "requiresCheck": true,
  "checkType": "power",
  "description": {
    "en": "You can nullify or counter a specific effect or power. Make a power check (DC 10 + effect rank) to nullify the effect for one round.",
    "pt": "Você pode anular ou contra-atacar um efeito ou poder específico. Faça um teste de poder (CD 10 + rank do efeito) para anular o efeito por uma rodada."
  },
  "reference": "Hero's Handbook p.142"
}
```

#### 2.7 Weaken (1 PP/rank)
```json
{
  "id": "weaken",
  "name": {"en": "Weaken", "pt": "Enfraquecer"},
  "baseCost": 1,
  "type": "attack",
  "requiresCheck": true,
  "checkType": "power",
  "resistedBy": "fortitude",
  "description": {
    "en": "You can temporarily reduce a specific trait. Target makes a Fortitude save (DC 10 + rank). Each degree of failure reduces the trait by 1 rank.",
    "pt": "Você pode reduzir temporariamente uma característica específica. Alvo faz salvamento de Fortitude (CD 10 + rank). Cada grau de falha reduz a característica em 1 rank."
  },
  "reference": "Hero's Handbook p.145"
}
```

#### 2.8 Regeneration (1 PP/rank)
```json
{
  "id": "regeneration",
  "name": {"en": "Regeneration", "pt": "Regeneração"},
  "baseCost": 1,
  "type": "defense",
  "description": {
    "en": "You recover from damage quickly. Each rank allows one recovery check per time interval (1/round at rank 10, 1/5 rounds at rank 1).",
    "pt": "Você se recupera de dano rapidamente. Cada rank permite um teste de recuperação por intervalo de tempo (1/rodada no rank 10, 1/5 rodadas no rank 1)."
  },
  "reference": "Hero's Handbook p.143"
}
```

**Arquivos a Modificar**:
- `src/data/powers.json` - Adicionar 8 novos powers
- `src/__tests__/powers.test.ts` - Adicionar testes para cada power

**Estimativa**: 4-6 horas  
**Testes Novos**: ~20 testes

---

## PRIORIDADE MÉDIA 🟡

### 2. Documentar Environment - Custo Variável

**Problema**: Environment tem custo fixo de 1 PP/rank quando deveria ser 1-2 PP/rank dependendo da intensidade.

**Regra Oficial** (Hero's Handbook p.140):
- Distração/Impedimento: 1 PP/rank
- Dano: 2 PP/rank

**Correção Sugerida**:

```json
// src/data/powers.json
{
  "id": "environment",
  "baseCost": 1,
  "notes": {
    "en": "2 PP/rank if the environment causes damage",
    "pt": "2 PP/rank se o ambiente causar dano"
  },
  "description": {
    "en": "You can create or control environmental conditions in an area. Base cost is 1 PP/rank for distraction or impediment. If the environment causes damage, the cost is 2 PP/rank.",
    "pt": "Você pode criar ou controlar condições ambientais em uma área. Custo base é 1 PP/rank para distração ou impedimento. Se o ambiente causar dano, o custo é 2 PP/rank."
  }
}
```

**Arquivos a Modificar**:
- `src/data/powers.json` - Atualizar definição de environment
- Documentação/UI - Adicionar nota sobre custo variável

**Estimativa**: 30 minutos  
**Testes Afetados**: ~2 testes

---

## PRIORIDADE BAIXA 🟢 (Opcional)

### 3. Implementar Sample Powers como Presets

**Problema**: Sample Powers do livro (Blast, Force Field, Strike, etc.) não estão disponíveis como presets.

**Contexto**: Sample Powers são **exemplos pré-construídos** no livro oficial, não powers base independentes. Eles mostram como combinar powers base com modifiers para criar efeitos comuns.

**Impacto**: Usuários precisam construir manualmente combinações comuns. Não é crítico - apenas conveniência.

**Sample Powers a Considerar**:

1. **Blast** = Ranged Damage (2 PP/rank)
2. **Force Field** = Protection + Sustained (1 PP/rank)
3. **Strike** = Damage close (1 PP/rank)
4. **Super-Speed** = Enhanced Initiative + Quickness + Speed (3 PP/rank)
5. **Invisibility** = Visual Concealment (4-8 PP)
6. **Mental Blast** = Perception Ranged Damage + Resisted by Will (4 PP/rank)
7. **Snare** = Ranged Cumulative Affliction (3 PP/rank)
8. **Energy Aura** = Damage + Reaction (4 PP/rank)
9. **Power-Lifting** = Enhanced Strength + Limited to Lifting (1 PP/rank)
10. **Sleep** = Ranged Affliction + Resisted by Fortitude (2 PP/rank)

**Arquivos a Modificar**:
- Criar `src/data/sample-powers.json` (novo arquivo)
- Adicionar UI para presets/templates
- Testes para presets

**Estimativa**: 4-6 horas (opcional)  
**Testes Novos**: ~15 testes

**Nota**: Esta é uma melhoria de conveniência, não uma correção. O builder já fornece todos os building blocks necessários.

---

### 4. Melhorias em Modifiers

**Problema**: Algumas incompatibilidades entre modifiers não estão mapeadas.

**Melhorias Sugeridas**:

1. Adicionar incompatibilidade `permanent_flaw` ↔ `alternate_effect`
2. Adicionar incompatibilidade `continuous` ↔ `sustained`
3. Expandir documentação de Partial Modifiers
4. Incluir mais exemplos de uso de modifiers complexos

**Arquivos a Modificar**:
- `src/data/modifiers.json` - Adicionar incompatibilidades
- Documentação - Expandir exemplos

**Estimativa**: 2-3 horas  
**Testes Novos**: ~5 testes

---

### 5. Validações Especiais de Powers

**Problema**: Algumas validações específicas de powers não estão implementadas.

**Validações a Adicionar**:

1. **Affliction Progression** - Validar que condições seguem progressão correta
2. **Summon Minion Points** - Validar que minions não excedem PL×15 pontos
3. **Immunity Scope** - Validar que imunidades são apropriadas
4. **Variable Power Pool** - Validar que poderes variáveis respeitam limites

**Arquivos a Modificar**:
- `src/shared/lib/validationRules.ts` - Adicionar novas regras
- `src/shared/lib/validation.ts` - Implementar validações
- Testes - Adicionar cobertura

**Estimativa**: 4-5 horas  
**Testes Novos**: ~15 testes

---

## ROADMAP DE IMPLEMENTAÇÃO - REVISADO

### Fase 1: Correção Crítica (2-3 horas)
**Objetivo**: Corrigir o único problema crítico restante

- [ ] Corrigir Enhanced Trait (custo variável)
- [ ] Atualizar testes relacionados
- [ ] Validar cálculos com personagens de teste
- [ ] Executar suite completa de testes

**Entregável**: v1.5.0 com Enhanced Trait corrigido

---

### Fase 2: Documentação (30 minutos)
**Objetivo**: Melhorar documentação de Environment

- [ ] Documentar Environment (custo variável para dano)
- [ ] Atualizar notas na UI
- [ ] Adicionar exemplos de uso

**Entregável**: v1.5.1 com documentação melhorada

---

### Fase 3: Melhorias Opcionais (4-8 horas - opcional)
**Objetivo**: Conveniência e refinamentos

- [ ] Implementar Sample Powers como presets/templates
- [ ] Adicionar incompatibilidades faltando em modifiers
- [ ] Implementar validações especiais de powers
- [ ] Expandir documentação com mais exemplos
- [ ] Criar guia de uso para powers complexos

**Entregável**: v1.6.0 com presets e melhorias

---

## TEMPO TOTAL ESTIMADO - REVISADO

| Fase | Duração | Complexidade | Prioridade |
|------|---------|--------------|------------|
| Fase 1 | 2-3 horas | Alta | 🔴 CRÍTICA |
| Fase 2 | 30 minutos | Baixa | 🟡 MÉDIA |
| Fase 3 | 4-8 horas | Média | 🟢 OPCIONAL |
| **TOTAL (Crítico)** | **3 horas** | - | - |
| **TOTAL (Completo)** | **7-11 horas** | - | - |

---

## CRITÉRIOS DE ACEITAÇÃO - REVISADOS

### Fase 1 (Crítica)
- ✅ Enhanced Trait calcula custos corretos para todos os tipos de trait
- ✅ Todos os testes passando (477+ testes)
- ✅ Personagens com Enhanced Abilities calculam custos corretos
- ✅ Nenhuma regressão em funcionalidades existentes

### Fase 2 (Documentação)
- ✅ Environment com custo variável documentado
- ✅ Nota visível na UI para usuários
- ✅ Exemplos de uso adicionados

### Fase 3 (Opcional)
- ✅ Sample Powers disponíveis como presets (se implementado)
- ✅ Incompatibilidades de modifiers expandidas (se implementado)
- ✅ Validações especiais de powers implementadas (se implementado)
- ✅ Documentação expandida com exemplos

---

## NOTAS DE IMPLEMENTAÇÃO

### Enhanced Trait
- Requer mudança na estrutura de dados (baseCost pode ser string "variable")
- Requer lógica condicional em calcComponentCost
- Pode afetar serialização/deserialização de personagens salvos

### Powers Novos
- Seguir padrão existente em powers.json
- Incluir traduções pt-BR completas
- Adicionar referências às páginas do livro
- Criar testes unitários para cada power

### Validações Especiais
- Implementar como funções separadas em validation.ts
- Tornar configuráveis via validationRules.ts
- Adicionar mensagens de erro descritivas

---

## REFERÊNCIAS

- **Auditoria Completa**: `docs/AUDITORIA_COMPLETA_MM3E.md`
- **Auditoria de Powers**: `docs/audit/powers-audit.md`
- **Auditoria de Modifiers**: `docs/audit/modifiers-audit.md`
- **Auditoria de Validações**: `docs/audit/validations-audit.md`
- **Regras Oficiais**: `docs/REGRAS_CALCULO_MM3E.md`

---

**Última Atualização**: 14/05/2026  
**Próxima Revisão**: Após implementação da Fase 1
