# REGRAS DE CÁLCULO E LÓGICA - MUTANTS & MASTERMINDS 3E

## 1. REGRAS DE CÁLCULO DE CUSTOS (POWER POINTS)

### 1.1 Custos Básicos de Traits

#### Habilidades (Abilities)
- **Custo**: 2 power points por rank
- **Fórmula**: `cost = rank * 2`
- **Range**: -5 a 20 (0 = média humana, 7 = pico humano, 20 = cósmico)
- **Referência**: Hero's Handbook p.107

#### Skills
- **Custo**: 1 power point por 2 skill ranks
- **Fórmula**: `cost = skill_ranks / 2` (arredondar para cima)
- **Skill Check**: `d20 + skill_rank + ability_modifier + misc_modifiers`
- **Referência**: Hero's Handbook p.113, Skills p.38-39

#### Advantages
- **Custo**: 1 power point por rank
- **Fórmula**: `cost = advantage_rank * 1`
- **Referência**: Hero's Handbook p.131, Advantages p.8

#### Powers (Effects)
- **Custo Base**: Varia por efeito (1-5 points per rank)
- **Custo Final**: `base_cost + extras - flaws` (por rank)
- **Referência**: Powers p.143

### 1.2 Custos de Power Effects Específicos

```
Affliction: 1 point/rank
Burrowing: 1 point/rank
Communication: 4 points/rank
Comprehend: 2 points/rank
Concealment: 2 points/rank (4 para visual)
Create: 2 points/rank
Damage: 1 point/rank
Deflect: 1 point/rank
Elongation: 1 point/rank
Enhanced Trait: custo da trait base
Environment: 1-2 points/rank
Extra Limbs: 1 point/rank
Feature: 1 point/rank
Flight: 2 points/rank
Growth: 2 points/rank
Healing: 2 points/rank
Illusion: 1-5 points/rank (depende dos sentidos)
Immortality: 2 points/rank
Immunity: 1 point/rank (varia por escopo)
Insubstantial: 5 points/rank
Leaping: 1 point/rank
Luck Control: 3 points/rank
Mind Reading: 2 points/rank
Morph: varia
Move Object: 2 points/rank
Movement: varia
Nullify: 1 point/rank
Protection: 1 point/rank
Quickness: 1 point/rank
Regeneration: 1 point/rank
Remote Sensing: 1-2 points/rank
Senses: varia
Shrinking: 1 point/rank
Speed: 1 point/rank
Summon: 2 points/rank
Swimming: 1 point/rank
Teleport: 2 points/rank
Transform: 2 points/rank
Variable: 7 points/rank
Weaken: 1 point/rank
```

**Referência**: Powers chapter, páginas 149-186

## 2. REGRAS DE MODIFICADORES (EXTRAS E FLAWS)

### 2.1 Fórmula de Custo Modificado

```
Modified Cost = (base_cost + sum(extras) - sum(flaws)) per rank
```

### 2.2 Custos Fracionários

Quando flaws reduzem o custo abaixo de 1 PP/rank:
- Custo pode ser expresso como ratio PP:Rank
- Exemplo: custo 0 = 1:1, custo -1 = 1:2, custo -2 = 1:3
- **Limite sugerido**: 1:5 (5 ranks por power point)
- **Referência**: Modifiers p.187

### 2.3 Modificadores Parciais

- Modificador pode aplicar a apenas alguns ranks
- Custo modificado aplica apenas aos ranks afetados
- **Exemplo**: Damage 7 com Area nos primeiros 4 ranks
  - Ranks 1-4: custo 3/rank (2 base + 1 Area)
  - Ranks 5-7: custo 2/rank (base)
- **Referência**: Modifiers p.187

### 2.4 Modificadores Flat-Value

- Aplicados ao custo FINAL após calcular ranks
- **Fórmula**: `final_cost = (rank_cost * ranks) + flat_extras - flat_flaws`
- Flat flaw não pode reduzir custo abaixo de 1 PP
- **Referência**: Modifiers p.187

