import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "magnetic-magnetic-binding",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Binding",
      "pt": "Aprisionamento Magnético"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Extra Condition · Limited Degree · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Condição Extra · Graus Limitados · Resistência Alternativa"
    },
    "page": 116,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Strength; Hindered and Vulnerable, Defenseless and Immobile), Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "magnetic-magnetic-blast",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Blast",
      "pt": "Rajada Magnética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 116,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Ranged Damage (magnetic force) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "magnetic-magnetic-repulsion",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Repulsion",
      "pt": "Repulsão Magnética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Limited Direction",
      "pt": "Mover Objetos · Direção Limitada"
    },
    "page": 116,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Move Object, Limited to Flinging Targets Away • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "magnetic-magnetic-seizure",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Seizure",
      "pt": "Convulsão Magnética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Subtle",
      "pt": "Aflição · Alcance Aumentado · Sutil"
    },
    "page": 116,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Dazed, Stunned, Incapacitated), Subtle •",
      "fixed": 1,
      "perRank": 3
    }
  },
  {
    "id": "magnetic-railgun",
    "profileId": "magnetic",
    "name": {
      "en": "Railgun",
      "pt": "Canhão Eletromagnético"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Quirk",
      "pt": "Dano · Alcance Aumentado · Peculiaridade"
    },
    "page": 116,
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
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Ranged Damage (projectile), Quirk (requires objects as ammo, –1 point) • 1 point for rank 1 + 2 points per rank",
      "fixed": -1,
      "perRank": 2
    }
  },
  {
    "id": "magnetic-magnetic-deflection",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Deflection",
      "pt": "Deflexão Magnética"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Increased Range · Limited",
      "pt": "Deflexão · Alcance Aumentado · Limitado"
    },
    "page": 116,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Perception Ranged Deflect, Limited to Metallic Attacks • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "magnetic-magnetic-immunity",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Immunity",
      "pt": "Imunidade Magnética"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 116,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Immunity 5 (magnetic effects) • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-shield",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Shield",
      "pt": "Escudo Magnético"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 117,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "magnetic-magnetic-cling-1",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Cling — 1",
      "pt": "Aderência Magnética — 1"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Quirk",
      "pt": "Movimento · Peculiaridade"
    },
    "page": 117,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Movement (Wall-Crawling), Quirk (Only Magnetic Surfaces, –1 point) • 1 point (rank 1) or 3 points",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-cling-2",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Cling — 2",
      "pt": "Aderência Magnética — 2"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Quirk",
      "pt": "Movimento · Peculiaridade"
    },
    "page": 117,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Movement (Wall-Crawling), Quirk (Only Magnetic Surfaces, –1 point) • 1 point (rank 1) or 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-flight",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Flight",
      "pt": "Voo Magnético"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Subtle",
      "pt": "Voo · Sutil"
    },
    "page": 117,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Flight, Subtle • 1 point + 2 points per rank",
      "fixed": 1,
      "perRank": 2
    }
  },
  {
    "id": "magnetic-magnetic-levitation",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Levitation",
      "pt": "Levitação Magnética"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Speed",
      "pt": "Movimento · Velocidade"
    },
    "page": 117,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [],
        "fieldValues": {
          "movement": [
            "Sure-Footed",
            "Trackless",
            "Water Walking"
          ]
        }
      },
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Movement 3 (Sure-Footed, Trackless, Water Walking), Speed • 6 points + 1 point per rank",
      "fixed": 6,
      "perRank": 1
    }
  },
  {
    "id": "magnetic-magnoport",
    "profileId": "magnetic",
    "name": {
      "en": "Magnoport",
      "pt": "Magnaporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport",
      "pt": "Teleporte"
    },
    "page": 117,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Teleport • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "magnetic-degauss",
    "profileId": "magnetic",
    "name": {
      "en": "Degauss",
      "pt": "Desmagnetizar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Simultaneous",
      "pt": "Anulação · Simultâneo"
    },
    "page": 117,
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
          "descriptor": "Magnetism"
        }
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Nullify Magnetism, Simultaneous • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "magnetic-degauss-burst-burst",
    "profileId": "magnetic",
    "name": {
      "en": "Degauss Burst — Burst",
      "pt": "Explosão Desmagnetizante — Explosão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Simultaneous · Area",
      "pt": "Anulação · Simultâneo · Área"
    },
    "page": 117,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Magnetism"
        }
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Nullify Magnetism, Simultaneous, Burst or Cone Area • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "magnetic-degauss-burst-cone",
    "profileId": "magnetic",
    "name": {
      "en": "Degauss Burst — Cone",
      "pt": "Explosão Desmagnetizante — Cone"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Simultaneous · Area",
      "pt": "Anulação · Simultâneo · Área"
    },
    "page": 117,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cone",
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Magnetism"
        }
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Nullify Magnetism, Simultaneous, Burst or Cone Area • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "magnetic-ferrokinesis",
    "profileId": "magnetic",
    "name": {
      "en": "Ferrokinesis",
      "pt": "Ferrocinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Perception · Limited",
      "pt": "Mover Objetos · Percepção · Limitado"
    },
    "page": 117,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Perception Ranged Move Object, Limited to Ferrous Metals • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "magnetic-magnetize",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetize",
      "pt": "Magnetizar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Area · Limited · Limited Direction",
      "pt": "Mover Objetos · Área · Limitado · Direção Limitada"
    },
    "page": 118,
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
            "modifierId": "limited",
            "ranks": 1,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Burst Area Move Object, Limited to Ferrous Metals, One Direction (Attract or Repel) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "magnetic-magnetic-encoding",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Encoding",
      "pt": "Codificação Magnética"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend · Limited",
      "pt": "Compreensão · Limitado"
    },
    "page": 118,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Comprehend 2 (Machines), Limited to Encoding Information • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-reading",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Reading",
      "pt": "Leitura Magnética"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend · Limited",
      "pt": "Compreensão · Limitado"
    },
    "page": 118,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Comprehend 2 (Machines), Limited to Reading Information • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-form",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Form",
      "pt": "Forma Magnética"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Flight · Immunity · Insubstantial · Move Object · Limited",
      "pt": "Camuflagem · Voo · Imunidade · Insubstancial · Mover Objetos · Limitado"
    },
    "page": 118,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      },
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": []
      },
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      },
      {
        "effectId": "move-object",
        "ranks": 1,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Concealment 4 (All Visual), Flight 1, Immunity 10 (Life Support), Insubstantial 4 (Incorporeal), Move Object 1 (Limited to Ferrous Metals) • 41 points",
      "fixed": 41,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-interference",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Interference",
      "pt": "Interferência Magnética"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Area · Increased Range · Attack",
      "pt": "Camuflagem · Área · Alcance Aumentado · Ataque"
    },
    "page": 118,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "radio"
          ]
        }
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Burst Area Ranged Concealment Attack 2 (all magnetic and radio) • 8 points, +1 point per +1 distance rank to area.",
      "fixed": 8,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-radar",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Radar",
      "pt": "Radar Magnético"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 118,
    "components": [
      {
        "effectId": "senses",
        "ranks": 5,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Radio",
            "detail": "Objects"
          },
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Radio"
          },
          {
            "id": "radius",
            "ranks": 1,
            "senseType": "Radio"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Radio"
          }
        ]
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Senses 5 (magnetic; Detect Objects, Accurate, Radius, Ranged) • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-sense",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Sense",
      "pt": "Sentido Magnético"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 118,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Radio",
            "detail": "Magnetic fields"
          },
          {
            "id": "radius",
            "ranks": 1,
            "senseType": "Radio"
          }
        ]
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Senses 2 (Detect Magnetic Fields, Radius) •",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-magnetic-scan",
    "profileId": "magnetic",
    "name": {
      "en": "Magnetic Scan",
      "pt": "Varredura Magnética"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 118,
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
      "Magnetic"
    ],
    "audit": {
      "formula": "Senses 4 (Vision Penetrates Concealment) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "magnetic-shape-metal",
    "profileId": "magnetic",
    "name": {
      "en": "Shape Metal",
      "pt": "Moldar Metal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Transform · Continuous",
      "pt": "Transformação · Contínuo"
    },
    "page": 118,
    "components": [
      {
        "effectId": "transform",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "continuous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "variableCostOption": "One to one (e.g. metal to wood)"
      }
    ],
    "descriptors": [
      "Magnetic"
    ],
    "audit": {
      "formula": "Transform (ferrous metal from one shape to another), Continuous • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  }
] satisfies PowerTemplate[];
