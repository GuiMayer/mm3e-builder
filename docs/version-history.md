# Histórico de versões e pacotes de commits

Reconstruído em 2026-10-02 a partir dos commits e das tags do repositório.
As versões retroativas identificam o fim de uma atualização completa: não há
uma versão para cada etapa de implementação. O [changelog](../CHANGELOG.md)
descreve o comportamento entregue por cada pacote.

## Critério de agrupamento

- Uma funcionalidade nova recebe uma versão minor; correções recebem patch.
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

A v1.11.0 já possuía notas de versão; sua tag faltante aponta para `e00f847`.
As tags v1.12.0 a v1.14.0 apontam para os commits finais indicados na tabela.
A v1.15.0 inclui os oito commits de temas/interface até `a5d051e` e um commit
final que organiza esta documentação e alinha a versão em `package.json` e no
lockfile. Os snapshots anteriores continuam com os metadados de versão que
tinham quando foram criados; o histórico não foi reescrito.

### v1.11.0 — Resources, persistência e exportações

O pacote inclui a evolução do PDF e Excel de junho, a divisão da arquitetura,
histórico por personagem, edição de descritores e Senses, custos e arrays,
Efeitos Direcionados, Resources, transferência JSONL, recuperação de dados,
UUIDs e paginação. As tentativas de exportação que foram revertidas dentro do
intervalo não são apresentadas como funcionalidades entregues. O resultado
final está descrito nas notas existentes da v1.11.0.

### v1.12.0 — Motor de regras e auditoria

- `3ebd4ff`, `e5e52c2`, `5ee8b0c`, `4738f44`: custos contextuais centralizados,
  totais comuns à ficha e às exportações e aviso de revisão de cálculo.
- `fc12169`, `43cea5c`, `512ee37`, `3f27455`: correções auditadas, modificadores
  repetíveis parametrizados, revisão 3 e resistência Impenetrável.
- `2b6388c`, `5af897c`: recálculo reproduzível das 63 fichas e documentação.
- `d34225c`, `a49ee39`, `f935571`, `48ad34f`, `b2b6892`, `acc7985`: habilidades
  ausentes, Dano baseado em Força, alcance/duração, revisão 4 e auditoria dos testes.

### v1.12.1 — Regras e interface

- `a4b788b`: Accurate, Dano baseado em Força, ataques parciais, armadura
  associada, exportações, revisão de cálculo 5 e desempenho da ficha.
- `ef84ac5`: barra superior adaptável a diferentes larguras.
- `0fd321a`: arraste, teclado, destinos e controles móveis do PowerBuilder.
- `03a74dd`: listas ordenadas pelo nome exibido no idioma ativo.

### v1.13.0 — PDF compacto e imprimível

- `d323696`: preservação de detalhes de efeitos alternativos e dispositivos.
- `5fb1888`, `48ba102`: layout A4 compacto, paginação explícita, fontes
  incorporadas e tradução dos rótulos.
- `62a5331`, `f9a77c4`: prévia do PDF exportado, HTML offline e fixture de
  estresse para verificar o layout.
- `a934410`, `199be6c`, `666d4cc`: zoom digitável, botões flutuantes,
  texto selecionável e zoom inicial de 100%.
- `6be5c88`, `2d5d779`: campos vazios e espaço para lápis, modos de conteúdo
  e simplificação das seções opcionais.

### v1.13.1 — Modificadores a critério do jogador

- `a02c025`: extras e flaws genéricos disponíveis para todos os efeitos,
  incluindo Movement e Senses; mensagens de diagnóstico permanecem e
  modificadores específicos continuam restritos ao efeito correspondente.
- `abae384`: documentação dessa política.

### v1.14.0 — Rolagens da sessão

- `10c29bd`, `a4b48a5`, `d10eaa6`: painel inicialmente escondido, d20 manual,
  rolagens contextuais, origem do resultado e histórico apenas da sessão,
  com limite configurável e padrão de 15 resultados.
- `7dbca11`, `2bca94c`: animação da gaveta, botão oculto enquanto aberta,
  restauração de foco e posição padronizada dos botões de rolagem.
- `0344af3`: janela desktop arrastável pelo cabeçalho, com suporte a teclado
  e ajuste de posição ao redimensionar a tela.

### v1.15.0 — Temas personalizados

- `457a09a`, `8e99d9d`, `e94ba35`, `002ba93`, `d2c702d`: paletas semânticas,
  36 papéis de cor, armazenamento local separado, editor, prévia, avisos de
  contraste e aplicação consistente. Tema personalizado só aparece após salvar.
- `e4b2da3`: barra superior e configurações acima da janela de dados.
- `7aa0f56`: editor acompanha o tema ativo; selecionar uma base atualiza
  imediatamente os campos e a prévia.
- `a5d051e`: seletor moderno com react-colorful e colord, entrada HEX/RGB/HSL,
  transparência nos papéis compatíveis e uso por teclado e toque.
- Commit de consolidação: changelog agrupado, catálogo de tags, README e
  metadados da versão atual alinhados em 1.15.0.

### v1.16.0 — Tooltips e consulta de regras

- `0e63c1c`: tooltips posicionadas com Floating UI, largura legível, foco por
  teclado e caixas de referência responsivas para as descrições existentes.
- `d0c823c`: leitura de poderes, efeitos, modificadores e alternativos na ficha,
  com resolução contextual dos modificadores específicos e testes de preservação.
- Commit de versão: documentação, validação completa e metadados em 1.16.0.

Esta versão foi implementada como um novo pacote, após a consolidação retroativa.
As consultas são somente para leitura: não alteram fichas, custos, catálogos,
restrições de modificadores nem as mensagens de aviso.

## Compatibilidade e publicação

Criar tags não altera commits, fichas, schemas ou migrações. As correções de
regras em v1.12.0/v1.12.1 podem mudar totais recalculados; isso é diferente de
alterar o formato dos arquivos. Rolagens e temas não entram nas fichas exportadas.

O alinhamento de `package.json` em 1.16.0 usa o mecanismo já existente de aviso
e backup antes de carregar um rascunho de outra versão. Não foi criada uma
migração nova. A revisão de cálculo permanece 5; o schema de personagem permanece 2.0.0.

As novas tags são criadas localmente. Sua existência não afirma que cada pacote
foi publicado no GitHub, implantado no Pages ou lançado como GitHub Release.
Os links de comparação por tag passam a funcionar no GitHub após o push das tags.

Para conferir um pacote, por exemplo:

```powershell
git show v1.13.0 --no-patch
git log --reverse --oneline v1.12.1..v1.13.0
git rev-list --count v1.12.1..v1.13.0
```
