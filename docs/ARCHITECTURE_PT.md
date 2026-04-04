# Gerenciador de Fichas e Construtor de Poderes — Mutants & Masterminds 3e

Plano de engenharia para o criador de fichas de M&M 3e, com foco no Power Builder visual. Arquitetura escalável, princípios S.O.L.I.D. aplicados na prática e faseamento claro de entregas.

> [!IMPORTANT]
> Este documento foi refatorado com base em análise crítica rigorosa. Todas as lacunas identificadas foram corrigidas. Aguardo aprovação final para iniciar a execução.

---

## 1. Faseamento de Entregas (MVP → V2)

Para mitigar o risco de escopo, o projeto será dividido em fases com entregáveis concretos e testáveis:

### Fase 1 — MVP Funcional (Entrega Prioritária)
1. Scaffolding Vite + React + TS + Zustand
2. Sistema de Temas (CSS Custom Properties + 4 temas pre-made)
3. Ficha Single Page completa (Atributos, Defesas, Perícias, Vantagens, Complicações)
4. Power Builder Overlay Fullscreen com Drag & Drop (`@dnd-kit/core`)
5. Engine matemática (`mathEngine`) com testes unitários
6. Fluxo Novo / Exportar / Importar JSON (com versionamento de schema)
7. Menu Bar com Dropdown de Configurações (Toggle Strict Mode + Seletor de Tema)
8. Tooltips explicativas nos Efeitos e Modificadores (essenciais para usabilidade do Power Builder desde o dia 1)

### Fase 2 — Polimento e Exportação
9. Gerador de PDF (preenchimento de template com `pdf-lib`)
10. Exportador para planilha `.xlsx` (`exceljs`)
11. Sistema de Undo/Redo no Power Builder (`Ctrl+Z` / `Ctrl+Y` via middleware temporal do Zustand)
12. Onboarding guiado (tour interativo para novos usuários)

### Fase 3 — Expansões Futuras
13. Editor visual de Temas customizados (Color Picker)
14. Construtor de Veículos / Bases (QG)
15. Biblioteca de Poderes prontos (presets da comunidade)
16. Suporte responsivo para tablets e dispositivos touch

### Estimativas de Complexidade por Fase

| Fase | Item mais complexo | Esforço relativo |
|---|---|---|
| **Fase 1** | Power Builder (Drag & Drop + Engine) | ~60% do esforço total da fase — é a feature que exige mais iteração visual e lógica matemática |
| **Fase 1** | Ficha Single Page | ~20% — componentes formulário padrão |
| **Fase 1** | Temas + Menu Bar + File I/O | ~20% — infraestrutura |
| **Fase 2** | PDF Generator | ~40% — mapeamento campo-a-campo do template |
| **Fase 2** | Undo/Redo | ~30% — requer middleware de histórico no Zustand |
| **Fase 2** | Excel + Onboarding | ~30% — integração da lib + UX guiado |

> [!TIP]
> Se precisarmos cortar escopo, a ordem de sacrifício é: Excel → PDF → Undo/Redo → Onboarding Tour. O Power Builder, a Engine Matemática e as Tooltips **nunca** serão cortados.

---

## 2. Princípios de Engenharia (Aplicados na Prática)

| Princípio | Implementação Concreta |
|---|---|
| **SRP** | `charStore.ts` só gerencia estado da ficha. `fileService.ts` cuida de I/O (import/export). `mathEngine.ts` cuida de cálculos. `validation.ts` cuida de limites do PL. |
| **OCP** | Novos Efeitos e Modificadores são adicionados exclusivamente via JSONs de dados, sem tocar no código. |
| **DIP** | `mathEngine` recebe dados via interfaces TypeScript (`IPower`, `IModifier`), nunca importa stores diretamente. |
| **Feature-Sliced** | Cada domínio (`power-builder/`, `sheet-core/`, `dashboard/`) encapsula seus próprios componentes, hooks e tipos locais. |
| **Configuração Mutável** | `appStore.ts` armazena preferências (Strict Mode, tema ativo). A `mathEngine` recebe as flags como parâmetro, sem acoplamento direto ao store. |

### Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Interfaces TypeScript | Prefixo `I` + PascalCase | `IPower`, `IModifier`, `ICharacter` |
| Tipos TypeScript | PascalCase sem prefixo | `AbilityKey`, `CostType` |
| Arquivos de componente | PascalCase | `PowerCard.tsx`, `EffectPalette.tsx` |
| Arquivos de serviço/lib | camelCase | `mathEngine.ts`, `fileService.ts` |
| Chaves JSON de dados | camelCase | `baseCost`, `costType`, `baseAbility` |
| Abreviações de habilidades | 3 letras minúsculas (padrão oficial M&M) | `str`, `sta`, `agl`, `dex`, `fgt`, `int`, `awe`, `pre` |
| IDs em JSON de dados | snake_case | `"power_attack"`, `"close_combat"` |
| CSS Custom Properties | kebab-case com prefixo `--c-` (cor) ou `--s-` (espaçamento) | `--c-primary`, `--c-surface`, `--s-gap` |

---

## 3. Estilização e Temas (Padrão da Indústria)

- **Padrão CSS Custom Properties**: Zero cores hard-coded. Todo o design system será governado por variáveis CSS injetadas no `:root`, alternadas por atributo `data-theme` no `<html>`.
- **Temas Pre-Made inclusos** (4 padrões):

| Tema | Perfil | Primária | Superfície |
|---|---|---|---|
| `dark-knight` | Dark mode premium | `#6C63FF` Roxo | `#0D0D14` Preto profundo |
| `arc-reactor` | Neon tecnológico | `#00D4FF` Azul elétrico | `#0A1628` Azul escuro |
| `cyberpunk` | Vibrante & quente | `#FF2D6B` Rosa neon | `#1A0A1E` Roxo escuro |
| `light-print` | Impressão/leitura | `#2563EB` Azul clássico | `#FAFAFA` Branco |

- **Troca de tema**: Via seletor no Dropdown da Menu Bar. Persiste no `localStorage`.
- **Customização futura (V3)**: O sistema de variáveis permitirá um editor visual de cores sem alterar código.

---

## 4. UX Premium: Ficha Single Page + Overlay Fullscreen

### Ficha Single Page (Visão Principal)
Todos os dados do personagem em uma única página contínua e scrollável: Cabeçalho → Atributos → Defesas → Perícias → Vantagens → Lista de Poderes → Complicações.

### Power Builder (Modal Fullscreen Overlay)
Na seção de Poderes da ficha, botões "**+ Novo Poder**" e "**Editar**" (por poder) abrem o construtor em overlay fullscreen com transição animada.

**Layout interno do Overlay:**
```
┌─────────────────────────────────────────────────────┐
│ [Top Menu Bar]  Filtros | + Array | Expandir | Fechar│
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  PALETA      │    BANCADA DE CONSTRUÇÃO             │
│  (Sidebar)   │                                      │
│              │  ┌─────────────────────────────┐     │
│  🔍 Busca    │  │ Efeito: Dano (Rank 10)      │     │
│              │  │ ┌───────┐ ┌───────┐         │     │
│  ▸ Extras    │  │ │Alcance│ │ Área  │ ← DROP  │     │
│  ▸ Falhas    │  │ └───────┘ └───────┘         │     │
│  ▸ Efeitos   │  │ Custo: (1+1+1)×10 = 30 PP  │     │
│              │  └─────────────────────────────┘     │
│              │                                      │
│  [DRAG >>>]  │  [Dropzone: Solte modificadores aqui]│
│              │                                      │
├──────────────┴──────────────────────────────────────┤
│ [Rodapé] Total: 30 PP  │  Salvar  │  Cancelar      │
└─────────────────────────────────────────────────────┘
```

**Funcionalidades UX Detalhadas:**

