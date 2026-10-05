# Histórico de versões e pacotes de commits

Agrupamento reconstruído a partir dos commits e tags do repositório.
Estado de publicação conferido em 2026-10-05.
As versões retroativas identificam o fim de uma atualização completa: não há
uma versão para cada etapa de implementação. O [changelog](../CHANGELOG.md)
descreve o comportamento entregue por cada pacote.

## Critério de agrupamento

- Funcionalidades substanciais recebem uma versão minor; correções e melhorias
  pontuais de conveniência recebem patch. Favoritos integra v1.20.1; a biblioteca
  pessoal de poderes inaugura v1.21.0.
- Implementação, refinamentos, testes e documentação da mesma funcionalidade
  ficam no mesmo pacote, mesmo quando distribuídos em vários commits.
- O intervalo `anterior..final` exclui o commit anterior e inclui o final.
  A contagem usa `git rev-list --count`, incluindo commits de branches integrados.
- As tags são anotadas. Sua data de criação é a data da consolidação; a data
  histórica abaixo é a do commit de conclusão, não uma data de deploy comprovada.
- Tags publicadas anteriormente são preservadas. A numeração do aplicativo
  e o schema das fichas são independentes.

## Tags anteriores preservadas

| Tag | Commit | Data do commit | Atualização registrada |
|---|---|---|---|
| v1.0.0 | `d20af45` | 2026-04-02 | Ficha e funcionalidades iniciais |
| v1.1.0 | `dbda05f` | 2026-04-05 | Exportação para o PDF oficial |
| v1.2.0 | `eff37b6` | 2026-04-05 | Power Builder e efeitos alternativos v2 |
| v1.3.0 | `78467e7` | 2026-05-10 | Validação modular de regras |
| v1.4.0 | `b551b4b` | 2026-05-10 | Auditoria de poderes e modificadores |
| v1.4.1 | `643f9b3` | 2026-05-11 | Correções de exportação |
| v1.5.0 | `ba0dce3` | 2026-05-11 | Carregamento de rascunhos e campos numéricos |
| v1.6.0 | `43078d9` | 2026-05-13 | Interface responsiva |
| v1.7.0 | `6c8a354` | 2026-05-13 | Equipamentos |
| v1.8.0 | `4fdfbb6` | 2026-05-14 | Descritores e modificadores |
| v1.9.0 | `7bcc08a` | 2026-05-14 | Recuperação de rascunhos |
| v1.10.0 | `cf6768e` | 2026-06-13 | Abas de personagens e subtipos de vantagens |

Há uma inconsistência histórica: `eff37b6` (v1.2.0) é ancestral de `dbda05f`
(v1.1.0), com 25 commits entre eles. Portanto, essas duas tags não formam uma
sequência crescente de snapshots. As datas originalmente escritas no changelog
também diferem em alguns casos das datas dos commits e das datas de criação das
tags. A tabela acima registra o que o Git contém; as notas antigas são mantidas
como registros históricos. Nenhuma dessas tags foi movida ou recriada.

As tags `desktop-stable`, `STABLE_WITHOUT_AUTO_SAVE` e `stable-bundle-warning`
são checkpoints de desenvolvimento, não versões de produto.

## Pacotes versionados

| Versão | Data de conclusão | Intervalo de commits | Quantidade | Pacote |
|---|---|---|---:|---|
| v1.11.0 | 2026-08-16 | `cf6768e..e00f847` | 133 | Resources, persistência, arquitetura e exportações |
| v1.12.0 | 2026-08-30 | `e00f847..acc7985` | 16 | Motor de custos, auditoria e novas opções de poderes |
| v1.12.1 | 2026-10-01 | `acc7985..03a74dd` | 4 | Correções de regras e usabilidade da interface |
| v1.13.0 | 2026-10-01 | `03a74dd..2d5d779` | 10 | PDF compacto, prévia e ficha para preenchimento manual |
| v1.13.1 | 2026-10-02 | `2d5d779..abae384` | 2 | Extras e flaws genéricos a critério do jogador |
| v1.14.0 | 2026-10-02 | `abae384..0344af3` | 6 | Rolagens e janela de dados |
| v1.15.0 | 2026-10-02 | `0344af3..v1.15.0` | 9 | Temas personalizados e consolidação das versões |
| v1.16.0 | 2026-10-02 | `v1.15.0..v1.16.0` | 3 | Tooltips e consulta direta das regras de poderes |
| v1.17.0 | 2026-10-02 | `v1.16.0..v1.17.0` | 8 | Overhaul de campanha, migração revisada e traduções |
| v1.18.0 | 2026-10-02 | `v1.17.0..v1.18.0` | 10 | Resources, custos PP/EP, Builder contextual e migração revisada |
| v1.19.0 | 2026-10-03 | `v1.18.0..v1.19.0` | 6 | Referências oficiais, consulta responsiva e atalhos/cópias de recursos |
| v1.20.0 | 2026-10-03 | `v1.19.0..v1.20.0` | 47 | Refinamentos de referências, retratos, Power Builder e biblioteca Power Profiles |
| v1.20.1 | 2026-10-05 | `v1.20.0..v1.20.1` | 43 | Favoritos, ajustes de traits, diagnósticos, compatibilidade e retratos portáveis |
| v1.21.0 | 2026-10-05 | `v1.20.1..v1.21.0` | 12 | Biblioteca pessoal, seleção de destino, retrato 3:4 e consolidação das versões |
| v1.21.1 | 2026-10-05 | `v1.21.0..v1.21.1` | 4 | Preferências de rolagens e cards compactos de perícias/vantagens no mobile |

