# Análise Arquitetural Completa - MM3E Character Builder

## 📋 Resumo Executivo

O projeto apresenta uma arquitetura **sólida e bem estruturada** (nota 8/10), com separação clara de responsabilidades, bom uso de TypeScript, e padrões consistentes. No entanto, existem **problemas estruturais significativos** que impactam manutenibilidade e escalabilidade.

---

## 🔍 Contexto - Estrutura Atual

### Organização de Diretórios

```
src/
├── app/              # Entry point (27 linhas - limpo)
├── store/            # 3 stores Zustand isolados
├── entities/         # Tipos + schemas + constantes
├── data/             # JSON estático (game data)
├── features/         # Módulos por funcionalidade
│   ├── sheet-core/   # 13 componentes de painel
│   ├── power-builder/# Builder complexo + hooks
│   └── references/   # Visualizador de regras
├── shared/           # Código reutilizável
│   ├── ui/          # 6 componentes compartilhados
│   ├── hooks/       # 7 hooks customizados
│   └── lib/         # Funções puras (mathEngine, validation)
├── services/         # I/O externo (file, PDF, Excel)
└── locales/          # i18n (en, pt-BR)
```

### Estado da Arquitetura

* **TypeScript strict mode** : ✅ Ativo
* **Separação de concerns** : ✅ Boa (stores, services, lib separados)
* **Dependency inversion** : ✅ mathEngine não importa stores
* **Feature-based organization** : ✅ Vertical slices bem definidos
* **Type safety** : ✅ 268 linhas de interfaces + Zod schemas
* **Testing** : ⚠️ 7 arquivos de teste, mas sem script `npm test`

---

## 🚨 Problemas Estruturais Identificados

### 1. **CRÍTICO: Component Bloat - MenuBar.tsx (525 linhas)**

 **Problema** : Violação massiva do Single Responsibility Principle

 **Responsabilidades atuais** :

* Navegação entre views (sheet/references)
* Import/Export de arquivos JSON
* Geração de PDF com overflow handling
* Geração de Excel
* Troca de tema (4 temas)
* Troca de idioma (en/pt-BR)
* Auto-save coordination
* Modal de overflow de PDF

 **Evidências** :

* 23 imports diferentes
* 72 linhas de estado local (useState, useRef)
* Lógica de negócio misturada com UI
* Imports duplicados: usa `powerDefsJson` (linha 11) E `POWER_DEFS` (linha 20)

 **Impacto** :

* Difícil de testar unitariamente
* Alto acoplamento com múltiplos domínios
* Mudanças em qualquer funcionalidade afetam o mesmo arquivo
* Dificulta code review

---

### 2. **CRÍTICO: PowerBuilderOverlay.tsx (991 linhas)**

 **Problema** : God Component com múltiplas responsabilidades

 **Responsabilidades atuais** :

* Drag-and-drop de modificadores (DnD context)
* Gerenciamento de componentes de poder
* Validação de custos em tempo real
* Gerenciamento de alternate effects
* Renderização de UI complexa
* Cálculos de custo inline

 **Evidências** :

* 38 imports
* Lógica de DnD misturada com lógica de negócio
* Múltiplos `useMemo`, `useCallback` aninhados
* Componentes internos não extraídos

 **Impacto** :

* Difícil de entender o fluxo completo
* Testes complexos (muitos mocks necessários)
* Performance pode degradar (muitos re-renders)
* Dificulta refatoração

---

### 3. **ALTO: Inconsistência em Importação de Game Data**

 **Problema** : Dois padrões diferentes coexistem

**Padrão 1** (correto):

```typescript
import { POWER_DEFS, MODIFIER_DEFS } from '../../entities/gameDataLoaders';
```

**Padrão 2** (incorreto):

```typescript
import powerDefsJson from '../../data/powers.json';
import modifierDefsJson from '../../data/modifiers.json';
```

 **Arquivos afetados** :

* `MenuBar.tsx` - usa ambos os padrões (linhas 11-14 e 20)
* `AdvantagesPanel.tsx` - usa import direto (linha 4)

 **Impacto** :

