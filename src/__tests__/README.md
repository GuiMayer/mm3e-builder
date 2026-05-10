# MM3e Builder - Test Suite

Este diretório contém a suíte de testes completa para o MM3e Builder, validando a implementação das regras oficiais do Mutants & Masterminds 3e.

## Estrutura de Testes

### Testes de Lógica de Negócio

| Arquivo | Testes | Foco | Referência |
|---------|--------|------|------------|
| `mathEngine.test.ts` | 209 | Cálculos de custos de poderes | Hero's Handbook p.149-200 |
| `validation.test.ts` | 61 | Limites de PL (trade-offs) | Hero's Handbook p.24 |
| `altEffects.test.ts` | 290 | Arrays e Alternate Effects | Hero's Handbook p.136 |
| `powerBuilder.test.ts` | 750 | Builds reais de personagens | Hero's Handbook |
| `modifierRestrictions.test.ts` | 18 | Restrições de modificadores | Modifiers p.187 |
| `officialBuilds.test.ts` | 28 | Arquétipos oficiais | Hero's Handbook p.34-53 |
| `affliction.test.ts` | 36 | Validação de Affliction | Powers p.15-23 |
| `edgeCases.test.ts` | 49 | Edge cases e limites | Modifiers p.59-86 |
| `absentAbilities.test.ts` | 17 | Habilidades ausentes | Hero's Handbook p.16-17 |
| `parameterModifiers.test.ts` | 23 | Range/Duration/Action | Modifiers p.187-200 |

### Testes de Integração

| Arquivo | Testes | Foco |
|---------|--------|------|
| `dataIntegrity.test.ts` | - | Integridade de dados JSON |
| `archetypes.test.ts` | - | Validação de arquétipos |
| `fileService.test.ts` | - | Serviços de arquivo |

## Executando os Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- mathEngine.test.ts
npm test -- validation.test.ts

# Com UI interativa
npm run test:ui

# Com cobertura
npm run test:coverage

# Watch mode
npm test -- --watch
```

## Adicionando Novos Testes de Regras

### 1. Identificar a Regra

Consulte as referências oficiais em `docs/sources/`:
- `Mutants & Masterminds 3 - Heros Handbook Deluxe.md`
- `Mutants & Masterminds 3 - Powers.md`
- `Mutants & Masterminds 3 - Modifiers.md`

### 2. Verificar Implementação

Verifique se a regra já está implementada:
- `src/shared/lib/mathEngine.ts` - Cálculos de custos
- `src/shared/lib/validation.ts` - Validações de PL
- `src/shared/lib/modifierValidation.ts` - Validações de modificadores
- `src/shared/lib/afflictionValidation.ts` - Validações de Affliction

### 3. Criar Teste

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../shared/lib/module';

/**
 * [Nome da Regra] Tests
 * 
 * [Descrição da regra]
 * 
 * References:
 * - Hero's Handbook p.XX
 * - Modifiers p.YY
 */

describe('[Nome da Regra]', () => {
  it('should [comportamento esperado]', () => {
    // Arrange
    const input = ...;
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

### 4. Documentar Referências

Sempre inclua:
- Comentário no topo com referências de página do livro oficial
- Descrição clara do que a regra valida
- Exemplos reais quando possível

### 5. Testar Edge Cases

Para cada regra, considere:
- Valores mínimos (0, 1)
- Valores máximos (PL limits)
- Valores negativos (se aplicável)
- Combinações inválidas
- Casos de fronteira (exatamente no limite)

## Padrões de Teste

### Nomenclatura

```typescript
// ✅ Bom - descreve o comportamento
it('Damage 10 + Ranged = 20 PP', () => { ... });

