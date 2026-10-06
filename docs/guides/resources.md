# Recursos

A biblioteca guarda recursos reutilizáveis; cada ficha mantém seus vínculos, sem
copiar poderes para o personagem. A forma de aquisição define a cobrança:
dispositivos usam PP; equipamento comum, veículos e bases usam EP. O mestre decide
qual classificação é adequada à série.

A referência normativa é o [Hero's Handbook Deluxe fornecido](<../sources/Mutants & Masterminds 3 - Heros Handbook Deluxe.md>),
pp. 135, 209–214, 221–223 e 226–230. Quando exemplos editoriais de veículos
divergem das tabelas normativas, o cálculo usa as tabelas e fórmulas normativas.

## Usar a biblioteca e vincular à ficha

Crie ou edite o recurso na aba **Recursos**, depois use **Adicionar recurso** na
ficha. A seleção e os cartões acompanham a ordem alfabética do idioma ativo.
Na aba **Recursos**, a busca encontra nomes, notas, características, descritores
e efeitos dos poderes, incluindo movimento e efeitos alternativos. A busca ignora
acentos e maiúsculas e reconhece os nomes dos efeitos em português e inglês.
Combine os filtros de **Tipo** e **Forma de aquisição** (PP ou EP) para reduzir a
lista; **Limpar filtros** restaura a visualização completa. Esses controles apenas
filtram a biblioteca e não alteram recursos ou fichas salvas.

O atalho **Criar recurso** na seção de recursos da ficha abre um seletor de tipo
e direciona para **Recursos** com o editor de criação correspondente aberto.
O recurso só é salvo ao confirmar; depois, use **Adicionar recurso** para vinculá-lo.
A biblioteca é compartilhada por todas as fichas deste navegador: editar um
recurso vinculado altera sua apresentação e seus valores nas fichas associadas.

O cartão mostra traços, características, notas, sistemas/efeitos e o custo.
**Custo total** abre o detalhamento. Características têm nome, graduação e notas;
edições preservam seus IDs. Alterar o tamanho de um veículo preserva os aumentos
comprados sobre os valores básicos de Força, Defesa e Resistência.

Na ficha e na biblioteca, o nome do poder, cada efeito e cada modificador abrem
uma referência de regras ao clicar; passar o mouse também mostra a descrição.
Efeitos alternativos, movimento de veículos, sistemas e efeitos de bases usam
essa mesma consulta. O lápis ao lado do poder abre seu Builder; na ficha, o
atalho muda para **Recursos** e abre diretamente o poder selecionado. O lápis
no cabeçalho do recurso abre seus dados gerais. Consultar ou cancelar a edição
não altera a ficha nem o recurso.

**Duplicar recurso** (ícone de cópia no cartão da biblioteca) cria imediatamente
um item independente e abre seus dados para renomear. O nome inicial recebe
**(cópia)** e um número quando necessário. Cancelar essa edição mantém a cópia
já criada. Poderes, componentes, efeitos alternativos e características recebem
IDs novos; notas, modificadores, aquisição e configurações de bases são
preservados. A cópia não é vinculada automaticamente a nenhuma ficha; editar
seus poderes não modifica o original ou os vínculos existentes. Essas ações
não exigem migração nem mudam o formato das fichas ou da biblioteca.

Em **Propriedade e custo**, o vínculo permite marcar um item como gratuito,
definir uma contribuição em EP e atribuir um grupo alternativo. Um dispositivo
não oferece divisão em EP. A informação das contribuições locais considera
somente as fichas abertas; outros integrantes da campanha podem estar ausentes.

## Custos e contexto do Builder

| Recurso | Cobrança e comportamento |
|---|---|
| Dispositivo | Custo do poder em PP, com a opção Removível/Facilmente removível. Entra uma única vez no total de PP; não consome a reserva de EP. |
| Equipamento | Custo do efeito em EP, sem desconto Removível. A vantagem Equipamento fornece 5 EP por graduação. |
| Veículo | Tamanho e aumentos dos traços + características + movimento + sistemas, em EP. O Builder de movimento e de sistemas usa a Força do veículo; o operador fornece os demais atributos de ataque. |
| Base | Tamanho, +2 Resistência por EP, características e 1 EP por característica Efeito/Sistema de defesa. O custo subjacente do efeito é comparado com 2×NP. |
| Item gratuito | Mantém seus efeitos e sua descrição, mas cobra zero na unidade correspondente. |
| Grupo alternativo | Maior custo cobrado + 1 EP por adicional. A ficha guarda a identificação do grupo em seu vínculo. |
| Base compartilhada | Sua contribuição é paga separadamente dos grupos de bases pessoais. |

Em bases, escolha o NP da série ou o valor combinado com o mestre, o tipo da
característica (**Efeito** ou **Sistema de defesa**) e o alvo (**Base**, **Ocupantes**
ou **Ambos**). Sistemas de defesa recebem bônus de ataque igual ao NP da base.
O Builder distingue o custo subjacente em PP do custo de 1 EP da característica.
Os avisos de custo, NP e alvo são orientativos; não impedem salvar.

O movimento de veículos usa um poder completo: efeito, graduações,
Extras/Flaws, Linked e modos alternativos. O movimento configurado substitui o
custo da antiga Velocidade; não é somado a ele. Movimento já presente em sistemas
pode ser indicado durante a revisão para evitar cobrança dupla.

Exemplos de cálculo:

- Efeito de 10 PP com Removível: **8 PP** como dispositivo; **10 EP** como equipamento.
- Veículo Enorme com Voo 7, sem outros aumentos: **2 + 14 = 16 EP**.
- Sistema de Dano 5 baseado em Força, com Alcance aumentado, em veículo FOR 8:
  **18 EP**, graduação efetiva 13, Resistência CD 28.
- Veículos alternativos de 8 e 6 EP: **9 EP** no grupo.
- Base Média, Resistência 10 e três características: **6 EP**.
- Cura 30 em base NP 10: característica de **1 EP**, efeito de **60 PP** e aviso
  sobre o limite de **20 PP**; a decisão permanece com a mesa.

Extras e Flaws genéricos continuam disponíveis conforme a política do jogador.
Apenas modificadores específicos de um poder são restringidos ao próprio efeito.
As mensagens existentes de diagnóstico de modificadores foram preservadas.

## Compatibilidade e revisão de dados antigos

O schema atual da ficha é **2.2.0**; seus vínculos de recursos mantêm o formato
existente. O envelope de rascunho usa versão 1. A biblioteca e o apêndice de
recursos usam versão 2 e aceitam versão 1, inclusive poderes antigos no formato
plano. A compatibilidade é de leitura de dados antigos pela
aplicação nova; exportações da biblioteca v2 exigem uma aplicação que entenda v2.

A mudança acrescenta `costMode`/`costReviewRequired`, `movement`/
`movementReviewRequired` e `powerLevel`/`effectSettings`. Conserva IDs, nomes,
notas, sistemas, poderes, vínculos e extensões desconhecidas dos recursos.
O movimento já configurado é conservado mesmo quando um arquivo contém uma
marcação de revisão desatualizada. Campanha e histórico de PP não são migrados
por esta atualização.

Recursos antigos ambíguos abrem uma revisão depois que o rascunho foi carregado:

- Dispositivo antigo continua em EP até escolher explicitamente sua aquisição.
- Velocidade antiga mantém o custo anterior até revisar seu modo de movimento.
- Base antiga solicita o NP; a proposta inicial vem do personagem ativo e pode
  ser alterada antes de aplicar.
- Cada item mostra o custo antes e depois. **Revisar depois** mantém as escolhas
  antigas; a revisão pode ser retomada pelo aviso na biblioteca.

Antes da primeira atualização/recuperação e antes de uma substituição ou revisão,
a biblioteca original é preservada e conferida em
`mm3e-resources-before-1.18-v1`. Uma cópia já existente não é sobrescrita.
Isso também cobre uma importação que tenha gravado metadados v2 antes da revisão.
A exportação preventiva de atualização inclui os backups locais; restaurar seu
snapshot bruto exige nova revisão pela versão instalada.

Não há cópia automática do poder de um dispositivo para `character.powers`.
Seu custo é derivado do vínculo e contabilizado uma única vez em Poderes/PP.
Os valores podem mudar pelas correções ou por uma escolha revisada, sem apagar
as escolhas da ficha.

## Recuperação e importação

Recursos salvos antes de configurar seu poder podem manter o componente inicial
do Builder (efeito vazio, graduação 1, sem modificadores ou configurações).
Esse estado é aceito na importação de ficha, rascunho e biblioteca, preservando
o recurso e seus vínculos sem reescrever dados. A exceção vale apenas para esse
componente inicial intacto; poderes de personagem, efeitos desconhecidos e
recursos parcialmente configurados continuam sujeitos à validação normal.
Erros nos poderes de recursos identificam o caminho `resources.<índice>`,
incluindo o poder, movimento, sistema ou efeito correspondente.

Um recurso inválido não esconde os válidos. Itens inválidos e UUIDs duplicados
ficam preservados na área `quarantined` da biblioteca, com aviso e exportação do
conteúdo original. Corrija os originais em uma cópia de arquivo antes de importar
uma biblioteca reparada. A aplicação conserva os registros isolados como fonte
de recuperação; não os descarta ao salvar outros itens.

Conteúdo ilegível ou de uma versão desconhecida não é substituído por uma escrita
normal. Uma restauração explícita preserva seus bytes em
`mm3e-resource-recovery-v1`; se essa cópia não puder ser protegida, a ação falha.

Todo comando confirma a gravação antes de publicar a mudança ou mover o histórico.
Falhas mantêm o editor aberto e o estado anterior. Escritas de uma janela com uma
biblioteca desatualizada são recusadas: recarregue para usar a versão atual.
Essa proteção detecta alterações entre operações; localStorage não fornece
transações atômicas entre processos nem sincronização de campanhas.

Ao importar uma ficha com recursos de UUID já conhecido e conteúdo diferente,
escolha **Manter as versões locais**, **Atualizar a biblioteca compartilhada** ou
**Importar cópias independentes**. A atualização compartilhada afeta todos os
vínculos; a cópia remapeia somente os vínculos da ficha recebida. Cancelar mantém
a biblioteca e as fichas. A gravação é adiada até resolver também um eventual
conflito de identidade da ficha. Atualizações/substituições de importação guardam
um backup verificado em `mm3e-resource-library-import-backup-v1`.

Apêndices malformados, UUIDs duplicados e referências ausentes na importação de
ficha são recusados com explicação, antes de gravar. JSON/JSONL transportam os
campos novos. PDF HTML e Excel usam os mesmos custos efetivamente cobrados,
unidades, grupos e contribuições da ficha, além de movimento, características,
notas e contexto da base. O PDF legado conserva seus dez campos de equipamento
com os mesmos custos; continua sujeito aos limites fixos do formulário oficial.
