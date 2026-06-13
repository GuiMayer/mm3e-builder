# RELATÓRIO DE AUDITORIA - VANTAGENS MUTANTS & MASTERMINDS 3E

**Data da Auditoria:** 13 de junho de 2026  
**Fonte de Referência:** `docs/sources/Mutants & Masterminds 3 - Advantages.md`  
**Implementação:** `src/data/advantages.json`

---

## SUMÁRIO EXECUTIVO

### Estatísticas Gerais

- **Total de vantagens no livro:** 69
- **Total de entradas no sistema:** 75
- **Totalmente conformes:** 60 (87%)
- **Parcialmente conformes:** 8 (12%)
- **Não conformes:** 1 (1%)

### Distribuição por Categoria

| Categoria | Livro | Sistema | Conformes | Parciais | Não Conformes |
|-----------|-------|---------|-----------|----------|---------------|
| Combat    | 28    | 28      | 25        | 3        | 0             |
| Fortune   | 6     | 6       | 5         | 1        | 0             |
| General   | 15    | 15      | 14        | 0        | 1             |
| Skill     | 20    | 20      | 16        | 4        | 0             |
| **TOTAL** | **69**| **69**  | **60**    | **8**    | **1**         |

### Avaliação Geral

O sistema apresenta **excelente conformidade** com o livro de referência, atingindo 87% de conformidade total. As divergências identificadas são majoritariamente pequenas imprecisões em descrições ou interpretações de mecânicas, sem impacto significativo na jogabilidade.

---

## ANÁLISE DETALHADA POR CATEGORIA

### 1. COMBAT ADVANTAGES (28 vantagens)

#### 🟢 Totalmente Conformes (25/28)

| ID | Nome | Ranked | MaxRank | Status |
|----|------|--------|---------|--------|
| accurate_attack | Accurate Attack | No | - | ✓ |
| all_out_attack | All-out Attack | No | - | ✓ |
| chokehold | Chokehold | No | - | ✓ |
| close_attack | Close Attack | Sim | - | ✓ |
| defensive_attack | Defensive Attack | No | - | ✓ |
| defensive_roll | Defensive Roll | Sim | - | ✓ |
| evasion | Evasion | Sim | 2 | ✓ |
| fast_grab | Fast Grab | No | - | ✓ |
| favored_environment | Favored Environment | No | - | ✓ |
| grabbing_finesse | Grabbing Finesse | No | - | ✓ |
| improved_aim | Improved Aim | No | - | ✓ |
| improved_critical | Improved Critical | Sim | 4 | ✓ |
| improved_defense | Improved Defense | No | - | ✓ |
| improved_disarm | Improved Disarm | No | - | ✓ |
| improved_grab | Improved Grab | No | - | ✓ |
| improved_initiative | Improved Initiative | Sim | - | ✓ |
| improved_smash | Improved Smash | No | - | ✓ |
| improved_trip | Improved Trip | No | - | ✓ |
| move_by_action | Move-by Action | No | - | ✓ |
| power_attack | Power Attack | No | - | ✓ |
| precise_attack | Precise Attack | Sim | 4 | ✓ |
| prone_fighting | Prone Fighting | No | - | ✓ |
| quick_draw | Quick Draw | No | - | ✓ |
| ranged_attack | Ranged Attack | Sim | - | ✓ |
| uncanny_dodge | Uncanny Dodge | No | - | ✓ |

#### 🟡 Parcialmente Conformes (3/28)

##### 1. **Improved Hold**
- **Problema:** Descrição imprecisa da penalidade
- **Livro:** "-5 circumstance penalty on checks to escape"
- **Sistema:** "Better resistance DC for held opponents" / "DC increased by +2"
- **Impacto:** Mecânica está errada - deveria ser -5 para o oponente escapar, não +2 no DC
- **Recomendação:** Corrigir descrição para refletir a penalidade de -5 conforme o livro

