import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "magic-mystic-bolt",
    "profileId": "magic",
    "name": {
      "en": "Mystic Bolt",
      "pt": "Raio Místico"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 105,
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Damage (magic) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (magic)"
  },
  {
    "id": "magic-mystic-passage",
    "profileId": "magic",
    "name": {
      "en": "Mystic Passage",
      "pt": "Passagem Mística"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Teleport",
      "pt": "Teleporte"
    },
    "page": 105,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Teleport • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport"
  },
  {
    "id": "magic-mystic-shield",
    "profileId": "magic",
    "name": {
      "en": "Mystic Shield",
      "pt": "Escudo Místico"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 105,
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
      "Magic"
    ],
    "audit": {
      "formula": "Protection, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection, Sustained"
  },
  {
    "id": "magic-levitation",
    "profileId": "magic",
    "name": {
      "en": "Levitation",
      "pt": "Levitação"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 105,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Flight"
  },
  {
    "id": "magic-aegis-of-abbridon",
    "profileId": "magic",
    "name": {
      "en": "Aegis of Abbridon",
      "pt": "Égide de Abbridon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained",
      "pt": "Proteção · Impenetrável · Sustentado"
    },
    "page": 105,
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
      "Magic"
    ],
    "audit": {
      "formula": "Impervious Protection, Sustained • 2",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Impervious Protection, Sustained"
  },
  {
    "id": "magic-scrying",
    "profileId": "magic",
    "name": {
      "en": "Scrying",
      "pt": "Vidência"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 105,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Four sense types"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual, Auditory, Mental) • 4 points",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Remote Sensing (Visual, Auditory, Mental)"
  },
  {
    "id": "magic-all-seening-eyes-of-abbridon",
    "profileId": "magic",
    "name": {
      "en": "All-Seening Eyes of Abbridon",
      "pt": "Olhos Reveladores de Abbridon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 105,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Four sense types"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual, Auditory, Mental) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Remote Sensing (Visual, Auditory, Mental)"
  },
  {
    "id": "magic-abjurations-of-abbridon",
    "profileId": "magic",
    "name": {
      "en": "Abjurations of Abbridon",
      "pt": "Abjurações de Abbridon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Nullify · Simultaneous",
      "pt": "Anulação · Simultâneo"
    },
    "page": 105,
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
          "descriptor": "Binding, Darkness, Evil Summon"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Nullify Binding, Darkness, and Evil Summon effects, Simultaneous • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Nullify Binding, Darkness, and Evil Summon effects, Simultaneous"
  },
  {
    "id": "magic-all-revealing-light-of-abbridon",
    "profileId": "magic",
    "name": {
      "en": "All-Revealing Light of Abbridon",
      "pt": "Luz Reveladora de Abbridon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Nullify · Area · Simultaneous · Reduced Range",
      "pt": "Anulação · Área · Simultâneo · Alcance Reduzido"
    },
    "page": 105,
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
          },
          {
            "modifierId": "reduced_range",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Concealment and illusions"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Nullify Concealing or Illusory Effects, Simultaneous, Close Range • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Nullify Concealing or Illusory Effects, Simultaneous, Close Range"
  },
  {
    "id": "magic-illumination-of-abbridon",
    "profileId": "magic",
    "name": {
      "en": "Illumination of Abbridon",
      "pt": "Iluminação de Abbridon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Environment · Feature",
      "pt": "Controle Ambiental · Característica"
    },
    "page": 105,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Bright Light"
      },
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Environment (Bright Light), Feature 1 (equal to daylight) • 1 point + 2 points per rank",
      "fixed": 1,
      "perRank": 2
    },
    "sourceFormula": "Environment (Bright Light), Feature 1 (equal to daylight)"
  },
  {
    "id": "magic-ahgrazul-s-compass",
    "profileId": "magic",
    "name": {
      "en": "Ahgrazul’s Compass",
      "pt": "Bússola de Ahgrazul"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Remote Sensing · Simultaneous · Limited",
      "pt": "Sensoriamento Remoto · Simultâneo · Limitado"
    },
    "page": 105,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "simultaneous",
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
        "variableCostOption": "Two sense types (or Visual)"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual), Simultaneous, Limited to Extended Searches (see Search, Deluxe Hero’s Handbook, page 123) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing (Visual), Simultaneous, Limited to Extended Searches (see Search, Deluxe Hero’s Handbook, page 123)"
  },
  {
    "id": "magic-airts-of-ahgrazul",
    "profileId": "magic",
    "name": {
      "en": "Airts of Ahgrazul",
      "pt": "Caminhos de Ahgrazul"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 105,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "movement": "Dimensional Travel: Mystic Dimensions"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Movement 2 (Dimension Travel 2, Mystic Dimensions) • 4 points +1 point per rank of Increased Mass.",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Dimension Travel 2, Mystic Dimensions)"
  },
  {
    "id": "magic-auspicious-augury-of-ahgrazul",
    "profileId": "magic",
    "name": {
      "en": "Auspicious Augury of Ahgrazul",
      "pt": "Augúrio Auspicioso de Ahgrazul"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Enhanced Trait · Senses · Limited",
      "pt": "Traço Aprimorado · Sentidos · Limitado"
    },
    "page": 106,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Second Chance"
        }
      },
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
      "Magic"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Second Chance), Senses 4 (Precognition, Limited to Second Chance) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Advantage 1 (Second Chance), Senses 4 (Precognition, Limited to Second Chance)"
  },
  {
    "id": "magic-baleful-bindings-of-bal-hemoth",
    "profileId": "magic",
    "name": {
      "en": "Baleful Bindings of Bal’Hemoth",
      "pt": "Amarras Maléficas de Bal’Hemoth"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance · Affects Insubstantial",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa · Afeta Insubstanciais"
    },
    "page": 106,
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
          },
          {
            "modifierId": "affects_insubstantial",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Will; Hindered and Vulnerable, Defenseless and Immobilized), Affects Insubstantial 2, Extra Condition, Limited Degree • 2 points + 2 points per rank",
      "fixed": 2,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (Resisted by Dodge, Overcome by Will; Hindered and Vulnerable, Defenseless and Immobilized), Affects Insubstantial 2, Extra Condition, Limited Degree"
  },
  {
    "id": "magic-grasp-of-ghorummaz",
    "profileId": "magic",
    "name": {
      "en": "Grasp of Ghorummaz",
      "pt": "Agarrão de Ghorummaz"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance · Affects Insubstantial · Indirect",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa · Afeta Insubstanciais · Indireto"
    },
    "page": 106,
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
          },
          {
            "modifierId": "affects_insubstantial",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "indirect",
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree, Affects Incorporeal 2, Indirect 1 • 3 points +2 points per rank",
      "fixed": 3,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree, Affects Incorporeal 2, Indirect 1"
  },
  {
    "id": "magic-chains-of-kar-kradas",
    "profileId": "magic",
    "name": {
      "en": "Chains of Kar’Kradas",
      "pt": "Correntes de Kar’Kradas"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance · Affects Insubstantial · Cumulative",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa · Afeta Insubstanciais · Cumulativo"
    },
    "page": 108,
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
          },
          {
            "modifierId": "affects_insubstantial",
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobile), Affects Insubstantial 2, Cumulative, Extra Condition, Limited Degree • 2 points +",
      "fixed": 2,
      "perRank": 3
    },
    "sourceFormula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobile), Affects Insubstantial 2, Cumulative, Extra Condition, Limited Degree"
  },
  {
    "id": "magic-shining-shackles-of-sirrion",
    "profileId": "magic",
    "name": {
      "en": "Shining Shackles of Sirrion",
      "pt": "Grilhões Brilhantes de Sirrion"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa"
    },
    "page": 111,
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Will; Hindered and Impaired, Disabled and Immobile), Extra Condition, Limited Degree • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (Resisted by Dodge, Overcome by Will; Hindered and Impaired, Disabled and Immobile), Extra Condition, Limited Degree"
  },
  {
    "id": "magic-beast-of-bal-hemoth",
    "profileId": "magic",
    "name": {
      "en": "Beast of Bal’Hemoth",
      "pt": "Besta de Bal’Hemoth"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon",
      "pt": "Invocar"
    },
    "page": 106,
    "components": [
      {
        "effectId": "summon",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Minion 5 • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Summon Minion 5"
  },
  {
    "id": "magic-bidding-of-bal-hemoth",
    "profileId": "magic",
    "name": {
      "en": "Bidding of Bal’Hemoth",
      "pt": "Comando de Bal’Hemoth"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative",
      "pt": "Aflição · Alcance Aumentado · Cumulativo"
    },
    "page": 106,
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled)"
  },
  {
    "id": "magic-bitter-lash",
    "profileId": "magic",
    "name": {
      "en": "Bitter Lash",
      "pt": "Chicote Amargo"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Cumulative · Reach",
      "pt": "Aflição · Cumulativo · Alcance de Luta"
    },
    "page": 106,
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
            "modifierId": "reach",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Will; Dazed, Stunned, Paralyzed), Reach 2 • 2 points +2 points",
      "fixed": 2,
      "perRank": 2
    },
    "sourceFormula": "Cumulative Affliction (Resisted and Overcome by Will; Dazed, Stunned, Paralyzed), Reach 2"
  },
  {
    "id": "magic-ghorummaz-s-dictum",
    "profileId": "magic",
    "name": {
      "en": "Ghorummaz’s Dictum",
      "pt": "Decreto de Ghorummaz"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Progressive · Limited Degree · Limited",
      "pt": "Aflição · Área · Progressivo · Graus Limitados · Limitado"
    },
    "page": 106,
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
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited_degree",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Progressive Affliction (Entranced, Compelled), Limited Degree, Limited to Unnatural Creatures, Limited to Holding at Bay • 1 point",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Burst Area Progressive Affliction (Entranced, Compelled), Limited Degree, Limited to Unnatural Creatures, Limited to Holding at Bay"
  },
  {
    "id": "magic-gale-of-ghorummaz",
    "profileId": "magic",
    "name": {
      "en": "Gale of Ghorummaz",
      "pt": "Vendaval de Ghorummaz"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Environment · Environment",
      "pt": "Controle Ambiental · Controle Ambiental"
    },
    "page": 106,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Impede Movement (2 ranks)"
      },
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-5)"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Environment (Impeded Movement 2, Visibility –5) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Environment (Impeded Movement 2, Visibility –5)"
  },
  {
    "id": "magic-storm-of-ghorummaz",
    "profileId": "magic",
    "name": {
      "en": "Storm of Ghorummaz",
      "pt": "Tempestade de Ghorummaz"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Increased Range · Indirect",
      "pt": "Dano · Alcance Aumentado · Indireto"
    },
    "page": 107,
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
            "modifierId": "indirect",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Damage (lightning), Indirect 2 • 2 points +2 points per rank",
      "fixed": 2,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (lightning), Indirect 2"
  },
  {
    "id": "magic-thunderous-tread",
    "profileId": "magic",
    "name": {
      "en": "Thunderous Tread",
      "pt": "Passo Trovejante"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Instant Recovery · Limited Degree · Limited",
      "pt": "Aflição · Área · Recuperação Instantânea · Graus Limitados · Limitado"
    },
    "page": 107,
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
            "modifierId": "instant_recovery",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited_degree",
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
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted and Overcome by Fortitude; Vulnerable, Defenseless), Instant Recover, Limited Degree, Limited: caster and target much touch the ground • 1 point per rank",
      "fixed": 0,
      "perRank": 1,
      "discrepancy": {
        "reason": {
          "en": "Affliction 1 + Area 1 - Instant Recovery 1 - Limited Degree 1 - Limited 1 yields 1 PP per 3 ranks.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 0.333333 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 0.3333333333333333
      }
    },
    "sourceFormula": "Burst Area Affliction (Resisted and Overcome by Fortitude; Vulnerable, Defenseless), Instant Recover, Limited Degree, Limited: caster and target much touch the ground"
  },
  {
    "id": "magic-hand-of-heshem",
    "profileId": "magic",
    "name": {
      "en": "Hand of Heshem",
      "pt": "Mão de Heshem"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 107,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Move Object • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Move Object"
  },
  {
    "id": "magic-holy-hearth",
    "profileId": "magic",
    "name": {
      "en": "Holy Hearth",
      "pt": "Lar Sagrado"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Progressive · Limited",
      "pt": "Aflição · Área · Progressivo · Limitado"
    },
    "page": 107,
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
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Progressive Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Limited to Evil Creatures, Limited to Holding at Bay • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Progressive Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Limited to Evil Creatures, Limited to Holding at Bay"
  },
  {
    "id": "magic-heshem-s-way",
    "profileId": "magic",
    "name": {
      "en": "Heshem’s Way",
      "pt": "Caminho de Heshem"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Movement · Portal",
      "pt": "Movimento · Portal"
    },
    "page": 107,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "portal_movement",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "movement": "Dimensional Travel"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Movement 2 (Dimensional 2), Portal • 8 points",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Dimensional 2), Portal"
  },
  {
    "id": "magic-crying-road",
    "profileId": "magic",
    "name": {
      "en": "Crying Road",
      "pt": "Estrada do Choro"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Movement · Portal",
      "pt": "Movimento · Portal"
    },
    "page": 107,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "portal_movement",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "movement": "Dimensional Travel"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Movement 1 (Dimensional 1, Dream Dimension), Portal • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Movement 1 (Dimensional 1, Dream Dimension), Portal"
  },
  {
    "id": "magic-seventh-wheel-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Seventh Wheel of Weyan",
      "pt": "Sétima Roda de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Movement · Portal",
      "pt": "Movimento · Portal"
    },
    "page": 113,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "portal_movement",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "fieldValues": {
          "movement": "Dimensional Travel"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Movement 2 (Dimensional 2 – Mystic Dimensions), Portal • 8 points",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Dimensional 2 – Mystic Dimensions), Portal"
  },
  {
    "id": "magic-holy-hosts",
    "profileId": "magic",
    "name": {
      "en": "Holy Hosts",
      "pt": "Hostes Sagradas"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Nullify · Broad",
      "pt": "Anulação · Amplo"
    },
    "page": 107,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Magic"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Nullify Magic, Broad • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Nullify Magic, Broad"
  },
  {
    "id": "magic-hood-of-heshem",
    "profileId": "magic",
    "name": {
      "en": "Hood of Heshem",
      "pt": "Capuz de Heshem"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Concealment · Area · Attack",
      "pt": "Camuflagem · Área · Ataque"
    },
    "page": 107,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
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
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Cloud Area Concealment Attack 4 (All Visual) • 12 points + 4 points per additional area rank",
      "fixed": 12,
      "perRank": 0
    },
    "sourceFormula": "Cloud Area Concealment Attack 4 (All Visual)"
  },
  {
    "id": "magic-mists-of-malador",
    "profileId": "magic",
    "name": {
      "en": "Mists of Malador",
      "pt": "Névoas de Malador"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Concealment · Area · Increased Range · Attack",
      "pt": "Camuflagem · Área · Alcance Aumentado · Ataque"
    },
    "page": 109,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
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
            "modifierId": "attack",
            "ranks": 1,
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Burst Area Concealment 4 Attack (Visual) • 16 points + 4 points per +1 area rank",
      "fixed": 16,
      "perRank": 0
    },
    "sourceFormula": "Ranged Burst Area Concealment 4 Attack (Visual)"
  },
  {
    "id": "magic-scarlet-shades-of-sirrion",
    "profileId": "magic",
    "name": {
      "en": "Scarlet Shades of Sirrion",
      "pt": "Sombras Escarlates de Sirrion"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Concealment · Area · Increased Range · Attack",
      "pt": "Camuflagem · Área · Alcance Aumentado · Ataque"
    },
    "page": 111,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 1,
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
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Concealment Attack (Visual) 4 • 12 points + 4 points per +1 area rank",
      "fixed": 12,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "Ranged adds +1 per rank to the otherwise 12-point Cloud Concealment; the printed 12 omits it.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 16 PP fixos + 0 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 16,
        "perRank": 0
      }
    },
    "sourceFormula": "Ranged Cloud Area Concealment Attack (Visual) 4"
  },
  {
    "id": "magic-obsscuring-orb-of-obroros",
    "profileId": "magic",
    "name": {
      "en": "Obsscuring Orb of Obroros",
      "pt": "Orbe Obscurecedor de Obroros"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Concealment · Area · Increased Range · Attack · Selective",
      "pt": "Camuflagem · Área · Alcance Aumentado · Ataque · Seletivo"
    },
    "page": 110,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 6,
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
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "selective",
            "ranks": 1,
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Burst Area Concealment Attack 6 (Visual and Mental), Selective • 30 points + 6 points",
      "fixed": 30,
      "perRank": 0
    },
    "sourceFormula": "Ranged Burst Area Concealment Attack 6 (Visual and Mental), Selective"
  },
  {
    "id": "magic-hook-of-heshem",
    "profileId": "magic",
    "name": {
      "en": "Hook of Heshem",
      "pt": "Gancho de Heshem"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Penetrating",
      "pt": "Dano · Penetrante"
    },
    "page": 107,
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
      "Magic"
    ],
    "audit": {
      "formula": "Penetrating Damage • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Penetrating Damage"
  },
  {
    "id": "magic-scythe-of-shatachna",
    "profileId": "magic",
    "name": {
      "en": "Scythe of Shatachna",
      "pt": "Foice de Shatachna"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Penetrating · Reach",
      "pt": "Dano · Penetrante · Alcance de Luta"
    },
    "page": 111,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "penetrating",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "reach",
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
      "Magic"
    ],
    "audit": {
      "formula": "Penetrating Damage, Reach 1 • 1 point",
      "fixed": 1,
      "perRank": 2
    },
    "sourceFormula": "Penetrating Damage, Reach 1"
  },
  {
    "id": "magic-curse-of-howling-madness",
    "profileId": "magic",
    "name": {
      "en": "Curse of Howling Madness",
      "pt": "Maldição da Loucura Uivante"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Limited",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Limitado"
    },
    "page": 107,
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Progressive, Limited to causing erratic or insane behavior • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Progressive, Limited to causing erratic or insane behavior"
  },
  {
    "id": "magic-dream-dementia",
    "profileId": "magic",
    "name": {
      "en": "Dream Dementia",
      "pt": "Demência Onírica"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Insidious · Variable Descriptor",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Insidioso · Descritor Variável"
    },
    "page": 107,
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
            "modifierId": "insidious",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Cumulative, Insidious, Variable Descriptor (Emotions) • 3",
      "fixed": 3,
      "perRank": 4,
      "discrepancy": {
        "reason": {
          "en": "The two flat modifiers Insidious and Variable Descriptor total 2; the text prints 3.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 2 PP fixos + 4 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 2,
        "perRank": 4
      }
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Cumulative, Insidious, Variable Descriptor (Emotions)"
  },
  {
    "id": "magic-dream-denizens",
    "profileId": "magic",
    "name": {
      "en": "Dream Denizens",
      "pt": "Habitantes dos Sonhos"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Active · Variable Type (Broad) · Mental Link",
      "pt": "Invocar · Ativo · Variable Type (Broad) · Mental Link"
    },
    "page": 107,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "active",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "variable_type_broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "mental_link",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Dream Denizen, Active, Broad, Mental Link • 1 point + 5 points per rank",
      "fixed": 1,
      "perRank": 5
    },
    "sourceFormula": "Summon Dream Denizen, Active, Broad, Mental Link"
  },
  {
    "id": "magic-cloak-of-idolon",
    "profileId": "magic",
    "name": {
      "en": "Cloak of Idolon",
      "pt": "Manto de Idolon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Concealment",
      "pt": "Camuflagem"
    },
    "page": 108,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "senses": [
            "mental"
          ]
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Concealment 2 (Magical), Sustained • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Concealment 2 (Magical), Sustained"
  },
  {
    "id": "magic-illusions-of-idolon",
    "profileId": "magic",
    "name": {
      "en": "Illusions of Idolon",
      "pt": "Ilusões de Idolon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Illusion · Resistible · Selective",
      "pt": "Ilusão · Resistível · Seletivo"
    },
    "page": 108,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "resistible",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "selective",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "All sense types"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Illusion (All Senses), Resistible by Will, Selective • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Illusion (All Senses), Resistible by Will, Selective"
  },
  {
    "id": "magic-veil-of-idolon",
    "profileId": "magic",
    "name": {
      "en": "Veil of Idolon",
      "pt": "Véu de Idolon"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Concealment · Area · Affects Others",
      "pt": "Camuflagem · Área · Afeta Outros"
    },
    "page": 108,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "affects_others",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "senses": [
            "mental"
          ]
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Concealment 3 (Mental Senses and Remote Sensing), Affects Others • 12 points + 3 points per +1 area rank",
      "fixed": 12,
      "perRank": 0
    },
    "sourceFormula": "Burst Area Concealment 3 (Mental Senses and Remote Sensing), Affects Others"
  },
  {
    "id": "magic-eight-eyes-of-ios",
    "profileId": "magic",
    "name": {
      "en": "Eight Eyes of Ios",
      "pt": "Oito Olhos de Ios"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 108,
    "components": [
      {
        "effectId": "senses",
        "ranks": 13,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "radius",
            "ranks": 2,
            "senseType": "Visual"
          },
          {
            "id": "counters_illusion",
            "ranks": 2,
            "senseType": "Visual",
            "detail": "Illusions"
          },
          {
            "id": "counters_concealment",
            "ranks": 5,
            "senseType": "Visual",
            "detail": "All concealment"
          },
          {
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Senses 13 (Radius Vision, Vision Counters Illusion, Vision Counters and Penentrates All Concealment) • 13 points",
      "fixed": 13,
      "perRank": 0
    },
    "sourceFormula": "Senses 13 (Radius Vision, Vision Counters Illusion, Vision Counters and Penentrates All Concealment)"
  },
  {
    "id": "magic-enchantment-of-ios",
    "profileId": "magic",
    "name": {
      "en": "Enchantment of Ios",
      "pt": "Encantamento de Ios"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 108,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Fascinate"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Fascinate) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Advantage 1 (Fascinate)"
  },
  {
    "id": "magic-everwatchful-eye-of-ios",
    "profileId": "magic",
    "name": {
      "en": "Everwatchful Eye of Ios",
      "pt": "Olho Vigilante de Ios"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Enhanced Trait · Senses",
      "pt": "Traço Aprimorado · Sentidos"
    },
    "page": 108,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Uncanny Dodge"
        }
      },
      {
        "effectId": "senses",
        "ranks": 3,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "danger_sense",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "radius",
            "ranks": 2,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Uncanny Dodge), Senses 3 (Danger Sense, Radius Vision) • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Advantage 1 (Uncanny Dodge), Senses 3 (Danger Sense, Radius Vision)"
  },
  {
    "id": "magic-call-of-kar-kradas",
    "profileId": "magic",
    "name": {
      "en": "Call of Kar’Kradas",
      "pt": "Chamado de Kar’Kradas"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Active · Variable Type (Broad) · Controlled",
      "pt": "Invocar · Ativo · Variable Type (Broad) · Controlado"
    },
    "page": 108,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "active",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "variable_type_broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Demon, Active, Broad, Controlled • 5 points per rank",
      "fixed": 0,
      "perRank": 5,
      "discrepancy": {
        "reason": {
          "en": "Summon 2 + Active 1 + Broad Type 2 + Controlled 1 = 6 PP/rank, not printed 5.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 6 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 6
      }
    },
    "sourceFormula": "Summon Demon, Active, Broad, Controlled"
  },
  {
    "id": "magic-crooked-path-of-kar-kradas",
    "profileId": "magic",
    "name": {
      "en": "Crooked Path of Kar’Kradas",
      "pt": "Caminho Tortuoso de Kar’Kradas"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Teleport · Accurate · Medium",
      "pt": "Teleporte · Preciso · Meio"
    },
    "page": 108,
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
      "Magic"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Medium (Shadows) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport, Accurate, Medium (Shadows)"
  },
  {
    "id": "magic-hounds-of-kar-kradas",
    "profileId": "magic",
    "name": {
      "en": "Hounds of Kar’Kradas",
      "pt": "Cães de Kar’Kradas"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Controlled · Heroic · Mental Link",
      "pt": "Invocar · Controlado · Heroico · Mental Link"
    },
    "page": 108,
    "components": [
      {
        "effectId": "summon",
        "ranks": 5,
        "modifiers": [
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "mental_link",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Dark Hound 5 (75-point minion), Controlled, Heroic, Mental Link • 26 points + 10",
      "fixed": 26,
      "perRank": 0
    },
    "sourceFormula": "Summon Dark Hound 5 (75-point minion), Controlled, Heroic, Mental Link"
  },
  {
    "id": "magic-umbral-kraken-of-kar-kradas",
    "profileId": "magic",
    "name": {
      "en": "Umbral Kraken of Kar’Kradas",
      "pt": "Kraken Sombrio de Kar’Kradas"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Active · Controlled · Heroic",
      "pt": "Invocar · Ativo · Controlado · Heroico"
    },
    "page": 108,
    "components": [
      {
        "effectId": "summon",
        "ranks": 5,
        "modifiers": [
          {
            "modifierId": "active",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Umbral Kraken (75- point minion), Active, Controlled, Heroic • 30 points",
      "fixed": 30,
      "perRank": 0
    },
    "sourceFormula": "Summon Umbral Kraken (75- point minion), Active, Controlled, Heroic"
  },
  {
    "id": "magic-lamal-s-labyrinth",
    "profileId": "magic",
    "name": {
      "en": "Lamal’s Labyrinth",
      "pt": "Labirinto de Lamal"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition",
      "pt": "Aflição · Alcance Aumentado · Condição Extra"
    },
    "page": 109,
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
            "modifierId": "extra_condition",
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced and Vulnerable, Defenseless and Immobile, Incapacitated), Extra Condition •",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced and Vulnerable, Defenseless and Immobile, Incapacitated), Extra Condition"
  },
  {
    "id": "magic-lamal-s-mighty-hands",
    "profileId": "magic",
    "name": {
      "en": "Lamal’s Mighty Hands",
      "pt": "Mãos Poderosas de Lamal"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Move Object · Precise · Subtle",
      "pt": "Mover Objetos · Preciso · Sutil"
    },
    "page": 109,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "precise",
            "ranks": 1,
            "isPowerSpecific": false
          },
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
      "Magic"
    ],
    "audit": {
      "formula": "Move Object, Precise, Subtle • 2 points",
      "fixed": 2,
      "perRank": 2
    },
    "sourceFormula": "Move Object, Precise, Subtle"
  },
  {
    "id": "magic-lamal-s-rebuke",
    "profileId": "magic",
    "name": {
      "en": "Lamal’s Rebuke",
      "pt": "Repreensão de Lamal"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Extra Condition · Limited",
      "pt": "Aflição · Área · Condição Extra · Limitado"
    },
    "page": 109,
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
            "modifierId": "extra_condition",
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted and Overcome by Will; Dazed and Hindered, Disabled and Stunned, Incapacitated), Extra Condition, Limited to Extraplanar Creatures of Chaos • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Affliction (Resisted and Overcome by Will; Dazed and Hindered, Disabled and Stunned, Incapacitated), Extra Condition, Limited to Extraplanar Creatures of Chaos"
  },
  {
    "id": "magic-light-of-lamal",
    "profileId": "magic",
    "name": {
      "en": "Light of Lamal",
      "pt": "Luz de Lamal"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Limited Degree · Limited",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Graus Limitados · Limitado"
    },
    "page": 109,
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted and Overcome by Will; Controlled), Progressive, Limited Degree, Limited to Speaking the Truth • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Ranged Affliction (Resisted and Overcome by Will; Controlled), Progressive, Limited Degree, Limited to Speaking the Truth"
  },
  {
    "id": "magic-minion-of-malador",
    "profileId": "magic",
    "name": {
      "en": "Minion of Malador",
      "pt": "Lacaio de Malador"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Controlled · Horde · Multiple Minions (per effect rank)",
      "pt": "Invocar · Controlado · Horda · Múltiplos Lacaios (por graduação do efeito)"
    },
    "page": 109,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "horde",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "multiple_minions_ranked",
            "ranks": 5,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Undead, Controlled, Horde, Multiple Minions (32 undead) • 14 points per rank",
      "fixed": 0,
      "perRank": 14
    },
    "sourceFormula": "Summon Undead, Controlled, Horde, Multiple Minions (32 undead)"
  },
  {
    "id": "magic-miasma-of-malador",
    "profileId": "magic",
    "name": {
      "en": "Miasma of Malador",
      "pt": "Miasma de Malador"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Increased Range · Area · Linked · Affliction · Increased Range · Area · Cumulative · Limited",
      "pt": "Dano · Alcance Aumentado · Área · Vinculado · Aflição · Alcance Aumentado · Área · Cumulativo · Limitado"
    },
    "page": 109,
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
            "option": "Cloud",
            "isPowerSpecific": false
          },
          {
            "modifierId": "linked",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      },
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
            "option": "Cloud",
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Cloud Area Damage (acid) Linked to Ranged Cloud Area Cumulative Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision • 6 points per rank",
      "fixed": 0,
      "perRank": 6
    },
    "sourceFormula": "Ranged Cloud Area Damage (acid) Linked to Ranged Cloud Area Cumulative Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Unaware), Limited to Vision"
  },
  {
    "id": "magic-might-of-malador",
    "profileId": "magic",
    "name": {
      "en": "Might of Malador",
      "pt": "Poder de Malador"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 109,
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Damage (necomantic) • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (necomantic)"
  },
  {
    "id": "magic-mists-of-the-modrossus",
    "profileId": "magic",
    "name": {
      "en": "Mists of the Modrossus",
      "pt": "Névoas dos Modrossus"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Progressive · Selective · Limited",
      "pt": "Aflição · Área · Progressivo · Seletivo · Limitado"
    },
    "page": 110,
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
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "selective",
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
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted and Overcome by Will; Entranced, Compelled, Transformed), Progressive, Selective, Limited to Blanking Recent Memories • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Burst Area Affliction (Resisted and Overcome by Will; Entranced, Compelled, Transformed), Progressive, Selective, Limited to Blanking Recent Memories"
  },
  {
    "id": "magic-sign-of-the-modrossus",
    "profileId": "magic",
    "name": {
      "en": "Sign of the Modrossus",
      "pt": "Sinal dos Modrossus"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Extra Condition · Limited",
      "pt": "Aflição · Área · Condição Extra · Limitado"
    },
    "page": 110,
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
            "modifierId": "extra_condition",
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted and Overcome by Will; Dazed and Hindered, Stunned and Immobile, Incapacitated), Extra Condition, Limited to Magical Creatures • 2 points per rank +1 point per rank per +1 area rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Affliction (Resisted and Overcome by Will; Dazed and Hindered, Stunned and Immobile, Incapacitated), Extra Condition, Limited to Magical Creatures"
  },
  {
    "id": "magic-occult-exorcism",
    "profileId": "magic",
    "name": {
      "en": "Occult Exorcism",
      "pt": "Exorcismo Oculto"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Nullify · Simultaneous",
      "pt": "Anulação · Simultâneo"
    },
    "page": 110,
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
          "descriptor": "Mind influencing"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Nullify Mind-Influencing Effects, Simultaneous • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Nullify Mind-Influencing Effects, Simultaneous"
  },
  {
    "id": "magic-omens-of-obroros",
    "profileId": "magic",
    "name": {
      "en": "Omens of Obroros",
      "pt": "Presságios de Obroros"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Remote Sensing · Dimensional · No Conduit · Subtle",
      "pt": "Sensoriamento Remoto · Dimensional · No Conduit · Sutil"
    },
    "page": 110,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "dimensional",
            "ranks": 3,
            "isPowerSpecific": false
          },
          {
            "modifierId": "no_conduit",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Two sense types (or Visual)"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Remote Sensing (Vision), Dimensional 3, No Conduit, Subtle • 4 points + 3 points per rank",
      "fixed": 4,
      "perRank": 3
    },
    "sourceFormula": "Remote Sensing (Vision), Dimensional 3, No Conduit, Subtle"
  },
  {
    "id": "magic-phantasms-of-the-phoros",
    "profileId": "magic",
    "name": {
      "en": "Phantasms of the Phoros",
      "pt": "Fantasmas dos Phoros"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Illusion",
      "pt": "Ilusão"
    },
    "page": 110,
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
      "Magic"
    ],
    "audit": {
      "formula": "Illusion (Visual) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Illusion (Visual)"
  },
  {
    "id": "magic-scourge-of-shatachna",
    "profileId": "magic",
    "name": {
      "en": "Scourge of Shatachna",
      "pt": "Flagelo de Shatachna"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Cumulative · Extra Condition · Reach",
      "pt": "Aflição · Cumulativo · Condição Extra · Alcance de Luta"
    },
    "page": 111,
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
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reach",
            "ranks": 4,
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
      "Magic"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Will; Dazed and Impaired, Defenseless and Stunned , Incapacitated), Extra Condition, Reach 4 • 4 points",
      "fixed": 4,
      "perRank": 3
    },
    "sourceFormula": "Cumulative Affliction (Resisted and Overcome by Will; Dazed and Impaired, Defenseless and Stunned , Incapacitated), Extra Condition, Reach 4"
  },
  {
    "id": "magic-servants-of-shatachna",
    "profileId": "magic",
    "name": {
      "en": "Servants of Shatachna",
      "pt": "Servos de Shatachna"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Variable Type (Broad)",
      "pt": "Invocar · Variable Type (Broad)"
    },
    "page": 111,
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
      "Magic"
    ],
    "audit": {
      "formula": "Summon Demon, Broad Type • 4",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Summon Demon, Broad Type"
  },
  {
    "id": "magic-shadows-of-shatachna",
    "profileId": "magic",
    "name": {
      "en": "Shadows of Shatachna",
      "pt": "Sombras de Shatachna"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Area · Progressive · Extra Condition",
      "pt": "Aflição · Alcance Aumentado · Área · Progressivo · Condição Extra"
    },
    "page": 111,
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
          },
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "extra_condition",
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
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Burst Area Progressive Affliction (Resisted and Overcome by Will; Dazed and Impaired, Defenseless and Disabled, Paralyzed and Unaware), Extra Condition • 4 points per rank",
      "fixed": 0,
      "perRank": 4,
      "discrepancy": {
        "reason": {
          "en": "Affliction 1 + Ranged 1 + Area 1 + Progressive 2 + Extra Condition 1 = 6 PP/rank.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 6 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 6
      }
    },
    "sourceFormula": "Ranged Burst Area Progressive Affliction (Resisted and Overcome by Will; Dazed and Impaired, Defenseless and Disabled, Paralyzed and Unaware), Extra Condition"
  },
  {
    "id": "magic-seal-of-silence",
    "profileId": "magic",
    "name": {
      "en": "Seal of Silence",
      "pt": "Selo do Silêncio"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Limited Degree · Limited",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Graus Limitados · Limitado"
    },
    "page": 111,
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
            "modifierId": "limited_degree",
            "ranks": 2,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Controlled), Progressive, Limited Degree, Limited to Communication, Limited to Specific Information • 2 points per rank",
      "fixed": 0,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Third-degree only Affliction includes two Limited Degree purchases. The two listed Limited flaws produce 1 PP/rank.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 1 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 1
      }
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Controlled), Progressive, Limited Degree, Limited to Communication, Limited to Specific Information"
  },
  {
    "id": "magic-shining-shield-of-sirrion",
    "profileId": "magic",
    "name": {
      "en": "Shining Shield of Sirrion",
      "pt": "Escudo Brilhante de Sirrion"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 111,
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
      "Magic"
    ],
    "audit": {
      "formula": "Sustained Protection • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Sustained Protection"
  },
  {
    "id": "magic-somnambulant-spell",
    "profileId": "magic",
    "name": {
      "en": "Somnambulant Spell",
      "pt": "Feitiço Sonâmbulo"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative",
      "pt": "Aflição · Área · Cumulativo"
    },
    "page": 111,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cloud",
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
      "Magic"
    ],
    "audit": {
      "formula": "Cloud Area Cumulative Affliction (Resisted and Overcome by Will; Dazed, Stunned, Asleep) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Cloud Area Cumulative Affliction (Resisted and Overcome by Will; Dazed, Stunned, Asleep)"
  },
  {
    "id": "magic-star-demons-of-sirrion",
    "profileId": "magic",
    "name": {
      "en": "Star Demons of Sirrion",
      "pt": "Demônios Estelares de Sirrion"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Controlled",
      "pt": "Invocar · Controlado"
    },
    "page": 111,
    "components": [
      {
        "effectId": "summon",
        "ranks": 6,
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
      "Magic"
    ],
    "audit": {
      "formula": "Summon Star Demon 6 (90-point minion), Controlled • 18 points + 12 points per doubling the",
      "fixed": 18,
      "perRank": 0
    },
    "sourceFormula": "Summon Star Demon 6 (90-point minion), Controlled"
  },
  {
    "id": "magic-maw-of-vhoka",
    "profileId": "magic",
    "name": {
      "en": "Maw of Vhoka",
      "pt": "Mandíbula de Vhoka"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Damage · Increased Range · Homing",
      "pt": "Dano · Alcance Aumentado · Teleguiado"
    },
    "page": 112,
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
            "modifierId": "homing",
            "ranks": 3,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Ranged Damage (bite), Homing 3 • 3 points +2 points per rank",
      "fixed": 3,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (bite), Homing 3"
  },
  {
    "id": "magic-vile-venom",
    "profileId": "magic",
    "name": {
      "en": "Vile Venom",
      "pt": "Veneno Vil"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Weaken · Progressive · Variable Descriptor",
      "pt": "Enfraquecer · Progressivo · Descritor Variável"
    },
    "page": 112,
    "components": [
      {
        "effectId": "weaken",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "trait": "Strength then Stamina",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Weaken Strength, Progressive, Variable Descriptor (Weakens Stamina after Strength reaches 0) • 1",
      "fixed": 1,
      "perRank": 3
    },
    "sourceFormula": "Weaken Strength, Progressive, Variable Descriptor (Weakens Stamina after Strength reaches 0)"
  },
  {
    "id": "magic-ward-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Ward of Weyan",
      "pt": "Proteção de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Progressive · Limited",
      "pt": "Aflição · Área · Progressivo · Limitado"
    },
    "page": 112,
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
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Progressive Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Limited to Creatures of Chaos, Limited to Forcing Targets Away from Area • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Burst Area Progressive Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Limited to Creatures of Chaos, Limited to Forcing Targets Away from Area"
  },
  {
    "id": "magic-chant-of-chaos",
    "profileId": "magic",
    "name": {
      "en": "Chant of Chaos",
      "pt": "Canto do Caos"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Cumulative",
      "pt": "Aflição · Área · Cumulativo"
    },
    "page": 112,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
      "Magic"
    ],
    "audit": {
      "formula": "Cumulative Hearing Area Affliction (Resisted and Overcome by Will; Entranced, Compelled, Transformed) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Cumulative Hearing Area Affliction (Resisted and Overcome by Will; Entranced, Compelled, Transformed)"
  },
  {
    "id": "magic-unspeakable-summoning",
    "profileId": "magic",
    "name": {
      "en": "Unspeakable Summoning",
      "pt": "Invocação Inominável"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Heroic",
      "pt": "Invocar · Heroico"
    },
    "page": 112,
    "components": [
      {
        "effectId": "summon",
        "ranks": 7,
        "modifiers": [
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Unspeakable Servitor 7, Heroic • 28 points",
      "fixed": 28,
      "perRank": 0
    },
    "sourceFormula": "Summon Unspeakable Servitor 7, Heroic"
  },
  {
    "id": "magic-the-yellow-sign",
    "profileId": "magic",
    "name": {
      "en": "The Yellow Sign",
      "pt": "O Sinal Amarelo"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Progressive",
      "pt": "Aflição · Área · Progressivo"
    },
    "page": 112,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
            "modifierId": "progressive",
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Area Progressive Affliction (Resisted and Overcome by Will; Entranced, Compelled, Transformed) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Area Progressive Affliction (Resisted and Overcome by Will; Entranced, Compelled, Transformed)"
  },
  {
    "id": "magic-dance-of-vhoka",
    "profileId": "magic",
    "name": {
      "en": "Dance of Vhoka",
      "pt": "Dança de Vhoka"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Active · Controlled · Variable Type (General) · Increased Range",
      "pt": "Invocar · Ativo · Controlado · Variable Type (General) · Alcance Aumentado"
    },
    "page": 112,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "active",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "controlled",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "variable_type_general",
            "ranks": 1,
            "isPowerSpecific": true
          },
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
      "Magic"
    ],
    "audit": {
      "formula": "Summon Animated Weapon, Active, Controlled, General Type, Ranged • 6 points per rank",
      "fixed": 0,
      "perRank": 6
    },
    "sourceFormula": "Summon Animated Weapon, Active, Controlled, General Type, Ranged"
  },
  {
    "id": "magic-wondrous-working-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Wondrous Working of Weyan",
      "pt": "Obra Maravilhosa de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Weaken · Area · Affects Objects · Broad · Concentration · Simultaneous · Side Effect",
      "pt": "Enfraquecer · Área · Afeta Objetos · Amplo · Concentração · Simultâneo · Efeito Colateral"
    },
    "page": 113,
    "components": [
      {
        "effectId": "weaken",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "affects_objects",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "concentration_weaken",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "simultaneous",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "side_effect",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "trait": "Magic",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Weaken Magic, Affects Objects, Broad, Concentration, Simultaneous, Side Effect (psychic backlash, see description) • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Burst Area Weaken Magic, Affects Objects, Broad, Concentration, Simultaneous, Side Effect (psychic backlash, see description)"
  },
  {
    "id": "magic-curse-of-yig",
    "profileId": "magic",
    "name": {
      "en": "Curse of Yig",
      "pt": "Maldição de Yig"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Summon · Multiple Minions (per effect rank)",
      "pt": "Invocar · Múltiplos Lacaios (por graduação do efeito)"
    },
    "page": 113,
    "components": [
      {
        "effectId": "summon",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "multiple_minions_ranked",
            "ranks": 4,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Summon Snakes 3 (37-point minions), Multiple Minions 4 (16 snakes) • 18 points + 6 points per additional",
      "fixed": 18,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "Summon 3 costs 6, and four Multiple Minions purchases cost +8 per Summon rank, giving 30 PP for 16 snakes.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 30 PP fixos + 0 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 30,
        "perRank": 0
      }
    },
    "sourceFormula": "Summon Snakes 3 (37-point minions), Multiple Minions 4 (16 snakes)"
  },
  {
    "id": "magic-fangs-of-yig",
    "profileId": "magic",
    "name": {
      "en": "Fangs of Yig",
      "pt": "Presas de Yig"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Progressive",
      "pt": "Aflição · Progressivo"
    },
    "page": 113,
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
      "Magic"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Disabled, Paralyzed), Progressive • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Disabled, Paralyzed), Progressive"
  },
  {
    "id": "magic-yig-s-inexorable-transformation",
    "profileId": "magic",
    "name": {
      "en": "Yig’s Inexorable Transformation",
      "pt": "Transformação Inexorável de Yig"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Progressive · Limited Degree · Limited",
      "pt": "Aflição · Progressivo · Graus Limitados · Limitado"
    },
    "page": 113,
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
      "Magic"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Will; Transformed), Progressive, Limited Degree, Limited to One Stage per Day • 1 point per rank",
      "fixed": 0,
      "perRank": 1,
      "discrepancy": {
        "reason": {
          "en": "Third-degree only (-2), one stage per day (-1): 1 + Progressive 2 - 3 yields 1 PP per 2 ranks.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 0.5 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 0.5
      }
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Will; Transformed), Progressive, Limited Degree, Limited to One Stage per Day"
  },
  {
    "id": "magic-second-wheel-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Second Wheel of Weyan",
      "pt": "Segunda Roda de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 113,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Two sense types (or Visual)"
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual) • 2 points",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing (Visual)"
  },
  {
    "id": "magic-third-wheel-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Third Wheel of Weyan",
      "pt": "Terceira Roda de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Deflect · Reflect",
      "pt": "Deflexão · Refletir"
    },
    "page": 113,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reflect",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Deflect, Reflect • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Deflect, Reflect"
  },
  {
    "id": "magic-fourth-wheel-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Fourth Wheel of Weyan",
      "pt": "Quarta Roda de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Move Object · Perception · Limited Direction",
      "pt": "Mover Objetos · Percepção · Direção Limitada"
    },
    "page": 113,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "perception_move_object",
            "ranks": 1,
            "isPowerSpecific": true
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
      "Magic"
    ],
    "audit": {
      "formula": "Perception Ranged Move Object, Limited to Pushing • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Perception Ranged Move Object, Limited to Pushing"
  },
  {
    "id": "magic-fifth-wheel-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Fifth Wheel of Weyan",
      "pt": "Quinta Roda de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Affliction · Area · Affects Objects · Progressive · Increased Duration · Instant Recovery · Limited Degree",
      "pt": "Aflição · Área · Afeta Objetos · Progressivo · Duração Aumentada · Recuperação Instantânea · Graus Limitados"
    },
    "page": 113,
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
            "modifierId": "affects_objects",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "increased_duration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "instant_recovery",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited_degree",
            "ranks": 2,
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
      "Magic"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Incapacitated), Affects Objects, Progressive, Sustained, Instant Recovery, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "requiresCharacterChanges": {
      "en": "Reference only: Sustained Affliction is not represented; the preview is only its Concentration step.",
      "pt": "Apenas referência: Aflição Sustentada não é representada; a prévia mostra apenas a etapa de Concentração."
    },
    "sourceFormula": "Burst Area Affliction (Incapacitated), Affects Objects, Progressive, Sustained, Instant Recovery, Limited Degree"
  },
  {
    "id": "magic-sixth-wheel-of-weyan",
    "profileId": "magic",
    "name": {
      "en": "Sixth Wheel of Weyan",
      "pt": "Sexta Roda de Weyan"
    },
    "section": {
      "en": "Standard spells",
      "pt": "Feitiços padrão"
    },
    "summary": {
      "en": "Communication",
      "pt": "Comunicação"
    },
    "page": 113,
    "components": [
      {
        "effectId": "communication",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Magic"
    ],
    "audit": {
      "formula": "Communication (air and auditory) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Communication (air and auditory)"
  }
] satisfies PowerTemplate[];