| Feature | Descrição |
|---|---|
| **Drag & Drop** | Biblioteca `@dnd-kit/core` + `@dnd-kit/sortable`. Arrastar Extras/Falhas da Paleta para a Dropzone do poder. Feedback visual (ghost, highlight de zona) durante o arraste. |
| **Busca Textual** | Campo de filtro na Paleta para digitar "área" e mostrar apenas modificadores que contenham o termo (nome ou descrição). Essencial com centenas de entradas. |
| **Tooltips Explicativas** | Ao passar o mouse sobre qualquer Efeito ou Modificador, renderiza um tooltip rico com: descrição da regra, custo, tipo de ação e referência de página do livro. |
| **Feedback de Validação Inline** | Se o usuário aplicar um Extra incompatível ou ultrapassar limites do PL (em Strict Mode), o bloco pulsa em vermelho com mensagem contextual. Nunca silencioso. |
| **Undo / Redo (V2)** | Stack de ações com `Ctrl+Z` / `Ctrl+Y` dentro do Builder. Implementado via middleware de histórico no Zustand (padrão `temporal`). |
| **Cálculo ao Vivo** | Ao soltar um bloco, o rodapé atualiza instantaneamente: `Base (X) + Extras (Y) - Falhas (Z) = Custo/Rank × Ranks + Flats = Total PP`. |
| **Sincronização** | Ao clicar "Salvar" e fechar o overlay, o poder aparece imediatamente na lista da ficha (Single Source of Truth via Zustand). |

### Responsividade e Plataforma

- **Desktop-first**: O aplicativo é projetado primariamente para uso em desktop/laptop com mouse e teclado. O layout de duas colunas do Power Builder (Paleta + Bancada) e o Drag & Drop são otimizados para ponteiro.
- **Tablet (V3)**: Em telas menores, a Paleta colapsará para um drawer deslizante e o Drag & Drop utilizará os sensores de toque do `@dnd-kit` (`TouchSensor` + `KeyboardSensor` como fallback). Botões "Tap-to-Add" serão oferecidos como alternativa ao arraste.
- **Mobile**: Não será suportado na V1/V2. A complexidade do Power Builder exige espaço visual mínimo.

### Acessibilidade (a11y)

- **Contraste WCAG AA**: Todos os 4 temas pré-fabricados serão validados para manter ratio mínimo de `4.5:1` em texto e `3:1` em elementos interativos. Temas neon (arc-reactor, cyberpunk) usarão versões levemente dessaturadas em textos pequenos.
- **Navegação por teclado**: O `@dnd-kit` suporta nativamente `KeyboardSensor` — itens da paleta poderão ser movidos via `Tab` + `Enter` + setas. Todos os botões e inputs terão `tabIndex` e `focus-visible` estilizado.
- **Aria Labels**: Dropzones, chips de modificadores e cards de poder receberão `aria-label` descritivos (ex: `aria-label="Modificador Extra: À Distância, custo +1 por rank"`).
- **Preferência de movimento reduzido**: Animações CSS respeitarão `prefers-reduced-motion: reduce` para desabilitar transições e micro-animações.

---

## 5. Mapeamento Completo da Ficha M&M 3e

### 5.1 Cabeçalho e Metadados do Personagem
| Campo | Tipo | Observação |
|---|---|---|
| `name` | `string` | Nome do herói/vilão |
| `player` | `string` | Nome do jogador |
| `identity` | `string` | Identidade secreta/pública |
| `base` | `string` | Base de operações |
| `powerLevel` | `number` | **PL** — define todos os tetos matemáticos |
| `heroPoints` | `number` | Pontos Heróicos iniciais |
| `totalPP` | `number` | Calculado: geralmente `PL × 15` |

### 5.2 Habilidades (Abilities) — Custo: 2 PP / rank
| Habilidade | Abreviação | Descrição |
|---|---|---|
| Força | `str` | Capacidade física, dano corpo-a-corpo |
| Vigor | `sta` | Resistência e saúde |
| Agilidade | `agl` | Reflexos, esquiva, iniciativa |
| Destreza | `dex` | Coordenação fina, mira |
| Luta | `fgt` | Combate corpo-a-corpo, aparar |
| Intelecto | `int` | Raciocínio, conhecimento |
| Prontidão | `awe` | Percepção, força de vontade |
| Presença | `pre` | Carisma, intimidação |