* Duplicação de dados em memória
* Inconsistência de tipos (JSON vs typed constants)
* Dificulta mudanças no formato de dados
* Confusão para novos desenvolvedores

---

### 4. **MÉDIO: Componentes Grandes Adicionais**

Outros componentes que excedem 300 linhas:

| Arquivo             | Linhas | Problema                                     |
| ------------------- | ------ | -------------------------------------------- |
| SkillsPanel.tsx     | 499    | Lógica de skills + subtypes + UI            |
| HeaderPanel.tsx     | 489    | Múltiplos campos + validação + PP display |
| EffectPalette.tsx   | 370    | Palette + modal + filtros                    |
| AltEffectCard.tsx   | 362    | Card + editor + validação                  |
| PPLogPanel.tsx      | 354    | Tabela + CRUD + cálculos                    |
| OffensePanel.tsx    | 351    | Tabela + cálculos + validação             |
| AdvantagesPanel.tsx | 329    | Lista + modal + filtros                      |

 **Padrão comum** : UI + lógica de negócio + validação no mesmo arquivo

---

### 5. **MÉDIO: Falta de Middleware no Zustand**

 **Problema** : Persistência manual e sem devtools

 **Estado atual** :

* `appStore.ts`: Persistência manual via `localStorage.setItem`
* `sessionStore.ts`: Persistência manual via `sessionStorage.setItem`
* `charStore.ts`: Sem persistência (delegada ao fileService)

 **Oportunidades perdidas** :

* Zustand devtools para debugging
* Middleware de persistência automática
* Logging de ações para auditoria
* Time-travel debugging

---

### 6. **MÉDIO: DashboardBar Placeholder**

 **Problema** : Componente vazio com comentário "Logic currently lives in MenuBar"

 **Arquivo** : `src/features/dashboard/DashboardBar.tsx`

 **Impacto** :

* Sugere refatoração incompleta
* Confunde a intenção arquitetural
* Ocupa espaço no codebase sem valor

---

### 7. **BAIXO: Falta de Error Boundaries**

 **Problema** : Sem tratamento de erros em nível de componente

 **Estado atual** :

* `I18nError` existe no fileService
* Sem error boundaries no App.tsx ou features
* Erros podem crashar toda a aplicação

 **Impacto** :

* UX ruim em caso de erros
* Dificulta debugging em produção
* Sem fallback UI

---

### 8. **BAIXO: Complexidade do PDF Service**

 **Problema** : 7 geradores de seção + helpers + overflow collector

 **Estrutura atual** :

```
services/pdf/
├── pdfFillService.ts       # Orquestrador
├── pdfTemplateLoader.ts    # Loader
├── overflowCollector.ts    # Overflow logic
├── helpers.ts              # Utilities
└── sections/               # 7 geradores
    ├── headerSection.ts
    ├── abilitiesSection.ts
    ├── defensesSection.ts
    ├── skillsSection.ts
    ├── advantagesSection.ts
    ├── offenseSection.ts
    └── ...
```

 **Problema** : Acoplamento entre seções e orquestrador

 **Oportunidade** : Builder pattern ou factory pattern

---

### 9. **BAIXO: Falta de Proteção contra Dependências Circulares**

 **Estado atual** : Sem ESLint rules para detectar circular imports

 **Risco** : À medida que o projeto cresce, circular dependencies podem surgir

---

### 10. **BAIXO: Ausência de Script de Testes**

 **Problema** : `package.json` não tem script `test`

 **Evidência** :

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

 **Impacto** :

* Testes existem (`src/__tests__/`) mas não são executáveis via npm
* CI/CD não pode rodar testes automaticamente
* Desenvolvedores podem não saber como rodar testes

---

## 📊 Métricas de Complexidade

### Distribuição de Tamanho de Arquivos

* **< 100 linhas** : ~60% dos arquivos (bom)
* **100-300 linhas** : ~30% dos arquivos (aceitável)
* **300-500 linhas** : 7 arquivos (atenção)
* **> 500 linhas** : 2 arquivos (crítico)

### Uso de Hooks

* **useState** : 65 ocorrências
* **useEffect** : 20 ocorrências
* **Custom hooks** : 7 (boa abstração)

