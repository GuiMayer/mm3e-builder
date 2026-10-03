import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "cosmic-cosmic-blast",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Blast",
      "pt": "Rajada Cósmica"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 26,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Ranged Damage • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage"
  },
  {
    "id": "cosmic-cosmic-burst",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Burst",
      "pt": "Explosão Cósmica"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 26,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Ranged Burst Area Damage • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Burst Area Damage"
  },
  {
    "id": "cosmic-cosmic-grasp",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Grasp",
      "pt": "Agarrão Cósmico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Reversible · Limited Degree · Alternate Resistance — Impaired and Vulnerable; Defenseless and Immobilized. Overcome by Strength.",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Reversível · Graus Limitados · Resistência Alternativa — Prejudicado e Vulnerável; Indefeso e Imóvel. Superado por Força."
    },
    "page": 27,
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
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reversible",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Cosmic"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Strength; Impaired and Vulnerable, Defenseless and Immobilized), Extra Condition, Reversible, Limited Degree • 1 point + 2 points per rank",
      "fixed": 1,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (Resisted by Dodge, Overcome by Strength; Impaired and Vulnerable, Defenseless and Immobilized), Extra Condition, Reversible, Limited Degree"
  },
  {
    "id": "cosmic-meteor-shower",
    "profileId": "cosmic",
    "name": {
      "en": "Meteor Shower",
      "pt": "Chuva de Meteoros"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Multiattack",
      "pt": "Dano · Alcance Aumentado · Ataque Múltiplo"
    },
    "page": 27,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "multiattack",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Ranged Multiattack Damage (fire and impact) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Multiattack Damage (fire and impact)"
  },
  {
    "id": "cosmic-nebular-field",
    "profileId": "cosmic",
    "name": {
      "en": "Nebular Field",
      "pt": "Campo Nebular"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Concealment · Attack · Increased Range · Area",
      "pt": "Camuflagem · Ataque · Alcance Aumentado · Área"
    },
    "page": 27,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
            "isPowerSpecific": false
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
      "Cosmic"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Concealment Attack 4 (Visual) • 16 points +4 points per +1 distance rank to area.",
      "fixed": 16,
      "perRank": 0
    },
    "sourceFormula": "Ranged Cloud Area Concealment Attack 4 (Visual)"
  },
  {
    "id": "cosmic-cosmic-shield",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Shield",
      "pt": "Escudo Cósmico"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained",
      "pt": "Proteção · Impenetrável · Sustentado"
    },
    "page": 27,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "impervious",
            "ranks": 1,
            "isPowerSpecific": false
          },
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
      "Cosmic"
    ],
    "audit": {
      "formula": "Impervious Protection, Sustained • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Impervious Protection, Sustained"
  },
  {
    "id": "cosmic-spaceworthy",
    "profileId": "cosmic",
    "name": {
      "en": "Spaceworthy",
      "pt": "Adaptado ao Espaço"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — Cold, all suffocation, radiation and vacuum.",
      "pt": "Imunidade — Frio, todo sufocamento, radiação e vácuo."
    },
    "page": 27,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Immunity 5 (cold, all suffocation, radiation, vacuum) • 5 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 5 (cold, all suffocation, radiation, vacuum)"
  },
  {
    "id": "cosmic-unearthly",
    "profileId": "cosmic",
    "name": {
      "en": "Unearthly",
      "pt": "Além do Humano"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — All Fortitude effects.",
      "pt": "Imunidade — Todos os efeitos de Fortitude."
    },
    "page": 27,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Immunity 30 (Fortitude effects) • 30 points",
      "fixed": 30,
      "perRank": 0
    },
    "sourceFormula": "Immunity 30 (Fortitude effects)"
  },
  {
    "id": "cosmic-faster-than-light",
    "profileId": "cosmic",
    "name": {
      "en": "Faster Than Light",
      "pt": "Mais Rápido que a Luz"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement — Space Travel, up to three ranks.",
      "pt": "Movimento — Viagem Espacial, até três graduações."
    },
    "page": 27,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "movement": "Space Travel"
        }
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Movement (Space Travel) • 2 points per rank up to rank 3 (6 points).",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Movement (Space Travel)"
  },
  {
    "id": "cosmic-space-warp",
    "profileId": "cosmic",
    "name": {
      "en": "Space Warp",
      "pt": "Dobra Espacial"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Portal — Space Travel portal, up to three ranks.",
      "pt": "Movimento · Portal — Portal de Viagem Espacial, até três graduações."
    },
    "page": 27,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "portal_movement",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "movement": "Space Travel"
        }
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Movement (Space Travel), Portal • 4 points per rank up to rank 3 (12 points).",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Movement (Space Travel), Portal"
  },
  {
    "id": "cosmic-soar-the-spaceways",
    "profileId": "cosmic",
    "name": {
      "en": "Soar the Spaceways",
      "pt": "Voar pelo Espaço"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 27,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Environmental Adaptation: Space"
        }
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Movement 1 (Environmental Adaptation: Space) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Movement 1 (Environmental Adaptation: Space)"
  },
  {
    "id": "cosmic-cosmic-awareness",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Awareness",
      "pt": "Consciência Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited — Only the four Precognition ranks are limited to cosmic events.",
      "pt": "Sentidos · Limitado — Apenas as quatro graduações de Precognição são limitadas a eventos cósmicos."
    },
    "page": 28,
    "components": [
      {
        "effectId": "senses",
        "ranks": 6,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "affectedRanks": 4,
            "isPowerSpecific": false
          }
        ],
        "senseTraits": [
          {
            "id": "precognition",
            "ranks": 4
          },
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Cosmic energies"
          }
        ]
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Senses 6 (Acute Cosmic Awareness, Precognition Limited to Cosmic Events) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Senses 6 (Acute Cosmic Awareness, Precognition Limited to Cosmic Events)"
  },
  {
    "id": "cosmic-cosmic-communication",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Communication",
      "pt": "Comunicação Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Communication — Subspace audiovisual projection, any distance.",
      "pt": "Comunicação — Projeção audiovisual pelo subespaço, qualquer distância."
    },
    "page": 28,
    "components": [
      {
        "effectId": "communication",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Communication 5 (subspace audio- visual projection, any distance) • 20 points",
      "fixed": 20,
      "perRank": 0
    },
    "sourceFormula": "Communication 5 (subspace audio- visual projection, any distance)"
  },
  {
    "id": "cosmic-cosmic-control",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Control",
      "pt": "Controle Cósmico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 28,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Move Object • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Move Object"
  },
  {
    "id": "cosmic-cosmic-healing",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Healing",
      "pt": "Cura Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing",
      "pt": "Cura"
    },
    "page": 28,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Healing • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Healing"
  },
  {
    "id": "cosmic-cosmic-mastery",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Mastery",
      "pt": "Domínio Cósmico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable",
      "pt": "Variável"
    },
    "page": 28,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Variable (cosmic powers) • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    },
    "sourceFormula": "Variable (cosmic powers)"
  },
  {
    "id": "cosmic-cosmic-order",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Order",
      "pt": "Ordem Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Simultaneous",
      "pt": "Anulação · Simultâneo"
    },
    "page": 28,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Chaos effects"
        }
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Nullify Chaos Effects, Simultaneous • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Nullify Chaos Effects, Simultaneous"
  },
  {
    "id": "cosmic-cosmic-strength",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Strength",
      "pt": "Força Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 28,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Enhanced Strength • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Enhanced Strength"
  },
  {
    "id": "cosmic-cosmic-tracking",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Tracking",
      "pt": "Rastreamento Cósmico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 28,
    "components": [
      {
        "effectId": "senses",
        "ranks": 8,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Mental"
          },
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "direction_sense",
            "ranks": 1
          },
          {
            "id": "distance_sense",
            "ranks": 1
          },
          {
            "id": "extended",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "tracking",
            "ranks": 2,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Senses 8 (Accurate, Acute, Direction Sense, Distance Sense, Extended, Tracking 2) • 8 points",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Senses 8 (Accurate, Acute, Direction Sense, Distance Sense, Extended, Tracking 2)"
  },
  {
    "id": "cosmic-cosmic-transmutation",
    "profileId": "cosmic",
    "name": {
      "en": "Cosmic Transmutation",
      "pt": "Transmutação Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Transform",
      "pt": "Transformação"
    },
    "page": 28,
    "components": [
      {
        "effectId": "transform",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Anything to anything"
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Transform (anything into anything else) • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Transform (anything into anything else)"
  },
  {
    "id": "cosmic-universal-translation",
    "profileId": "cosmic",
    "name": {
      "en": "Universal Translation",
      "pt": "Tradução Universal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend — Speak, understand and be understood in all languages.",
      "pt": "Compreensão — Falar, compreender e ser compreendido em todos os idiomas."
    },
    "page": 28,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 3,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cosmic"
    ],
    "audit": {
      "formula": "Comprehend 3 (speak, understand, understood, all languages) • 6 points",
      "fixed": 6,
      "perRank": 0
    },
    "sourceFormula": "Comprehend 3 (speak, understand, understood, all languages)"
  }
] satisfies PowerTemplate[];
