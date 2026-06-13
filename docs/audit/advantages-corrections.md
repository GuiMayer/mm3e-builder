# CORREÇÕES NECESSÁRIAS - VANTAGENS MM3E

**Baseado em:** `advantages-audit-report.md`  
**Arquivo alvo:** `src/data/advantages.json`

---

## PRIORIDADE 1 - CRÍTICA

### 1. Sidekick (linha 53)

**Problema:** Custo de pontos de poder completamente incorreto

**Atual:**
```json
"longDescription": "You have a sidekick, a non-player character built on 5 character points per rank of this advantage. Unlike minions, sidekicks are not merely followers; they are more capable and act as independent characters."
```

**Deveria ser (conforme livro, linha 677):**
```json
"longDescription": "You have another character serving as your partner and aide. Create your sidekick as an independent character with (advantage rank x 5) power points, and subject to the series power level. A sidekick's power point total must be less than yours. Your sidekick is an NPC, but automatically helpful and loyal to you."
```

**Correção:**
- Texto atual está CORRETO (5 pontos)
- O problema estava na análise inicial do auditor
- ✅ **NÃO REQUER CORREÇÃO**

---

### 2. Improved Hold (linha 17)

**Problema:** Penalidade incorreta

**Atual:**
```json
{
  "id": "improved_hold",
  "description": "Better resistance DC for held opponents.",
  "longDescription": "When you successfully restrain an opponent, the DC of the check for the opponent to escape is increased by +2."
}
```

**Deveria ser (conforme livro, linha 475-477):**
```json
{
  "id": "improved_hold",
  "description": "-5 circumstance penalty for opponents to escape.",
  "longDescription": "Your grab attacks are particularly difficult to escape. Opponents you grab suffer a -5 circumstance penalty on checks to escape."
}
```

**Impacto:** Mecânica completamente diferente (+2 DC vs -5 no teste)

---

### 3. Languages (linha 69)

**Problema:** Progressão matemática incorreta

**Atual:**
```json
{
  "id": "languages",
  "description": "Speak additional languages per rank.",
  "longDescription": "You can speak and understand additional languages. Each rank gives you two additional languages. With enough ranks you can speak any terrestrial language."
}
```

**Deveria ser (conforme livro, linha 524-528):**
```json
{
  "id": "languages",
  "description": "Speak additional languages per rank.",
  "longDescription": "You can speak and understand additional languages. With one rank in this advantage, you know an additional language. For each additional rank, you double your additional known languages: two at rank 2, four at rank 3, eight at rank 4, etc. Characters are assumed to be fluent in any languages they know, including being able to read and write in them."
}
```

**Progressão:**
- Rank 1 = 1 idioma adicional
- Rank 2 = 2 idiomas adicionais  
- Rank 3 = 4 idiomas adicionais
- Rank 4 = 8 idiomas adicionais
- Rank 5 = 16 idiomas adicionais
- Rank 6 = 32 idiomas adicionais
- Rank 7 = 64 idiomas adicionais

**Fórmula:** `2^(rank-1)` idiomas adicionais

---

## PRIORIDADE 2 - ALTA

### 4. Beginner's Luck (linha 35)

**Problema:** Três divergências importantes

**Atual:**
```json
{
  "id": "beginners_luck",
  "description": "Spend hero point to gain 5 temporary ranks in a skill.",
  "longDescription": "By spending a hero point, you gain an effective 5 ranks in one skill of your choice you currently have at 0 ranks. These temporary ranks last for one round. This does not grant access to skills requiring training."
}
```

**Deveria ser (conforme livro, linha 186-190):**
```json
{
  "id": "beginners_luck",
  "description": "Spend hero point to gain 5 temporary ranks in a skill.",
  "longDescription": "By spending a hero point, you gain an effective 5 ranks in one skill of your choice you currently have at 4 or fewer ranks, including skills you have no ranks in, even if they can't be used untrained. These temporary skill ranks last for the duration of the scene and grant you their normal benefits."
}
```

**Correções necessárias:**
1. ❌ "0 ranks" → ✅ "4 or fewer ranks"
2. ❌ "one round" → ✅ "duration of the scene"
3. ❌ "does not grant access to skills requiring training" → ✅ "even if they can't be used untrained"

---

### 5. Daze (linha 62)

**Problema:** Opções de resistência limitadas

**Atual:**
```json
{
  "id": "daze",
  "longDescription": "You can use Deception or Intimidation (choose one when you acquire this advantage) to daze an opponent as a standard action. The target makes a Will resistance check (DC = skill check result). Rank 2: the target is stunned instead."
}
```

