import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "light-blinding-beam",
    "profileId": "light",
    "name": {
      "en": "Blinding Beam",
      "pt": "Raio Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado"
    },
    "page": 94,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to Vision"
  },
  {
    "id": "light-blinding-burst",
    "profileId": "light",
    "name": {
      "en": "Blinding Burst",
      "pt": "Explosão Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Limited",
      "pt": "Aflição · Área · Cumulativo · Limitado"
    },
    "page": 94,
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
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
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
      "Light"
    ],
    "audit": {
      "formula": "Burst Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to Vision"
  },
  {
    "id": "light-dazzling-burst",
    "profileId": "light",
    "name": {
      "en": "Dazzling Burst",
      "pt": "Explosão Ofuscante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Sense-Dependent",
      "pt": "Aflição · Área · Cumulativo · Dependente de Sentido"
    },
    "page": 94,
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
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "sense_dependent",
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
      "Light"
    ],
    "audit": {
      "formula": "Burst Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed, Stunned, Incapacitated), Sight-Dependent • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed, Stunned, Incapacitated), Sight-Dependent"
  },
  {
    "id": "light-hypnotic-strobe",
    "profileId": "light",
    "name": {
      "en": "Hypnotic Strobe",
      "pt": "Estrobo Hipnótico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Limited Degree · Sense-Dependent",
      "pt": "Aflição · Alcance Aumentado · Graus Limitados · Dependente de Sentido"
    },
    "page": 94,
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
            "modifierId": "limited_degree",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "sense_dependent",
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
      "Light"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled), Limited Degree, Sight-Dependent • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled), Limited Degree, Sight-Dependent"
  },
  {
    "id": "light-blinding-aura",
    "profileId": "light",
    "name": {
      "en": "Blinding Aura",
      "pt": "Aura Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Limited · Increased Duration — Concentration version; sustained extension requires adjudication.",
      "pt": "Aflição · Área · Cumulativo · Limitado · Duração Aumentada — Versão por Concentração; extensão Sustentada requer adjudicação."
    },
    "page": 94,
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
            "modifierId": "increased_duration",
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
      "Light"
    ],
    "audit": {
      "formula": "Perception Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to Vision, Sustained Duration • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "requiresCharacterChanges": {
      "en": "Reference only: the book requires Sustained Affliction; this builder only models its Concentration step.",
      "pt": "Apenas referência: o livro exige Aflição Sustentada; este Builder representa apenas sua etapa de Concentração."
    },
    "sourceFormula": "Perception Area Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Visually Impaired, Visually Disabled, Visually Unaware), Limited to Vision, Sustained Duration"
  },
  {
    "id": "light-blinding-field",
    "profileId": "light",
    "name": {
      "en": "Blinding Field",
      "pt": "Campo Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Concealment · Area · Attack",
      "pt": "Camuflagem · Área · Ataque"
    },
    "page": 94,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
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
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Burst Area Visual Concealment 4 Attack (all visual senses) • 12 points + 4 points per +1 area distance rank",
      "fixed": 12,
      "perRank": 0
    },
    "sourceFormula": "Burst Area Visual Concealment 4 Attack (all visual senses)"
  },
  {
    "id": "light-laser-beam",
    "profileId": "light",
    "name": {
      "en": "Laser Beam",
      "pt": "Raio Laser"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 94,
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
      "Light"
    ],
    "audit": {
      "formula": "Ranged Damage (Laser) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (Laser)"
  },
  {
    "id": "light-pulse-laser",
    "profileId": "light",
    "name": {
      "en": "Pulse Laser",
      "pt": "Laser Pulsado"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Multiattack",
      "pt": "Dano · Alcance Aumentado · Ataque Múltiplo"
    },
    "page": 94,
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
      "Light"
    ],
    "audit": {
      "formula": "Ranged Multiattack Damage (Laser) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Multiattack Damage (Laser)"
  },
  {
    "id": "light-laser-burst",
    "profileId": "light",
    "name": {
      "en": "Laser Burst",
      "pt": "Explosão Laser"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area",
      "pt": "Dano · Área"
    },
    "page": 94,
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
      "Light"
    ],
    "audit": {
      "formula": "Burst Area Damage (Laser) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Damage (Laser)"
  },
  {
    "id": "light-invisible-laser-beam",
    "profileId": "light",
    "name": {
      "en": "Invisible Laser Beam",
      "pt": "Raio Laser Invisível"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Subtle",
      "pt": "Dano · Alcance Aumentado · Sutil"
    },
    "page": 95,
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
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Ranged Damage (Laser), Subtle • 1",
      "fixed": 1,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (Laser), Subtle"
  },
  {
    "id": "light-laser-weapon",
    "profileId": "light",
    "name": {
      "en": "Laser Weapon",
      "pt": "Arma Laser"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 95,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Damage (Laser) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Damage (Laser)"
  },
  {
    "id": "light-targeting-laser",
    "profileId": "light",
    "name": {
      "en": "Targeting Laser",
      "pt": "Laser de Mira"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Feature · Accurate — Flat modifier carrier: add Accurate to the selected attack.",
      "pt": "Característica · Preciso — Suporte de modificador fixo: acrescente Acurado ao ataque escolhido."
    },
    "page": 95,
    "components": [
      {
        "effectId": "feature",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "accurate",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Add Accurate to any Laser power • 1 point",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Add Accurate to any Laser power"
  },
  {
    "id": "light-immunity-to-light",
    "profileId": "light",
    "name": {
      "en": "Immunity to Light",
      "pt": "Imunidade à Luz"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 95,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Immunity 10 (Light Effects) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (Light Effects)"
  },
  {
    "id": "light-light-absorption",
    "profileId": "light",
    "name": {
      "en": "Light Absorption",
      "pt": "Absorção de Luz"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Limited",
      "pt": "Traço Aprimorado · Desgaste · Limitado"
    },
    "page": 95,
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
        "variableCostOption": "Enhanced Ability"
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Enhanced Trait, Fades, Limited to the lesser of effect rank or absorbed energy rank • As base trait –2 per rank",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Enhanced Trait, Fades, Limited to the lesser of effect rank or absorbed energy rank"
  },
  {
    "id": "light-light-form",
    "profileId": "light",
    "name": {
      "en": "Light Form",
      "pt": "Forma de Luz"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 95,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 3,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Insubstantial 3 (Energy Form – Light) • 15 points",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Insubstantial 3 (Energy Form – Light)"
  },
  {
    "id": "light-photonic-shield",
    "profileId": "light",
    "name": {
      "en": "Photonic Shield",
      "pt": "Escudo Fotônico"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 95,
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
      "Light"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection, Sustained"
  },
  {
    "id": "light-reflective",
    "profileId": "light",
    "name": {
      "en": "Reflective",
      "pt": "Refletivo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Reflect · Reduced Range · Limited",
      "pt": "Deflexão · Refletir · Alcance Reduzido · Limitado"
    },
    "page": 95,
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
      "Light"
    ],
    "audit": {
      "formula": "Deflect, Reflect, Close Range, Limited to Light Effects • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Deflect, Reflect, Close Range, Limited to Light Effects"
  },
  {
    "id": "light-lightflight",
    "profileId": "light",
    "name": {
      "en": "Lightflight",
      "pt": "Voo de Luz"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 95,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Flight"
  },
  {
    "id": "light-light-bridge",
    "profileId": "light",
    "name": {
      "en": "Light Bridge",
      "pt": "Ponte de Luz"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform",
      "pt": "Voo · Platform"
    },
    "page": 95,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "platform",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Flight, Platform • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Platform"
  },
  {
    "id": "light-lightspeed",
    "profileId": "light",
    "name": {
      "en": "Lightspeed",
      "pt": "Velocidade da Luz"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Movement",
      "pt": "Voo · Movimento"
    },
    "page": 95,
    "components": [
      {
        "effectId": "flight",
        "ranks": 24,
        "modifiers": []
      },
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Space Travel"
        }
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Flight 24, Movement 1 (Space Travel 1) • 50 points",
      "fixed": 50,
      "perRank": 0
    },
    "sourceFormula": "Flight 24, Movement 1 (Space Travel 1)"
  },
  {
    "id": "light-banish-darkness",
    "profileId": "light",
    "name": {
      "en": "Banish Darkness",
      "pt": "Banir Escuridão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Area · Simultaneous",
      "pt": "Anulação · Área · Simultâneo"
    },
    "page": 96,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
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
          "descriptor": "Darkness"
        }
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Burst Area Nullify Darkness, Simultaneous • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Burst Area Nullify Darkness, Simultaneous"
  },
  {
    "id": "light-healing-light",
    "profileId": "light",
    "name": {
      "en": "Healing Light",
      "pt": "Luz Curativa"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing",
      "pt": "Cura"
    },
    "page": 96,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Healing • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Healing"
  },
  {
    "id": "light-holograms",
    "profileId": "light",
    "name": {
      "en": "Holograms",
      "pt": "Hologramas"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 96,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Two sense types"
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Visual Illusion • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Visual Illusion"
  },
  {
    "id": "light-illuminate",
    "profileId": "light",
    "name": {
      "en": "Illuminate",
      "pt": "Iluminar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 96,
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
      "Light"
    ],
    "audit": {
      "formula": "Environment (Light) • 1 or 2 points per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Light)"
  },
  {
    "id": "light-laser-comm",
    "profileId": "light",
    "name": {
      "en": "Laser Comm",
      "pt": "Comunicação Laser"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Communication",
      "pt": "Comunicação"
    },
    "page": 96,
    "components": [
      {
        "effectId": "communication",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Communication (Visual, Laser) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Communication (Visual, Laser)"
  },
  {
    "id": "light-laser-hearing",
    "profileId": "light",
    "name": {
      "en": "Laser Hearing",
      "pt": "Audição Laser"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 96,
    "components": [
      {
        "effectId": "senses",
        "ranks": 5,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "extended",
            "ranks": 1,
            "senseType": "Auditory"
          },
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Auditory"
          }
        ]
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Senses 5 (Extended Hearing, Hearing Penetrates Concealment) • 5 points +1 point per additional",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Senses 5 (Extended Hearing, Hearing Penetrates Concealment)"
  },
  {
    "id": "light-light-constructs",
    "profileId": "light",
    "name": {
      "en": "Light Constructs",
      "pt": "Construtos de Luz"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 96,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Create • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Create"
  },
  {
    "id": "light-solar-sustenance",
    "profileId": "light",
    "name": {
      "en": "Solar Sustenance",
      "pt": "Sustento Solar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Limited — Sleep/starvation immunity only with light source.",
      "pt": "Imunidade · Limitado — Imunidade a sono/inanição apenas com fonte de luz."
    },
    "page": 96,
    "components": [
      {
        "effectId": "immunity",
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
      "Light"
    ],
    "audit": {
      "formula": "Immunity 2 (sleep and starvation), Source (light) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (sleep and starvation), Source (light)"
  },
  {
    "id": "light-vision-enhancement",
    "profileId": "light",
    "name": {
      "en": "Vision Enhancement",
      "pt": "Visão Aprimorada"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 96,
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
      "Light"
    ],
    "audit": {
      "formula": "Senses: choose any of Vision Counters Concealment (Invisibility), Vision Counters Illusion, Darkvision (all requiring 2 ranks), Extended Vision, Infravision, Low-Light Vision, Microscopic Vision, Radius Vision, and Ultravision • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Senses: choose any of Vision Counters Concealment (Invisibility), Vision Counters Illusion, Darkvision (all requiring 2 ranks), Extended Vision, Infravision, Low-Light Vision, Microscopic Vision, Radius Vision, and Ultravision"
  },
  {
    "id": "light-warp-light-2",
    "profileId": "light",
    "name": {
      "en": "Warp Light — 2",
      "pt": "Dobrar Luz — 2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 96,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Visual Concealment 2 • 4 points, 4 ranks (8 points)",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Visual Concealment 2"
  },
  {
    "id": "light-warp-light-4",
    "profileId": "light",
    "name": {
      "en": "Warp Light — 4",
      "pt": "Dobrar Luz — 4"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 96,
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
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Visual Concealment 2 • 4 points, 4 ranks (8 points)",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Visual Concealment 2"
  },
  {
    "id": "light-infrared-invisibility",
    "profileId": "light",
    "name": {
      "en": "Infrared Invisibility",
      "pt": "Invisibilidade Infravermelha"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 96,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Light"
    ],
    "audit": {
      "formula": "Infravision Concealment 2 • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Infravision Concealment 2"
  }
] satisfies PowerTemplate[];
