# Contributing / Contribuindo

[English](#english) | [Português](#português)

<a id="english"></a>
## English

Use Node.js 24 and install dependencies with `npm ci`. Read the
[architecture](docs/ARCHITECTURE_REFINED.md) before changing module boundaries.
Active limitations and proposals belong in [Pending work](docs/PENDENCIAS.md).

### Code and data

- Keep character operations and calculations pure. Coordinate persistence in
  `services/storage`, application state in `store`, and workflows in `features`.
- Reuse canonical pricing and point-summary functions. A UI or export should not
  introduce a second implementation of costs or derived bonuses.
- Preserve character/Resource IDs, original text, modifier applications and
  supported extensions. A schema change requires backward-compatible defaults,
  migration where needed and round-trip coverage.
- Distinguish structural errors from advisory rule diagnostics. Generic Extras
  and Flaws remain player/GM choices; effect-specific sources remain restricted.
- Changes to persisted data must handle failed writes, original-data backups,
  ambiguous legacy values and stale browser windows where applicable.
- Prefer focused fixes and logical commits. State the trigger, resulting behavior,
  validation and relevant compatibility impact in the pull request.

Game definitions live in `src/data/`; loaders and entities own their contracts.
Check the supplied rule source before changing definitions. A legacy identifier
may intentionally retain its previous price; do not replace it silently.

Power-library chapters contain authored recipes separate from persisted powers.
Fixed purchases retain required ranks; scalable effects start at 1. Expected
book prices are test evidence, not engine inputs. Document editorial differences
in the recipe preview without artificial modifiers or manual price overrides.
See [Recipe rules](docs/power-library-rules.md).

### Localization

UI strings reside in `src/locales/en/translation.json` and
`src/locales/pt-BR/translation.json`. Register languages in `src/locales/index.ts`.
Use stable translation keys and interpolation instead of concatenated sentences.
English is the fallback. Preserve user-authored names and notes when switching
language; they are not catalog translations.

Game definitions can expose per-language `i18n` fields. Keep canonical IDs,
numeric costs, configuration values and source flags stable while translating
names, descriptions and labels. Check each data type and the current localized
loader; not every catalog uses an identical translation structure. Power-library
recipes have their own chapter-localized metadata.

To add a language, provide its UI resources, register them and add a display
label to `LANGUAGE_LABELS` in `src/shared/ui/MenuBar.tsx`. The selector's language
list is derived from registered resources. Review supported game-data translations
and run localization coverage tests.

`appStore` persists language in `mm3e-app-preferences`; the menu synchronizes
i18next with that preference. The i18next detector also uses the historical
`mm3e-language` key and navigator fallback. Test first use, explicit selection
and reload rather than assuming the detector alone controls app language.

### Validation and documentation

```sh
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run build:verify
```

Use the [test guide](src/__tests__/README.md) to select meaningful regressions.
For UI changes, check keyboard/focus, narrow layouts, active themes and both
languages. Export changes need verification of generated content, pagination
and text selection where applicable. Use synthetic characters for browser checks.

Update the current feature guide when behavior changes. Record unresolved work
only in Pending work, with evidence, scope and acceptance criteria; remove it
when completed. Do not add completed plans, audit snapshots or duplicate roadmaps.
Release notes belong in CHANGELOG.md and commit/version grouping in
`docs/version-history.md`. Use conventional technical language without emojis.

<a id="português"></a>
## Português

Use Node.js 24, instale com `npm ci` e consulte a
[arquitetura](docs/ARCHITECTURE_REFINED.md). Separe operações puras, coordenação de
armazenamento, estado e interface. Reutilize os cálculos canônicos na ficha,
Builder e exportações. Mudanças no modelo exigem compatibilidade, cobertura de
importação/exportação e tratamento das falhas de persistência.

Consulte a fonte de regras antes de alterar definições. Preserve IDs, texto do
usuário, aplicações de modificadores e extensões suportadas. Definições legadas
podem manter preços anteriores deliberadamente. Extras e flaws genéricos ficam
sob decisão do jogador/narrador; origem específica continua restrita ao efeito.
Receitas da biblioteca não podem carregar preços finais manuais ou modificadores
artificiais para alcançar um valor impresso.

Para traduções, edite os recursos de UI em `src/locales/` e as propriedades
localizadas suportadas pelos catálogos. Não traduza IDs, custos ou valores de
configuração. Idiomas novos devem ser registrados em `src/locales/index.ts`, com
rótulo em `LANGUAGE_LABELS` no MenuBar. A lista do seletor deriva desse registro.
A preferência ativa usa `mm3e-app-preferences`; confira também o detector legado,
a primeira abertura e a restauração após recarregar.

Execute os cinco checks da seção Validation and documentation. Acrescente testes
quando verificarem comportamento relevante; alterações de interface precisam de
verificação de foco/teclado, larguras pequenas, temas e idiomas. Confira os
arquivos efetivamente gerados ao alterar exportadores.

Use commits lógicos e descreva problema, resultado, validação e impacto de
compatibilidade. Atualize o guia vigente e centralize trabalho aberto em
[Pendências](docs/PENDENCIAS.md), removendo os itens concluídos. Não mantenha
roadmaps duplicados ou relatórios de conclusão. Use linguagem técnica comum em
repositórios, sem emojis.
