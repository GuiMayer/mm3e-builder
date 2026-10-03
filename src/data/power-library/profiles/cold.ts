import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "cold-cold-blast",
    "profileId": "cold",
    "name": {
      "en": "Cold Blast",
      "pt": "Rajada Fria"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range — Fatigued, Exhausted, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado — Fatigado, Exausto, Incapacitado; superado por Fortitude."
    },
    "page": 21,
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
      "Cold"
    ],
    "audit": {
      "formula": "Ranged Affliction (cold; Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated) • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (cold; Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated)"
  },
  {
    "id": "cold-cryokinesis",
    "profileId": "cold",
    "name": {
      "en": "Cryokinesis",
      "pt": "Criocinese"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Affects Objects — Dazed, Stunned, Transformed; also affects objects.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Afeta Objetos — Atordoado, Aturdido, Transformado; também afeta objetos."
    },
    "page": 21,
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
          },
          {
            "modifierId": "affects_objects",
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
      "Cold"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Transformed), Affects Objects • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Transformed), Affects Objects"
  },
  {
    "id": "cold-flash-freeze",
    "profileId": "cold",
    "name": {
      "en": "Flash Freeze",
      "pt": "Congelamento Súbito"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Increased Range · Affects Objects",
      "pt": "Enfraquecer · Alcance Aumentado · Afeta Objetos"
    },
    "page": 21,
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
          "resistance": "fortitude",
          "trait": "Toughness"
        }
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Ranged Weaken Toughness, Affects Only Objects • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Weaken Toughness, Affects Only Objects"
  },
  {
    "id": "cold-freezing-aura",
    "profileId": "cold",
    "name": {
      "en": "Freezing Aura",
      "pt": "Aura Congelante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 21,
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
      "Cold"
    ],
    "audit": {
      "formula": "Reaction Damage (cold; being touched) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Reaction Damage (cold; being touched)"
  },
  {
    "id": "cold-hailstorm",
    "profileId": "cold",
    "name": {
      "en": "Hailstorm",
      "pt": "Chuva de Granizo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Area · Increased Range · Indirect",
      "pt": "Dano · Área · Alcance Aumentado · Indireto"
    },
    "page": 21,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "indirect",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Cloud Area Ranged Damage (cold and bludgeoning), Indirect 2 • 2 points + 3 points per rank",
      "fixed": 2,
      "perRank": 3
    },
    "sourceFormula": "Cloud Area Ranged Damage (cold and bludgeoning), Indirect 2"
  },
  {
    "id": "cold-ice-blast",
    "profileId": "cold",
    "name": {
      "en": "Ice Blast",
      "pt": "Rajada de Gelo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 21,
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
      "Cold"
    ],
    "audit": {
      "formula": "Ranged Damage (cold and bludgeoning or slashing) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (cold and bludgeoning or slashing)"
  },
  {
    "id": "cold-ice-binding",
    "profileId": "cold",
    "name": {
      "en": "Ice Binding",
      "pt": "Aprisionamento de Gelo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Extra Condition · Limited Degree · Alternate Resistance — Hindered and Vulnerable; Defenseless and Immobilized. Overcome by Damage.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido e Vulnerável; Indefeso e Imóvel. Superado por Dano."
    },
    "page": 21,
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
      "Cold"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (ice; Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Cumulative Affliction (ice; Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree"
  },
  {
    "id": "cold-ice-fist",
    "profileId": "cold",
    "name": {
      "en": "Ice Fist",
      "pt": "Punho de Gelo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 22,
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
      "Cold"
    ],
    "audit": {
      "formula": "Strength-based Damage (cold and bludgeoning) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Strength-based Damage (cold and bludgeoning)"
  },
  {
    "id": "cold-ice-slick",
    "profileId": "cold",
    "name": {
      "en": "Ice Slick",
      "pt": "Piso Escorregadio"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Area · Extra Condition · Limited Degree · Alternate Resistance — Hindered and Vulnerable; Defenseless and Prone. Resisted and overcome by Dodge.",
      "pt": "Aflição · Alcance Aumentado · Área · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido e Vulnerável; Indefeso e Prostrado. Resistido e superado por Esquiva."
    },
    "page": 22,
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
      "Cold"
    ],
    "audit": {
      "formula": "Ranged Burst Area Affliction (ice; Resisted and Overcome by Dodge; Hindered and Vulnerable, Defenseless and Prone), Alternate Resistance, Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Burst Area Affliction (ice; Resisted and Overcome by Dodge; Hindered and Vulnerable, Defenseless and Prone), Alternate Resistance, Extra Condition, Limited Degree"
  },
  {
    "id": "cold-snowblind",
    "profileId": "cold",
    "name": {
      "en": "Snowblind",
      "pt": "Cegueira da Neve"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited · Alternate Resistance — Vision Impaired, Disabled, Unaware; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado · Resistência Alternativa — Visão Prejudicada, Debilitada, Inconsciente dos estímulos; superado por Fortitude."
    },
    "page": 22,
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
      "Cold"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Vision Impaired, Vision Disabled, Vision Unaware), Limited to One Sense • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Vision Impaired, Vision Disabled, Vision Unaware), Limited to One Sense"
  },
  {
    "id": "cold-immunity-to-cold-environment",
    "profileId": "cold",
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
    "page": 22,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), Immunity 10 (Cold Effects) • 1, 5, or 10 points",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), Immunity 10 (Cold Effects)"
  },
  {
    "id": "cold-immunity-to-cold-damage",
    "profileId": "cold",
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
    "page": 22,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), Immunity 10 (Cold Effects) • 1, 5, or 10 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), Immunity 10 (Cold Effects)"
  },
  {
    "id": "cold-immunity-to-cold-effects",
    "profileId": "cold",
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
    "page": 22,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), Immunity 10 (Cold Effects) • 1, 5, or 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Cold), Immunity 5 (Cold Damage), Immunity 10 (Cold Effects)"
  },
  {
    "id": "cold-immunity-to-heat-environment",
    "profileId": "cold",
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
    "page": 22,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), Immunity 10 (Heat Effects) • 1, 5, or 10 points",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), Immunity 10 (Heat Effects)"
  },
  {
    "id": "cold-immunity-to-heat-damage",
    "profileId": "cold",
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
    "page": 22,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), Immunity 10 (Heat Effects) • 1, 5, or 10 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), Immunity 10 (Heat Effects)"
  },
  {
    "id": "cold-immunity-to-heat-effects",
    "profileId": "cold",
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
    "page": 22,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), Immunity 10 (Heat Effects) • 1, 5, or 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 1 (Environmental Heat), Immunity 5 (Heat Damage), Immunity 10 (Heat Effects)"
  },
  {
    "id": "cold-ice-armor",
    "profileId": "cold",
    "name": {
      "en": "Ice Armor",
      "pt": "Armadura de Gelo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection",
      "pt": "Proteção"
    },
    "page": 22,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection"
  },
  {
    "id": "cold-infrared-invisibility",
    "profileId": "cold",
    "name": {
      "en": "Infrared Invisibility",
      "pt": "Invisibilidade Infravermelha"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment — Conceals only infravision.",
      "pt": "Camuflagem — Oculta apenas da infravisão."
    },
    "page": 22,
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
      "Cold"
    ],
    "audit": {
      "formula": "Concealment 2 (Infravision) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Concealment 2 (Infravision)"
  },
  {
    "id": "cold-ice-slides",
    "profileId": "cold",
    "name": {
      "en": "Ice Slides",
      "pt": "Trilhos de Gelo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform",
      "pt": "Voo · Platform"
    },
    "page": 22,
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
      "Cold"
    ],
    "audit": {
      "formula": "Flight, Platform (ice slides) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Platform (ice slides)"
  },
  {
    "id": "cold-ice-passage",
    "profileId": "cold",
    "name": {
      "en": "Ice Passage",
      "pt": "Passagem no Gelo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited — Only ice and snow; up to three ranks.",
      "pt": "Movimento · Limitado — Apenas gelo e neve; até três graduações."
    },
    "page": 22,
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
        "scalable": true,
        "fieldValues": {
          "movement": "Permeate"
        }
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Movement (Permeate), Limited to Ice and Snow •",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Movement (Permeate), Limited to Ice and Snow"
  },
  {
    "id": "cold-ice-portal",
    "profileId": "cold",
    "name": {
      "en": "Ice Portal",
      "pt": "Portal de Gelo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium — Ice is the teleport medium.",
      "pt": "Teleporte · Meio — Gelo é o meio de teleporte."
    },
    "page": 22,
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
      "Cold"
    ],
    "audit": {
      "formula": "Teleport, Medium (ice) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Teleport, Medium (ice)"
  },
  {
    "id": "cold-ice-tunneling",
    "profileId": "cold",
    "name": {
      "en": "Ice Tunneling",
      "pt": "Escavação no Gelo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing · Limited — Only ice and snow.",
      "pt": "Escavação · Limitado — Apenas gelo e neve."
    },
    "page": 22,
    "components": [
      {
        "effectId": "burrowing",
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
      "Cold"
    ],
    "audit": {
      "formula": "Burrowing, Limited to Ice and Snow • 1 point",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Burrowing, Limited to Ice and Snow"
  },
  {
    "id": "cold-ice-walking",
    "profileId": "cold",
    "name": {
      "en": "Ice Walking",
      "pt": "Caminhar no Gelo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 23,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Environmental Adaptation: Ice"
        }
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Movement 1 (Environmental Adaptation – Ice) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Movement 1 (Environmental Adaptation – Ice)"
  },
  {
    "id": "cold-snow-shoes",
    "profileId": "cold",
    "name": {
      "en": "Snow Shoes",
      "pt": "Raquetes de Neve"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited — Only on snow.",
      "pt": "Movimento · Limitado — Apenas sobre neve."
    },
    "page": 23,
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
          "movement": [
            "Trackless",
            "Water-Walking"
          ]
        }
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Movement 2 (Trackless, Water-Walking), Limited to Snow • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Trackless, Water-Walking), Limited to Snow"
  },
  {
    "id": "cold-speed-skating",
    "profileId": "cold",
    "name": {
      "en": "Speed Skating",
      "pt": "Patinação Veloz"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Speed · Limited — Only on ice.",
      "pt": "Velocidade · Limitado — Apenas sobre gelo."
    },
    "page": 23,
    "components": [
      {
        "effectId": "speed",
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
      "Cold"
    ],
    "audit": {
      "formula": "Speed, Limited to Ice • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Speed, Limited to Ice"
  },
  {
    "id": "cold-blizzard-cold-1-visibility-2",
    "profileId": "cold",
    "name": {
      "en": "Blizzard — Cold 1, Visibility -2",
      "pt": "Nevasca — Frio 1, Visibilidade -2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment · Environment",
      "pt": "Controle Ambiental · Controle Ambiental"
    },
    "page": 23,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Cold (1 degree)"
      },
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-2)"
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Environment (Cold, Visibility) • 2, 3, or 4 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (Cold, Visibility)"
  },
  {
    "id": "cold-blizzard-cold-1-visibility-5",
    "profileId": "cold",
    "name": {
      "en": "Blizzard — Cold 1, Visibility -5",
      "pt": "Nevasca — Frio 1, Visibilidade -5"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment · Environment",
      "pt": "Controle Ambiental · Controle Ambiental"
    },
    "page": 23,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Cold (1 degree)"
      },
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-5)"
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Environment (Cold, Visibility) • 2, 3, or 4 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Environment (Cold, Visibility)"
  },
  {
    "id": "cold-blizzard-cold-2-visibility-2",
    "profileId": "cold",
    "name": {
      "en": "Blizzard — Cold 2, Visibility -2",
      "pt": "Nevasca — Frio 2, Visibilidade -2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment · Environment",
      "pt": "Controle Ambiental · Controle Ambiental"
    },
    "page": 23,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Cold (2 degrees)"
      },
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-2)"
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Environment (Cold, Visibility) • 2, 3, or 4 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Environment (Cold, Visibility)"
  },
  {
    "id": "cold-blizzard-cold-2-visibility-5",
    "profileId": "cold",
    "name": {
      "en": "Blizzard — Cold 2, Visibility -5",
      "pt": "Nevasca — Frio 2, Visibilidade -5"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment · Environment",
      "pt": "Controle Ambiental · Controle Ambiental"
    },
    "page": 23,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Cold (2 degrees)"
      },
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-5)"
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Environment (Cold, Visibility) • 2, 3, or 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Environment (Cold, Visibility)"
  },
  {
    "id": "cold-cold-projection-1-degree",
    "profileId": "cold",
    "name": {
      "en": "Cold Projection — 1 degree",
      "pt": "Projeção de Frio — 1 grau"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 23,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Cold (1 degree)"
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Environment (Cold) • 1 or 2 points per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Cold)"
  },
  {
    "id": "cold-cold-projection-2-degree",
    "profileId": "cold",
    "name": {
      "en": "Cold Projection — 2 degree",
      "pt": "Projeção de Frio — 2 grau"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 23,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Cold (2 degrees)"
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Environment (Cold) • 1 or 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (Cold)"
  },
  {
    "id": "cold-ice-creatures",
    "profileId": "cold",
    "name": {
      "en": "Ice Creatures",
      "pt": "Criaturas de Gelo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Controlled — Create the creature separately; optional Multiple Minions and Horde are added in the builder.",
      "pt": "Invocar · Controlado — Crie a criatura separadamente; Múltiplos Lacaios e Horda opcionais podem ser acrescentados no Builder."
    },
    "page": 23,
    "components": [
      {
        "effectId": "summon",
        "ranks": 5,
        "modifiers": [
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Summon Ice Creature 5, Controlled • 15 points",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Summon Ice Creature 5, Controlled"
  },
  {
    "id": "cold-ice-form",
    "profileId": "cold",
    "name": {
      "en": "Ice Form",
      "pt": "Forma de Gelo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Protection — Immunity to cold effects and life support.",
      "pt": "Imunidade · Proteção — Imunidade a efeitos de frio e suporte vital."
    },
    "page": 23,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 20,
        "modifiers": []
      },
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 20 (Cold Effects, Life Support), Protection • 20 points +1 point per Protection rank",
      "fixed": 20,
      "perRank": 1
    },
    "sourceFormula": "Immunity 20 (Cold Effects, Life Support), Protection"
  },
  {
    "id": "cold-ice-sculpting",
    "profileId": "cold",
    "name": {
      "en": "Ice Sculpting",
      "pt": "Escultura de Gelo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create · Permanent",
      "pt": "Criação · Permanente"
    },
    "page": 23,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "permanent",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Create Ice, Permanent • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Create Ice, Permanent"
  },
  {
    "id": "cold-ice-shifting",
    "profileId": "cold",
    "name": {
      "en": "Ice Shifting",
      "pt": "Mover Gelo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Perception · Limited — Only ice and snow.",
      "pt": "Mover Objetos · Percepção · Limitado — Apenas gelo e neve."
    },
    "page": 23,
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
      "Cold"
    ],
    "audit": {
      "formula": "Move Object, Perception Range, Limited to Ice and Snow • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Move Object, Perception Range, Limited to Ice and Snow"
  },
  {
    "id": "cold-snow-form",
    "profileId": "cold",
    "name": {
      "en": "Snow Form",
      "pt": "Forma de Neve"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Insubstantial — Cold effects and life support; particulate form.",
      "pt": "Imunidade · Insubstancial — Efeitos de frio e suporte vital; forma de partículas."
    },
    "page": 23,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 20,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Cold"
    ],
    "audit": {
      "formula": "Immunity 20 (Cold Effects, Life Support), Insubstantial 1 • 25 points",
      "fixed": 25,
      "perRank": 0
    },
    "sourceFormula": "Immunity 20 (Cold Effects, Life Support), Insubstantial 1"
  },
  {
    "id": "cold-thermal-vision",
    "profileId": "cold",
    "name": {
      "en": "Thermal Vision",
      "pt": "Visão Térmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 23,
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
      "Cold"
    ],
    "audit": {
      "formula": "Senses 1 (Infravision) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Infravision)"
  }
] satisfies PowerTemplate[];