A v1.11.0 já possuía notas de versão; sua tag faltante aponta para `e00f847`.
As tags v1.12.0 a v1.14.0 apontam para os commits finais indicados na tabela.
A v1.15.0 inclui os oito commits de temas/interface até `a5d051e` e um commit
final que organiza esta documentação e alinha a versão em `package.json` e no
lockfile. Os snapshots anteriores continuam com os metadados de versão que
tinham quando foram criados; o histórico não foi reescrito.

A v1.20.0 aponta para `9fbd77c`, seu commit original de documentação da versão.
A v1.20.1 termina em `121fa6c`, que conclui favoritos antes da implementação da
biblioteca pessoal. A v1.21.0 inclui essa biblioteca e seus refinamentos, com um
commit final que atualiza os metadados do aplicativo. As tags retroativas não
alteram a versão declarada nos snapshots antigos.

## Compatibilidade por pacote

- v1.12.0/v1.12.1 corrigem cálculos e podem alterar totais recalculados sem
  alterar necessariamente o formato dos arquivos.
- v1.13.0 adiciona o PDF compacto e modos de preenchimento. v1.13.1 estabelece
  escolhas genéricas de modificadores sob decisão do jogador/narrador.
- v1.14.0 mantém rolagens apenas na sessão. v1.15.0 mantém temas fora dos dados
  de personagem. v1.16.0 adiciona consultas de regras sem modificar compras.
- v1.17.0 introduz schema 2.1.0 e base fixa de campanha. Campanhas locais antigas
  exigem revisão do NP/PP inicial com backup antes da migração; lançamentos são
  preservados. Não há política legada de orçamento congelada.
- v1.18.0 usa Resource library/apêndice 2 e revisão de cálculo 6. Vínculos de
  personagem e envelope de rascunho permanecem no formato existente. Aquisição,
  movimento e NP ambíguos exigem revisão antes de alterar a cobrança.
- v1.19.0 adiciona consultas de referências sem alterar o schema 2.1.0 vigente
  nesse pacote. A preferência de unidades é separada da ficha.
- v1.20.0 inclui retratos, refinamentos da ficha/Builder e biblioteca Power Profiles.
  Retratos introduzem schema 2.2.0, com URL e encaixe opcionais; bytes locais
  ficam em IndexedDB. Receitas aplicadas usam o modelo normal de poderes e não
  persistem preço editorial ou vínculo vivo ao catálogo.
- v1.20.1 inclui schema 2.3.0, com alvos, ajustes e estado de uso opcionais para
  traits. A revisão de modificadores legados preserva backups; o ZIP transporta
  retratos locais sem alterar esse schema. Favoritos ficam em preferências
  separadas dos personagens.
- v1.21.0 mantém o schema 2.3.0 e os formatos de ficha, rascunho e ZIP. Modelos
  pessoais usam armazenamento e documento próprios, na versão 1; poderes
  aplicados são cópias independentes. O retrato 3:4 altera apenas a apresentação.
- v1.21.1 mantém o schema 2.3.0 e os formatos de exportação. Limite de rolagens
  e persistência opcional do histórico usam preferências locais separadas;
  os ajustes de perícias e vantagens afetam somente o layout mobile.

Os contratos atuais de migração e persistência estão nos guias de
[campanha](campaign-mode.md), [recursos](resources.md),
[retratos](character-portraits.md) e [biblioteca](power-library.md).
Versão do aplicativo e versão do schema são independentes.

## Publicação

As tags até v1.21.0 foram publicadas no remoto. O deploy da v1.21.0 no commit
`92e47a9` foi concluído com sucesso na
[execução 37353537905](https://github.com/GuiMayer/mm3e-builder/actions/runs/37353537905),
incluindo favoritos, biblioteca pessoal e retrato 3:4 com os metadados alinhados.

Pushes para `main` disparam o workflow de publicação. O estado de cada deploy
deve ser conferido nas [execuções do GitHub Actions](https://github.com/GuiMayer/mm3e-builder/actions/workflows/deploy.yml).
Uma tag identifica um pacote de commits; sua existência não comprova deploy
e não cria uma GitHub Release. Criar tags não altera fichas, schemas, migrações
ou commits existentes.

Para conferir um pacote:

```sh
git show v1.13.0 --no-patch
git log --reverse --oneline v1.12.1..v1.13.0
git rev-list --count v1.12.1..v1.13.0
```
