import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "size-growth-momentum",
    "profileId": "size",
    "name": {
      "en": "Growth Momentum",
      "pt": "Impulso de Crescimento"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Limited",
      "pt": "Dano · Limitado"
    },
    "page": 160,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Strength-based Damage, Limited to size rank difference between you and your target • 1 point",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "size-internal-attack",
    "profileId": "size",
    "name": {
      "en": "Internal Attack",
      "pt": "Ataque Interno"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative · Affects Corporeal · Subtle · Quirk",
      "pt": "Aflição · Cumulativo · Afeta Corpóreos · Sutil · Peculiaridade"
    },
    "page": 160,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "affects_corporeal",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        },
        "scaledModifiers": [
          "affects_corporeal"
        ]
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Affects Corporeal, Subtle, Quirk (Must use the Atomic modifier on Shrinking, –1 point) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "size-phase-attack",
    "profileId": "size",
    "name": {
      "en": "Phase Attack",
      "pt": "Ataque de Fase"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative · Affects Corporeal",
      "pt": "Aflição · Cumulativo · Afeta Corpóreos"
    },
    "page": 160,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "affects_corporeal",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        },
        "scaledModifiers": [
          "affects_corporeal"
        ]
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Affects Corporeal • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "size-massive-missile",
    "profileId": "size",
    "name": {
      "en": "Massive Missile",
      "pt": "Míssil Massivo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area · Increased Range · Quirk",
      "pt": "Dano · Área · Alcance Aumentado · Peculiaridade"
    },
    "page": 160,
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
          },
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
      "Size"
    ],
    "audit": {
      "formula": "Burst Area Ranged Damage, Quirk (Requires objects to throw, –1 point) • 2 points for rank 1 +",
      "fixed": -1,
      "perRank": 3
    }
  },
  {
    "id": "size-shrink-ray",
    "profileId": "size",
    "name": {
      "en": "Shrink-Ray",
      "pt": "Raio Encolhedor"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Limited Degree · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Graus Limitados · Resistência Alternativa"
    },
    "page": 160,
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
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited_degree",
            "ranks": 2,
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
      "Size"
    ],
    "audit": {
      "formula": "Ranged Progressive Affliction (Resisted by Dodge, Overcome by Fortitude; Transformed – reduced to tiny size), Limited (Third Degree Only) • 3 points per rank",
      "fixed": 0,
      "perRank": 3,
      "discrepancy": {
        "reason": {
          "en": "Only third degree removes two degrees: Affliction 1 + Ranged 1 + Progressive 2 - 2 = 2/rank.",
          "pt": "Divergência da fonte: Only third degree removes two degrees: Affliction 1 + Ranged 1 + Progressive 2 - 2 = 2/rank."
        },
        "fixed": 0,
        "perRank": 2
      }
    }
  },
  {
    "id": "size-density-decrease",
    "profileId": "size",
    "name": {
      "en": "Density Decrease",
      "pt": "Diminuir Densidade"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 160,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Insubstantial 4 (Incorporeal) • 20 points",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "size-massive-armor",
    "profileId": "size",
    "name": {
      "en": "Massive Armor",
      "pt": "Armadura Massiva"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 161,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Impervious Toughness"
        }
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Impervious modifier on Toughness • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "size-shrinking-dodge",
    "profileId": "size",
    "name": {
      "en": "Shrinking Dodge",
      "pt": "Esquiva por Encolhimento"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 161,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Reaction on existing Shrinking"
        }
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Reaction modifier on Shrinking (when attacked) • 1 point per Shrinking rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "size-microflight",
    "profileId": "size",
    "name": {
      "en": "Microflight",
      "pt": "Microvoo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Quirk",
      "pt": "Voo · Peculiaridade"
    },
    "page": 161,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
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
      "Size"
    ],
    "audit": {
      "formula": "Flight, Quirk (Must be using Shrinking, –1 point) •",
      "fixed": -1,
      "perRank": 2
    }
  },
  {
    "id": "size-microport",
    "profileId": "size",
    "name": {
      "en": "Microport",
      "pt": "Microteleporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Extended · Medium",
      "pt": "Teleporte · Preciso · Estendido · Meio"
    },
    "page": 161,
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
            "modifierId": "extended",
            "ranks": 1,
            "isPowerSpecific": true
          },
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
      "Size"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Extended, Medium (transmission networks) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "size-microverse",
    "profileId": "size",
    "name": {
      "en": "Microverse",
      "pt": "Microverso"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 161,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Dimensional Travel: Microverse"
        }
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Movement 1 (Dimensional Travel 1, microverse) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "size-density-increase",
    "profileId": "size",
    "name": {
      "en": "Density Increase",
      "pt": "Aumentar Densidade"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Growth — Does not change size, +0; density Growth.",
      "pt": "Crescimento — Não altera tamanho, +0; Crescimento de densidade."
    },
    "page": 161,
    "components": [
      {
        "effectId": "growth",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Growth, Does Not Change Size (+0 modifier) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "size-mass-compaction",
    "profileId": "size",
    "name": {
      "en": "Mass Compaction",
      "pt": "Compactar Massa"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Limited · Protection · Limited",
      "pt": "Traço Aprimorado · Limitado · Proteção · Limitado"
    },
    "page": 161,
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
      },
      {
        "effectId": "protection",
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
      "Size"
    ],
    "audit": {
      "formula": "Enhanced Strength and Toughness, Limited to active Shrinking rank • 2 points per rank",
      "fixed": 0,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Strength 2 - Limited 1 = 1/rank; Toughness 1 - Limited 1 = 1 PP/2 ranks. Each purchase is rounded independently.",
          "pt": "Divergência da fonte: Strength 2 - Limited 1 = 1/rank; Toughness 1 - Limited 1 = 1 PP/2 ranks. Each purchase is rounded independently."
        },
        "fixed": 0,
        "perRank": 1.5
      }
    }
  },
  {
    "id": "size-mass-dispersal",
    "profileId": "size",
    "name": {
      "en": "Mass Dispersal",
      "pt": "Dispersar Massa"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Insubstantial · Linked · Growth · Limited",
      "pt": "Insubstancial · Vinculado · Crescimento · Limitado"
    },
    "page": 161,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      },
      {
        "effectId": "growth",
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
      "Size"
    ],
    "audit": {
      "formula": "Insubstantial Linked to Growth, Limited to Increasing Size Only (–2) • 5 points per Insubstantial rank + 1",
      "fixed": 5,
      "perRank": 0.5
    }
  },
  {
    "id": "size-microvision-1",
    "profileId": "size",
    "name": {
      "en": "Microvision — 1",
      "pt": "Microvisão — 1"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 161,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "microscopic_vision",
            "ranks": 1
          }
        ]
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Senses (Microscopic Vision) • 1 point per rank (to",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "size-microvision-2",
    "profileId": "size",
    "name": {
      "en": "Microvision — 2",
      "pt": "Microvisão — 2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 161,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "microscopic_vision",
            "ranks": 2
          }
        ]
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Senses (Microscopic Vision) • 1 point per rank (to",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "size-microvision-3",
    "profileId": "size",
    "name": {
      "en": "Microvision — 3",
      "pt": "Microvisão — 3"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 161,
    "components": [
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "microscopic_vision",
            "ranks": 3
          }
        ]
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Senses (Microscopic Vision) • 1 point per rank (to",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "size-microvision-4",
    "profileId": "size",
    "name": {
      "en": "Microvision — 4",
      "pt": "Microvisão — 4"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 161,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "microscopic_vision",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Senses (Microscopic Vision) • 1 point per rank (to",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "size-shrinking-storage",
    "profileId": "size",
    "name": {
      "en": "Shrinking Storage",
      "pt": "Armazenamento Reduzido"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature",
      "pt": "Característica"
    },
    "page": 161,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Size"
    ],
    "audit": {
      "formula": "Feature (reduce mass of carried items by rank) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  }
] satisfies PowerTemplate[];