### 2.5 Extras Principais

```
Accurate: +1 flat/rank (+2 attack per rank)
Affects Corporeal: +1 flat/rank
Affects Insubstantial: +1-2 flat
Affects Objects: +0 ou +1/rank
Affects Others: +0 ou +1/rank
Alternate Effect: +1-2 flat
Alternate Resistance: +0 ou +1/rank
Area: +1/rank
Attack: +0/rank
Contagious: +1/rank
Dimensional: +1-3 flat
Extended Range: +1 flat/rank (dobra distâncias)
Feature: +1 flat/rank
Homing: +1 flat/rank
Impervious: +1/rank
Increased Duration: +1/rank
Increased Mass: +1 flat/rank
Increased Range: +1/rank
Incurable: +1 flat
Indirect: +1-4 flat
Innate: +1 flat
Insidious: +1 flat
Linked: +0 flat
Multiattack: +1/rank
Penetrating: +1 flat/rank
Precise: +1 flat
Reach: +1 flat/rank (+5 feet/rank)
Reaction: +1 ou +3/rank
Reversible: +1 flat
Ricochet: +1 flat/rank
Secondary Effect: +1/rank
Selective: +1/rank
Sleep: +0/rank
Split: +1 flat/rank
Subtle: +1-2 flat
Sustained: +0/rank
Triggered: +1 flat/rank
Variable Descriptor: +1-2 flat
```

**Referência**: Modifiers p.188-197

### 2.6 Flaws Principais

```
Activation: -1 ou -2 flat (move ou standard action)
Check Required: -1 flat/rank (DC 10 + ranks)
Concentration: -1/rank
Diminished Range: -1 flat/rank
Distracting: -1/rank (vulnerable ao usar)
Fades: -1/rank (perde 1 rank por uso)
Feedback: -1/rank
Grab-Based: -1/rank
Inaccurate: -1 flat/rank (-2 attack/rank)
Increased Action: -1 a -3/rank
Limited: -1/rank (metade da efetividade)
Noticeable: -1 flat
Permanent: -1/rank (não pode desligar)
Quirk: -1 flat/rank
Reduced Range: -1 ou -2/rank
Removable: -1 ou -2 por 5 PP (fácil ou normal)
Resistible: -1/rank
Sense-Dependent: -1/rank
Side Effect: -1 ou -2/rank
Tiring: -1/rank (causa fadiga)
Uncontrolled: -1/rank
Unreliable: -1/rank (funciona em 11+ no d20)
```

**Referência**: Modifiers p.197-203

## 3. RESTRIÇÕES E INCOMPATIBILIDADES

### 3.1 Incompatibilidades de Modificadores

- **Permanent effects**: não podem ter Alternate Effects
- **Alternate Effects**: não podem ser Permanent
- **Sensory effects**: já são Sense-Dependent (não pode aplicar flaw)
- **Personal range**: precisa Affects Others ou Attack para ter Area
- **Linked effects**: devem ter mesmo range
- **Alternate Effects**: não podem ser usados simultaneamente
- **Referência**: Modifiers p.188, 200

### 3.2 Limitações de Power Level (PL)

#### Limites de Ataque e Efeito
```
attack_bonus + effect_rank ≤ PL * 2
```

#### Limites de Defesa Ativa
```
dodge_bonus ≤ PL
parry_bonus ≤ PL
```

#### Limites de Defesa e Toughness
```
defense + toughness ≤ PL * 2
```

#### Limites de Skills
- Skill rank máximo = PL + 10
- **Referência**: Hero's Handbook p.24-26

### 3.3 Restrições de Efeitos Específicos

#### Affliction
- Condições devem ser escolhidas na criação
- Graus superiores substituem (não acumulam) graus inferiores
- Resistência: Fortitude ou Will (escolher na criação)
- **Referência**: Powers p.149-150

#### Alternate Effect
- Custo total não pode exceder efeito primário
- Todos na array são mutuamente exclusivos
- Trocar entre alternates = free action (1x por turno)
- **Referência**: Modifiers p.188-190

