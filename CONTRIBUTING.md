# Contribuindo / Contributing

*Read this in other languages: [🇺🇸 English](#english) | [🇧🇷 Português](#português)*

---

<a id="english"></a>
## 🇺🇸 English

Thank you for your interest in contributing to the M&M 3e Builder! This project is community-focused, and your help to expand it is highly appreciated.

This guide focuses primarily on **Internationalization (i18n)** — how to translate the app into your language or add new translated game data (Powers, Advantages, Modifiers, Skills).

---

### Understanding the i18n Architecture

The system uses a **dual-layer i18n architecture** that keeps UI text completely separate from game data text. This makes each type of contribution independent — you don't need to touch game data files to fix a button label, and vice versa.

The system's fallback language is always **English**. If a translation key or game data entry is missing for the active language, English is displayed automatically.

**Language detection order:**
1. A previously saved preference stored in `localStorage` (key: `mm3e-language`)
2. The browser's own language setting (`navigator.language`)
3. Fallback: `en`

---

### Layer 1 — UI Strings (`react-i18next`)

All text that is part of the app's shell — button labels, panel headers, form placeholders, menus, error messages — is managed by `react-i18next`.

**File location:**
```
src/locales/
├── en/
│   └── translation.json     ← source of truth (English)
├── pt-BR/
│   └── translation.json     ← Brazilian Portuguese
└── index.ts                 ← registers languages + detection config
```

**How to improve an existing translation:**
Edit the `translation.json` file for the target language. Keys are dot-separated namespaces like `builder.addAlternate` or `palette.extras`.

**How to add a new language (e.g. Spanish):**

1. Create `src/locales/es/translation.json` — copy all keys from `en/translation.json` and translate the values.
2. Open `src/locales/index.ts` and add:
   ```ts
   import es from './es/translation.json';

   // inside the resources object:
   es: { translation: es },
   ```
3. Optionally add your language to the language-switcher UI in the app's menu.

> **Tip:** Keep keys in English even in non-English `translation.json` files — only values are translated.

---

### Layer 2 — Game Data (`src/data/`)

Structural game data is stored in JSON files loaded dynamically at runtime. Each entry contains its own embedded translations under an `i18n` key, keeping all data for a given entry in one place.

**Files:**
```
src/data/
├── powers.json       ← power effects (Flight, Damage, Affliction…)
├── modifiers.json    ← extras and flaws (Area, Burst, Limited…)
├── advantages.json   ← advantages (Accurate Attack, Improvised Tools…)
└── skills.json       ← skill definitions (Athletics, Perception…)
```

**The structure:** The root object of every entry **must always be in English** and serves as the fallback. Translations are nested under the `i18n` key, indexed by language code.

**Full example (`powers.json` entry):**
```json
{
  "id": "flight",
  "name": "Flight",
  "type": "movement",
  "baseCost": 2,
  "action": "free",
  "range": "personal",
  "duration": "sustained",
  "description": "Allows flying at a speed proportional to the rank.",
  "i18n": {
    "pt-BR": {
      "name": "Voo",
      "description": "Permite voar a uma velocidade proporcional ao rank."
    },
    "es": {
      "name": "Vuelo",
      "description": "Permite volar a una velocidad proporcional al rango."
    }
  }
}
```

**Modifier example (`modifiers.json` entry):**
```json
{
  "id": "area_burst",
  "name": "Burst Area",
  "category": "extra",
  "costValue": 1,
  "costType": "per_rank",
  "description": "Effect fills a volume around the target.",
  "i18n": {
    "pt-BR": {
      "name": "Área em Rajada",
      "description": "O efeito preenche um volume ao redor do alvo."
    }
  }
}
```

**What to fill in per entry:**
| Field | Required | Notes |
|---|---|---|
| `name` | ✅ Yes | Always translate this |
| `description` | ✅ Recommended | Shown in info modals and tooltips |
| `longDescription` | ⬜ Optional | Fuller rules text, shown in detail modals |
| Other fields | ❌ No | `baseCost`, `action`, `range` etc. are always from the English root |

---

### Submitting your Changes

1. **Fork** the repository on GitHub.
2. **Create a branch** for your contribution:
   ```bash
   git checkout -b add-spanish-translation
   ```
3. **Make your changes** to the relevant files.
4. **Commit** with a clear message:
   ```bash
   git commit -m "i18n: add Spanish translation for powers and UI strings"
   ```
5. **Push** and open a **Pull Request** describing what language/data you added.

If you have any questions, open a project **Issue**. We appreciate your help!

---

<br><br>

---

<a id="português"></a>
## 🇧🇷 Português

Obrigado por se interessar em contribuir para o M&M 3e Builder! Este projeto é desenvolvido com foco na comunidade, e sua ajuda para expandi-lo é muito bem-vinda.

Este guia foca principalmente na **Internacionalização (i18n)** — como traduzir o aplicativo para o seu idioma ou adicionar novos dados de jogo traduzidos (Poderes, Vantagens, Modificadores, Perícias).

---

### Entendendo a Arquitetura i18n

O sistema usa uma **arquitetura i18n de duas camadas** que mantém o texto da UI completamente separado dos textos dos dados de jogo. Isso torna cada tipo de contribuição independente — não é preciso mexer nos arquivos de dados do jogo para corrigir um rótulo de botão, e vice-versa.

O idioma de fallback do sistema é sempre o **Inglês**. Se uma chave de tradução ou entrada de dado de jogo estiver ausente para o idioma ativo, o inglês é exibido automaticamente.

**Ordem de detecção de idioma:**
1. Preferência salva anteriormente no `localStorage` (chave: `mm3e-language`)
2. Configuração de idioma do próprio navegador (`navigator.language`)
3. Fallback: `en`

---

### Camada 1 — Strings de UI (`react-i18next`)

Todo texto que faz parte do esqueleto do aplicativo — rótulos de botões, cabeçalhos de painéis, placeholders de formulários, menus, mensagens de erro — é gerenciado pelo `react-i18next`.

**Localização dos arquivos:**
```
src/locales/
├── en/
│   └── translation.json     ← fonte da verdade (Inglês)
├── pt-BR/
│   └── translation.json     ← Português Brasileiro
└── index.ts                 ← registra idiomas + configuração de detecção
```

**Como melhorar uma tradução existente:**
Edite o arquivo `translation.json` do idioma desejado. As chaves são namespaces separados por ponto, como `builder.addAlternate` ou `palette.extras`.

**Como adicionar um novo idioma (ex: Espanhol):**

1. Crie `src/locales/es/translation.json` — copie todas as chaves do `en/translation.json` e traduza os valores.
2. Abra `src/locales/index.ts` e adicione:
   ```ts
   import es from './es/translation.json';

   // dentro do objeto resources:
   es: { translation: es },
   ```
3. Opcionalmente adicione seu idioma ao seletor de idioma no menu do aplicativo.

> **Dica:** Mantenha as chaves em inglês mesmo nos arquivos `translation.json` de outros idiomas — apenas os valores são traduzidos.

---

### Camada 2 — Dados de Jogo (`src/data/`)

Os dados estruturais do jogo são armazenados em arquivos JSON carregados dinamicamente em tempo de execução. Cada entrada contém suas próprias traduções embutidas sob a chave `i18n`, mantendo todos os dados de uma entrada em um só lugar.

**Arquivos:**
```
src/data/
├── powers.json       ← efeitos de poder (Voo, Dano, Aflição…)
├── modifiers.json    ← extras e falhas (Área, Rajada, Limitado…)
├── advantages.json   ← vantagens (Ataque Preciso, Ferramentas Improvisadas…)
└── skills.json       ← definições de perícias (Atletismo, Percepção…)
```

**A estrutura:** O objeto raiz de cada entrada **deve sempre estar em Inglês** e serve como fallback. As traduções são aninhadas sob a chave `i18n`, indexadas pelo código do idioma.

**Exemplo completo (entrada em `powers.json`):**
```json
{
  "id": "flight",
  "name": "Flight",
  "type": "movement",
  "baseCost": 2,
  "action": "free",
  "range": "personal",
  "duration": "sustained",
  "description": "Allows flying at a speed proportional to the rank.",
  "i18n": {
    "pt-BR": {
      "name": "Voo",
      "description": "Permite voar a uma velocidade proporcional ao rank."
    },
    "es": {
      "name": "Vuelo",
      "description": "Permite volar a una velocidad proporcional al rango."
    }
  }
}
```

**Exemplo de modificador (`modifiers.json`):**
```json
{
  "id": "area_burst",
  "name": "Burst Area",
  "category": "extra",
  "costValue": 1,
  "costType": "per_rank",
  "description": "Effect fills a volume around the target.",
  "i18n": {
    "pt-BR": {
      "name": "Área em Rajada",
      "description": "O efeito preenche um volume ao redor do alvo."
    }
  }
}
```

**O que preencher por entrada:**
| Campo | Obrigatório | Observações |
|---|---|---|
| `name` | ✅ Sim | Sempre traduzir |
| `description` | ✅ Recomendado | Exibido em modais de info e tooltips |
| `longDescription` | ⬜ Opcional | Texto de regras mais completo, exibido em modais de detalhe |
| Outros campos | ❌ Não | `baseCost`, `action`, `range` etc. sempre vêm do objeto raiz em inglês |

---

### Submetendo suas Alterações

1. Faça um **fork** do repositório no GitHub.
2. **Crie uma branch** para sua contribuição:
   ```bash
   git checkout -b adicionar-traducao-espanhol
   ```
3. **Faça as alterações** nos arquivos relevantes.
4. **Commit** com uma mensagem clara:
   ```bash
   git commit -m "i18n: adiciona tradução em Espanhol para poderes e strings de UI"
   ```
5. **Push** e abra um **Pull Request** descrevendo qual idioma/dados você adicionou.

Qualquer dúvida, abra uma **Issue** no projeto. Agradecemos sua ajuda!