> [!NOTE]
> **Habilidade Ausente (`absent`)**: Um atributo pode ser marcado como `--` (ausente). Custo = `0 PP`. O personagem não pode usar checks dessa habilidade. Isso precisa ser suportado na interface (ex: Construtos sem `sta`).

### 5.3 Defesas — Custo: 1 PP / rank comprado acima do atributo base
| Defesa | Atributo Base | Observações |
|---|---|---|
| Esquiva (Dodge) | `agl` | Rank total = `agl` + ranks comprados |
| Aparar (Parry) | `fgt` | Rank total = `fgt` + ranks comprados |
| Fortitude | `sta` | Rank total = `sta` + ranks comprados |
| Vontade (Will) | `awe` | Rank total = `awe` + ranks comprados |
| Resistência (Toughness) | `sta` | **NÃO permite compra direta.** Sobe apenas via Efeito `Proteção` ou Vantagem `Rolamento Defensivo`. |
| Iniciativa | `agl` | Calculada: `agl` + bônus de Vantagens (ex: `Iniciativa Aprimorada`). Não custa PP. |

### 5.4 Perícias (Skills) — Custo: 1 PP por 2 ranks
| Perícia | Atributo Base |
|---|---|
| Acrobacia | `agl` |
| Atletismo | `str` |
| Combate Corpo-a-Corpo (por tipo) | `fgt` |
| Combate à Distância (por tipo) | `dex` |
| Enganação | `pre` |
| Especialidade (Knowledge) | `int` |
| Furtividade | `agl` |
| Intimidação | `pre` |
| Investigação | `int` |
| Percepção | `awe` |
| Persuasão | `pre` |
| Prestidigitação | `dex` |
| Tecnologia | `int` |
| Tratamento | `int` |
| Veículos | `dex` |

> [!NOTE]
> **Perícias de Combate** (Corpo-a-Corpo e À Distância) são *sub-tipadas* — o jogador precisa especificar o tipo de arma/ataque (ex: "Combate Corpo-a-Corpo: Espadas"). Cada sub-tipo é comprado separadamente.

### 5.5 Vantagens (Advantages) — Custo: 1 PP / rank
Lista populada pelo arquivo `advantages.json`. Cada vantagem possui: `name`, `ranked` (boolean), `description`.

### 5.6 Poderes (Powers) — Motor Matemático
- **Custo por Rank** = `custoBaseEfeito + somaExtrasPerRank - somaFalhasPerRank`
- Se esse resultado for `≤ 0`, aplica-se a fórmula fracionária: `1 PP a cada N ranks` (onde N = `2 - custoLiquido`).
- **Custo Total** = `(custoPerRank × ranks) + somaFlatExtras - somaFlatFalhas` (mínimo 1 PP).
- **Alternate Effects (Arrays)**: Efeito Alternativo custa **+1 PP flat**. Efeito Alternativo Dinâmico custa **+2 PP flat**. O custo do array todo é o do efeito mais caro + flats dos alternativos.

> [!NOTE]
> **Efeitos com Custo Base Variável**: Alguns efeitos possuem custos que dependem de sub-opções internas. Exemplos:
> - `Sentidos (Senses)`: Custo varia por tipo de sentido adquirido (1 PP para Visão no Escuro, 2 PP para Rádio, etc). O schema `powers.json` prevê o campo opcional `variableCost` para estes casos — o Power Builder renderizará um seletor de sub-opções antes de calcular.
> - `Aflição (Affliction)`: Custo base fixo (1/rank), mas o jogador escolhe 3 condições progressivas. Isso é tratado como metadado descritivo (campos `condition1`, `condition2`, `condition3`), sem impacto no custo.
> - `Imunidade (Immunity)`: Custo varia de 1 a 80 PP dependendo da amplitude (ex: "Imunidade a Frio" vs "Imunidade a Todos os Efeitos").

### 5.7 Limites do Nível de Poder (PL Trade-Off Limits)

Estas são as **regras matemáticas centrais** que a `validation.ts` implementará quando o **Strict Mode** estiver ativo. O usuário receberá feedback visual (highlight amarelo/vermelho) caso ultrapasse qualquer teto:

