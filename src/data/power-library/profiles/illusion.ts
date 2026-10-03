import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "illusion-illusory-affliction",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Affliction",
      "pt": "Aflição Ilusória"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Variable Conditions · Reversible · Subtle",
      "pt": "Aflição · Alcance Aumentado · Condições Variáveis · Reversível · Sutil"
    },
    "page": 80,
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
            "modifierId": "variable_conditions",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reversible",
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will), Variable Conditions, Reversible, Subtle • 2 points + 5 points per rank",
      "fixed": 2,
      "perRank": 5
    }
  },
  {
    "id": "illusion-illusory-damage",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Damage",
      "pt": "Dano Ilusório"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Alternate Resistance · Resistible · Variable Descriptor — Will resistance priced as advantageous (+1); Will can also remove damage.",
      "pt": "Dano · Alcance Aumentado · Resistência Alternativa · Resistível · Descritor Variável — Resistência de Vontade considerada vantajosa (+1); Vontade também pode remover o dano."
    },
    "page": 80,
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
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "will",
              "alternateResistanceCost": "advantageous"
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "resistible",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Perception Ranged Damage, Alternate Resistance (Will), Resistible by Will (removes damage), Variable 2 (illusionary effects) • 2 points + 3 points per rank",
      "fixed": 2,
      "perRank": 3
    }
  },
  {
    "id": "illusion-sensory-deprivation",
    "profileId": "illusion",
    "name": {
      "en": "Sensory Deprivation",
      "pt": "Privação Sensorial"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative — Impaired, Disabled, Incapacitated",
      "pt": "Aflição · Alcance Aumentado · Cumulativo — Impaired, Disabled, Incapacitated"
    },
    "page": 80,
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Impaired, Disabled, Incapacitated) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "illusion-vertigo",
    "profileId": "illusion",
    "name": {
      "en": "Vertigo",
      "pt": "Vertigem"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative — Impaired, Prone, Incapacitated",
      "pt": "Aflição · Alcance Aumentado · Cumulativo — Impaired, Prone, Incapacitated"
    },
    "page": 80,
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Impaired, Prone, Incapacitated) • 4",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "illusion-hidden-cover",
    "profileId": "illusion",
    "name": {
      "en": "Hidden Cover",
      "pt": "Cobertura Oculta"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Protection · Fades · Impervious · Subtle · Sustained",
      "pt": "Traço Aprimorado · Proteção · Desgaste · Impenetrável · Sutil · Sustentado"
    },
    "page": 80,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 2,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Evasion"
        }
      },
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "fades",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "impervious",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "subtle",
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
      "Illusion"
    ],
    "audit": {
      "formula": "Enhanced Advantage (Evasion 2), Protection, Fades, Impervious, Subtle, Sustained • 3 points +1 point per rank",
      "fixed": 3,
      "perRank": 1
    }
  },
  {
    "id": "illusion-illusory-concealment-blending",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Concealment — blending",
      "pt": "Ocultação Ilusória — Mescla"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Blending",
      "pt": "Camuflagem · Mesclar"
    },
    "page": 80,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "blending",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "senses": [
            "all"
          ]
        }
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Concealment 10 (all senses), Blending or Resistible by Will • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "illusion-illusory-concealment-resistible",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Concealment — resistible",
      "pt": "Ocultação Ilusória — Resistível"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Resistible",
      "pt": "Camuflagem · Resistível"
    },
    "page": 80,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "resistible",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "all"
          ]
        }
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Concealment 10 (all senses), Blending or Resistible by Will • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "illusion-illusory-double",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Double",
      "pt": "Duplo Ilusório"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Illusion · Limited — Visual and auditory; only a double of yourself.",
      "pt": "Ilusão · Limitado — Visual e auditivo; apenas um duplo de si mesmo."
    },
    "page": 81,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "variableCostOption": "Three sense types"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion 2 (Visual and Aural), Limited to a Double of Yourself • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "illusion-illusory-projection",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Projection",
      "pt": "Projeção Ilusória"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Remote Sensing · Side Effect · Noticeable — Visual, auditory, mental; body defenseless and immobile.",
      "pt": "Sensoriamento Remoto · Efeito Colateral · Perceptível — Visual, auditivo, mental; corpo indefeso e imóvel."
    },
    "page": 81,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "side_effect",
            "ranks": 1,
            "options": {
              "sideEffectAlways": true
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "noticeable",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Four sense types"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual, Aural, and Mental), Side-Effect (physical body is defenseless and immobile, –2), Noticeable • 1 point for rank 1 + 2 points per additional rank",
      "fixed": -1,
      "perRank": 2
    }
  },
  {
    "id": "illusion-illusion-1",
    "profileId": "illusion",
    "name": {
      "en": "Illusion — 1",
      "pt": "Ilusão — 1"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 81,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "One sense type"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion • 1–5 points per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "illusion-illusion-2",
    "profileId": "illusion",
    "name": {
      "en": "Illusion — 2",
      "pt": "Ilusão — 2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 81,
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
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion • 1–5 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "illusion-illusion-3",
    "profileId": "illusion",
    "name": {
      "en": "Illusion — 3",
      "pt": "Ilusão — 3"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 81,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Three sense types"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion • 1–5 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "illusion-illusion-4",
    "profileId": "illusion",
    "name": {
      "en": "Illusion — 4",
      "pt": "Ilusão — 4"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 81,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Four sense types"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion • 1–5 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "illusion-illusion-5",
    "profileId": "illusion",
    "name": {
      "en": "Illusion — 5",
      "pt": "Ilusão — 5"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 81,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "All sense types"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion • 1–5 points per rank",
      "fixed": 0,
      "perRank": 5
    }
  },
  {
    "id": "illusion-illusory-disguise",
    "profileId": "illusion",
    "name": {
      "en": "Illusory Disguise",
      "pt": "Disfarce Ilusório"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Morph · Resistible",
      "pt": "Metamorfose · Resistível"
    },
    "page": 81,
    "components": [
      {
        "effectId": "morph",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "resistible",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Morph, Resistible by Will • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "illusion-sense-memory",
    "profileId": "illusion",
    "name": {
      "en": "Sense Memory",
      "pt": "Memória Sensorial"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature",
      "pt": "Característica"
    },
    "page": 82,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Feature 1 (Perfect Sense Recall) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "illusion-true-perception",
    "profileId": "illusion",
    "name": {
      "en": "True Perception",
      "pt": "Percepção Verdadeira"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses — Five senses purchase Counter Illusion at 2 PP each; the book labels this Senses 5 but totals 10.",
      "pt": "Sentidos — Cinco sentidos compram Contra Ilusão por 2 PP cada; o livro chama de Sentidos 5, mas soma 10."
    },
    "page": 82,
    "components": [
      {
        "effectId": "senses",
        "ranks": 10,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "counters_illusion",
            "ranks": 2,
            "senseType": "Visual",
            "detail": "Illusions"
          },
          {
            "id": "counters_illusion",
            "ranks": 2,
            "senseType": "Auditory",
            "detail": "Illusions"
          },
          {
            "id": "counters_illusion",
            "ranks": 2,
            "senseType": "Olfactory",
            "detail": "Illusions"
          },
          {
            "id": "counters_illusion",
            "ranks": 2,
            "senseType": "Tactile",
            "detail": "Illusions"
          },
          {
            "id": "counters_illusion",
            "ranks": 2,
            "senseType": "Mental",
            "detail": "Illusions"
          }
        ]
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Senses 5 (all senses Counter Illusions) • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "illusion-vocal-mimicry",
    "profileId": "illusion",
    "name": {
      "en": "Vocal Mimicry",
      "pt": "Mimetismo Vocal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion · Limited — Only voices.",
      "pt": "Ilusão · Limitado — Apenas vozes."
    },
    "page": 82,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "variableCostOption": "One sense type"
      }
    ],
    "descriptors": [
      "Illusion"
    ],
    "audit": {
      "formula": "Illusion 2 (Aural), Limited to Voices • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