#### Create
- Volume máximo = rank do efeito
- Toughness do objeto = rank do efeito
- Objetos são estacionários (exceto com Movable)
- **Referência**: Powers p.154

#### Damage
- Strength-based Damage adiciona Strength rank
- Negative Strength subtrai de Damage
- **Referência**: Powers p.156

#### Duplication
- Rank necessário = (power_points / 15) arredondado para cima
- Duplicata é minion com mesmos traits
- **Referência**: Powers p.156

#### Growth
- +1 Str e Sta por rank
- +1 Intimidation a cada 2 ranks
- -1 Stealth por rank
- -1 Dodge/Parry a cada 2 ranks
- +1 Speed a cada 8 ranks
- +1 size rank a cada 4 ranks
- **Referência**: Powers p.162

#### Immunity
- Custos variam por escopo (1-80 ranks)
- Life Support = 10 ranks
- All Fortitude = 30 ranks
- All Will = 30 ranks
- All Toughness = 80 ranks
- **Referência**: Powers p.165

#### Impervious
- Ignora efeitos com rank ≤ (Impervious_rank / 2)
- Penetrating pode superar Impervious
- **Referência**: Modifiers p.193

#### Multiattack
- Single target: +2 DC com 2 degrees, +5 DC com 3+ degrees
- Multiple targets: -1 attack por alvo
- Não penetra Impervious se já não penetraria
- **Referência**: Modifiers p.195

#### Summon
- Minion tem (rank * 15) power points
- Sujeito a PL limits
- **Referência**: Powers p.181

## 4. REGRAS ESPECIAIS PARA PODERES ESPECÍFICOS

### 4.1 Affliction

#### Resistência
```
DC = 10 + Affliction_rank
Resistance: Fortitude ou Will (escolhido na criação)
```

#### Graus de Falha
- **1 degree**: dazed, entranced, fatigued, hindered, impaired, vulnerable
- **2 degrees**: compelled, defenseless, disabled, exhausted, immobile, prone, stunned
- **3 degrees**: asleep, controlled, incapacitated, paralyzed, transformed, unaware

#### Recovery
- Graus 1-2: resistance check no fim de cada turno
- Grau 3: requer 1 minuto ou ajuda externa (DC 10 + rank)

**Referência**: Powers p.149-150

### 4.2 Damage

#### Resistência
```
DC = 15 + Damage_rank
Resistance: Toughness
```

#### Graus de Falha
- **1 degree**: -1 Toughness (cumulativo)
- **2 degrees**: -1 Toughness + dazed
- **3 degrees**: -1 Toughness + staggered
- **4 degrees**: incapacitated

#### Morte
- Incapacitated + falha = dying
- Dying + falha = dead

#### Recovery
- 1 damage condition por minuto de descanso
- Começa do pior e vai melhorando

**Referência**: Powers p.156-157

### 4.3 Healing

#### Check
```
DC = 10
Cada degree remove 1 damage condition
```

#### Limitações
- Não funciona em alvos sem Stamina
- Falha = esperar 1 minuto ou extra effort
- Pode dar bonus contra disease/poison = rank

**Referência**: Powers p.162-163

### 4.4 Illusion

#### Custo por Sentidos
- 1 sentido: 1 point/rank
- 2 sentidos: 2 points/rank
- 3 sentidos: 3 points/rank
- 4 sentidos: 4 points/rank
- Todos sentidos: 5 points/rank
- Visual conta como 2 sentidos

#### Resistência
```
DC = 10 + Illusion_rank
Check: Insight para detectar
```

#### Volume
- Volume máximo = rank do efeito
- Area extra aumenta em 1 rank por aplicação

**Referência**: Powers p.163-164

### 4.5 Summon

#### Custo do Minion
```
minion_power_points = Summon_rank * 15
```

#### Tipos
- **General**: qualquer tipo de criatura
- **Horde**: múltiplos minions (Progression extra)
- **Heroic**: não é minion (mais caro)