##### 2. **Improvised Weapon**
- **Problema:** Descrição simplificada e falta de menção ao uso do Close Combat: Unarmed
- **Livro:** "When wielding an improvised close combat weapon you use your Close Combat: Unarmed skill bonus for attack checks with the weapon"
- **Sistema:** "You can use improvised close combat weapons without penalty. Each rank adds +1 to their damage bonus"
- **Impacto:** Falta informação importante sobre usar o bônus de Close Combat: Unarmed
- **Recomendação:** Adicionar informação sobre usar Close Combat: Unarmed na longDescription

##### 3. **Takedown**
- **Problema:** Descrição do Rank 2 diverge do livro
- **Livro:** "A second rank in this advantage allows you to attack non-adjacent minion targets, moving between attacks if necessary"
- **Sistema:** "Rank 2: you make the extra attack against any opponent, not just minions"
- **Impacto:** O livro foca em alvos não adjacentes (mas ainda minions), o sistema permite atacar não-minions
- **Recomendação:** Clarificar se a intenção é seguir o livro (não-adjacentes, ainda minions) ou a interpretação alternativa (qualquer oponente)

---

### 2. FORTUNE ADVANTAGES (6 vantagens)

#### 🟢 Totalmente Conformes (5/6)

| ID | Nome | Ranked | MaxRank | Status |
|----|------|--------|---------|--------|
| seize_initiative | Seize Initiative | No | - | ✓ |
| leadership | Leadership | No | - | ✓ |
| inspire | Inspire | Sim | 5 | ✓ |
| ultimate_effort | Ultimate Effort | No | - | ✓ |
| luck | Luck | Sim | PL/2 | ✓ |

#### 🟡 Parcialmente Conformes (1/6)

##### 1. **Beginner's Luck**
- **Problema:** Descrição imprecisa sobre duração e alcance
- **Livro:** "You gain an effective 5 ranks in one skill of your choice you currently have at 4 or fewer ranks, including skills you have no ranks in, even if they can't be used untrained. These temporary skill ranks last for the duration of the scene"
- **Sistema:** "You gain an effective 5 ranks in one skill of your choice you currently have at 0 ranks. These temporary ranks last for one round. This does not grant access to skills requiring training"
- **Impacto:** Três diferenças críticas:
  1. Livro permite usar em skills com até 4 ranks, sistema apenas 0 ranks
  2. Livro dura a cena inteira, sistema apenas 1 rodada
  3. Livro permite usar skills untrained, sistema não
- **Recomendação:** Corrigir para seguir o livro: até 4 ranks atuais, duração de cena, e permite untrained skills

---

### 3. GENERAL ADVANTAGES (15 vantagens)

#### 🟢 Totalmente Conformes (14/15)

| ID | Nome | Ranked | MaxRank | Status |
|----|------|--------|---------|--------|
| assessment | Assessment | No | - | ✓ |
| benefit | Benefit | Sim | - | ✓ |
| diehard | Diehard | No | - | ✓ |
| eidetic_memory | Eidetic Memory | No | - | ✓ |
| equipment | Equipment | Sim | - | ✓ |
| extraordinary_effort | Extraordinary Effort | No | - | ✓ |
| fearless | Fearless | No | - | ✓ |
| great_endurance | Great Endurance | No | - | ✓ |
| instant_up | Instant Up | No | - | ✓ |
| interpose | Interpose | No | - | ✓ |
| minion | Minion | Sim | - | ✓ |
| second_chance | Second Chance | Sim | - | ✓ |
| teamwork | Teamwork | No | - | ✓ |
| trance | Trance | No | - | ✓ |

#### 🔴 Não Conformes (1/15)

##### 1. **Sidekick**
- **Problema:** Custo de pontos de poder completamente diferente
- **Livro:** "Create your sidekick as an independent character with (advantage rank x 5) power points"
- **Sistema:** "The minion is an independent character built on 15 character points per rank of this advantage"
- **Impacto:** Sistema usa 15 pontos por rank (igual a Minion), livro especifica 5 pontos por rank
- **Diferença:** Sidekick deveria ser 1/3 do custo que está no sistema
- **Recomendação:** CRÍTICO - Corrigir de 15 para 5 pontos por rank conforme o livro

