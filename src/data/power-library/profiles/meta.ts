import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "meta-nemesis",
    "profileId": "meta",
    "name": {
      "en": "Nemesis",
      "pt": "Nêmesis"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Variable · Action · Limited",
      "pt": "Variável · Ação · Limitado"
    },
    "page": 133,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "action_variable",
            "ranks": 1,
            "options": {
              "subtypeId": "move"
            },
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
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Powers Suited to an Opponent), Move Action, Limited Choice of Powers • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    }
  },
  {
    "id": "meta-power-control",
    "profileId": "meta",
    "name": {
      "en": "Power Control",
      "pt": "Controle de Poderes"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited Degree · Limited",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Graus Limitados · Limitado"
    },
    "page": 133,
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
      "Meta"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Controlled), Limited Degree (third only), Limited to Controlling Target’s Powers • 2 points per rank",
      "fixed": 0,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Third degree only is -2/rank; Limited Powers -1. 1 + Range 2 + Cumulative 1 - 3 = 1/rank.",
          "pt": "Divergência da fonte: Third degree only is -2/rank; Limited Powers -1. 1 + Range 2 + Cumulative 1 - 3 = 1/rank."
        },
        "fixed": 0,
        "perRank": 1
      }
    }
  },
  {
    "id": "meta-power-nullification",
    "profileId": "meta",
    "name": {
      "en": "Power Nullification",
      "pt": "Anulação de Poder"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Nullify",
      "pt": "Anulação"
    },
    "page": 133,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Choose descriptor"
        }
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Nullify • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "meta-nullification-field",
    "profileId": "meta",
    "name": {
      "en": "Nullification Field",
      "pt": "Campo de Anulação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Nullify · Area · Concentration · Simultaneous",
      "pt": "Anulação · Área · Concentração · Simultâneo"
    },
    "page": 134,
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
            "modifierId": "concentration_nullify",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Choose descriptor"
        }
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Burst Area Nullify, Concentration, Simultaneous • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "meta-power-theft-affliction",
    "profileId": "meta",
    "name": {
      "en": "Power Theft — Affliction",
      "pt": "Roubo de Poder — Aflição"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative · Linked · Variable · Action · Fades · Limited",
      "pt": "Aflição · Cumulativo · Vinculado · Variável · Ação · Desgaste · Limitado"
    },
    "page": 134,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "cumulative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      },
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
        "scalable": true
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Will; Powers Impaired, Powers Disabled, Transformed— Powerless); Variable (Powers Lost to Affliction), Free Action, Fades (as target recovers), Limited to Affliction Targets • 9 points per rank",
      "fixed": 0,
      "perRank": 9
    }
  },
  {
    "id": "meta-power-theft-nullify",
    "profileId": "meta",
    "name": {
      "en": "Power Theft — Nullify",
      "pt": "Roubo de Poder — Anular"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Nullify · Broad · Simultaneous · Reduced Range · Linked · Variable · Action · Fades · Limited",
      "pt": "Anulação · Amplo · Simultâneo · Alcance Reduzido · Vinculado · Variável · Ação · Desgaste · Limitado"
    },
    "page": 134,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reduced_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Powers"
        }
      },
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
        "scalable": true
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Will; Powers Impaired, Powers Disabled, Transformed— Powerless); Variable (Powers Lost to Affliction), Free Action, Fades (as target recovers), Limited to Affliction Targets • 9 points per rank",
      "fixed": 0,
      "perRank": 9
    }
  },
  {
    "id": "meta-adaptation",
    "profileId": "meta",
    "name": {
      "en": "Adaptation",
      "pt": "Adaptação"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Variable · Action · Limited",
      "pt": "Variável · Ação · Limitado"
    },
    "page": 134,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "action_variable",
            "ranks": 3,
            "options": {
              "subtypeId": "reaction"
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
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Powers Suited to a Challenge), Reaction, Limited Choice of Powers, Limited (No Offensive Powers) • 8 points per rank",
      "fixed": 0,
      "perRank": 8
    }
  },
  {
    "id": "meta-adaptive-immunity",
    "profileId": "meta",
    "name": {
      "en": "Adaptive Immunity",
      "pt": "Imunidade Adaptativa"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Limited",
      "pt": "Imunidade · Limitado"
    },
    "page": 134,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 140,
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
      "Meta"
    ],
    "audit": {
      "formula": "Immunity 140 (Fortitude, Toughness, and Will Effects), Limited to effects you have experienced at least once • 70 points",
      "fixed": 70,
      "perRank": 0
    }
  },
  {
    "id": "meta-power-defense",
    "profileId": "meta",
    "name": {
      "en": "Power Defense",
      "pt": "Defesa de Poder"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Nullify · Broad · Reaction · Reduced Range · Limited",
      "pt": "Anulação · Amplo · Reação · Alcance Reduzido · Limitado"
    },
    "page": 134,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
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
        "scalable": true,
        "fieldValues": {
          "descriptor": "Powers"
        }
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Nullify, Broad, Reaction, Close Range, Limited to Self • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "meta-power-immunity-2",
    "profileId": "meta",
    "name": {
      "en": "Power Immunity — 2",
      "pt": "Imunidade a Poder — 2"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 134,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Immunity 2, 5, 10, or 20 • 1 point per rank",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "meta-power-immunity-5",
    "profileId": "meta",
    "name": {
      "en": "Power Immunity — 5",
      "pt": "Imunidade a Poder — 5"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 134,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Immunity 2, 5, 10, or 20 • 1 point per rank",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "meta-power-immunity-10",
    "profileId": "meta",
    "name": {
      "en": "Power Immunity — 10",
      "pt": "Imunidade a Poder — 10"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 134,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Immunity 2, 5, 10, or 20 • 1 point per rank",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "meta-power-immunity-20",
    "profileId": "meta",
    "name": {
      "en": "Power Immunity — 20",
      "pt": "Imunidade a Poder — 20"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 134,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 20,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Immunity 2, 5, 10, or 20 • 1 point per rank",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "meta-power-seeker",
    "profileId": "meta",
    "name": {
      "en": "Power-Seeker",
      "pt": "Buscador de Poder"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Extended · Limited",
      "pt": "Teleporte · Preciso · Estendido · Limitado"
    },
    "page": 135,
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
            "modifierId": "extended",
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
      "Meta"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Extended, Limited to the Nearest Power Source • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "meta-power-detection",
    "profileId": "meta",
    "name": {
      "en": "Power Detection",
      "pt": "Detecção de Poder"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 135,
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
            "detail": "Power"
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
      "Meta"
    ],
    "audit": {
      "formula": "Senses 2 (Detect Power, Ranged) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "meta-power-enhancement",
    "profileId": "meta",
    "name": {
      "en": "Power Enhancement",
      "pt": "Aprimorar Poder"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Affects Others · Limited",
      "pt": "Variável · Afeta Outros · Limitado"
    },
    "page": 135,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_others",
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
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Enhanced Power Ranks and Modifiers), Affects Others, Limited to Others • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    }
  },
  {
    "id": "meta-power-mimicry",
    "profileId": "meta",
    "name": {
      "en": "Power Mimicry",
      "pt": "Mimetismo de Poder"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Limited",
      "pt": "Variável · Limitado"
    },
    "page": 135,
    "components": [
      {
        "effectId": "variable",
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
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Powers Possessed by Catalyst), Limited to Catalysts in Perception Range • 6 points per rank",
      "fixed": 0,
      "perRank": 6
    }
  },
  {
    "id": "meta-serial-super-forms",
    "profileId": "meta",
    "name": {
      "en": "Serial Super Forms",
      "pt": "Superformas em Série"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Increased Duration",
      "pt": "Variável · Duração Aumentada"
    },
    "page": 136,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
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
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Serial Form Traits), Continuous • 8 points per rank",
      "fixed": 0,
      "perRank": 8
    }
  },
  {
    "id": "meta-skill-download",
    "profileId": "meta",
    "name": {
      "en": "Skill Download",
      "pt": "Download de Perícias"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable",
      "pt": "Variável"
    },
    "page": 136,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Skills and Advantages) • 7 points",
      "fixed": 0,
      "perRank": 7
    }
  },
  {
    "id": "meta-skill-mimicry",
    "profileId": "meta",
    "name": {
      "en": "Skill Mimicry",
      "pt": "Mimetismo de Perícia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Action · Limited",
      "pt": "Variável · Ação · Limitado"
    },
    "page": 136,
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
      "Meta"
    ],
    "audit": {
      "formula": "Variable (Physical Skills and Advantages), Free Action, Limited to Traits Seen in Action, Limited to Catalyst’s Total Bonus • 7 points per rank",
      "fixed": 0,
      "perRank": 7
    }
  }
] satisfies PowerTemplate[];