#### Limitações
- Minions não ganham power points
- Minions não têm hero points
- Sujeitos a minion rules (incapacitated em 1 hit)

**Referência**: Powers p.181-183

### 4.6 Weaken

#### Resistência
```
DC = 10 + Weaken_rank
Resistance: Fortitude ou Will
```

#### Efeito
- Reduz trait em (check_result - DC) ranks
- Recovery: 1 rank por turno

#### Variações
- **Broad**: afeta conjunto de traits (+1/rank)
- **Simultaneous**: afeta todos do conjunto ao mesmo tempo (+1/rank)

**Referência**: Powers p.186, Modifiers p.9-13

## 5. REGRAS DE HABILIDADES, VANTAGENS E SKILLS

### 5.1 Abilities

#### Ranks e Modificadores
```
ability_modifier = ability_rank
check = d20 + ability_modifier
```

#### Defenses
```
Dodge = 10 + Agility
Parry = 10 + Fighting
Fortitude = 10 + Stamina
Toughness = 10 + Stamina
Will = 10 + Awareness
```

#### Initiative
```
Initiative = d20 + Agility
```

**Referência**: Hero's Handbook p.107-111

### 5.2 Skills

#### Skill Check
```
check = d20 + skill_rank + ability_modifier + misc_modifiers
```

#### Routine Checks
```
routine_result = skill_bonus + 10
```
- Só funciona se não estiver sob pressão
- Alguns skills não permitem routine checks

#### Untrained
- Alguns skills podem ser usados sem ranks
- Skills marcados "Trained Only" não podem

#### Interaction Skills
- Requerem que alvo possa interagir
- -5 se alvo não pode ouvir/entender
- -5 se alvo tem Int -5
- Não funciona em alvos sem mental abilities

**Referência**: Skills p.113-114

### 5.3 Advantages

#### Combat Advantages
- **Close Attack**: +1 close attack/rank
- **Ranged Attack**: +1 ranged attack/rank
- **Improved Initiative**: +4 initiative/rank
- **Improved Critical**: +1 threat range/rank (max 16-20)
- **Defensive Roll**: +1 Toughness (active defense)/rank

#### Fortune Advantages
- **Luck**: re-roll 1x/session per rank (max PL/2)
- **Ultimate Effort**: gastar hero point = resultado 20

#### Skill Advantages
- **Skill Mastery**: routine checks mesmo sob pressão
- **Jack-of-all-Trades**: usar qualquer skill untrained

**Referência**: Advantages p.131-141

## 6. LIMITES DE POWER LEVEL (PL)

### 6.1 Trade-offs

#### Ataque vs Efeito
```
attack_bonus + effect_rank ≤ PL * 2
```
- Pode trocar +1 attack por +1 effect (e vice-versa)
- Total sempre limitado por PL * 2

#### Defesa vs Toughness
```
defense + toughness ≤ PL * 2
```
- Pode trocar +1 defense por +1 toughness (e vice-versa)
- Total sempre limitado por PL * 2

### 6.2 Limites Absolutos

```
attack_bonus ≤ PL * 2
effect_rank ≤ PL * 2
dodge ≤ PL
parry ≤ PL
fortitude ≤ PL
toughness ≤ PL
will ≤ PL
skill_rank ≤ PL + 10
```

### 6.3 Exceções aos Limites

- **Circumstance bonuses**: não contam para PL
- **Defensive Roll**: conta como active defense
- **Luck advantage**: max rank = PL / 2
- **Minions**: seguem PL limits
- **Summons**: seguem PL limits

**Referência**: Hero's Handbook p.24-26

## 7. REGRAS DE MEDIDAS E PROGRESSÃO

### 7.1 Measurements Table

Cada rank representa aproximadamente o dobro do anterior:

