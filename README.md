# Mutants & Masterminds 3e Character Builder

*Read this in other languages: [🇺🇸 English](#english) | [🇧🇷 Português](#português)*

---

<a id="english"></a>
## 🇺🇸 English

A modern, fast, and user-friendly character builder for the Mutants & Masterminds 3rd Edition (M&M 3e) RPG system. Built to simplify the complex character creation process, featuring automatic Power Points (PP) calculation and Power Level (PL) compliance validation.

### Access the App
You can use the updated online version hosted on GitHub Pages here:
**[https://guimayer.github.io/mm3e-builder/](https://guimayer.github.io/mm3e-builder/)**

### About the Project
This project was envisioned as an agile and highly visual tool compared to outdated spreadsheets. It features:
- Automated cost calculation for Abilities, Skills, Advantages, Defenses, and Powers.
- A math engine to handle complex effect modifiers and "Alternate Effects" (Arrays).
- Real-time Power Level bounds validations.
- Exporting finished character sheets to a styled spreadsheet (`.xlsx`).
- Real-time i18n localization (Brazilian Portuguese and English currently supported).

#### Architecture & AI-Directed Development

This project was a deliberate experiment in **100% AI-directed development**. Not a single line of code was written manually. My role was **architect and QA** — the AI executed, I decided.

Before a single commit, I produced a complete engineering specification covering phased delivery, SOLID principles mapped to concrete files, naming conventions, Feature-Sliced domain isolation, exact JSON data contracts, a test strategy by layer, and 6 pre-mapped resilience scenarios including automatic export fallback on `localStorage` overflow.

The few commits in this repo are not a sign of little work — they are evidence that the real work happened during the planning phase. When execution started, it was clean.

**What I did:**

- Decomposed a complex, multi-rule game domain into unambiguous requirements
- Defined all architectural decisions before any code existed (stack, state management, i18n structure, schema versioning, scope-cutting priority order)
- Reviewed every AI-generated change and rejected any deviation from defined conventions
- Enforced separation of concerns, preventing the AI from producing coupled or spaghetti code

**What the AI did:**

- Implemented every file, component, hook, and service according to the spec
- Generated unit tests for `mathEngine`, `fileService`, and `validation`
- Produced zero architectural surprises — because there was no room for improvisation

> For the full engineering specification, see ARCHITECTURE.md.

This project has **absolutely no intention of making a profit** or infringing on the copyrights of Green Ronin Publishing, the creators of M&M 3e. This is purely a fan-made project for the TTRPG community.

### How to Contribute (Translations and more)
Contributions to expand the app's ecosystem are extremely welcome, especially translations!

Read our **[CONTRIBUTING.md](./CONTRIBUTING.md)** (currently in Portuguese) to learn how to:
1. Translate UI strings by modifying `translation.json` files.
2. Add translations (or new Powers/Modifiers/Advantages) directly into the game's base data via the `i18n` property in JSON files.

The architecture allows you to **quickly** contribute new localizations without needing deep programming knowledge. Your Pull Requests are welcome!

### Tech Stack
- React (UI and Components)
- TypeScript (Typing and Game Domain)
- Vite (Build Tool & HMR)
- Zustand (State Management)
- React-i18next (UI Internationalization)
- ExcelJS (Advanced Sheet Exporting)

---
Made by a fan, for fans.

---

<a id="português"></a>
## 🇧🇷 Português

Um criador de fichas moderno, rápido e focado na facilidade de uso para o sistema de RPG Mutants & Masterminds 3ª Edição (M&M 3e). Construído para facilitar a montagem complexa de personagens, cálculo automático de Power Points (PP) e validação de Power Level (PL).

### Acesse o aplicativo
Você pode usar a versão online atualizada e hospedada no GitHub Pages aqui:
**[https://guimayer.github.io/mm3e-builder/](https://guimayer.github.io/mm3e-builder/)**

### Sobre o Projeto
Este projeto foi idealizado para ser uma ferramenta ágil e altamente visual comparada com planilhas antigas. Suporta:
- Cálculo automatizado do custo de Atributos, Perícias, Vantagens, Defesas e Poderes.
- Motor matemático para modificadores de efeitos complexos e "Alternate Effects" (Arranjos).
- Validações de limites impostas pelo Nível de Poder (Power Level Limits) em tempo real.
- Exportação da ficha finalizada para planilha estilizada (`.xlsx`).
- Localização i18n em tempo real (Português Brasileiro e Inglês já suportados).

#### Arquitetura e Desenvolvimento Dirigido por IA

Este projeto foi um experimento deliberado em **desenvolvimento 100% dirigido por IA**. Nenhuma linha de código foi escrita manualmente. Meu papel foi o de **arquiteto e QA** — a IA executou, eu decidi.

Antes de um único commit, produzi uma especificação de engenharia completa cobrindo faseamento de entregas, princípios SOLID mapeados para arquivos concretos, convenções de nomenclatura, isolamento de domínios com Feature-Sliced, contratos exatos para os dados em JSON, estratégia de testes por camada, e 6 cenários de resiliência mapeados antecipadamente — incluindo fallback automático de exportação em caso de overflow do `localStorage`.

Os poucos commits deste repositório não são sinal de pouco trabalho — são evidência de que o trabalho real aconteceu na fase de planejamento. Quando a execução começou, ela foi limpa.

**O que eu fiz:**

- Decompus um domínio de regras complexo em requisitos sem ambiguidade
- Defini todas as decisões arquiteturais antes de existir uma linha de código (stack, gerenciamento de estado, estrutura de i18n, versionamento de schema, ordem de corte de escopo)
- Revisei cada mudança gerada pela IA e rejeitei qualquer desvio das convenções definidas
- Impus separação de responsabilidades, impedindo que a IA produzisse código acoplado ou espaguete

**O que a IA fez:**

- Implementou cada arquivo, componente, hook e serviço conforme a especificação
- Gerou testes unitários para `mathEngine`, `fileService` e `validation`
- Produziu zero surpresas arquiteturais — porque não havia espaço para improvisação

> Para a especificação de engenharia completa, veja ARCHITECTURE_PT.md.

O projeto **não possui intenção nenhuma de lucrar** ou de infringir os direitos autorais da Green Ronin Publishing, criadores do M&M 3e. Este é um projeto feito de fã para a comunidade de RPG.

### Como Contribuir (Traduções e mais)
Contribuições para expandir o ecossistema do app são extremamente bem-vindas, especialmente de traduções!

Leia nosso **[CONTRIBUTING.md](./CONTRIBUTING.md)** para saber como:
1. Traduzir strings de UI modificando arquivos `translation.json`.
2. Adicionar traduções (ou novos Poderes/Modificadores/Vantagens) diretamente nos dados base do jogo via a propriedade `i18n` nos arquivos JSON.

A estrutura permite que você **rapidamente** contribua com novas localizações sem saber programar profundamente. Seus Pull Requests são bem-vindos!

### 🛠️ Stack Tecnológica
- React (UI e Componentes)
- TypeScript (Tipagem e domínio do jogo)
- Vite (Build Tool e HMR)
- Zustand (Gerenciamento de Estado)
- React-i18next (Internacionalização da UI)
- ExcelJS (Exportação avançada da ficha)

---
Feito de fã para fã.

<br><br>

---
