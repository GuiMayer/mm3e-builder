import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "plant-control-plants",
    "profileId": "plant",
    "name": {
      "en": "Control Plants",
      "pt": "Controlar Plantas"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited · Subtle",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado · Sutil"
    },
    "page": 144,
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
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Dazed, Compelled, Controlled), Limited to Plants (–2), Subtle • 1 point + 2",
      "fixed": 1,
      "perRank": 2
    }
  },
  {
    "id": "plant-internal-flora",
    "profileId": "plant",
    "name": {
      "en": "Internal Flora",
      "pt": "Flora Interna"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Subtle",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Sutil"
    },
    "page": 144,
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
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "subtle",
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
      "Plant"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Subtle • 1 point + 4 points per rank",
      "fixed": 1,
      "perRank": 4
    }
  },
  {
    "id": "plant-phytotoxin",
    "profileId": "plant",
    "name": {
      "en": "Phytotoxin",
      "pt": "Fitotoxina"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Secondary Effect",
      "pt": "Aflição · Efeito Secundário"
    },
    "page": 144,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "secondary_effect",
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
      "Plant"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Paralyzed), Secondary Effect • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "plant-pollen-cloud",
    "profileId": "plant",
    "name": {
      "en": "Pollen Cloud",
      "pt": "Nuvem de Pólen"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area",
      "pt": "Aflição · Área"
    },
    "page": 144,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Cloud Area Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "plant-sap-snare",
    "profileId": "plant",
    "name": {
      "en": "Sap Snare",
      "pt": "Armadilha de Seiva"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance · Cumulative",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa · Cumulativo"
    },
    "page": 144,
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
      "Plant"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "plant-tanglevines",
    "profileId": "plant",
    "name": {
      "en": "Tanglevines",
      "pt": "Vinhas Enredantes"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance · Area · Indirect",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa · Área · Indireto"
    },
    "page": 144,
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
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "indirect",
            "ranks": 3,
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
      "Plant"
    ],
    "audit": {
      "formula": "Ranged Burst Area Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Indirect 3, Limited Degree • 3 points + 3 points per rank",
      "fixed": 3,
      "perRank": 3
    }
  },
  {
    "id": "plant-thornskin",
    "profileId": "plant",
    "name": {
      "en": "Thornskin",
      "pt": "Pele de Espinhos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 144,
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
      "Plant"
    ],
    "audit": {
      "formula": "Damage (piercing), Reaction (to being touched or struck) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "plant-throwing-thorns",
    "profileId": "plant",
    "name": {
      "en": "Throwing Thorns",
      "pt": "Arremessar Espinhos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Multiattack",
      "pt": "Dano · Alcance Aumentado · Ataque Múltiplo"
    },
    "page": 144,
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
      "Plant"
    ],
    "audit": {
      "formula": "Ranged Damage (piercing), Multiattack • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "plant-photosynthesis",
    "profileId": "plant",
    "name": {
      "en": "Photosynthesis",
      "pt": "Fotossíntese"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 145,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Immunity 1 (starvation) • 1 point",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "plant-regrowth",
    "profileId": "plant",
    "name": {
      "en": "Regrowth",
      "pt": "Regenerar"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration",
      "pt": "Regeneração"
    },
    "page": 145,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Regeneration • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "plant-woodskin",
    "profileId": "plant",
    "name": {
      "en": "Woodskin",
      "pt": "Pele de Madeira"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Noticeable",
      "pt": "Proteção · Perceptível"
    },
    "page": 145,
    "components": [
      {
        "effectId": "protection",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "noticeable",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Protection, Noticeable • 1 point for 2 ranks + 1 point",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "plant-brachiation",
    "profileId": "plant",
    "name": {
      "en": "Brachiation",
      "pt": "Braquiação"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 145,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Swinging"
        }
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Movement 1 (Swinging) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "plant-carrier-vine",
    "profileId": "plant",
    "name": {
      "en": "Carrier Vine",
      "pt": "Vinha Transportadora"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform",
      "pt": "Voo · Platform"
    },
    "page": 145,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "platform",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Flight 1, Platform • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "plant-pass-through-plants",
    "profileId": "plant",
    "name": {
      "en": "Pass Through Plants",
      "pt": "Passar pelas Plantas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 145,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Permeate"
        }
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Movement 3 (Permeate 3), Limited to Vegetation • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "plant-root-digging",
    "profileId": "plant",
    "name": {
      "en": "Root Digging",
      "pt": "Escavar Raízes"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 145,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "plant-root-transport",
    "profileId": "plant",
    "name": {
      "en": "Root Transport",
      "pt": "Transporte por Raízes"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium",
      "pt": "Teleporte · Meio"
    },
    "page": 145,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "medium",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Teleport, Medium (Plants) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "plant-woods-walk",
    "profileId": "plant",
    "name": {
      "en": "Woods Walk",
      "pt": "Caminhar na Floresta"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 145,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Trackless"
        }
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Movement 2 (Trackless), Limited to Plant Life • 1 point.",
      "fixed": 2,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "Movement 2 costs 4, Limited -1 per rank reduces it to 2, not printed 1.",
          "pt": "Divergência da fonte: Movement 2 costs 4, Limited -1 per rank reduces it to 2, not printed 1."
        },
        "fixed": 2,
        "perRank": 0
      }
    }
  },
  {
    "id": "plant-animate-plants",
    "profileId": "plant",
    "name": {
      "en": "Animate Plants",
      "pt": "Animar Plantas"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Controlled · Variable Type (General)",
      "pt": "Invocar · Controlado · Variable Type (General)"
    },
    "page": 145,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "variable_type_general",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Summon Animated Plant, Controlled, General Type • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "plant-green-memory",
    "profileId": "plant",
    "name": {
      "en": "Green Memory",
      "pt": "Memória Verde"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited",
      "pt": "Sentidos · Limitado"
    },
    "page": 146,
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
            "id": "postcognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Senses 4 (Postcognition), Limited to Areas of Plant-Life • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "plant-green-network",
    "profileId": "plant",
    "name": {
      "en": "Green Network",
      "pt": "Rede Verde"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Medium",
      "pt": "Sensoriamento Remoto · Meio"
    },
    "page": 146,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "medium",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "variableCostOption": "Four sense types"
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Remote Sensing (visual, auditory, tactile), Medium (Plants) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "plant-plant-form",
    "profileId": "plant",
    "name": {
      "en": "Plant Form",
      "pt": "Forma Vegetal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Noticeable · Protection — Sleep, starvation, suffocation; the entire form is noticeable.",
      "pt": "Imunidade · Perceptível · Proteção — Sono, inanição, sufocamento; toda a forma é perceptível."
    },
    "page": 146,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "noticeable",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      },
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Immunity 3 (Sleep, Starvation, Suffocation), Protection, Noticeable • 2 points +1 point per rank",
      "fixed": 2,
      "perRank": 1
    }
  },
  {
    "id": "plant-plant-growth",
    "profileId": "plant",
    "name": {
      "en": "Plant Growth",
      "pt": "Crescimento Vegetal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create · Permanent",
      "pt": "Criação · Permanente"
    },
    "page": 146,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "permanent",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Create Plants, Permanent • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "plant-speak-with-plants",
    "profileId": "plant",
    "name": {
      "en": "Speak With Plants",
      "pt": "Falar com Plantas"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend",
      "pt": "Compreensão"
    },
    "page": 146,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Comprehend 2 (Plants) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "plant-warp-wood",
    "profileId": "plant",
    "name": {
      "en": "Warp Wood",
      "pt": "Moldar Madeira"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Transform",
      "pt": "Transformação"
    },
    "page": 146,
    "components": [
      {
        "effectId": "transform",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "One to one (e.g. metal to wood)"
      }
    ],
    "descriptors": [
      "Plant"
    ],
    "audit": {
      "formula": "Transform (wooden objects into different shapes) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  }
] satisfies PowerTemplate[];
