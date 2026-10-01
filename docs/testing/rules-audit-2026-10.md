# Correções da auditoria — 2026-10-01

A auditoria identificou divergências entre custo, perfil de ataque, validação e exportação. Esta revisão usa os mesmos dados efetivos do personagem nesses caminhos, sem alterar o formato dos JSONs nem reescrever fichas salvas. A revisão de cálculo passa a 5 para avisar usuários com fichas existentes.

## Regressões corrigidas

| Caso | Comportamento verificado |
| --- | --- |
| Accurate | Considera NP, habilidade e perícia do personagem; não inventa NP 10 sem contexto nem aplica bônus de ataque a Área. Respeita as configurações de validação. |
| Dano baseado em Força | Dano 5 + Força 5 com Alcance Aumentado custa 15 PP e produz Dano 10; sem o extra custa 5 PP. Ausência/Força negativa não compra graduações extras. Falhas não devolvem o custo da Força natural. |
| Modificadores parciais | Dano 12 com Área em 4 graduações produz Área 4 e ataque direto 12, com limites separados. Formatos antigo e atual de graduações afetadas são aceitos. |
| Equipamentos defensivos | Armadura associada, inclusive gratuita, entra na Resistência. Usa o maior bônus de equipamento ou de poderes/vantagens, sem somar armaduras, ativar alternativos ou transferir defesa de veículos e bases. |
| Resistência Alternativa | Dano conserva CD 15 + graduação ao trocar Toughness por outra defesa. |
| Perícias de combate | `otherBonus`, inclusive negativo, entra em ataques corpo a corpo, à distância e desarmados. |
| Importação | A origem declarada do modificador deve resolver no catálogo correspondente; um marcador inconsistente é rejeitado. |
| Exportações | PDF usa preços, resistência e armadura corrigidos. Um XLSX real é gerado e lido no teste para conferir Resistência, Iniciativa e EP de equipamento legado. |

## Interface e desempenho

- Resumo de PP compartilhado entre consumidores; edições de texto preservam o resultado em cache e mudanças de regras o invalidam.
- Painéis assinam seus próprios campos; custo não percorre cada graduação. O teste com 10 milhões de graduações resulta em somente dois grupos de preço.
- Prévia e diálogo de excedentes do PDF são carregados sob demanda. O arquivo principal passa de aproximadamente 296,83 KB para 270,65 KB antes de compressão; isso não representa uma medição de tempo de abertura.
- Navegação móvel verificada em 360, 390 e 768 pixels, sem transbordamento horizontal da página.
- Modal genérico com semântica de diálogo, contenção/restauração de foco, Escape e bloqueio de rolagem. Seletor de efeitos com listbox acessível e navegação por teclado. Explicações das defesas acessíveis por foco e toque.

## Validação

- 685 testes aprovados em 47 arquivos, incluindo 28 novos casos de regressão.
- Compilação de produção, análise estática e verificação do build estático aprovadas.
- Verificação no navegador: dimensões móveis, foco e Escape no modal, seleção de Dano por teclado e abertura da prévia PDF; nenhum erro ou aviso no console durante esses fluxos.

Esta verificação cobre os casos acima e a suíte existente; não certifica todas as combinações possíveis de regras. O relatório de cobertura de maio de 2026 fica preservado como histórico. Os resultados históricos da auditoria comunitária referem-se à revisão 4 e não foram recalculados nesta correção.
