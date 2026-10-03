import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "radiation-blinding-radiance",
    "profileId": "radiation",
    "name": {
      "en": "Blinding Radiance",
      "pt": "Radiância Cegante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado · Resistência Alternativa"
    },
    "page": 149,
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
      "Radiation"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "radiation-melting-heat",
    "profileId": "radiation",
    "name": {
      "en": "Melting Heat",
      "pt": "Calor Derretedor"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Increased Range",
      "pt": "Enfraquecer · Alcance Aumentado"
    },
    "page": 149,
    "components": [
      {
        "effectId": "weaken",
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
          "trait": "Toughness",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Ranged Weaken Toughness (melting) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "radiation-mutation",
    "profileId": "radiation",
    "name": {
      "en": "Mutation",
      "pt": "Mutação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Progressive · Increased Range",
      "pt": "Aflição · Progressivo · Alcance Aumentado"
    },
    "page": 149,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
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
      "Radiation"
    ],
    "audit": {
      "formula": "Progressive Ranged Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Transformed) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "radiation-radiation-sickness",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Sickness",
      "pt": "Envenenamento por Radiação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Progressive · Increased Range",
      "pt": "Aflição · Progressivo · Alcance Aumentado"
    },
    "page": 149,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
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
      "Radiation"
    ],
    "audit": {
      "formula": "Progressive Ranged Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Incapacitated) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "radiation-radiation-blast",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Blast",
      "pt": "Rajada de Radiação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 149,
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
      "Radiation"
    ],
    "audit": {
      "formula": "Ranged Damage (radiation) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "radiation-radiation-burst",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Burst",
      "pt": "Explosão de Radiação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 149,
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
      "Radiation"
    ],
    "audit": {
      "formula": "Ranged Burst Area Damage (radiation) • 3",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "radiation-radioactive-aura",
    "profileId": "radiation",
    "name": {
      "en": "Radioactive Aura",
      "pt": "Aura Radioativa"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 150,
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
      "Radiation"
    ],
    "audit": {
      "formula": "Reaction Damage (being touched, radiation) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "radiation-deflection-field",
    "profileId": "radiation",
    "name": {
      "en": "Deflection Field",
      "pt": "Campo Defletor"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained",
      "pt": "Proteção · Impenetrável · Sustentado"
    },
    "page": 150,
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
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Impervious Protection (deflection field), Sustained • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "radiation-kinetic-nullification",
    "profileId": "radiation",
    "name": {
      "en": "Kinetic Nullification",
      "pt": "Anulação Cinética"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Limited",
      "pt": "Deflexão · Limitado"
    },
    "page": 150,
    "components": [
      {
        "effectId": "deflect",
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
      "Radiation"
    ],
    "audit": {
      "formula": "Deflect, Limited to Kinetic Attacks • 1",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "radiation-radiation-absorption",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Absorption",
      "pt": "Absorção de Radiação"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Source",
      "pt": "Traço Aprimorado · Desgaste · Fonte"
    },
    "page": 150,
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
            "modifierId": "source_enhanced_trait",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Defense"
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Enhanced Trait, Fades, Source (radiation) • 1 point per 3 points of Enhanced Trait cost.",
      "fixed": 0,
      "perRank": 0.3333333333333333
    }
  },
  {
    "id": "radiation-radiation-immunity-1",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Immunity — 1",
      "pt": "Imunidade à Radiação — 1"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 150,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Immunity 1, 2, 5, or 10 • 1, 2, 5, or 10 points",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "radiation-radiation-immunity-2",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Immunity — 2",
      "pt": "Imunidade à Radiação — 2"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 150,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Immunity 1, 2, 5, or 10 • 1, 2, 5, or 10 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "radiation-radiation-immunity-5",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Immunity — 5",
      "pt": "Imunidade à Radiação — 5"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 150,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Immunity 1, 2, 5, or 10 • 1, 2, 5, or 10 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "radiation-radiation-immunity-10",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Immunity — 10",
      "pt": "Imunidade à Radiação — 10"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 150,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Immunity 1, 2, 5, or 10 • 1, 2, 5, or 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "radiation-radiation-shield",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Shield",
      "pt": "Escudo de Radiação"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Affects Others · Area · Sustained",
      "pt": "Imunidade · Afeta Outros · Área · Sustentado"
    },
    "page": 150,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_others",
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
            "modifierId": "sustained_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Immunity 1 (background radiation), Affects Others, Burst Area, Sustained • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "radiation-air-wave",
    "profileId": "radiation",
    "name": {
      "en": "Air Wave",
      "pt": "Onda de Rádio"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium",
      "pt": "Teleporte · Meio"
    },
    "page": 150,
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
      "Radiation"
    ],
    "audit": {
      "formula": "Teleport, Medium (radio transmissions) • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "radiation-nuclear-shift",
    "profileId": "radiation",
    "name": {
      "en": "Nuclear Shift",
      "pt": "Deslocamento Nuclear"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium",
      "pt": "Teleporte · Meio"
    },
    "page": 150,
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
      "Radiation"
    ],
    "audit": {
      "formula": "Teleport, Medium (radiation sources) • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "radiation-melt-through",
    "profileId": "radiation",
    "name": {
      "en": "Melt Through",
      "pt": "Derreter Caminho"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 150,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "radiation-carbon-dating",
    "profileId": "radiation",
    "name": {
      "en": "Carbon Dating",
      "pt": "Datação por Carbono"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited",
      "pt": "Sentidos · Limitado"
    },
    "page": 151,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Age"
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
      "Radiation"
    ],
    "audit": {
      "formula": "Senses 2 (Detect Age, Acute), Limited to Non- living Items • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "radiation-irradiate",
    "profileId": "radiation",
    "name": {
      "en": "Irradiate",
      "pt": "Irradiar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment · Subtle",
      "pt": "Controle Ambiental · Sutil"
    },
    "page": 151,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Heat (1 degree)"
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Subtle Environment (radiation, equivalent to heat) •",
      "fixed": 1,
      "perRank": 1
    }
  },
  {
    "id": "radiation-radar",
    "profileId": "radiation",
    "name": {
      "en": "Radar",
      "pt": "Radar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 151,
    "components": [
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "radio",
            "ranks": 1
          },
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Radio"
          }
        ]
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Senses 3 (Accurate Radio) • 3 points",
      "fixed": 3,
      "perRank": 0
    }
  },
  {
    "id": "radiation-radio-hearing",
    "profileId": "radiation",
    "name": {
      "en": "Radio Hearing",
      "pt": "Audição de Rádio"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 151,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "radio",
            "ranks": 1
          }
        ]
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Senses 1 (Radio) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "radiation-radiation-form",
    "profileId": "radiation",
    "name": {
      "en": "Radiation Form",
      "pt": "Forma de Radiação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Insubstantial",
      "pt": "Imunidade · Insubstancial"
    },
    "page": 151,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 3,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Immunity 10 (Life Support), Insubstantial 3 (radiation) • 25 points",
      "fixed": 25,
      "perRank": 0
    }
  },
  {
    "id": "radiation-scrub-radiation",
    "profileId": "radiation",
    "name": {
      "en": "Scrub Radiation",
      "pt": "Limpar Radiação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Area · Simultaneous",
      "pt": "Anulação · Área · Simultâneo"
    },
    "page": 151,
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
          "descriptor": "Radiation"
        }
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Nullify Radiation, Burst Area, Simultaneous • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "radiation-sense-radiation",
    "profileId": "radiation",
    "name": {
      "en": "Sense Radiation",
      "pt": "Sentir Radiação"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 151,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Radiation"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Senses 2 (Detect Radiation, Ranged) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "radiation-static-field",
    "profileId": "radiation",
    "name": {
      "en": "Static Field",
      "pt": "Campo de Estática"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Increased Range · Area · Attack",
      "pt": "Camuflagem · Alcance Aumentado · Área · Ataque"
    },
    "page": 151,
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
            "radio"
          ]
        }
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Ranged Burst Area Concealment Attack 2 (all radio) • 8 points + 2 points per +1 distance rank to area.",
      "fixed": 8,
      "perRank": 0
    }
  },
  {
    "id": "radiation-x-ray-vision",
    "profileId": "radiation",
    "name": {
      "en": "X-Ray Vision",
      "pt": "Visão de Raios X"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 151,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Radiation"
    ],
    "audit": {
      "formula": "Senses 4 (Vision Penetrates Concealment, except for lead and radiation shielding) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