| Regra | Fórmula | Exemplo (PL 10) |
|---|---|---|
| Ataque + Efeito (Dano/Aflição) | `bônusAtaque + rankEfeito ≤ PL × 2` | Ataque 10 + Dano 10 = 20 ≤ 20 ✅ |
| Esquiva + Resistência | `dodge + toughness ≤ PL × 2` | Esquiva 8 + Resistência 12 = 20 ≤ 20 ✅ |
| Aparar + Resistência | `parry + toughness ≤ PL × 2` | Aparar 13 + Resistência 8 = 21 > 20 ❌ |
| Fortitude + Vontade | `fortitude + will ≤ PL × 2` | Fortitude 10 + Vontade 10 = 20 ≤ 20 ✅ |
| Rank de Perícia (não-combate) | `abilityBase + ranks ≤ PL + 10` | INT 5 + Tecnologia 15 = 20 ≤ 20 ✅ |
| Rank de Perícia (combate) | `abilityBase + ranks ≤ PL × 2` | FGT 8 + CC: Espadas 12 = 20 ≤ 20 ✅ |

> [!WARNING]
> Com **Strict Mode desabilitado** (via Menu Bar), todas estas validações são **ignoradas** e nenhum alerta visual é gerado. Ideal para criar NPCs, divindades ou personagens experimentais sem restrições.

### 5.8 Complicações (Complications)
Lista livre de texto: `{ title: string, description: string }`. Sem custo de PP — fonte narrativa de Hero Points em jogo.

---

## 6. Schemas JSON dos Arquivos de Dados

Contratos exatos para que o preenchimento manual seja rápido e sem ambiguidade.

### `powers.json`
```json
[
  {
    "id": "damage",
    "name": "Dano",
    "type": "attack",
    "baseCost": 1,
    "action": "standard",
    "range": "close",
    "duration": "instant",
    "description": "Inflige dano físico ou energético ao alvo.",
    "variableCost": null
  },
  {
    "id": "senses",
    "name": "Sentidos",
    "type": "sensory",
    "baseCost": 1,
    "action": "none",
    "range": "personal",
    "duration": "permanent",
    "description": "Concede sentidos adicionais ou aprimorados.",
    "variableCost": {
      "options": [
        { "name": "Visão no Escuro", "cost": 1 },
        { "name": "Sentido de Rádio", "cost": 1 },
        { "name": "Visão de Raio-X", "cost": 4 }
      ]
    }
  }
]
```

> [!NOTE]
> O campo `variableCost` é **nulo** para efeitos de custo fixo (a maioria). Quando preenchido, o Power Builder renderiza um seletor de sub-opções que substitui o `baseCost` pelo valor selecionado. Isso mantém o JSON simples para efeitos comuns e extensível para os variáveis.

### `modifiers.json`
```json
[
  {
    "id": "ranged",
    "name": "À Distância",
    "category": "extra",
    "costType": "per_rank",
    "costValue": 1,
    "description": "Muda o alcance do efeito de Perto para À Distância.",
    "incompatibleWith": []
  },
  {
    "id": "tiring",
    "name": "Cansativo",
    "category": "flaw",
    "costType": "per_rank",
    "costValue": -1,
    "description": "Usar o efeito causa uma condição de fadiga.",
    "incompatibleWith": []
  },
  {
    "id": "homing",
    "name": "Teleguiado",
    "category": "extra",
    "costType": "flat",
    "costValue": 1,
    "description": "O ataque tenta atingir o alvo novamente se errar.",
    "incompatibleWith": []
  }
]
```

### `advantages.json`
```json
[
  {
    "id": "power_attack",
    "name": "Ataque Poderoso",
    "ranked": false,
    "description": "Trocar bônus de acerto por dano em ataques corpo-a-corpo."
  }
]
```

### `skills.json`
```json
[
  {
    "id": "acrobatics",
    "name": "Acrobacia",
    "baseAbility": "agl",
    "subtyped": false
  },
  {
    "id": "close_combat",
    "name": "Combate Corpo-a-Corpo",
    "baseAbility": "fgt",
    "subtyped": true
  }
]
```