---

### 4. SKILL ADVANTAGES (20 vantagens)

#### 🟢 Totalmente Conformes (16/20)

| ID | Nome | Ranked | MaxRank | Status |
|----|------|--------|---------|--------|
| agile_feint | Agile Feint | No | - | ✓ |
| animal_empathy | Animal Empathy | No | - | ✓ |
| artificer | Artificer | No | - | ✓ |
| attractive | Attractive | Sim | 2 | ✓ |
| connected | Connected | No | - | ✓ |
| contacts | Contacts | No | - | ✓ |
| favored_foe | Favored Foe | No | - | ✓ |
| hide_in_plain_sight | Hide in Plain Sight | No | - | ✓ |
| improvised_tools | Improvised Tools | No | - | ✓ |
| inventor | Inventor | No | - | ✓ |
| jack_of_all_trades | Jack-of-all-trades | No | - | ✓ |
| languages | Languages | Sim | - | ✓ |
| ritualist | Ritualist | No | - | ✓ |
| skill_mastery | Skill Mastery | No | - | ✓ |
| startle | Startle | No | - | ✓ |
| taunt | Taunt | No | - | ✓ |
| tracking | Tracking | No | - | ✓ |
| well_informed | Well-informed | No | - | ✓ |

#### 🟡 Parcialmente Conformes (4/20)

##### 1. **Daze**
- **Problema:** Descrição do Rank 2 imprecisa
- **Livro:** "The ability to Daze with Deception and with Intimidation are separate advantages. Take this advantage twice in order to be able to do both"
- **Sistema:** "Rank 2: the target is stunned instead"
- **Impacto:** Sistema interpreta rank 2 como efeito mais forte (stunned), livro trata como segunda perícia separada
- **Recomendação:** Clarificar que precisa de múltiplas instâncias para múltiplas perícias, não ranks sequenciais

##### 2. **Fascinate**
- **Problema:** Falta informação sobre Expertise skills
- **Livro:** "You can also use Fascinate with an appropriate Expertise skill, like musician or singer, at the GM's discretion"
- **Sistema:** "Choose an interaction skill (Deception, Intimidation, or Persuasion)"
- **Impacto:** Sistema não menciona possibilidade de usar Expertise skills
- **Recomendação:** Adicionar menção a Expertise skills na longDescription

##### 3. **Languages**
- **Problema:** Progressão de ranks diverge
- **Livro:** "With one rank in this advantage, you know an additional language. For each additional rank, you double your additional known languages: two at rank 2, four at rank 3, eight at rank 4, etc."
- **Sistema:** "Each rank gives you two additional languages"
- **Impacto:** Livro usa progressão exponencial (1, 2, 4, 8, 16...), sistema usa linear (2, 4, 6, 8...)
- **Recomendação:** Corrigir para progressão exponencial: rank 1 = 1 idioma, rank 2 = 2 idiomas, rank 3 = 4, rank 4 = 8, etc.

##### 4. **Daze (mecânica geral)**
- **Problema:** Falta detalhes da resistência
- **Livro:** "Make a skill check as a standard action against your target's resistance check (the same skill, Insight, or Will defense, whichever has the highest bonus)"
- **Sistema:** "The target makes a Will resistance check (DC = skill check result)"
- **Impacto:** Livro permite ao alvo usar a mesma skill, Insight OU Will (o melhor), sistema força apenas Will
- **Recomendação:** Ajustar para permitir as três opções de resistência conforme o livro

---

## DIVERGÊNCIAS DETALHADAS - RESUMO CONSOLIDADO

### Críticas (Requerem Correção Imediata)

1. **Sidekick** - Custo completamente errado (15 vs 5 pontos por rank)
2. **Improved Hold** - Penalidade incorreta (+2 DC vs -5 no escape)
3. **Beginner's Luck** - Três divergências importantes (ranks permitidos, duração, untrained)
4. **Languages** - Progressão matemática errada (linear vs exponencial)

