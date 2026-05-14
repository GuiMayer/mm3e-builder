# Funcionalidades Ausentes no Power Builder

**Data de Análise:** 14 de maio de 2026  
**Total de Funcionalidades Identificadas:** 52  
**Versão do MM3E Builder:** Atual

---

## 📋 Checklist Rápido

### 🔥 Alta Prioridade - Quick Wins (Implementar AGORA)

#### Regras do M&M 3E
- [x] **1.1** Power Descriptors (Fire, Ice, Magic, etc.)
- [ ] **1.2** Variable Cost Powers UI (Affliction degrees, Illusion sense types)
- [ ] **1.8** Weaken/Transform Target Selection

#### UX/UI
- [ ] **2.2** Duplicate Power/Component
- [ ] **2.3** Modifier Search in Applied List
- [ ] **2.4** Cost Breakdown Tooltip
- [x] **2.5** Modifier Incompatibility Warnings
- [ ] **2.11** Mobile Drag-and-Drop Alternative (expandir implementação)
- [ ] **2.13** Power Import/Export (JSON)

#### Validações
- [ ] **3.1** Modifier Max Ranks Enforcement (bloquear input)
- [ ] **3.4** Fractional Cost Warning
- [ ] **3.7** Alternate Effect Name Uniqueness (auto-naming)
- [ ] **3.8** Empty Component Detection
- [ ] **3.6** Minimum Effect Rank Warning

#### Integrações
- [ ] **4.2** Power Point Budget Tracker (barra de progresso)

### 🎯 Média Prioridade - Próxima Sprint

#### Regras do M&M 3E
- [ ] **1.7** Multiattack Damage Calculation

#### UX/UI
- [ ] **2.1** Power Templates/Presets
- [ ] **2.5** Modifier Incompatibility Warnings
- [ ] **2.7** Power Comparison View
- [ ] **2.8** Modifier Recommendations
- [ ] **2.9** Bulk Modifier Operations
- [ ] **2.10** Power Notes with Rich Text
- [ ] **2.12** Keyboard Shortcuts

#### Validações
- [ ] **3.2** Power Level Limits - Attack Bonus
- [ ] **3.3** Power Level Limits - Defense Bonus
- [ ] **3.9** Modifier Stacking Rules
- [ ] **3.10** Action Economy Validation
- [ ] **3.5** Descriptor Conflict Detection

#### Integrações
- [ ] **4.1** Auto-Calculate Accurate Ranks
- [ ] **4.5** Equipment Mode Integration (completar)
- [ ] **4.6** Power to Equipment Converter
- [ ] **4.8** Power Dependencies
- [ ] **4.9** Character Sheet Preview

### 🔧 Baixa Prioridade - Backlog

#### Regras do M&M 3E
- [ ] **1.3** Linked Modifier UI
- [ ] **1.4** Power Arrays - Shared Modifiers
- [ ] **1.5** Summon/Sidekick Powers (sub-builder)
- [ ] **1.6** Variable Power (pool reconfigurável)

#### UX/UI
- [ ] **2.6** Undo/Redo System

#### Integrações
- [ ] **4.4** Power Legality Checker
- [ ] **4.7** Batch Power Creation
- [ ] **4.10** Power History/Changelog
- [ ] **4.3** Suggested Alternate Effects (IA)
- [ ] **4.11** Community Power Library
- [ ] **4.12** AI Power Assistant

---

## 📊 Estatísticas

- **Total:** 52 funcionalidades
- **Quick Wins (Baixa Complexidade):** 15 (29%)
- **Média Complexidade:** 21 (40%)
- **Alta/Muito Alta Complexidade:** 16 (31%)

**Por Categoria:**
- Regras do M&M 3E: 8 itens
- UX/UI: 13 itens
- Validações: 10 itens
- Integrações: 12 itens

---


## 1. FUNCIONALIDADES DO M&M 3E (Regras do Sistema)

### 1.1 Power Descriptors ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** Regras do M&M 3E

**Descri��o:**
No Mutants & Masterminds 3E, poderes podem ter descritores (tags) como "Fire", "Ice", "Magic", "Technology", "Psionic", etc. Estes descritores afetam intera��es mec�nicas com outros poderes como Immunity, Nullify, e Weaken.

**Por que est� ausente:**
- O tipo ICharacterPower n�o possui campo para descritores
- N�o h� UI para adicionar/remover tags de descritores
- Sistema de valida��o n�o considera descritores

**Onde implementar:**
1. Adicionar campo descriptors: string[] em src/entities/types.ts ? ICharacterPower
2. Criar componente DescriptorTags.tsx com input de tags
3. Adicionar se��o no PowerBuilderOverlay.tsx ap�s o nome do poder
4. Incluir descritores no c�lculo de intera��es (Immunity, etc.)

**Exemplo de uso:**
`	ypescript
{
  id: "fire-blast",
  name: "Fire Blast",
  descriptors: ["Fire", "Energy", "Ranged"],
  components: [...]
}
`