### Schema do arquivo de ficha exportada (`.json`)
```json
{
  "schemaVersion": "1.0.0",
  "exportedAt": "2026-04-02T14:00:00Z",
  "character": {
    "header": { "name": "", "player": "", "identity": "", "base": "", "powerLevel": 10, "heroPoints": 1 },
    "abilities": { "str": 0, "sta": 0, "agl": 0, "dex": 0, "fgt": 0, "int": 0, "awe": 0, "pre": 0 },
    "absentAbilities": [],
    "defenses": { "dodge": 0, "parry": 0, "fortitude": 0, "will": 0 },
    "skills": [
      { "skillId": "acrobatics", "ranks": 4, "subtype": null }
    ],
    "advantages": [
      { "advantageId": "power_attack", "ranks": 1 }
    ],
    "powers": [
      {
        "id": "uuid-gerado-automaticamente",
        "name": "Rajada Mágica",
        "effectId": "damage",
        "ranks": 10,
        "modifiers": [
          { "modifierId": "ranged", "ranks": 1 },
          { "modifierId": "homing", "ranks": 2 }
        ],
        "notes": "Energia arcana pura",
        "alternateEffects": [
          {
            "id": "uuid-alt",
            "name": "Escudo Arcano",
            "effectId": "protection",
            "ranks": 10,
            "modifiers": [],
            "dynamic": false,
            "notes": ""
          }
        ]
      }
    ],
    "complications": [
      { "title": "Motivação", "description": "Proteger os inocentes" }
    ]
  }
}
```

> [!NOTE]
> **Estrutura interna de um Poder salvo**: Cada poder referencia o `effectId` (link para `powers.json`) e seus modificadores via `modifierId` (link para `modifiers.json`). Os `alternateEffects` são uma lista aninhada com a mesma estrutura, mais o flag `dynamic` (false = +1 PP, true = +2 PP). IDs de poderes são UUIDs gerados no momento da criação para garantir unicidade.

> [!WARNING]
> O campo `schemaVersion` é **obrigatório**. Na importação, o `fileService.ts` validará a versão e, caso o schema seja antigo, executará migrações automáticas. Arquivos sem versão ou corrompidos serão rejeitados com mensagem amigável ao usuário.

---

## 7. Resiliência e Tratamento de Erros

| Cenário | Solução |
|---|---|
| Fechar aba sem exportar | **Auto-save** no `localStorage` a cada alteração. Ao reabrir, pergunta "Restaurar rascunho?" |
| Importar JSON corrompido | `fileService.ts` valida contra o schema Zod (checagem de tipo em runtime). Exibe modal de erro descritivo com indicação do campo problemático. |
| Importar schema antigo | Migração automática versionada (`v1.0 → v1.1`). Informa o usuário que o arquivo foi atualizado. |
| Limpar cache do navegador | Aviso permanente na UI: "Exporte sua ficha para não perder dados". Botão de export sempre visível na Menu Bar. |
| Extras incompatíveis | Validação inline no Power Builder com mensagem contextual: "Este Extra não é compatível com efeitos de duração Instantânea". |
| localStorage cheio (limite ~5-10MB) | O auto-save usará `try/catch` ao gravar. Em caso de falha por `QuotaExceededError`, dispara automaticamente o download do `.json` como backup emergencial e exibe alerta: "Armazenamento local cheio. Sua ficha foi exportada automaticamente". |

---

## 8. Estratégia de Testes

| Camada | Ferramenta | O que testa |
|---|---|---|
| **Unitário: mathEngine** | `vitest` | Cálculos de custo de poder (fracionários, arrays, flats). Caso de teste: Dano 10 + Alcance + Área - Cansativo = `(1+1+1-1)×10 = 20 PP`. |
| **Unitário: fileService** | `vitest` | Serialização, deserialização, validação de schema, migração de versão. |
| **Unitário: validation** | `vitest` | Limites PL (ataque+dano ≤ 2×PL, dodge+toughness ≤ 2×PL, skill caps). |
| **Integração: stores** | `vitest` | Zustand store reage a mudanças de atributos e recalcula PP total. |
| **E2E / Visual** | Browser (manual) | Fluxo completo: novo → preencher → power builder → exportar → reimportar. |

---

