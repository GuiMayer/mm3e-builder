# Contribuindo / Contributing

*Read this in other languages: [🇺🇸 English](#english) | [🇧🇷 Português](#português)*

---

<a id="português"></a>
## 🇧🇷 Português

Obrigado por se interessar em contribuir para o M&M 3e Builder! Este projeto é desenvolvido com foco na comunidade, e sua ajuda para expandi-lo é muito bem-vinda.

Neste guia, focamos principalmente na **Internacionalização (i18n)**, para que você possa nos ajudar a traduzir o aplicativo para o seu idioma ou adicionar novos dados (Poderes, Vantagens, etc.) traduzidos.

### Arquitetura de Internacionalização (i18n)

O sistema possui uma arquitetura de internacionalização de duas camadas ("dual-layer i18n") que separa os textos da interface de usuário (UI) dos textos de dados de jogo. O idioma "raiz" ou "fallback" do sistema é sempre o **Inglês**.

#### 1. Interface de Usuário (UI Strings)

Textos que fazem parte do "esqueleto" do aplicativo (como botões, cabeçalhos de painéis, menus) são gerenciados pelo `react-i18next`.

- **Onde encontrar:** `src/locales/{idioma}/translation.json`
- **Como contribuir:**
  1. Para melhorar uma tradução existente, edite o arquivo `translation.json` do idioma desejado (ex: `src/locales/pt-BR/translation.json`).
  2. Para adicionar um novo idioma, crie uma pasta com o código da língua (ex: `es` para Espanhol) dentro de `src/locales/`, copie a estrutura do `en/translation.json` e traduza os valores.
  3. Você também precisará importar o novo arquivo e adicioná-lo ao objeto de configuração em `src/locales/index.ts`.

#### 2. Dados de Jogo (Game Data)

Os dados estruturais do jogo, como Poderes, Modificadores, Perícias e Vantagens, são armazenados em arquivos JSON e carregados dinamicamente pela aplicação. Para facilitar contribuições via Git, esses arquivos mantêm suas próprias traduções localizadas embutidas.

- **Onde encontrar:** Pasta `src/data/` (ex: `powers.json`, `modifiers.json`)
- **A Estrutura de Tradução (Root Fallback):**
  A raiz do objeto JSON de um poder (ou vantagem) sempre deve estar em Inglês. Para fornecer traduções, utiliza-se a chave `i18n`.

**Exemplo Prático (powers.json):**

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
  "variableCost": null,
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

- **Como contribuir com Dados:**
  1. Modifique os arquivos em `src/data/`.
  2. Adicione sua linguagem à propriedade `"i18n"` de cada entrada usando o código da linguagem (ex: `"es"`).
  3. Preencha pelo menos `"name"`, e idealmente `"description"`. O resto das propriedades (tipo de ação, custo) compartilham do objeto base em inglês.

### Submetendo suas Alterações

1. Faça um *fork* do repositório.
2. Crie uma branch para a sua alteração (`git checkout -b minha-traducao`).
3. Faça o *commit* detalhando o que foi feito (`git commit -m 'Add Spanish translation'`).
4. Envie para o GitHub e abra um **Pull Request**.

Qualquer dúvida, abra as *Issues* do projeto. Agradecemos sua ajuda!

<br><br>

---

<a id="english"></a>
## 🇺🇸 English

Thank you for your interest in contributing to the M&M 3e Builder! This project is community-focused, and your help to expand it is highly appreciated.

In this guide, we focus primarily on **Internationalization (i18n)**, so you can help us translate the app into your language or add new translated data (Powers, Advantages, etc.).

### Internationalization Architecture (i18n)

The system features a "dual-layer i18n" architecture that separates User Interface (UI) texts from game data texts. The system's "root" or "fallback" language is always **English**.

#### 1. User Interface (UI Strings)

Texts that are part of the app's "skeleton" (like buttons, panel headers, and menus) are managed by `react-i18next`.

- **Where to find them:** `src/locales/{language}/translation.json`
- **How to contribute:**
  1. To improve an existing translation, edit the `translation.json` file for the desired language (e.g., `src/locales/pt-BR/translation.json`).
  2. To add a new language, create a folder with the language code (e.g., `es` for Spanish) inside `src/locales/`, copy the structure from `en/translation.json`, and translate the values.
  3. You will also need to import the new file and add it to the configuration object in `src/locales/index.ts`.

#### 2. Game Data

Structural game data, such as Powers, Modifiers, Skills, and Advantages, are stored in JSON files and loaded dynamically by the application. To facilitate Git contributions, these files keep their own localized translations embedded.

- **Where to find them:** `src/data/` folder (e.g., `powers.json`, `modifiers.json`)
- **The Translation Structure (Root Fallback):**
  The root of a JSON object for a power (or advantage) must always be in English. To provide translations, use the `i18n` key.

**Practical Example (powers.json):**

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
  "variableCost": null,
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

- **How to contribute Data:**
  1. Modify the files in `src/data/`.
  2. Add your language to the `"i18n"` property of each entry using the language code (e.g., `"es"`).
  3. Fill in at least `"name"`, and ideally `"description"`. The rest of the properties (action type, cost) share the English base object.

### Submitting your Changes

1. Fork the repository.
2. Create a branch for your feature or translation (`git checkout -b my-translation`).
3. Commit detailing what was done (`git commit -m 'Add Spanish translation'`).
4. Push to GitHub and open a **Pull Request**.

If you have any questions, feel free to open a project *Issue*. We appreciate your help!
