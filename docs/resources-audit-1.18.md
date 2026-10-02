# Auditoria de Resources para a versão 1.18.0

Auditoria realizada em 2026-10-02 sobre a versão **1.17.0**, commit `553de6b`.
Este documento registra o comportamento atual e o escopo recomendado de correção.
As correções abaixo ainda não foram implementadas; a versão do aplicativo continua 1.17.0.

## Conclusão

O sistema reutiliza corretamente o motor de custos de poderes em vários casos,
mas **Resources ainda não está integralmente de acordo com as regras oficiais**.
O Power Builder permite editar e salvar os sistemas, porém sua adaptação usa o
personagem ativo como contexto para todos os tipos de recurso. Isso produz custos
e perfis incorretos em veículos e não contempla as regras específicas de bases.
Há também falhas de persistência que devem ser corrigidas antes da atualização.

## Fonte e regras verificadas

A referência utilizada foi o [Hero's Handbook Deluxe fornecido no projeto](./sources/Mutants%20%26%20Masterminds%203%20-%20Heros%20Handbook%20Deluxe.md).
As páginas abaixo são as páginas impressas do livro, não as linhas do Markdown.

| Assunto | Regra oficial | Referência |
| --- | --- | --- |
| Vantagem Equipamento | Cada graduação fornece 5 pontos de equipamento (EP). | p. 135, Equipment |
| Dispositivos | São poderes comprados com PP; normalmente usam Removable. O mestre decide quando um item é dispositivo ou equipamento. | pp. 209–212, Devices |
| Equipamento | Os efeitos determinam seu custo em EP, pago com a vantagem Equipamento. Equipamento é limitado pela disponibilidade tecnológica da série. | pp. 213–214, Equipment |
| Equipamento alternativo | Coleções de itens ou funções utilizáveis uma por vez podem usar Alternate Equipment. | p. 213, Alternate Equipment |
| Veículos | Tamanho fornece os valores básicos de Força, Resistência e Defesa; aumentos de Força e Resistência custam 1 EP por graduação, e o tamanho custa 1 por categoria acima de Médio. | pp. 221–222 |
| Movimento de veículos | Compra o efeito de movimento adequado pelo custo normal. Voo custa 2 por graduação. Modos adicionais podem ser efeitos alternativos. | pp. 221–222; p. 161, Flight |
| Sistemas de veículos | Efeitos de poder têm seu custo normal, pago em EP. | p. 222, Powers |
| Veículos alternativos | Custo do veículo mais caro + 1 EP por veículo adicional de custo igual ou inferior. | p. 223 |
| Bases | Pequeno e Resistência 6 são os valores iniciais. Cada categoria de tamanho custa 1 EP; categorias inferiores concedem créditos. +2 Resistência custa 1 EP e cada característica custa 1 EP. | p. 226 |
| NP de bases | Para jogadores, corresponde ao NP da série. Para NPCs pode ser definido pelo mestre. | p. 226, Power Level |
| Efeitos de bases | Uma característica pode fornecer um efeito adequado com aprovação do mestre. O custo do efeito não pode superar 2×NP da base, e os limites de NP também se aplicam. | p. 228, Effect |
| Sistema de defesa de bases | Efeito de ataque com custo até 2×NP; bônus de ataque igual ao NP da base. | p. 227, Defense System |
| Compartilhamento | Integrantes podem dividir o custo de veículos e bases em EP conforme combinado. | pp. 223 e 230 |
| Bases alternativas | Base mais cara + 1 EP por adicional. Uma base compartilhada é paga separadamente das bases pessoais. | p. 230 |

As fórmulas normativas foram priorizadas nas verificações. A tabela de veículos
da p. 224 tem exemplos cujos valores de Defesa/custo não coincidem perfeitamente
com as bases da p. 222; não se deve corrigir o motor para reproduzir cegamente
cada uma dessas combinações. Os exemplos consistentes e a regra textual devem
servir de referência, registrando as divergências editoriais quando necessário.

## Problemas confirmados

### 1. Risco de desaparecimento e sobrescrita da biblioteca — prioridade alta

Em [ResourcesView.tsx](../src/features/resources/ResourcesView.tsx), o campo livre
de características aceita `Alarme x0`, cria `ranks: 0` e permite salvar. Na carga
seguinte, o schema exige graduação mínima 1 e
[loadResourceLibrary](../src/services/storage/resourceLibraryStorage.ts) retorna
uma biblioteca vazia quando **qualquer item** é inválido.

Reproduzido pela interface: uma biblioteca com um veículo válido e uma base passou
a aparecer inteiramente vazia após salvar `Alarme x0` e recarregar. Nesse instante
os dados brutos ainda existem no armazenamento; uma escrita subsequente a partir
do estado vazio pode sobrescrever toda a biblioteca. Não há diagnóstico visível
nem recuperação por item nessa carga.

Além disso, o schema dos poderes dos recursos verifica somente `id` e `name`.
Uma importação contendo um poder sem `components` é aceita e lança uma exceção
ao calcular seu custo. O schema completo dos poderes da ficha não valida esse
apêndice: `CharacterFileSchema` aceita o apêndice como `unknown`.

**Correção:** validar a estrutura completa antes de persistir/importar; preservar
o conteúdo original quando a leitura falhar; separar itens recuperáveis de itens
com erro e comunicar a falha; impedir que uma carga inválida vire uma escrita
vazia. Campos ainda não reconhecidos devem ser preservados para compatibilidade.

### 2. Falha ao salvar não impede atualização em memória — prioridade alta

[resourcesStore.ts](../src/store/resourcesStore.ts) ignora o resultado de
`saveResourceLibrary` em criar, editar, remover, desfazer e refazer. A interface
pode indicar uma alteração concluída mesmo quando o armazenamento recusa a
gravação. A alteração desaparece ao recarregar.

Foi reproduzida uma recusa de gravação em teste isolado: `addResource` acrescentou
o recurso em memória apesar da falha. Os caminhos `replaceResources` e
`upsertResources` já verificam esse retorno, mas os outros não.

**Correção:** todas as mutações devem confirmar a gravação antes de publicar o novo
estado e fechar o editor. Exibir uma mensagem de erro e conservar a edição atual.

### 3. Dispositivos são cobrados como equipamento — prioridade alta

A categoria `gadget`, traduzida como **Dispositivo**, usa o mesmo custo em EP de
Gear e Custom. O resumo de PP inclui somente os poderes de `character.powers`.
Todos os recursos abrem o Builder com `equipmentMode`, ocultando Removable.
As defesas também tratam dispositivos como equipamento comum.

Exemplo reproduzido: um dispositivo com efeito de 10 PP e Removable deveria
custar 8 PP. Atualmente consome 10 EP; com Equipamento 2, apenas os 2 PP da vantagem
entram no total gasto. Seu custo de dispositivo não entra nos PP da ficha.

**Correção:** explicitar a forma de aquisição/cobrança, distinguir dispositivos
em PP de equipamento em EP e aplicar o Builder, Removable e as regras de bônus
correspondentes. Recursos recebidos sem custo por decisão do mestre continuam
possíveis. A classificação é uma decisão do jogador/mestre, não uma lista rígida
de efeitos permitidos.

### 4. Contexto errado no Builder e nos efeitos direcionados de veículos — prioridade alta

O Builder lê Força e NP de `useActiveCharacter`, mesmo ao editar sistemas de
veículos. O custo final do veículo, porém, usa a Força do próprio veículo.
[offenseSummary.ts](../src/shared/lib/offenseSummary.ts) também gera os perfis dos
sistemas usando os atributos do personagem.

Exemplo reproduzido em teste e na interface: personagem com Força 0, veículo com
Força 8, Dano 5 baseado em Força e Increased Range. O Builder mostra **10 EP**;
o sistema custa **18 EP** no veículo, que totaliza 20 EP incluindo tamanho Enorme.
Na ficha, o perfil é derivado como Dano 5, quando deveria apresentar Dano 13.

**Correção:** passar um contexto explícito de recurso ao Builder e à derivação dos
perfis, com a origem da Força e o contexto de ataque identificados. Ataques usados
pelo personagem podem usar sua perícia; sistemas autônomos de uma base usam a
regra específica de seu NP. Preservar o nome do sistema e o nome do recurso, pois
hoje a derivação substitui o nome de todos os sistemas pelo nome do recurso.

### 5. Velocidade genérica não representa corretamente voo e outros movimentos — prioridade alta

`getVehicleResourceCost` cobra diretamente o inteiro `speed`, a 1 EP por graduação.
O editor não identifica se esse movimento é Speed, Flight, Swimming ou outro efeito.

Um veículo Enorme com características básicas e movimento de graduação 7 custa
9 EP nesse campo. Com Flight 7, a regra resulta em 16 EP: 2 de tamanho + 14 de voo.
É possível representar voo como sistema separado e deixar `speed` em zero, mas
esse contorno não torna o campo genérico correto e facilita cobrança duplicada.

**Correção:** representar movimento por efeitos, com modo, graduação e custo
explícitos. Reutilizar o Builder para modificadores, múltiplos modos e alternativos.
Na migração, o antigo número não informa o modo pretendido; não inferir voo pelo
nome do veículo nem converter silenciosamente um sistema já existente.

### 6. Recursos alternativos e compartilhados estão incompletos — prioridade média

`alternateSetId` é persistido, mas ignorado no cálculo e não possui controle na
interface. Dois veículos de 8 e 6 EP são cobrados como 14 EP mesmo com o mesmo
grupo alternativo; o custo correto do grupo é 9 EP.

`contributionEP` é respeitado no total, mas não pode ser configurado pela interface.
Vincular um mesmo veículo ou base a vários personagens cobra o custo integral de
cada um por padrão. A existência de vários vínculos não deve, por si só, inferir
como os jogadores desejaram dividir o custo.

**Correção:** permitir configurar contribuição e grupos alternativos, com custo
integral, parcela e custo cobrado identificados. Aplicar a exceção de bases
compartilhadas, pagas separadamente das bases pessoais. Informar diferenças na
soma das contribuições locais, sem assumir que todos os integrantes da campanha
estão presentes no navegador ou impor bloqueios.

### 7. Bases não recebem os avisos específicos de NP/custo — prioridade média

Cobrar 1 EP por efeito de base é compatível com a característica Effect. O problema
é que o custo de poder e os limites desse efeito não são avaliados no contexto da
base. Não há NP próprio armazenado nem aviso de custo máximo 2×NP.

Exemplo reproduzido: Healing 30 custa 60 PP, mas a base recebe esse efeito por 1 EP
sem diagnóstico do limite de 20 PP de uma base NP 10. No Builder, efeitos de
ataque podem receber avisos genéricos do personagem ativo; isso não cobre a regra
de custo da característica Effect nem o ataque automático de Defense System.

**Correção:** explicitar NP da base, tipo da característica e alvo do efeito
(base, ocupantes ou ambos). Mostrar o custo em PP usado na comparação com 2×NP e
o custo em EP da característica. Para Defense System, derivar o bônus de ataque
a partir do NP. Os diagnósticos devem orientar o jogador, preservando a política
existente de liberdade para Extras/Flaws e sem novos impedimentos genéricos de uso.

### 8. Editar características e tamanho perde informações — prioridade média

O editor converte as características inteiras para texto e reconstrói todas elas
ao digitar. Isso recria IDs e descarta `notes`, inclusive de recursos importados.
O cartão também não mostra a lista de características.

Alterar o tamanho do veículo substitui Força, Defesa e Resistência pelas bases do
novo tamanho, descartando os aumentos comprados anteriormente no rascunho.

**Correção:** edição estruturada com nome, graduação e notas, preservando os IDs.
Ao mudar tamanho, preservar aumentos sobre os valores básicos e informar como
os novos valores foram obtidos. Mostrar características e resumo do custo no cartão.

### 9. Importar uma atualização de recurso conserva silenciosamente a cópia antiga — prioridade média

`upsertResources` só acrescenta IDs ausentes. Uma ficha importada com um recurso
mais recente, mas de UUID já conhecido, continua usando a versão local anterior
sem avisar. Um teste com atualização de nome e Força confirmou esse comportamento.
Apêndices inválidos também podem ser descartados como uma lista vazia enquanto a
ficha é importada com referências sem recurso.

**Correção:** comparar conteúdos, explicar conflitos e oferecer manter a cópia
local, atualizar a biblioteca compartilhada ou importar uma cópia independente
remapeando os vínculos da ficha recebida. Preservar backups e evitar importar
referências quebradas sem informação clara ao usuário.

## O que está funcionando

- A vantagem Equipamento fornece 5 EP por graduação no resumo compartilhado.
- Os valores básicos e os custos incrementais de tamanho, Força e Resistência de
  veículos seguem a tabela normativa da p. 222.
- O cálculo de tamanho e Resistência de bases corresponde à p. 226; tamanho
  abaixo de Pequeno fornece créditos para características.
- Efeitos comuns, Extras/Flaws, efeitos Linked e alternativos internos reutilizam
  o motor de poderes, incluindo custo em EP sem desconto Removable no equipamento.
- Na interface, abrir e salvar um sistema já existente funcionou e preservou seu
  custo final quando nenhum campo foi alterado.
- `isFree` mantém o recurso visível e retira seu custo; `contributionEP` já é
  aplicado quando está presente nos dados.
- Resistência de veículos/bases não é aplicada automaticamente ao personagem;
  equipamento comum usa a regra de não acumular seus bônus de proteção.
- A migração anterior de equipamento mantém IDs derivados estáveis e possui testes.

Esses resultados não equivalem à aprovação de todas as combinações de efeitos,
todos os formatos de arquivo ou todos os exemplos editoriais do livro.

## Escopo recomendado para implementação em commits lógicos

1. **Persistência e importação:** validar poderes e características, impedir perdas
   na carga/gravação, preservar dados recuperáveis e resolver conflitos de UUID.
2. **Modelo e migração compatível:** versionar Resources, criar backup antes de
   alterações, preservar IDs, notas e vínculos; separar a forma de cobrança e
   armazenar o contexto necessário de movimento/NP. Recursos antigos classificados
   como Dispositivo precisam de revisão, pois o rótulo não prova que o usuário
   pretendia pagar PP em vez de EP. Apresentar o custo anterior e o novo nessa revisão.
3. **Custos canônicos:** distinguir PP/EP, calcular movimentos, grupos alternativos
   e contribuições; disponibilizar o mesmo detalhamento para ficha e exportações.
4. **Power Builder de recursos:** contexto explícito de Força/NP, unidades corretas,
   Removable para dispositivos e avisos específicos de bases. Corrigir também os
   perfis direcionados e seus nomes/origens.
5. **Interface de Resources:** características estruturadas, mudança de tamanho
   que preserve aumentos, custo detalhado, seleção ordenada, contribuições e grupos
   alternativos sem tornar obrigatórios campos que não se aplicam ao recurso.
6. **Regressões e versão:** testar exemplos normativos, migração idempotente,
   recuperação de dados, falhas de armazenamento, conflitos de importação e
   concordância dos valores entre Builder, ficha, PDF e Excel; atualizar documentação,
   changelog e metadados da 1.18.0 somente após concluir essas etapas.

Não duplicar poderes de dispositivos dentro de `character.powers`: o resumo deve
computar os vínculos conforme a forma de cobrança, mantendo uma origem única.
Não eliminar recursos ou reescrever escolhas ambíguas durante a migração.
Manter a liberdade já estabelecida para modificadores genéricos; a restrição de
seleção continua sendo apenas a dos modificadores específicos aos respectivos poderes.

## Verificação executada

- **64 arquivos / 792 testes existentes passaram.**
- TypeScript e lint passaram.
- **13 verificações temporárias de auditoria passaram**, incluindo reprodução de
  comportamentos incorretos. São observações do estado atual, não 13 aprovações
  de conformidade. Dois casos confirmaram cálculos corretos: ônibus de 8 EP e base
  Média com Resistência 10 e três características, total de 6 EP.
- Interface testada em origem local isolada (`127.0.0.1:5184`), com um rascunho
  sintético de um personagem, um veículo e uma base. Nenhuma ficha real foi editada.
- Evidências locais: [Builder com contexto incorreto](../tmp/pdfs/resources-builder-audit.png)
  e [biblioteca vazia após característica inválida](../tmp/pdfs/resources-library-audit.png).
  Esses arquivos e os diagnósticos temporários estão fora do conteúdo versionado.

Esta auditoria não alterou regras, dados de fichas ou metadados de versão do produto.