### Acoplamento

* **Imports profundos** (`../../..`): Comum, mas consistente
* **Circular dependencies** : Nenhuma detectada
* **Store coupling** : Nenhum (stores isolados)

---

## 🎯 Plano de Melhorias Estruturais

### Fase 1: Refatoração Crítica (Alta Prioridade)

#### 1.1 Decompor MenuBar.tsx

 **Objetivo** : Reduzir de 525 para ~150 linhas

 **Passos** :

1. Extrair `useFileOperations` hook
   * `exportJSON`, `importJSON`, `handleImport`
   * Retorna: `{ exportCharacter, importCharacter, isImporting }`
2. Extrair `usePDFExport` hook
   * `handlePDFExport`, `checkPDFOverflow`, `pdfOverflow`, `setPdfOverflow`
   * Retorna: `{ exportPDF, pdfOverflow, clearOverflow }`
3. Extrair `useExcelExport` hook
   * `handleExcelExport`
   * Retorna: `{ exportExcel, isExporting }`
4. Criar `ThemeSelector.tsx` component
   * Dropdown de temas
   * Props: `theme`, `setTheme`
5. Criar `LanguageSelector.tsx` component
   * Dropdown de idiomas
   * Props: `language`, `setLanguage`
6. Criar `ViewTabs.tsx` component
   * Tabs de navegação (sheet/references)
   * Props: `activeView`, `onViewChange`
7. Refatorar MenuBar para orquestrar componentes
   * Usar hooks extraídos
   * Renderizar componentes extraídos
   * Manter apenas lógica de coordenação

 **Resultado esperado** :

```
MenuBar.tsx (150 linhas)
hooks/
  ├── useFileOperations.ts (80 linhas)
  ├── usePDFExport.ts (100 linhas)
  └── useExcelExport.ts (60 linhas)
components/
  ├── ThemeSelector.tsx (40 linhas)
  ├── LanguageSelector.tsx (40 linhas)
  └── ViewTabs.tsx (30 linhas)
```

 **Riscos** :

* Quebrar funcionalidade de import/export
* Perder estado durante refatoração
* Quebrar auto-save

 **Mitigação** :

* Testar cada hook isoladamente
* Manter testes de integração
* Refatorar incrementalmente (um hook por vez)

---

#### 1.2 Decompor PowerBuilderOverlay.tsx

 **Objetivo** : Reduzir de 991 para ~300 linhas

 **Passos** :

1. Extrair `usePowerDragAndDrop` hook
   * Toda lógica de DnD (sensors, handlers, overlay)
   * Retorna: `{ sensors, handleDragStart, handleDragEnd, activeId }`
2. Extrair `usePowerCostCalculation` hook
   * Cálculos de custo (array, components, AEs)
   * Retorna: `{ totalCost, componentCosts, aeCosts, validateCosts }`
3. Criar `PowerComponentEditor.tsx` component
   * Editor de um componente individual
   * Props: `component`, `onChange`, `onRemove`, `modifiers`
4. Criar `ModifierDropzone.tsx` component (já existe, mas melhorar)
   * Zona de drop para modificadores
   * Props: `componentId`, `activeId`, `children`
5. Criar `PowerCostFooter.tsx` component
   * Display de custos totais
   * Props: `totalCost`, `breakdown`, `warnings`
6. Criar `PowerValidationWarnings.tsx` component
   * Display de avisos de validação
   * Props: `warnings`, `strictMode`
7. Refatorar PowerBuilderOverlay para orquestrar
   * Usar hooks extraídos
   * Renderizar componentes extraídos
   * Manter apenas lógica de coordenação

 **Resultado esperado** :

```
PowerBuilderOverlay.tsx (300 linhas)
hooks/
  ├── usePowerDragAndDrop.ts (150 linhas)
  ├── usePowerCostCalculation.ts (120 linhas)
  └── useAlternateEffects.ts (já existe)
components/
  ├── PowerComponentEditor.tsx (150 linhas)
  ├── ModifierDropzone.tsx (50 linhas)
  ├── PowerCostFooter.tsx (80 linhas)
  └── PowerValidationWarnings.tsx (60 linhas)
```

 **Riscos** :