**Impacto:**
- Permite modelar corretamente intera��es de poderes
- Essencial para Immunity ("Immunity to Fire" bloqueia poderes com descriptor "Fire")
- Melhora organiza��o e busca de poderes

---

### 1.2 Variable Cost Powers UI ??

**Complexidade:** M�dia  
**Prioridade:** Alta  
**Categoria:** Regras do M&M 3E

**Descri��o:**
Alguns poderes t�m custo vari�vel baseado em op��es escolhidas:
- **Affliction:** 1-3 PP/rank dependendo dos graus de condi��o
- **Illusion:** 1-5 PP/rank dependendo dos sentidos afetados
- **Environment:** Custo varia por tipo de efeito ambiental

**Por que est� ausente:**
- powers.json j� tem estrutura ariableCost definida
- UI n�o permite selecionar a op��o de custo
- C�lculo de custo assume sempre aseCost fixo

**Onde implementar:**
1. Em PowerComponentEditor.tsx, detectar se effectDef.variableCost existe
2. Renderizar radio buttons ou dropdown com as op��es
3. Armazenar escolha em ICharacterPowerComponent (novo campo costOption)
4. Atualizar usePowerCostCalculation.ts para usar custo vari�vel

**Exemplo de UI:**
`
Effect: Affliction
Cost Option:
  ? 1 degree (dazed/fatigued/hindered) - 1 PP/rank
  ? 2 degrees (add stunned/prone) - 2 PP/rank
  ? 3 degrees (add paralyzed/controlled) - 3 PP/rank
`

**Impacto:**
- Permite construir Affliction corretamente (poder muito comum)
- Illusion fica funcional (atualmente n�o pode ser configurada)
- Alinha builder com regras oficiais

---

### 1.3 Linked Modifier UI

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** Regras do M&M 3E

**Descri��o:**
O modifier "Linked" permite vincular dois ou mais efeitos para que ativem simultaneamente. Exemplo: Damage Linked com Weaken (espada que causa dano e enfraquece).

**Por que est� ausente:**
- Modifier "Linked" existe em modifiers.json
- N�o h� UI para selecionar qual poder/componente est� vinculado
- Sistema n�o valida se os poderes vinculados s�o compat�veis

**Onde implementar:**
1. Adicionar campo linkedTo: string[] em ICharacterPowerModifier
2. Criar dropdown que lista outros componentes do mesmo poder
3. Validar que componentes vinculados t�m mesma a��o/alcance
4. Mostrar visualmente a conex�o entre componentes vinculados

**Complexidade justificada:**
- Requer refatora��o do modelo de dados
- UI complexa para selecionar e visualizar v�nculos
- Valida��es cruzadas entre componentes

---

### 1.4 Power Arrays - Shared Modifiers

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** Regras do M&M 3E

**Descri��o:**
Em arrays de poderes (poder principal + alternate effects), modificadores podem ser compartilhados entre todos os efeitos do array, reduzindo custo total.

**Por que est� ausente:**
- Sistema atual trata cada AE independentemente
- N�o h� conceito de "modifier compartilhado"
- C�lculo de custo n�o considera economia de modifiers compartilhados

**Onde implementar:**
1. Adicionar campo sharedModifiers: ICharacterPowerModifier[] em ICharacterPower
2. UI para marcar modifiers como "shared" vs "specific"
3. Recalcular custo: shared modifiers pagos uma vez, aplicados a todos
4. Validar que shared modifiers s�o compat�veis com todos os AEs

**Exemplo:**
`
Power: Energy Control (30 PP)
  Shared: Accurate +2 (4 PP flat)
  Main: Damage 10 (Ranged) = 20 PP
  AE: Affliction 10 (Ranged) = 1 PP
  Total: 30 + 4 = 34 PP (vs 38 PP sem shared)
`

---


### 1.5 Summon/Sidekick Powers

**Complexidade:** Muito Alta  
**Prioridade:** Baixa  
**Categoria:** Regras do M&M 3E

**Descri��o:**
Summon e Sidekick s�o poderes que criam personagens secund�rios completos (minions, aliados, criaturas invocadas). Cada summon/sidekick � essencialmente uma ficha de personagem com seus pr�prios atributos, poderes e habilidades.

**Por que est� ausente:**
- Requer sub-builder completo de personagem
- Sistema de gerenciamento de m�ltiplos personagens
- C�lculo de custo baseado em PL do summon

**Onde implementar:**
1. Criar SummonBuilderOverlay.tsx (vers�o simplificada do character builder)
2. Adicionar campo summonedCharacter: ICharacter em power data
3. Sistema de templates para summons comuns (elementais, animais, etc.)
4. Valida��o de PL do summon vs custo do poder

**Impacto:**
- Permite construir summoners e necromancers corretamente
- Sidekicks s�o essenciais para alguns arqu�tipos
- Feature muito solicitada pela comunidade

---

### 1.6 Variable Power

**Complexidade:** Muito Alta  
**Prioridade:** Baixa  
**Categoria:** Regras do M&M 3E

