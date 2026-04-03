# Mutants & Masterminds 3e Character Builder

*Read this in other languages: [🇺🇸 English](#english) | [🇧🇷 Português](#português)*

---

<a id="português"></a>
## 🇧🇷 Português

Um criador de fichas moderno, rápido e focado na facilidade de uso para o sistema de RPG Mutants & Masterminds 3ª Edição (M&M 3e). Construído para facilitar a montagem complexa de personagens, cálculo automático de Power Points (PP) e validação de Power Level (PL).

### 🚀 Acesse o aplicativo
Você pode usar a versão online atualizada e hospedada no GitHub Pages aqui:
**[https://guimayer.github.io/mm3e-builder/](https://guimayer.github.io/mm3e-builder/)**

### 💡 Sobre o Projeto
Este projeto foi idealizado para ser uma ferramenta ágil e altamente visual comparada com planilhas antigas. Suporta:
- Cálculo automatizado do custo de Atributos, Perícias, Vantagens, Defesas e Poderes.
- Motor matemático para modificadores de efeitos complexos e "Alternate Effects" (Arranjos).
- Validações de limites impostas pelo Nível de Poder (Power Level Limits) em tempo real.
- Exportação da ficha finalizada para planilha estilizada (`.xlsx`).
- Localização i18n em tempo real (Português Brasileiro e Inglês já suportados).

#### 🤖 Desenvolvimento Dirigido por IA

Este projeto foi um experimento deliberado em **desenvolvimento dirigido por IA**. Atuei como arquiteto e QA — nenhuma linha de código foi escrita manualmente. Meu trabalho foi decompor um domínio de regras complexo em requisitos claros, definir as decisões arquiteturais (stack, gerenciamento de estado, estrutura de i18n, formato de exportação), revisar cada mudança gerada pela IA, e rejeitar ou corrigir qualquer desvio de boas práticas antes que virasse código de produção.

O objetivo era validar se uma aplicação multi-feature de qualidade real poderia ser entregue em produção através de direção deliberada de IA — sem escrever uma linha sequer.

O projeto **não possui intenção nenhuma de lucrar** ou de infringir os direitos autorais da Green Ronin Publishing, criadores do M&M 3e. Este é um projeto feito de fã para a comunidade de RPG.

### 🤝 Como Contribuir (Traduções e mais)
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
Feito de fã para fã 🦸‍♂️

<br><br>

---

<a id="english"></a>
## 🇺🇸 English

A modern, fast, and user-friendly character builder for the Mutants & Masterminds 3rd Edition (M&M 3e) RPG system. Built to simplify the complex character creation process, featuring automatic Power Points (PP) calculation and Power Level (PL) compliance validation.

### 🚀 Access the App
You can use the updated online version hosted on GitHub Pages here:
**[https://guimayer.github.io/mm3e-builder/](https://guimayer.github.io/mm3e-builder/)**

### 💡 About the Project
This project was envisioned as an agile and highly visual tool compared to outdated spreadsheets. It features:
- Automated cost calculation for Abilities, Skills, Advantages, Defenses, and Powers.
- A math engine to handle complex effect modifiers and "Alternate Effects" (Arrays).
- Real-time Power Level bounds validations.
- Exporting finished character sheets to a styled spreadsheet (`.xlsx`).
- Real-time i18n localization (Brazilian Portuguese and English currently supported).

#### 🤖 AI-Directed Development

This project was a deliberate experiment in **AI-directed development**. I acted as architect and QA — no lines of code were written manually. My work was to decompose a complex rules domain into clear requirements, define the architectural decisions (stack, state management, i18n structure, export format), review every AI-generated change, and reject or correct any drift from good practices before it reached production.

The goal was to validate whether a real, multi-feature application could be shipped to production quality through deliberate AI direction alone — without writing a single line of code.

This project has **absolutely no intention of making a profit** or infringing on the copyrights of Green Ronin Publishing, the creators of M&M 3e. This is purely a fan-made project for the TTRPG community.

### 🤝 How to Contribute (Translations and more)
Contributions to expand the app's ecosystem are extremely welcome, especially translations!

Read our **[CONTRIBUTING.md](./CONTRIBUTING.md)** (currently in Portuguese) to learn how to:
1. Translate UI strings by modifying `translation.json` files.
2. Add translations (or new Powers/Modifiers/Advantages) directly into the game's base data via the `i18n` property in JSON files.

The architecture allows you to **quickly** contribute new localizations without needing deep programming knowledge. Your Pull Requests are welcome!

### 🛠️ Tech Stack
- React (UI and Components)
- TypeScript (Typing and Game Domain)
- Vite (Build Tool & HMR)
- Zustand (State Management)
- React-i18next (UI Internationalization)
- ExcelJS (Advanced Sheet Exporting)

---
Made by a fan, for fans 🦸‍♂️