```
Rank -5: 1.5 lb, 1/8 sec, 6 inches, 1/32 cft
Rank 0: 50 lb, 6 sec, 30 feet, 1 cft
Rank 5: 1,600 lb, 4 min, 900 feet, 30 cft
Rank 10: 25 tons, 2 hours, 4 miles, 1,000 cft
Rank 15: 800 tons, 2 days, 120 miles, 32,000 cft
Rank 20: 25 ktons, 2 months, 4,000 miles, 1M cft
```

### 7.2 Fórmulas de Distância

```
Distance_Rank = Time_Rank + Speed_Rank
```

#### Velocidades Base
- Normal human ground speed: rank 0 (30 feet/round)
- Flight rank = speed rank
- Swimming rank = speed rank - 2

**Referência**: Hero's Handbook p.10-11

## 8. REGRAS DE COMBATE E CHECKS

### 8.1 Core Mechanic

```
check = d20 + modifiers
success if check ≥ DC
```

### 8.2 Degrees of Success/Failure

```
degrees = (check_result - DC) / 5 (arredondar para baixo)
```
- Cada 5 pontos = 1 degree
- Degrees determinam intensidade do efeito

### 8.3 Critical Success

- Natural 20 no d20 = critical success
- Aumenta degree of success em +1
- Pode transformar falha em sucesso

### 8.4 Attack Checks

```
attack_check = d20 + attack_bonus
hit if attack_check ≥ target_defense
```

#### Defesas
- Close attacks: vs Parry
- Ranged attacks: vs Dodge

#### Circumstance Modifiers
- Cover: +2 (partial) ou +5 (full)
- Concealment: +2 (partial) ou +5 (total)
- Prone attacker: -5
- Prone target (close): +5 para atacante

**Referência**: Hero's Handbook p.12-16, Action & Adventure p.240-251

## 9. REGRAS DE ARRAYS E ALTERNATE EFFECTS

### 9.1 Custo de Arrays

```
array_cost = primary_effect_cost + (alternate_count * 1)
```
- Efeito primário: custo cheio
- Cada alternate: +1 flat point
- Dynamic alternate: +2 flat points

### 9.2 Restrições de Arrays

- Alternates não podem exceder custo do primário
- Apenas 1 efeito ativo por vez (exceto Dynamic)
- Trocar = free action (1x por turno)
- Se um é nullified, todos são

### 9.3 Dynamic Arrays

```
dynamic_array_cost = primary_cost + 1 + (dynamic_alternates * 2)
```
- Primário dynamic: +1 flat
- Cada alternate dynamic: +2 flat
- Pode dividir points entre múltiplos efeitos
- Total de points usados ≤ array rank

**Referência**: Modifiers p.188-190

## 10. REGRAS DE EQUIPMENT

### 10.1 Custo de Equipment

```
equipment_points = Equipment_advantage_rank * 5
```
- Equipment advantage: 1 PP/rank
- Cada rank = 5 equipment points

### 10.2 Equipment vs Removable

Equipment é essencialmente:
```
Removable (Easily) + outras limitações = -4 per 5 PP
```
- Facilmente removível
- Pode ser danificado
- Pode ser perdido

**Referência**: Advantages p.135, Modifiers p.201-202

## REFERÊNCIAS CRUZADAS

- **Hero's Handbook Deluxe**: Regras básicas, abilities, defenses, PL limits
- **Powers**: Todos os efeitos, custos base, descrições
- **Modifiers**: Extras, flaws, cálculos de custo modificado
- **Skills**: Skill checks, DCs, usos específicos
- **Advantages**: Vantagens de combate, fortune, skill

## NOTAS DE IMPLEMENTAÇÃO

### Validações Críticas
1. Verificar PL limits em todas as traits
2. Validar compatibilidade de modificadores
3. Calcular custos fracionários corretamente
4. Verificar restrições de efeitos específicos
5. Validar arrays e alternate effects

### Cálculos Complexos
1. Modified cost com múltiplos modifiers
2. Dynamic arrays com power point allocation
3. Summon/Duplication com minion points
4. Growth com múltiplos stat changes
5. Measurements table conversions
