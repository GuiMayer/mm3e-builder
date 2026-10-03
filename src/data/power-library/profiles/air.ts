import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "air-air-blast",
    "profileId": "air",
    "name": {
      "en": "Air Blast",
      "pt": "Rajada de Ar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range — Compressed air impact.",
      "pt": "Dano · Alcance Aumentado — Impacto de ar comprimido."
    },
    "page": 6,
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
        "scalable": true,
        "fieldValues": {
          "damageBasis": "effect-only"
        }
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Ranged Damage (air pressure) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (air pressure)"
  },
  {
    "id": "air-air-burst",
    "profileId": "air",
    "name": {
      "en": "Air Burst",
      "pt": "Explosão de Ar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Area — Dazed, Stunned, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado · Área — Atordoado, Aturdido, Incapacitado; superado por Fortitude."
    },
    "page": 6,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Ranged Burst Area Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 3",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Burst Area Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "air-air-rifle",
    "profileId": "air",
    "name": {
      "en": "Air Rifle",
      "pt": "Rifle de Ar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range — Air-propelled projectiles.",
      "pt": "Dano · Alcance Aumentado — Projéteis impulsionados pelo ar."
    },
    "page": 6,
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
        "scalable": true,
        "fieldValues": {
          "damageBasis": "effect-only"
        }
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Ranged Damage (projectiles) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (projectiles)"
  },
  {
    "id": "air-blinding-gust",
    "profileId": "air",
    "name": {
      "en": "Blinding Gust",
      "pt": "Rajada Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Alternate Resistance · Limited — Impaired, Disabled, Unaware, limited to vision; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Resistência Alternativa · Limitado — Prejudicado, Debilitado, Inconsciente dos estímulos, limitado à visão; superado por Fortitude."
    },
    "page": 6,
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
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "dodge"
            },
            "isPowerSpecific": false
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
      "Air"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision"
  },
  {
    "id": "air-flinging-gust",
    "profileId": "air",
    "name": {
      "en": "Flinging Gust",
      "pt": "Rajada de Arremesso"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Limited Direction — Moves targets only away from the user.",
      "pt": "Mover Objetos · Direção Limitada — Move alvos apenas para longe do usuário."
    },
    "page": 6,
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
      "Air"
    ],
    "audit": {
      "formula": "Move Object, Limited Direction • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Move Object, Limited Direction"
  },
  {
    "id": "air-stench",
    "profileId": "air",
    "name": {
      "en": "Stench",
      "pt": "Fedor"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Sense-Dependent — Dazed, Stunned, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Dependente de Sentido — Atordoado, Aturdido, Incapacitado; superado por Fortitude."
    },
    "page": 6,
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
            "modifierId": "sense_dependent",
            "ranks": 1,
            "options": {
              "sense": "Olfactory"
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
      "Air"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Smell-Dependent • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Smell-Dependent"
  },
  {
    "id": "air-stench-cloud",
    "profileId": "air",
    "name": {
      "en": "Stench Cloud",
      "pt": "Nuvem de Fedor"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Sense-Dependent · Area — Dazed, Stunned, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Dependente de Sentido · Área — Atordoado, Aturdido, Incapacitado; superado por Fortitude."
    },
    "page": 6,
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
            "modifierId": "sense_dependent",
            "ranks": 1,
            "options": {
              "sense": "Olfactory"
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
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
      "Air"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Smell-Dependent • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Cloud Area Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Smell-Dependent"
  },
  {
    "id": "air-suffocation",
    "profileId": "air",
    "name": {
      "en": "Suffocation",
      "pt": "Sufocamento"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive — Fatigued, Exhausted, Incapacitated; overcome by Fortitude.",
      "pt": "Aflição · Alcance Aumentado · Progressivo — Fatigado, Exausto, Incapacitado; superado por Fortitude."
    },
    "page": 6,
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
      "Air"
    ],
    "audit": {
      "formula": "Ranged Progressive Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Ranged Progressive Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated)"
  },
  {
    "id": "air-tornado",
    "profileId": "air",
    "name": {
      "en": "Tornado",
      "pt": "Tornado"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Area · Damaging",
      "pt": "Mover Objetos · Área · Causar Dano"
    },
    "page": 6,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cylinder",
            "isPowerSpecific": false
          },
          {
            "modifierId": "damaging",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Cylinder Area Move Object, Damaging • 4 points per rank, +1 point per rank per +1 area distance rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Cylinder Area Move Object, Damaging"
  },
  {
    "id": "air-air-bubble",
    "profileId": "air",
    "name": {
      "en": "Air Bubble",
      "pt": "Bolha de Ar"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Affects Others · Area · Sustained — Immunity to suffocation for the user and others.",
      "pt": "Imunidade · Afeta Outros · Área · Sustentado — Imunidade a sufocamento para o usuário e outras pessoas."
    },
    "page": 7,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "affects_others",
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
            "modifierId": "sustained_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Immunity 2 (Suffocation), Affects Others, Cloud Area, Sustained • 6 points + 2 points per +1 area distance rank",
      "fixed": 6,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (Suffocation), Affects Others, Cloud Area, Sustained"
  },
  {
    "id": "air-air-shield",
    "profileId": "air",
    "name": {
      "en": "Air Shield",
      "pt": "Escudo de Ar"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 7,
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
      "Air"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection, Sustained"
  },
  {
    "id": "air-air-supply",
    "profileId": "air",
    "name": {
      "en": "Air Supply",
      "pt": "Suprimento de Ar"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Sustained — Immunity to suffocation.",
      "pt": "Imunidade · Sustentado — Imunidade a sufocamento."
    },
    "page": 7,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
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
      "Air"
    ],
    "audit": {
      "formula": "Immunity 2 (suffocation), Sustained • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (suffocation), Sustained"
  },
  {
    "id": "air-deflecting-winds",
    "profileId": "air",
    "name": {
      "en": "Deflecting Winds",
      "pt": "Ventos Defletores"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Area · Limited — Only physical projectiles.",
      "pt": "Deflexão · Área · Limitado — Apenas projéteis físicos."
    },
    "page": 7,
    "components": [
      {
        "effectId": "deflect",
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
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Deflect, Burst Area, Limited to Physical Projectiles • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Deflect, Burst Area, Limited to Physical Projectiles"
  },
  {
    "id": "air-mist-visibility-2",
    "profileId": "air",
    "name": {
      "en": "Mist — Visibility -2",
      "pt": "Névoa — Visibilidade -2"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 7,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-2)"
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Environment (Visibility) • 1 point per rank (–2 modifier) or",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Visibility)"
  },
  {
    "id": "air-mist-visibility-5",
    "profileId": "air",
    "name": {
      "en": "Mist — Visibility -5",
      "pt": "Névoa — Visibilidade -5"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 7,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-5)"
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Environment (Visibility) • 1 point per rank (–2 modifier) or",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (Visibility)"
  },
  {
    "id": "air-wind-wall",
    "profileId": "air",
    "name": {
      "en": "Wind Wall",
      "pt": "Muralha de Vento"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Move Object · Area · Limited Direction — Movement along the length of the line.",
      "pt": "Mover Objetos · Área · Direção Limitada — Movimento ao longo do comprimento da linha."
    },
    "page": 7,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
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
      "Air"
    ],
    "audit": {
      "formula": "Line Area Move Object, Limited Direction (along the length of the line) • 2 points per rank +1 point per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Line Area Move Object, Limited Direction (along the length of the line)"
  },
  {
    "id": "air-air-walking",
    "profileId": "air",
    "name": {
      "en": "Air-Walking",
      "pt": "Caminhar no Ar"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Subtle · Quirk",
      "pt": "Voo · Sutil · Peculiaridade"
    },
    "page": 7,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 1,
            "options": {
              "detail": "Falls when prone"
            },
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Flight 1, Subtle, Quirk (the prone condition causes you to fall, –1 point) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Flight 1, Subtle, Quirk (the prone condition causes you to fall, –1 point)"
  },
  {
    "id": "air-full-sail",
    "profileId": "air",
    "name": {
      "en": "Full Sail",
      "pt": "Velas ao Vento"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Swimming · Affects Objects · Limited — Only wind-powered vehicles; flight is an alternate effect.",
      "pt": "Natação · Afeta Objetos · Limitado — Apenas veículos movidos pelo vento; voo é um efeito alternativo."
    },
    "page": 7,
    "components": [
      {
        "effectId": "swimming",
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Swimming, Affects Objects, Limited to Wind-Powered Vehicles, Alternate Effect: Flight, Affects Objects, Gliding, Limited to Wind-Powered Vehicles • 1 point per 2 ranks + 1",
      "fixed": 1,
      "perRank": 0.5
    },
    "alternateEffects": [
      {
        "name": {
          "en": "Full Sail — Flight",
          "pt": "Velas ao Vento — Voo"
        },
        "components": [
          {
            "effectId": "flight",
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
                "modifierId": "gliding",
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
        ]
      }
    ],
    "sourceFormula": "Swimming, Affects Objects, Limited to Wind-Powered Vehicles, Alternate Effect: Flight, Affects Objects, Gliding, Limited to Wind-Powered Vehicles"
  },
  {
    "id": "air-gliding",
    "profileId": "air",
    "name": {
      "en": "Gliding",
      "pt": "Planar"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Gliding",
      "pt": "Voo · Planador"
    },
    "page": 8,
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
      "Air"
    ],
    "audit": {
      "formula": "Flight, Gliding • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Gliding"
  },
  {
    "id": "air-grounding",
    "profileId": "air",
    "name": {
      "en": "Grounding",
      "pt": "Impedir Voo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Nullify · Concentration · Area · Effortless",
      "pt": "Anulação · Concentração · Área · Sem Esforço"
    },
    "page": 8,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "concentration_nullify",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cylinder",
            "isPowerSpecific": false
          },
          {
            "modifierId": "effortless_nullify",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Air-powered flight and swimming"
        }
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Nullify Flight and Swimming Based on Air, Concentration, Cylinder Area, Effortless • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Nullify Flight and Swimming Based on Air, Concentration, Cylinder Area, Effortless"
  },
  {
    "id": "air-wind-riding",
    "profileId": "air",
    "name": {
      "en": "Wind-Riding",
      "pt": "Cavalgar o Vento"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 8,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Flight"
  },
  {
    "id": "air-aerokinesis",
    "profileId": "air",
    "name": {
      "en": "Aerokinesis",
      "pt": "Aerocinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 8,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Move Object • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Move Object"
  },
  {
    "id": "air-air-creatures",
    "profileId": "air",
    "name": {
      "en": "Air Creatures",
      "pt": "Criaturas de Ar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon — Summons a 90-point air creature; create its traits separately.",
      "pt": "Invocar — Invoca uma criatura de ar de 90 pontos; seus atributos devem ser criados separadamente."
    },
    "page": 8,
    "components": [
      {
        "effectId": "summon",
        "ranks": 6,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Summon Air Creature 6 (90-point minion) • 12 points",
      "fixed": 12,
      "perRank": 0
    },
    "sourceFormula": "Summon Air Creature 6 (90-point minion)"
  },
  {
    "id": "air-air-form",
    "profileId": "air",
    "name": {
      "en": "Air Form",
      "pt": "Forma de Ar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Flight · Insubstantial — Gaseous form and visual concealment.",
      "pt": "Camuflagem · Voo · Insubstancial — Forma gasosa e ocultação visual."
    },
    "page": 8,
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
        "effectId": "insubstantial",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Concealment 4 (visual), Flight 1, Insubstantial 2 (gaseous) • 20 points",
      "fixed": 20,
      "perRank": 0
    },
    "sourceFormula": "Concealment 4 (visual), Flight 1, Insubstantial 2 (gaseous)"
  },
  {
    "id": "air-air-sense",
    "profileId": "air",
    "name": {
      "en": "Air Sense",
      "pt": "Sentido do Ar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 8,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Tactile",
            "detail": "Air"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Tactile"
          }
        ]
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Senses 2 (Air Awareness, Ranged Touch) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses 2 (Air Awareness, Ranged Touch)"
  },
  {
    "id": "air-solid-air",
    "profileId": "air",
    "name": {
      "en": "Solid Air",
      "pt": "Ar Sólido"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 9,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Create Solid Air Objects • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Create Solid Air Objects"
  },
  {
    "id": "air-wind-conditions-1-rank",
    "profileId": "air",
    "name": {
      "en": "Wind Conditions — 1 rank",
      "pt": "Condições do Vento — 1 graduação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 9,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Impede Movement (1 rank)"
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Environment (Impede Movement) • 1 point",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Impede Movement)"
  },
  {
    "id": "air-wind-conditions-2-rank",
    "profileId": "air",
    "name": {
      "en": "Wind Conditions — 2 rank",
      "pt": "Condições do Vento — 2 graduação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 9,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Impede Movement (2 ranks)"
      }
    ],
    "descriptors": [
      "Air"
    ],
    "audit": {
      "formula": "Environment (Impede Movement) • 1 point",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (Impede Movement)"
  },
  {
    "id": "air-whispering-wind",
    "profileId": "air",
    "name": {
      "en": "Whispering Wind",
      "pt": "Vento Sussurrante"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Communication · Subtle — Auditory communication through air.",
      "pt": "Comunicação · Sutil — Comunicação auditiva através do ar."
    },
    "page": 9,
    "components": [
      {
        "effectId": "communication",
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
      "Air"
    ],
    "audit": {
      "formula": "Communication (auditory, air), Subtle 1 • 1",
      "fixed": 1,
      "perRank": 4
    },
    "sourceFormula": "Communication (auditory, air), Subtle 1"
  }
] satisfies PowerTemplate[];
