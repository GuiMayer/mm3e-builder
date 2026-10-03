import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "tech-animate-machines",
    "profileId": "tech",
    "name": {
      "en": "Animate Machines",
      "pt": "Animar Máquinas"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Summon · Controlled · Variable Type (General) · Self-Powered",
      "pt": "Invocar · Controlado · Variable Type (General) · Deslocamento Próprio"
    },
    "page": 193,
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
            "modifierId": "variable_type_general",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "self_powered",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Summon Animated Object, Controlled, General Type (Machines), Self-Powered (see Summoning Powers section) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Summon Animated Object, Controlled, General Type (Machines), Self-Powered (see Summoning Powers section)"
  },
  {
    "id": "tech-control-technology",
    "profileId": "tech",
    "name": {
      "en": "Control Technology",
      "pt": "Controlar Tecnologia"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited Degree · Affects Objects · Limited",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Graus Limitados · Afeta Objetos · Limitado"
    },
    "page": 193,
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
            "modifierId": "affects_objects",
            "ranks": 1,
            "options": {
              "affectsOnlyObjects": true
            },
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
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Controlled; Resisted by Fortitude, Overcome by skill or Fortitude), Limited to third degree only, Affects Objects Only, Limited to Technology • 2 point per rank",
      "fixed": 0,
      "perRank": 2,
      "discrepancy": {
        "reason": {
          "en": "Affliction 1 + Perception 2 + Cumulative 1 - third-degree only 2 - technology only 1 = 1/rank. Affects Only Objects costs +0.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 0 PP fixos + 1 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 0,
        "perRank": 1
      }
    },
    "sourceFormula": "Perception Ranged Cumulative Affliction (Controlled; Resisted by Fortitude, Overcome by skill or Fortitude), Limited to third degree only, Affects Objects Only, Limited to Technology"
  },
  {
    "id": "tech-deactivate-technology",
    "profileId": "tech",
    "name": {
      "en": "Deactivate Technology",
      "pt": "Desativar Tecnologia"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Nullify · Area · Broad · Simultaneous",
      "pt": "Anulação · Área · Amplo · Simultâneo"
    },
    "page": 193,
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
            "modifierId": "broad",
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
          "descriptor": "Technology"
        }
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Nullify Technology, Burst Area (30- foot radius), Broad (Technological), Simultaneous • 4 points",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Nullify Technology, Burst Area (30- foot radius), Broad (Technological), Simultaneous"
  },
  {
    "id": "tech-disassemble",
    "profileId": "tech",
    "name": {
      "en": "Disassemble",
      "pt": "Desmontar"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Transform · Increased Range · Continuous",
      "pt": "Transformação · Alcance Aumentado · Contínuo"
    },
    "page": 193,
    "components": [
      {
        "effectId": "transform",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "continuous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "variableCostOption": "One to one (e.g. metal to wood)"
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Ranged Continuous Transform (assembled to disassembled) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Ranged Continuous Transform (assembled to disassembled)"
  },
  {
    "id": "tech-machine-body",
    "profileId": "tech",
    "name": {
      "en": "Machine Body",
      "pt": "Corpo de Máquina"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 193,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Immunity 30 (Fortitude effects) • 30 points",
      "fixed": 30,
      "perRank": 0
    },
    "sourceFormula": "Immunity 30 (Fortitude effects)"
  },
  {
    "id": "tech-construct-body",
    "profileId": "tech",
    "name": {
      "en": "Construct Body",
      "pt": "Corpo de Construto"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 194,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Construct • 0 points",
      "fixed": 0,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "The 0-point construct package also removes character abilities; the powers alone cost 30.",
          "pt": "O preço impresso e a composição indicada no livro divergem. A receita mantém os efeitos e modificadores indicados; seu cálculo corresponde a 30 PP fixos + 0 PP por graduação, com o arredondamento normal. Não há ajuste artificial no total. Consulte a composição original abaixo e a auditoria do catálogo para os detalhes."
        },
        "fixed": 30,
        "perRank": 0
      }
    },
    "requiresCharacterChanges": {
      "en": "Reference only: a construct changes absent character abilities, beyond the power model. Configure the character separately.",
      "pt": "Apenas referência: um construto muda atributos ausentes do personagem, fora do modelo de poder. Configure o personagem separadamente."
    },
    "sourceFormula": "Construct"
  },
  {
    "id": "tech-machine-mind",
    "profileId": "tech",
    "name": {
      "en": "Machine Mind",
      "pt": "Mente de Máquina"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 194,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Immunity 10 (mental powers) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (mental powers)"
  },
  {
    "id": "tech-cyberspace",
    "profileId": "tech",
    "name": {
      "en": "Cyberspace",
      "pt": "Ciberespaço"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 194,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Dimensional Travel: Cyberspace"
        }
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Movement 1 (Dimensional Travel, Cyberspace) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Movement 1 (Dimensional Travel, Cyberspace)"
  },
  {
    "id": "tech-network-jump",
    "profileId": "tech",
    "name": {
      "en": "Network Jump",
      "pt": "Salto de Rede"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Extended · Medium",
      "pt": "Teleporte · Preciso · Estendido · Meio"
    },
    "page": 194,
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
            "modifierId": "medium",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Extended, Medium (Networks) • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Teleport, Accurate, Extended, Medium (Networks)"
  },
  {
    "id": "tech-transport-platform",
    "profileId": "tech",
    "name": {
      "en": "Transport Platform",
      "pt": "Plataforma de Transporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform · Quirk",
      "pt": "Voo · Platform · Peculiaridade"
    },
    "page": 194,
    "components": [
      {
        "effectId": "flight",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "platform",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Transport Platform",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Flight, Platform, Quirk: Requires available technology or machine parts (–1 point)"
  },
  {
    "id": "tech-assemble",
    "profileId": "tech",
    "name": {
      "en": "Assemble",
      "pt": "Montar"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Transform · Increased Range · Continuous",
      "pt": "Transformação · Alcance Aumentado · Contínuo"
    },
    "page": 194,
    "components": [
      {
        "effectId": "transform",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "continuous",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "variableCostOption": "One to one (e.g. metal to wood)"
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Ranged Continuous Transform (parts into finished machine) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Ranged Continuous Transform (parts into finished machine)"
  },
  {
    "id": "tech-computer-mind",
    "profileId": "tech",
    "name": {
      "en": "Computer Mind",
      "pt": "Mente Computacional"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Quickness · Limited",
      "pt": "Traço Aprimorado · Rapidez · Limitado"
    },
    "page": 194,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Eidetic Memory"
        }
      },
      {
        "effectId": "quickness",
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
      "Tech"
    ],
    "audit": {
      "formula": "Enhanced Advantages (Eidetic Memory) plus Quickness, Limited to Mental Tasks • 1 point + 1 point",
      "fixed": 1,
      "perRank": 0.5
    },
    "sourceFormula": "Enhanced Advantages (Eidetic Memory) plus Quickness, Limited to Mental Tasks"
  },
  {
    "id": "tech-interface",
    "profileId": "tech",
    "name": {
      "en": "Interface",
      "pt": "Interface"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Comprehend",
      "pt": "Compreensão"
    },
    "page": 195,
    "components": [
      {
        "effectId": "comprehend",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Comprehend Machines 2 • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Comprehend Machines 2"
  },
  {
    "id": "tech-manipulate-technology",
    "profileId": "tech",
    "name": {
      "en": "Manipulate Technology",
      "pt": "Manipular Tecnologia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Perception · Precise · Limited",
      "pt": "Mover Objetos · Percepção · Preciso · Limitado"
    },
    "page": 195,
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
            "modifierId": "precise",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Perception Ranged Move Object 1, Precise, Limited to Operating Machines • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Perception Ranged Move Object 1, Precise, Limited to Operating Machines"
  },
  {
    "id": "tech-sensor-masking",
    "profileId": "tech",
    "name": {
      "en": "Sensor Masking",
      "pt": "Mascarar Sensores"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Limited",
      "pt": "Camuflagem · Limitado"
    },
    "page": 195,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "limited",
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
      "Tech"
    ],
    "audit": {
      "formula": "Concealment 10 (All Senses), Limited to Technology • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Concealment 10 (All Senses), Limited to Technology"
  },
  {
    "id": "tech-sensor-network",
    "profileId": "tech",
    "name": {
      "en": "Sensor Network",
      "pt": "Rede de Sensores"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Limited",
      "pt": "Sensoriamento Remoto · Limitado"
    },
    "page": 195,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Three sense types"
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Remote Sensing (Visual and Auditory), Limited to Technological Sensors • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing (Visual and Auditory), Limited to Technological Sensors"
  },
  {
    "id": "tech-technomorph",
    "profileId": "tech",
    "name": {
      "en": "Technomorph",
      "pt": "Tecnomorfo"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Variable · Increased Duration · Action",
      "pt": "Variável · Duração Aumentada · Ação"
    },
    "page": 195,
    "components": [
      {
        "effectId": "variable",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "increased_duration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "action_variable",
            "ranks": 1,
            "options": {
              "subtypeId": "move"
            },
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Variable (Tech Powers), Continuous Duration, Move Action • 9 points per rank",
      "fixed": 0,
      "perRank": 9
    },
    "sourceFormula": "Variable (Tech Powers), Continuous Duration, Move Action"
  },
  {
    "id": "tech-tech-savant",
    "profileId": "tech",
    "name": {
      "en": "Tech Savant",
      "pt": "Especialista em Tecnologia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 195,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Skill",
        "fieldValues": {
          "trait": "Technology"
        },
        "rankMultiplier": 2
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Enhanced Skill (Technology) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Skill (Technology)"
  },
  {
    "id": "tech-tech-genius",
    "profileId": "tech",
    "name": {
      "en": "Tech Genius",
      "pt": "Gênio Tecnológico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 195,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Inventor"
        }
      }
    ],
    "descriptors": [
      "Tech"
    ],
    "audit": {
      "formula": "Enhanced Advantage (Inventor) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Advantage (Inventor)"
  }
] satisfies PowerTemplate[];
