import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "dream-dream-trap",
    "profileId": "dream",
    "name": {
      "en": "Dream Trap",
      "pt": "Prisão de Sonho"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Limited Degree · Limited — Third degree only: Transformed asleep; sleeping targets only.",
      "pt": "Aflição · Alcance Aumentado · Graus Limitados · Limitado — Apenas terceiro grau: Transformado adormecido; apenas alvos dormindo."
    },
    "page": 48,
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
            "ranks": 2,
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Transformed—Asleep), Limited Degree (third only), Limited to Sleeping Targets • 1 point per rank",
      "fixed": 0,
      "perRank": 1,
      "discrepancy": {
        "reason": {
          "en": "The printed 1 PP/rank conflicts with Limited Degree (third only, -2) and Limited to sleeping targets (-1). The actual composition is 1 PP per 2 ranks.",
          "pt": "Divergência da fonte: The printed 1 PP/rank conflicts with Limited Degree (third only, -2) and Limited to sleeping targets (-1). The actual composition is 1 PP per 2 ranks."
        },
        "fixed": 0,
        "perRank": 0.5
      }
    }
  },
  {
    "id": "dream-nightmare-blast",
    "profileId": "dream",
    "name": {
      "en": "Nightmare Blast",
      "pt": "Rajada de Pesadelos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Variable Conditions · Variable Descriptor · Limited — Variable conditions; sleeping targets only.",
      "pt": "Aflição · Alcance Aumentado · Condições Variáveis · Descritor Variável · Limitado — Condições variáveis; apenas alvos dormindo."
    },
    "page": 48,
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
            "modifierId": "variable_descriptor",
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
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; conditions vary), Variable Conditions, Variable Descriptor 1 (nightmares), Limited to Sleeping Targets • 1 point + 4 points per rank",
      "fixed": 1,
      "perRank": 4
    }
  },
  {
    "id": "dream-sleep",
    "profileId": "dream",
    "name": {
      "en": "Sleep",
      "pt": "Sono"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative — Fatigued, Exhausted, Asleep.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo — Fatigado, Exausto, Adormecido."
    },
    "page": 49,
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
      "Dream"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Fatigued, Exhausted, Asleep) • 4 points",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "dream-sleep-deprivation",
    "profileId": "dream",
    "name": {
      "en": "Sleep Deprivation",
      "pt": "Privação de Sono"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Subtle · Limited — Fatigued, Exhausted, Incapacitated; one recovery check per day.",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Sutil · Limitado — Fatigado, Exausto, Incapacitado; um teste de recuperação por dia."
    },
    "page": 49,
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
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "subtle",
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
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Fatigued, Exhausted, Incapacitated), Progressive, Subtle, Limited to one check per day • 1 point +",
      "fixed": 1,
      "perRank": 4
    }
  },
  {
    "id": "dream-dream-dissipation",
    "profileId": "dream",
    "name": {
      "en": "Dream Dissipation",
      "pt": "Dissipação de Sonhos"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Nullify · Simultaneous",
      "pt": "Anulação · Simultâneo"
    },
    "page": 49,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Dream powers"
        }
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Nullify Dream Powers, Simultaneous • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "dream-dream-immunity",
    "profileId": "dream",
    "name": {
      "en": "Dream Immunity",
      "pt": "Imunidade a Sonhos"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 49,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Immunity 2 (Dream Powers) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "dream-healing-trance",
    "profileId": "dream",
    "name": {
      "en": "Healing Trance",
      "pt": "Transe Curativo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration · Source — Source: sleep.",
      "pt": "Regeneração · Fonte — Fonte: sono."
    },
    "page": 49,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "source",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Regeneration, Source (Sleep) • 1 point per 2",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "dream-sleepless",
    "profileId": "dream",
    "name": {
      "en": "Sleepless",
      "pt": "Sem Sono"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 49,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Immunity 1 (Sleep) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "dream-dreamport",
    "profileId": "dream",
    "name": {
      "en": "Dreamport",
      "pt": "Teleporte Onírico"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Medium — Medium: dreamers.",
      "pt": "Teleporte · Preciso · Meio — Meio: sonhadores."
    },
    "page": 49,
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
            "modifierId": "medium",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Medium (dreamers) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "dream-dream-projection",
    "profileId": "dream",
    "name": {
      "en": "Dream Projection",
      "pt": "Projeção Onírica"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Communication · Limited — Mental; limited to dreamers.",
      "pt": "Comunicação · Limitado — Mental; limitado a sonhadores."
    },
    "page": 49,
    "components": [
      {
        "effectId": "communication",
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
      "Dream"
    ],
    "audit": {
      "formula": "Communication (Mental), Limited to Dreamers • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "dream-dream-travel",
    "profileId": "dream",
    "name": {
      "en": "Dream Travel",
      "pt": "Viagem Onírica"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 50,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Dimensional Travel: Dream World"
        }
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Movement 1 (Dimensional Travel) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "dream-dream-control",
    "profileId": "dream",
    "name": {
      "en": "Dream Control",
      "pt": "Controle de Sonhos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion · Limited — Minds only, sleeping subjects only.",
      "pt": "Ilusão · Limitado — Apenas mentes de pessoas adormecidas."
    },
    "page": 50,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "All sense types"
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Illusion (All Senses), Limited to Minds, Limited to Sleeping Subjects • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "dream-dream-mastery",
    "profileId": "dream",
    "name": {
      "en": "Dream Mastery",
      "pt": "Domínio dos Sonhos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Action · Limited — Only while asleep and in dreams.",
      "pt": "Variável · Ação · Limitado — Apenas dormindo e em sonhos."
    },
    "page": 50,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "action_variable",
            "ranks": 2,
            "options": {
              "subtypeId": "free"
            },
            "isPowerSpecific": true
          },
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
      "Dream"
    ],
    "audit": {
      "formula": "Variable (dream powers, Free Action, Limited to while asleep, Limited to while in dreams) • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    }
  },
  {
    "id": "dream-dream-reading",
    "profileId": "dream",
    "name": {
      "en": "Dream Reading",
      "pt": "Leitura de Sonhos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Mind Reading · Limited — Sleeping subjects only.",
      "pt": "Leitura Mental · Limitado — Apenas pessoas dormindo."
    },
    "page": 50,
    "components": [
      {
        "effectId": "mind-reading",
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
      "Dream"
    ],
    "audit": {
      "formula": "Mind Reading, Limited to Sleeping Subjects • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "dream-dream-touch",
    "profileId": "dream",
    "name": {
      "en": "Dream Touch",
      "pt": "Toque Onírico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Senses",
      "pt": "Sensoriamento Remoto · Sentidos"
    },
    "page": 50,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "One sense type"
      },
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Mental"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Dreamers"
          }
        ]
      }
    ],
    "descriptors": [
      "Dream"
    ],
    "audit": {
      "formula": "Remote Sensing (mental), Senses 4 (Accurate Ranged Detect Dreamers, mental) • 4 points + 1 point per rank",
      "fixed": 4,
      "perRank": 1
    }
  },
  {
    "id": "dream-precognitive-dreams",
    "profileId": "dream",
    "name": {
      "en": "Precognitive Dreams",
      "pt": "Sonhos Precognitivos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited — Only while dreaming.",
      "pt": "Sentidos · Limitado — Apenas durante sonhos."
    },
    "page": 50,
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
      "Dream"
    ],
    "audit": {
      "formula": "Senses 4 (Precognition), Limited to Dreaming • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "dream-sleep-substitute",
    "profileId": "dream",
    "name": {
      "en": "Sleep Substitute",
      "pt": "Substituto do Sono"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing · Energizing · Limited — Limited to Energizing.",
      "pt": "Cura · Energizing · Limitado — Limitado a Energizar."
    },
    "page": 50,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "energizing",
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
      "Dream"
    ],
    "audit": {
      "formula": "Healing (Energizing, Limited to Energizing) • 1 point per rank",
      "fixed": 0,
      "perRank": 1,
      "discrepancy": {
        "reason": {
          "en": "Healing 2 + Energizing 1 - Limited 1 costs 2 PP/rank. The identical Energize recipe on p. 91 also prints 2 PP/rank.",
          "pt": "Divergência da fonte: Healing 2 + Energizing 1 - Limited 1 costs 2 PP/rank. The identical Energize recipe on p. 91 also prints 2 PP/rank."
        },
        "fixed": 0,
        "perRank": 2
      }
    }
  }
] satisfies PowerTemplate[];
