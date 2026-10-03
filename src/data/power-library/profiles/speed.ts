import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "speed-flattening-wake",
    "profileId": "speed",
    "name": {
      "en": "Flattening Wake",
      "pt": "Rastro Derrubador"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Reaction · Area · Instant Recovery · Limited Degree · Limited",
      "pt": "Aflição · Reação · Área · Recuperação Instantânea · Graus Limitados · Limitado"
    },
    "page": 172,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Line",
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
          "resistance": "dodge"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Reaction (while moving at high speed) Line Area Affliction (Resisted by Dodge; Dazed, Prone), Instant Recovery, Limited Degree, Limited to Directly Behind You • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "speed-lightning-disarm",
    "profileId": "speed",
    "name": {
      "en": "Lightning Disarm",
      "pt": "Desarme Relâmpago"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 172,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra (2 PP)",
        "fieldValues": {
          "trait": "Area and Selective on Strength Disarm"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Burst Area on Strength for Disarming, Selective • 2 points per rank (maximum rank equal to Strength).",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "speed-rapid-strike",
    "profileId": "speed",
    "name": {
      "en": "Rapid Strike",
      "pt": "Golpe Rápido"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 172,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Multiattack on Strength Damage"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Multiattack on Strength Damage • 1 point per rank up to Strength rank, 2 points per additional rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-sonic-boom",
    "profileId": "speed",
    "name": {
      "en": "Sonic Boom",
      "pt": "Estrondo Sônico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction",
      "pt": "Aflição"
    },
    "page": 172,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-super-sonic-punch",
    "profileId": "speed",
    "name": {
      "en": "Super-Sonic Punch",
      "pt": "Soco Supersônico"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage",
      "pt": "Dano"
    },
    "page": 172,
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
      "Speed"
    ],
    "audit": {
      "formula": "Strength-based Damage (momentum) •",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-vacuum",
    "profileId": "speed",
    "name": {
      "en": "Vacuum",
      "pt": "Vácuo"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Concentration · Cumulative",
      "pt": "Aflição · Área · Concentration · Cumulativo"
    },
    "page": 173,
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
            "modifierId": "concentration_affliction",
            "ranks": 1,
            "isPowerSpecific": true
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
      "Speed"
    ],
    "audit": {
      "formula": "Burst Area Affliction (Resisted and Overcome by Fortitude; Fatigued, Exhausted, Incapacitated), Concentration, Cumulative • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "speed-whirlwind-attack",
    "profileId": "speed",
    "name": {
      "en": "Whirlwind Attack",
      "pt": "Ataque Turbilhão"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 173,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra (2 PP)",
        "fieldValues": {
          "trait": "Area and Selective on Strength Damage"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Burst Area on Strength Damage, Selective • 2 points per rank up to Strength rank, 3 points per additional rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "speed-fast-defense",
    "profileId": "speed",
    "name": {
      "en": "Fast Defense",
      "pt": "Defesa Rápida"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Enhanced Trait · Enhanced Trait",
      "pt": "Traço Aprimorado · Traço Aprimorado"
    },
    "page": 173,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Dodge"
        }
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Defense",
        "fieldValues": {
          "trait": "Parry"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Enhanced Dodge, Enhanced Parry • 1 point per rank of Enhanced Defense, 2 points per rank for both.",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "speed-frictionless",
    "profileId": "speed",
    "name": {
      "en": "Frictionless",
      "pt": "Sem Atrito"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 173,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Immunity 5 (grab and entrapment effects) • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "speed-throwback",
    "profileId": "speed",
    "name": {
      "en": "Throwback",
      "pt": "Devolver Projétil"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Reflect · Limited",
      "pt": "Deflexão · Refletir · Limitado"
    },
    "page": 173,
    "components": [
      {
        "effectId": "deflect",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reflect",
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
      "Speed"
    ],
    "audit": {
      "formula": "Deflect, Reflect, Limited to Projectiles • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-untouchable",
    "profileId": "speed",
    "name": {
      "en": "Untouchable",
      "pt": "Intocável"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity · Concentration · Limited · Enhanced Trait",
      "pt": "Imunidade · Concentração · Limitado · Traço Aprimorado"
    },
    "page": 173,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 80,
        "modifiers": [
          {
            "modifierId": "concentration",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      },
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Extra (3 PP)",
        "fieldValues": {
          "trait": "Reaction on existing Speed"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Immunity 80 (Dodge and Parry based attacks), Concentration, Limited (not against surprise attacks or sufficiently large area effects); Reaction (when targeted by an attack) on Speed 1 • 30 points + 3 points per additional",
      "fixed": 30,
      "perRank": 0
    }
  },
  {
    "id": "speed-vibrational-phasing-insubstantial",
    "profileId": "speed",
    "name": {
      "en": "Vibrational Phasing — Insubstantial",
      "pt": "Fase Vibracional — Intangível"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Insubstantial",
      "pt": "Insubstancial"
    },
    "page": 173,
    "components": [
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Insubstantial 4 (Incorporeal) • 20 points",
      "fixed": 20,
      "perRank": 0
    }
  },
  {
    "id": "speed-vibrational-phasing-permeate",
    "profileId": "speed",
    "name": {
      "en": "Vibrational Phasing — Permeate",
      "pt": "Fase Vibracional — Permear"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 173,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [],
        "fieldValues": {
          "movement": "Permeate"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Insubstantial 4 (Incorporeal) • 20 points",
      "fixed": 6,
      "perRank": 0
    }
  },
  {
    "id": "speed-air-brakes",
    "profileId": "speed",
    "name": {
      "en": "Air Brakes",
      "pt": "Freios Aéreos"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 173,
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
      "Speed"
    ],
    "audit": {
      "formula": "Movement 1 (Safe Fall) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "speed-air-cushion",
    "profileId": "speed",
    "name": {
      "en": "Air Cushion",
      "pt": "Almofada de Ar"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Affects Others · Area",
      "pt": "Movimento · Afeta Outros · Área"
    },
    "page": 173,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_others",
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
        "fieldValues": {
          "movement": "Safe Fall"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Movement 1 (Safe Fall), Affects Others, Burst Area • 3 points",
      "fixed": 3,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "Movement 2 + Affects Others 1 + Area 1 = 4, not printed 3.",
          "pt": "Divergência da fonte: Movement 2 + Affects Others 1 + Area 1 = 4, not printed 3."
        },
        "fixed": 4,
        "perRank": 0
      }
    }
  },
  {
    "id": "speed-dimensional-vibration",
    "profileId": "speed",
    "name": {
      "en": "Dimensional Vibration",
      "pt": "Vibração Dimensional"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 173,
    "components": [
      {
        "effectId": "movement",
        "ranks": 2,
        "modifiers": [],
        "fieldValues": {
          "movement": "Dimensional Travel: parallel universes"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Movement 2 (Dimensional Travel, parallel universes) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "speed-run-on-water",
    "profileId": "speed",
    "name": {
      "en": "Run On Water",
      "pt": "Correr na Água"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 174,
    "components": [
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
          "movement": "Water-Walking"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Movement 1 (Water-Walking), Limited to while moving • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "speed-run-up-walls",
    "profileId": "speed",
    "name": {
      "en": "Run Up Walls",
      "pt": "Correr nas Paredes"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Limited",
      "pt": "Movimento · Limitado"
    },
    "page": 174,
    "components": [
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
          "movement": "Wall-Crawling"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Movement 1 (Wall-crawling), Limited to while moving • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "speed-running-jump",
    "profileId": "speed",
    "name": {
      "en": "Running Jump",
      "pt": "Salto com Impulso"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Leaping · Quirk",
      "pt": "Salto · Peculiaridade"
    },
    "page": 174,
    "components": [
      {
        "effectId": "leaping",
        "ranks": 2,
        "modifiers": [
          {
            "modifierId": "quirk",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ]
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Leaping, Quirk (Requires a running start, –1 point) • 1 point for 2 ranks, then +1 point per rank",
      "fixed": 1,
      "perRank": 0
    }
  },
  {
    "id": "speed-running-speed",
    "profileId": "speed",
    "name": {
      "en": "Running Speed",
      "pt": "Velocidade de Corrida"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Speed",
      "pt": "Velocidade"
    },
    "page": 174,
    "components": [
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Speed • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-flight-speed",
    "profileId": "speed",
    "name": {
      "en": "Flight Speed",
      "pt": "Velocidade de Voo"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 174,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "speed-share-speed",
    "profileId": "speed",
    "name": {
      "en": "Share Speed",
      "pt": "Compartilhar Velocidade"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 174,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra",
        "fieldValues": {
          "trait": "Affects Others on existing Speed"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Affects Others on Running Speed • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-spinning-drill",
    "profileId": "speed",
    "name": {
      "en": "Spinning Drill",
      "pt": "Broca Giratória"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Burrowing",
      "pt": "Escavação"
    },
    "page": 174,
    "components": [
      {
        "effectId": "burrowing",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Burrowing • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-super-temporal-speed",
    "profileId": "speed",
    "name": {
      "en": "Super-Temporal Speed",
      "pt": "Velocidade Supertemporal"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 174,
    "components": [
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [],
        "fieldValues": {
          "movement": "Time Travel"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Movement 3 (Time Travel) • 6 points",
      "fixed": 6,
      "perRank": 0
    }
  },
  {
    "id": "speed-cyclone",
    "profileId": "speed",
    "name": {
      "en": "Cyclone",
      "pt": "Ciclone"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object · Area · Concentration · Side Effect",
      "pt": "Mover Objetos · Área · Concentração · Efeito Colateral"
    },
    "page": 174,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "area",
            "ranks": 1,
            "option": "Burst",
            "isPowerSpecific": false
          },
          {
            "modifierId": "concentration",
            "ranks": 1,
            "isPowerSpecific": false
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
      "Speed"
    ],
    "audit": {
      "formula": "Burst Area Move Object, Concentration, Side-Effect (limited fine movement and powerful winds) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-fast-action",
    "profileId": "speed",
    "name": {
      "en": "Fast Action",
      "pt": "Ação Rápida"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Quickness",
      "pt": "Rapidez"
    },
    "page": 174,
    "components": [
      {
        "effectId": "quickness",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Quickness • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-fast-healing",
    "profileId": "speed",
    "name": {
      "en": "Fast Healing",
      "pt": "Cura Rápida"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Regeneration",
      "pt": "Regeneração"
    },
    "page": 175,
    "components": [
      {
        "effectId": "regeneration",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Regeneration • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-lightning-reflexes",
    "profileId": "speed",
    "name": {
      "en": "Lightning Reflexes",
      "pt": "Reflexos Relâmpago"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 175,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Improved Initiative"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Enhanced Advantage (Improved Initiative) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "speed-quicker-than-the-eye",
    "profileId": "speed",
    "name": {
      "en": "Quicker Than the Eye",
      "pt": "Mais Rápido que o Olho"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Limited",
      "pt": "Camuflagem · Limitado"
    },
    "page": 175,
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
      "Speed"
    ],
    "audit": {
      "formula": "Concealment 4 (Visual), Limited to while moving • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  },
  {
    "id": "speed-speed-learning",
    "profileId": "speed",
    "name": {
      "en": "Speed-Learning",
      "pt": "Aprendizado Rápido"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 175,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "variableCostOption": "Enhanced Advantage",
        "fieldValues": {
          "trait": "Beginner’s Luck"
        }
      }
    ],
    "descriptors": [
      "Speed"
    ],
    "audit": {
      "formula": "Enhanced Advantage 1 (Beginner’s Luck) • 1 point.",
      "fixed": 1,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