* Quebrar drag-and-drop
* Perder sincronização de custos
* Quebrar validação de AEs

 **Mitigação** :

* Testar DnD isoladamente
* Manter testes de custo existentes
* Refatorar incrementalmente

---

#### 1.3 Padronizar Importação de Game Data

 **Objetivo** : Usar apenas `gameDataLoaders.ts`

 **Passos** :

1. Identificar todos os imports diretos de JSON
   ```bash
   grep -r "from.*data/.*\.json" src/
   ```
2. Substituir em `MenuBar.tsx` (linhas 11-14)
   * Remover: `import powerDefsJson from '../../data/powers.json'`
   * Usar: `POWER_DEFS` (já importado na linha 20)
3. Substituir em `AdvantagesPanel.tsx` (linha 4)
   * Remover: `import advantageDefsRaw from '../../data/advantages.json'`
   * Usar: `import { ADVANTAGE_DEFS } from '../../entities/gameDataLoaders'`
4. Verificar outros arquivos
   * Buscar padrão em todo o projeto
   * Substituir todos os casos
5. Adicionar ESLint rule para prevenir
   ```javascript
   'no-restricted-imports': ['error', {
     patterns: ['**/data/*.json']
   }]
   ```

 **Resultado esperado** :

* Zero imports diretos de `data/*.json`
* Todos os imports via `gameDataLoaders.ts`
* ESLint previne regressão

 **Riscos** :

* Quebrar tipagem em alguns lugares
* Perder transformações específicas

 **Mitigação** :

* Verificar tipos após cada substituição
* Rodar testes após mudanças
* Commit incremental

---

### Fase 2: Melhorias de Qualidade (Média Prioridade)

#### 2.1 Adicionar Zustand Middleware

 **Objetivo** : Melhorar debugging e persistência

 **Passos** :

1. Instalar devtools
   ```bash
   npm install zustand@latest
   ```
2. Adicionar devtools ao `charStore.ts`
   ```typescript
   import { devtools } from 'zustand/middleware'

   export const useCharStore = create<CharStoreState>()(
     devtools(
       (set) => ({ /* ... */ }),
       { name: 'CharStore' }
     )
   )
   ```
3. Adicionar persist middleware ao `appStore.ts`
   ```typescript
   import { persist, devtools } from 'zustand/middleware'

   export const useAppStore = create<AppStoreState>()(
     devtools(
       persist(
         (set) => ({ /* ... */ }),
         { name: 'mm3e-app-preferences' }
       ),
       { name: 'AppStore' }
     )
   )
   ```
4. Repetir para `sessionStore.ts` com sessionStorage

 **Resultado esperado** :

* Redux DevTools funcionando
* Persistência automática
* Melhor debugging

 **Riscos** :

* Quebrar persistência existente
* Aumentar bundle size

 **Mitigação** :

* Testar persistência após mudanças
* Verificar bundle size
* Manter fallback manual

---

#### 2.2 Decompor Componentes Grandes (300-500 linhas)

 **Objetivo** : Reduzir complexidade de 7 componentes

 **Priorização** :

1. **SkillsPanel.tsx** (499 linhas) - maior impacto
2. **HeaderPanel.tsx** (489 linhas) - alta visibilidade
3. **OffensePanel.tsx** (351 linhas) - lógica complexa
4. **AdvantagesPanel.tsx** (329 linhas) - padrão repetido

 **Estratégia comum** :

* Extrair lógica de negócio para hooks
* Extrair subcomponentes de UI
* Manter painel como orquestrador

 **Exemplo para SkillsPanel.tsx** :

```
SkillsPanel.tsx (200 linhas)
hooks/
  └── useSkillsManagement.ts (150 linhas)
components/
  ├── SkillRow.tsx (80 linhas)
  └── SkillSubtypeEditor.tsx (60 linhas)
```

---

#### 2.3 Adicionar Error Boundaries

 **Objetivo** : Melhorar resiliência da aplicação

 **Passos** :