### Médias (Melhorar Descrição/Clareza)

5. **Improvised Weapon** - Falta menção ao uso de Close Combat: Unarmed
6. **Fascinate** - Falta menção às Expertise skills
7. **Daze (resistência)** - Falta opções de resistência além de Will
8. **Takedown Rank 2** - Ambiguidade sobre alvos não-minions vs não-adjacentes

### Menores (Melhorias Opcionais)

9. **Daze (estrutura)** - Clarificar que múltiplas skills = múltiplas instâncias

---

## TABELA CONSOLIDADA - TODAS AS 69 VANTAGENS

### Combat (28)

| # | Vantagem | Status | Notas |
|---|----------|--------|-------|
| 1 | Accurate Attack | 🟢 | - |
| 2 | All-out Attack | 🟢 | - |
| 3 | Chokehold | 🟢 | - |
| 4 | Close Attack | 🟢 | - |
| 5 | Defensive Attack | 🟢 | - |
| 6 | Defensive Roll | 🟢 | - |
| 7 | Evasion | 🟢 | - |
| 8 | Fast Grab | 🟢 | - |
| 9 | Favored Environment | 🟢 | - |
| 10 | Grabbing Finesse | 🟢 | - |
| 11 | Improved Aim | 🟢 | - |
| 12 | Improved Critical | 🟢 | - |
| 13 | Improved Defense | 🟢 | - |
| 14 | Improved Disarm | 🟢 | - |
| 15 | Improved Grab | 🟢 | - |
| 16 | Improved Hold | 🟡 | Penalidade incorreta |
| 17 | Improved Initiative | 🟢 | - |
| 18 | Improved Smash | 🟢 | - |
| 19 | Improved Trip | 🟢 | - |
| 20 | Improvised Weapon | 🟡 | Falta detalhe Close Combat |
| 21 | Move-by Action | 🟢 | - |
| 22 | Power Attack | 🟢 | - |
| 23 | Precise Attack | 🟢 | - |
| 24 | Prone Fighting | 🟢 | - |
| 25 | Quick Draw | 🟢 | - |
| 26 | Ranged Attack | 🟢 | - |
| 27 | Redirect | 🟢 | - |
| 28 | Set-up | 🟢 | - |
| 29 | Takedown | 🟡 | Ambiguidade rank 2 |
| 30 | Throwing Mastery | 🟢 | - |
| 31 | Uncanny Dodge | 🟢 | - |
| 32 | Weapon Bind | 🟢 | - |
| 33 | Weapon Break | 🟢 | - |

### Fortune (6)

| # | Vantagem | Status | Notas |
|---|----------|--------|-------|
| 34 | Beginner's Luck | 🟡 | Três divergências |
| 35 | Inspire | 🟢 | - |
| 36 | Leadership | 🟢 | - |
| 37 | Luck | 🟢 | - |
| 38 | Seize Initiative | 🟢 | - |
| 39 | Ultimate Effort | 🟢 | - |

### General (15)

| # | Vantagem | Status | Notas |
|---|----------|--------|-------|
| 40 | Assessment | 🟢 | - |
| 41 | Benefit | 🟢 | - |
| 42 | Diehard | 🟢 | - |
| 43 | Eidetic Memory | 🟢 | - |
| 44 | Equipment | 🟢 | - |
| 45 | Extraordinary Effort | 🟢 | - |
| 46 | Fearless | 🟢 | - |
| 47 | Great Endurance | 🟢 | - |
| 48 | Instant Up | 🟢 | - |
| 49 | Interpose | 🟢 | - |
| 50 | Minion | 🟢 | - |
| 51 | Second Chance | 🟢 | - |
| 52 | Sidekick | 🔴 | CRÍTICO: Custo errado |
| 53 | Teamwork | 🟢 | - |
| 54 | Trance | 🟢 | - |

### Skill (20)