// ❌ Ruim - muito genérico
it('should calculate cost', () => { ... });
```

### Estrutura AAA (Arrange-Act-Assert)

```typescript
it('calculates fractional cost correctly', () => {
  // Arrange - preparar dados
  const mods = [{ modifierId: 'tiring', ranks: 1 }];
  
  // Act - executar função
  const cost = calculatePowerCost(1, 10, mods, MODS);
  
  // Assert - verificar resultado
  expect(cost).toBe(5);
});
```

### Testes Parametrizados

```typescript
describe.each([
  { pl: 1, limit: 2 },
  { pl: 10, limit: 20 },
  { pl: 20, limit: 40 },
])('PL $pl limits', ({ pl, limit }) => {
  it(`attack + effect ≤ ${limit}`, () => {
    expect(validateAttackEffect(10, 11, pl)).not.toBeNull();
  });
});
```

### Testes .todo() para Funcionalidades Futuras

```typescript
describe('Future Validations', () => {
  it.todo('should validate partial modifiers');
  it.todo('should enforce power-specific modifier restrictions');
});
```

## Sistema de Validação Modular

Os testes respeitam o sistema de configuração de regras:

```typescript
import { DEFAULT_VALIDATION_RULES } from '../shared/lib/validationRules';

it('respects validation rules configuration', () => {
  const rules = { ...DEFAULT_VALIDATION_RULES, enforceIncompatibleModifiers: false };
  
  // Teste deve passar quando regra está desligada
  const result = validateComponentModifiers(component, rules, ...);
  expect(result.errors).toHaveLength(0);
});
```

### Regras Configuráveis

- `enforceIncompatibleModifiers` - Combinações incompatíveis
- `enforceModifierMaxRanks` - Limites de ranks
- `enforceAccuratePLCap` - Accurate vs PL (sempre ativo)
- `enforceAfflictionProgression` - Progressão de condições
- `enforceAbsentAbilityRestrictions` - Avisos de habilidades ausentes
- `plTradeOffsAsErrors` - Erros vs warnings
- `enforceTrainedOnlySkills` - Skills trained-only
- `enforceSkillAbilityRequirements` - Skills com habilidades ausentes

## Cobertura de Regras

Consulte `docs/testing/rules-coverage-report.md` para:
- Estatísticas de cobertura por categoria
- Gaps identificados
- Prioridades de implementação
- Roadmap de testes futuros

## Referências Cruzadas

### Livro → Código

| Regra do Livro | Página | Implementação | Teste |
|----------------|--------|---------------|-------|
| Power Level Limits | p.24 | `validation.ts` | `validation.test.ts` |
| Fractional Costs | p.59-86 | `mathEngine.ts:64-84` | `edgeCases.test.ts:11-35` |
| Accurate Extra | p.137 | `modifierValidation.ts` | `modifierRestrictions.test.ts:67-106` |
| Alternate Effects | p.136 | `mathEngine.ts:113-117` | `altEffects.test.ts` |
| Affliction | p.15-23 | `afflictionValidation.ts` | `affliction.test.ts` |

## Contribuindo

Ao adicionar novos testes:

1. **Verifique duplicação** - Busque testes similares existentes
2. **Siga os padrões** - Use estrutura AAA, nomenclatura clara
3. **Documente referências** - Sempre cite página do livro oficial
4. **Teste edge cases** - Não apenas o happy path
5. **Atualize cobertura** - Adicione à `rules-coverage-report.md`

## Troubleshooting

### Testes Falhando

```bash
# Executar teste específico com output detalhado
npm test -- mathEngine.test.ts --reporter=verbose

# Executar apenas testes que falharam
npm test -- --run --reporter=verbose
```

### Mock Data

Mocks de definições estão em cada arquivo de teste:
- `MODS` - Definições de modificadores
- `EFFECT_DEFS` - Definições de efeitos
- `POWER_DEFS` - Definições de poderes

### Debugging

```typescript
import { describe, it, expect } from 'vitest';

it('debugs calculation', () => {
  const result = calculatePowerCost(1, 10, mods, MODS);
  console.log('Result:', result); // Aparece no output do teste
  expect(result).toBe(20);
});
```

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [M&M 3e SRD](https://www.d20herosrd.com/)
- [Hero's Handbook](docs/sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md)
- [Rules Coverage Report](../docs/testing/rules-coverage-report.md)

---

**Última atualização:** 2026-05-10  
**Testes totais:** 1481  
**Cobertura de regras:** 84%
