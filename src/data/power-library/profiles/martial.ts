import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "martial-analyze-style",
    "profileId": "martial",
    "name": {
      "en": "Analyze Style",
      "pt": "Analisar Estilo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Limited · Limited Degree · Insidious · Subtle",
      "pt": "Aflição · Alcance Aumentado · Limitado · Graus Limitados · Insidioso · Sutil"
    },
    "page": 121,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_degree",
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Vulnerable, Defenseless), Conditions Limited to Your Attacks, Limited Degree, Insidious, Subtle • 2",
      "fixed": 2,
      "perRank": 1
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Vulnerable, Defenseless), Conditions Limited to Your Attacks, Limited Degree, Insidious, Subtle"
  },
  {
    "id": "martial-berserker-rage",
    "profileId": "martial",
    "name": {
      "en": "Berserker Rage",
      "pt": "Fúria Berserker"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Feature · Quirk — Feature grants Fearless; -1 active defenses.",
      "pt": "Traço Aprimorado · Característica · Peculiaridade — Característica concede Destemido; -1 nas defesas ativas."
    },
    "page": 121,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "feature",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "quirk",
            "ranks": 2,
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
      "Martial"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Fearless), Enhanced Strength, Sustained, Quirk (–1 to active defenses, –2 points) • 1 point +2 points per additional Strength rank",
      "fixed": -1,
      "perRank": 2
    },
    "sourceFormula": "Enhanced Advantage 1 (Fearless), Enhanced Strength, Sustained, Quirk (–1 to active defenses, –2 points)"
  },
  {
    "id": "martial-breaking-blow",
    "profileId": "martial",
    "name": {
      "en": "Breaking Blow",
      "pt": "Golpe Quebrador"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Penetrating · Limited — Adds Penetrating 2 to existing Strength damage; objects only. +1 per further Penetrating rank.",
      "pt": "Dano · Penetrante · Limitado — Acrescenta Penetrante 2 ao dano de Força existente; apenas objetos. +1 por graduação adicional de Penetrante."
    },
    "page": 121,
    "components": [
      {
        "effectId": "damage",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "penetrating",
            "ranks": 2,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Strength-based Damage, Penetrating, Limited to Objects, Activation (move action, –1 point) • 1",
      "fixed": 1,
      "perRank": 0
    },
    "activation": "move",
    "sourceFormula": "Strength-based Damage, Penetrating, Limited to Objects, Activation (move action, –1 point)"
  },
  {
    "id": "martial-chi-strike",
    "profileId": "martial",
    "name": {
      "en": "Chi Strike",
      "pt": "Golpe de Chi"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 122,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Strength-based Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Strength-based Damage"
  },
  {
    "id": "martial-dim-mak",
    "profileId": "martial",
    "name": {
      "en": "Dim Mak",
      "pt": "Dim Mak"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Extra Condition · Progressive · Reversible",
      "pt": "Aflição · Condição Extra · Progressivo · Reversível"
    },
    "page": 122,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "progressive",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "reversible",
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
      "Martial"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Fatigued and Impaired, Disabled and Exhausted, Incapacitated), Extra Condition, Progressive, Reversible •1 point + 4 points per rank",
      "fixed": 1,
      "perRank": 4
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Fortitude; Fatigued and Impaired, Disabled and Exhausted, Incapacitated), Extra Condition, Progressive, Reversible"
  },
  {
    "id": "martial-ear-boxing",
    "profileId": "martial",
    "name": {
      "en": "Ear Boxing",
      "pt": "Golpe nos Ouvidos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Extra Condition · Limited Degree",
      "pt": "Aflição · Condição Extra · Graus Limitados"
    },
    "page": 122,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "limited_degree",
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
      "Martial"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Will; Dazed and Impaired, Disabled and Stunned), Extra Condition, Limited Degree • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Will; Dazed and Impaired, Disabled and Stunned), Extra Condition, Limited Degree"
  },
  {
    "id": "martial-ghost-fighting-1",
    "profileId": "martial",
    "name": {
      "en": "Ghost Fighting — 1",
      "pt": "Combate Fantasma — 1"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Affects Insubstantial",
      "pt": "Dano · Afeta Insubstanciais"
    },
    "page": 122,
    "components": [
      {
        "effectId": "damage",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "affects_insubstantial",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Strength Damage Affects Insubstantial • 1 point (half Damage rank) or 2 points (full Damage rank).",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Strength Damage Affects Insubstantial"
  },
  {
    "id": "martial-ghost-fighting-2",
    "profileId": "martial",
    "name": {
      "en": "Ghost Fighting — 2",
      "pt": "Combate Fantasma — 2"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Affects Insubstantial",
      "pt": "Dano · Afeta Insubstanciais"
    },
    "page": 122,
    "components": [
      {
        "effectId": "damage",
        "ranks": 0,
        "modifiers": [
          {
            "modifierId": "affects_insubstantial",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "damageBasis": "strength-based"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Strength Damage Affects Insubstantial • 1 point (half Damage rank) or 2 points (full Damage rank).",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Strength Damage Affects Insubstantial"
  },
  {
    "id": "martial-kiai-shout",
    "profileId": "martial",
    "name": {
      "en": "Kiai Shout",
      "pt": "Grito Kiai"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Extra Condition · Sense-Dependent · Limited Degree",
      "pt": "Aflição · Área · Condição Extra · Dependente de Sentido · Graus Limitados"
    },
    "page": 122,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Cone",
            "isPowerSpecific": false
          },
          {
            "modifierId": "extra_condition",
            "ranks": 1,
            "isPowerSpecific": true
          },
          {
            "modifierId": "sense_dependent",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited_degree",
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
      "Martial"
    ],
    "audit": {
      "formula": "Cone Area Affliction (Resisted and Overcome by Will; Dazed and Vulnerable, Stunned and Defenseless), Extra Condition, Hearing-Dependent, Limited Degree • 1 point",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Cone Area Affliction (Resisted and Overcome by Will; Dazed and Vulnerable, Stunned and Defenseless), Extra Condition, Hearing-Dependent, Limited Degree"
  },
  {
    "id": "martial-natural-fighter",
    "profileId": "martial",
    "name": {
      "en": "Natural Fighter",
      "pt": "Lutador Natural"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 122,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Advantage"
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Enhanced Advantage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Advantage"
  },
  {
    "id": "martial-catfall",
    "profileId": "martial",
    "name": {
      "en": "Catfall",
      "pt": "Queda Felina"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Movement · Limited",
      "pt": "Traço Aprimorado · Movimento · Limitado"
    },
    "page": 122,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Instant Up"
        }
      },
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Safe Fall"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Instant Up), Movement 1 (Safe Fall), Limited to distance rank 0 • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Enhanced Advantage 1 (Instant Up), Movement 1 (Safe Fall), Limited to distance rank 0"
  },
  {
    "id": "martial-counterstrike",
    "profileId": "martial",
    "name": {
      "en": "Counterstrike",
      "pt": "Contra-ataque"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Reaction · Attack Check Required",
      "pt": "Dano · Reação · Exige Teste de Ataque"
    },
    "page": 122,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "attack_check_required",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Reaction Damage (when attacked in close combat), Attack Check Required • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Reaction Damage (when attacked in close combat), Attack Check Required"
  },
  {
    "id": "martial-deflecting-projectile",
    "profileId": "martial",
    "name": {
      "en": "Deflecting Projectile",
      "pt": "Projétil Defletor"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Deflect · Quirk — Needs a projectile/throwing weapon; base starts at 1 PP.",
      "pt": "Deflexão · Peculiaridade — Exige projétil/arma de arremesso; custo mínimo de 1 PP."
    },
    "page": 122,
    "components": [
      {
        "effectId": "deflect",
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
      "Martial"
    ],
    "audit": {
      "formula": "Deflect, Quirk (requires a projectile or throwing weapon, –1 point) • 1 point for rank 2, +1 point per additional rank",
      "fixed": -1,
      "perRank": 1,
      "samples": [
        {
          "ranks": 1,
          "total": 1
        },
        {
          "ranks": 5,
          "total": 4
        },
        {
          "ranks": 10,
          "total": 9
        }
      ]
    },
    "sourceFormula": "Deflect, Quirk (requires a projectile or throwing weapon, –1 point)"
  },
  {
    "id": "martial-feather-step",
    "profileId": "martial",
    "name": {
      "en": "Feather Step",
      "pt": "Passo de Pluma"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 122,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": [
            "Trackless",
            "Water Walking"
          ]
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Movement 2 (Trackless, Water-walking), Limited to solid surfaces • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Trackless, Water-walking), Limited to solid surfaces"
  },
  {
    "id": "martial-run-up-walls",
    "profileId": "martial",
    "name": {
      "en": "Run Up Walls",
      "pt": "Correr pelas Paredes"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 123,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Movement 2 (Wall-crawling), Limited to one move action, Limited to while moving • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Movement 2 (Wall-crawling), Limited to one move action, Limited to while moving"
  },
  {
    "id": "martial-wire-fu",
    "profileId": "martial",
    "name": {
      "en": "Wire-Fu",
      "pt": "Voo de Acrobata"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping",
      "pt": "Salto"
    },
    "page": 123,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Leaping • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Leaping"
  },
  {
    "id": "martial-blind-fighting",
    "profileId": "martial",
    "name": {
      "en": "Blind Fighting",
      "pt": "Combate às Cegas"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 123,
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
      "Martial"
    ],
    "audit": {
      "formula": "Senses 2 (Accurate Hearing) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses 2 (Accurate Hearing)"
  },
  {
    "id": "martial-chi-balance",
    "profileId": "martial",
    "name": {
      "en": "Chi Balance",
      "pt": "Equilíbrio de Chi"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing",
      "pt": "Cura"
    },
    "page": 123,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Healing (chi) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Healing (chi)"
  },
  {
    "id": "martial-chi-focus",
    "profileId": "martial",
    "name": {
      "en": "Chi Focus",
      "pt": "Foco de Chi"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 123,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense"
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Enhanced Trait, Sustained • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Trait, Sustained"
  },
  {
    "id": "martial-chi-reading",
    "profileId": "martial",
    "name": {
      "en": "Chi Reading",
      "pt": "Leitura de Chi"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 123,
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
            "detail": "Chi"
          },
          {
            "id": "acute",
            "ranks": 1,
            "senseType": "Mental"
          },
          {
            "id": "analytical",
            "ranks": 1,
            "senseType": "Mental"
          }
        ]
      }
    ],
    "descriptors": [
      "Martial"
    ],
    "audit": {
      "formula": "Senses 3 (Detect Chi, Acute, Analytical) • 3 points",
      "fixed": 3,
      "perRank": 0
    },
    "sourceFormula": "Senses 3 (Detect Chi, Acute, Analytical)"
  },
  {
    "id": "martial-second-wind",
    "profileId": "martial",
    "name": {
      "en": "Second Wind",
      "pt": "Segundo Fôlego"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Healing · Triggered · Limited",
      "pt": "Cura · Gatilho · Limitado"
    },
    "page": 123,
    "components": [
      {
        "effectId": "healing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "triggered",
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
      "Martial"
    ],
    "audit": {
      "formula": "Healing, Triggered 1 (when suffering two or more degrees of damage), Limited to Self • 1 point + 1 point per rank",
      "fixed": 1,
      "perRank": 1
    },
    "sourceFormula": "Healing, Triggered 1 (when suffering two or more degrees of damage), Limited to Self"
  }
] satisfies PowerTemplate[];