**Descri��o:**
Variable permite reconfigurar pontos entre diferentes efeitos dinamicamente. Exemplo: Variable 10 (Magic Spells) permite gastar 10 PP em qualquer combina��o de efeitos m�gicos.

**Por que est� ausente:**
- Requer sistema de "pool" de pontos
- UI para definir quais efeitos s�o permitidos
- Valida��o complexa de limites e restri��es

**Onde implementar:**
1. Novo tipo de poder especial com poolPoints: number
2. Lista de efeitos permitidos com restri��es
3. UI para "gastar" pontos do pool em diferentes configura��es
4. Sistema de presets para configura��es comuns

**Exemplo:**
`
Variable 10 (Magic Spells, Any Power)
  Config 1: Damage 10 (Fire Blast)
  Config 2: Affliction 5 + Damage 5 (Paralysis + Shock)
  Config 3: Create 10 (Ice Walls)
`

---

### 1.7 Multiattack Damage Calculation

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Regras do M&M 3E

**Descri��o:**
Multiattack tem regras especiais: cada acerto adicional aumenta DC em +1 (n�o +5 como ataques separados). Sistema deve calcular e avisar sobre isso.

**Por que est� ausente:**
- C�lculo atual n�o considera regras especiais de Multiattack
- N�o h� aviso sobre diferen�a de progress�o de dano

**Onde implementar:**
1. Detectar quando Multiattack est� aplicado a Damage
2. Mostrar aviso explicando progress�o especial (+1 DC por hit)
3. Calculadora de dano esperado baseada em n�mero de acertos

**Exemplo de aviso:**
`
?? Multiattack: Cada acerto adicional aumenta DC em +1 (n�o +5)
Damage 10 Multiattack: 1� hit DC 25, 2� hit DC 26, 3� hit DC 27...
`

---

### 1.8 Weaken/Transform Target Selection

**Complexidade:** M�dia  
**Prioridade:** Alta  
**Categoria:** Regras do M&M 3E

**Descri��o:**
Weaken e Transform precisam especificar o que afetam:
- Weaken: qual trait (Strength, Toughness, etc.)
- Transform: de qual forma para qual forma

**Por que est� ausente:**
- Campos espec�ficos n�o existem no modelo de dados
- UI n�o permite especificar alvo

**Onde implementar:**
1. Adicionar campo 	argetTrait: string quando effect � Weaken
2. Adicionar campos 	ransformFrom: string e 	ransformTo: string para Transform
3. Dropdown com op��es v�lidas (abilities, defenses, skills)
4. Valida��o de alvos v�lidos

**Exemplo de UI:**
`
Effect: Weaken
Target Trait: [Dropdown: Strength, Stamina, Toughness, etc.]
Ranks: 10
`

---


## 2. FEATURES DE UX/UI

### 2.1 Power Templates/Presets ??

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** UX/UI

**Descri��o:**
Biblioteca de templates pr�-configurados para poderes comuns (Energy Blast, Flight, Super Strength, Telepathy, etc.) que aceleram a cria��o de personagens.

**Por que est� ausente:**
- N�o h� sistema de templates no c�digo
- Usu�rios precisam construir poderes comuns do zero toda vez
- Onboarding de novos usu�rios � mais lento

**Onde implementar:**
1. Criar arquivo src/data/powerTemplates.json com templates
2. Bot�o "Load Template" no topo do PowerBuilderOverlay
3. Modal com galeria de templates categorizados
4. Sistema de favoritos para templates mais usados

**Exemplo de template:**
`json
{
  "id": "energy-blast",
  "name": "Energy Blast",
  "category": "Offense",
  "description": "Standard ranged energy attack",
  "template": {
    "name": "Energy Blast",
    "components": [{
      "effectId": "damage",
      "ranks": 10,
      "modifiers": [
        { "modifierId": "increased_range", "ranks": 1 }
      ]
    }]
  }
}
`

**Impacto:**
- Reduz tempo de cria��o de poderes comuns em 80%
- Melhora onboarding de novos usu�rios
- Serve como refer�ncia de builds v�lidos

---

### 2.2 Duplicate Power/Component ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** UX/UI

**Descri��o:**
Bot�o para duplicar um poder completo ou um componente individual, facilitando cria��o de varia��es.

**Por que est� ausente:**
- N�o h� fun��o de duplica��o no c�digo
- Usu�rios precisam recriar manualmente poderes similares

**Onde implementar:**
1. Adicionar bot�o "Duplicate" em cada PowerCard (lista de poderes)
2. Adicionar bot�o "Duplicate Component" em cada component card
3. Fun��o que clona o objeto e gera novos IDs
4. Opcional: abrir builder com poder duplicado

**C�digo sugerido:**
`	ypescript
function duplicatePower(power: ICharacterPower): ICharacterPower {
  return {
    ...power,
    id: uuidv4(),
    name: ${power.name} (Copy),
    components: power.components.map(c => ({
      ...c,
      id: uuidv4()
    })),
    alternateEffects: power.alternateEffects.map(ae => ({
      ...ae,
      id: uuidv4(),
      components: ae.components.map(c => ({ ...c, id: uuidv4() }))
    }))
  };
}
`

