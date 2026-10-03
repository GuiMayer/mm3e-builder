import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "armor-blaster",
    "profileId": "armor",
    "name": {
      "en": "Blaster",
      "pt": "Disparador"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 11,
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
      "Armor"
    ],
    "audit": {
      "formula": "Ranged Damage • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage"
  },
  {
    "id": "armor-capture-weapon",
    "profileId": "armor",
    "name": {
      "en": "Capture Weapon",
      "pt": "Arma de Captura"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range — Impaired, Disabled, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado — Prejudicado, Debilitado, Incapacitado; superado por Fortitude."
    },
    "page": 11,
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
      "Armor"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Incapacitated) • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Incapacitated)"
  },
  {
    "id": "armor-homing-missile",
    "profileId": "armor",
    "name": {
      "en": "Homing Missile",
      "pt": "Míssil Guiado"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Homing · Linked · Senses",
      "pt": "Dano · Alcance Aumentado · Teleguiado · Vinculado · Sentidos"
    },
    "page": 11,
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
            "modifierId": "homing",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "infravision",
            "ranks": 1
          }
        ]
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Ranged Damage, Homing 2 Linked to Senses 1 (Infravision) • 3 points + 2 points per rank",
      "fixed": 3,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage, Homing 2 Linked to Senses 1 (Infravision)"
  },
  {
    "id": "armor-machine-gun",
    "profileId": "armor",
    "name": {
      "en": "Machine-Gun",
      "pt": "Metralhadora"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Multiattack",
      "pt": "Dano · Alcance Aumentado · Ataque Múltiplo"
    },
    "page": 11,
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
      "Armor"
    ],
    "audit": {
      "formula": "Ranged Multiattack Damage • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Multiattack Damage"
  },
  {
    "id": "armor-micro-missiles",
    "profileId": "armor",
    "name": {
      "en": "Micro-Missiles",
      "pt": "Micromísseis"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 11,
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
      "Armor"
    ],
    "audit": {
      "formula": "Burst Area Ranged Damage • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Burst Area Ranged Damage"
  },
  {
    "id": "armor-surface-shock-affliction",
    "profileId": "armor",
    "name": {
      "en": "Surface Shock — Affliction",
      "pt": "Choque de Superfície — Aflição"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Reaction — Dazed, Stunned, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Reação — Atordoado, Aturdido, Incapacitado; superado por Fortitude."
    },
    "page": 12,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "options": {
              "trigger": "When touched"
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
      "Armor"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Reaction (when touched) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Reaction (when touched)"
  },
  {
    "id": "armor-surface-shock-damage",
    "profileId": "armor",
    "name": {
      "en": "Surface Shock — Damage",
      "pt": "Choque de Superfície — Dano"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 12,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "options": {
              "trigger": "When touched"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Reaction (when touched) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Reaction (when touched)"
  },
  {
    "id": "armor-strength-enhancement",
    "profileId": "armor",
    "name": {
      "en": "Strength Enhancement",
      "pt": "Força Aprimorada"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 12,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Enhanced Strength • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Enhanced Strength"
  },
  {
    "id": "armor-armor",
    "profileId": "armor",
    "name": {
      "en": "Armor",
      "pt": "Armadura"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection",
      "pt": "Proteção"
    },
    "page": 12,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection"
  },
  {
    "id": "armor-force-field",
    "profileId": "armor",
    "name": {
      "en": "Force Field",
      "pt": "Campo de Força"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection — Permanent defensive field; duration variants can be edited afterward.",
      "pt": "Proteção — Campo defensivo permanente; variantes de duração podem ser editadas depois."
    },
    "page": 12,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection"
  },
  {
    "id": "armor-life-support-system",
    "profileId": "armor",
    "name": {
      "en": "Life Support System",
      "pt": "Sistema de Suporte Vital"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — Life support.",
      "pt": "Imunidade — Suporte vital."
    },
    "page": 12,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Immunity 10 (Life Support) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (Life Support)"
  },
  {
    "id": "armor-mind-shield-impervious-will",
    "profileId": "armor",
    "name": {
      "en": "Mind Shield — Impervious Will",
      "pt": "Escudo Mental — Vontade Impenetrável"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Impervious · Limited — Limited to mental effects.",
      "pt": "Traço Aprimorado · Impenetrável · Limitado — Limitado a efeitos mentais."
    },
    "page": 12,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "impervious",
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
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Will"
        }
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Enhanced Impervious Will, Limited to Mental Effects • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Impervious Will, Limited to Mental Effects"
  },
  {
    "id": "armor-mind-shield-one-power",
    "profileId": "armor",
    "name": {
      "en": "Mind Shield — One power",
      "pt": "Escudo Mental — Um poder"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — One power",
      "pt": "Imunidade — Um poder"
    },
    "page": 12,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Enhanced Impervious Will, Limited to Mental Effects • 1 point per rank",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Impervious Will, Limited to Mental Effects"
  },
  {
    "id": "armor-mind-shield-mental-effects",
    "profileId": "armor",
    "name": {
      "en": "Mind Shield — Mental effects",
      "pt": "Escudo Mental — Efeitos mentais"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — Mental effects",
      "pt": "Imunidade — Efeitos mentais"
    },
    "page": 12,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Enhanced Impervious Will, Limited to Mental Effects • 1 point per rank",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Impervious Will, Limited to Mental Effects"
  },
  {
    "id": "armor-sensory-shield",
    "profileId": "armor",
    "name": {
      "en": "Sensory Shield",
      "pt": "Escudo Sensorial"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — Sensory Affliction effects.",
      "pt": "Imunidade — Efeitos de Aflição sensorial."
    },
    "page": 13,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Immunity 5 (Sensory Affliction Effects) • 5",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 5 (Sensory Affliction Effects)"
  },
  {
    "id": "armor-aquatic-turbines",
    "profileId": "armor",
    "name": {
      "en": "Aquatic Turbines",
      "pt": "Turbinas Aquáticas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Swimming",
      "pt": "Natação"
    },
    "page": 13,
    "components": [
      {
        "effectId": "swimming",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Swimming • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Swimming"
  },
  {
    "id": "armor-leg-hydraulics",
    "profileId": "armor",
    "name": {
      "en": "Leg Hydraulics",
      "pt": "Pernas Hidráulicas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 13,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Leaping"
  },
  {
    "id": "armor-limb-extenders",
    "profileId": "armor",
    "name": {
      "en": "Limb Extenders",
      "pt": "Extensores de Membros"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Elongation",
      "pt": "Alongamento"
    },
    "page": 13,
    "components": [
      {
        "effectId": "elongation",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Elongation • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Elongation"
  },
  {
    "id": "armor-skates",
    "profileId": "armor",
    "name": {
      "en": "Skates",
      "pt": "Patins"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Speed",
      "pt": "Velocidade"
    },
    "page": 13,
    "components": [
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Speed • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Speed"
  },
  {
    "id": "armor-thrusters",
    "profileId": "armor",
    "name": {
      "en": "Thrusters",
      "pt": "Propulsores"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 13,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Flight"
  },
  {
    "id": "armor-tunneling",
    "profileId": "armor",
    "name": {
      "en": "Tunneling",
      "pt": "Escavação"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 13,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Burrowing"
  },
  {
    "id": "armor-combat-computer",
    "profileId": "armor",
    "name": {
      "en": "Combat Computer",
      "pt": "Computador de Combate"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Enhanced Trait · Enhanced Trait — Choose an advantage; Dodge and Parry ranks are separate purchases.",
      "pt": "Traço Aprimorado · Traço Aprimorado · Traço Aprimorado — Escolha uma vantagem; as graduações de Esquiva e Aparar são compras independentes."
    },
    "page": 13,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Advantage",
        "choices": [
          {
            "id": "trait",
            "label": {
              "en": "Enhanced advantage",
              "pt": "Vantagem aprimorada"
            },
            "options": [
              {
                "value": "Assessment",
                "label": {
                  "en": "Assessment",
                  "pt": "Avaliação"
                }
              },
              {
                "value": "Close Attack",
                "label": {
                  "en": "Close Attack",
                  "pt": "Ataque Corpo a Corpo"
                }
              },
              {
                "value": "Favored Opponent",
                "label": {
                  "en": "Favored Opponent",
                  "pt": "Oponente Favorito"
                }
              },
              {
                "value": "Improved Initiative",
                "label": {
                  "en": "Improved Initiative",
                  "pt": "Iniciativa Aprimorada"
                }
              },
              {
                "value": "Ranged Attack",
                "label": {
                  "en": "Ranged Attack",
                  "pt": "Ataque à Distância"
                }
              },
              {
                "value": "Uncanny Dodge",
                "label": {
                  "en": "Uncanny Dodge",
                  "pt": "Esquiva Sobrenatural"
                }
              }
            ]
          }
        ]
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Dodge"
        }
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Parry"
        }
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Enhanced Advantages (choose from Assessment, Close Attack, Favored Opponent (previously assessed), Improved Initiative, Ranged Attack, and Uncanny Dodge) plus Enhanced Defense (Dodge and Parry) • 1 point",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Enhanced Advantages (choose from Assessment, Close Attack, Favored Opponent (previously assessed), Improved Initiative, Ranged Attack, and Uncanny Dodge) plus Enhanced Defense (Dodge and Parry)"
  },
  {
    "id": "armor-comm-system",
    "profileId": "armor",
    "name": {
      "en": "Comm System",
      "pt": "Sistema de Comunicação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Communication — Radio communication.",
      "pt": "Comunicação — Comunicação por rádio."
    },
    "page": 13,
    "components": [
      {
        "effectId": "communication",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Radio Communication • 5 points per rank",
      "fixed": 0,
      "perRank": 5,
      "discrepancy": {
        "reason": {
          "en": "Power Profiles prints 5 PP/rank, but unmodified Communication costs 4 PP/rank in the Deluxe Hero’s Handbook. This recipe follows the stated effect; no extra is invented.",
          "pt": "Power Profiles imprime 5 PP/graduação, mas Comunicação sem extras custa 4 PP/graduação no Deluxe Hero’s Handbook. A receita segue o efeito indicado, sem inventar um extra."
        },
        "fixed": 0,
        "perRank": 4
      }
    },
    "sourceFormula": "Radio Communication"
  },
  {
    "id": "armor-sensors",
    "profileId": "armor",
    "name": {
      "en": "Sensors",
      "pt": "Sensores"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses — Choose the purchased senses before applying.",
      "pt": "Sentidos — Escolha os sentidos comprados antes de aplicar."
    },
    "page": 13,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "chooseSenses": true
      }
    ],
    "descriptors": [
      "Armor"
    ],
    "audit": {
      "formula": "Senses • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Senses"
  }
] satisfies PowerTemplate[];
