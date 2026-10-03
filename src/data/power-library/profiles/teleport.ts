import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "teleport-apport",
    "profileId": "teleport",
    "name": {
      "en": "Apport",
      "pt": "Apport"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Teleport · Attack",
      "pt": "Teleporte · Ataque"
    },
    "page": 199,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Teleport Attack • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport Attack"
  },
  {
    "id": "teleport-apportive-attack",
    "profileId": "teleport",
    "name": {
      "en": "Apportive Attack",
      "pt": "Ataque por Teleporte"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Alternate Resistance",
      "pt": "Dano · Alcance Aumentado · Resistência Alternativa"
    },
    "page": 199,
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
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Perception Ranged Damage, Resisted by Fortitude • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Perception Ranged Damage, Resisted by Fortitude"
  },
  {
    "id": "teleport-portal-blast",
    "profileId": "teleport",
    "name": {
      "en": "Portal Blast",
      "pt": "Rajada de Portal"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range · Variable Descriptor",
      "pt": "Dano · Alcance Aumentado · Descritor Variável"
    },
    "page": 199,
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
            "modifierId": "variable_descriptor",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Ranged Damage, Variable Descriptor 1 (Environmental Effects) • 1 point + 2 points per rank",
      "fixed": 1,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage, Variable Descriptor 1 (Environmental Effects)"
  },
  {
    "id": "teleport-portal-punch",
    "profileId": "teleport",
    "name": {
      "en": "Portal Punch",
      "pt": "Soco de Portal"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 200,
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
      "Teleport"
    ],
    "audit": {
      "formula": "Ranged Damage • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage"
  },
  {
    "id": "teleport-teleport-sickness",
    "profileId": "teleport",
    "name": {
      "en": "Teleport Sickness",
      "pt": "Mal-estar de Teleporte"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Limited",
      "pt": "Aflição · Limitado"
    },
    "page": 200,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
      "Teleport"
    ],
    "audit": {
      "formula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Limited to Teleport Passengers • 1 point per 2 ranks",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Affliction (Resisted and Overcome by Fortitude; Dazed, Stunned, Incapacitated), Limited to Teleport Passengers"
  },
  {
    "id": "teleport-teleporting-flurry",
    "profileId": "teleport",
    "name": {
      "en": "Teleporting Flurry",
      "pt": "Rajada Teleportada"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Enhanced Trait",
      "pt": "Traço Aprimorado"
    },
    "page": 200,
    "components": [
      {
        "effectId": "enhanced-trait",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Enhanced Extra (3 PP)",
        "fieldValues": {
          "trait": "Ranged, Shapeable Area, Selective on existing Strength Damage"
        }
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Ranged Shapeable Area on Strength Damage, Selective • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Ranged Shapeable Area on Strength Damage, Selective"
  },
  {
    "id": "teleport-blink-teleport",
    "profileId": "teleport",
    "name": {
      "en": "Blink Teleport",
      "pt": "Teleporte Instantâneo"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Teleport · Reaction",
      "pt": "Teleporte · Reação"
    },
    "page": 200,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Reaction Teleport (Imminent Attack) • 5 points",
      "fixed": 0,
      "perRank": 5
    },
    "sourceFormula": "Reaction Teleport (Imminent Attack)"
  },
  {
    "id": "teleport-immunity-to-teleport",
    "profileId": "teleport",
    "name": {
      "en": "Immunity to Teleport",
      "pt": "Imunidade a Teleporte"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 200,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 2,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Immunity 2 (Teleport Effects) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Immunity 2 (Teleport Effects)"
  },
  {
    "id": "teleport-redirecting-warp",
    "profileId": "teleport",
    "name": {
      "en": "Redirecting Warp",
      "pt": "Dobra Redirecionadora"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Deflect · Reflect · Redirect",
      "pt": "Deflexão · Refletir · Redirecionar"
    },
    "page": 200,
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
            "modifierId": "redirect",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Deflect, Reflect, Redirect • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Deflect, Reflect, Redirect"
  },
  {
    "id": "teleport-teleporting-dodge",
    "profileId": "teleport",
    "name": {
      "en": "Teleporting Dodge",
      "pt": "Esquiva Teleportada"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Quirk",
      "pt": "Camuflagem · Peculiaridade"
    },
    "page": 200,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "quirk",
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
      "Teleport"
    ],
    "audit": {
      "formula": "Visual Concealment 4, Quirk (visible until attacked, –1 point) • 7 points",
      "fixed": 7,
      "perRank": 0
    },
    "sourceFormula": "Visual Concealment 4, Quirk (visible until attacked, –1 point)"
  },
  {
    "id": "teleport-astroport",
    "profileId": "teleport",
    "name": {
      "en": "Astroport",
      "pt": "Astroporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 200,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "movement": "Space Travel"
        }
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Movement (Space Travel) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Movement (Space Travel)"
  },
  {
    "id": "teleport-portal-platform",
    "profileId": "teleport",
    "name": {
      "en": "Portal Platform",
      "pt": "Plataforma de Portal"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform",
      "pt": "Voo · Platform"
    },
    "page": 200,
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
      "Teleport"
    ],
    "audit": {
      "formula": "Flight, Platform • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Platform"
  },
  {
    "id": "teleport-teleport",
    "profileId": "teleport",
    "name": {
      "en": "Teleport",
      "pt": "Teleporte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport",
      "pt": "Teleporte"
    },
    "page": 200,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Teleport • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Teleport"
  },
  {
    "id": "teleport-teleportal",
    "profileId": "teleport",
    "name": {
      "en": "Teleportal",
      "pt": "Teleportal"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Portal",
      "pt": "Teleporte · Portal"
    },
    "page": 201,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "portal",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Teleport, Portal • 4 points per rank +1 point per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Teleport, Portal"
  },
  {
    "id": "teleport-nullify-teleport",
    "profileId": "teleport",
    "name": {
      "en": "Nullify Teleport",
      "pt": "Anular Teleporte"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Nullify · Concentration",
      "pt": "Anulação · Concentração"
    },
    "page": 201,
    "components": [
      {
        "effectId": "nullify",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "concentration_nullify",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "fieldValues": {
          "descriptor": "Teleport"
        }
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Nullify Teleport, Concentration • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Nullify Teleport, Concentration"
  },
  {
    "id": "teleport-peephole",
    "profileId": "teleport",
    "name": {
      "en": "Peephole",
      "pt": "Olho Mágico"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Simultaneous · Feedback · Noticeable",
      "pt": "Sensoriamento Remoto · Simultâneo · Retroalimentação · Perceptível"
    },
    "page": 201,
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
            "modifierId": "feedback",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "noticeable",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true,
        "variableCostOption": "Two sense types (or Visual)"
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Remote Sensing, Simultaneous, Feedback, Noticeable • 1 point for rank 1, +2 points per additional rank",
      "fixed": -1,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing, Simultaneous, Feedback, Noticeable"
  },
  {
    "id": "teleport-spatial-beacon",
    "profileId": "teleport",
    "name": {
      "en": "Spatial Beacon",
      "pt": "Farol Espacial"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Teleport · Affects Others · Limited",
      "pt": "Teleporte · Afeta Outros · Limitado"
    },
    "page": 201,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "affects_others",
            "ranks": 1,
            "options": {
              "affectsOnlyOthers": true
            },
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
      "Teleport"
    ],
    "audit": {
      "formula": "Enhanced Teleport, Affects Others Only, Limited to Teleporters • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Enhanced Teleport, Affects Others Only, Limited to Teleporters"
  },
  {
    "id": "teleport-teleport-awareness",
    "profileId": "teleport",
    "name": {
      "en": "Teleport Awareness",
      "pt": "Consciência de Teleporte"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 201,
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
            "detail": "Teleport"
          }
        ]
      }
    ],
    "descriptors": [
      "Teleport"
    ],
    "audit": {
      "formula": "Senses 1 (Teleport Awareness, mental) • 1 point.",
      "fixed": 1,
      "perRank": 0
    },
    "sourceFormula": "Senses 1 (Teleport Awareness, mental)"
  }
] satisfies PowerTemplate[];