**Impacto:**
- Economiza tempo ao criar varia��es
- Facilita experimenta��o com diferentes builds
- Reduz erros de recria��o manual

---

### 2.3 Modifier Search in Applied List ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** UX/UI

**Descri��o:**
Campo de busca para filtrar modificadores j� aplicados a um componente, �til quando h� muitos modifiers.

**Por que est� ausente:**
- Lista de modifiers aplicados n�o tem filtro
- Com 10+ modifiers, fica dif�cil encontrar um espec�fico

**Onde implementar:**
1. Adicionar input de busca acima da lista de applied modifiers
2. Filtrar modifiers por nome em tempo real
3. Highlight do texto buscado
4. Contador "X of Y modifiers shown"

**Impacto:**
- Melhora usabilidade em poderes complexos
- Reduz tempo de edi��o
- Previne frustra��o do usu�rio

---

### 2.4 Cost Breakdown Tooltip ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** UX/UI

**Descri��o:**
Tooltip detalhado ao passar mouse sobre custos, explicando cada parte do c�lculo.

**Por que est� ausente:**
- Custos s�o mostrados mas sem explica��o detalhada
- Usu�rios n�o entendem de onde vem cada n�mero

**Onde implementar:**
1. Adicionar tooltip em cada custo exibido
2. Mostrar f�rmula completa: (base + extras - flaws) � ranks + flat
3. Listar cada modifier com seu impacto
4. Link para documenta��o de c�lculo

**Exemplo de tooltip:**
`
Component Cost: 30 PP

Base: 2 PP/rank (Damage)
Extras: +1 PP/rank (Ranged)
Flaws: -1 PP/rank (Limited: Fire only)
Subtotal: 2 PP/rank � 10 ranks = 20 PP

Flat Modifiers:
  + Accurate 2: +4 PP
  + Precise: +1 PP
  + Subtle: +1 PP
Flat Total: +6 PP

Final: 20 + 6 = 26 PP
`

---

### 2.5 Modifier Incompatibility Warnings ??

**Complexidade:** M�dia  
**Prioridade:** Alta  
**Categoria:** UX/UI

**Descri��o:**
Avisos visuais quando modificadores incompat�veis s�o combinados (ex: Accurate + Inaccurate).

**Por que est� ausente:**
- Campo incompatibleWith existe em modifiers.json
- N�o h� valida��o na UI
- Usu�rios podem criar combina��es inv�lidas

**Onde implementar:**
1. Ao adicionar modifier, checar incompatibleWith
2. Mostrar warning badge se incompat�vel
3. Opcional: bloquear adi��o ou permitir com aviso
4. Tooltip explicando por que s�o incompat�veis

**Exemplo de aviso:**
`
?? Accurate e Inaccurate s�o mutuamente exclusivos
Remove um deles para continuar.
`

**Impacto:**
- Previne builds inv�lidos
- Educa usu�rios sobre regras
- Melhora qualidade dos dados

---


### 2.6 Undo/Redo System

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** UX/UI

**Descri��o:**
Sistema de hist�rico que permite desfazer/refazer mudan�as no power builder.

**Por que est� ausente:**
- Requer gerenciamento de hist�rico de estado
- Complexidade de implementa��o com React state

**Onde implementar:**
1. Hook customizado usePowerHistory com stack de estados
2. Bot�es Undo/Redo no topbar
3. Atalhos Ctrl+Z / Ctrl+Y
4. Limite de hist�rico (ex: �ltimas 50 a��es)

**Impacto:**
- Reduz medo de experimenta��o
- Recupera��o r�pida de erros
- Melhora confian�a do usu�rio

---

### 2.7 Power Comparison View

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** UX/UI

**Descri��o:**
Modo que permite comparar custos e efeitos de diferentes builds lado a lado.

**Onde implementar:**
1. Bot�o "Compare" que abre modal
2. Sele��o de 2-3 poderes para comparar
3. Tabela comparativa de custos, modifiers, ranks
4. Highlight de diferen�as

**Impacto:**
- Facilita otimiza��o de builds
- Ajuda decis�es de design
- �til para balanceamento

---

### 2.8 Modifier Recommendations

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** UX/UI

**Descri��o:**
Sistema que sugere modificadores comuns baseado no efeito selecionado.

**Exemplo:**
- Damage ? sugere Ranged, Multiattack, Penetrating
- Affliction ? sugere Cumulative, Progressive
- Flight ? sugere Subtle, Precise

**Onde implementar:**
1. Se��o "Suggested" na palette
2. Baseado em an�lise das fichas do f�rum
3. Ordenado por frequ�ncia de uso
4. Tooltip explicando por que � sugerido

---

### 2.9 Bulk Modifier Operations

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** UX/UI

**Descri��o:**
Aplicar mesmo modificador a m�ltiplos componentes ou AEs de uma vez.

**Onde implementar:**
1. Checkbox selection em components
2. Bot�o "Apply to Selected"
3. Modal para escolher modifier
4. Confirma��o antes de aplicar

---

### 2.10 Power Notes with Rich Text

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** UX/UI

