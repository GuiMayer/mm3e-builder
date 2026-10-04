# Pendências e manutenção

Revisão: 04/10/2026 (v1.20.0).
Este é o ponto central para trabalho ainda aberto. As constatações abaixo vieram
da comparação entre documentação, código e fontes de regras; não constituem
uma certificação completa das regras.

Manter apenas pendências, decisões abertas e limitações relevantes. Quando um
item terminar, removê-lo daqui. Descrever o comportamento resultante no guia
correspondente, sem criar relatório de conclusão, arquivo de auditoria encerrada
ou lista histórica de documentos removidos.

## Pendências confirmadas no código

### P02 — Aflição Sustentada na biblioteca — prioridade média

Friction Blindness, Friction Muzzle, Blinding Aura e Fifth Wheel of Weyan
continuam apenas para consulta. O Handbook define Duração Aumentada como
Instantâneo→Concentração ou Sustentado→Contínuo, e Sustentado genérico como
Permanente→Sustentado. A exceção de Anular não autoriza a mesma transição para
Aflição. O Power Profiles usa Aflição Sustentada nessas quatro receitas, mas
as fontes consultadas não definem uma composição geral com custo inequívoco.

Habilitar essas receitas depende de fundamentar essa definição ou aprovar uma
convenção explícita. Não usar um custo manual nem Sustentado genérico +0 para
forçar a fórmula impressa. A resolução geral de ação/duração está documentada
no [guia de cálculo](REGRAS_CALCULO_MM3E.md).

### P06 — Manutenção do Builder e do menu — prioridade baixa

**Contexto:** o Builder tem aproximadamente 1.551 linhas e o MenuBar 781,
incluindo estilos; já existem funções, hooks e componentes extraídos. O tamanho
sozinho não comprova defeito. Scripts antigos de auditoria/adicionamento de
modificadores não são gates do projeto e podem recriar relatórios superados.

**Escopo:** quando houver evolução nesses fluxos, extrair responsabilidades
concretas, mantendo contratos atuais. Avaliar a retirada dos scripts de uso
único, separadamente da exclusão dos documentos. Não executar scripts antigos
que reescrevem o catálogo para tentar cumprir roadmaps encerrados.

**Critérios de aceite:** mudanças pequenas com testes de regressão relevantes, sem reformular o
domínio ou introduzir infraestrutura por conveniência. Scripts mantidos têm
uso atual, entrada/saída documentadas e não repovoam `docs/` com snapshots.

## Validações adicionais e possibilidades opcionais

Não são compromissos de implementação nem impedimentos para usar a versão atual.

- **QA acessível e toque real:** completar verificação em aparelho com toque,
  leitor de tela e foco/diálogos empilhados. Avaliar automatizar poucos fluxos
  essenciais de navegador; os gates atuais não possuem uma suíte E2E dedicada.
- **Retrato portável:** estudar exportação/importação ZIP com ficha e imagem
  local, preservando JSON leve e o aviso sobre armazenamento no navegador.
- **Templates de recursos e personagens auxiliares:** avaliar demanda por
  itens comuns de equipamento/veículos/bases e fichas vinculadas de invocações,
  minions ou sidekicks. As três receitas que alteram atributos ausentes não
  devem ser liberadas como simples poderes por causa dessa possibilidade.
- **Armazenamento em pasta:** explorar apenas se houver decisão de criar uma
  versão desktop. Contas, backend e sincronização obrigatória continuam fora
  do escopo atual.
