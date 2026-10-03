import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "sonic-buzzsaw",
    "profileId": "sonic",
    "name": {
      "en": "Buzzsaw",
      "pt": "Serra Vibratória"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Penetrating",
      "pt": "Dano · Penetrante"
    },
    "page": 167,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "penetrating",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "scaledModifiers": [
          "penetrating"
        ]
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Penetrating Damage (cutting, vibrational) • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Penetrating Damage (cutting, vibrational)"
  },
  {
    "id": "sonic-deafening-shriek",
    "profileId": "sonic",
    "name": {
      "en": "Deafening Shriek",
      "pt": "Grito Ensurdecedor"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado"
    },
    "page": 167,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Hearing Impaired, Hearing Disabled, Hearing Unaware), Limited to One Sense • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Hearing Impaired, Hearing Disabled, Hearing Unaware), Limited to One Sense"
  },
  {
    "id": "sonic-hypnotic-song",
    "profileId": "sonic",
    "name": {
      "en": "Hypnotic Song",
      "pt": "Canção Hipnótica"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative · Area · Concentration · Instant Recovery",
      "pt": "Aflição · Cumulativo · Área · Concentration · Recuperação Instantânea"
    },
    "page": 167,
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
            "modifierId": "area",
            "ranks": 1,
            "option": "Perception",
            "options": {
              "includesSenseDependent": true
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "concentration_affliction",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "instant_recovery",
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
      "Sonic"
    ],
    "audit": {
      "formula": "Cumulative Hearing Area Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Concentration Duration, Instant Recovery • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Cumulative Hearing Area Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Concentration Duration, Instant Recovery"
  },
  {
    "id": "sonic-shatter",
    "profileId": "sonic",
    "name": {
      "en": "Shatter",
      "pt": "Estilhaçar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Increased Range · Affects Objects",
      "pt": "Enfraquecer · Alcance Aumentado · Afeta Objetos"
    },
    "page": 167,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Ranged Weaken Toughness, Affects Only Objects • 2",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Weaken Toughness, Affects Only Objects"
  },
  {
    "id": "sonic-sonic-blast",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Blast",
      "pt": "Rajada Sônica"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 167,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Ranged Damage (sonic) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (sonic)"
  },
  {
    "id": "sonic-vertigo",
    "profileId": "sonic",
    "name": {
      "en": "Vertigo",
      "pt": "Vertigem"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Sense-Dependent",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Dependente de Sentido"
    },
    "page": 168,
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
          },
          {
            "modifierId": "sense_dependent",
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
      "Sonic"
    ],
    "audit": {
      "formula": "Ranged Progressive Affliction (Resisted and Overcome by Will; Dazed, Stunned, Incapacitated), Hearing- Dependent • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Progressive Affliction (Resisted and Overcome by Will; Dazed, Stunned, Incapacitated), Hearing- Dependent"
  },
  {
    "id": "sonic-protected-hearing",
    "profileId": "sonic",
    "name": {
      "en": "Protected Hearing",
      "pt": "Audição Protegida"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Half Effect",
      "pt": "Imunidade · Metade do Efeito"
    },
    "page": 168,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Immunity 5 (harmful Hearing-Dependent effects), Limited to Half Effect • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Immunity 5 (harmful Hearing-Dependent effects), Limited to Half Effect"
  },
  {
    "id": "sonic-sonic-absorption",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Absorption",
      "pt": "Absorção Sônica"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Limited",
      "pt": "Traço Aprimorado · Desgaste · Limitado"
    },
    "page": 168,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Defense"
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Enhanced Trait, Fades, Limited to rank of absorbed sonic effect • 1 point per 3 ranks",
      "fixed": 0,
      "perRank": 0.3333333333333333
    },
    "sourceFormula": "Enhanced Trait, Fades, Limited to rank of absorbed sonic effect"
  },
  {
    "id": "sonic-immunity-to-sonic-damage",
    "profileId": "sonic",
    "name": {
      "en": "Immunity to Sonic Damage",
      "pt": "Imunidade a Dano Sônico"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 168,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Immunity 5 (sonic damage) • 5 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 5 (sonic damage)"
  },
  {
    "id": "sonic-sonic-immunity",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Immunity",
      "pt": "Imunidade Sônica"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 168,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Immunity 10 (sonic effects) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (sonic effects)"
  },
  {
    "id": "sonic-sonic-shield",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Shield",
      "pt": "Escudo Sônico"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 168,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection, Sustained"
  },
  {
    "id": "sonic-sonic-drilling",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Drilling",
      "pt": "Escavação Sônica"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 168,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Burrowing"
  },
  {
    "id": "sonic-sonic-flight",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Flight",
      "pt": "Voo Sônico"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Noticeable",
      "pt": "Voo · Perceptível"
    },
    "page": 168,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "noticeable",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Flight, Noticeable • 1 point for rank 1, + 2 points",
      "fixed": -1,
      "perRank": 2
    },
    "sourceFormula": "Flight, Noticeable"
  },
  {
    "id": "sonic-sound-wave",
    "profileId": "sonic",
    "name": {
      "en": "Sound Wave",
      "pt": "Onda Sonora"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium",
      "pt": "Teleporte · Meio"
    },
    "page": 168,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Teleport, Medium (sound) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Teleport, Medium (sound)"
  },
  {
    "id": "sonic-enhanced-hearing",
    "profileId": "sonic",
    "name": {
      "en": "Enhanced Hearing",
      "pt": "Audição Aprimorada"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 168,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "extended",
            "ranks": 1,
            "senseType": "Auditory"
          }
        ]
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Senses (Extended Hearing) • 1 point per rank",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses (Extended Hearing)"
  },
  {
    "id": "sonic-phase-cancellation",
    "profileId": "sonic",
    "name": {
      "en": "Phase Cancellation",
      "pt": "Cancelamento de Fase"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Area · Concentration · Simultaneous",
      "pt": "Anulação · Área · Concentração · Simultâneo"
    },
    "page": 168,
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
          "descriptor": "Sonic"
        }
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Burst Area Nullify Sonic Effects, Concentration, Simultaneous • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Burst Area Nullify Sonic Effects, Concentration, Simultaneous"
  },
  {
    "id": "sonic-silence",
    "profileId": "sonic",
    "name": {
      "en": "Silence",
      "pt": "Silêncio"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Area · Attack",
      "pt": "Camuflagem · Área · Ataque"
    },
    "page": 169,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [
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
            "auditory"
          ]
        }
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Burst Area Auditory Concealment Attack • 6 points + 2",
      "fixed": 6,
      "perRank": 0
    },
    "sourceFormula": "Burst Area Auditory Concealment Attack"
  },
  {
    "id": "sonic-solid-sound",
    "profileId": "sonic",
    "name": {
      "en": "Solid Sound",
      "pt": "Som Sólido"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 169,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Create Solid Sound Objects • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Create Solid Sound Objects"
  },
  {
    "id": "sonic-sonar",
    "profileId": "sonic",
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
    "page": 169,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Auditory"
          }
        ]
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Senses (Accurate Hearing) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses (Accurate Hearing)"
  },
  {
    "id": "sonic-sonic-form",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Form",
      "pt": "Forma Sônica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Damage · Flight · Immunity · Insubstantial",
      "pt": "Dano · Voo · Imunidade · Insubstancial"
    },
    "page": 169,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": []
      },
      {
        "effectId": "flight",
        "ranks": 8,
        "modifiers": []
      },
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
      "Sonic"
    ],
    "audit": {
      "formula": "Damage 1 (sonic), Flight 8, Immunity 10 (life support), Insubstantial 3 • 42 points +1 point per +1 rank of",
      "fixed": 42,
      "perRank": 0
    },
    "sourceFormula": "Damage 1 (sonic), Flight 8, Immunity 10 (life support), Insubstantial 3"
  },
  {
    "id": "sonic-sonic-masking",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Masking",
      "pt": "Mascaramento Sônico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 169,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "senses": [
            "auditory"
          ]
        }
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Concealment 2 (auditory) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Concealment 2 (auditory)"
  },
  {
    "id": "sonic-sonic-projection",
    "profileId": "sonic",
    "name": {
      "en": "Sonic Projection",
      "pt": "Projeção Sônica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 169,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Illusion (Aural) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Illusion (Aural)"
  },
  {
    "id": "sonic-sound-analysis",
    "profileId": "sonic",
    "name": {
      "en": "Sound Analysis",
      "pt": "Análise Sonora"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 169,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "analytical",
            "ranks": 1,
            "senseType": "Auditory"
          }
        ]
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Senses 1 (Analytical Hearing) • 1 point",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Analytical Hearing)"
  },
  {
    "id": "sonic-sound-creatures",
    "profileId": "sonic",
    "name": {
      "en": "Sound Creatures",
      "pt": "Criaturas de Som"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Controlled",
      "pt": "Invocar · Controlado"
    },
    "page": 169,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Summon Sound Creature 5, Controlled • 15 points + 10 points per doubling of number of creatures + 5",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Summon Sound Creature 5, Controlled"
  },
  {
    "id": "sonic-ultrasonic-hearing",
    "profileId": "sonic",
    "name": {
      "en": "Ultrasonic Hearing",
      "pt": "Audição Ultrassônica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 169,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "ultra_hearing",
            "ranks": 1
          }
        ]
      }
    ],
    "descriptors": [
      "Sonic"
    ],
    "audit": {
      "formula": "Senses 1 (Ultra-Hearing) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Ultra-Hearing)"
  },
  {
    "id": "sonic-white-noise-2",
    "profileId": "sonic",
    "name": {
      "en": "White Noise — 2",
      "pt": "Ruído Branco — 2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment — Affects hearing instead of vision (+0).",
      "pt": "Controle Ambiental — Afeta audição em vez de visão (+0)."
    },
    "page": 169,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Environment (Visibility), Affects Hearing Instead of Vision (+0) • 1 point per rank for –2 penalty, 2 points per rank for –5 penalty.",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (Visibility), Affects Hearing Instead of Vision (+0)"
  },
  {
    "id": "sonic-white-noise-5",
    "profileId": "sonic",
    "name": {
      "en": "White Noise — 5",
      "pt": "Ruído Branco — 5"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment — Affects hearing instead of vision (+0).",
      "pt": "Controle Ambiental — Afeta audição em vez de visão (+0)."
    },
    "page": 169,
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
      "Sonic"
    ],
    "audit": {
      "formula": "Environment (Visibility), Affects Hearing Instead of Vision (+0) • 1 point per rank for –2 penalty, 2 points per rank for –5 penalty.",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (Visibility), Affects Hearing Instead of Vision (+0)"
  }
] satisfies PowerTemplate[];