1. Criar `ErrorBoundary.tsx` component
   ```typescript
   class ErrorBoundary extends React.Component {
     state = { hasError: false, error: null }

     static getDerivedStateFromError(error) {
       return { hasError: true, error }
     }

     componentDidCatch(error, errorInfo) {
       console.error('Error caught:', error, errorInfo)
     }

     render() {
       if (this.state.hasError) {
         return <ErrorFallback error={this.state.error} />
       }
       return this.props.children
     }
   }
   ```
2. Criar `ErrorFallback.tsx` component
   * UI amigável para erros
   * Botão de "Reload"
   * Opção de reportar erro
3. Adicionar boundaries em `App.tsx`
   ```typescript
   <ErrorBoundary>
     <MenuBar />
     <ErrorBoundary>
       {activeView === 'sheet' ? <SheetView /> : <ReferencesView />}
     </ErrorBoundary>
   </ErrorBoundary>
   ```
4. Adicionar boundaries em features críticas
   * PowerBuilderOverlay
   * PDF export
   * File import

 **Resultado esperado** :

* Erros não crasham toda a app
* UX melhor em caso de erro
* Logs estruturados

---

#### 2.4 Resolver DashboardBar Placeholder

 **Objetivo** : Limpar código morto

 **Opções** :

1. **Remover completamente** (recomendado)
   * Deletar `src/features/dashboard/DashboardBar.tsx`
   * Remover imports relacionados
   * Atualizar documentação
2. **Implementar funcionalidade**
   * Mover lógica do MenuBar para DashboardBar
   * Refatorar MenuBar para usar DashboardBar
   * Requer mais trabalho

 **Recomendação** : Opção 1 (remover)

---

#### 2.5 Adicionar Script de Testes

 **Objetivo** : Tornar testes executáveis

 **Passos** :

1. Verificar configuração do Vitest
   ```typescript
   // vitest.config.ts já existe
   ```
2. Adicionar script ao `package.json`
   ```json
   "scripts": {
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage"
   }
   ```
3. Verificar que testes rodam
   ```bash
   npm test
   ```
4. Adicionar ao CI/CD (se existir)

 **Resultado esperado** :

* `npm test` funciona
* Testes rodam em CI
* Coverage report disponível

---

### Fase 3: Otimizações Avançadas (Baixa Prioridade)

#### 3.1 Refatorar PDF Service com Builder Pattern

 **Objetivo** : Reduzir acoplamento entre seções

 **Conceito** :

```typescript
class PDFBuilder {
  private sections: PDFSection[] = []
  
  addSection(section: PDFSection) {
    this.sections.push(section)
    return this
  }
  
  async build(character: ICharacter): Promise<PDFDocument> {
    const doc = await loadPDFTemplate()
    const form = doc.getForm()
  
    for (const section of this.sections) {
      section.fill(form, character)
    }
  
    return doc
  }
}

// Uso
const pdf = new PDFBuilder()
  .addSection(new HeaderSection())
  .addSection(new AbilitiesSection())
  .addSection(new DefensesSection())
  .build(character)
```

 **Benefícios** :

* Seções independentes
* Fácil adicionar/remover seções
* Testável isoladamente

---

#### 3.2 Adicionar Proteção contra Circular Dependencies

 **Objetivo** : Prevenir problemas futuros

 **Passos** :

1. Instalar plugin
   ```bash
   npm install --save-dev eslint-plugin-import
   ```
2. Adicionar regra ao `eslint.config.js`
   ```javascript
   'import/no-cycle': ['error', { maxDepth: 10 }]
   ```
3. Rodar lint
   ```bash
   npm run lint
   ```
4. Corrigir qualquer circular dependency detectada

---

#### 3.3 Implementar Path Aliases

 **Objetivo** : Reduzir imports profundos

 **Passos** :

1. Adicionar ao `tsconfig.app.json`
   ```json
   "compilerOptions": {
     "baseUrl": ".",
     "paths": {
       "@/*": ["src/*"],
       "@app/*": ["src/app/*"],
       "@features/*": ["src/features/*"],
       "@shared/*": ["src/shared/*"],
       "@store/*": ["src/store/*"],
       "@entities/*": ["src/entities/*"],
       "@services/*": ["src/services/*"]
     }
   }
   ```
