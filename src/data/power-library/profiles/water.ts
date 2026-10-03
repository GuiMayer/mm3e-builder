import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "water-blinding-splash",
    "profileId": "water",
    "name": {
      "en": "Blinding Splash",
      "pt": "Jato Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado · Resistência Alternativa"
    },
    "page": 208,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Water"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-dehydrate",
    "profileId": "water",
    "name": {
      "en": "Dehydrate",
      "pt": "Desidratar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative",
      "pt": "Aflição · Cumulativo"
    },
    "page": 208,
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
      "Water"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Fatigued, Exhausted, Incapacitated), Resisted and Overcome by Fortitude • 2",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-drown",
    "profileId": "water",
    "name": {
      "en": "Drown",
      "pt": "Afogar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Concentration",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Concentration"
    },
    "page": 208,
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
            "modifierId": "concentration_affliction",
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
      "Water"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated), Concentration • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "water-tsunami",
    "profileId": "water",
    "name": {
      "en": "Tsunami",
      "pt": "Tsunami"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area · Limited",
      "pt": "Dano · Alcance Aumentado · Área · Limitado"
    },
    "page": 208,
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
            "ranks": 7,
            "option": "Line",
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Ranged Damage, Line Area 7 (250 feet long, 60 feet inland), Limited to Along Shoreline, Limited to Originating from Bodies of Water • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    }
  },
  {
    "id": "water-water-blast",
    "profileId": "water",
    "name": {
      "en": "Water Blast",
      "pt": "Rajada de Água"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 208,
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
      "Water"
    ],
    "audit": {
      "formula": "Ranged Damage (water impact) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-water-cannon",
    "profileId": "water",
    "name": {
      "en": "Water Cannon",
      "pt": "Canhão de Água"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Limited Degree · Alternate Resistance",
      "pt": "Aflição · Área · Cumulativo · Graus Limitados · Resistência Alternativa"
    },
    "page": 208,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
            "isPowerSpecific": false
          },
          {
            "modifierId": "cumulative",
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
      "Water"
    ],
    "audit": {
      "formula": "Line Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed, Prone), Limited Degree; 5 feet wide, 30 feet long • 2 points per rank + 1 point",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-water-weapon",
    "profileId": "water",
    "name": {
      "en": "Water Weapon",
      "pt": "Arma de Água"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 208,
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
      "Water"
    ],
    "audit": {
      "formula": "Strength-based Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "water-aquatic-regeneration",
    "profileId": "water",
    "name": {
      "en": "Aquatic Regeneration",
      "pt": "Regeneração Aquática"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration · Source",
      "pt": "Regeneração · Fonte"
    },
    "page": 208,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "source",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Regeneration, Medium (Water) • 1",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "water-fire-resistance",
    "profileId": "water",
    "name": {
      "en": "Fire Resistance",
      "pt": "Resistência ao Fogo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Half Effect",
      "pt": "Imunidade · Metade do Efeito"
    },
    "page": 209,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "half_effect",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Immunity 10 (Fire Effects), Limited to Half Effect • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "water-mist",
    "profileId": "water",
    "name": {
      "en": "Mist",
      "pt": "Névoa"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 209,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-5)"
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Environment (Limited Visibility) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-wall-of-water",
    "profileId": "water",
    "name": {
      "en": "Wall of Water",
      "pt": "Muralha de Água"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Create · Limited",
      "pt": "Criação · Limitado"
    },
    "page": 209,
    "components": [
      {
        "effectId": "create",
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
      "Water"
    ],
    "audit": {
      "formula": "Create Barrier, Limited to Walls • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "water-water-shaping",
    "profileId": "water",
    "name": {
      "en": "Water Shaping",
      "pt": "Moldar Água"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 209,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Create Water Shapes • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-waterproof",
    "profileId": "water",
    "name": {
      "en": "Waterproof",
      "pt": "À Prova de Água"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 209,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Immunity 10 (Water Effects) • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "water-water-shield",
    "profileId": "water",
    "name": {
      "en": "Water Shield",
      "pt": "Escudo de Água"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained",
      "pt": "Proteção · Impenetrável · Sustentado"
    },
    "page": 209,
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
      "Water"
    ],
    "audit": {
      "formula": "Impervious Protection, Sustained • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-aqua-port",
    "profileId": "water",
    "name": {
      "en": "Aqua-Port",
      "pt": "Aquaporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium",
      "pt": "Teleporte · Meio"
    },
    "page": 209,
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
      "Water"
    ],
    "audit": {
      "formula": "Teleport, Medium (Bodies of Water) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "water-dolphin-leap",
    "profileId": "water",
    "name": {
      "en": "Dolphin Leap",
      "pt": "Salto de Golfinho"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping · Limited",
      "pt": "Salto · Limitado"
    },
    "page": 209,
    "components": [
      {
        "effectId": "leaping",
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
      "Water"
    ],
    "audit": {
      "formula": "Leaping, Limited to Leaping From Water • 1",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "water-swimming",
    "profileId": "water",
    "name": {
      "en": "Swimming",
      "pt": "Natação"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Swimming",
      "pt": "Natação"
    },
    "page": 209,
    "components": [
      {
        "effectId": "swimming",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Swimming • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "water-water-walking",
    "profileId": "water",
    "name": {
      "en": "Water Walking",
      "pt": "Caminhar na Água"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 209,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Water Walking"
        }
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Movement 1 (Water-Walking) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "water-aqua-healing",
    "profileId": "water",
    "name": {
      "en": "Aqua-Healing",
      "pt": "Cura Aquática"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing",
      "pt": "Cura"
    },
    "page": 209,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Healing • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-aquatic",
    "profileId": "water",
    "name": {
      "en": "Aquatic",
      "pt": "Aquático"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Movement · Senses",
      "pt": "Imunidade · Movimento · Sentidos"
    },
    "page": 209,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 3,
        "modifiers": []
      },
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Environmental Adaptation: Aquatic"
        }
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "low_light_vision",
            "ranks": 1
          }
        ]
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Immunity 3 (Cold, Drowning, Pressure), Movement 1 (Environmental Adaptation: Aquatic), Senses 1 (Low-light Vision) • 6 points",
      "fixed": 6,
      "perRank": 0
    }
  },
  {
    "id": "water-aquatic-advantage",
    "profileId": "water",
    "name": {
      "en": "Aquatic Advantage",
      "pt": "Vantagem Aquática"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 209,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Favored Environment: Aquatic"
        }
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Add Enhanced Advantage (Favored Environment: Aquatic) to the previous power • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "water-dousing",
    "profileId": "water",
    "name": {
      "en": "Dousing",
      "pt": "Apagar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Broad · Simultaneous",
      "pt": "Anulação · Amplo · Simultâneo"
    },
    "page": 210,
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
          "descriptor": "Water soluble effects"
        }
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Nullify Water-Soluble Effects, Broad, Simultaneous •",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "water-hydrokinesis",
    "profileId": "water",
    "name": {
      "en": "Hydrokinesis",
      "pt": "Hidrocinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Perception · Limited",
      "pt": "Mover Objetos · Percepção · Limitado"
    },
    "page": 210,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Move Object, Perception Range, Limited to Water • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "water-marine-mastery",
    "profileId": "water",
    "name": {
      "en": "Marine Mastery",
      "pt": "Domínio Marinho"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Horde · Mental Link · Multiple Minions (per effect rank) · Variable Type (General) · Limited · Self-Powered",
      "pt": "Invocar · Horda · Mental Link · Múltiplos Lacaios (por graduação do efeito) · Variable Type (General) · Limitado · Deslocamento Próprio"
    },
    "page": 210,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "horde",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "mental_link",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "multiple_minions_ranked",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "variable_type_general",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Water"
    ],
    "audit": {
      "formula": "Summon Marine Life, Horde, Mental Link, Multiple Minions, Variable General Type (Marine Life), Limited to in or near water, Self-Powered (see the Summoning Powers section) • 1 point + 4 points per rank,",
      "fixed": 1,
      "perRank": 4
    }
  },
  {
    "id": "water-marine-telepathy",
    "profileId": "water",
    "name": {
      "en": "Marine Telepathy",
      "pt": "Telepatia Marinha"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend · Limited",
      "pt": "Compreensão · Limitado"
    },
    "page": 210,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 2,
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
      "Water"
    ],
    "audit": {
      "formula": "Comprehend 2 (Animals), Limited to Marine Life • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "water-water-creatures",
    "profileId": "water",
    "name": {
      "en": "Water Creatures",
      "pt": "Criaturas de Água"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon",
      "pt": "Invocar"
    },
    "page": 210,
    "components": [
      {
        "effectId": "summon",
        "ranks": 8,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Summon Water Creature 8 • 120-point",
      "fixed": 16,
      "perRank": 0
    }
  },
  {
    "id": "water-water-form",
    "profileId": "water",
    "name": {
      "en": "Water Form",
      "pt": "Forma de Água"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Limited · Immunity · Insubstantial · Swimming",
      "pt": "Camuflagem · Limitado · Imunidade · Insubstancial · Natação"
    },
    "page": 210,
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
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 2,
        "modifiers": []
      },
      {
        "effectId": "swimming",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Concealment 4 (Visual, Limited to Underwater), Immunity 30 (Fortitude Effects), Insubstantial 2, Swimming 2 (2 MPH), Activation (Move Action, –1 point) • 45 points +1 point per additional Swimming rank for underwater movement.",
      "fixed": 45,
      "perRank": 0
    },
    "activation": "move"
  },
  {
    "id": "water-amass-water",
    "profileId": "water",
    "name": {
      "en": "Amass Water",
      "pt": "Acumular Água"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Growth · Limited",
      "pt": "Crescimento · Limitado"
    },
    "page": 210,
    "components": [
      {
        "effectId": "growth",
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
      "Water"
    ],
    "audit": {
      "formula": "Growth, Limited to While in Water Form and in a large body of water • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "water-water-scrying",
    "profileId": "water",
    "name": {
      "en": "Water Scrying",
      "pt": "Vidência pela Água"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Medium",
      "pt": "Sensoriamento Remoto · Meio"
    },
    "page": 210,
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
        "variableCostOption": "Three sense types"
      }
    ],
    "descriptors": [
      "Water"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual and Auditory), Medium (Water) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  }
] satisfies PowerTemplate[];
