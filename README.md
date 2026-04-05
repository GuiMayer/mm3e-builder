# Mutants & Masterminds 3e Character Builder — v1.0

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
- **Advantages** — Searchable and filterable advantage selector with 49 advantages, ranked/flat type display, and description modal.
- **Complications** — Free-form title + description fields for Motivation, Enemy, Secret, etc.

#### ⚡ Power Builder (v2)
The Power Builder is the most feature-rich section, built for full M&M 3e rules compliance:

- **Multi-component Powers** — A single power can have multiple simultaneous effects (Linked Powers). Each component has its own effect, ranks, and modifier set.
- **Searchable Effect Selector** — Combobox with live search + type filter (Attack, Defense, Movement, Sense, etc.) and inline ⓘ info button to view full effect description, cost, and tags.
- **Drag-and-Drop Modifier Palette** — Collapsible sidebar with Extras, Flaws, and power-specific modifiers. Modifiers can be dragged directly onto each component's dropzone or added via click.
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

#### 📄 Export to PDF
- **Fills the official M&M 3e fillable character sheet** (`MnM3_charsheet_color_fillable.pdf`) with all 211 fields using `pdf-lib` — 100% client-side, no backend.
- Page 1: Header, Abilities, Defenses, Initiative, Offense table (Attack 1–4 with auto-calculated DCs), compact Skills/Advantages/Powers summaries, Notes & Conditions.
- Page 2: Structured skills grid (Ab / Ra / Total per skill), Close Combat & Ranged Combat subtypes, Expertise subtypes, Advantages 1–11, Equipment 1–10, Complications 1–11, Notes 1–7.
- **Overflow handling** — When a character exceeds the sheet's fixed limits (e.g. > 4 attacks, > 11 advantages), a detailed modal warns the user before export and redirects excess items to the Notes fields.
- Text is **fully selectable** in any PDF reader — no screenshot or image-based rendering.
- PDF template is pre-fetched in the background on app load for near-instant exports.

#### 📤 Export to Excel
- Full character sheet exported to a styled `.xlsx` workbook with 7 sections: Summary, Abilities, Defenses, Skills, Advantages, Powers, Complications.
- Color-coded cells, PP totals, and alternate effects listed per power.

#### 🌐 Internationalization (i18n)
- **Dual-layer architecture**: UI strings via `react-i18next` (`translation.json`), game data via `i18n` fields in JSON data files.
- Currently supported: 🇧🇷 Brazilian Portuguese and 🇺🇸 English.
- Language can be switched at runtime from the top menu bar without page reload.

#### 💾 Save / Load
- Characters saved to `localStorage` automatically.
- Import/Export via JSON file — character schema is versioned with automatic migration for older saves.

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
- **Vantagens** — Seletor pesquisável e filtrável com 49 vantagens, exibição de tipo (ranqueada/flat) e modal de descrição.
- **Complicações** — Campos livres de título e descrição para Motivação, Inimigo, Segredo, etc.

#### ⚡ Power Builder (v2)
O Power Builder é a seção mais completa, construído para máxima conformidade com as regras do M&M 3e:

- **Poderes multi-componente** — Um único poder pode ter múltiplos efeitos simultâneos (Poderes Vinculados). Cada componente tem seu próprio efeito, ranks e conjunto de modificadores.
- **Seletor de efeito pesquisável** — Combobox com busca em tempo real + filtro por tipo (Ataque, Defesa, Movimento, Sentido, etc.) e botão ⓘ embutido para ver descrição completa do efeito, custo e tags.
- **Paleta de Modificadores via Drag-and-Drop** — Barra lateral recolhível com Extras, Falhas e modificadores específicos do efeito. Modificadores podem ser arrastados diretamente para a dropzone de cada componente ou adicionados com um clique.
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

#### 📄 Exportar como PDF
- **Preenche a ficha oficial fillable do M&M 3e** (`MnM3_charsheet_color_fillable.pdf`) com todos os 211 campos usando `pdf-lib` — 100% no browser, sem backend.
- Página 1: Cabeçalho, Atributos, Defesas, Iniciativa, tabela de Offense (Attack 1–4 com DCs calculados automaticamente), resumos compactos de Perícias/Vantagens/Poderes, Notes & Conditions.
- Página 2: Grade estruturada de perícias (Hab / Ra / Total por perícia), subtypes de Combate Corpo-a-Corpo e à Distância, subtypes de Especialidade, Vantagens 1–11, Equipamento 1–10, Complicações 1–11, Notas 1–7.
- **Tratamento de overflow** — Quando um personagem excede os limites fixos da ficha (ex: > 4 ataques, > 11 vantagens), um modal detalhado avisa o usuário antes de exportar e redireciona o excedente para os campos de Notas.
- Texto **completamente selecionável** em qualquer leitor de PDF — sem screenshot ou renderização por imagem.
- Template do PDF é pré-carregado em segundo plano ao iniciar o app para exports quase instantâneos.

#### 📤 Exportar para Excel
- Ficha completa exportada para um arquivo `.xlsx` estilizado com 7 abas: Resumo, Atributos, Defesas, Perícias, Vantagens, Poderes, Complicações.
- Células coloridas, totais de PP e efeitos alternativos listados por poder.

#### 🌐 Internacionalização (i18n)
- **Arquitetura em duas camadas**: strings da UI via `react-i18next` (`translation.json`), dados do jogo via campos `i18n` nos arquivos JSON.
- Suportados atualmente: 🇧🇷 Português Brasileiro e 🇺🇸 Inglês.
- O idioma pode ser trocado em tempo real no menu superior sem recarregar a página.

#### 💾 Salvar / Carregar
- Personagens salvos automaticamente no `localStorage`.
- Import/Export via arquivo JSON — o schema do personagem é versionado com migração automática para saves antigos.

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
