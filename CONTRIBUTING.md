# Contribuindo para o M&M 3e Builder

Obrigado por se interessar em contribuir para o M&M 3e Builder! Este projeto é desenvolvido com foco na comunidade, e sua ajuda para expandi-lo é muito bem-vinda.

Neste guia, focamos principalmente na **Internacionalização (i18n)**, para que você possa nos ajudar a traduzir o aplicativo para o seu idioma ou adicionar novos dados (Poderes, Vantagens, etc.) traduzidos.

## Arquitetura de Internacionalização (i18n)

O sistema possui uma arquitetura de internacionalização de duas camadas ("dual-layer i18n") que separa os textos da interface de usuário (UI) dos textos de dados de jogo. O idioma "raiz" ou "fallback" do sistema é sempre o **Inglês**.

### 1. Interface de Usuário (UI Strings)

Textos que fazem parte do "esqueleto" do aplicativo (como botões, cabeçalhos de painéis, menus) são gerenciados pelo `react-i18next`.

- **Onde encontrar:** `src/locales/{idioma}/translation.json`
- **Como contribuir:**
  1. Para melhorar uma tradução existente, edite o arquivo `translation.json` do idioma desejado (ex: `src/locales/pt-BR/translation.json`).
  2. Para adicionar um novo idioma, crie uma pasta com o código da língua (ex: `es` para Espanhol) dentro de `src/locales/`, copie a estrutura do `en/translation.json` e traduza os valores.
  3. Você também precisará importar o novo arquivo e adicioná-lo ao objeto de configuração em `src/locales/index.ts`.

### 2. Dados de Jogo (Game Data)

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

## Submetendo suas Alterações

1. Faça um *fork* do repositório.
2. Crie uma branch para a sua alteração (`git checkout -b minha-traducao`).
3. Faça o *commit* detalhando o que foi feito (`git commit -m 'Add Spanish translation'`).
4. Envie para o GitHub e abra um **Pull Request**.

Qualquer dúvida, abra as *Issues* do projeto. Agradecemos sua ajuda!
