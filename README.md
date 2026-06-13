# Mutants & Masterminds 3e Character Builder — v1.10.0

*Read this in other languages: [🇺🇸 English](#english) | [🇧🇷 Português](#português)*

---

<a id="english"></a>
## 🇺🇸 English

A modern, fast, and user-friendly character builder for the Mutants & Masterminds 3rd Edition (M&M 3e) RPG system. Built to simplify the complex character creation process, featuring automatic Power Points (PP) calculation, Power Level (PL) compliance validation, and a premium drag-and-drop interface.

### Access the App
**[https://guimayer.github.io/mm3e-builder/](https://guimayer.github.io/mm3e-builder/)**

---

### ✨ Features

#### 📊 Character Sheet Core
- **Abilities** — Set all 8 core abilities (STR, STA, AGL, DEX, FGT, INT, AWE, PRE) with automatic PP cost (×2/rank). Supports "Absent" abilities (Construct, Immortal, etc.) at −4 PP flat.
- **Defenses** — Dodge, Parry, Fortitude, Will with automatic calculation based on ability scores + bought ranks.
- **Skills** — Full skill list (28+ skills), subtypes (e.g. Expertise: History), auto-cost at 1 PP per 2 ranks.
- **Advantages** — Searchable and filterable advantage selector with 49 advantages, ranked/flat type display, and description modal. **Advantage Subtypes** — 8 advantages support multiple instances with different subtypes (e.g., Skill Mastery: Acrobatics, Skill Mastery: Stealth). Includes hybrid mode for Improved Critical allowing both rank stacking and multiple instances.
- **Complications** — Free-form title + description fields for Motivation, Enemy, Secret, etc.

#### 📖 Campaign Mode & PP Advancement Log
- **Campaign Mode toggle** — Switch between campaign mode (PP earned during play) and standard mode (PL × 15 flat).
- **PP Log Panel** — Track PP awards and deductions with date, amount, and notes for each entry.
- **Automatic PP calculation** — Base PP (PL × 15) + earned PP from log = total available PP.
- **Data protection** — Confirmation dialogs when disabling Campaign Mode or removing log entries to prevent accidental data loss.
- **Smart validation** — Campaign Mode toggle is disabled when log has entries, requiring cleanup before mode switch to maintain PP budget consistency.

#### 🗂️ Multi-Character Management
- **Character Tabs** — Work on multiple characters simultaneously in separate tabs with visual tab management UI.
- **Drag-and-Drop Reordering** — Organize tabs by dragging them to your preferred order.
- **Per-Tab Auto-Save** — Each character auto-saves independently with dirty state indicator (•) showing unsaved changes.
- **Smart Import** — Import matches existing tabs by characterId to prevent duplicates and merge intelligently.
- **Duplicate Character** — Clone existing characters with a single click, automatically generating new unique IDs.
- **Tab Labels** — Shows character name or "Unnamed Character" for easy identification.

#### ⚡ Power Builder (v2)
The Power Builder is the most feature-rich section, built for full M&M 3e rules compliance:

- **Multi-component Powers** — A single power can have multiple simultaneous effects (Linked Powers). Each component has its own effect, ranks, and modifier set.
- **Searchable Effect Selector** — Combobox with live search + type filter (Attack, Defense, Movement, Sense, etc.) and inline ⓘ info button to view full effect description, cost, and tags.
- **Drag-and-Drop Modifier Palette** — Collapsible sidebar with Extras, Flaws, and power-specific modifiers. Modifiers can be dragged directly onto each component's dropzone or added via click.
- **Power-Specific Modifiers** — 45+ power-specific modifiers (Accurate, Affects Corporeal, Alternate Resistance, etc.) with automatic UI filtering to show only relevant modifiers per power. Verified against official M&M 3e Hero's Handbook with 92.5% accuracy rate.
- **Per-modifier rank control** — Modifiers with ranked costs (e.g. Burst Area) have a rank spinner. Options-based modifiers (e.g. Affects Corporeal shape) have an inline dropdown.
- **Real-time cost display** — Footer shows cost breakdown per component and a running total for the entire array (base + alternates).
- **Power name and notes** — Free-form fields for flavor text, descriptors (Fire, Magic, etc.), and GM notes.
- **Strict Mode** — Optional PL cap enforcement that validates Attack + Damage and Defense + Toughness bounds per-power.

#### 🔀 Alternate Effects (Arrays) — v2
A complete redesign of the Alternate Effects system with full rule compliance and interface parity with the main builder:

- **Multi-component AEs** — Each Alternate Effect slot supports multiple simultaneous effects (Linked Powers within a single array slot), e.g. "Taser Blade: Close Damage 5 + Affliction 5".
- **Collapsible AE cards** — Cards show Name + cost badge + Dynamic checkbox in collapsed state. Expand to reveal full component editor.
- **Searchable effect selector per AE component** — Same combobox experience as the main power builder.
- **Drag-and-drop modifiers in AEs** — Each AE component has its own dropzone. UUID-safe dropzone IDs (`dropzone-ae::aeId::compId`) avoid fragmentation bugs.
- **Contextual palette** — When editing an AE component, the modifier palette automatically switches context and shows an orange "Editing: [AE name · Comp N]" badge.
- **Cost validation per AE** — Each AE displays its calculated cost with a ✅ or ⚠️ badge. If the AE exceeds the main power's PP cap, an inline warning shows the exact PP overage ("exceeds by 4PP").
- **Dynamic Array checkbox** — Tooltip explains the rule: Dynamic arrays allow using base + AE simultaneously at +2 PP per dynamic AE.
- **Notes field per AE** — Descriptor and flavor notes for each alternate effect.
- **Save guard** — If any AE exceeds the cap when saving, a confirmation dialog alerts the user (non-blocking — partial builds can be saved).
- **Retroactive migration** — Characters saved with legacy v1 AEs (`effectId + ranks`) are automatically upgraded to `components[]` format on load, with zero data loss.

#### 📋 Powers List (Sheet View)
- Cards display each power with component effects, applied modifier tags, and individual AE tags showing "↪ [Name] ⚡" for dynamic slots.
- Edit button re-opens the Power Builder with the existing power pre-loaded.

#### ✅ Validation System
- **Modular validation engine** — 8-phase validation system covering all M&M 3e core rules.
- **PL limits enforcement** — Validates Attack + Damage ≤ 2×PL and Dodge + Toughness ≤ 2×PL per official rules.
- **Skill rank caps** — Enforces maximum skill ranks of PL + 10 for trained skills.
- **PP budget enforcement** — Validates total spent PP against available PP (PL × 15 or Campaign Mode total).
- **Absent abilities validation** — Ensures absent abilities follow official rules and cost structure.
- **Alternate Effect cap validation** — Verifies each AE does not exceed the base power's PP cost.
- **Minimum ability score validation** — Enforces minimum ability scores based on character type.
- **Official builds tested** — Validated against official M&M 3e character builds (Daredevil, Battlesuit, Powerhouse, Paragon).

#### 📚 References Tab
- **Combat Actions** — Quick reference for Standard, Move, and Free actions with full descriptions and translations.
- **Combat Maneuvers** — Reference for Grab, Trip, Disarm, and other maneuvers with mechanics and translations.
- **Conditions** — Complete list of all M&M 3e conditions (Dazed, Stunned, Incapacitated, etc.) with effects and translations.
- **Instant access** — No need to flip through rulebooks during character creation or gameplay.

#### 📄 Export to PDF
- **Fills the official M&M 3e fillable character sheet** (`MnM3_charsheet_color_fillable.pdf`) with all 211 fields using `pdf-lib` — 100% client-side, no backend.
- Page 1: Header, Abilities, Defenses, Initiative, Offense table (Attack 1–4 with auto-calculated DCs), compact Skills/Advantages/Powers summaries, Notes & Conditions.
- Page 2: Structured skills grid (Ab / Ra / Total per skill), Close Combat & Ranged Combat subtypes, Expertise subtypes, Advantages 1–11, Equipment 1–10, Complications 1–11, Notes 1–7.
- **Campaign Mode support** — Correctly calculates PP totals including PP Log adjustments when in Campaign Mode.
- **Accurate stat calculations** — Toughness (STA + ranks) and Initiative (AGL bonus) calculated correctly.
- **Overflow handling** — When a character exceeds the sheet's fixed limits (e.g. > 4 attacks, > 11 advantages), a detailed modal warns the user before export and redirects excess items to the Notes fields.
- Text is **fully selectable** in any PDF reader — no screenshot or image-based rendering.
- PDF template is pre-fetched in the background on app load for near-instant exports.

#### 📤 Export to Excel
- Full character sheet exported to a styled `.xlsx` workbook with 8 sections: Summary, Abilities, Defenses, Skills, Advantages, Powers, Complications, and PP Log (when in Campaign Mode).
- **PP Log sheet** — When in Campaign Mode, includes a dedicated sheet showing full award/deduction history with running totals and color-coded positive/negative adjustments.
- **Accurate calculations** — Total PP includes PP Log adjustments, Toughness and Initiative stats included in Defenses sheet.
- Color-coded cells, PP totals, and alternate effects listed per power.

#### 🌐 Internationalization (i18n)
- **Dual-layer architecture**: UI strings via `react-i18next` (`translation.json`), game data via `i18n` fields in JSON data files.
- Currently supported: 🇧🇷 Brazilian Portuguese and 🇺🇸 English.
- Language can be switched at runtime from the top menu bar without page reload.

#### 💾 Save / Load
- Characters saved to `localStorage` automatically.
- Import/Export via JSON file — character schema is versioned with automatic migration for older saves.

---

### 📋 Version History

For detailed changelog, see **[CHANGELOG.md](./CHANGELOG.md)**.

#### v1.10.0 (2026-06-13)
- Multi-Character Tabs System with drag-and-drop and per-tab auto-save
- Advantage Subtypes System with 8 advantages supporting multiple instances
- Data Quality: 7 advantage corrections matching official M&M 3e rulebook
- Performance optimizations: lazy loading and vendor chunk splitting
- Validation improvements: Luck advantage PL limit, skill caps, AE validation
- UI improvements: Skill Mastery dropdown, Portal rendering fix, character reset guard

#### v1.4.1 (2026-05-11)
- Fixed PP calculation in campaign mode to include PP Log adjustments
- Added missing Toughness and Initiative stats to exports
- Added PP Log sheet in Excel export with running totals
- Comprehensive test coverage for export corrections

#### v1.4.0 (2026-05-10)
- Complete Powers Modifiers Audit: 209 modifiers verified across 40 powers (92.5% accuracy)
- 45+ power-specific modifiers with automatic UI filtering
- Automated validation scripts for continuous compliance
- Fixed multiple power-specific modifier issues

#### v1.3.0 (2026-04-28)
- Complete M&M 3e Rules Validation System with 8 validation phases
- PL limits enforcement, skill rank caps, PP budget validation
- Official builds tests (Daredevil, Battlesuit, Powerhouse, Paragon)
- 50+ test cases covering all validation rules

#### v1.2.0 (2026-04-15)
- Power Builder v2 with multi-component architecture
- Alternate Effects v2 with full multi-component support
- SCHEMA_VERSION 2.0.0 with automatic migration

---

### Architecture & AI-Directed Development

This project was a deliberate experiment in **100% AI-directed development**. Not a single line of code was written manually. My role was **architect and QA** — the AI executed, I decided.

Before a single commit, I produced a complete engineering specification covering phased delivery, SOLID principles mapped to concrete files, naming conventions, Feature-Sliced domain isolation, exact JSON data contracts, a test strategy by layer, and 6 pre-mapped resilience scenarios including automatic export fallback on `localStorage` overflow.

**What I did:**
- Decomposed a complex, multi-rule game domain into unambiguous requirements
- Defined all architectural decisions before any code existed (stack, state management, i18n structure, schema versioning, scope-cutting priority order)
- Reviewed every AI-generated change and rejected any deviation from defined conventions
- Enforced separation of concerns, preventing the AI from producing coupled or spaghetti code

**What the AI did:**
- Implemented every file, component, hook, and service according to the spec
- Produced zero architectural surprises — because there was no room for improvisation

> For the full engineering specification, see **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**.

This project has **absolutely no intention of making a profit** or infringing on the copyrights of Green Ronin Publishing, the creators of M&M 3e. This is purely a fan-made project for the TTRPG community.

---

### How to Contribute
Contributions are extremely welcome — especially translations!

Read **[CONTRIBUTING.md](./CONTRIBUTING.md)** to learn how to:
1. Translate UI strings by modifying `translation.json` files.
2. Add translations (or new Powers/Modifiers/Advantages) directly into the game's base data via the `i18n` property in JSON files.

The architecture allows you to quickly contribute new localizations without deep programming knowledge.

### Tech Stack
- **React** — UI and Components
- **TypeScript** — Typing and Game Domain
- **Vite** — Build Tool & HMR
- **Zustand** — State Management
- **@dnd-kit** — Drag-and-Drop (modifiers palette)
- **React-i18next** — UI Internationalization
- **ExcelJS** — Advanced Sheet Exporting
- **pdf-lib** — Official fillable PDF character sheet export
- **Zod** — Runtime schema validation & versioned migrations

---

Made by a fan, for fans.

---

<a id="português"></a>
## 🇧🇷 Português

Um criador de fichas moderno, rápido e focado na facilidade de uso para o sistema de RPG Mutants & Masterminds 3ª Edição (M&M 3e). Construído para facilitar a montagem complexa de personagens, com cálculo automático de Power Points (PP), validação de Power Level (PL) e uma interface drag-and-drop premium.

### Acesse o aplicativo
**[https://guimayer.github.io/mm3e-builder/](https://guimayer.github.io/mm3e-builder/)**

---

### ✨ Funcionalidades

#### 📊 Ficha Principal
- **Atributos** — Configure os 8 atributos base (FOR, VIG, AGL, DES, LUT, INT, PRO, PRE) com cálculo automático de custo em PP (×2/rank). Suporta atributos "Absent" (Construto, Imortal, etc.) com −4 PP flat.
- **Defesas** — Esquiva, Aparar, Resistência, Vontade com cálculo automático baseado nos atributos + ranks comprados.
- **Perícias** — Lista completa (28+ perícias), subtipos (ex: Especialidade: História), custo automático de 1 PP a cada 2 ranks.
- **Vantagens** — Seletor pesquisável e filtrável com 49 vantagens, exibição de tipo (ranqueada/flat) e modal de descrição. **Subtipos de Vantagens** — 8 vantagens suportam múltiplas instâncias com diferentes subtipos (ex: Maestria em Perícia: Acrobacia, Maestria em Perícia: Furtividade). Inclui modo híbrido para Crítico Aprimorado permitindo tanto empilhamento de ranks quanto múltiplas instâncias.
- **Complicações** — Campos livres de título e descrição para Motivação, Inimigo, Segredo, etc.

#### 📖 Modo Campanha & Registro de Avanço de PP
- **Toggle de Modo Campanha** — Alterne entre modo campanha (PP ganhos durante o jogo) e modo padrão (NP × 15 fixo).
- **Painel de Registro de PP** — Rastreie concessões e deduções de PP com data, quantidade e notas para cada entrada.
- **Cálculo automático de PP** — PP base (NP × 15) + PP ganhos do registro = PP total disponível.
- **Proteção de dados** — Diálogos de confirmação ao desativar Modo Campanha ou remover entradas do registro para prevenir perda acidental de dados.
- **Validação inteligente** — Toggle de Modo Campanha é desabilitado quando há entradas no registro, exigindo limpeza antes da troca de modo para manter consistência do orçamento de PP.

#### 🗂️ Gerenciamento Multi-Personagem
- **Abas de Personagem** — Trabalhe em múltiplos personagens simultaneamente em abas separadas com interface visual de gerenciamento.
- **Reordenação via Drag-and-Drop** — Organize as abas arrastando-as para sua ordem preferida.
- **Auto-Save por Aba** — Cada personagem salva automaticamente de forma independente com indicador de estado sujo (•) mostrando alterações não salvas.
- **Importação Inteligente** — A importação corresponde abas existentes por characterId para prevenir duplicatas e fazer merge inteligente.
- **Duplicar Personagem** — Clone personagens existentes com um único clique, gerando automaticamente novos IDs únicos.
- **Rótulos de Aba** — Mostra o nome do personagem ou "Personagem Sem Nome" para fácil identificação.

#### ⚡ Power Builder (v2)
O Power Builder é a seção mais completa, construído para máxima conformidade com as regras do M&M 3e:

- **Poderes multi-componente** — Um único poder pode ter múltiplos efeitos simultâneos (Poderes Vinculados). Cada componente tem seu próprio efeito, ranks e conjunto de modificadores.
- **Seletor de efeito pesquisável** — Combobox com busca em tempo real + filtro por tipo (Ataque, Defesa, Movimento, Sentido, etc.) e botão ⓘ embutido para ver descrição completa do efeito, custo e tags.
- **Paleta de Modificadores via Drag-and-Drop** — Barra lateral recolhível com Extras, Falhas e modificadores específicos do efeito. Modificadores podem ser arrastados diretamente para a dropzone de cada componente ou adicionados com um clique.
- **Modificadores Específicos de Poder** — 45+ modificadores específicos de poder (Preciso, Afeta Incorpóreo, Resistência Alternativa, etc.) com filtragem automática na UI para mostrar apenas modificadores relevantes por poder. Verificado contra o Hero's Handbook oficial do M&M 3e com taxa de precisão de 92,5%.
- **Controle de rank por modificador** — Modificadores com custo ranqueado (ex: Área em Rajada) possuem um controle de ranks. Modificadores com opções (ex: Afeta Incorpóreo) têm dropdown embutido.
- **Custo em tempo real** — Rodapé exibe custo por componente e total da array completa (base + alternativos).
- **Nome e notas do poder** — Campos livres para flavor text, descritores (Fogo, Magia, etc.) e anotações de mestre.
- **Modo Estrito** — Validação opcional dos limites de PL que verifica Ataque + Dano e Defesa + Resistência por poder.

#### 🔀 Efeitos Alternativos (Arrays) — v2
Redesenho completo do sistema de Efeitos Alternativos com plena conformidade com as regras e paridade de interface com o builder principal:

- **AEs multi-componente** — Cada slot de efeito alternativo suporta múltiplos efeitos simultâneos (Poderes Vinculados dentro de um slot de array), ex: "Lâmina Taser: Dano por Contato 5 + Aflição 5".
- **Cards de AE recolhíveis** — Cards exibem Nome + badge de custo + checkbox Dinâmico no estado recolhido. Expandir revela o editor completo de componentes.
- **Seletor de efeito pesquisável por componente de AE** — Mesma experiência de combobox do power builder principal.
- **Drag-and-drop de modificadores nos AEs** — Cada componente de AE tem sua própria dropzone. IDs de dropzone seguros para UUID (`dropzone-ae::aeId::compId`) evitam bugs de fragmentação.
- **Paleta contextual** — Ao editar um componente de AE, a paleta de modificadores muda automaticamente de contexto e exibe um badge laranja "Editando: [nome AE · Comp N]".
- **Validação de custo por AE** — Cada AE exibe seu custo calculado com badge ✅ ou ⚠️. Se o AE exceder o cap de PP do poder base, um aviso inline mostra o excesso exato em PP ("excede em 4PP").
- **Checkbox Array Dinâmica** — Tooltip explica a regra: arrays dinâmicas permitem usar a base e o AE simultaneamente, custando +2 PP por AE dinâmico.
- **Campo de notas por AE** — Notas de descritores e flavor text para cada efeito alternativo.
- **Guarda no Save** — Se algum AE exceder o cap ao salvar, um diálogo de confirmação alerta o usuário (não bloqueante — compilações parciais podem ser salvas).
- **Migração retroativa** — Personagens salvos com AEs legados v1 (`effectId + ranks`) são automaticamente atualizados para o formato `components[]` no carregamento, sem perda de dados.

#### 📋 Lista de Poderes (Visão de Ficha)
- Cards exibem cada poder com efeitos dos componentes, tags dos modificadores aplicados e tags individuais de AE mostrando "↪ [Nome] ⚡" para slots dinâmicos.
- Botão de edição reabre o Power Builder com o poder existente pré-carregado.

#### ✅ Sistema de Validação
- **Motor de validação modular** — Sistema de validação em 8 fases cobrindo todas as regras principais do M&M 3e.
- **Aplicação de limites de NP** — Valida Ataque + Dano ≤ 2×NP e Esquiva + Resistência ≤ 2×NP conforme regras oficiais.
- **Limites de ranks de perícias** — Aplica máximo de ranks de perícias de NP + 10 para perícias treinadas.
- **Aplicação de orçamento de PP** — Valida PP total gasto contra PP disponível (NP × 15 ou total do Modo Campanha).
- **Validação de atributos ausentes** — Garante que atributos ausentes sigam regras oficiais e estrutura de custo.
- **Validação de cap de Efeitos Alternativos** — Verifica que cada AE não excede o custo em PP do poder base.
- **Validação de pontuação mínima de atributos** — Aplica pontuações mínimas de atributos baseadas no tipo de personagem.
- **Testado com builds oficiais** — Validado contra builds oficiais de personagens do M&M 3e (Daredevil, Battlesuit, Powerhouse, Paragon).

#### 📚 Aba de Referências
- **Ações de Combate** — Referência rápida para ações Padrão, Movimento e Livres com descrições completas e traduções.
- **Manobras de Combate** — Referência para Agarrar, Derrubar, Desarmar e outras manobras com mecânicas e traduções.
- **Condições** — Lista completa de todas as condições do M&M 3e (Atordoado, Atônito, Incapacitado, etc.) com efeitos e traduções.
- **Acesso instantâneo** — Não é necessário folhear livros de regras durante criação de personagem ou jogo.

#### 📄 Exportar como PDF
- **Preenche a ficha oficial fillable do M&M 3e** (`MnM3_charsheet_color_fillable.pdf`) com todos os 211 campos usando `pdf-lib` — 100% no browser, sem backend.
- Página 1: Cabeçalho, Atributos, Defesas, Iniciativa, tabela de Offense (Attack 1–4 com DCs calculados automaticamente), resumos compactos de Perícias/Vantagens/Poderes, Notes & Conditions.
- Página 2: Grade estruturada de perícias (Hab / Ra / Total por perícia), subtypes de Combate Corpo-a-Corpo e à Distância, subtypes de Especialidade, Vantagens 1–11, Equipamento 1–10, Complicações 1–11, Notas 1–7.
- **Suporte a Modo Campanha** — Calcula corretamente totais de PP incluindo ajustes do Registro de PP quando em Modo Campanha.
- **Cálculos precisos de stats** — Resistência (VIG + ranks) e Iniciativa (bônus de AGL) calculados corretamente.
- **Tratamento de overflow** — Quando um personagem excede os limites fixos da ficha (ex: > 4 ataques, > 11 vantagens), um modal detalhado avisa o usuário antes de exportar e redireciona o excedente para os campos de Notas.
- Texto **completamente selecionável** em qualquer leitor de PDF — sem screenshot ou renderização por imagem.
- Template do PDF é pré-carregado em segundo plano ao iniciar o app para exports quase instantâneos.

#### 📤 Exportar para Excel
- Ficha completa exportada para um arquivo `.xlsx` estilizado com 8 abas: Resumo, Atributos, Defesas, Perícias, Vantagens, Poderes, Complicações e Registro de PP (quando em Modo Campanha).
- **Aba de Registro de PP** — Quando em Modo Campanha, inclui uma aba dedicada mostrando histórico completo de concessões/deduções com totais acumulados e ajustes positivos/negativos coloridos.
- **Cálculos precisos** — PP total inclui ajustes do Registro de PP, stats de Resistência e Iniciativa incluídos na aba de Defesas.
- Células coloridas, totais de PP e efeitos alternativos listados por poder.

#### 🌐 Internacionalização (i18n)
- **Arquitetura em duas camadas**: strings da UI via `react-i18next` (`translation.json`), dados do jogo via campos `i18n` nos arquivos JSON.
- Suportados atualmente: 🇧🇷 Português Brasileiro e 🇺🇸 Inglês.
- O idioma pode ser trocado em tempo real no menu superior sem recarregar a página.

#### 💾 Salvar / Carregar
- Personagens salvos automaticamente no `localStorage`.
- Import/Export via arquivo JSON — o schema do personagem é versionado com migração automática para saves antigos.

---

### 📋 Histórico de Versões

Para changelog detalhado, veja **[CHANGELOG.md](./CHANGELOG.md)**.

#### v1.10.0 (2026-06-13)
- Sistema de Abas Multi-Personagem com drag-and-drop e auto-save por aba
- Sistema de Subtipos de Vantagens com 8 vantagens suportando múltiplas instâncias
- Qualidade de Dados: 7 correções de vantagens correspondentes ao livro oficial M&M 3e
- Otimizações de performance: lazy loading e divisão de vendor chunks
- Melhorias de validação: limite de NP para vantagem Sorte, caps de perícias, validação de EA
- Melhorias de UI: dropdown de Maestria em Perícia, correção de renderização Portal, proteção de reset de personagem

#### v1.4.1 (2026-05-11)
- Corrigido cálculo de PP em modo campanha para incluir ajustes do Registro de PP
- Adicionados stats de Resistência e Iniciativa faltantes nas exportações
- Adicionada aba de Registro de PP na exportação Excel com totais acumulados
- Cobertura abrangente de testes para correções de exportação

#### v1.4.0 (2026-05-10)
- Auditoria Completa de Modificadores de Poderes: 209 modificadores verificados em 40 poderes (92,5% de precisão)
- 45+ modificadores específicos de poder com filtragem automática na UI
- Scripts de validação automatizada para conformidade contínua
- Corrigidos múltiplos problemas de modificadores específicos de poder

#### v1.3.0 (2026-04-28)
- Sistema Completo de Validação de Regras do M&M 3e com 8 fases de validação
- Aplicação de limites de NP, caps de ranks de perícias, validação de orçamento de PP
- Testes com builds oficiais (Daredevil, Battlesuit, Powerhouse, Paragon)
- 50+ casos de teste cobrindo todas as regras de validação

#### v1.2.0 (2026-04-15)
- Power Builder v2 com arquitetura multi-componente
- Efeitos Alternativos v2 com suporte completo a multi-componente
- SCHEMA_VERSION 2.0.0 com migração automática

---

### Arquitetura e Desenvolvimento Dirigido por IA

Este projeto foi um experimento deliberado em **desenvolvimento 100% dirigido por IA**. Nenhuma linha de código foi escrita manualmente. Meu papel foi o de **arquiteto e QA** — a IA executou, eu decidi.

Antes de um único commit, produzi uma especificação de engenharia completa cobrindo faseamento de entregas, princípios SOLID mapeados para arquivos concretos, convenções de nomenclatura, isolamento de domínios com Feature-Sliced, contratos exatos para os dados em JSON, estratégia de testes por camada, e 6 cenários de resiliência mapeados antecipadamente.

**O que eu fiz:**
- Decompus um domínio de regras complexo em requisitos sem ambiguidade
- Defini todas as decisões arquiteturais antes de existir uma linha de código
- Revisei cada mudança gerada pela IA e rejeitei qualquer desvio das convenções definidas
- Impus separação de responsabilidades, impedindo código acoplado ou espaguete

**O que a IA fez:**
- Implementou cada arquivo, componente, hook e serviço conforme a especificação
- Produziu zero surpresas arquiteturais — porque não havia espaço para improvisação

> Para a especificação de engenharia completa, veja **[ARCHITECTURE_PT.md](./docs/ARCHITECTURE_PT.md)**.

O projeto **não possui intenção nenhuma de lucrar** ou de infringir os direitos autorais da Green Ronin Publishing, criadores do M&M 3e. Este é um projeto feito de fã para a comunidade de RPG.

---

### Como Contribuir
Contribuições são extremamente bem-vindas — especialmente traduções!

Leia **[CONTRIBUTING.md](./CONTRIBUTING.md)** para saber como:
1. Traduzir strings de UI modificando arquivos `translation.json`.
2. Adicionar traduções (ou novos Poderes/Modificadores/Vantagens) diretamente nos dados base do jogo via a propriedade `i18n` nos arquivos JSON.

### 🛠️ Stack Tecnológica
- **React** — UI e Componentes
- **TypeScript** — Tipagem e domínio do jogo
- **Vite** — Build Tool e HMR
- **Zustand** — Gerenciamento de Estado
- **@dnd-kit** — Drag-and-Drop (paleta de modificadores)
- **React-i18next** — Internacionalização da UI
- **ExcelJS** — Exportação avançada da ficha
- **pdf-lib** — Exportação da ficha oficial fillable em PDF
- **Zod** — Validação de schema em runtime e migrações versionadas

---
Feito de fã para fã.
