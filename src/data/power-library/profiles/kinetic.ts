import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "kinetic-force-cage",
    "profileId": "kinetic",
    "name": {
      "en": "Force Cage",
      "pt": "Jaula de Força"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Create · Limited",
      "pt": "Criação · Limitado"
    },
    "page": 84,
    "components": [
      {
        "effectId": "create",
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
      "Kinetic"
    ],
    "audit": {
      "formula": "Create Force Cage, Limited to Entrapping • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "kinetic-friction-blindness",
    "profileId": "kinetic",
    "name": {
      "en": "Friction Blindness",
      "pt": "Cegueira por Atrito"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Instant Recovery · Limited Degree · Limited",
      "pt": "Aflição · Alcance Aumentado · Recuperação Instantânea · Graus Limitados · Limitado"
    },
    "page": 85,
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
            "modifierId": "instant_recovery",
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
          "resistance": "dodge"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted by Dodge; Unaware), Sustained, Instant Recovery, Limited Degree (Third Only), Limited to Targets with Eyelids, Limited to Vision • 1 point per rank",
      "fixed": 0,
      "perRank": 1,
      "discrepancy": {
        "reason": {
          "en": "Reference only: the current model has no Sustained Affliction definition. The displayed instant version is not the complete book recipe.",
          "pt": "Divergência da fonte: Reference only: the current model has no Sustained Affliction definition. The displayed instant version is not the complete book recipe."
        },
        "fixed": 0,
        "perRank": 0.25
      }
    },
    "requiresCharacterChanges": {
      "en": "Reference only: Sustained Affliction requires a duration rule not represented in this builder; this incomplete version cannot be applied.",
      "pt": "Apenas referência: Aflição Sustentada exige uma regra de duração não representada neste Builder; esta versão incompleta não pode ser aplicada."
    }
  },
  {
    "id": "kinetic-friction-muzzle",
    "profileId": "kinetic",
    "name": {
      "en": "Friction Muzzle",
      "pt": "Mordaça por Atrito"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Instant Recovery · Limited Degree · Limited",
      "pt": "Aflição · Alcance Aumentado · Recuperação Instantânea · Graus Limitados · Limitado"
    },
    "page": 85,
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
            "modifierId": "instant_recovery",
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
          "resistance": "dodge"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted by Dodge; Transformed), Sustained, Instant Recovery, Limited Degree (Third Only), Limited to Keeping Target’s Mouth Closed (–2) • 1 point per rank",
      "fixed": 0,
      "perRank": 1,
      "discrepancy": {
        "reason": {
          "en": "Reference only: the current model has no Sustained Affliction definition. The displayed instant version is not the complete book recipe.",
          "pt": "Divergência da fonte: Reference only: the current model has no Sustained Affliction definition. The displayed instant version is not the complete book recipe."
        },
        "fixed": 0,
        "perRank": 0.25
      }
    },
    "requiresCharacterChanges": {
      "en": "Reference only: Sustained Affliction requires a duration rule not represented in this builder; this incomplete version cannot be applied.",
      "pt": "Apenas referência: Aflição Sustentada exige uma regra de duração não representada neste Builder; esta versão incompleta não pode ser aplicada."
    }
  },
  {
    "id": "kinetic-friction-heat",
    "profileId": "kinetic",
    "name": {
      "en": "Friction Heat",
      "pt": "Calor de Atrito"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Increased Range · Broad · Linked · Damage · Increased Range · Limited",
      "pt": "Enfraquecer · Alcance Aumentado · Amplo · Vinculado · Dano · Alcance Aumentado · Limitado"
    },
    "page": 85,
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
            "modifierId": "broad",
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
          "trait": "Movement effects",
          "resistance": "fortitude"
        }
      },
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Ranged Weaken Movement Effects, Broad; Linked to Ranged Damage (Heat), Damage Limited to Reduction in Speed Rank • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "kinetic-internal-attack",
    "profileId": "kinetic",
    "name": {
      "en": "Internal Attack",
      "pt": "Ataque Interno"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Alternate Resistance · Affects Objects",
      "pt": "Dano · Alcance Aumentado · Resistência Alternativa · Afeta Objetos"
    },
    "page": 85,
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
              "subtypeId": "fortitude",
              "alternateResistanceCost": "advantageous"
            },
            "isPowerSpecific": false
          },
          {
            "modifierId": "affects_objects",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Perception Ranged Damage, Alternate Resistance (Fortitude), Affects Objects • 5 points per rank",
      "fixed": 0,
      "perRank": 5
    }
  },
  {
    "id": "kinetic-kinetic-blast",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Blast",
      "pt": "Rajada Cinética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 85,
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
      "Kinetic"
    ],
    "audit": {
      "formula": "Ranged Damage (kinetic) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "kinetic-kinetic-bullet",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Bullet",
      "pt": "Bala Cinética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Quirk",
      "pt": "Dano · Alcance Aumentado · Peculiaridade"
    },
    "page": 85,
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
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Ranged Damage (projectile), Quirk (requires objects as ammo, –1 point) • 1 point for rank 1 + 2 points",
      "fixed": -1,
      "perRank": 2
    }
  },
  {
    "id": "kinetic-kinetic-burst",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Burst",
      "pt": "Explosão Cinética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Area",
      "pt": "Dano · Alcance Aumentado · Área"
    },
    "page": 85,
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
            "option": "Burst",
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Ranged Burst Area Damage (kinetic) • 3 points",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "kinetic-kinetic-weapon",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Weapon",
      "pt": "Arma Cinética"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 85,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Damage • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "kinetic-suffocating-bubble",
    "profileId": "kinetic",
    "name": {
      "en": "Suffocating Bubble",
      "pt": "Bolha Sufocante"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive — Fatigued, Exhausted, Incapacitated.",
      "pt": "Aflição · Alcance Aumentado · Progressivo — Fatigado, Exausto, Incapacitado."
    },
    "page": 85,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Ranged Progressive Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "kinetic-frictionless",
    "profileId": "kinetic",
    "name": {
      "en": "Frictionless",
      "pt": "Sem Atrito"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Sustained",
      "pt": "Imunidade · Sustentado"
    },
    "page": 85,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "sustained_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Immunity 10 (Grabbing, Ensnaring, and Restraining effects), Sustained • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-immovable",
    "profileId": "kinetic",
    "name": {
      "en": "Immovable",
      "pt": "Imóvel"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Sustained",
      "pt": "Imunidade · Sustentado"
    },
    "page": 85,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": [
          {
            "modifierId": "sustained_immunity",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ]
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Immunity 10 (Being Moved), Sustained • 10 points",
      "fixed": 10,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-kinetic-absorption",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Absorption",
      "pt": "Absorção Cinética"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Fades · Reaction · Limited",
      "pt": "Traço Aprimorado · Desgaste · Reação · Limitado"
    },
    "page": 85,
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
            "modifierId": "reaction",
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
        "variableCostOption": "Enhanced Ability"
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Enhanced Trait, Fades, Reaction (When Absorbing Kinetic Energy), Limited to When Absorbing Energy • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "kinetic-kinetic-deflection",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Deflection",
      "pt": "Deflexão Cinética"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Limited",
      "pt": "Deflexão · Limitado"
    },
    "page": 86,
    "components": [
      {
        "effectId": "deflect",
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
      "Kinetic"
    ],
    "audit": {
      "formula": "Deflect, Limited to Kinetic Attacks • 1",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "kinetic-kinetic-immunity",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Immunity",
      "pt": "Imunidade Cinética"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 86,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 40,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Immunity 40 (Kinetic Attacks) • 1 point per rank",
      "fixed": 40,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-kinetic-shield",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Shield",
      "pt": "Escudo Cinético"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Impervious · Sustained",
      "pt": "Proteção · Impenetrável · Sustentado"
    },
    "page": 86,
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
      "Kinetic"
    ],
    "audit": {
      "formula": "Impervious Protection, Sustained • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "kinetic-friction-cling-1",
    "profileId": "kinetic",
    "name": {
      "en": "Friction Cling — 1",
      "pt": "Aderência por Atrito — 1"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 86,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Movement (Wall-Crawling 1 or 2) • 2 or 4 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-friction-cling-2",
    "profileId": "kinetic",
    "name": {
      "en": "Friction Cling — 2",
      "pt": "Aderência por Atrito — 2"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 86,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Movement (Wall-Crawling 1 or 2) • 2 or 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-kinetic-transport",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Transport",
      "pt": "Transporte Cinético"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Limited — Due west only, never through barriers.",
      "pt": "Teleporte · Limitado — Apenas para oeste, nunca através de barreiras."
    },
    "page": 86,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 8,
        "modifiers": [
          {
            "modifierId": "limited",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Teleport 8, Limited to Due West, Not Through Barriers • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-kinetic-rebound",
    "profileId": "kinetic",
    "name": {
      "en": "Kinetic Rebound",
      "pt": "Ricochete Cinético"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 86,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "fieldValues": {
          "movement": "Safe Fall"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Movement 1 (Safe Fall) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "kinetic-friction-control",
    "profileId": "kinetic",
    "name": {
      "en": "Friction Control",
      "pt": "Controle de Atrito"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Affliction · Increased Range · Area · Progressive · Limited Degree · Reversible",
      "pt": "Aflição · Alcance Aumentado · Área · Progressivo · Graus Limitados · Reversível"
    },
    "page": 86,
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
            "modifierId": "limited_degree",
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
          "resistance": "dodge"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Burst Area Ranged Affliction (Resisted and Overcome by Dodge; Hindered, Prone), Progressive, Limited Degree; AE: Burst Area Ranged Affliction (Resisted by Dodge, Overcome by Strength; Hindered, Immobile), Progressive, Reversible, Limited Degree • 2 points + 4",
      "fixed": 2,
      "perRank": 4
    },
    "alternateEffects": [
      {
        "name": {
          "en": "Reduce friction",
          "pt": "Reduzir atrito"
        },
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
                "modifierId": "limited_degree",
                "ranks": 1,
                "isPowerSpecific": true
              }
            ],
            "scalable": true,
            "fieldValues": {
              "resistance": "dodge"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "kinetic-force-constructs",
    "profileId": "kinetic",
    "name": {
      "en": "Force Constructs",
      "pt": "Construtos de Força"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 86,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Create Force Constructs • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "kinetic-momentum-boost",
    "profileId": "kinetic",
    "name": {
      "en": "Momentum Boost",
      "pt": "Aumentar Impulso"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Speed · Affects Others · Increased Range · Variable Descriptor",
      "pt": "Velocidade · Afeta Outros · Alcance Aumentado · Descritor Variável"
    },
    "page": 86,
    "components": [
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_others",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "variable_descriptor",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Enhanced Speed, Affects Others, Ranged, Variable Descriptor (movement effects) • 2 points +3 points",
      "fixed": 2,
      "perRank": 3
    }
  },
  {
    "id": "kinetic-momentum-drain",
    "profileId": "kinetic",
    "name": {
      "en": "Momentum Drain",
      "pt": "Drenar Impulso"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Weaken · Increased Range · Affects Objects · Broad",
      "pt": "Enfraquecer · Alcance Aumentado · Afeta Objetos · Amplo"
    },
    "page": 86,
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
            "isPowerSpecific": false
          },
          {
            "modifierId": "broad",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "trait": "Movement effects",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Ranged Weaken Movement Effects, Affects Objects, Broad • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "kinetic-tactile-telekinesis",
    "profileId": "kinetic",
    "name": {
      "en": "Tactile Telekinesis",
      "pt": "Telecinese Tátil"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait · Limited · Feature",
      "pt": "Traço Aprimorado · Limitado · Característica"
    },
    "page": 86,
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
        "variableCostOption": "Enhanced Ability",
        "fieldValues": {
          "trait": "Strength"
        }
      },
      {
        "effectId": "feature",
        "ranks": 1,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Enhanced Strength, Limited to Lifting and Moving (No Damage), Feature 1 (Able to Exert Strength Without Moving) • 1 point + 1 point per rank",
      "fixed": 1,
      "perRank": 1
    }
  },
  {
    "id": "kinetic-telekinesis",
    "profileId": "kinetic",
    "name": {
      "en": "Telekinesis",
      "pt": "Telecinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 87,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Move Object • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "kinetic-psychokinesis",
    "profileId": "kinetic",
    "name": {
      "en": "Psychokinesis",
      "pt": "Psicocinese"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Perception",
      "pt": "Mover Objetos · Percepção"
    },
    "page": 87,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "perception_move_object",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Kinetic"
    ],
    "audit": {
      "formula": "Perception Ranged Move Object • 3 points",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "kinetic-telekinetic-touch",
    "profileId": "kinetic",
    "name": {
      "en": "Telekinetic Touch",
      "pt": "Toque Telecinético"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 87,
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
      "Kinetic"
    ],
    "audit": {
      "formula": "Senses 1 (Ranged Tactile) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
