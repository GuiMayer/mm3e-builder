# Verificação dos formatos antes da implementação da 1.18.0

Verificação realizada antes de alterar o código, sobre `553de6b` (1.17.0).

- A ficha usa schema 2.1.0; o rascunho de personagens usa versão 1.
- Poderes modernos usam `components`; poderes antigos ainda podem usar
  `effectId`, `ranks` e `modifiers` diretamente. Ambos têm caminhos de leitura.
- Equipamentos antigos são migrados para recursos Gear com IDs derivados estáveis.
- A ficha já guarda `resourceLinks`, com `isFree`, `contributionEP` e
  `alternateSetId`. Não é necessário substituir esses vínculos ou mover poderes
  de dispositivos para `character.powers`.
- A biblioteca usa versão 1 e os recursos não guardam forma de cobrança, efeito
  de movimento ou NP da base. Essas informações serão acrescentadas nela.
- O modo campanha tem seu próprio modelo e migração; seus dados não fazem parte
  desta mudança.

O navegador conectado não tinha sessões reais abertas e os arquivos de fichas
encontrados no projeto eram artefatos de teste. Portanto, esta verificação cobre
os formatos persistidos, os testes e esses arquivos; não afirma ter inspecionado
o localStorage pessoal de usuários em outros navegadores.

## Decisão de compatibilidade

Manter o schema da ficha e os vínculos existentes. Versionar a biblioteca como 2,
aceitando a versão 1 e seus apêndices antigos. Conservar IDs, notas, poderes e
campos desconhecidos. Antes da primeira escrita de atualização/recuperação,
guardar e verificar uma cópia dos dados brutos originais.

Dispositivos antigos continuam cobrados em EP até revisão da forma de aquisição.
Velocidade antiga continua representando o custo anterior até revisão do modo de
movimento. A interface explicará as opções e os custos. Não inferir a intenção
por nome, não apagar sistemas existentes e não duplicar pontos na ficha.

Recursos inválidos serão preservados separadamente, mantendo os itens válidos
disponíveis e oferecendo exportação dos originais. Falhas de gravação não devem
publicar uma alteração em memória nem fechar o editor.
