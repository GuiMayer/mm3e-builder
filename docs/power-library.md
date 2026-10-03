# Biblioteca Power Profiles — v1.20.0

No Power Builder, clique no ícone de quatro quadrados no cabeçalho do efeito
base, componente vinculado ou efeito alternativo. Escolha um dos 39 capítulos,
ou busque pelo nome em português/inglês, sem precisar digitar acentos.

A biblioteca contém 982 receitas e variantes. A prévia permite escolher as
graduações variáveis, mantém as compras fixas do livro e pede escolhas que a
receita deixa em aberto. Os componentes podem ter graduações independentes.
Penetrante/Afeta Corpóreo declarados como compras integrais acompanham a
graduação escolhida; Compras fixas como Homing 2 continuam em 2.

O custo da prévia e do resultado usa o motor normal do aplicativo, incluindo
PP/EP e o contexto do Builder. Não existe preço de receita que substitua o
cálculo. Divergências entre a composição do livro e o total impresso aparecem
na prévia e na [auditoria](testing/power-library-audit.md).

**Aplicar poder** modifica apenas o rascunho do Builder. **Salvar** continua
sendo necessário para guardar o poder. Cancelar ou fechar a biblioteca mantém
o rascunho anterior. O nome existente é preservado, salvo quando vazio ou
quando o usuário escolhe usar o nome da receita. Notas existentes também são
preservadas, com a referência mecânica original acrescentada para condições,
gatilhos e restrições sem campo próprio.

Receitas de array e configurações globais, como Removível/Ativação, exigem o
destino principal; não podem ser inseridas parcialmente dentro de outro AE.
Substituir um componente preserva seus irmãos e os demais alternativos.

Sete entradas são **Apenas referência**: Ghost Form, Undead Form e Construct
Body exigem atributos ausentes do personagem; Friction Blindness, Friction
Muzzle, Blinding Aura e Fifth Wheel of Weyan exigem Aflição Sustentada não
representada pelo modelo atual. A aplicação é bloqueada para impedir carregar
uma receita incompleta. Invocações carregam o efeito, mas a criatura é criada
separadamente. Extras Aprimorados indicam a melhoria comprada sobre um atributo
existente; não modificam automaticamente outro poder da ficha.

Após aplicar, o poder é uma cópia independente no formato atual da ficha.
Nenhuma referência viva ao catálogo, preço editorial ou política de graduação
é gravada no JSON. Não há migração de fichas antigas nem alteração dos custos
anteriores. Cada capítulo é carregado sob demanda.

O Builder aceita aplicações independentes do mesmo extra/flaw. Ao adicioná-lo
novamente, aparece outra entrada, numerada quando houver repetição. Graduações,
graduações afetadas e opções são editadas separadamente; uma observação opcional
identifica a natureza/condição de cada aplicação. Remover uma mantém as demais.
Esse comportamento vale para componentes base, vinculados e alternativos,
inclusive no Builder de recursos. Os avisos existentes continuam presentes;
a escolha de combinação fica com o jogador/narrador e modificadores específicos
continuam limitados ao efeito ao qual pertencem.

`instanceId` é uma identidade opcional da aplicação, sem efeito nos custos.
Fichas antigas não precisam conter esse campo: ele é preparado no rascunho ao
abrir o editor e só é persistido ao salvar. Importação/exportação preservam
todas as aplicações, graduações e opções. Ativação e Removível continuam sendo
configurações globais do poder, com seus controles e cálculos próprios.

Implementação e cobertura: [plano](power-library-plan.md),
[13 lotes de três capítulos](power-library-coverage.md) e
[definições de regras](power-library-rules.md).