**Descri��o:**
Editor markdown simples para notas de poderes.

**Onde implementar:**
1. Substituir textarea por editor markdown
2. Preview ao lado do editor
3. Suporte a: **bold**, *italic*, lists, links
4. Biblioteca: react-markdown ou similar

---

### 2.11 Mobile Drag-and-Drop Alternative

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** UX/UI

**Descri��o:**
Alternativa ao drag-and-drop para dispositivos touch.

**Status atual:**
- Parcialmente implementado em e-mod-fallback-select
- Precisa expandir para main components

**Onde implementar:**
1. Detectar touch device
2. Mostrar dropdown ao inv�s de drag zone
3. Bot�o "Add Modifier" que abre modal
4. Lista de modifiers com busca

---

### 2.12 Keyboard Shortcuts

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** UX/UI

**Descri��o:**
Atalhos de teclado para a��es comuns.

**Sugest�es:**
- Ctrl+S: Save power
- Ctrl+N: New component
- Ctrl+D: Duplicate component
- Ctrl+K: Open modifier search
- Esc: Close builder

**Onde implementar:**
1. Hook useKeyboardShortcuts
2. Event listeners globais
3. Modal de ajuda (Ctrl+?)
4. Indicadores visuais nos bot�es

---

### 2.13 Power Import/Export ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** UX/UI

**Descri��o:**
Exportar poder como JSON e importar de JSON.

**Onde implementar:**
1. Bot�o "Export" que gera JSON
2. Bot�o "Import" que abre file picker
3. Valida��o de schema ao importar
4. Op��o de copiar para clipboard

**C�digo sugerido:**
`	ypescript
function exportPower(power: ICharacterPower) {
  const json = JSON.stringify(power, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ${power.name || 'power'}.json;
  a.click();
}
`

---


## 3. VALIDA��ES E AVISOS

### 3.1 Modifier Max Ranks Enforcement ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** Valida��es

**Descri��o:**
Campo maxRanks existe em modifiers mas apenas mostra warning icon. Deveria bloquear input acima do m�ximo.

**Status atual:**
- modifiers.json define maxRanks (ex: Accurate max 5)
- UI mostra ?? quando excede mas permite continuar
- Usu�rios podem criar builds inv�lidos

**Onde implementar:**
1. Em NumberInput do modifier ranks, adicionar max={def.maxRanks}
2. Tooltip explicativo ao tentar exceder
3. Valida��o no handleSave que bloqueia salvamento

**Exemplo:**
`
Accurate: [5] ? bloqueado, n�o permite digitar 6
Tooltip: "Accurate tem m�ximo de 5 ranks (PL limit)"
`

---

### 3.2 Power Level Limits - Attack Bonus

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Valida��es

**Descri��o:**
Validar que Attack Bonus + Damage Rank n�o excedem PL � 2.

**Status atual:**
- Coment�rio em usePowerCostCalculation.ts: "We don't track attack bonus"
- Valida��o de PL existe apenas para Damage rank

**Onde implementar:**
1. Adicionar campo opcional ttackBonus: number em component
2. Calcular automaticamente baseado em Accurate ranks
3. Validar: ttackBonus + damageRank <= powerLevel * 2
4. Mostrar warning quando excede

---

### 3.3 Power Level Limits - Defense Bonus

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Valida��es

**Descri��o:**
Validar limites de PL para poderes defensivos (Protection, Deflect, etc.).

**Onde implementar:**
1. Detectar poderes que aumentam defesas
2. Validar: defenseBonus + toughness <= powerLevel * 2
3. Aviso similar ao de attack/damage

---

### 3.4 Fractional Cost Warning ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** Valida��es

**Descri��o:**
Avisar quando custo se torna fracion�rio (menos de 1 PP/rank).

**Onde implementar:**
1. Detectar quando (base + extras - flaws) < 1
2. Badge visual "Fractional Cost"
3. Tooltip explicando regra de arredondamento

**Exemplo:**
`
?? Fractional: 0.5 PP/rank
Custo final arredondado para cima: 1 PP por 2 ranks
`

---

### 3.5 Descriptor Conflict Detection

**Complexidade:** Baixa  
**Prioridade:** M�dia  
**Categoria:** Valida��es

**Descri��o:**
Detectar descritores mutuamente exclusivos (Fire + Ice, Magic + Technology).

**Requer:** Implementar descriptors primeiro (1.1)

**Onde implementar:**
1. Lista de conflitos em descriptorConflicts.json
2. Valida��o ao adicionar descriptor
3. Warning visual se conflito detectado

---

### 3.6 Minimum Effect Rank Warning

**Complexidade:** Baixa  
**Prioridade:** M�dia  
**Categoria:** Valida��es

**Descri��o:**
Avisar quando rank � muito baixo para ser �til.

**Exemplos:**
- Damage 1: "Muito fraco, considere rank 5+"
- Flight 1: "Apenas 15 ft/round, considere rank 3+"

**Onde implementar:**
1. Thresholds em powers.json
2. Warning badge quando abaixo do threshold
3. Sugest�o de rank m�nimo recomendado

