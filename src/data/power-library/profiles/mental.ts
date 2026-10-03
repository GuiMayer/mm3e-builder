import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "mental-emotion-control",
    "profileId": "mental",
    "name": {
      "en": "Emotion Control",
      "pt": "Controle Emocional"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Subtle · Variable Descriptor",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Sutil · Descritor Variável"
    },
    "page": 128,
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
            "modifierId": "subtle",
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
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Impaired, Disabled, Incapacitated), Resisted and Overcome by Will, Subtle, Variable Descriptor (Emotions) • 2 points + 4",
      "fixed": 2,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Impaired, Disabled, Incapacitated), Resisted and Overcome by Will, Subtle, Variable Descriptor (Emotions)"
  },
  {
    "id": "mental-hallucination",
    "profileId": "mental",
    "name": {
      "en": "Hallucination",
      "pt": "Alucinação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Illusion · Selective · Limited to One Subject · Resistible",
      "pt": "Ilusão · Seletivo · Limited to One Subject · Resistível"
    },
    "page": 128,
    "components": [
      {
        "effectId": "illusion",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "selective",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_one_subject",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "resistible",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "All sense types"
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Illusion (All Senses), Selective, Limited to One Subject, Resistible by Will • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Illusion (All Senses), Selective, Limited to One Subject, Resistible by Will"
  },
  {
    "id": "mental-mental-blast",
    "profileId": "mental",
    "name": {
      "en": "Mental Blast",
      "pt": "Rajada Mental"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Alternate Resistance · Subtle",
      "pt": "Dano · Alcance Aumentado · Resistência Alternativa · Sutil"
    },
    "page": 128,
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
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Damage, Alternate Resistance (Will), Subtle • 1 point + 4 points per rank",
      "fixed": 1,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Damage, Alternate Resistance (Will), Subtle"
  },
  {
    "id": "mental-mind-control",
    "profileId": "mental",
    "name": {
      "en": "Mind Control",
      "pt": "Controle Mental"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Subtle",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Sutil"
    },
    "page": 129,
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
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Dazed, Compelled, Controlled), Resisted and Overcome by Will, Subtle • 1 point + 4 points per rank",
      "fixed": 1,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Dazed, Compelled, Controlled), Resisted and Overcome by Will, Subtle"
  },
  {
    "id": "mental-mind-switch",
    "profileId": "mental",
    "name": {
      "en": "Mind Switch",
      "pt": "Troca de Mentes"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Insidious · Subtle · Limited Degree · Side Effect",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Insidioso · Sutil · Graus Limitados · Efeito Colateral"
    },
    "page": 129,
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
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_degree",
            "ranks": 2,
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Transformed), Resisted and Overcome by Will, Insidious, Subtle, Limited Degree (Third Only), Side Effect (Target’s mind controls your body) • 2 points + 2 points per rank",
      "fixed": 2,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Third-degree only is -2/rank; Side Effect -1. The stated composition is 1 PP/rank plus 2 flat.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 2 PP fixos + 1 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 2,
        "perRank": 1
      }
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Transformed), Resisted and Overcome by Will, Insidious, Subtle, Limited Degree (Third Only), Side Effect (Target’s mind controls your body)"
  },
  {
    "id": "mental-possession",
    "profileId": "mental",
    "name": {
      "en": "Possession",
      "pt": "Possessão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Merge with Subject · Subtle",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Fundir-se ao Alvo · Sutil"
    },
    "page": 129,
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
            "modifierId": "merge_with_subject",
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
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Dazed,Compelled, Controlled), Resisted and Overcome by Will,Extra: merge with subject, Subtle • 1 point + 5 points per rank",
      "fixed": 1,
      "perRank": 5
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Dazed,Compelled, Controlled), Resisted and Overcome by Will,Extra: merge with subject, Subtle"
  },
  {
    "id": "mental-psychic-vampirism",
    "profileId": "mental",
    "name": {
      "en": "Psychic Vampirism",
      "pt": "Vampirismo Psíquico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Subtle · Linked · Healing · Energizing · Subtle · Limited",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Sutil · Vinculado · Cura · Energizing · Sutil · Limitado"
    },
    "page": 129,
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
            "modifierId": "subtle",
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
          "resistance": "will"
        }
      },
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
            "modifierId": "subtle",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Fatigued, Exhausted, Incapacitated), Resisted and Overcome by Will, Subtle, Linked to Healing, Subtle, Limited (Energizing Only), Limited (Self Only) • 2 points + 4 points",
      "fixed": 2,
      "perRank": 4,
      "discrepancy": {
        "reason": {
          "en": "Healing limited to Energizing must include Energizing; Healing 2 + Energizing 1 - two Limits 2 adds 1/rank to the 4/rank Affliction.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 2 PP fixos + 5 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 2,
        "perRank": 5
      }
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Fatigued, Exhausted, Incapacitated), Resisted and Overcome by Will, Subtle, Linked to Healing, Subtle, Limited (Energizing Only), Limited (Self Only)"
  },
  {
    "id": "mental-psychic-weapon",
    "profileId": "mental",
    "name": {
      "en": "Psychic Weapon",
      "pt": "Arma Psíquica"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Alternate Resistance",
      "pt": "Dano · Resistência Alternativa"
    },
    "page": 129,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "will",
              "alternateResistanceCost": "advantageous"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Damage, Alternate Resistance (Will) • 2",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Damage, Alternate Resistance (Will)"
  },
  {
    "id": "mental-mental-invisibility",
    "profileId": "mental",
    "name": {
      "en": "Mental Invisibility",
      "pt": "Invisibilidade Mental"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Limited · Resistible",
      "pt": "Camuflagem · Limitado · Resistível"
    },
    "page": 129,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          },
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
      "Mental"
    ],
    "audit": {
      "formula": "Concealment 10 (All Senses), Limited to Minds, Resistible by Will (DC 20) • 5 points +1 point per +1 to",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Concealment 10 (All Senses), Limited to Minds, Resistible by Will (DC 20)"
  },
  {
    "id": "mental-mind-shield",
    "profileId": "mental",
    "name": {
      "en": "Mind Shield",
      "pt": "Escudo Mental"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Impervious · Limited",
      "pt": "Traço Aprimorado · Impenetrável · Limitado"
    },
    "page": 129,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "impervious",
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
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Will"
        }
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Enhanced Defense (Will), Impervious, Limited to Mental Powers, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Defense (Will), Impervious, Limited to Mental Powers, Sustained"
  },
  {
    "id": "mental-mind-trap",
    "profileId": "mental",
    "name": {
      "en": "Mind Trap",
      "pt": "Armadilha Mental"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Alternate Resistance · Reaction · Subtle · Limited",
      "pt": "Dano · Alcance Aumentado · Resistência Alternativa · Reação · Sutil · Limitado"
    },
    "page": 129,
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
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
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
        "scalable": true
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Perception Ranged Damage, Alternate Resistance (Will), Reaction (When you make a Will resistance check against a mental power), Subtle, Limited to the source of the mental power • 1 point + 6 points per rank",
      "fixed": 1,
      "perRank": 6
    },
    "sourceFormula": "Perception Ranged Damage, Alternate Resistance (Will), Reaction (When you make a Will resistance check against a mental power), Subtle, Limited to the source of the mental power"
  },
  {
    "id": "mental-predictive-defense",
    "profileId": "mental",
    "name": {
      "en": "Predictive Defense",
      "pt": "Defesa Preditiva"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Quirk · Enhanced Trait · Quirk — Paired defense purchase, 2 PP each; starts at required two pairs.",
      "pt": "Traço Aprimorado · Peculiaridade · Traço Aprimorado · Peculiaridade — Compra pareada de defesas, 2 PP cada; inicia nos dois pares necessários."
    },
    "page": 129,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Dodge"
        }
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Parry"
        }
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Enhanced Defenses (Dodge and Parry), Quirk (not against opponents Immune to Mental Powers, –2 points) • 2 points for the first 2 ranks, +2 points per additional rank",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Defenses (Dodge and Parry), Quirk (not against opponents Immune to Mental Powers, –2 points)"
  },
  {
    "id": "mental-astral-projection",
    "profileId": "mental",
    "name": {
      "en": "Astral Projection",
      "pt": "Projeção Astral"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Side Effect",
      "pt": "Sensoriamento Remoto · Efeito Colateral"
    },
    "page": 130,
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
          }
        ],
        "scalable": true,
        "variableCostOption": "Four sense types"
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual, Aural, and Mental), Side-Effect (physical body is defenseless and immobile, –2) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing (Visual, Aural, and Mental), Side-Effect (physical body is defenseless and immobile, –2)"
  },
  {
    "id": "mental-aura-reading",
    "profileId": "mental",
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
    "page": 130,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Visual",
            "detail": "Emotional and physical state"
          },
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Visual"
          },
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Emotional and physical state"
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
      "Mental"
    ],
    "audit": {
      "formula": "Senses 3 (Detect Emotional and Physical State, Ranged), visual and mental • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Senses 3 (Detect Emotional and Physical State, Ranged), visual and mental"
  },
  {
    "id": "mental-clairvoyance",
    "profileId": "mental",
    "name": {
      "en": "Clairvoyance",
      "pt": "Clarividência"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 130,
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
      "Mental"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing (Visual)"
  },
  {
    "id": "mental-clairaudience",
    "profileId": "mental",
    "name": {
      "en": "Clairaudience",
      "pt": "Clariaudiência"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 130,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "One sense type"
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Remote Sensing (Auditory) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Remote Sensing (Auditory)"
  },
  {
    "id": "mental-clairsentience",
    "profileId": "mental",
    "name": {
      "en": "Clairsentience",
      "pt": "Clarissenciência"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing",
      "pt": "Sensoriamento Remoto"
    },
    "page": 130,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "All sense types"
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Remote Sensing (All Senses) • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Remote Sensing (All Senses)"
  },
  {
    "id": "mental-empathy",
    "profileId": "mental",
    "name": {
      "en": "Empathy",
      "pt": "Empatia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 130,
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
            "detail": "Emotion"
          },
          {
            "id": "acute",
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
      "Mental"
    ],
    "audit": {
      "formula": "Senses 3 (Detect Emotion, Acute, Ranged) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Senses 3 (Detect Emotion, Acute, Ranged)"
  },
  {
    "id": "mental-knowledge-transplant",
    "profileId": "mental",
    "name": {
      "en": "Knowledge Transplant",
      "pt": "Transplante de Conhecimento"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Affects Others · Action · Limited · Increased Range · Sense-Dependent",
      "pt": "Variável · Afeta Outros · Ação · Limitado · Alcance Aumentado · Dependente de Sentido"
    },
    "page": 130,
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
          },
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "sense_dependent",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Variable (Enhanced Skills and Languages), Affects Others, Free Action, Limited to Intellect skills, Limited to subject’s skill rank, Perception Range, Sense- Dependent (mental contact with subjects) • 9 points per rank",
      "fixed": 0,
      "perRank": 9
    },
    "sourceFormula": "Variable (Enhanced Skills and Languages), Affects Others, Free Action, Limited to Intellect skills, Limited to subject’s skill rank, Perception Range, Sense- Dependent (mental contact with subjects)"
  },
  {
    "id": "mental-mental-communication",
    "profileId": "mental",
    "name": {
      "en": "Mental Communication",
      "pt": "Comunicação Mental"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Communication",
      "pt": "Comunicação"
    },
    "page": 130,
    "components": [
      {
        "effectId": "communication",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Communication (Mental) • 4 points",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Communication (Mental)"
  },
  {
    "id": "mental-mental-awareness",
    "profileId": "mental",
    "name": {
      "en": "Mental Awareness",
      "pt": "Consciência Mental"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 130,
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
            "detail": "Mental powers"
          }
        ]
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Senses 1 (Awareness, Mental) • 1 point",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Awareness, Mental)"
  },
  {
    "id": "mental-mental-detection",
    "profileId": "mental",
    "name": {
      "en": "Mental Detection",
      "pt": "Detecção Mental"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 131,
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
            "detail": "Minds"
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
          },
          {
            "id": "accurate",
            "ranks": 2,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Senses 5 (Detect Minds, Ranged, Acute, Accurate) • 5 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Senses 5 (Detect Minds, Ranged, Acute, Accurate)"
  },
  {
    "id": "mental-mind-reading",
    "profileId": "mental",
    "name": {
      "en": "Mind Reading",
      "pt": "Leitura Mental"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Mind Reading",
      "pt": "Leitura Mental"
    },
    "page": 131,
    "components": [
      {
        "effectId": "mind-reading",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Mind Reading • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Mind Reading"
  },
  {
    "id": "mental-sensory-link",
    "profileId": "mental",
    "name": {
      "en": "Sensory Link",
      "pt": "Vínculo Sensorial"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Limited · Sense-Dependent",
      "pt": "Sensoriamento Remoto · Limitado · Dependente de Sentido"
    },
    "page": 131,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "sense_dependent",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "All sense types"
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Remote Sensing (All Senses), Limited to Subjects of Mental Communication or Mind Reading, Sense Dependent • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Remote Sensing (All Senses), Limited to Subjects of Mental Communication or Mind Reading, Sense Dependent"
  },
  {
    "id": "mental-telepathic-translation",
    "profileId": "mental",
    "name": {
      "en": "Telepathic Translation",
      "pt": "Tradução Telepática"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend · Affects Others · Area",
      "pt": "Compreensão · Afeta Outros · Área"
    },
    "page": 131,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "affects_others",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Perception",
            "options": {
              "includesSenseDependent": true
            },
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Mental"
    ],
    "audit": {
      "formula": "Comprehend 3 (Languages), Affects Others, Perception Area (Hearing) • 12 points",
      "fixed": 12,
      "perRank": 0
    },
    "sourceFormula": "Comprehend 3 (Languages), Affects Others, Perception Area (Hearing)"
  }
] satisfies PowerTemplate[];
