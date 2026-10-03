import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "dimension-dimensional-banishment",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Banishment",
      "pt": "Banimento Dimensional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Movement · Attack · Increased Range — Base DC 11. Independent +3 PP per extra DC is not a destination rank.",
      "pt": "Movimento · Ataque · Alcance Aumentado — CD base 11. O aumento independente de +3 PP por CD não é uma graduação de destinos."
    },
    "page": 43,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Dimensional Travel",
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Perception Ranged Movement (Dimensional Travel 1) Attack (Resisted by Dodge or Will) • 4 points + 3 points per +1 to resistance DC.",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-blade",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Blade",
      "pt": "Lâmina Dimensional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Penetrating · Subtle",
      "pt": "Dano · Penetrante · Sutil"
    },
    "page": 43,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "penetrating",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "scaledModifiers": [
          "penetrating"
        ]
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Penetrating Damage (cutting), Subtle • 1",
      "fixed": 1,
      "perRank": 2
    }
  },
  {
    "id": "dimension-dimensional-cascade",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Cascade",
      "pt": "Cascata Dimensional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area · Variable Descriptor",
      "pt": "Dano · Área · Descritor Variável"
    },
    "page": 43,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cone",
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
      "Dimension"
    ],
    "audit": {
      "formula": "Cone Area Damage (environmental effect), Variable Descriptor 1 (environmental effects) • 1",
      "fixed": 1,
      "perRank": 2
    }
  },
  {
    "id": "dimension-dimensional-adaptation",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Adaptation",
      "pt": "Adaptação Dimensional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Limited — Life support only in hazardous dimensions.",
      "pt": "Imunidade · Limitado — Suporte vital apenas em dimensões perigosas."
    },
    "page": 44,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Immunity 10 (life support), Limited to Hazardous Dimensions • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-anchor",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Anchor",
      "pt": "Âncora Dimensional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — Dimension powers.",
      "pt": "Imunidade — Poderes dimensionais."
    },
    "page": 44,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Immunity 5 (dimension powers) • 5",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-shunt",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Shunt",
      "pt": "Desvio Dimensional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect",
      "pt": "Deflexão"
    },
    "page": 44,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Deflect (dimensional) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "dimension-dimension-walk",
    "profileId": "dimension",
    "name": {
      "en": "Dimension Walk",
      "pt": "Caminhada Dimensional"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Quirk · Check Required — Only while moving; Perception DC 12 required.",
      "pt": "Movimento · Peculiaridade · Teste Necessário — Apenas em movimento; exige Percepção CD 12."
    },
    "page": 44,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "check_required",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Dimensional Travel: any"
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Movement 3 (Dimensional Travel, any dimension), Quirk (Only While Moving, –1 point), Requires a Perception Check (DC 12, –2 points) • 3 points + 6 points with",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-jump",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Jump",
      "pt": "Salto Dimensional"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 44,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "movement": "Dimensional Travel"
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Movement (Dimensional Travel) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "dimension-dimensional-portal",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Portal",
      "pt": "Portal Dimensional"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Portal",
      "pt": "Movimento · Portal"
    },
    "page": 44,
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
          "movement": "Dimensional Travel"
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Movement (Dimensional Travel), Portal •",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "dimension-dimension-sense",
    "profileId": "dimension",
    "name": {
      "en": "Dimension Sense",
      "pt": "Sentido Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 44,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Dimension"
          },
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Senses 2 (Detect Dimension, Acute) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-grab",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Grab",
      "pt": "Busca Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Variable Descriptor",
      "pt": "Traço Aprimorado · Descritor Variável"
    },
    "page": 45,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_descriptor",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Equipment"
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Enhanced Advantage (Equipment; dimensional), Variable Descriptor 2 (equipment) • 2 points +",
      "fixed": 2,
      "perRank": 1
    }
  },
  {
    "id": "dimension-dimensional-perspective",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Perspective",
      "pt": "Perspectiva Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 45,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Senses 4 (Penetrates Concealment) • 4 points per sense.",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-pocket",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Pocket",
      "pt": "Bolso Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature — Stores material of mass rank equal to the Feature rank.",
      "pt": "Característica — Guarda material com graduação de massa igual à graduação da Característica."
    },
    "page": 45,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Feature (extradimensional storage of mass rank in material) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "dimension-dimensional-shift",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Shift",
      "pt": "Deslocamento Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 45,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Insubstantial 4 • 20 points",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-stability",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Stability",
      "pt": "Estabilidade Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Area · Concentration · Simultaneous · Reduced Range",
      "pt": "Anulação · Área · Concentração · Simultâneo · Alcance Reduzido"
    },
    "page": 45,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
            "isPowerSpecific": false
          },
          {
            "modifierId": "concentration_nullify",
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
          "descriptor": "Dimension powers"
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Nullify Dimension Powers, Cloud Area, Concentration, Simultaneous, Close Range • 3 points",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "dimension-dimensional-summoning",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Summoning",
      "pt": "Invocação Dimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon",
      "pt": "Invocar"
    },
    "page": 45,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Summon Extradimensional Beings • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "dimension-dimensional-window-1",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Window — 1",
      "pt": "Janela Dimensional — Uma dimensão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Dimensional · Senses · Dimensional — Dimensional modifiers bought for existing vision and hearing, not new senses.",
      "pt": "Sentidos · Dimensional · Sentidos · Dimensional — Modificadores Dimensionais para visão e audição existentes; não compra novos sentidos."
    },
    "page": 45,
    "components": [
      {
        "effectId": "senses",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      },
      {
        "effectId": "senses",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "auditory"
          ]
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Dimensional Vision and Hearing • 2 points (one other dimension), 4 points (related group of",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-window-2",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Window — 2",
      "pt": "Janela Dimensional — Grupo de dimensões"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Dimensional · Senses · Dimensional — Dimensional modifiers bought for existing vision and hearing, not new senses.",
      "pt": "Sentidos · Dimensional · Sentidos · Dimensional — Modificadores Dimensionais para visão e audição existentes; não compra novos sentidos."
    },
    "page": 45,
    "components": [
      {
        "effectId": "senses",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      },
      {
        "effectId": "senses",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "auditory"
          ]
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Dimensional Vision and Hearing • 2 points (one other dimension), 4 points (related group of",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "dimension-dimensional-window-3",
    "profileId": "dimension",
    "name": {
      "en": "Dimensional Window — 3",
      "pt": "Janela Dimensional — Qualquer dimensão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Dimensional · Senses · Dimensional — Dimensional modifiers bought for existing vision and hearing, not new senses.",
      "pt": "Sentidos · Dimensional · Sentidos · Dimensional — Modificadores Dimensionais para visão e audição existentes; não compra novos sentidos."
    },
    "page": 45,
    "components": [
      {
        "effectId": "senses",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 3,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      },
      {
        "effectId": "senses",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 3,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "auditory"
          ]
        }
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Dimensional Vision and Hearing • 2 points (one other dimension), 4 points (related group of",
      "fixed": 6,
      "perRank": 0
    }
  },
  {
    "id": "dimension-two-dimensional-form",
    "profileId": "dimension",
    "name": {
      "en": "Two-Dimensional Form",
      "pt": "Forma Bidimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Limited · Insubstantial · Quirk — Visual concealment on one side only; body-width restriction.",
      "pt": "Camuflagem · Limitado · Insubstancial · Peculiaridade — Ocultação visual de apenas um lado; restrição pela largura do corpo."
    },
    "page": 45,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      },
      {
        "effectId": "insubstantial",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Concealment 4 (all visual, Limited to One Side), Insubstantial 1, Quirk (Limited by body width, –1 point) • 8 points",
      "fixed": 8,
      "perRank": 0
    }
  },
  {
    "id": "dimension-four-dimensional-form",
    "profileId": "dimension",
    "name": {
      "en": "Four-Dimensional Form",
      "pt": "Forma Quadridimensional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature · Indirect · Variable Descriptor · Senses · Teleport — Zero-rank carrier purchases only the flat Indirect/Variable Descriptor modifiers for existing attacks.",
      "pt": "Característica · Indireto · Descritor Variável · Sentidos · Teleporte — O componente sem graduações compra apenas os modificadores fixos Indireto/Descritor Variável para ataques existentes."
    },
    "page": 46,
    "components": [
      {
        "effectId": "feature",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "indirect",
            "ranks": 3,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ]
      },
      {
        "effectId": "senses",
        "ranks": 8,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Visual"
          },
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Auditory"
          }
        ]
      },
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Dimension"
    ],
    "audit": {
      "formula": "Indirect 3 (Variable Descriptor 2, all attacks), Senses 8 (Vision and Hearing Penetrate Concealment), Teleport 1 • 15 points",
      "fixed": 15,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