2. Configurar Vite (`vite.config.ts`)
   ```typescript
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
       '@app': path.resolve(__dirname, './src/app'),
       // ...
     }
   }
   ```
3. Migrar imports gradualmente
   * De: `import { X } from '../../../shared/hooks/X'`
   * Para: `import { X } from '@shared/hooks/X'`

 **Benefícios** :

* Imports mais limpos
* Menos erros de path
* Mais fácil refatorar

---

## 🎯 Priorização Recomendada

### Sprint 1 (1-2 semanas)

1. ✅ Padronizar importação de game data (1.3)
2. ✅ Adicionar script de testes (2.5)
3. ✅ Remover DashboardBar placeholder (2.4)

### Sprint 2 (2-3 semanas)

4. 🔥 Decompor MenuBar.tsx (1.1)
5. 🔥 Adicionar Zustand middleware (2.1)

### Sprint 3 (2-3 semanas)

6. 🔥 Decompor PowerBuilderOverlay.tsx (1.2)
7. ✅ Adicionar Error Boundaries (2.3)

### Sprint 4 (1-2 semanas)

8. ✅ Decompor componentes grandes (2.2)
9. ✅ Adicionar proteção circular deps (3.2)

### Backlog (futuro)

10. 💡 Refatorar PDF Service (3.1)
11. 💡 Implementar path aliases (3.3)

---

## 📈 Métricas de Sucesso

### Antes da Refatoração

* MenuBar.tsx: 525 linhas
* PowerBuilderOverlay.tsx: 991 linhas
* Componentes > 300 linhas: 9 arquivos
* Imports inconsistentes: 3 arquivos
* Error boundaries: 0
* Zustand devtools: Não
* Script de testes: Não

### Após Refatoração (Meta)

* MenuBar.tsx: ~150 linhas (-71%)
* PowerBuilderOverlay.tsx: ~300 linhas (-70%)
* Componentes > 300 linhas: 2 arquivos (-78%)
* Imports inconsistentes: 0 arquivos (-100%)
* Error boundaries: 4+ boundaries
* Zustand devtools: Sim
* Script de testes: Sim

---

## ⚠️ Riscos Gerais

### Riscos Técnicos

1. **Quebrar funcionalidade existente** durante refatoração
   * Mitigação: Testes automatizados + refatoração incremental
2. **Aumentar bundle size** com novos hooks/componentes
   * Mitigação: Code splitting + tree shaking + análise de bundle
3. **Perder performance** com mais componentes
   * Mitigação: React.memo + useMemo + profiling

### Riscos de Processo

1. **Tempo de desenvolvimento** maior que estimado
   * Mitigação: Priorização clara + sprints curtos
2. **Regressões** não detectadas
   * Mitigação: Testes de integração + QA manual
3. **Conflitos de merge** em refatorações grandes
   * Mitigação: Branches pequenos + merges frequentes

---

## 🎓 Recomendações Adicionais

### Documentação

1. Adicionar ADRs (Architecture Decision Records)
2. Documentar padrões de componentes
3. Criar guia de contribuição atualizado

### Qualidade de Código

1. Adicionar Prettier para formatação consistente
2. Configurar pre-commit hooks (husky + lint-staged)
3. Adicionar coverage mínimo (80%)

### Performance

1. Implementar code splitting por rota
2. Lazy load de componentes pesados
3. Memoização estratégica

### Monitoramento

1. Adicionar error tracking (Sentry)
2. Implementar analytics de uso
3. Monitorar bundle size em CI

---

## 📝 Conclusão

O projeto MM3E Character Builder possui uma  **base arquitetural sólida** , mas sofre de **component bloat** em áreas críticas (MenuBar e PowerBuilderOverlay). A refatoração proposta é  **viável e incremental** , com riscos controlados e benefícios claros.

 **Próximos passos recomendados** :

1. Aprovar este plano
2. Começar com Sprint 1 (quick wins)
3. Avaliar resultados antes de Sprint 2
4. Ajustar prioridades conforme necessário

Deseja que eu prossiga com alguma fase específica da refatoração?
