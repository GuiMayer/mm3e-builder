import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "gravity-gravitic-blast",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Blast",
      "pt": "Rajada Gravitacional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 73,
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
      "Gravity"
    ],
    "audit": {
      "formula": "Ranged Damage (force) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-gravitic-burst",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Burst",
      "pt": "Explosão Gravitacional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area",
      "pt": "Dano · Área"
    },
    "page": 73,
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
      "Gravity"
    ],
    "audit": {
      "formula": "Burst Area Damage (force) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-gravitic-wave",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Wave",
      "pt": "Onda Gravitacional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area",
      "pt": "Dano · Área"
    },
    "page": 73,
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
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Cone Area Damage (force) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-upalanche",
    "profileId": "gravity",
    "name": {
      "en": "Upalanche",
      "pt": "Avalanche Ascendente"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 73,
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
            "option": "Cloud",
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Damage (bludgeoning) • 3",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "gravity-gravity-field",
    "profileId": "gravity",
    "name": {
      "en": "Gravity Field",
      "pt": "Campo Gravitacional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Area · Limited Direction — Choose the specified pulling direction.",
      "pt": "Mover Objetos · Área · Direção Limitada — Use a direção de atração indicada pelo poder."
    },
    "page": 73,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_direction",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Burst Area Move Object (gravity), Limited to Pulling Downwards • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-crushing-gravity-field",
    "profileId": "gravity",
    "name": {
      "en": "Crushing Gravity Field",
      "pt": "Campo Gravitacional Esmagador"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Area · Limited Direction · Damaging — Choose the specified pulling direction.",
      "pt": "Mover Objetos · Área · Direção Limitada · Causar Dano — Use a direção de atração indicada pelo poder."
    },
    "page": 73,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_direction",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "damaging",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Burst Area Move Object (gravity), Limited to Pulling Downwards, Damaging • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "gravity-null-g-field",
    "profileId": "gravity",
    "name": {
      "en": "Null-G Field",
      "pt": "Campo de Gravidade Zero"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Area · Limited Direction — Choose the specified pulling direction.",
      "pt": "Mover Objetos · Área · Direção Limitada — Use a direção de atração indicada pelo poder."
    },
    "page": 73,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_direction",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Burst Area Move Object, Limited to Lifting Upwards • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-singularity",
    "profileId": "gravity",
    "name": {
      "en": "Singularity",
      "pt": "Singularidade"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Area · Limited Direction · Damaging — Choose the specified pulling direction.",
      "pt": "Mover Objetos · Área · Direção Limitada · Causar Dano — Use a direção de atração indicada pelo poder."
    },
    "page": 73,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 2,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_direction",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "damaging",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Burst Area 2 Damaging Move Object, Limited to Pulling Towards the Center of the Area • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "gravity-gravitic-containment",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Containment",
      "pt": "Contenção Gravitacional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Nullify · Reaction",
      "pt": "Anulação · Reação"
    },
    "page": 74,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Explosions"
        }
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Nullify Explosions, Reaction • 4 points",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "gravity-gravitic-deflection",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Deflection",
      "pt": "Deflexão Gravitacional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect",
      "pt": "Deflexão"
    },
    "page": 74,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Deflect • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "gravity-gravitic-immunity",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Immunity",
      "pt": "Imunidade Gravitacional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 74,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Immunity 2 (Gravity Effects) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "gravity-gravitic-shield",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Shield",
      "pt": "Escudo Gravitacional"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained",
      "pt": "Proteção · Impenetrável · Sustentado"
    },
    "page": 74,
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
      "Gravity"
    ],
    "audit": {
      "formula": "Impervious Protection, Sustained • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-anti-gravity",
    "profileId": "gravity",
    "name": {
      "en": "Anti-Gravity",
      "pt": "Antigravidade"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Subtle",
      "pt": "Voo · Sutil"
    },
    "page": 74,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Flight, Subtle • 1 point + 2 points per rank",
      "fixed": 1,
      "perRank": 2
    }
  },
  {
    "id": "gravity-directional-pull",
    "profileId": "gravity",
    "name": {
      "en": "Directional Pull",
      "pt": "Tração Direcional"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 74,
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
      "Gravity"
    ],
    "audit": {
      "formula": "Movement (Wall-Crawling) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-free-fall",
    "profileId": "gravity",
    "name": {
      "en": "Free Fall",
      "pt": "Queda Livre"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 74,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Safe Fall"
        }
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Movement 1 (Safe Fall) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "gravity-free-fall-adaptation",
    "profileId": "gravity",
    "name": {
      "en": "Free Fall Adaptation",
      "pt": "Adaptação à Queda Livre"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 74,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Environmental Adaptation: Zero Gravity"
        }
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Movement 1 (Environmental Adaptation—Zero Gravity) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "gravity-high-gravity-adaptation",
    "profileId": "gravity",
    "name": {
      "en": "High-Gravity Adaptation",
      "pt": "Adaptação à Alta Gravidade"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 74,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Environmental Adaptation: High Gravity"
        }
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Movement 1 (Environmental Adaptation—High-Gravity) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "gravity-gravity-warp",
    "profileId": "gravity",
    "name": {
      "en": "Gravity Warp",
      "pt": "Dobra Gravitacional"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport",
      "pt": "Teleporte"
    },
    "page": 74,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Teleport • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-low-g-leap",
    "profileId": "gravity",
    "name": {
      "en": "Low-G Leap",
      "pt": "Salto de Baixa Gravidade"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 75,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "gravity-artificial-gravity",
    "profileId": "gravity",
    "name": {
      "en": "Artificial Gravity",
      "pt": "Gravidade Artificial"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 75,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Negate Impeded Movement"
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Environment (negate impeded movement due to gravity) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "gravity-gravikinesis",
    "profileId": "gravity",
    "name": {
      "en": "Gravikinesis",
      "pt": "Gravicinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 75,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Move Object • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "gravity-gravitic-communication",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Communication",
      "pt": "Comunicação Gravitacional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Communication · Area · Subtle",
      "pt": "Comunicação · Área · Sutil"
    },
    "page": 75,
    "components": [
      {
        "effectId": "communication",
        "ranks": 5,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Communication 5, Area, Subtle 1 • 26 points",
      "fixed": 26,
      "perRank": 0
    }
  },
  {
    "id": "gravity-gravitic-sense",
    "profileId": "gravity",
    "name": {
      "en": "Gravitic Sense",
      "pt": "Sentido Gravitacional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 75,
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
            "detail": "Gravity"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Gravity"
    ],
    "audit": {
      "formula": "Senses (Detect Gravity, Ranged) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "gravity-low-g-lifting",
    "profileId": "gravity",
    "name": {
      "en": "Low-G Lifting",
      "pt": "Erguer com Baixa Gravidade"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Limited",
      "pt": "Traço Aprimorado · Limitado"
    },
    "page": 75,
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
      "Gravity"
    ],
    "audit": {
      "formula": "Enhanced Strength, Limited to Lifting • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  }
] satisfies PowerTemplate[];
