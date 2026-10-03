import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "animal-crushing-grip",
    "profileId": "animal",
    "name": {
      "en": "Crushing Grip",
      "pt": "Agarrão Esmagador"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Limited — Strength limited to grabs.",
      "pt": "Traço Aprimorado · Limitado — Força limitada a agarrões."
    },
    "page": 16,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Enhanced Strength, Limited to Grabs • 1 point",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Strength, Limited to Grabs"
  },
  {
    "id": "animal-ferocious-charge",
    "profileId": "animal",
    "name": {
      "en": "Ferocious Charge",
      "pt": "Investida Feroz"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Limited — Only while charging; Strength-based damage.",
      "pt": "Dano · Limitado — Apenas durante uma investida; dano baseado em Força."
    },
    "page": 16,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Strength-based Damage, Limited to While Charging • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Strength-based Damage, Limited to While Charging"
  },
  {
    "id": "animal-natural-weapons",
    "profileId": "animal",
    "name": {
      "en": "Natural Weapons",
      "pt": "Armas Naturais"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 16,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Strength-based Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Strength-based Damage"
  },
  {
    "id": "animal-quills",
    "profileId": "animal",
    "name": {
      "en": "Quills",
      "pt": "Espinhos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 16,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "options": {
              "trigger": "When touched"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Reaction Damage (to being touched) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Reaction Damage (to being touched)"
  },
  {
    "id": "animal-shock",
    "profileId": "animal",
    "name": {
      "en": "Shock",
      "pt": "Choque"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative — Dazed, Stunned, Incapacitated; electric shock.",
      "pt": "Aflição · Cumulativo — Atordoado, Aturdido, Incapacitado; choque elétrico."
    },
    "page": 16,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Cumulative Affliction (electric shock; Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Cumulative Affliction (electric shock; Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "animal-terrifying-roar",
    "profileId": "animal",
    "name": {
      "en": "Terrifying Roar",
      "pt": "Rugido Aterrorizante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 16,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Skill",
        "fieldValues": {
          "trait": "Intimidation"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Enhanced Intimidation • 1 point per 2 skill ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Enhanced Intimidation"
  },
  {
    "id": "animal-venom",
    "profileId": "animal",
    "name": {
      "en": "Venom",
      "pt": "Veneno"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Progressive · Alternate Resistance — Dazed, Stunned, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Progressivo · Resistência Alternativa — Atordoado, Aturdido, Incapacitado; superado por Fortitude."
    },
    "page": 16,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "toughness"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Progressive Affliction (Resisted by Toughness, Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Progressive Affliction (Resisted by Toughness, Overcome by Fortitude; Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "animal-webbing",
    "profileId": "animal",
    "name": {
      "en": "Webbing",
      "pt": "Teia"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Extra Condition · Limited Degree · Alternate Resistance — Hindered and Vulnerable; Defenseless and Immobilized. Overcome by Damage.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido e Vulnerável; Indefeso e Imóvel. Superado por Dano."
    },
    "page": 16,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited_degree",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "dodge"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree"
  },
  {
    "id": "animal-protective-hide",
    "profileId": "animal",
    "name": {
      "en": "Protective Hide",
      "pt": "Couro Protetor"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection",
      "pt": "Proteção"
    },
    "page": 16,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection"
  },
  {
    "id": "animal-regrowth",
    "profileId": "animal",
    "name": {
      "en": "Regrowth",
      "pt": "Recrescimento"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration",
      "pt": "Regeneração"
    },
    "page": 17,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Regeneration • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Regeneration"
  },
  {
    "id": "animal-squeeze-through",
    "profileId": "animal",
    "name": {
      "en": "Squeeze Through",
      "pt": "Passar por Frestas"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Movement · Limited — Permeate limited to small spaces.",
      "pt": "Movimento · Limitado — Permear limitado a espaços pequenos."
    },
    "page": 17,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "movement": "Permeate"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Movement (Permeate), Limited to Small Spaces • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Movement (Permeate), Limited to Small Spaces"
  },
  {
    "id": "animal-serpent-slither",
    "profileId": "animal",
    "name": {
      "en": "Serpent Slither",
      "pt": "Deslizar de Serpente"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 17,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Slithering"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Movement 1 (Slithering) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Movement 1 (Slithering)"
  },
  {
    "id": "animal-wall-walker",
    "profileId": "animal",
    "name": {
      "en": "Wall-Walker",
      "pt": "Caminhar nas Paredes"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 17,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Movement (Wall-Crawling) • 2 points per rank (up",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Movement (Wall-Crawling)"
  },
  {
    "id": "animal-wings",
    "profileId": "animal",
    "name": {
      "en": "Wings",
      "pt": "Asas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Wings",
      "pt": "Voo · Asas"
    },
    "page": 17,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "wings",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Flight, Wings • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Wings"
  },
  {
    "id": "animal-animal-companion",
    "profileId": "animal",
    "name": {
      "en": "Animal Companion",
      "pt": "Companheiro Animal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Heroic · Self-Powered",
      "pt": "Invocar · Heroico · Deslocamento Próprio"
    },
    "page": 17,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "self_powered",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Summon Animal Companion, Heroic, Self-Powered (see Summoning Powers) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Summon Animal Companion, Heroic, Self-Powered (see Summoning Powers)"
  },
  {
    "id": "animal-animal-form",
    "profileId": "animal",
    "name": {
      "en": "Animal Form",
      "pt": "Forma Animal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Morph · Metamorph — One animal form; its character traits are configured separately.",
      "pt": "Metamorfose · Metamorfo — Uma forma animal; os atributos da forma são configurados separadamente."
    },
    "page": 17,
    "components": [
      {
        "effectId": "morph",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "metamorph",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Morph 1 (Animal Form), Metamorph • 6 points",
      "fixed": 6,
      "perRank": 0
    },
    "sourceFormula": "Morph 1 (Animal Form), Metamorph"
  },
  {
    "id": "animal-animal-mimicry",
    "profileId": "animal",
    "name": {
      "en": "Animal Mimicry",
      "pt": "Mimetismo Animal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Limited — Physical traits possessed by animals.",
      "pt": "Variável · Limitado — Características físicas possuídas por animais."
    },
    "page": 17,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited_variable",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Variable (physical traits), Limited to traits possessed by animals • 6 points per rank",
      "fixed": 0,
      "perRank": 6
    },
    "sourceFormula": "Variable (physical traits), Limited to traits possessed by animals"
  },
  {
    "id": "animal-animal-senses",
    "profileId": "animal",
    "name": {
      "en": "Animal Senses",
      "pt": "Sentidos Animais"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses — Choose the purchased animal senses.",
      "pt": "Sentidos — Escolha os sentidos animais comprados."
    },
    "page": 18,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "chooseSenses": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Senses • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Senses"
  },
  {
    "id": "animal-animal-senses-variable",
    "profileId": "animal",
    "name": {
      "en": "Animal Senses — Variable",
      "pt": "Sentidos Animais — Variável"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Limited — Animal traits and sense effects only; a 5-point Variable budget.",
      "pt": "Variável · Limitado — Apenas características animais e efeitos sensoriais; orçamento Variável de 5 pontos."
    },
    "page": 18,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Senses • 1 point per rank",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Senses"
  },
  {
    "id": "animal-animal-summoning",
    "profileId": "animal",
    "name": {
      "en": "Animal Summoning",
      "pt": "Invocação de Animais"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Variable Type (Broad) · Horde · Multiple Minions (per effect rank) · Self-Powered — Up to 32 animals; they travel to the summoner.",
      "pt": "Invocar · Variable Type (Broad) · Horda · Múltiplos Lacaios (por graduação do efeito) · Deslocamento Próprio — Até 32 animais; eles viajam até o invocador."
    },
    "page": 18,
    "components": [
      {
        "effectId": "summon",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "variable_type_broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "horde",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "multiple_minions_ranked",
            "ranks": 5,
            "isPowerSpecific": true
          },
          {
            "modifierId": "self_powered",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Summon Animals 3, Broad Type (Animals), Horde, Multiple Minions 5 (32 animals), Self- Powered (see Summoning Powers) • 42 points",
      "fixed": 42,
      "perRank": 0
    },
    "sourceFormula": "Summon Animals 3, Broad Type (Animals), Horde, Multiple Minions 5 (32 animals), Self- Powered (see Summoning Powers)"
  },
  {
    "id": "animal-chameleon-camouflage",
    "profileId": "animal",
    "name": {
      "en": "Chameleon Camouflage",
      "pt": "Camuflagem de Camaleão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Blending",
      "pt": "Camuflagem · Mesclar"
    },
    "page": 18,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "blending",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Concealment (Visual) 2, Blending • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Concealment (Visual) 2, Blending"
  },
  {
    "id": "animal-create-chimera",
    "profileId": "animal",
    "name": {
      "en": "Create Chimera",
      "pt": "Criar Quimera"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Variable Type (Broad) · Heroic · Limited — Limited to available animals.",
      "pt": "Invocar · Variable Type (Broad) · Heroico · Limitado — Limitado a animais disponíveis."
    },
    "page": 18,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_type_broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Summon Chimera, Broad Type (Mixed Animals), Heroic, Limited to Available Animals • 4 points per rank",
      "fixed": 0,
      "perRank": 4,
      "discrepancy": {
        "reason": {
          "en": "The book prints 4 PP/rank. Its listed composition is Summon 2 + Broad Type 2 + Heroic 2 - Limited 1 = 5 PP/rank. The stated modifiers are preserved.",
          "pt": "O livro imprime 4 PP/graduação. A composição indicada é Invocar 2 + Tipo Amplo 2 + Heroico 2 - Limitado 1 = 5 PP/graduação. Os modificadores indicados são preservados."
        },
        "fixed": 0,
        "perRank": 5
      }
    },
    "sourceFormula": "Summon Chimera, Broad Type (Mixed Animals), Heroic, Limited to Available Animals"
  },
  {
    "id": "animal-multiple-limbs",
    "profileId": "animal",
    "name": {
      "en": "Multiple Limbs",
      "pt": "Múltiplos Membros"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Extra Limbs",
      "pt": "Membros Extras"
    },
    "page": 18,
    "components": [
      {
        "effectId": "extra-limbs",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Extra Limbs • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Extra Limbs"
  },
  {
    "id": "animal-speak-with-animals",
    "profileId": "animal",
    "name": {
      "en": "Speak With Animals",
      "pt": "Falar com Animais"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend",
      "pt": "Compreensão"
    },
    "page": 18,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Animal"
    ],
    "audit": {
      "formula": "Comprehend 2 (Animals) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Comprehend 2 (Animals)"
  }
] satisfies PowerTemplate[];
