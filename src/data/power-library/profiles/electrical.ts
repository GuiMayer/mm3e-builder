import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "electrical-emp",
    "profileId": "electrical",
    "name": {
      "en": "EMP",
      "pt": "Pulso Eletromagnético"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Affects Objects · Broad · Area · Simultaneous",
      "pt": "Enfraquecer · Afeta Objetos · Amplo · Área · Simultâneo"
    },
    "page": 58,
    "components": [
      {
        "effectId": "weaken",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_objects",
            "ranks": 1,
            "options": {
              "affectsOnlyObjects": true
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "trait": "Electronics",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Weaken Electronics, Affects Only Objects, Broad, Burst Area, Simultaneous • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "electrical-lightning-bolt",
    "profileId": "electrical",
    "name": {
      "en": "Lightning Bolt",
      "pt": "Raio"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 58,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Ranged Damage (electrical) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "electrical-ball-lightning",
    "profileId": "electrical",
    "name": {
      "en": "Ball Lightning",
      "pt": "Relâmpago Globular"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 58,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Burst Area Ranged Damage (electrical) • 3",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "electrical-chain-lightning",
    "profileId": "electrical",
    "name": {
      "en": "Chain Lightning",
      "pt": "Relâmpago em Cadeia"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Multiattack",
      "pt": "Dano · Alcance Aumentado · Ataque Múltiplo"
    },
    "page": 58,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Multiattack Ranged Damage (electrical) • 3",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "electrical-lightning-flash",
    "profileId": "electrical",
    "name": {
      "en": "Lightning Flash",
      "pt": "Clarão de Relâmpago"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Limited · Alternate Resistance — Visual Impaired, Disabled, Unaware.",
      "pt": "Aflição · Área · Cumulativo · Limitado · Resistência Alternativa — Visão Prejudicada, Debilitada, Inconsciente dos estímulos."
    },
    "page": 58,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Perception",
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
      "Electrical"
    ],
    "audit": {
      "formula": "Perception Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to One Sense • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "electrical-seizure",
    "profileId": "electrical",
    "name": {
      "en": "Seizure",
      "pt": "Convulsão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range — Entranced, Stunned, Incapacitated.",
      "pt": "Aflição · Alcance Aumentado — Em Transe, Aturdido, Incapacitado."
    },
    "page": 58,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 2,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will ; Entranced, Stunned, Incapacitated) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "electrical-shock-field",
    "profileId": "electrical",
    "name": {
      "en": "Shock Field",
      "pt": "Campo de Choque"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Reaction · Cumulative — Dazed, Stunned, Incapacitated.",
      "pt": "Aflição · Reação · Cumulativo — Atordoado, Aturdido, Incapacitado."
    },
    "page": 58,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Reaction Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 5",
      "fixed": 0,
      "perRank": 5
    }
  },
  {
    "id": "electrical-dc-shock-field",
    "profileId": "electrical",
    "name": {
      "en": "DC Shock Field",
      "pt": "Campo de Choque Contínuo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Reaction · Progressive — Dazed, Stunned, Incapacitated.",
      "pt": "Aflição · Reação · Progressivo — Atordoado, Aturdido, Incapacitado."
    },
    "page": 58,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Electrical"
    ],
    "audit": {
      "formula": "Reaction Progressive Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 6",
      "fixed": 0,
      "perRank": 6
    }
  },
  {
    "id": "electrical-taser",
    "profileId": "electrical",
    "name": {
      "en": "Taser",
      "pt": "Taser"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range — Dazed, Stunned, Incapacitated.",
      "pt": "Aflição · Alcance Aumentado — Atordoado, Aturdido, Incapacitado."
    },
    "page": 58,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
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
      "Electrical"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "electrical-electrical-absorption-healing",
    "profileId": "electrical",
    "name": {
      "en": "Electrical Absorption — Healing",
      "pt": "Absorção Elétrica — Cura"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Healing · Reaction · Bonus Effect · Limited · Source — Self only, limited to absorbed electricity rank; source: electricity.",
      "pt": "Cura · Reação · Efeito Adicional · Limitado · Fonte — Apenas pessoal, limitado à graduação elétrica absorvida; fonte: eletricidade."
    },
    "page": 59,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "bonus_effect_healing",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "source_healing",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Reaction Healing, Bonus Effect (Can Counter Extra Effort Fatigue), Limited to Self, Limited to Absorbed Electricity Rank, Source (Electricity) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "electrical-electrical-absorption-enhanced-trait",
    "profileId": "electrical",
    "name": {
      "en": "Electrical Absorption — Enhanced Trait",
      "pt": "Absorção Elétrica — Atributo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Reaction — Choose enhanced trait; reaction to absorbing electricity.",
      "pt": "Traço Aprimorado · Desgaste · Reação — Escolha o atributo; reação ao absorver eletricidade."
    },
    "page": 59,
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
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Defense"
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Reaction Healing, Bonus Effect (Can Counter Extra Effort Fatigue), Limited to Self, Limited to Absorbed Electricity Rank, Source (Electricity) • 3 points per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "electrical-electrical-immunity",
    "profileId": "electrical",
    "name": {
      "en": "Electrical Immunity",
      "pt": "Imunidade Elétrica"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 59,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Immunity 10 (Electrical Effects) • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "electrical-electrical-resistance",
    "profileId": "electrical",
    "name": {
      "en": "Electrical Resistance",
      "pt": "Resistência Elétrica"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Half Effect",
      "pt": "Imunidade · Metade do Efeito"
    },
    "page": 59,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Immunity 10 (Electrical Effects), Limited to Half Effect • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "electrical-electrical-conductor",
    "profileId": "electrical",
    "name": {
      "en": "Electrical Conductor",
      "pt": "Condutor Elétrico"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Reflect · Redirect",
      "pt": "Imunidade · Refletir · Redirecionar"
    },
    "page": 59,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "reflect_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "redirect_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Immunity 10 (Electrical Effects), Reflect, Redirect • 30 points",
      "fixed": 30,
      "perRank": 0
    }
  },
  {
    "id": "electrical-electromagnetic-field",
    "profileId": "electrical",
    "name": {
      "en": "Electromagnetic Field",
      "pt": "Campo Eletromagnético"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 59,
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
      "Electrical"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "electrical-arc-riding",
    "profileId": "electrical",
    "name": {
      "en": "Arc Riding",
      "pt": "Cavalgar Arcos"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 59,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "electrical-electro-flight",
    "profileId": "electrical",
    "name": {
      "en": "Electro-Flight",
      "pt": "Voo Elétrico"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 59,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "electrical-lightning-flight",
    "profileId": "electrical",
    "name": {
      "en": "Lightning Flight",
      "pt": "Voo Relâmpago"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Easy · Extended · Limited — Pass through intervening space in lightning form.",
      "pt": "Teleporte · Preciso · Fácil · Estendido · Limitado — Atravessa o espaço intermediário em forma de relâmpago."
    },
    "page": 59,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "accurate_teleport",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "easy",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "extended",
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
      "Electrical"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Easy, Extended, Limited (must pass through intervening space in lightning form) • 4",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "electrical-arclight",
    "profileId": "electrical",
    "name": {
      "en": "Arclight",
      "pt": "Luz de Arco"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 60,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Light"
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Environment (Light) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "electrical-blackout",
    "profileId": "electrical",
    "name": {
      "en": "Blackout",
      "pt": "Apagão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Broad · Area · Concentration · Simultaneous · Reduced Range",
      "pt": "Anulação · Amplo · Área · Concentração · Simultâneo · Alcance Reduzido"
    },
    "page": 60,
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
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
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
          "descriptor": "Electronics"
        }
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Nullify Electronics, Broad, Burst Area, Concentration, Simultaneous, Close Range • 5 points per rank",
      "fixed": 0,
      "perRank": 5,
      "discrepancy": {
        "reason": {
          "en": "Nullify 1 + Broad 1 + Area 1 + Concentration 1 + Simultaneous 1 - Close Range 1 = 4 PP/rank, not printed 5.",
          "pt": "Divergência da fonte: Nullify 1 + Broad 1 + Area 1 + Concentration 1 + Simultaneous 1 - Close Range 1 = 4 PP/rank, not printed 5."
        },
        "fixed": 0,
        "perRank": 4
      }
    }
  },
  {
    "id": "electrical-electrical-form",
    "profileId": "electrical",
    "name": {
      "en": "Electrical Form",
      "pt": "Forma Elétrica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 60,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 3,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Insubstantial 3 (electricity) • 15 points",
      "fixed": 15,
      "perRank": 0
    }
  },
  {
    "id": "electrical-electrosense",
    "profileId": "electrical",
    "name": {
      "en": "Electrosense",
      "pt": "Sentido Elétrico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 60,
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
            "detail": "Electricity"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
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
      "Electrical"
    ],
    "audit": {
      "formula": "Detect Electricity, Ranged, Acute • 3 points per rank",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "electrical-electro-shaping",
    "profileId": "electrical",
    "name": {
      "en": "Electro-Shaping",
      "pt": "Moldagem Elétrica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Damage · Increased Range · Area · Increased Duration · Selective — Base volume; add Area ranks to increase volume.",
      "pt": "Dano · Alcance Aumentado · Área · Duração Aumentada · Seletivo — Volume base; acrescente graduações de Área para aumentar."
    },
    "page": 60,
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
            "option": "Shapeable",
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_duration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "selective",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Ranged Shapeable Area Electrical Damage, Concentration Duration, Selective • 5 points per rank, +1 point per rank per +1 volume rank",
      "fixed": 0,
      "perRank": 5
    }
  },
  {
    "id": "electrical-lightning-creatures",
    "profileId": "electrical",
    "name": {
      "en": "Lightning Creatures",
      "pt": "Criaturas de Relâmpago"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon",
      "pt": "Invocar"
    },
    "page": 60,
    "components": [
      {
        "effectId": "summon",
        "ranks": 6,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Summon Lightning Creature 6 (90- point minion (see the following template)) • 12 points",
      "fixed": 12,
      "perRank": 0
    }
  },
  {
    "id": "electrical-static-electricity",
    "profileId": "electrical",
    "name": {
      "en": "Static Electricity",
      "pt": "Eletricidade Estática"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 60,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Electrical"
    ],
    "audit": {
      "formula": "Move Object • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  }
] satisfies PowerTemplate[];
