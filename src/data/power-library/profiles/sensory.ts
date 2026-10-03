import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "sensory-dazzle",
    "profileId": "sensory",
    "name": {
      "en": "Dazzle",
      "pt": "Ofuscar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado · Resistência Alternativa"
    },
    "page": 154,
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
      "Sensory"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Senses Impaired, Senses Disabled, Unaware), Limited to One Sense • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Senses Impaired, Senses Disabled, Unaware), Limited to One Sense"
  },
  {
    "id": "sensory-obscure",
    "profileId": "sensory",
    "name": {
      "en": "Obscure",
      "pt": "Obscurecer"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Concealment · Increased Range · Area · Attack",
      "pt": "Camuflagem · Alcance Aumentado · Área · Ataque"
    },
    "page": 154,
    "components": [
      {
        "effectId": "concealment",
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
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Ranged Burst Area Concealment Attack • 4 points per rank, +1 point per rank per +1 area distance rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Ranged Burst Area Concealment Attack"
  },
  {
    "id": "sensory-sensory-overload",
    "profileId": "sensory",
    "name": {
      "en": "Sensory Overload",
      "pt": "Sobrecarga Sensorial"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Resistência Alternativa"
    },
    "page": 155,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 2 points per rank",
      "fixed": 0,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Affliction 1 + Ranged 1 + Cumulative 1 = 3/rank; the printed 2 omits Cumulative.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 3 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 3
      }
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "sensory-danger-sense",
    "profileId": "sensory",
    "name": {
      "en": "Danger Sense",
      "pt": "Sentido de Perigo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 155,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "danger_sense",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Senses 1 (Danger Sense) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Danger Sense)"
  },
  {
    "id": "sensory-defensive-awareness",
    "profileId": "sensory",
    "name": {
      "en": "Defensive Awareness",
      "pt": "Consciência Defensiva"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 155,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Defensive Roll"
        }
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Enhanced Advantage (Defensive Roll) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Advantage (Defensive Roll)"
  },
  {
    "id": "sensory-invisibility",
    "profileId": "sensory",
    "name": {
      "en": "Invisibility",
      "pt": "Invisibilidade"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 155,
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
      "Sensory"
    ],
    "audit": {
      "formula": "Concealment 2 (normal sight) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Concealment 2 (normal sight)"
  },
  {
    "id": "sensory-sensory-shield-2",
    "profileId": "sensory",
    "name": {
      "en": "Sensory Shield — 2",
      "pt": "Escudo Sensorial — 2"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Half Effect",
      "pt": "Imunidade · Metade do Efeito"
    },
    "page": 155,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "half_effect",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Immunity 2 (effects against one sense), Immunity 5 (effects against all senses), Limited to Half Effect • 1 or 3 points",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (effects against one sense), Immunity 5 (effects against all senses), Limited to Half Effect"
  },
  {
    "id": "sensory-sensory-shield-5",
    "profileId": "sensory",
    "name": {
      "en": "Sensory Shield — 5",
      "pt": "Escudo Sensorial — 5"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Half Effect",
      "pt": "Imunidade · Metade do Efeito"
    },
    "page": 155,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": [
          {
            "modifierId": "half_effect",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Immunity 2 (effects against one sense), Immunity 5 (effects against all senses), Limited to Half Effect • 1 or 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (effects against one sense), Immunity 5 (effects against all senses), Limited to Half Effect"
  },
  {
    "id": "sensory-silence",
    "profileId": "sensory",
    "name": {
      "en": "Silence",
      "pt": "Silêncio"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 155,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "senses": [
            "auditory"
          ]
        }
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Concealment 1 (Auditory) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Concealment 1 (Auditory)"
  },
  {
    "id": "sensory-pathfinder",
    "profileId": "sensory",
    "name": {
      "en": "Pathfinder",
      "pt": "Encontrar Caminho"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 156,
    "components": [
      {
        "effectId": "senses",
        "ranks": 9,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Path"
          },
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Mental"
          },
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "direction_sense",
            "ranks": 1
          },
          {
            "id": "distance_sense",
            "ranks": 1
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "tracking",
            "ranks": 2,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Senses 8 (Detect Path, Accurate, Acute, Direction Sense, Distance Sense, Ranged, Tracking 2) • 9 points",
      "fixed": 9,
      "perRank": 0
    },
    "sourceFormula": "Senses 8 (Detect Path, Accurate, Acute, Direction Sense, Distance Sense, Ranged, Tracking 2)"
  },
  {
    "id": "sensory-tracking-teleport",
    "profileId": "sensory",
    "name": {
      "en": "Tracking Teleport",
      "pt": "Rastrear Teleporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 156,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Teleport"
          },
          {
            "id": "tracking",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Senses 2 (Teleport Awareness, Tracking) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses 2 (Teleport Awareness, Tracking)"
  },
  {
    "id": "sensory-aura-reading",
    "profileId": "sensory",
    "name": {
      "en": "Aura Reading",
      "pt": "Leitura de Aura"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 156,
    "components": [
      {
        "effectId": "senses",
        "ranks": 5,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Mood"
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
            "detail": "Physical condition"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Psychic"
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "You can “read” the invisible psychic auras around all creatures, showing their mood, physical con- dition, and any outside psychic influences. Aura Reading is a mental sense, although the information (the aura) is perceived visually. Aura Reading: Senses 5 (Detect Mood, Ranged; Detect Physical Condition, Ranged; Psychic Awareness) • 5 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "You can “read” the invisible psychic auras around all creatures, showing their mood, physical con- dition, and any outside psychic influences. Aura Reading is a mental sense, although the information (the aura) is perceived visually. Aura Reading: Senses 5 (Detect Mood, Ranged; Detect Physical Condition, Ranged; Psychic Awareness)"
  },
  {
    "id": "sensory-cosmic-awareness",
    "profileId": "sensory",
    "name": {
      "en": "Cosmic Awareness",
      "pt": "Consciência Cósmica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature · Senses",
      "pt": "Característica · Sentidos"
    },
    "page": 156,
    "components": [
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      },
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "awareness",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Cosmic"
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Feature 1 (directed inspiration), Senses 1 (Cosmic Awareness) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Feature 1 (directed inspiration), Senses 1 (Cosmic Awareness)"
  },
  {
    "id": "sensory-lie-detector",
    "profileId": "sensory",
    "name": {
      "en": "Lie Detector",
      "pt": "Detector de Mentiras"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Limited",
      "pt": "Traço Aprimorado · Limitado"
    },
    "page": 156,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Skill",
        "fieldValues": {
          "trait": "Insight"
        },
        "rankMultiplier": 2
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "With enhanced awareness of nonverbal cues and things like heartbeat and perspiration, you can more easily sense when someone is lying. Lie Detector: Enhanced Insight, Limited to Detecting Deception • 1 point per 2 ranks (+2 Insight per rank)",
      "fixed": 0,
      "perRank": 0.5,
      "discrepancy": {
        "reason": {
          "en": "Enhanced Skill costs 1 PP/2 bonuses; a -1 flaw advances its ratio to 1 PP/3 bonuses. Two bonuses per selectable rank cost ceil(2 ranks/3), not a halved 1 PP/4 bonuses.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 0.666667 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 0.6666666666666666
      }
    },
    "sourceFormula": "With enhanced awareness of nonverbal cues and things like heartbeat and perspiration, you can more easily sense when someone is lying. Lie Detector: Enhanced Insight, Limited to Detecting Deception"
  },
  {
    "id": "sensory-radar",
    "profileId": "sensory",
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
    "page": 156,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Radio"
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "By sending out radio wave emissions that reflect off solid surfaces, you can build an accurate picture of your surroundings. Radar: Senses 2 (Accurate Radio) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "By sending out radio wave emissions that reflect off solid surfaces, you can build an accurate picture of your surroundings. Radar: Senses 2 (Accurate Radio)"
  },
  {
    "id": "sensory-sonar",
    "profileId": "sensory",
    "name": {
      "en": "Sonar",
      "pt": "Sonar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 156,
    "components": [
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Auditory"
          },
          {
            "id": "ultra_hearing",
            "ranks": 1
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "By sending out ultrasonic emissions that reflect off solid surfaces, you can build an accurate picture of your surroundings. Sonar: Senses 3 (Accurate Hearing, Ultra-Hearing) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "By sending out ultrasonic emissions that reflect off solid surfaces, you can build an accurate picture of your surroundings. Sonar: Senses 3 (Accurate Hearing, Ultra-Hearing)"
  },
  {
    "id": "sensory-spatial-awareness",
    "profileId": "sensory",
    "name": {
      "en": "Spatial Awareness",
      "pt": "Consciência Espacial"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 156,
    "components": [
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
            "id": "radius",
            "ranks": 1,
            "senseType": "Mental"
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
      "Sensory"
    ],
    "audit": {
      "formula": "You are mentally aware of your sur- roundings, even when you cannot see them. Spatial Awareness: Senses 4 (Accurate, Radius, Ranged Mental Sense) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "You are mentally aware of your sur- roundings, even when you cannot see them. Spatial Awareness: Senses 4 (Accurate, Radius, Ranged Mental Sense)"
  },
  {
    "id": "sensory-x-ray-vision",
    "profileId": "sensory",
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
    "page": 156,
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
      "Sensory"
    ],
    "audit": {
      "formula": "You can see through solid objects as if they weren’t there. A subject with no concealment relative to you cannot use Stealth to hide from you. X-Ray Vision may be Limited to particular substances (natural earth, for example) or have a Quirk of being unable to penetrate a particular substance (like lead) worth –1 point. X-Ray Vision: Senses 4 (Vision Penetrates Concealment) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "You can see through solid objects as if they weren’t there. A subject with no concealment relative to you cannot use Stealth to hide from you. X-Ray Vision may be Limited to particular substances (natural earth, for example) or have a Quirk of being unable to penetrate a particular substance (like lead) worth –1 point. X-Ray Vision: Senses 4 (Vision Penetrates Concealment)"
  },
  {
    "id": "sensory-enhanced-senses",
    "profileId": "sensory",
    "name": {
      "en": "Enhanced Senses",
      "pt": "Sentidos Aprimorados"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 156,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Skill",
        "fieldValues": {
          "trait": "Perception"
        },
        "rankMultiplier": 2
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Enhanced Perception • 1 point per rank (+2 Perception per rank)",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Perception"
  },
  {
    "id": "sensory-synesthesia",
    "profileId": "sensory",
    "name": {
      "en": "Synesthesia",
      "pt": "Sinestesia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Feature · Variable Descriptor",
      "pt": "Característica · Descritor Variável"
    },
    "page": 156,
    "components": [
      {
        "effectId": "feature",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "variable_descriptor",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Sensory"
    ],
    "audit": {
      "formula": "Variable Descriptor 2 (Senses) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Variable Descriptor 2 (Senses)"
  }
] satisfies PowerTemplate[];
