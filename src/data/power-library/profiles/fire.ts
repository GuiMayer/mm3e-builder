import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "fire-fireball",
    "profileId": "fire",
    "name": {
      "en": "Fireball",
      "pt": "Bola de Fogo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 68,
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
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Burst Area Fire Damage • 30-foot radius,",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Burst Area Fire Damage"
  },
  {
    "id": "fire-firey-breath",
    "profileId": "fire",
    "name": {
      "en": "Firey Breath",
      "pt": "Sopro de Fogo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area",
      "pt": "Dano · Área"
    },
    "page": 68,
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
      "Fire"
    ],
    "audit": {
      "formula": "Cone Area Fire Damage • 60-foot length and",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Cone Area Fire Damage"
  },
  {
    "id": "fire-firey-cloud",
    "profileId": "fire",
    "name": {
      "en": "Firey Cloud",
      "pt": "Nuvem de Fogo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 68,
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
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Fire Damage • 15-foot",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Cloud Area Fire Damage"
  },
  {
    "id": "fire-fire-blast",
    "profileId": "fire",
    "name": {
      "en": "Fire Blast",
      "pt": "Rajada de Fogo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 68,
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
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Fire Damage • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Fire Damage"
  },
  {
    "id": "fire-fireflash",
    "profileId": "fire",
    "name": {
      "en": "Fireflash",
      "pt": "Clarão de Fogo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative · Limited · Alternate Resistance — Vision Impaired, Disabled, Unaware.",
      "pt": "Aflição · Área · Cumulativo · Limitado · Resistência Alternativa — Visão Prejudicada, Debilitada, Inconsciente dos estímulos."
    },
    "page": 68,
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
      "Fire"
    ],
    "audit": {
      "formula": "Perception Area Cumulative Affliction (Visually Impaired, Visually Disabled, Visually Unaware), Limited to One Sense • Resisted by Dodge (DC 10 + rank), Overcome",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Perception Area Cumulative Affliction (Visually Impaired, Visually Disabled, Visually Unaware), Limited to One Sense"
  },
  {
    "id": "fire-flame-aura",
    "profileId": "fire",
    "name": {
      "en": "Flame Aura",
      "pt": "Aura de Chamas"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 69,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Reaction Fire Damage (When Touched) • 4 points",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Reaction Fire Damage (When Touched)"
  },
  {
    "id": "fire-flamethrower",
    "profileId": "fire",
    "name": {
      "en": "Flamethrower",
      "pt": "Lança-chamas"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area",
      "pt": "Dano · Área"
    },
    "page": 69,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Line Area Fire Damage • 5 feet wide, 30 feet",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Line Area Fire Damage"
  },
  {
    "id": "fire-heatstroke",
    "profileId": "fire",
    "name": {
      "en": "Heatstroke",
      "pt": "Insolação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative — Fatigued, Exhausted, Incapacitated.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo — Fatigado, Exausto, Incapacitado."
    },
    "page": 69,
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
      "Fire"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Fatigued, Exhausted, Incapacitated) • Resisted by Fortitude",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Fatigued, Exhausted, Incapacitated)"
  },
  {
    "id": "fire-immolate",
    "profileId": "fire",
    "name": {
      "en": "Immolate",
      "pt": "Imolar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Increased Duration",
      "pt": "Dano · Alcance Aumentado · Duração Aumentada"
    },
    "page": 69,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_duration",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Perception Ranged Fire Damage, Concentration Duration • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Fire Damage, Concentration Duration"
  },
  {
    "id": "fire-melt",
    "profileId": "fire",
    "name": {
      "en": "Melt",
      "pt": "Derreter"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Increased Range · Affects Objects",
      "pt": "Enfraquecer · Alcance Aumentado · Afeta Objetos"
    },
    "page": 69,
    "components": [
      {
        "effectId": "weaken",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "affects_objects",
            "ranks": 1,
            "options": {
              "affectsOnlyObjects": true
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "trait": "Toughness",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Weaken Toughness, Affects Only Objects •",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Weaken Toughness, Affects Only Objects"
  },
  {
    "id": "fire-nova-burst",
    "profileId": "fire",
    "name": {
      "en": "Nova Burst",
      "pt": "Explosão Nova"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area · Tiring · Feature — Feature allows Extraordinary Effort for +2 effect rank.",
      "pt": "Dano · Área · Cansativo · Característica — Característica permite Esforço Extraordinário para +2 graduações de efeito."
    },
    "page": 69,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 3,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "tiring",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      },
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Burst Area Fire Damage, Area 3, Feature 1 (Extraordinary Effort for +2 effect rank), Tiring • 120-foot",
      "fixed": 1,
      "perRank": 3
    },
    "sourceFormula": "Burst Area Fire Damage, Area 3, Feature 1 (Extraordinary Effort for +2 effect rank), Tiring"
  },
  {
    "id": "fire-smoke-cloud",
    "profileId": "fire",
    "name": {
      "en": "Smoke Cloud",
      "pt": "Nuvem de Fumaça"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Concealment · Increased Range · Area · Attack",
      "pt": "Camuflagem · Alcance Aumentado · Área · Ataque"
    },
    "page": 69,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
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
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Visual Concealment Attack • 15-foot radius • 8 points (+4 points per +1 distance rank to",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Ranged Cloud Area Visual Concealment Attack"
  },
  {
    "id": "fire-suffocation",
    "profileId": "fire",
    "name": {
      "en": "Suffocation",
      "pt": "Sufocamento"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive — Dazed, Stunned, Incapacitated.",
      "pt": "Aflição · Alcance Aumentado · Progressivo — Atordoado, Aturdido, Incapacitado."
    },
    "page": 69,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Progressive Affliction (Dazed, Stunned, Incapacitated) • Resisted by Fortitude (DC 10 + rank),",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Ranged Progressive Affliction (Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "fire-fire-form",
    "profileId": "fire",
    "name": {
      "en": "Fire Form",
      "pt": "Forma de Fogo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 69,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 3,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Insubstantial 3 (Energy Form) • 15 points",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Insubstantial 3 (Energy Form)"
  },
  {
    "id": "fire-fire-shield",
    "profileId": "fire",
    "name": {
      "en": "Fire Shield",
      "pt": "Escudo de Fogo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Limited · Sustained — Only flammable weapons.",
      "pt": "Proteção · Impenetrável · Limitado · Sustentado — Apenas armas inflamáveis."
    },
    "page": 69,
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
            "modifierId": "limited",
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
      "Fire"
    ],
    "audit": {
      "formula": "Protection, Impervious, Limited to Flammable Weapons, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection, Impervious, Limited to Flammable Weapons, Sustained"
  },
  {
    "id": "fire-heat-absorbtion",
    "profileId": "fire",
    "name": {
      "en": "Heat Absorbtion",
      "pt": "Absorção de Calor"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Reaction · Immunity",
      "pt": "Traço Aprimorado · Desgaste · Reação · Imunidade"
    },
    "page": 70,
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
      },
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Enhanced Trait (Fades, Reaction: When Absorbing Heat), Immunity 10 (Heat Effects) • 10 points +",
      "fixed": 10,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Trait (Fades, Reaction: When Absorbing Heat), Immunity 10 (Heat Effects)"
  },
  {
    "id": "fire-immunity-to-cold-environment",
    "profileId": "fire",
    "name": {
      "en": "Immunity to Cold — Environment",
      "pt": "Imunidade a Frio — Ambiente"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 70,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), or Immunity 10 (Cold Effects) •",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), or Immunity 10 (Cold Effects)"
  },
  {
    "id": "fire-immunity-to-cold-damage",
    "profileId": "fire",
    "name": {
      "en": "Immunity to Cold — Damage",
      "pt": "Imunidade a Frio — Dano"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 70,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), or Immunity 10 (Cold Effects) •",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), or Immunity 10 (Cold Effects)"
  },
  {
    "id": "fire-immunity-to-cold-effects",
    "profileId": "fire",
    "name": {
      "en": "Immunity to Cold — Effects",
      "pt": "Imunidade a Frio — Efeitos"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 70,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), or Immunity 10 (Cold Effects) •",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), or Immunity 10 (Cold Effects)"
  },
  {
    "id": "fire-immunity-to-heat-environment",
    "profileId": "fire",
    "name": {
      "en": "Immunity to Heat — Environment",
      "pt": "Imunidade a Calor — Ambiente"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 70,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), or Immunity 10 (Heat Effects) •",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), or Immunity 10 (Heat Effects)"
  },
  {
    "id": "fire-immunity-to-heat-damage",
    "profileId": "fire",
    "name": {
      "en": "Immunity to Heat — Damage",
      "pt": "Imunidade a Calor — Dano"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 70,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), or Immunity 10 (Heat Effects) •",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), or Immunity 10 (Heat Effects)"
  },
  {
    "id": "fire-immunity-to-heat-effects",
    "profileId": "fire",
    "name": {
      "en": "Immunity to Heat — Effects",
      "pt": "Imunidade a Calor — Efeitos"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 70,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), or Immunity 10 (Heat Effects) •",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), or Immunity 10 (Heat Effects)"
  },
  {
    "id": "fire-fireport",
    "profileId": "fire",
    "name": {
      "en": "Fireport",
      "pt": "Teleportar pelas Chamas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Extended · Medium",
      "pt": "Teleporte · Estendido · Meio"
    },
    "page": 70,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
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
      "Fire"
    ],
    "audit": {
      "formula": "Teleport, Extended, Medium: Flames • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport, Extended, Medium: Flames"
  },
  {
    "id": "fire-rocket-flight",
    "profileId": "fire",
    "name": {
      "en": "Rocket Flight",
      "pt": "Voo Foguete"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 70,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Flight"
  },
  {
    "id": "fire-tunneling",
    "profileId": "fire",
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
    "page": 70,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank.",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Burrowing"
  },
  {
    "id": "fire-fire-creatures",
    "profileId": "fire",
    "name": {
      "en": "Fire Creatures",
      "pt": "Criaturas de Fogo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon",
      "pt": "Invocar"
    },
    "page": 70,
    "components": [
      {
        "effectId": "summon",
        "ranks": 8,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Summon Fire Creature 8 • 120-point minion",
      "fixed": 16,
      "perRank": 0
    },
    "sourceFormula": "Summon Fire Creature 8"
  },
  {
    "id": "fire-firelight",
    "profileId": "fire",
    "name": {
      "en": "Firelight",
      "pt": "Luz do Fogo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 70,
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
      "Fire"
    ],
    "audit": {
      "formula": "Environment (Light) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Light)"
  },
  {
    "id": "fire-fire-shaping",
    "profileId": "fire",
    "name": {
      "en": "Fire Shaping",
      "pt": "Moldar Fogo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Damage · Increased Range · Area · Increased Duration · Selective",
      "pt": "Dano · Alcance Aumentado · Área · Duração Aumentada · Seletivo"
    },
    "page": 70,
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
      "Fire"
    ],
    "audit": {
      "formula": "Ranged Shapeable Area Fire Damage, Concentration Duration, Selective • 30 cubic feet",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Ranged Shapeable Area Fire Damage, Concentration Duration, Selective"
  },
  {
    "id": "fire-infravision",
    "profileId": "fire",
    "name": {
      "en": "Infravision",
      "pt": "Infravisão"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 70,
    "components": [
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
      "Fire"
    ],
    "audit": {
      "formula": "Senses 1 (Infravision) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Infravision)"
  },
  {
    "id": "fire-pyrokinesis",
    "profileId": "fire",
    "name": {
      "en": "Pyrokinesis",
      "pt": "Pirocinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Damage · Increased Range · Area · Limited — Only existing fire.",
      "pt": "Dano · Alcance Aumentado · Área · Limitado — Apenas fogo existente."
    },
    "page": 71,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Shapeable",
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
      "Fire"
    ],
    "audit": {
      "formula": "Perception Range Shapeable Area Fire Damage, Limited to Existing Fire • 30 cubic feet (volume rank 5) • 3",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Perception Range Shapeable Area Fire Damage, Limited to Existing Fire"
  },
  {
    "id": "fire-warm-1",
    "profileId": "fire",
    "name": {
      "en": "Warm — 1",
      "pt": "Aquecer — 1"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 71,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Heat (1 degree)"
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Environment (Heat) • 1 point per rank, 2 points per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Heat)"
  },
  {
    "id": "fire-warm-2",
    "profileId": "fire",
    "name": {
      "en": "Warm — 2",
      "pt": "Aquecer — 2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 71,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Heat (2 degrees)"
      }
    ],
    "descriptors": [
      "Fire"
    ],
    "audit": {
      "formula": "Environment (Heat) • 1 point per rank, 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (Heat)"
  }
] satisfies PowerTemplate[];
