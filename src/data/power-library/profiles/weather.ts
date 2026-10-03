import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "weather-arctic-freeze",
    "profileId": "weather",
    "name": {
      "en": "Arctic Freeze",
      "pt": "Congelamento Ártico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Extra Condition · Limited Degree · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Condição Extra · Graus Limitados · Resistência Alternativa"
    },
    "page": 213,
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
      "Weather"
    ],
    "audit": {
      "formula": "Cumulative Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "weather-blinding-arc",
    "profileId": "weather",
    "name": {
      "en": "Blinding Arc",
      "pt": "Arco Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado · Resistência Alternativa"
    },
    "page": 213,
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
      "Weather"
    ],
    "audit": {
      "formula": "Cumulative Ranged Affliction (Resisted by Dodge, Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "weather-cyclone",
    "profileId": "weather",
    "name": {
      "en": "Cyclone",
      "pt": "Ciclone"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Increased Range · Concentration · Extra Condition · Instant Recovery · Alternate Resistance",
      "pt": "Aflição · Área · Alcance Aumentado · Concentration · Condição Extra · Recuperação Instantânea · Resistência Alternativa"
    },
    "page": 213,
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
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "concentration_affliction",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "instant_recovery",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "strength"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "strength"
        }
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Burst Area Ranged Affliction (Resisted and Overcome by Strength; Hindered and Impaired, Prone and Stunned, Incapacitated), Alternate Resistance (Strength), Concentration, Extra Condition, Instant Recovery • 4 points",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "weather-exposure",
    "profileId": "weather",
    "name": {
      "en": "Exposure",
      "pt": "Exposição"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Subtle",
      "pt": "Aflição · Alcance Aumentado · Sutil"
    },
    "page": 213,
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
            "modifierId": "subtle",
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
      "Weather"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated), Subtle • 1",
      "fixed": 1,
      "perRank": 2
    }
  },
  {
    "id": "weather-hailstorm",
    "profileId": "weather",
    "name": {
      "en": "Hailstorm",
      "pt": "Chuva de Granizo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area · Indirect",
      "pt": "Dano · Alcance Aumentado · Área · Indireto"
    },
    "page": 213,
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
      "Weather"
    ],
    "audit": {
      "formula": "Burst Area Ranged Damage (bludgeoning), Indirect 2 (falling from above) • 2 points + 3 points per rank",
      "fixed": 2,
      "perRank": 3
    }
  },
  {
    "id": "weather-lightning-bolt",
    "profileId": "weather",
    "name": {
      "en": "Lightning Bolt",
      "pt": "Relâmpago"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 213,
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
      "Weather"
    ],
    "audit": {
      "formula": "Ranged Damage (electrical) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "weather-thunderclap",
    "profileId": "weather",
    "name": {
      "en": "Thunderclap",
      "pt": "Estrondo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado"
    },
    "page": 214,
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
      "Weather"
    ],
    "audit": {
      "formula": "Cumulative Ranged Affliction (Resisted by Dodge, Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Hearing • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "weather-wind-blast",
    "profileId": "weather",
    "name": {
      "en": "Wind Blast",
      "pt": "Rajada de Vento"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Area · Reduced Range · Limited Direction",
      "pt": "Mover Objetos · Área · Alcance Reduzido · Direção Limitada"
    },
    "page": 214,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cone",
            "isPowerSpecific": false
          },
          {
            "modifierId": "reduced_range",
            "ranks": 1,
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
      "Weather"
    ],
    "audit": {
      "formula": "Cone Area Move Object, Close Range, Limited to Pushing Away • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "weather-fog-visibility-2",
    "profileId": "weather",
    "name": {
      "en": "Fog — Visibility -2",
      "pt": "Nevoeiro — Visibilidade -2"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 214,
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
      "Weather"
    ],
    "audit": {
      "formula": "Environment (Visibility) • 1 point per rank (impairment) or",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "weather-fog-visibility-5",
    "profileId": "weather",
    "name": {
      "en": "Fog — Visibility -5",
      "pt": "Nevoeiro — Visibilidade -5"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 214,
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
      "Weather"
    ],
    "audit": {
      "formula": "Environment (Visibility) • 1 point per rank (impairment) or",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "weather-fog-concealment",
    "profileId": "weather",
    "name": {
      "en": "Fog — Concealment",
      "pt": "Nevoeiro — Ocultação"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Attack · Area",
      "pt": "Camuflagem · Ataque · Área"
    },
    "page": 214,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 4,
            "option": "Cloud",
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
      "Weather"
    ],
    "audit": {
      "formula": "Environment (Visibility) • 1 point per rank (impairment) or",
      "fixed": 12,
      "perRank": 0
    }
  },
  {
    "id": "weather-immunity-to-weather-2",
    "profileId": "weather",
    "name": {
      "en": "Immunity to Weather — 2",
      "pt": "Imunidade ao Clima — 2"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 214,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Immunity 2 (Earthly Weather) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "weather-immunity-to-weather-10",
    "profileId": "weather",
    "name": {
      "en": "Immunity to Weather — 10",
      "pt": "Imunidade ao Clima — 10"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 214,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Immunity 2 (Earthly Weather) • 2 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "weather-whirlwind",
    "profileId": "weather",
    "name": {
      "en": "Whirlwind",
      "pt": "Redemoinho"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Area · Limited",
      "pt": "Deflexão · Área · Limitado"
    },
    "page": 214,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 2,
            "option": "Cloud",
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
      "Weather"
    ],
    "audit": {
      "formula": "Deflect, Cloud Area 2 (30-foot radius), Limited to Attacks Targeting Dodge • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "weather-wind-screen",
    "profileId": "weather",
    "name": {
      "en": "Wind Screen",
      "pt": "Barreira de Vento"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained · Limited",
      "pt": "Proteção · Impenetrável · Sustentado · Limitado"
    },
    "page": 214,
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
            "modifierId": "sustained_protection",
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
      "Weather"
    ],
    "audit": {
      "formula": "Impervious Protection, Sustained, Limited to Physical Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "weather-weatherproof",
    "profileId": "weather",
    "name": {
      "en": "Weatherproof",
      "pt": "Proteção Climática"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 214,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Environmental Adaptation: Weather"
        }
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Movement 1 (Environmental Adaptation: Weather) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "weather-wind-riding",
    "profileId": "weather",
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
    "page": 214,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "weather-weather-control",
    "profileId": "weather",
    "name": {
      "en": "Weather Control",
      "pt": "Controle Climático"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment · Selective",
      "pt": "Controle Ambiental · Seletivo"
    },
    "page": 215,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "selective",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Combined Conditions (3 PP)",
        "choices": [
          {
            "id": "environmentConditions",
            "label": {
              "en": "Conditions (3 PP budget)",
              "pt": "Condições (orçamento de 3 PP)"
            },
            "options": [
              {
                "value": "coldVisibility",
                "label": {
                  "en": "Cold 1 + Visibility -5",
                  "pt": "Frio 1 + Visibilidade -5"
                }
              },
              {
                "value": "heatVisibility",
                "label": {
                  "en": "Heat 1 + Visibility -5",
                  "pt": "Calor 1 + Visibilidade -5"
                }
              },
              {
                "value": "windVisibility",
                "label": {
                  "en": "Impede Movement 2 + Visibility -2",
                  "pt": "Impedir Movimento 2 + Visibilidade -2"
                }
              }
            ]
          }
        ]
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Environment (3 points of effect), Selective • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "weather-weather-prediction",
    "profileId": "weather",
    "name": {
      "en": "Weather Prediction",
      "pt": "Previsão do Tempo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited",
      "pt": "Sentidos · Limitado"
    },
    "page": 215,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "senseTraits": [
          {
            "id": "precognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Weather"
    ],
    "audit": {
      "formula": "Senses 4 (Precognition), Limited to Weather • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "weather-wind-lifting",
    "profileId": "weather",
    "name": {
      "en": "Wind-Lifting",
      "pt": "Erguer pelo Vento"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Area · Selective",
      "pt": "Mover Objetos · Área · Seletivo"
    },
    "page": 215,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
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
      "Weather"
    ],
    "audit": {
      "formula": "Burst Area Move Object, Selective • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  }
] satisfies PowerTemplate[];
