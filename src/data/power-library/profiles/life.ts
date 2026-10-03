import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "life-bio-disruption",
    "profileId": "life",
    "name": {
      "en": "Bio-Disruption",
      "pt": "Biodisrupção"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative",
      "pt": "Aflição · Cumulativo"
    },
    "page": 89,
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
      "Life"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 2",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "life-bio-override",
    "profileId": "life",
    "name": {
      "en": "Bio-Override",
      "pt": "Controle Biológico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative",
      "pt": "Aflição · Alcance Aumentado · Cumulativo"
    },
    "page": 89,
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
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Entranced, Compelled, Controlled) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Fortitude; Entranced, Compelled, Controlled)"
  },
  {
    "id": "life-bio-sculpting",
    "profileId": "life",
    "name": {
      "en": "Bio-Sculpting",
      "pt": "Bioescultura"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative",
      "pt": "Aflição · Cumulativo"
    },
    "page": 89,
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
      "Life"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Transformed) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Transformed)"
  },
  {
    "id": "life-pathogen",
    "profileId": "life",
    "name": {
      "en": "Pathogen",
      "pt": "Patógeno"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Progressive",
      "pt": "Aflição · Progressivo"
    },
    "page": 90,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
      "Life"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Incapacitated), Progressive • 3 points",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Incapacitated), Progressive"
  },
  {
    "id": "life-seizure",
    "profileId": "life",
    "name": {
      "en": "Seizure",
      "pt": "Convulsão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction",
      "pt": "Aflição"
    },
    "page": 90,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Will; Dazed, Stunned, Incapacitated) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Will; Dazed, Stunned, Incapacitated)"
  },
  {
    "id": "life-cellular-disruption",
    "profileId": "life",
    "name": {
      "en": "Cellular Disruption",
      "pt": "Disrupção Celular"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Alternate Resistance",
      "pt": "Dano · Resistência Alternativa"
    },
    "page": 90,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "fortitude"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Damage, Alternate Resistance (Fortitude) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Damage, Alternate Resistance (Fortitude)"
  },
  {
    "id": "life-bio-adaptation",
    "profileId": "life",
    "name": {
      "en": "Bio-Adaptation",
      "pt": "Bioadaptação"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Limited",
      "pt": "Imunidade · Limitado"
    },
    "page": 90,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 30,
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
      "Life"
    ],
    "audit": {
      "formula": "Immunity 30 (Fortitude effects), Limited to effects you have experienced at least once • 15 points",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Immunity 30 (Fortitude effects), Limited to effects you have experienced at least once"
  },
  {
    "id": "life-enhanced-immune-system",
    "profileId": "life",
    "name": {
      "en": "Enhanced Immune System",
      "pt": "Sistema Imune Aprimorado"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 90,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Immunity 2 (diseases and parasitic infections) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (diseases and parasitic infections)"
  },
  {
    "id": "life-insensate",
    "profileId": "life",
    "name": {
      "en": "Insensate",
      "pt": "Insensível"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 90,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Immunity 5 (pain effects) • 2 points",
      "fixed": 2,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "The text specifies Immunity 5 but prints 2 points; without a flaw the cost is 5.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 5 PP fixos + 0 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 5,
        "perRank": 0
      }
    },
    "sourceFormula": "Immunity 5 (pain effects)"
  },
  {
    "id": "life-lifeport",
    "profileId": "life",
    "name": {
      "en": "Lifeport",
      "pt": "Teleporte Vital"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Quirk",
      "pt": "Teleporte · Peculiaridade"
    },
    "page": 90,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Teleport, Quirk (Not into areas where there is little or no life, –1 point) • 1 point for rank 1, +2 points per rank",
      "fixed": -1,
      "perRank": 2
    },
    "sourceFormula": "Teleport, Quirk (Not into areas where there is little or no life, –1 point)"
  },
  {
    "id": "life-adrenal-control",
    "profileId": "life",
    "name": {
      "en": "Adrenal Control",
      "pt": "Controle Adrenal"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Fades",
      "pt": "Traço Aprimorado · Desgaste"
    },
    "page": 90,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "fades",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Enhanced Strength, Fades • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Strength, Fades"
  },
  {
    "id": "life-biokinesis",
    "profileId": "life",
    "name": {
      "en": "Biokinesis",
      "pt": "Biocinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Limited",
      "pt": "Mover Objetos · Limitado"
    },
    "page": 90,
    "components": [
      {
        "effectId": "move-object",
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
      "Life"
    ],
    "audit": {
      "formula": "Move Object, Limited to Biological Material • 1",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Move Object, Limited to Biological Material"
  },
  {
    "id": "life-cure",
    "profileId": "life",
    "name": {
      "en": "Cure",
      "pt": "Curar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing · Limited",
      "pt": "Cura · Limitado"
    },
    "page": 91,
    "components": [
      {
        "effectId": "healing",
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
      "Life"
    ],
    "audit": {
      "formula": "Healing, Limited to Disease and Poison • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Healing, Limited to Disease and Poison"
  },
  {
    "id": "life-energize",
    "profileId": "life",
    "name": {
      "en": "Energize",
      "pt": "Energizar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing · Energizing · Limited",
      "pt": "Cura · Energizing · Limitado"
    },
    "page": 91,
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
      "Life"
    ],
    "audit": {
      "formula": "Healing, Energizing, Limited to Energizing • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Healing, Energizing, Limited to Energizing"
  },
  {
    "id": "life-life-sense",
    "profileId": "life",
    "name": {
      "en": "Life Sense",
      "pt": "Sentido Vital"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 91,
    "components": [
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Life"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Mental"
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
      "Life"
    ],
    "audit": {
      "formula": "Senses 3 (Detect Life, Ranged, Acute) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Senses 3 (Detect Life, Ranged, Acute)"
  },
  {
    "id": "life-pharmacopeia",
    "profileId": "life",
    "name": {
      "en": "Pharmacopeia",
      "pt": "Farmacopeia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing",
      "pt": "Cura"
    },
    "page": 91,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Healing (Alternate Effect: Bio-Disruption) • 1",
      "fixed": 1,
      "perRank": 2
    },
    "alternateEffects": [
      {
        "name": {
          "en": "Bio-Disruption",
          "pt": "Biodisrupção"
        },
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
        ]
      }
    ],
    "sourceFormula": "Healing (Alternate Effect: Bio-Disruption)"
  },
  {
    "id": "life-psychic-diagnosis",
    "profileId": "life",
    "name": {
      "en": "Psychic Diagnosis",
      "pt": "Diagnóstico Psíquico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 91,
    "components": [
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Health"
          },
          {
            "id": "analytical",
            "ranks": 2,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Senses 3 (Detect Health, Analytical) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Senses 3 (Detect Health, Analytical)"
  },
  {
    "id": "life-skin-shifting",
    "profileId": "life",
    "name": {
      "en": "Skin-Shifting",
      "pt": "Alterar Pele"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Morph",
      "pt": "Metamorfose"
    },
    "page": 91,
    "components": [
      {
        "effectId": "morph",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Morph 2 (outward appearance limited by size and shape) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Morph 2 (outward appearance limited by size and shape)"
  },
  {
    "id": "life-suspended-animation",
    "profileId": "life",
    "name": {
      "en": "Suspended Animation",
      "pt": "Animação Suspensa"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Limited",
      "pt": "Imunidade · Limitado"
    },
    "page": 91,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
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
      "Life"
    ],
    "audit": {
      "formula": "Immunity 5 (aging, starvation and dehydration, suffocation, ongoing biological effects), Limited (subject is incapacitated) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Immunity 5 (aging, starvation and dehydration, suffocation, ongoing biological effects), Limited (subject is incapacitated)"
  },
  {
    "id": "life-total-healing",
    "profileId": "life",
    "name": {
      "en": "Total Healing",
      "pt": "Cura Total"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing · Persistent (flat purchase) · Restorative · Resurrection",
      "pt": "Cura · Persistente (compra fixa) · Restaurativo · Resurrection"
    },
    "page": 91,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "persistent_flat",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "restorative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "resurrection",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Life"
    ],
    "audit": {
      "formula": "Healing, Persistent, Restorative, Resurrection • 1 point + 6 points per rank",
      "fixed": 1,
      "perRank": 6,
      "discrepancy": {
        "reason": {
          "en": "Healing 2 + Restorative 1 + Resurrection 1 = 4/rank; Persistent is a flat +1, as the Handbook states. Printed 6/rank has two unexplained points.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 1 PP fixos + 4 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 1,
        "perRank": 4
      }
    },
    "sourceFormula": "Healing, Persistent, Restorative, Resurrection"
  },
  {
    "id": "life-total-self-healing",
    "profileId": "life",
    "name": {
      "en": "Total Self Healing",
      "pt": "Autocura Total"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing · Reaction · Energizing · Persistent (flat purchase) · Restorative · Resurrection · Limited",
      "pt": "Cura · Reação · Energizing · Persistente (compra fixa) · Restaurativo · Resurrection · Limitado"
    },
    "page": 91,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "energizing",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "persistent_flat",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "restorative",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "resurrection",
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
      "Life"
    ],
    "audit": {
      "formula": "Healing, Reaction (when hurt), Energizing, Persistent, Restorative, Resurrection, Self-Only • 1 point + 7",
      "fixed": 1,
      "perRank": 7
    },
    "sourceFormula": "Healing, Reaction (when hurt), Energizing, Persistent, Restorative, Resurrection, Self-Only"
  }
] satisfies PowerTemplate[];
