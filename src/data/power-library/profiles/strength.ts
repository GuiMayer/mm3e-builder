import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "strength-bullet-toss",
    "profileId": "strength",
    "name": {
      "en": "Bullet Toss",
      "pt": "Arremesso Balístico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Quirk",
      "pt": "Dano · Alcance Aumentado · Peculiaridade"
    },
    "page": 177,
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
      "Strength"
    ],
    "audit": {
      "formula": "Ranged Damage (ballistic), Quirk (requires objects to throw, –1 point) • 1 point for rank 1, +2 points per additional rank",
      "fixed": -1,
      "perRank": 2
    }
  },
  {
    "id": "strength-cracking-the-whip",
    "profileId": "strength",
    "name": {
      "en": "Cracking the Whip",
      "pt": "Estalar o Chicote"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Extra Condition · Limited Degree · Limited · Alternate Resistance",
      "pt": "Aflição · Área · Condição Extra · Graus Limitados · Limitado · Resistência Alternativa"
    },
    "page": 177,
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
      "Strength"
    ],
    "audit": {
      "formula": "Line Area Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed and Vulnerable, Prone and Stunned), Extra Condition, Limited Degree, Limited to targets on an appropriate surface • 1 point per rank, +1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-shockwave",
    "profileId": "strength",
    "name": {
      "en": "Shockwave",
      "pt": "Onda de Choque"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Extra Condition · Limited Degree · Limited · Alternate Resistance",
      "pt": "Aflição · Área · Condição Extra · Graus Limitados · Limitado · Resistência Alternativa"
    },
    "page": 177,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
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
      "Strength"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed and Vulnerable, Stunned and Prone), Extra Condition, Limited Degree, Limited to targets on the ground • 1 point per rank, +1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-cutting-loose",
    "profileId": "strength",
    "name": {
      "en": "Cutting Loose",
      "pt": "Liberar Força"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 177,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Penetrating on existing Strength Damage"
        }
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Penetrating on Strength Damage • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-finger-flick",
    "profileId": "strength",
    "name": {
      "en": "Finger Flick",
      "pt": "Estalo de Dedo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Subtle",
      "pt": "Dano · Sutil"
    },
    "page": 177,
    "components": [
      {
        "effectId": "damage",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Subtle 1 on Strength Damage • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "strength-massive-knockback",
    "profileId": "strength",
    "name": {
      "en": "Massive Knockback",
      "pt": "Repulsão Massiva"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Reduced Range · Limited Direction · Linked",
      "pt": "Mover Objetos · Alcance Reduzido · Direção Limitada · Vinculado"
    },
    "page": 177,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reduced_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_direction",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Move Object, Close Range, Limited to Flinging Targets Away, Linked to Strength Damage • 1 point",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "strength-sleeper-hold",
    "profileId": "strength",
    "name": {
      "en": "Sleeper Hold",
      "pt": "Mata-leão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Progressive · Grab-Based",
      "pt": "Aflição · Progressivo · Baseado em Agarrar"
    },
    "page": 178,
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
            "modifierId": "grab_based",
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
      "Strength"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Progressive, Grab-Based • 2",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "strength-thunderclap",
    "profileId": "strength",
    "name": {
      "en": "Thunderclap",
      "pt": "Palma Trovejante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Extra Condition · Limited Degree",
      "pt": "Aflição · Área · Condição Extra · Graus Limitados"
    },
    "page": 178,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted by Fortitude, Overcome by Fortitude; Dazed and Vulnerable, Defenseless and Stunned), Extra Condition, Limited Degree • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "strength-bracing",
    "profileId": "strength",
    "name": {
      "en": "Bracing",
      "pt": "Firmar-se"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Sustained",
      "pt": "Imunidade · Sustentado"
    },
    "page": 178,
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
      "Strength"
    ],
    "audit": {
      "formula": "Immunity 10 (being moved), Sustained • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "strength-stonewall",
    "profileId": "strength",
    "name": {
      "en": "Stonewall",
      "pt": "Muralha"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Damage · Reaction · Limited",
      "pt": "Dano · Reação · Limitado"
    },
    "page": 178,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
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
      "Strength"
    ],
    "audit": {
      "formula": "Reaction Damage (to being hit), Limited to effect rank or attack’s Damage rank, whichever is less • 3 points",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "strength-super-endurance",
    "profileId": "strength",
    "name": {
      "en": "Super-Endurance",
      "pt": "Super-resistência"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Quirk",
      "pt": "Imunidade · Peculiaridade"
    },
    "page": 178,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
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
      "Strength"
    ],
    "audit": {
      "formula": "Immunity 10 (Life Support), Quirk (limited to approximately 30 minutes at a time, –1 point) • 9 points",
      "fixed": 9,
      "perRank": 0
    }
  },
  {
    "id": "strength-super-toughness",
    "profileId": "strength",
    "name": {
      "en": "Super-Toughness",
      "pt": "Superdureza"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection",
      "pt": "Proteção"
    },
    "page": 179,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-tug-of-war",
    "profileId": "strength",
    "name": {
      "en": "Tug of War",
      "pt": "Cabo de Guerra"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 179,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra (3 PP)",
        "fieldValues": {
          "trait": "Reaction on existing Strength Damage"
        }
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Reaction on Strength Damage (when grabbed) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "strength-makeshift-handholds",
    "profileId": "strength",
    "name": {
      "en": "Makeshift Handholds",
      "pt": "Apoios Improvisados"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 179,
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
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Movement 1 (Wall-crawling), Limited to surfaces with material Toughness less than Strength modifier • 1 point per rank",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "strength-super-leaping",
    "profileId": "strength",
    "name": {
      "en": "Super-Leaping",
      "pt": "Supersalto"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 179,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Strength"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-unstoppable",
    "profileId": "strength",
    "name": {
      "en": "Unstoppable",
      "pt": "Imparável"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing · Penetrating",
      "pt": "Escavação · Penetrante"
    },
    "page": 179,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "penetrating",
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
      "Strength"
    ],
    "audit": {
      "formula": "Penetrating Burrowing • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "strength-power-lifting",
    "profileId": "strength",
    "name": {
      "en": "Power-Lifting",
      "pt": "Erguer Peso"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Limited",
      "pt": "Traço Aprimorado · Limitado"
    },
    "page": 179,
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
      "Strength"
    ],
    "audit": {
      "formula": "Enhanced Strength, Limited to Lifting • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-strength-boost",
    "profileId": "strength",
    "name": {
      "en": "Strength Boost",
      "pt": "Aumento de Força"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Fades",
      "pt": "Traço Aprimorado · Desgaste"
    },
    "page": 179,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "fades",
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
      "Strength"
    ],
    "audit": {
      "formula": "Enhanced Strength, Fades • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "strength-absorption-boost",
    "profileId": "strength",
    "name": {
      "en": "Absorption Boost",
      "pt": "Aumento por Absorção"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Limited",
      "pt": "Traço Aprimorado · Desgaste · Limitado"
    },
    "page": 180,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "fades",
            "ranks": 1,
            "isPowerSpecific": false
          },
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
      "Strength"
    ],
    "audit": {
      "formula": "Enhanced Strength, Fades, Limited to the lesser of effect rank or absorbed energy rank • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "strength-raging-strength",
    "profileId": "strength",
    "name": {
      "en": "Raging Strength",
      "pt": "Força da Fúria"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Limited",
      "pt": "Traço Aprimorado · Limitado"
    },
    "page": 180,
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
      "Strength"
    ],
    "audit": {
      "formula": "Enhanced Strength, Limited to while angry • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  }
] satisfies PowerTemplate[];
