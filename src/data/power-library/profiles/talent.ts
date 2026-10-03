import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "talent-fearsome-presence",
    "profileId": "talent",
    "name": {
      "en": "Fearsome Presence",
      "pt": "Presença Aterrorizante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Selective · Subtle · Check Required",
      "pt": "Aflição · Área · Seletivo · Sutil · Teste Necessário"
    },
    "page": 187,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Perception",
            "options": {
              "includesSenseDependent": true
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "selective",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "check_required",
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
      "Talent"
    ],
    "audit": {
      "formula": "Perception (Visual) Area Affliction (Resisted and Overcome by Will; Impaired, Disabled, Paralyzed), Selective, Subtle, Intimidation Check Required (DC 11) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "talent-flurry",
    "profileId": "talent",
    "name": {
      "en": "Flurry",
      "pt": "Rajada de Ataques"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Variable Descriptor",
      "pt": "Traço Aprimorado · Descritor Variável"
    },
    "page": 187,
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
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Multiattack on existing attack"
        }
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Multiattack, Variable Descriptor 2 (any attack effect you wield, only up to the attack’s rank) • 2 points +1 point per rank",
      "fixed": 2,
      "perRank": 1
    }
  },
  {
    "id": "talent-hurt-anything",
    "profileId": "talent",
    "name": {
      "en": "Hurt Anything",
      "pt": "Ferir Qualquer Coisa"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Variable Descriptor",
      "pt": "Traço Aprimorado · Descritor Variável"
    },
    "page": 187,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Penetrating on existing Damage"
        }
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Penetrating, Variable Descriptor (any Damage Effect you wield) • 1 point +1 point per rank",
      "fixed": 1,
      "perRank": 1
    }
  },
  {
    "id": "talent-pressure-points",
    "profileId": "talent",
    "name": {
      "en": "Pressure Points",
      "pt": "Pontos de Pressão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction",
      "pt": "Aflição"
    },
    "page": 187,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Affliction (Dazed, Stunned, Incapacitated), Resisted and Overcome by Fortitude • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "talent-striking-power",
    "profileId": "talent",
    "name": {
      "en": "Striking Power",
      "pt": "Poder de Golpe"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 187,
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
      "Talent"
    ],
    "audit": {
      "formula": "Strength-based Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "talent-acquired-immunity",
    "profileId": "talent",
    "name": {
      "en": "Acquired Immunity",
      "pt": "Imunidade Adquirida"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Half Effect",
      "pt": "Imunidade · Metade do Efeito"
    },
    "page": 187,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
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
      "Talent"
    ],
    "audit": {
      "formula": "Immunity 2 (diseases and poisons), Limited to Half Effect • 1 point",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-perfect-defense-40",
    "profileId": "talent",
    "name": {
      "en": "Perfect Defense — 40",
      "pt": "Defesa Perfeita — 40"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Concentration",
      "pt": "Imunidade · Concentração"
    },
    "page": 188,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 40,
        "modifiers": [
          {
            "modifierId": "concentration",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Immunity 40 (attacks targeting Dodge or Parry), Concentration Duration • 20 points (40 for both)",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "talent-perfect-defense-80",
    "profileId": "talent",
    "name": {
      "en": "Perfect Defense — 80",
      "pt": "Defesa Perfeita — 80"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Concentration",
      "pt": "Imunidade · Concentração"
    },
    "page": 188,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 80,
        "modifiers": [
          {
            "modifierId": "concentration",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Immunity 40 (attacks targeting Dodge or Parry), Concentration Duration • 20 points (40 for both)",
      "fixed": 40,
      "perRank": 0
    }
  },
  {
    "id": "talent-tough",
    "profileId": "talent",
    "name": {
      "en": "Tough",
      "pt": "Resistente"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection",
      "pt": "Proteção"
    },
    "page": 188,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "talent-unfazeable",
    "profileId": "talent",
    "name": {
      "en": "Unfazeable",
      "pt": "Imperturbável"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 188,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Immunity 5 (Interaction Skills) • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "talent-parkour",
    "profileId": "talent",
    "name": {
      "en": "Parkour",
      "pt": "Parkour"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 188,
    "components": [
      {
        "effectId": "movement",
        "ranks": 5,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "affectedRanks": 4,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": [
            "Urban Adaptation",
            "Safe Fall",
            "Sure-Footed 2",
            "Wall-Crawling"
          ]
        }
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Movement 5 (Environmental Adaptation (Urban), Safe Fall, Sure-Footed 2, Wall-Crawling 1), Limited to Moving in Urban Environments (4 ranks) • 6 points",
      "fixed": 6,
      "perRank": 0
    }
  },
  {
    "id": "talent-perfect-balance",
    "profileId": "talent",
    "name": {
      "en": "Perfect Balance",
      "pt": "Equilíbrio Perfeito"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 188,
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
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Movement 2 (Wall-crawling 2), Limited to upright movement • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "talent-speed-climbing",
    "profileId": "talent",
    "name": {
      "en": "Speed-Climbing",
      "pt": "Escalada Rápida"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Check Required",
      "pt": "Movimento · Teste Necessário"
    },
    "page": 188,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "check_required",
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
      "Talent"
    ],
    "audit": {
      "formula": "Movement 1 (Wall-crawling 1), Athletics Check Required (DC 11) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-speed-swimming",
    "profileId": "talent",
    "name": {
      "en": "Speed-Swimming",
      "pt": "Natação Rápida"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Swimming",
      "pt": "Natação"
    },
    "page": 188,
    "components": [
      {
        "effectId": "swimming",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Swimming 1 • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-vaulting",
    "profileId": "talent",
    "name": {
      "en": "Vaulting",
      "pt": "Salto Acrobático"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping · Check Required",
      "pt": "Salto · Teste Necessário"
    },
    "page": 188,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "check_required",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Leaping 2, Acrobatics Check Required (DC 11) • 1",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-triple-jointed",
    "profileId": "talent",
    "name": {
      "en": "Triple-Jointed",
      "pt": "Articulações Flexíveis"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Shrinking · Innate · Concentration · Check Required",
      "pt": "Encolhimento · Inato · Concentração · Teste Necessário"
    },
    "page": 188,
    "components": [
      {
        "effectId": "shrinking",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "innate",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "concentration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "check_required",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Shrinking 4, Innate, Concentration, Acrobatics or Sleight of Hand Check Required (DC 12) • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "talent-perfect-pitch",
    "profileId": "talent",
    "name": {
      "en": "Perfect Pitch",
      "pt": "Ouvido Absoluto"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 188,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "analytical",
            "ranks": 1,
            "senseType": "Auditory"
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Senses 1 (Analytical Auditory) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-refined-palate",
    "profileId": "talent",
    "name": {
      "en": "Refined Palate",
      "pt": "Paladar Refinado"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 188,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Olfactory"
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Senses 1 (Acute Taste) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-sensitive-smell",
    "profileId": "talent",
    "name": {
      "en": "Sensitive Smell",
      "pt": "Olfato Sensível"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 188,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Olfactory"
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Senses 1 (Acute Olfactory) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-ambidexterous",
    "profileId": "talent",
    "name": {
      "en": "Ambidexterous",
      "pt": "Ambidestro"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature",
      "pt": "Característica"
    },
    "page": 189,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Feature 1 (no circumstance penalties for off-hand use) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-light-sleeper",
    "profileId": "talent",
    "name": {
      "en": "Light Sleeper",
      "pt": "Sono Leve"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature",
      "pt": "Característica"
    },
    "page": 189,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Feature 1 (ignore hearing penalties for sleeping) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-at-a-glance",
    "profileId": "talent",
    "name": {
      "en": "At a Glance",
      "pt": "Num Relance"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 189,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "rapid",
            "ranks": 1,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Senses 1 (Rapid Vision) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-brilliant-deduction",
    "profileId": "talent",
    "name": {
      "en": "Brilliant Deduction",
      "pt": "Dedução Brilhante"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Check Required",
      "pt": "Sentidos · Teste Necessário"
    },
    "page": 189,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "check_required",
            "ranks": 2,
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
      "Talent"
    ],
    "audit": {
      "formula": "Senses 4 (Postcognition), Investigation Check Required (DC 12) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "talent-daredevil",
    "profileId": "talent",
    "name": {
      "en": "Daredevil",
      "pt": "Temerário"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Luck Control",
      "pt": "Controle da Sorte"
    },
    "page": 189,
    "components": [
      {
        "effectId": "luck-control",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Luck Control • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "talent-eagle-eyed",
    "profileId": "talent",
    "name": {
      "en": "Eagle-Eyed",
      "pt": "Olhos de Águia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 189,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "extended",
            "ranks": 1,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Senses 1 (Extended Vision) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-master-of-disguise",
    "profileId": "talent",
    "name": {
      "en": "Master of Disguise",
      "pt": "Mestre do Disfarce"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Morph · Increased Duration · Check Required · Increased Action",
      "pt": "Metamorfose · Duração Aumentada · Teste Necessário · Ação Aumentada"
    },
    "page": 189,
    "components": [
      {
        "effectId": "morph",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "increased_duration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "check_required",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_action",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Morph 2 (Other People), Continuous, Deception Check Required (DC 12), Removable (–1 point), Standard Action • 5 points",
      "fixed": 5,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "Morph 2 with Continuous +1 and Standard Action -2 costs 8, minus Check Required 2 gives 6. Removable reduces by ceil(6/5)=2, total 4.",
          "pt": "Divergência da fonte: Morph 2 with Continuous +1 and Standard Action -2 costs 8, minus Check Required 2 gives 6. Removable reduces by ceil(6/5)=2, total 4."
        },
        "fixed": 4,
        "perRank": 0
      }
    },
    "removable": "removable"
  },
  {
    "id": "talent-master-escape-artist",
    "profileId": "talent",
    "name": {
      "en": "Master Escape Artist",
      "pt": "Mestre da Fuga"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Insubstantial · Limited",
      "pt": "Insubstancial · Limitado"
    },
    "page": 189,
    "components": [
      {
        "effectId": "insubstantial",
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
      "Talent"
    ],
    "audit": {
      "formula": "Insubstantial 1, Limited to Escaping • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "talent-master-linguist",
    "profileId": "talent",
    "name": {
      "en": "Master Linguist",
      "pt": "Mestre Linguista"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend · Quirk",
      "pt": "Compreensão · Peculiaridade"
    },
    "page": 189,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 2,
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
      "Talent"
    ],
    "audit": {
      "formula": "Comprehend 2 (Languages, Understand and Be Understood), Quirk (takes at least a scene to pick up a new language) • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "talent-number-cruncher",
    "profileId": "talent",
    "name": {
      "en": "Number Cruncher",
      "pt": "Calculista"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Quickness · Limited",
      "pt": "Rapidez · Limitado"
    },
    "page": 189,
    "components": [
      {
        "effectId": "quickness",
        "ranks": 1,
        "modifiers": [
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
      "Talent"
    ],
    "audit": {
      "formula": "Quickness, Limited to Mathematical Calculations • 1 point per 3 ranks",
      "fixed": 0,
      "perRank": 0.3333333333333333
    }
  },
  {
    "id": "talent-situational-awareness",
    "profileId": "talent",
    "name": {
      "en": "Situational Awareness",
      "pt": "Consciência Situacional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 189,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "danger_sense",
            "ranks": 1,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Talent"
    ],
    "audit": {
      "formula": "Senses 1 (Danger Sense, visual) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "talent-speed-reader",
    "profileId": "talent",
    "name": {
      "en": "Speed Reader",
      "pt": "Leitura Rápida"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Quickness · Limited",
      "pt": "Rapidez · Limitado"
    },
    "page": 189,
    "components": [
      {
        "effectId": "quickness",
        "ranks": 1,
        "modifiers": [
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
      "Talent"
    ],
    "audit": {
      "formula": "Quickness, Limited to Reading • 1 point",
      "fixed": 0,
      "perRank": 0.3333333333333333
    }
  }
] satisfies PowerTemplate[];
