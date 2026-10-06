# Documentação

## Organização

| Local | Conteúdo |
| --- | --- |
| `development/` | Arquitetura, contratos de cálculo e regras de autoria da biblioteca |
| `guides/` | Guias das funcionalidades e seus comportamentos atuais |
| `releases/` | Histórico de versões e agrupamento de commits |
| `sources/` | Material original de consulta de regras |
| [Pendências](PENDENCIAS.md) | Trabalho aberto e decisões de planejamento, centralizados na raiz |

## Desenvolvimento

| Documento | Escopo |
| --- | --- |
| [README](../README.md) | Produto, desenvolvimento local e persistência |
| [Arquitetura](development/ARCHITECTURE_REFINED.md) | Limites de módulos, fluxos de dados e compatibilidade |
| [Referência de campos](../MM3E_CHARACTER_SHEET_REFERENCE.md) | Mapeamento da ficha para o modelo atual |
| [Regras de cálculo](development/REGRAS_CALCULO_MM3E.md) | Preços, arredondamentos, contextos e resumo canônico |
| [Regras da biblioteca](development/power-library-rules.md) | Autoria de receitas, divergências editoriais e definições legadas |
| [Contribuição](../CONTRIBUTING.md) | Código, dados, traduções e revisão |
| [Testes](../src/__tests__/README.md) | Execução, regressões e verificações de exportação |
| [Pendências](PENDENCIAS.md) | Backlog ativo, limitações e decisões abertas |

## Funcionalidades

| Guia | Escopo |
| --- | --- |
| [Criação de personagens](guides/character-creation.md) | Ficha limpa, arquétipos, escolhas, prévia e compatibilidade |
| [Política de modificadores](guides/power-builder-modifier-policy.md) | Origem, aplicações repetidas, diagnósticos e salvamento |
| [Biblioteca de poderes](guides/power-library.md) | Catálogo, poderes locais, modelos pessoais, políticas de graduação e backup |
| [Recursos](guides/resources.md) | PP/EP, vínculos, contexto do Builder, revisão e recuperação |
| [Campanha](guides/campaign-mode.md) | Base fixa, histórico, migração e backups |
| [Referências](guides/references.md) | Fontes, busca, tabelas e preferências de medidas |
| [Retratos](guides/character-portraits.md) | URL, arquivos locais, enquadramento e exportação |
| [Modificadores de traços](guides/trait-modifiers.md) | Circunstâncias, aprimoramentos, destinos, uso e compatibilidade |
| [Rolagens](guides/dice-roller.md) | Bônus contextuais e histórico temporário |
| [Temas](guides/custom-themes.md) | Paleta personalizada, notações de cor e persistência |

## Versões e fontes

[CHANGELOG.md](../CHANGELOG.md) mantém as notas de versão;
[Histórico de versões](releases/version-history.md) agrupa os commits e distingue tags
de publicação. Trabalho ainda aberto pertence somente a Pendências; remova os
itens concluídos e atualize o guia do comportamento atual.

Os documentos locais em `sources/`, ignorados pelo Git, são fontes de consulta para regras, sujeitos aos
direitos dos titulares. Não são planos de implementação nem especificações do
formato JSON do aplicativo.