---

### 3.7 Alternate Effect Name Uniqueness ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** Valida��es

**Descri��o:**
Auto-naming para AEs sem nome e detec��o de nomes duplicados.

**Onde implementar:**
1. Ao criar AE, auto-preencher com "AE 1", "AE 2", etc.
2. Validar nomes �nicos ao salvar
3. Highlight de duplicatas na UI

---

### 3.8 Empty Component Detection ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** Valida��es

**Descri��o:**
Filtrar componentes sem efeito selecionado antes de salvar.

**Onde implementar:**
`	ypescript
function handleSave() {
  const validComponents = power.components.filter(c => c.effectId !== '');
  if (validComponents.length === 0) {
    alert('Adicione pelo menos um efeito');
    return;
  }
  const cleanPower = {
    ...power,
    components: validComponents,
    alternateEffects: power.alternateEffects.map(ae => ({
      ...ae,
      components: ae.components.filter(c => c.effectId !== '')
    })).filter(ae => ae.components.length > 0)
  };
  onSave(cleanPower);
}
`

---

### 3.9 Modifier Stacking Rules

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Valida��es

**Descri��o:**
Alguns modifiers n�o podem ser aplicados m�ltiplas vezes.

**Onde implementar:**
1. Campo llowMultiple: boolean em modifiers
2. Valida��o ao adicionar modifier j� presente
3. Warning ou bloqueio

---

### 3.10 Action Economy Validation

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Valida��es

**Descri��o:**
Mostrar a��o final ap�s modificadores (alguns mudam de Standard ? Move ? Free).

**Onde implementar:**
1. Calcular a��o final baseada em modifiers
2. Mostrar badge "Final Action: Move" se diferente da base
3. Tooltip explicando mudan�a

---


## 4. INTEGRA��ES E AUTOMA��ES

### 4.1 Auto-Calculate Accurate Ranks ??

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Integra��es

**Descri��o:**
Bot�o que calcula automaticamente quantos ranks de Accurate s�o necess�rios para atingir o limite de PL.

**F�rmula:**
`
attackBonus + damageRank <= powerLevel * 2
accurateRanks = Math.floor((powerLevel * 2 - damageRank - baseAttackBonus) / 2)
`

**Onde implementar:**
1. Bot�o "Optimize for PL" ao lado do modifier Accurate
2. Calcula ranks ideais baseado em PL e damage rank
3. Aplica automaticamente ou mostra sugest�o

**Exemplo:**
`
PL 10, Damage 10, Base Attack +5
Optimal Accurate: 2 ranks (+4 attack)
Final: +9 attack + 10 damage = 19 (limite: 20)
`

---

### 4.2 Power Point Budget Tracker ??

**Complexidade:** Baixa  
**Prioridade:** Alta  
**Categoria:** Integra��es

**Descri��o:**
Barra de progresso mostrando quanto do budget total do personagem est� sendo usado em poderes.

**Onde implementar:**
1. Acessar useCharStore para pegar total PP dispon�vel
2. Calcular PP usado em todos os poderes
3. Barra de progresso no footer do builder
4. Warning quando excede budget

**Exemplo de UI:**
`
Powers Budget: [����������] 80/100 PP (80%)
?? 5 PP over budget
`

---

### 4.3 Suggested Alternate Effects

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** Integra��es

**Descri��o:**
Sistema que sugere AEs tem�ticos baseado no poder principal.

**Exemplo:**
- Fire Blast ? sugere Fire Shield, Fire Immunity, Smoke Cloud
- Telepathy ? sugere Mind Control, Mental Illusion, Mind Reading

**Onde implementar:**
1. Base de dados de sugest�es por efeito
2. Bot�o "Suggest AEs" que abre modal
3. Lista de sugest�es com preview
4. Aplicar sugest�o com um clique

---

### 4.4 Power Legality Checker

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** Integra��es

**Descri��o:**
Valida��o completa de todas as regras do M&M 3E.

**Checklist:**
- PL limits (attack/damage, defense/toughness)
- Modifier compatibility
- Action economy
- Descriptor conflicts
- Cost calculations
- Required fields

**Onde implementar:**
1. Bot�o "Validate" que roda checklist completo
2. Relat�rio detalhado de problemas
3. Links para documenta��o de cada regra
4. Sugest�es de corre��o

---

### 4.5 Equipment Mode Integration ??

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Integra��es

**Descri��o:**
Completar funcionalidade de Equipment Mode que calcula EP ao inv�s de PP.

**Status atual:**
- Prop equipmentMode existe
- Removable � ocultado em equipment mode
- C�lculo ainda usa PP

**Onde implementar:**
1. Converter PP para EP (1 EP = 5 PP)
2. Mostrar "Total EP" ao inv�s de "Total PP"
3. Valida��es espec�ficas de equipamento
4. Templates de equipamentos comuns

---

### 4.6 Power to Equipment Converter

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Integra��es

**Descri��o:**
Converter poder existente em item de equipamento.

