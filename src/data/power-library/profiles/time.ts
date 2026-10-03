import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "time-age-manipulation",
    "profileId": "time",
    "name": {
      "en": "Age Manipulation",
      "pt": "Manipular Idade"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative",
      "pt": "Aflição · Cumulativo"
    },
    "page": 203,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
      "Time"
    ],
    "audit": {
      "formula": "Cumulative Affliction (aging; Resisted and Overcome by Fortitude; Impaired, Disabled, Transformed) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "time-temporal-ambush",
    "profileId": "time",
    "name": {
      "en": "Temporal Ambush",
      "pt": "Emboscada Temporal"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Indirect · Variable Descriptor",
      "pt": "Dano · Alcance Aumentado · Indireto · Descritor Variável"
    },
    "page": 203,
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
            "modifierId": "indirect",
            "ranks": 4,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Percpetion Ranged Damage (objects and hazards of opportunity), Indirect 4, Variable Descriptor 1 • 5 points +3 points per rank",
      "fixed": 5,
      "perRank": 3
    }
  },
  {
    "id": "time-time-freeze",
    "profileId": "time",
    "name": {
      "en": "Time Freeze",
      "pt": "Congelar o Tempo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative",
      "pt": "Aflição · Cumulativo"
    },
    "page": 204,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
      "Time"
    ],
    "audit": {
      "formula": "Cumulative Affliction (time freeze; Resisted and Overcome by Will; Dazed, Stunned, Incapacitated) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "time-temporal-phase",
    "profileId": "time",
    "name": {
      "en": "Temporal Phase",
      "pt": "Fase Temporal"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 204,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Insubstantial 4 • 20 points",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "time-temporal-sidestep",
    "profileId": "time",
    "name": {
      "en": "Temporal Sidestep",
      "pt": "Passo Temporal"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Concentration · Limited · Teleport · Reaction",
      "pt": "Imunidade · Concentração · Limitado · Teleporte · Reação"
    },
    "page": 204,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 80,
        "modifiers": [
          {
            "modifierId": "concentration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      },
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Immunity 80 (Dodge and Parry based attacks), Concentration, Limited (not against surprise attacks); Reaction Teleport 1 (when attacked) • 32 points + 5",
      "fixed": 32,
      "perRank": 0
    }
  },
  {
    "id": "time-timeless",
    "profileId": "time",
    "name": {
      "en": "Timeless",
      "pt": "Atemporal"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 204,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Immunity 5 (temporal effects) • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "time-temporal-shift",
    "profileId": "time",
    "name": {
      "en": "Temporal Shift",
      "pt": "Deslocamento Temporal"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Limited",
      "pt": "Teleporte · Preciso · Limitado"
    },
    "page": 204,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Accurate Teleport, Limited to places you can reach physically • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "time-manipulative-temporal-shift",
    "profileId": "time",
    "name": {
      "en": "Manipulative Temporal Shift",
      "pt": "Deslocamento Temporal Manipulativo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Attack · Increased Range · Limited",
      "pt": "Teleporte · Ataque · Alcance Aumentado · Limitado"
    },
    "page": 204,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 2,
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
      "Time"
    ],
    "audit": {
      "formula": "Perception Range Teleport Attack (Resisted by (Choose a Defense when purchased)), Limited to things you can physically move • 4 points per rank",
      "fixed": 0,
      "perRank": 4,
      "discrepancy": {
        "reason": {
          "en": "Teleport 2 + Perception Range 2 - Limited 1 costs 3/rank (4 with Area). The printed total has an unlisted extra point per rank.",
          "pt": "Divergência da fonte: Teleport 2 + Perception Range 2 - Limited 1 costs 3/rank (4 with Area). The printed total has an unlisted extra point per rank."
        },
        "fixed": 0,
        "perRank": 3
      }
    }
  },
  {
    "id": "time-manipulative-area-temporal-shift",
    "profileId": "time",
    "name": {
      "en": "Manipulative Area Temporal Shift",
      "pt": "Deslocamento Temporal Manipulativo em Área"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Attack · Increased Range · Limited · Area",
      "pt": "Teleporte · Ataque · Alcance Aumentado · Limitado · Área"
    },
    "page": 204,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
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
      "Time"
    ],
    "audit": {
      "formula": "Perception Range Burst Area Teleport Attack (Resisted by (Choose a Defense when purchased)), Limited to things you can physically move • 5",
      "fixed": 0,
      "perRank": 5,
      "discrepancy": {
        "reason": {
          "en": "Teleport 2 + Perception Range 2 - Limited 1 costs 3/rank (4 with Area). The printed total has an unlisted extra point per rank.",
          "pt": "Divergência da fonte: Teleport 2 + Perception Range 2 - Limited 1 costs 3/rank (4 with Area). The printed total has an unlisted extra point per rank."
        },
        "fixed": 0,
        "perRank": 4
      }
    }
  },
  {
    "id": "time-time-portal",
    "profileId": "time",
    "name": {
      "en": "Time Portal",
      "pt": "Portal do Tempo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Portal",
      "pt": "Movimento · Portal"
    },
    "page": 204,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "portal_movement",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "movement": "Time Travel"
        }
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Movement 3 (Time Travel 3), Portal • 15 points",
      "fixed": 15,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "Movement 3 costs 6 and Portal adds +2 per rank (6), totaling 12 rather than printed 15.",
          "pt": "Divergência da fonte: Movement 3 costs 6 and Portal adds +2 per rank (6), totaling 12 rather than printed 15."
        },
        "fixed": 12,
        "perRank": 0
      }
    }
  },
  {
    "id": "time-time-travel",
    "profileId": "time",
    "name": {
      "en": "Time Travel",
      "pt": "Viagem no Tempo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 204,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "movement": "Time Travel"
        }
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Movement (Time Travel) • 2 points per rank up to",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "time-accelerated-healing",
    "profileId": "time",
    "name": {
      "en": "Accelerated Healing",
      "pt": "Cura Acelerada"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Regeneration",
      "pt": "Regeneração"
    },
    "page": 205,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Regeneration • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "time-rapid-perception",
    "profileId": "time",
    "name": {
      "en": "Rapid Perception",
      "pt": "Percepção Rápida"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Senses · Senses · Senses · Senses",
      "pt": "Sentidos · Sentidos · Sentidos · Sentidos · Sentidos"
    },
    "page": 205,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "senseTraits": [
          {
            "id": "rapid",
            "ranks": 1,
            "senseType": "Visual"
          }
        ],
        "scaledSenseTraits": true
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "senseTraits": [
          {
            "id": "rapid",
            "ranks": 1,
            "senseType": "Auditory"
          }
        ],
        "scaledSenseTraits": true
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "senseTraits": [
          {
            "id": "rapid",
            "ranks": 1,
            "senseType": "Olfactory"
          }
        ],
        "scaledSenseTraits": true
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "senseTraits": [
          {
            "id": "rapid",
            "ranks": 1,
            "senseType": "Tactile"
          }
        ],
        "scaledSenseTraits": true
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "senseTraits": [
          {
            "id": "rapid",
            "ranks": 1,
            "senseType": "Mental"
          }
        ],
        "scaledSenseTraits": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Senses (Rapid, all senses) • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    }
  },
  {
    "id": "time-replay",
    "profileId": "time",
    "name": {
      "en": "Replay",
      "pt": "Repetir"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Feature",
      "pt": "Sentidos · Característica"
    },
    "page": 205,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "precognition",
            "ranks": 4
          }
        ]
      },
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Senses 4 (Precognition), Feature 1 (retcon events) • 5 points +1 point per additional Feature rank",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "time-see-the-future",
    "profileId": "time",
    "name": {
      "en": "See the Future",
      "pt": "Ver o Futuro"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 205,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "precognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Senses 4 (Precognition) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "time-temporal-duplication",
    "profileId": "time",
    "name": {
      "en": "Temporal Duplication",
      "pt": "Duplicação Temporal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Heroic",
      "pt": "Invocar · Heroico"
    },
    "page": 205,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Summon Duplicate, Heroic • 4 points",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "time-temporal-summoning",
    "profileId": "time",
    "name": {
      "en": "Temporal Summoning",
      "pt": "Invocação Temporal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Variable Type (Broad)",
      "pt": "Invocar · Variable Type (Broad)"
    },
    "page": 205,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_type_broad",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Summon, Broad Type (beings from history) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "time-time-sense",
    "profileId": "time",
    "name": {
      "en": "Time Sense",
      "pt": "Sentido do Tempo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 205,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Time"
          }
        ]
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Senses 1 (Temporal Awareness) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "time-time-stop",
    "profileId": "time",
    "name": {
      "en": "Time Stop",
      "pt": "Parar o Tempo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Quickness · Subtle · Quirk · Speed · Subtle · Quirk — The shared -4 PP Quirk is distributed between both effects: routine actions only.",
      "pt": "Rapidez · Sutil · Peculiaridade · Velocidade · Sutil · Peculiaridade — A Peculiaridade de -4 PP é distribuída entre ambos: apenas ações rotineiras."
    },
    "page": 205,
    "components": [
      {
        "effectId": "quickness",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "subtle",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      },
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "subtle",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Quickness (Subtle 2), Speed (Subtle 2), Quirk: Limited to routine actions while active (–4 points) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "time-view-the-past",
    "profileId": "time",
    "name": {
      "en": "View the Past",
      "pt": "Ver o Passado"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 206,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "postcognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Time"
    ],
    "audit": {
      "formula": "Senses 4 (Postcognition) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
