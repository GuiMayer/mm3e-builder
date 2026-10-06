# Mutants & Masterminds 3e Character Builder

[English](#english) | [Português](#português)

<a id="english"></a>
## English

Browser-based character builder for Mutants & Masterminds 3rd Edition. The app
runs as a static site, calculates Power Points (PP) and Equipment Points (EP),
and stores characters locally. It has no account system or backend.

[Open the application](https://guimayer.github.io/mm3e-builder/).
Release notes are in [CHANGELOG.md](CHANGELOG.md); version and commit groups are
in [Version history](docs/releases/version-history.md).

### Features

| Area | Behavior and guide |
| --- | --- |
| Character sheet | Abilities, defenses, skills, advantages, complications, targeted attacks and multiple character tabs |
| Power Builder | Linked and alternate effects, partial modifiers, independent repeated applications and [configurable diagnostics](docs/guides/power-builder-modifier-policy.md) |
| Power library | [Power Profiles, local character powers and personal models](docs/guides/power-library.md), with rank policies, normal pricing and model import/export |
| Resources | Reusable devices, equipment, vehicles and headquarters with [shared links and PP/EP allocation](docs/guides/resources.md) |
| Campaign | [Fixed starting budget and advancement ledger](docs/guides/campaign-mode.md), with reviewed migration and original-data backups |
| References | [Searchable rule panels and measurement tables](docs/guides/references.md), metric/imperial preference and rank extrapolation |
| Portraits | [Remote URL or local image](docs/guides/character-portraits.md), display fit and optional PDF inclusion |
| Dice | [Manual and contextual d20 checks](docs/guides/dice-roller.md), with runtime-only history |
| Themes | Built-in themes and a [locally saved custom palette](docs/guides/custom-themes.md) |
| Files and exports | Character JSON, full-Draft JSONL, optional ZIP with local portraits, Excel, compact selectable-text HTML/PDF and an optional legacy PDF form |

Calculations share canonical modules across sheet and exports. Generic modifier
choices remain with the player/GM; effect-specific modifiers retain their source
restriction. Current limits and verified outstanding work are in
[Pending work](docs/PENDENCIAS.md).

### Local development

Use Node.js 24, matching CI.

```sh
npm ci
npm run dev
```

Run the project checks:

```sh
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run build:verify
```

`npm run preview` serves the production build locally. The GitHub Actions
workflow runs the checks before deployment; pull requests validate without
publishing. Production deployment uses GitHub Pages from `main`.

### Data and compatibility

Characters and Resources persist in localStorage. Portrait bytes reside in
IndexedDB; a local image does not travel with standalone character JSON or Draft JSONL.
Choose to include images in ZIP when exporting a character or Draft to transport
local portraits, then use the corresponding import action to restore them.
A remote portrait URL and optional fit can travel with the character. Export
backups before clearing site data or moving to another browser.
Personal power models have separate browser storage and JSON import/export;
character and Draft exports do not include the model library.

Current character JSON uses schema 2.3.0 and accepts historical 1.0.0, 2.0.0,
2.1.0 and 2.2.0. Resource library/appendix uses version 2; Draft JSONL uses version 1.
Application versions and data-schema versions are independent. Migrations retain
original-data backups and require review for ambiguous campaign/resource choices.
See the [architecture](docs/development/ARCHITECTURE_REFINED.md) and feature guides for limits.

### Documentation and contributions

Start with the [documentation index](docs/README.md),
[contribution guide](CONTRIBUTING.md) and [test guide](src/__tests__/README.md).
The stack uses React, TypeScript, Vite, Zustand, Zod, i18next, dnd-kit,
Floating UI, jsPDF, pdf-lib and ExcelJS. Feature modules load heavy export and
catalog dependencies on demand.

The code is licensed under [GNU GPL v3](LICENSE). This is a noncommercial fan
project, unaffiliated with Green Ronin Publishing. Mutants & Masterminds and
source-book content belong to their respective rights holders; the code license
does not grant redistribution rights to those works.

<a id="português"></a>
## Português

Construtor de personagens de Mutants & Masterminds 3ª edição executado no
navegador. O aplicativo é um site estático, calcula PP/EP e mantém personagens
localmente, sem contas ou backend.

[Abrir o aplicativo](https://guimayer.github.io/mm3e-builder/).
As funcionalidades incluem ficha em múltiplas abas, Power Builder com efeitos
vinculados/alternativos, biblioteca Power Profiles, recursos reutilizáveis,
modo campanha, referências, retratos, rolagens da sessão e temas personalizados.
Exporta JSON, rascunho JSONL, Excel e HTML/PDF com texto selecionável; o formulário
PDF legado permanece opcional.

Os cálculos são compartilhados pela ficha e pelas exportações. Extras e flaws
genéricos ficam a critério do jogador/narrador; modificadores específicos
continuam restritos ao próprio efeito. Os guias estão no
[índice de documentação](docs/README.md), e o trabalho aberto está centralizado
em [Pendências](docs/PENDENCIAS.md).

Para desenvolvimento, use Node.js 24 e os comandos da seção Local development.
Consulte [CONTRIBUTING.md](CONTRIBUTING.md) para alterações de código, dados e
traduções, e o [guia de testes](src/__tests__/README.md) para validação.

Fichas e recursos usam localStorage; imagens usam IndexedDB. Um retrato local
não acompanha JSON ou backup JSONL isolado. A exportação oferece ZIP com imagens
locais, restaurado pelas ações de importar ficha ou rascunho.
Modelos pessoais de poderes têm armazenamento e exportação JSON próprios;
backups de fichas e rascunhos não incluem essa biblioteca.
O schema de ficha atual é 2.3.0, com leitura
de 1.0.0/2.0.0/2.1.0/2.2.0; recursos usam versão 2 e rascunhos usam versão 1.
Exporte backups antes de limpar os dados do site. Migrações e revisões de dados
antigos estão descritas nos guias de [campanha](docs/guides/campaign-mode.md),
[recursos](docs/guides/resources.md) e [retratos](docs/guides/character-portraits.md).

O [changelog](CHANGELOG.md) descreve as versões; o
[histórico de versões](docs/releases/version-history.md) agrupa seus commits. O código
usa [GNU GPL v3](LICENSE). Projeto de fã, sem fins comerciais ou vínculo com a
Green Ronin Publishing; os direitos dos livros e da marca pertencem aos seus
titulares e não são concedidos pela licença do código.