**Onde implementar:**
1. Bot�o "Convert to Equipment" no power card
2. Adiciona Removable automaticamente
3. Move para lista de equipamentos
4. Recalcula custo em EP

---

### 4.7 Batch Power Creation

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** Integra��es

**Descri��o:**
Criar m�ltiplos poderes similares de uma vez.

**Exemplo:**
- Criar 5 varia��es de Energy Blast com diferentes descritores
- Criar array completo de poderes elementais

**Onde implementar:**
1. Modo "Create Multiple" no builder
2. Template base + lista de varia��es
3. Preview de todos os poderes
4. Aplicar em lote

---

### 4.8 Power Dependencies

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Integra��es

**Descri��o:**
Sistema de prerequisitos e avisos de depend�ncias.

**Exemplos:**
- Alternate Effect requer poder base
- Linked requer outro poder ativo
- Alguns modifiers requerem outros

**Onde implementar:**
1. Campo equires: string[] em powers/modifiers
2. Valida��o ao adicionar
3. Warning se prerequisito n�o atendido
4. Sugest�o de adicionar prerequisito

---

### 4.9 Character Sheet Preview

**Complexidade:** M�dia  
**Prioridade:** M�dia  
**Categoria:** Integra��es

**Descri��o:**
Preview de como o poder aparecer� na ficha final.

**Onde implementar:**
1. Bot�o "Preview" que abre modal
2. Renderiza poder usando componente da ficha
3. Mostra formata��o, descri��o, custo
4. �til para verificar antes de salvar

---

### 4.10 Power History/Changelog

**Complexidade:** Alta  
**Prioridade:** Baixa  
**Categoria:** Integra��es

**Descri��o:**
Rastrear mudan�as em poderes ao longo do tempo.

**Onde implementar:**
1. Sistema de versionamento de poderes
2. Log de modifica��es com timestamps
3. Diff entre vers�es
4. Rollback para vers�o anterior

---

### 4.11 Community Power Library

**Complexidade:** Muito Alta  
**Prioridade:** Baixa  
**Categoria:** Integra��es

**Descri��o:**
Compartilhar e baixar builds da comunidade.

**Requer:**
- Backend para armazenamento
- Sistema de autentica��o
- Ratings e reviews
- Modera��o de conte�do

**Onde implementar:**
1. Bot�o "Browse Community Powers"
2. Upload de poderes pr�prios
3. Download e importa��o
4. Sistema de tags e busca

---

### 4.12 AI Power Assistant

**Complexidade:** Muito Alta  
**Prioridade:** Baixa  
**Categoria:** Integra��es

**Descri��o:**
Chat assistant que guia usu�rios novatos na constru��o de poderes.

**Funcionalidades:**
- Responde perguntas sobre regras
- Sugere modifiers apropriados
- Valida builds em tempo real
- Explica c�lculos de custo

**Requer:**
- Integra��o com LLM
- Base de conhecimento de M&M 3E
- Sistema de contexto de conversa

---


## ?? ROADMAP SUGERIDO

### Sprint 1 - Quick Wins (1-2 semanas)
**Foco:** Implementar funcionalidades de baixa complexidade e alto impacto

1. **Power Descriptors** (1.1) - 2 dias
2. **Duplicate Power/Component** (2.2) - 1 dia
3. **Empty Component Detection** (3.8) - 1 dia
4. **Max Ranks Enforcement** (3.1) - 1 dia
5. **Fractional Cost Warning** (3.4) - 1 dia
6. **AE Name Uniqueness** (3.7) - 1 dia
7. **Power Import/Export** (2.13) - 2 dias
8. **Power Point Budget Tracker** (4.2) - 1 dia

**Resultado esperado:** 8 funcionalidades implementadas, melhoria significativa na UX b�sica

---

### Sprint 2 - Regras do M&M 3E (2-3 semanas)
**Foco:** Completar funcionalidades essenciais das regras

1. **Variable Cost Powers UI** (1.2) - 3 dias
2. **Weaken/Transform Target Selection** (1.8) - 2 dias
3. **Modifier Incompatibility Warnings** (2.5) - 2 dias
4. **Modifier Search** (2.3) - 1 dia
5. **Cost Breakdown Tooltip** (2.4) - 2 dias
6. **Minimum Effect Rank Warning** (3.6) - 1 dia

**Resultado esperado:** Builder alinhado com regras oficiais, menos erros de usu�rio

---

### Sprint 3 - Automa��o e Otimiza��o (2-3 semanas)
**Foco:** Features que aceleram workflow

1. **Power Templates/Presets** (2.1) - 4 dias
2. **Auto-Calculate Accurate Ranks** (4.1) - 2 dias
3. **Modifier Recommendations** (2.8) - 3 dias
4. **Equipment Mode Integration** (4.5) - 2 dias
5. **Mobile DnD Alternative** (2.11) - 2 dias

**Resultado esperado:** Cria��o de poderes 50% mais r�pida

---

### Sprint 4 - Valida��es Avan�adas (2 semanas)
**Foco:** Prevenir builds inv�lidos