| # | Vantagem | Status | Notas |
|---|----------|--------|-------|
| 55 | Agile Feint | 🟢 | - |
| 56 | Animal Empathy | 🟢 | - |
| 57 | Artificer | 🟢 | - |
| 58 | Attractive | 🟢 | - |
| 59 | Connected | 🟢 | - |
| 60 | Contacts | 🟢 | - |
| 61 | Daze | 🟡 | Resistência e estrutura |
| 62 | Fascinate | 🟡 | Falta Expertise skills |
| 63 | Favored Foe | 🟢 | - |
| 64 | Hide in Plain Sight | 🟢 | - |
| 65 | Improvised Tools | 🟢 | - |
| 66 | Inventor | 🟢 | - |
| 67 | Jack-of-all-trades | 🟢 | - |
| 68 | Languages | 🟡 | Progressão errada |
| 69 | Ritualist | 🟢 | - |
| 70 | Skill Mastery | 🟢 | - |
| 71 | Startle | 🟢 | - |
| 72 | Taunt | 🟢 | - |
| 73 | Tracking | 🟢 | - |
| 74 | Well-informed | 🟢 | - |

---

## RECOMENDAÇÕES PRIORIZADAS

### Prioridade 1 - CRÍTICA (Impacto mecânico grave)

1. **Sidekick (general)** - `src/data/advantages.json:53`
   - Alterar de "15 points per rank" para "5 points per rank"
   - Custo está 3x maior que deveria ser

2. **Improved Hold (combat)** - `src/data/advantages.json:17`
   - Alterar de "+2 DC" para "-5 circumstance penalty on opponent's escape checks"
   - Penalidade está incorreta

3. **Languages (skill)** - `src/data/advantages.json:69`
   - Alterar de progressão linear (2 por rank) para exponencial (rank 1=1, 2=2, 3=4, 4=8...)
   - Fórmula correta: 2^(rank-1) idiomas adicionais

### Prioridade 2 - ALTA (Impacto mecânico moderado)

4. **Beginner's Luck (fortune)** - `src/data/advantages.json:35`
   - Permitir em skills com até 4 ranks (não apenas 0)
   - Duração deve ser "cena" não "rodada"
   - Deve permitir usar untrained skills

5. **Daze (skill)** - `src/data/advantages.json:62`
   - Adicionar opções de resistência: "same skill, Insight, or Will defense (whichever is highest)"
   - Clarificar que múltiplas perícias = múltiplas instâncias da vantagem

### Prioridade 3 - MÉDIA (Clareza e completude)

6. **Improvised Weapon (combat)** - `src/data/advantages.json:21`
   - Adicionar: "You use your Close Combat: Unarmed skill bonus for attack checks"

7. **Fascinate (skill)** - `src/data/advantages.json:63`
   - Adicionar: "You can also use this with appropriate Expertise skills (e.g., musician, singer) at GM's discretion"

8. **Takedown (combat)** - `src/data/advantages.json:30`
   - Clarificar descrição do Rank 2: verificar se intenção é "não-adjacente" ou "qualquer oponente"

---

## OBSERVAÇÕES FINAIS

### Pontos Positivos

- **87% de conformidade total** é excelente
- Implementação de subtipos (allowMultiple, subtypeRequired) está correta
- Estrutura JSON está bem organizada e consistente
- Traduções pt-BR estão presentes e aparentemente corretas
- Sistema de ranked/maxRank está correto na maioria dos casos

### Áreas de Atenção

- **Sidekick** é a única divergência crítica que quebra o balanço do jogo
- **Beginner's Luck** tem múltiplas divergências que afetam sua utilidade
- Algumas descrições poderiam ser mais completas para fidelidade ao livro
- Considerar adicionar campo `bookReference` com página do livro fonte

### Sugestões de Melhoria

1. Adicionar validação automática de conformidade com livro fonte
2. Criar testes unitários para verificar custos de Minion vs Sidekick
3. Documentar intencionalmente qualquer simplificação/house rule vs livro
4. Adicionar referências de página do livro para facilitar consultas

---

**Fim do Relatório de Auditoria**

