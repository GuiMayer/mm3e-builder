import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "luck-catastrophe",
    "profileId": "luck",
    "name": {
      "en": "Catastrophe",
      "pt": "Catástrofe"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Indirect · Subtle · Variable Descriptor",
      "pt": "Dano · Alcance Aumentado · Indireto · Sutil · Descritor Variável"
    },
    "page": 99,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "indirect",
            "ranks": 4,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Perception Ranged Damage, Indirect 4, Subtle 2, Variable Descriptor 1 (Accidents) • 7 points +3 points per rank",
      "fixed": 7,
      "perRank": 3
    },
    "sourceFormula": "Perception Ranged Damage, Indirect 4, Subtle 2, Variable Descriptor 1 (Accidents)"
  },
  {
    "id": "luck-find-weakness",
    "profileId": "luck",
    "name": {
      "en": "Find Weakness",
      "pt": "Encontrar Fraqueza"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Feature · Penetrating · Variable Descriptor · Quirk",
      "pt": "Característica · Penetrante · Descritor Variável · Peculiaridade"
    },
    "page": 99,
    "components": [
      {
        "effectId": "feature",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "penetrating",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scaledModifiers": [
          "penetrating"
        ],
        "scalable": true,
        "modifierRanksOnly": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Enhanced Extra (Penetrating), Variable Descriptor (Attacks), Quirk (Limited to Lower of Attack or Extra’s Rank, –1 point) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Extra (Penetrating), Variable Descriptor (Attacks), Quirk (Limited to Lower of Attack or Extra’s Rank, –1 point)"
  },
  {
    "id": "luck-lucky-shot",
    "profileId": "luck",
    "name": {
      "en": "Lucky Shot",
      "pt": "Disparo Sortudo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Feature · Variable Descriptor · Quirk — Enhanced Extra: upgrade an existing ranged attack to Perception; limited to lower of attack and extra ranks.",
      "pt": "Característica · Descritor Variável · Peculiaridade — Extra Aprimorado: aumenta um ataque à distância existente para Percepção; limitado à menor graduação do ataque/extra."
    },
    "page": 100,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Enhanced Extra (Perception Range), Variable Descriptor (Attacks), Quirk (Limited to Lower of Attack or Extra’s Rank, –1 point) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Extra (Perception Range), Variable Descriptor (Attacks), Quirk (Limited to Lower of Attack or Extra’s Rank, –1 point)"
  },
  {
    "id": "luck-jinx",
    "profileId": "luck",
    "name": {
      "en": "Jinx",
      "pt": "Azar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Indirect · Insidious · Subtle · Limited Degree",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Indireto · Insidioso · Sutil · Graus Limitados"
    },
    "page": 99,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "indirect",
            "ranks": 4,
            "isPowerSpecific": false
          },
          {
            "modifierId": "insidious",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_degree",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Impaired and Vulnerable, Defenseless and Disabled), Extra Condition, Indirect 4, Insidious, Subtle 2, Limited Degree • 7 points + 3 points per rank",
      "fixed": 7,
      "perRank": 3
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Impaired and Vulnerable, Defenseless and Disabled), Extra Condition, Indirect 4, Insidious, Subtle 2, Limited Degree"
  },
  {
    "id": "luck-poltergeist",
    "profileId": "luck",
    "name": {
      "en": "Poltergeist",
      "pt": "Poltergeist"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Perception · Indirect · Precise · Subtle · Senses · Limited",
      "pt": "Mover Objetos · Percepção · Indireto · Preciso · Sutil · Sentidos · Limitado"
    },
    "page": 100,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "perception_move_object",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "indirect",
            "ranks": 4,
            "isPowerSpecific": false
          },
          {
            "modifierId": "precise",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      },
      {
        "effectId": "senses",
        "ranks": 11,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "senseTraits": [
          {
            "id": "radius",
            "ranks": 2,
            "senseType": "Visual"
          },
          {
            "id": "counters_concealment",
            "ranks": 5,
            "senseType": "Visual",
            "detail": "All concealment"
          },
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Perception Ranged Move Object, Indirect 4, Precise, Subtle 2; Senses 10 (Radius Vision Counters and Penetrates All Concealment, Limited to Targeting Move Object) • 12 points +3 points per rank",
      "fixed": 12,
      "perRank": 3,
      "discrepancy": {
        "reason": {
          "en": "Radius Vision costs 2, Counter All Concealment 5, Penetrates 4: 11 ranks, limited cost 6, plus fixed modifiers 7. The book specifies Senses 10.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 13 PP fixos + 3 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 13,
        "perRank": 3
      }
    },
    "sourceFormula": "Perception Ranged Move Object, Indirect 4, Precise, Subtle 2; Senses 10 (Radius Vision Counters and Penetrates All Concealment, Limited to Targeting Move Object)"
  },
  {
    "id": "luck-breakfall",
    "profileId": "luck",
    "name": {
      "en": "Breakfall",
      "pt": "Amortecer Queda"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Movement · Reaction",
      "pt": "Movimento · Reação"
    },
    "page": 100,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Safe Fall"
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Movement 1 (Safe Fall), Reaction •3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Movement 1 (Safe Fall), Reaction"
  },
  {
    "id": "luck-defensive-luck",
    "profileId": "luck",
    "name": {
      "en": "Defensive Luck",
      "pt": "Sorte Defensiva"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 100,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "sustained_protection",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection, Sustained"
  },
  {
    "id": "luck-fortunate-failure",
    "profileId": "luck",
    "name": {
      "en": "Fortunate Failure",
      "pt": "Falha Afortunada"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Nullify · Reaction · Broad · Effortless · Simultaneous · Reduced Range",
      "pt": "Anulação · Reação · Amplo · Sem Esforço · Simultâneo · Alcance Reduzido"
    },
    "page": 100,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "effortless_nullify",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reduced_range",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Effects countered by coincidence"
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Reaction Nullify (Effects Countered by Coincidence), Broad, Effortless, Simultaneous, Close Range • 6 points per rank",
      "fixed": 0,
      "perRank": 6
    },
    "sourceFormula": "Reaction Nullify (Effects Countered by Coincidence), Broad, Effortless, Simultaneous, Close Range"
  },
  {
    "id": "luck-lucky-dodge",
    "profileId": "luck",
    "name": {
      "en": "Lucky Dodge",
      "pt": "Esquiva Sortuda"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Enhanced Trait · Enhanced Trait — Each defense rank costs 1; the preview starts both defenses at 1.",
      "pt": "Traço Aprimorado · Traço Aprimorado · Traço Aprimorado — Cada graduação de defesa custa 1; a prévia inicia ambas em 1."
    },
    "page": 100,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Uncanny Dodge"
        }
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Dodge"
        }
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Parry"
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Uncanny Dodge), Enhanced Dodge, Enhanced Parry • 1 point + 1 point per rank",
      "fixed": 1,
      "perRank": 2
    },
    "sourceFormula": "Enhanced Advantage 1 (Uncanny Dodge), Enhanced Dodge, Enhanced Parry"
  },
  {
    "id": "luck-lucky-escape-immortality",
    "profileId": "luck",
    "name": {
      "en": "Lucky Escape — Immortality",
      "pt": "Escape Sortudo — Imortalidade"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immortality · Limited",
      "pt": "Imortalidade · Limitado"
    },
    "page": 100,
    "components": [
      {
        "effectId": "immortality",
        "ranks": 1,
        "modifiers": [
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
      "Luck"
    ],
    "audit": {
      "formula": "Immortality, Limited to Circumstances of Plausible Survival • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Immortality, Limited to Circumstances of Plausible Survival"
  },
  {
    "id": "luck-lucky-escape-healing",
    "profileId": "luck",
    "name": {
      "en": "Lucky Escape — Healing",
      "pt": "Escape Sortudo — Cura"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Healing · Limited · Subtle",
      "pt": "Cura · Limitado · Sutil"
    },
    "page": 100,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Immortality, Limited to Circumstances of Plausible Survival • 1 point per rank",
      "fixed": 2,
      "perRank": 1
    },
    "sourceFormula": "Immortality, Limited to Circumstances of Plausible Survival"
  },
  {
    "id": "luck-ease-of-movement",
    "profileId": "luck",
    "name": {
      "en": "Ease of Movement",
      "pt": "Facilidade de Movimento"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 101,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "movement": "Sure-Footed"
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Movement 2 (Sure-Footed) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Sure-Footed)"
  },
  {
    "id": "luck-perfect-timing",
    "profileId": "luck",
    "name": {
      "en": "Perfect Timing",
      "pt": "Momento Perfeito"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Feature",
      "pt": "Característica"
    },
    "page": 101,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Feature (Edit Scene to appear in it) • 1 point",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Feature (Edit Scene to appear in it)"
  },
  {
    "id": "luck-escape-notice",
    "profileId": "luck",
    "name": {
      "en": "Escape Notice",
      "pt": "Passar Despercebido"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Passive",
      "pt": "Camuflagem · Passivo"
    },
    "page": 101,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "passive",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "senses": [
            "all"
          ]
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Concealment 10 (All Senses), Passive • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Concealment 10 (All Senses), Passive"
  },
  {
    "id": "luck-lucky",
    "profileId": "luck",
    "name": {
      "en": "Lucky",
      "pt": "Sortudo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 101,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Luck"
        }
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Enhanced Advantage (Luck) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Advantage (Luck)"
  },
  {
    "id": "luck-reality-control",
    "profileId": "luck",
    "name": {
      "en": "Reality Control",
      "pt": "Controle da Realidade"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Action",
      "pt": "Variável · Ação"
    },
    "page": 101,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "action_variable",
            "ranks": 2,
            "options": {
              "subtypeId": "free"
            },
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Variable (Probability Effects), Free Action • 9",
      "fixed": 0,
      "perRank": 9
    },
    "sourceFormula": "Variable (Probability Effects), Free Action"
  },
  {
    "id": "luck-sense-of-luck",
    "profileId": "luck",
    "name": {
      "en": "Sense of Luck",
      "pt": "Sentido da Sorte"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 101,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Luck"
          }
        ]
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Senses 1 (Luck Awareness) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Luck Awareness)"
  },
  {
    "id": "luck-visions-of-fortune",
    "profileId": "luck",
    "name": {
      "en": "Visions of Fortune",
      "pt": "Visões da Fortuna"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited",
      "pt": "Sentidos · Limitado"
    },
    "page": 101,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "senseTraits": [
          {
            "id": "precognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Luck"
    ],
    "audit": {
      "formula": "Senses 4 (Precognition), Limited to Luck Trends • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses 4 (Precognition), Limited to Luck Trends"
  }
] satisfies PowerTemplate[];