1. **PL Limits - Attack Bonus** (3.2) - 3 dias
2. **PL Limits - Defense Bonus** (3.3) - 2 dias
3. **Action Economy Validation** (3.10) - 2 dias
4. **Modifier Stacking Rules** (3.9) - 2 dias
5. **Multiattack Damage Calculation** (1.7) - 2 dias

**Resultado esperado:** Builds sempre v�lidos segundo M&M 3E

---

### Backlog - Features Avan�adas (3-6 meses)
**Implementar conforme demanda da comunidade**

- Undo/Redo System (2.6)
- Power Comparison View (2.7)
- Keyboard Shortcuts (2.12)
- Power to Equipment Converter (4.6)
- Character Sheet Preview (4.9)
- Power Dependencies (4.8)
- Linked Modifier UI (1.3)
- Power Arrays Shared Modifiers (1.4)

---

### Longo Prazo - Features Complexas (6+ meses)
**Requer planejamento arquitetural significativo**

- Summon/Sidekick Powers (1.5)
- Variable Power (1.6)
- Power Legality Checker (4.4)
- Batch Power Creation (4.7)
- Power History/Changelog (4.10)
- Suggested Alternate Effects (4.3)
- Community Power Library (4.11)
- AI Power Assistant (4.12)

---

## ?? M�TRICAS DE SUCESSO

### M�tricas de Usabilidade
- **Tempo m�dio de cria��o de poder:** Reduzir de 10min para 5min
- **Taxa de erro em builds:** Reduzir de 30% para <5%
- **Satisfa��o do usu�rio:** Aumentar de 7/10 para 9/10
- **Taxa de abandono no builder:** Reduzir de 40% para <15%

### M�tricas de Qualidade
- **Builds inv�lidos salvos:** Reduzir para <1%
- **Poderes com componentes vazios:** Eliminar completamente
- **Uso de templates:** >60% dos poderes criados
- **Poderes duplicados vs criados do zero:** 40% duplicados

### M�tricas de Ado��o
- **Usu�rios ativos no builder:** Aumentar 50%
- **Poderes criados por usu�rio:** Aumentar de 3 para 8
- **Retorno ao builder:** >70% dos usu�rios voltam
- **Compartilhamento de builds:** >30% exportam poderes

---

## ?? AN�LISE DE IMPACTO

### Alto Impacto + Baixa Complexidade (Prioridade M�xima)
Estas 8 funcionalidades devem ser implementadas IMEDIATAMENTE:

1. Power Descriptors (1.1)
2. Duplicate Power/Component (2.2)
3. Modifier Incompatibility Warnings (2.5)
4. Empty Component Detection (3.8)
5. Max Ranks Enforcement (3.1)
6. Fractional Cost Warning (3.4)
7. AE Name Uniqueness (3.7)
8. Power Import/Export (2.13)

**ROI estimado:** 80% de melhoria na experi�ncia com 20% do esfor�o

### M�dio Impacto + M�dia Complexidade (Pr�xima Onda)
Implementar ap�s quick wins:

- Variable Cost Powers UI (1.2)
- Power Templates/Presets (2.1)
- Auto-Calculate Accurate Ranks (4.1)
- Equipment Mode Integration (4.5)

### Baixo Impacto ou Alta Complexidade (Backlog)
Avaliar demanda antes de implementar:

- Undo/Redo System (2.6)
- Community Power Library (4.11)
- AI Power Assistant (4.12)

---

## ?? NOTAS DE IMPLEMENTA��O

### Considera��es T�cnicas

**Modelo de Dados:**
- Adicionar campos opcionais para n�o quebrar compatibilidade
- Migra��o autom�tica de poderes antigos
- Versionamento de schema para futuras mudan�as

**Performance:**
- Valida��es devem ser ass�ncronas para n�o travar UI
- C�lculos de custo devem ser memoizados
- Templates devem ser lazy-loaded

**Testes:**
- Cada funcionalidade deve ter testes unit�rios
- Testes de integra��o para fluxos completos
- Testes de regress�o para n�o quebrar features existentes

**Documenta��o:**
- Atualizar docs do usu�rio para cada feature
- Changelog detalhado
- Exemplos de uso para features complexas

---

## ?? CONTRIBUINDO

Este documento � um guia vivo. Se voc�:

- Implementou alguma destas funcionalidades, marque o checkbox
- Descobriu novas funcionalidades ausentes, adicione � lista
- Tem feedback sobre prioridades, abra uma issue
- Quer contribuir, escolha um item de Quick Wins e comece!

---

## ?? REFER�NCIAS

- **M&M 3E Hero's Handbook:** Regras oficiais de constru��o de poderes
- **An�lise de Fichas do F�rum:** 63 personagens analisados (ver RELATORIO-COMPATIBILIDADE-FICHAS.md)
- **C�digo Atual:** src/features/power-builder/
- **Testes Existentes:** src/__tests__/powerBuilder.test.ts

---

**�ltima Atualiza��o:** 14 de maio de 2026  
**Pr�xima Revis�o:** Ap�s Sprint 1 (atualizar com feedback de usu�rios)

