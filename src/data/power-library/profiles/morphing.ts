import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "morphing-baneful-transformation",
    "profileId": "morphing",
    "name": {
      "en": "Baneful Transformation",
      "pt": "Transformação Maléfica"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative",
      "pt": "Aflição · Alcance Aumentado · Cumulativo"
    },
    "page": 138,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted and Overcome by Will; Hindered, Stunned, Transformed) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "morphing-natural-weapons",
    "profileId": "morphing",
    "name": {
      "en": "Natural Weapons",
      "pt": "Armas Naturais"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 138,
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
      "Morphing"
    ],
    "audit": {
      "formula": "Strength-based Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-pseudopods",
    "profileId": "morphing",
    "name": {
      "en": "Pseudopods",
      "pt": "Pseudópodes"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Extra Limbs · Sustained",
      "pt": "Membros Extras · Sustentado"
    },
    "page": 138,
    "components": [
      {
        "effectId": "extra-limbs",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "sustained_extra_limbs",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Extra Limbs, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-slingshot",
    "profileId": "morphing",
    "name": {
      "en": "Slingshot",
      "pt": "Estilingue"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Limited",
      "pt": "Traço Aprimorado · Limitado"
    },
    "page": 139,
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
      "Morphing"
    ],
    "audit": {
      "formula": "Enhanced Strength, Limited to Throwing • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-bounceback-attack",
    "profileId": "morphing",
    "name": {
      "en": "Bounceback Attack",
      "pt": "Ataque de Ricochete"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Reflect · Reduced Range",
      "pt": "Deflexão · Refletir · Alcance Reduzido"
    },
    "page": 139,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reflect",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reduced_range",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Deflect, Reflect, Close Range • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-metamorphic-healing",
    "profileId": "morphing",
    "name": {
      "en": "Metamorphic Healing",
      "pt": "Cura Metamórfica"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Healing · Limited",
      "pt": "Cura · Limitado"
    },
    "page": 139,
    "components": [
      {
        "effectId": "healing",
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
      "Morphing"
    ],
    "audit": {
      "formula": "Healing, Limited to Self • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-metamorphic-regeneration",
    "profileId": "morphing",
    "name": {
      "en": "Metamorphic Regeneration",
      "pt": "Regeneração Metamórfica"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration",
      "pt": "Regeneração"
    },
    "page": 139,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Regeneration • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-flat-form",
    "profileId": "morphing",
    "name": {
      "en": "Flat Form",
      "pt": "Forma Plana"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Limited · Partial · Insubstantial · Limited",
      "pt": "Camuflagem · Limitado · Parcial · Insubstancial · Limitado"
    },
    "page": 139,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "partial",
            "ranks": 1,
            "isPowerSpecific": true
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Concealment 4 (Visual), Limited to One Edge, Partial; Insubstantial 1, Limited by Width • 6 points",
      "fixed": 6,
      "perRank": 0
    }
  },
  {
    "id": "morphing-malleable-form",
    "profileId": "morphing",
    "name": {
      "en": "Malleable Form",
      "pt": "Forma Maleável"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 139,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Insubstantial 1 • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "morphing-transformed-toughness",
    "profileId": "morphing",
    "name": {
      "en": "Transformed Toughness",
      "pt": "Resistência Transformada"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection",
      "pt": "Proteção"
    },
    "page": 139,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-bouncing-ball",
    "profileId": "morphing",
    "name": {
      "en": "Bouncing Ball",
      "pt": "Bola Saltitante"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 139,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-living-glider",
    "profileId": "morphing",
    "name": {
      "en": "Living Glider",
      "pt": "Planador Vivo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Gliding",
      "pt": "Voo · Planador"
    },
    "page": 139,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "gliding",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Flight, Gliding • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-stretching-stride",
    "profileId": "morphing",
    "name": {
      "en": "Stretching Stride",
      "pt": "Passada Elástica"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Speed",
      "pt": "Velocidade"
    },
    "page": 139,
    "components": [
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Speed • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-wings",
    "profileId": "morphing",
    "name": {
      "en": "Wings",
      "pt": "Asas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Wings",
      "pt": "Voo · Asas"
    },
    "page": 139,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "wings",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Flight, Wings • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-living-trampoline",
    "profileId": "morphing",
    "name": {
      "en": "Living Trampoline",
      "pt": "Trampolim Vivo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Affects Others",
      "pt": "Movimento · Afeta Outros"
    },
    "page": 139,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_others",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Safe Fall"
        }
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Movement 1 (Safe Fall), Affects Others • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "morphing-swinging-arms",
    "profileId": "morphing",
    "name": {
      "en": "Swinging Arms",
      "pt": "Braços de Balanço"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 139,
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
      "Morphing"
    ],
    "audit": {
      "formula": "Movement 1 (Swinging) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "morphing-extended-eyes",
    "profileId": "morphing",
    "name": {
      "en": "Extended Eyes",
      "pt": "Olhos Estendidos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 140,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Two sense types (or Visual)"
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "morphing-fingertip-lockpick",
    "profileId": "morphing",
    "name": {
      "en": "Fingertip Lockpick",
      "pt": "Gazua nos Dedos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature",
      "pt": "Característica"
    },
    "page": 140,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Feature (+10 circumstance bonus to Technology checks to pick mechanical locks) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "morphing-metamorphic-minions",
    "profileId": "morphing",
    "name": {
      "en": "Metamorphic Minions",
      "pt": "Lacaios Metamórficos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Controlled · Horde · Multiple Minions (per effect rank)",
      "pt": "Invocar · Controlado · Horda · Múltiplos Lacaios (por graduação do efeito)"
    },
    "page": 140,
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
            "modifierId": "horde",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "multiple_minions_ranked",
            "ranks": 3,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Summon, Controlled, Horde, Multiple Minions 3 (up to eight minions) • 10 points per rank",
      "fixed": 0,
      "perRank": 10
    }
  },
  {
    "id": "morphing-shapeshift",
    "profileId": "morphing",
    "name": {
      "en": "Shapeshift",
      "pt": "Metamorfose"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable",
      "pt": "Variável"
    },
    "page": 140,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Variable (assumed forms, allocate 5 power points per rank) • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    }
  },
  {
    "id": "morphing-stretching",
    "profileId": "morphing",
    "name": {
      "en": "Stretching",
      "pt": "Alongamento"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Elongation",
      "pt": "Alongamento"
    },
    "page": 141,
    "components": [
      {
        "effectId": "elongation",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Morphing"
    ],
    "audit": {
      "formula": "Elongation • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  }
] satisfies PowerTemplate[];
