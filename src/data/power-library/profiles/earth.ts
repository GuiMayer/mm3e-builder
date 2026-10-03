import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "earth-chasm",
    "profileId": "earth",
    "name": {
      "en": "Chasm",
      "pt": "Abismo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Increased Range · Instant Recovery · Limited Degree · Linked · Burrowing · Area · Attack · Limited · Linked · Damage · Area · Increased Range · Limited — Affliction: Dazed, Prone; downward burrowing; damage only targets affected by second degree.",
      "pt": "Aflição · Área · Alcance Aumentado · Recuperação Instantânea · Graus Limitados · Vinculado · Escavação · Área · Ataque · Limitado · Vinculado · Dano · Área · Alcance Aumentado · Limitado — Aflição: Atordoado, Prostrado; escavação para baixo; dano apenas em alvos afetados pelo segundo grau."
    },
    "page": 53,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
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
          "resistance": "dodge"
        }
      },
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
            "isPowerSpecific": false
          },
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
            "ranks": 1,
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
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
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
      "Earth"
    ],
    "audit": {
      "formula": "Line Area Ranged Affliction (Resisted by Dodge; Dazed, Prone), Instant Recovery (the Dazed and Prone conditions only last for a round), Limited Degree, Linked Line Area Burrowing Attack (Limited to downward), Linked to Line Area Ranged Damage, Limited to Targets Affected by Second Degree of Affliction • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Line Area Ranged Affliction (Resisted by Dodge; Dazed, Prone), Instant Recovery (the Dazed and Prone conditions only last for a round), Limited Degree, Linked Line Area Burrowing Attack (Limited to downward), Linked to Line Area Ranged Damage, Limited to Targets Affected by Second Degree of Affliction"
  },
  {
    "id": "earth-dust-storm",
    "profileId": "earth",
    "name": {
      "en": "Dust Storm",
      "pt": "Tempestade de Poeira"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 53,
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
      "Earth"
    ],
    "audit": {
      "formula": "Environment (–5 visibility) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (–5 visibility)"
  },
  {
    "id": "earth-earth-blast",
    "profileId": "earth",
    "name": {
      "en": "Earth Blast",
      "pt": "Rajada de Terra"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 53,
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
      "Earth"
    ],
    "audit": {
      "formula": "Ranged Damage (rock impact) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (rock impact)"
  },
  {
    "id": "earth-earthquake",
    "profileId": "earth",
    "name": {
      "en": "Earthquake",
      "pt": "Terremoto"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Area · Extra Condition · Secondary Effect · Limited Degree · Limited · Alternate Resistance — Dazed/Vulnerable, Stunned/Prone; only along ground, 120-foot radius.",
      "pt": "Aflição · Alcance Aumentado · Área · Condição Extra · Efeito Secundário · Graus Limitados · Limitado · Resistência Alternativa — Atordoado/Vulnerável, Aturdido/Prostrado; apenas pelo solo, raio de 36 m."
    },
    "page": 53,
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
            "ranks": 3,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "secondary_effect",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Earth"
    ],
    "audit": {
      "formula": "Ranged Burst Area 3 Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed and Vulnerable, Stunned and Prone), Extra Condition, Secondary Effect, Limited Degree, Limited to along the ground; 120-foot radius • 5 points per rank,",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Ranged Burst Area 3 Affliction (Resisted by Dodge, Overcome by Fortitude; Dazed and Vulnerable, Stunned and Prone), Extra Condition, Secondary Effect, Limited Degree, Limited to along the ground; 120-foot radius"
  },
  {
    "id": "earth-earth-spray",
    "profileId": "earth",
    "name": {
      "en": "Earth Spray",
      "pt": "Jato de Terra"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Limited — Vision Impaired, Disabled, Unaware.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Limitado — Visão Prejudicada, Debilitada, Inconsciente dos estímulos."
    },
    "page": 53,
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
      "Earth"
    ],
    "audit": {
      "formula": "Ranged Cumulative Affliction (Impaired, Disabled, Unaware), Limited to Vision • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Cumulative Affliction (Impaired, Disabled, Unaware), Limited to Vision"
  },
  {
    "id": "earth-spike-stones",
    "profileId": "earth",
    "name": {
      "en": "Spike Stones",
      "pt": "Pedras Pontiagudas"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Penetrating · Multiattack",
      "pt": "Dano · Alcance Aumentado · Penetrante · Ataque Múltiplo"
    },
    "page": 53,
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
            "modifierId": "penetrating",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "multiattack",
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
      "Earth"
    ],
    "audit": {
      "formula": "Ranged Penetrating Multiattack Damage • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Ranged Penetrating Multiattack Damage"
  },
  {
    "id": "earth-stone-grip",
    "profileId": "earth",
    "name": {
      "en": "Stone Grip",
      "pt": "Agarrão de Pedra"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance — Hindered/Vulnerable, Defenseless/Immobilized; overcome by Damage.",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido/Vulnerável, Indefeso/Imóvel; superado por Dano."
    },
    "page": 53,
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
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree"
  },
  {
    "id": "earth-stone-strike",
    "profileId": "earth",
    "name": {
      "en": "Stone Strike",
      "pt": "Golpe de Pedra"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Variable Descriptor",
      "pt": "Dano · Descritor Variável"
    },
    "page": 53,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Strength-based Damage, Variable (stone weapons) • 1 point + 1 point per rank",
      "fixed": 1,
      "perRank": 1
    },
    "sourceFormula": "Strength-based Damage, Variable (stone weapons)"
  },
  {
    "id": "earth-earth-healing",
    "profileId": "earth",
    "name": {
      "en": "Earth Healing",
      "pt": "Cura pela Terra"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration · Source",
      "pt": "Regeneração · Fonte"
    },
    "page": 53,
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
      "Earth"
    ],
    "audit": {
      "formula": "Regeneration, Source (Earth) • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Regeneration, Source (Earth)"
  },
  {
    "id": "earth-earth-immunity",
    "profileId": "earth",
    "name": {
      "en": "Earth Immunity",
      "pt": "Imunidade à Terra"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 53,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Immunity 10 (Earth Effects) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (Earth Effects)"
  },
  {
    "id": "earth-rock-armor",
    "profileId": "earth",
    "name": {
      "en": "Rock Armor",
      "pt": "Armadura Rochosa"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious",
      "pt": "Proteção · Impenetrável"
    },
    "page": 53,
    "components": [
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "impervious",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Impervious Protection • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Impervious Protection"
  },
  {
    "id": "earth-rooting",
    "profileId": "earth",
    "name": {
      "en": "Rooting",
      "pt": "Enraizamento"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Feature · Limited — Resists being moved; only touching ground.",
      "pt": "Característica · Limitado — Resiste a ser movido; apenas tocando o solo."
    },
    "page": 54,
    "components": [
      {
        "effectId": "feature",
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
      "Earth"
    ],
    "audit": {
      "formula": "Feature (Resistance to being moved), Limited to While Touching the Ground • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Feature (Resistance to being moved), Limited to While Touching the Ground"
  },
  {
    "id": "earth-immovable",
    "profileId": "earth",
    "name": {
      "en": "Immovable",
      "pt": "Imóvel"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Limited — Being moved; only touching ground.",
      "pt": "Imunidade · Limitado — Ser movido; apenas tocando o solo."
    },
    "page": 54,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
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
      "Earth"
    ],
    "audit": {
      "formula": "Immunity 10 (Being Moved), Limited to While Touching the Ground • 5 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (Being Moved), Limited to While Touching the Ground"
  },
  {
    "id": "earth-earth-meld",
    "profileId": "earth",
    "name": {
      "en": "Earth Meld",
      "pt": "Fusão com a Terra"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited · Immunity · Limited — Immunity to suffocation only while earth melding.",
      "pt": "Movimento · Limitado · Imunidade · Limitado — Imunidade a sufocamento apenas durante a fusão."
    },
    "page": 54,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Permeate: Earth"
        }
      },
      {
        "effectId": "immunity",
        "ranks": 2,
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
      "Earth"
    ],
    "audit": {
      "formula": "Movement 3 (Permeate), Limited to Earth; Immunity 2 (Suffocation), Limited to While Earth Melding • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Movement 3 (Permeate), Limited to Earth; Immunity 2 (Suffocation), Limited to While Earth Melding"
  },
  {
    "id": "earth-earth-wave",
    "profileId": "earth",
    "name": {
      "en": "Earth Wave",
      "pt": "Onda de Terra"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform · Limited — Within 60 feet of ground.",
      "pt": "Voo · Platform · Limitado — Até 18 m do solo."
    },
    "page": 54,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "platform",
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
      "Earth"
    ],
    "audit": {
      "formula": "Flight, Limited to within 60 feet (distance rank 1) of the ground, Platform • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Flight, Limited to within 60 feet (distance rank 1) of the ground, Platform"
  },
  {
    "id": "earth-flying-rock",
    "profileId": "earth",
    "name": {
      "en": "Flying Rock",
      "pt": "Rocha Voadora"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform",
      "pt": "Voo · Platform"
    },
    "page": 54,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "platform",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Flight, Platform • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Platform"
  },
  {
    "id": "earth-terraport",
    "profileId": "earth",
    "name": {
      "en": "Terraport",
      "pt": "Terraporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Medium",
      "pt": "Teleporte · Preciso · Meio"
    },
    "page": 54,
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
      "Earth"
    ],
    "audit": {
      "formula": "Teleport, Accurate, Medium (Earth) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport, Accurate, Medium (Earth)"
  },
  {
    "id": "earth-tunneling",
    "profileId": "earth",
    "name": {
      "en": "Tunneling",
      "pt": "Escavação"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 54,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Burrowing"
  },
  {
    "id": "earth-earth-creatures",
    "profileId": "earth",
    "name": {
      "en": "Earth Creatures",
      "pt": "Criaturas de Terra"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon — 60-point creature; build its traits separately.",
      "pt": "Invocar — Criatura de 60 pontos; crie seus atributos separadamente."
    },
    "page": 54,
    "components": [
      {
        "effectId": "summon",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Summon Earth Creature 4 • 60-point",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Summon Earth Creature 4"
  },
  {
    "id": "earth-earth-moving",
    "profileId": "earth",
    "name": {
      "en": "Earth Moving",
      "pt": "Mover Terra"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Perception · Limited",
      "pt": "Mover Objetos · Percepção · Limitado"
    },
    "page": 55,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Perception Ranged Move Object, Limited to Earth • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Perception Ranged Move Object, Limited to Earth"
  },
  {
    "id": "earth-stone-shape",
    "profileId": "earth",
    "name": {
      "en": "Stone Shape",
      "pt": "Moldar Pedra"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Transform",
      "pt": "Transformação"
    },
    "page": 55,
    "components": [
      {
        "effectId": "transform",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "One to one (e.g. metal to wood)"
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Transform (earth and stone From one shape to another) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Transform (earth and stone From one shape to another)"
  },
  {
    "id": "earth-earthsight",
    "profileId": "earth",
    "name": {
      "en": "Earthsight",
      "pt": "Visão da Terra"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited",
      "pt": "Sentidos · Limitado"
    },
    "page": 55,
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
            "id": "penetrates_concealment",
            "ranks": 4,
            "senseType": "Visual"
          }
        ]
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Senses 4 (Vision Penetrates Concealment), Limited to Earthen Materials • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses 4 (Vision Penetrates Concealment), Limited to Earthen Materials"
  },
  {
    "id": "earth-earthworks",
    "profileId": "earth",
    "name": {
      "en": "Earthworks",
      "pt": "Construções de Terra"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 55,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Create Earthworks • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Create Earthworks"
  },
  {
    "id": "earth-mountain-form",
    "profileId": "earth",
    "name": {
      "en": "Mountain Form",
      "pt": "Forma de Montanha"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Growth",
      "pt": "Crescimento"
    },
    "page": 55,
    "components": [
      {
        "effectId": "growth",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Growth • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Growth"
  },
  {
    "id": "earth-mud-form",
    "profileId": "earth",
    "name": {
      "en": "Mud Form",
      "pt": "Forma de Lama"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Insubstantial — Life support and fluid/particulate form.",
      "pt": "Imunidade · Insubstancial — Suporte vital e forma fluida/particulada."
    },
    "page": 55,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Immunity 10 (Life Support), Insubstantial 1 • 15 points per rank",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (Life Support), Insubstantial 1"
  },
  {
    "id": "earth-sand-form",
    "profileId": "earth",
    "name": {
      "en": "Sand Form",
      "pt": "Forma de Areia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity · Insubstantial — Life support and fluid/particulate form.",
      "pt": "Imunidade · Insubstancial — Suporte vital e forma fluida/particulada."
    },
    "page": 55,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Immunity 10 (Life Support), Insubstantial 1 • 15 points per rank",
      "fixed": 15,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (Life Support), Insubstantial 1"
  },
  {
    "id": "earth-stone-form",
    "profileId": "earth",
    "name": {
      "en": "Stone Form",
      "pt": "Forma de Pedra"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Immunity · Protection · Impervious",
      "pt": "Traço Aprimorado · Imunidade · Proteção · Impenetrável"
    },
    "page": 55,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      },
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      },
      {
        "effectId": "protection",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "impervious",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Enhanced Strength, Immunity 10 (Life Support), Impervious Protection • 10 points +4 points per rank",
      "fixed": 10,
      "perRank": 4
    },
    "sourceFormula": "Enhanced Strength, Immunity 10 (Life Support), Impervious Protection"
  },
  {
    "id": "earth-strength-of-antaeus",
    "profileId": "earth",
    "name": {
      "en": "Strength of Antaeus",
      "pt": "Força de Anteu"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Quirk — Starts at required rank 2; only touching ground. Higher ranks cost +2 each.",
      "pt": "Traço Aprimorado · Peculiaridade — Começa na graduação necessária 2; apenas tocando o solo. Graduações adicionais custam +2 cada."
    },
    "page": 55,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Enhanced Strength, Quirk (Only While Touching the Ground, –2 points) • 2 points for rank 2, +2 points per rank",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Strength, Quirk (Only While Touching the Ground, –2 points)"
  },
  {
    "id": "earth-tremorsense",
    "profileId": "earth",
    "name": {
      "en": "Tremorsense",
      "pt": "Sentido Sísmico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 55,
    "components": [
      {
        "effectId": "senses",
        "ranks": 1,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "ranged",
            "ranks": 1,
            "senseType": "Tactile"
          }
        ]
      }
    ],
    "descriptors": [
      "Earth"
    ],
    "audit": {
      "formula": "Senses 1 (Ranged Touch) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Ranged Touch)"
  }
] satisfies PowerTemplate[];
