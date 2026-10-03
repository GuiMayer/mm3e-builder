import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "summoning-animation",
    "profileId": "summoning",
    "name": {
      "en": "Animation",
      "pt": "Animar Objetos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Summon · Increased Range · Limited",
      "pt": "Invocar · Alcance Aumentado · Limitado"
    },
    "page": 182,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
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
      "Summoning"
    ],
    "audit": {
      "formula": "Perception Range Summon Animated Object, Limited to Available Objects • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Perception Range Summon Animated Object, Limited to Available Objects"
  },
  {
    "id": "summoning-constructs",
    "profileId": "summoning",
    "name": {
      "en": "Constructs",
      "pt": "Construtos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Summon · Increased Range · Variable Type (Broad) · Controlled",
      "pt": "Invocar · Alcance Aumentado · Variable Type (Broad) · Controlado"
    },
    "page": 182,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Summoning"
    ],
    "audit": {
      "formula": "Ranged Summon Construct, Broad Type, Controlled • 5 points per rank",
      "fixed": 0,
      "perRank": 5,
      "discrepancy": {
        "reason": {
          "en": "Summon 2 + Ranged 1 + Broad Type 2 + Controlled 1 = 6/rank, not printed 5.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 6 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 6
      }
    },
    "sourceFormula": "Ranged Summon Construct, Broad Type, Controlled"
  },
  {
    "id": "summoning-duplication",
    "profileId": "summoning",
    "name": {
      "en": "Duplication",
      "pt": "Duplicação"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Summon · Heroic",
      "pt": "Invocar · Heroico"
    },
    "page": 183,
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
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Duplicate, Heroic • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Summon Duplicate, Heroic"
  },
  {
    "id": "summoning-necromancy",
    "profileId": "summoning",
    "name": {
      "en": "Necromancy",
      "pt": "Necromancia"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Summon · Controlled · Horde · Multiple Minions (per effect rank)",
      "pt": "Invocar · Controlado · Horda · Múltiplos Lacaios (por graduação do efeito)"
    },
    "page": 183,
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
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Undead, Controlled, Horde, Multiple Minions (32 total) • 14 points per rank",
      "fixed": 0,
      "perRank": 14
    },
    "sourceFormula": "Summon Undead, Controlled, Horde, Multiple Minions (32 total)"
  },
  {
    "id": "summoning-swarm",
    "profileId": "summoning",
    "name": {
      "en": "Swarm",
      "pt": "Enxame"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Summon · Active · Controlled",
      "pt": "Invocar · Ativo · Controlado"
    },
    "page": 183,
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
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Swarm (Active, Controlled) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Summon Swarm (Active, Controlled)"
  },
  {
    "id": "summoning-decoys",
    "profileId": "summoning",
    "name": {
      "en": "Decoys",
      "pt": "Iscas"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Limited",
      "pt": "Camuflagem · Limitado"
    },
    "page": 183,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "limited",
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
      "Summoning"
    ],
    "audit": {
      "formula": "Concealment 4 (All Visual Senses), Limited to Decoy Images • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Concealment 4 (All Visual Senses), Limited to Decoy Images"
  },
  {
    "id": "summoning-sacrifice",
    "profileId": "summoning",
    "name": {
      "en": "Sacrifice",
      "pt": "Sacrifício"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 183,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Sacrifice on existing Summon"
        }
      }
    ],
    "descriptors": [
      "Summoning"
    ],
    "audit": {
      "formula": "Add Sacrifice modifier to Summon • 1 point.",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Add Sacrifice modifier to Summon"
  },
  {
    "id": "summoning-castling",
    "profileId": "summoning",
    "name": {
      "en": "Castling",
      "pt": "Roque"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Easy · Extended · Limited · Medium",
      "pt": "Teleporte · Preciso · Fácil · Estendido · Limitado · Meio"
    },
    "page": 184,
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
            "modifierId": "easy",
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
            "ranks": 2,
            "isPowerSpecific": false
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
      "Summoning"
    ],
    "audit": {
      "formula": "Teleport, Accurate (wherever duplicate is), Easy, Extended, Limited to Switching Places With Duplicate (–2), Medium (Duplicate) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport, Accurate (wherever duplicate is), Easy, Extended, Limited to Switching Places With Duplicate (–2), Medium (Duplicate)"
  },
  {
    "id": "summoning-duplicate-ladder",
    "profileId": "summoning",
    "name": {
      "en": "Duplicate Ladder",
      "pt": "Escada de Duplicatas"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 184,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Summoning"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Leaping"
  },
  {
    "id": "summoning-summon-steed",
    "profileId": "summoning",
    "name": {
      "en": "Summon Steed",
      "pt": "Invocar Montaria"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Summon · Increased Duration",
      "pt": "Invocar · Duração Aumentada"
    },
    "page": 184,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_duration",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Steed 1, Continuous • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Summon Steed 1, Continuous"
  },
  {
    "id": "summoning-summon-vehicle",
    "profileId": "summoning",
    "name": {
      "en": "Summon Vehicle",
      "pt": "Invocar Veículo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Summon · Controlled",
      "pt": "Invocar · Controlado"
    },
    "page": 184,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
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
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Vehicle",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Summon Vehicle, Controlled"
  },
  {
    "id": "summoning-anatomic-split",
    "profileId": "summoning",
    "name": {
      "en": "Anatomic Split",
      "pt": "Divisão Anatômica"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Controlled · Mental Link · Multiple Minions (per effect rank) · Side Effect",
      "pt": "Invocar · Controlado · Mental Link · Múltiplos Lacaios (por graduação do efeito) · Efeito Colateral"
    },
    "page": 184,
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
            "modifierId": "mental_link",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "multiple_minions_ranked",
            "ranks": 3,
            "isPowerSpecific": true
          },
          {
            "modifierId": "side_effect",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Body Part, Controlled, Mental Link, Multiple Minions 3, Side-Effect (Lose use of the separated part) • 1 point + 8 points per rank",
      "fixed": 1,
      "perRank": 8
    },
    "sourceFormula": "Summon Body Part, Controlled, Mental Link, Multiple Minions 3, Side-Effect (Lose use of the separated part)"
  },
  {
    "id": "summoning-combine",
    "profileId": "summoning",
    "name": {
      "en": "Combine",
      "pt": "Combinar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Heroic · Feedback · Limited",
      "pt": "Invocar · Heroico · Retroalimentação · Limitado"
    },
    "page": 184,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "heroic",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "feedback",
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
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Combined Form, Heroic, Feedback, Limited (requires all components be present), Limited (components vanish while combined form is present) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Summon Combined Form, Heroic, Feedback, Limited (requires all components be present), Limited (components vanish while combined form is present)"
  },
  {
    "id": "summoning-empower",
    "profileId": "summoning",
    "name": {
      "en": "Empower",
      "pt": "Conceder Poder"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Variable Type (General) · Limited",
      "pt": "Invocar · Variable Type (General) · Limitado"
    },
    "page": 185,
    "components": [
      {
        "effectId": "summon",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_type_general",
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
      "Summoning"
    ],
    "audit": {
      "formula": "Summon Empowered Version, General Type, Limited to Available Subjects • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Summon Empowered Version, General Type, Limited to Available Subjects"
  }
] satisfies PowerTemplate[];