**Deveria ser (conforme livro, linha 272-281):**
```json
{
  "id": "daze",
  "longDescription": "You can make a Deception or Intimidation check (choose which skill when you acquire the advantage) as a standard action to cause an opponent to hesitate in combat. Make a skill check as a standard action against your target's resistance check (the same skill, Insight, or Will defense, whichever has the highest bonus). If you win, your target is dazed (able to take only a standard action) until the end of your next round. The ability to Daze with Deception and with Intimidation are separate advantages. Take this advantage twice in order to be able to do both."
}
```

**Correções:**
1. Alvo pode usar: mesma skill OU Insight OU Will defense (o melhor)
2. Rank 2 não deveria tornar "stunned" - deveria ser uma segunda instância da vantagem para outra skill
3. Clarificar que é "dazed" (pode fazer ação padrão) não "stunned"

---

## PRIORIDADE 3 - MÉDIA

### 6. Improvised Weapon (linha 21)

**Problema:** Falta informação sobre Close Combat: Unarmed

**Atual:**
```json
{
  "id": "improvised_weapon",
  "longDescription": "You can use improvised close combat weapons — chairs, bottles, trash cans, etc. — without penalty. Each rank adds +1 to their damage bonus, to a maximum equal to your Strength damage bonus."
}
```

**Deveria incluir (conforme livro, linha 500-507):**
```json
{
  "id": "improvised_weapon",
  "longDescription": "When wielding an improvised close combat weapon—anything from a chair to a telephone pole or entire car—you use your Close Combat: Unarmed skill bonus for attack checks with the 'weapon' rather than relying on your general Close Combat skill bonus. Additional ranks in this advantage give you a +1 bonus to Damage with improvised weapons per rank. Your maximum Damage bonus is still limited by power level, as usual."
}
```

**Adicionar:** Informação sobre usar Close Combat: Unarmed skill

---

### 7. Fascinate (linha 63)

**Problema:** Falta menção a Expertise skills

**Atual:**
```json
{
  "id": "fascinate",
  "longDescription": "One of your interaction skills is so effective you can entrance others with it. Choose an interaction skill (Deception, Intimidation, or Persuasion). Make a skill check as a standard action; targets who fail a Will resistance check become entranced."
}
```

**Deveria incluir (conforme livro, linha 366-372):**
```json
{
  "id": "fascinate",
  "longDescription": "One of your interaction skills is so effective you can capture and hold other's attention with it. Choose Deception, Intimidation, or Persuasion when you acquire this advantage. You can also use Fascinate with an appropriate Expertise skill, like musician or singer, at the GM's discretion. Make an interaction skill check as a standard action against your target's opposing check (Insight or Will defense). If you succeed, the target is entranced."
}
```

**Adicionar:** Menção a Expertise skills (musician, singer, etc.) com aprovação do GM

---

### 8. Takedown (linha 30)

**Problema:** Ambiguidade sobre Rank 2

**Atual:**
```json
{
  "id": "takedown",
  "longDescription": "If you render a minion incapacitated with a close attack, you get an immediate extra close attack against another minion within range as a free action. Rank 2: you make the extra attack against any opponent, not just minions."
}
```

**Livro diz (linha 703-717):**
```
A second rank in this advantage allows you to attack non-adjacent minion targets, moving between attacks if necessary to do so. You cannot move more than your total speed in the round, regardless of the number of attacks you make.
```

**Decisão necessária:**
- **Opção A (seguir livro):** Rank 2 permite atacar minions não-adjacentes (com movimento)
- **Opção B (manter sistema):** Rank 2 permite atacar qualquer oponente (não apenas minions)

**Recomendação:** Seguir o livro (Opção A) para conformidade estrita, mas documentar se a Opção B foi uma house rule intencional

---

## RESUMO DE AÇÕES

| Prioridade | Vantagem | Ação | Complexidade |
|------------|----------|------|--------------|
| 🔴 P1 | Sidekick | ~~Nenhuma - já está correto~~ | - |
| 🔴 P1 | Improved Hold | Corrigir descrição e mecânica | Média |
| 🔴 P1 | Languages | Corrigir progressão e descrição | Média |
| 🟠 P2 | Beginner's Luck | Corrigir 3 aspectos da descrição | Alta |
| 🟠 P2 | Daze | Corrigir resistência e rank 2 | Alta |
| 🟡 P3 | Improvised Weapon | Adicionar info Close Combat | Baixa |
| 🟡 P3 | Fascinate | Adicionar info Expertise | Baixa |
| 🟡 P3 | Takedown | Decisão de design necessária | Média |

**Total de correções necessárias:** 7 (descartando Sidekick que já está correto)

---

## PRÓXIMOS PASSOS

1. Revisar e aprovar as correções propostas
2. Aplicar correções no arquivo `src/data/advantages.json`
3. Atualizar traduções pt-BR conforme necessário
4. Executar testes de validação do JSON
5. Documentar quaisquer divergências intencionais (house rules)

---

**Fim do Documento de Correções**