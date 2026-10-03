import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "element-corrosive",
    "profileId": "element",
    "name": {
      "en": "Corrosive",
      "pt": "Corrosivo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Affects Objects · Secondary Effect · Linked · Damage · Secondary Effect",
      "pt": "Enfraquecer · Afeta Objetos · Efeito Secundário · Vinculado · Dano · Efeito Secundário"
    },
    "page": 63,
    "components": [
      {
        "effectId": "weaken",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_objects",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "secondary_effect",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "trait": "Toughness",
          "resistance": "fortitude"
        }
      },
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "secondary_effect",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Weaken Toughness, Affects Objects, Secondary Effect, Linked to Damage, Secondary Effect • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    }
  },
  {
    "id": "element-encase",
    "profileId": "element",
    "name": {
      "en": "Encase",
      "pt": "Encapsular"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance — Hindered/Vulnerable, Defenseless/Immobilized; overcome by Damage.",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido/Vulnerável, Indefeso/Imóvel; superado por Dano."
    },
    "page": 63,
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
      "Element"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "element-explosion",
    "profileId": "element",
    "name": {
      "en": "Explosion",
      "pt": "Explosão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area",
      "pt": "Dano · Área"
    },
    "page": 63,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
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
      "Element"
    ],
    "audit": {
      "formula": "Burst Area Damage • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "element-gas-cloud",
    "profileId": "element",
    "name": {
      "en": "Gas Cloud",
      "pt": "Nuvem de Gás"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative — Fatigued, Exhausted, Incapacitated.",
      "pt": "Aflição · Área · Cumulativo — Fatigado, Exausto, Incapacitado."
    },
    "page": 64,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
            "isPowerSpecific": false
          },
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
      "Element"
    ],
    "audit": {
      "formula": "Cloud Area Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated), Cumulative • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "element-immolation",
    "profileId": "element",
    "name": {
      "en": "Immolation",
      "pt": "Imolação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 64,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Damage (heat), Reaction (touching or being touched) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "element-petrify",
    "profileId": "element",
    "name": {
      "en": "Petrify",
      "pt": "Petrificar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Limited Degree · Progressive — Third degree only: Transformed.",
      "pt": "Aflição · Graus Limitados · Progressivo — Apenas terceiro grau: Transformado."
    },
    "page": 64,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited_degree",
            "ranks": 2,
            "isPowerSpecific": true
          },
          {
            "modifierId": "progressive",
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
      "Element"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Transformed), Limited Degree (third only), Progressive • 2",
      "fixed": 0,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Affliction 1 - Limited Degree (third only) 2 + Progressive 2 = 1 PP/rank, not printed 2.",
          "pt": "Divergência da fonte: Affliction 1 - Limited Degree (third only) 2 + Progressive 2 = 1 PP/rank, not printed 2."
        },
        "fixed": 0,
        "perRank": 1
      }
    }
  },
  {
    "id": "element-petrifying-gaze",
    "profileId": "element",
    "name": {
      "en": "Petrifying Gaze",
      "pt": "Olhar Petrificante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Limited Degree · Progressive · Sense-Dependent",
      "pt": "Aflição · Alcance Aumentado · Graus Limitados · Progressivo · Dependente de Sentido"
    },
    "page": 64,
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
            "modifierId": "limited_degree",
            "ranks": 2,
            "isPowerSpecific": true
          },
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "sense_dependent",
            "ranks": 1,
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
      "Element"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Fortitude; Transformed), Limited Degree (third only), Progressive, Sight-Dependent • 3 points per rank",
      "fixed": 0,
      "perRank": 3,
      "discrepancy": {
        "reason": {
          "en": "Perception Range adds 2 and Sight Dependent subtracts 1 from Petrify: 2 PP/rank.",
          "pt": "Divergência da fonte: Perception Range adds 2 and Sight Dependent subtracts 1 from Petrify: 2 PP/rank."
        },
        "fixed": 0,
        "perRank": 2
      }
    }
  },
  {
    "id": "element-tarpit",
    "profileId": "element",
    "name": {
      "en": "Tarpit",
      "pt": "Poço de Piche"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Extra Condition · Limited Degree · Alternate Resistance — Hindered/Vulnerable, Defenseless/Immobilized; overcome by Strength.",
      "pt": "Aflição · Área · Cumulativo · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido/Vulnerável, Indefeso/Imóvel; superado por Força."
    },
    "page": 64,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
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
      "Element"
    ],
    "audit": {
      "formula": "Cloud Area Affliction (Resisted by Dodge, Overcome by Strength; Hindered and Vulnerable, Defenseless and Immobilized), Cumulative, Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "element-chemical-immunity",
    "profileId": "element",
    "name": {
      "en": "Chemical Immunity",
      "pt": "Imunidade Química"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 64,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Immunity 2 (chemical effects) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "element-destroy-projectiles",
    "profileId": "element",
    "name": {
      "en": "Destroy Projectiles",
      "pt": "Destruir Projéteis"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Sustained",
      "pt": "Imunidade · Sustentado"
    },
    "page": 64,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "sustained_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Immunity 10 (projectiles), Sustained • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "element-diamond-hard",
    "profileId": "element",
    "name": {
      "en": "Diamond Hard",
      "pt": "Dureza de Diamante"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Noticeable",
      "pt": "Proteção · Impenetrável · Perceptível"
    },
    "page": 64,
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
            "modifierId": "noticeable",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Impervious Protection, Noticeable • 1 point",
      "fixed": -1,
      "perRank": 2
    }
  },
  {
    "id": "element-molecular-phasing",
    "profileId": "element",
    "name": {
      "en": "Molecular Phasing",
      "pt": "Fase Molecular"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 64,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Insubstantial 4 • 20 points",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "element-unliving",
    "profileId": "element",
    "name": {
      "en": "Unliving",
      "pt": "Não Vivo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 65,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Immunity 30 (Fortitude Effects) • 30 points",
      "fixed": 30,
      "perRank": 0
    }
  },
  {
    "id": "element-chemical-rocket",
    "profileId": "element",
    "name": {
      "en": "Chemical Rocket",
      "pt": "Foguete Químico"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 65,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "element-quantum-breakdown",
    "profileId": "element",
    "name": {
      "en": "Quantum Breakdown",
      "pt": "Decomposição Quântica"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport",
      "pt": "Teleporte"
    },
    "page": 65,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Teleport • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "element-explosive-quantum-breakdown",
    "profileId": "element",
    "name": {
      "en": "Explosive Quantum Breakdown",
      "pt": "Decomposição Quântica Explosiva"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Damage · Area · Reaction — Burst upon teleporting; Damage rank is a separate purchase.",
      "pt": "Teleporte · Dano · Área · Reação — Explosão ao teleportar; a graduação de Dano é uma compra separada."
    },
    "page": 65,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      },
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Teleport, Burst Area Reaction Damage (explosion, upon teleporting) • 2 points",
      "fixed": 5,
      "perRank": 2
    }
  },
  {
    "id": "element-transmutative-tunneling",
    "profileId": "element",
    "name": {
      "en": "Transmutative Tunneling",
      "pt": "Escavação Transmutativa"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 65,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "element-chemical-analysis",
    "profileId": "element",
    "name": {
      "en": "Chemical Analysis",
      "pt": "Análise Química"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 65,
    "components": [
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Chemical compounds"
          },
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "analytical",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Senses 3 (Detect Chemical Compounds, Acute, Analytical) • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "element-neutralize-reaction",
    "profileId": "element",
    "name": {
      "en": "Neutralize Reaction",
      "pt": "Neutralizar Reação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Broad · Simultaneous",
      "pt": "Anulação · Amplo · Simultâneo"
    },
    "page": 65,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Chemical effects"
        }
      }
    ],
    "descriptors": [
      "Element"
    ],
    "audit": {
      "formula": "Ranged Nullify Chemical Effects, Broad, Simultaneous • 4 points per rank",
      "fixed": 0,
      "perRank": 4,
      "discrepancy": {
        "reason": {
          "en": "Nullify is already Ranged: 1 + Broad 1 + Simultaneous 1 = 3 PP/rank, not printed 4.",
          "pt": "Divergência da fonte: Nullify is already Ranged: 1 + Broad 1 + Simultaneous 1 = 3 PP/rank, not printed 4."
        },
        "fixed": 0,
        "perRank": 3
      }
    }
  },
  {
    "id": "element-transmutation",
    "profileId": "element",
    "name": {
      "en": "Transmutation",
      "pt": "Transmutação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Transform",
      "pt": "Transformação"
    },
    "page": 66,
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
      "Element"
    ],
    "audit": {
      "formula": "Transform (any material into anything else) •",
      "fixed": 0,
      "perRank": 5
    }
  }
] satisfies PowerTemplate[];