## 9. Stack de Dependências

| Pacote | Uso |
|---|---|
| `react` + `react-dom` | UI Framework |
| `typescript` | Tipagem estática |
| `zustand` | State management |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag and Drop (acessível, moderno, leve) |
| `pdf-lib` | Geração/preenchimento de PDF client-side (V2) |
| `exceljs` | Geração de `.xlsx` client-side (V2) |
| `lucide-react` | Ícones SVG |
| `vitest` | Testes unitários |
| `zod` | Validação de schema JSON em runtime (import de fichas) |

---

## 10. Estrutura Definitiva de Diretórios

```
mm3e-builder/
├── vite.config.ts              ← base configurado para GitHub Pages
├── vitest.config.ts            ← configuração de testes
├── public/
│   └── template_ficha.pdf      ← template PDF oficial (V2)
└── src/
    ├── app/
    │   ├── App.tsx             ← Root: renderiza MenuBar + SheetView
    │   ├── main.tsx            ← Entry point React
    │   └── theme.css           ← CSS Custom Properties (4 temas + tokens)
    │
    ├── entities/
    │   ├── types.ts            ← Interfaces: ICharacter, IPower, IModifier, IAdvantage, ISkill
    │   └── schemas.ts          ← Zod schemas para validação runtime
    │
    ├── store/
    │   ├── charStore.ts        ← Estado da ficha ativa (apenas estado)
    │   └── appStore.ts         ← Preferências globais (tema, strict mode, flags)
    │
    ├── services/
    │   ├── fileService.ts      ← Import/Export JSON + validação + migração de schema
    │   ├── pdfGenerator.ts     ← Preenchimento do template PDF (V2)
    │   └── excelGenerator.ts   ← Geração de .xlsx (V2)
    │
    ├── shared/
    │   ├── lib/
    │   │   ├── mathEngine.ts   ← Cálculos puros (recebe interfaces, retorna números)
    │   │   └── validation.ts   ← Regras de limite PL (consultando flags de strict mode)
    │   ├── hooks/
    │   │   ├── useCalculatedPP.ts   ← Hook reativo: soma total de PP gastos na ficha
    │   │   ├── useDraftAutoSave.ts  ← Hook: persiste rascunho no localStorage com try/catch
    │   │   ├── useTheme.ts          ← Hook: lê/troca tema ativo via appStore
    │   │   └── usePLValidation.ts   ← Hook: retorna violações dos limites de PL em tempo real
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Modal.tsx        ← Fullscreen Overlay wrapper
    │       ├── Tooltip.tsx
    │       ├── MenuBar.tsx
    │       └── DropZone.tsx     ← Wrapper DnD-Kit
    │
    ├── data/
    │   ├── powers.json         ← Efeitos Base (schema documentado acima)
    │   ├── modifiers.json      ← Extras e Falhas
    │   ├── advantages.json     ← Vantagens
    │   └── skills.json         ← Perícias
    │
    ├── features/
    │   ├── dashboard/
    │   │   └── DashboardBar.tsx ← Novo / Importar / Exportar / PDF / Excel
    │   ├── sheet-core/
    │   │   ├── SheetView.tsx    ← Ficha Single Page completa
    │   │   ├── AbilitiesPanel.tsx
    │   │   ├── DefensesPanel.tsx
    │   │   ├── SkillsPanel.tsx
    │   │   ├── AdvantagesPanel.tsx
    │   │   ├── PowersList.tsx   ← Lista resumida + botão "Abrir Builder"
    │   │   └── ComplicationsPanel.tsx
    │   └── power-builder/
    │       ├── PowerBuilderOverlay.tsx  ← Modal Fullscreen root
    │       ├── BuilderMenuBar.tsx       ← Filtros, atalhos, arrays
    │       ├── EffectPalette.tsx        ← Sidebar com busca textual
    │       ├── PowerCard.tsx            ← Bloco visual do poder em construção
    │       └── ModifierChip.tsx         ← Peça arrastável (Extra/Falha)
    │
    └── __tests__/
        ├── mathEngine.test.ts
        ├── fileService.test.ts
        └── validation.test.ts
```
