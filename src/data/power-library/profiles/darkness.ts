import type { PowerTemplate } from '../../../features/power-library/types';

export default [
  {
    "id": "darkness-blinding-blast",
    "profileId": "darkness",
    "name": {
      "en": "Blinding Blast",
      "pt": "Rajada de Cegueira"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Limited · Alternate Resistance — Impaired, Disabled, Unaware; vision only, overcome by Will.",
      "pt": "Aflição · Alcance Aumentado · Limitado · Resistência Alternativa — Prejudicado, Debilitado, Inconsciente dos estímulos; apenas visão, superado por Vontade."
    },
    "page": 31,
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
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Ranged Affliction (darkness; Resisted by Dodge, Overcome by Will; Impaired, Disabled, Unaware), Limited to Vision • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Ranged Affliction (darkness; Resisted by Dodge, Overcome by Will; Impaired, Disabled, Unaware), Limited to Vision"
  },
  {
    "id": "darkness-dark-blast",
    "profileId": "darkness",
    "name": {
      "en": "Dark Blast",
      "pt": "Rajada Sombria"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Increased Range",
      "pt": "Dano · Alcance Aumentado"
    },
    "page": 31,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Ranged Damage (cold, force, or life-drain) • 2",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Ranged Damage (cold, force, or life-drain)"
  },
  {
    "id": "darkness-night-terrors",
    "profileId": "darkness",
    "name": {
      "en": "Night Terrors",
      "pt": "Terrores Noturnos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Limited — Entranced, Compelled, Controlled; only fleeing or cowering in fear.",
      "pt": "Aflição · Alcance Aumentado · Limitado — Hipnotizado, Compelido, Controlado; apenas fugir ou se encolher de medo."
    },
    "page": 31,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Limited to fleeing or cowering in terror • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Perception Ranged Affliction (Resisted and Overcome by Will; Entranced, Compelled, Controlled), Limited to fleeing or cowering in terror"
  },
  {
    "id": "darkness-shadow-bind",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Bind",
      "pt": "Aprisionamento Sombrio"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative · Increased Range · Extra Condition · Limited Degree · Alternate Resistance — Hindered and Vulnerable; Defenseless and Immobilized. Overcome by Will.",
      "pt": "Aflição · Cumulativo · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido e Vulnerável; Indefeso e Imóvel. Superado por Vontade."
    },
    "page": 31,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Cumulative Ranged Affliction (Resisted by Dodge, Overcome by Will; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    },
    "sourceFormula": "Cumulative Ranged Affliction (Resisted by Dodge, Overcome by Will; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree"
  },
  {
    "id": "darkness-shadow-boxing",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Boxing",
      "pt": "Combate de Sombras"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Move Object · Damaging · Limited — Only shadow interactions.",
      "pt": "Mover Objetos · Causar Dano · Limitado — Apenas interações com sombras."
    },
    "page": 31,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "damaging",
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
      "Darkness"
    ],
    "audit": {
      "formula": "Damaging Move Object, Limited to Shadow Interactions • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Damaging Move Object, Limited to Shadow Interactions"
  },
  {
    "id": "darkness-shadow-shroud",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Shroud",
      "pt": "Manto de Sombras"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Concealment · Attack · Increased Range · Area",
      "pt": "Camuflagem · Ataque · Alcance Aumentado · Área"
    },
    "page": 31,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 4,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
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
        "fieldValues": {
          "senses": [
            "visual"
          ]
        }
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Ranged Burst Area Visual Concealment 4 Attack • 16 points +4 points per +1 area distance rank",
      "fixed": 16,
      "perRank": 0
    },
    "sourceFormula": "Ranged Burst Area Visual Concealment 4 Attack"
  },
  {
    "id": "darkness-swallowing-shadow",
    "profileId": "darkness",
    "name": {
      "en": "Swallowing Shadow",
      "pt": "Sombra Devoradora"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Movement · Attack · Increased Range — Base resistance DC 11. The book prices additional resistance DC separately from dimensional destinations; this recipe loads its base version.",
      "pt": "Movimento · Ataque · Alcance Aumentado — CD base de resistência 11. O livro cobra aumentos da CD separadamente dos destinos dimensionais; esta receita carrega a versão base."
    },
    "page": 31,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "attack",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "increased_range",
            "ranks": 2,
            "isPowerSpecific": false
          }
        ],
        "fieldValues": {
          "movement": "Dimensional Travel: Shadow World",
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Perception Ranged Movement (Dimensional Travel to a “shadow world”) Attack (Resisted by Will, base DC 11) • 4 points +3 points per +1 in",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Perception Ranged Movement (Dimensional Travel to a “shadow world”) Attack (Resisted by Will, base DC 11)"
  },
  {
    "id": "darkness-dark-aura",
    "profileId": "darkness",
    "name": {
      "en": "Dark Aura",
      "pt": "Aura Sombria"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Damage · Reaction",
      "pt": "Dano · Reação"
    },
    "page": 32,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "reaction",
            "ranks": 1,
            "options": {
              "trigger": "When touched"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Reaction Damage (to being touched; cold, force, or life-drain) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Reaction Damage (to being touched; cold, force, or life-drain)"
  },
  {
    "id": "darkness-immunity-to-darkness",
    "profileId": "darkness",
    "name": {
      "en": "Immunity to Darkness",
      "pt": "Imunidade à Escuridão"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 32,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Immunity 5 (darkness effects) • 5 points",
      "fixed": 5,
      "perRank": 0
    },
    "sourceFormula": "Immunity 5 (darkness effects)"
  },
  {
    "id": "darkness-immunity-to-light",
    "profileId": "darkness",
    "name": {
      "en": "Immunity to Light",
      "pt": "Imunidade à Luz"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 32,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Immunity 10 (light effects) • 10 points",
      "fixed": 10,
      "perRank": 0
    },
    "sourceFormula": "Immunity 10 (light effects)"
  },
  {
    "id": "darkness-shadow-meld",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Meld",
      "pt": "Fundir-se às Sombras"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Concealment · Limited — Only in shadows or darkness.",
      "pt": "Camuflagem · Limitado — Apenas em sombras ou escuridão."
    },
    "page": 32,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Concealment 4 (Visual), Limited to areas of shadow or darkness • 4 points",
      "fixed": 4,
      "perRank": 0
    },
    "sourceFormula": "Concealment 4 (Visual), Limited to areas of shadow or darkness"
  },
  {
    "id": "darkness-shadow-shield",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Shield",
      "pt": "Escudo Sombrio"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 32,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Protection (dark force), Sustained • 1 point",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Protection (dark force), Sustained"
  },
  {
    "id": "darkness-dark-flight",
    "profileId": "darkness",
    "name": {
      "en": "Dark Flight",
      "pt": "Voo Sombrio"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight",
      "pt": "Voo"
    },
    "page": 32,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Flight • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Flight"
  },
  {
    "id": "darkness-shadow-bridge",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Bridge",
      "pt": "Ponte de Sombras"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Flight · Platform",
      "pt": "Voo · Platform"
    },
    "page": 32,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Flight, Platform (shadow bridge) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Flight, Platform (shadow bridge)"
  },
  {
    "id": "darkness-shadow-crawl",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Crawl",
      "pt": "Deslocamento Sombrio"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Speed",
      "pt": "Velocidade"
    },
    "page": 32,
    "components": [
      {
        "effectId": "speed",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Speed • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Speed"
  },
  {
    "id": "darkness-shadow-door",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Door",
      "pt": "Porta de Sombras"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement",
      "pt": "Movimento"
    },
    "page": 32,
    "components": [
      {
        "effectId": "movement",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "fieldValues": {
          "movement": "Permeate"
        }
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Movement (Permeate) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Movement (Permeate)"
  },
  {
    "id": "darkness-shadow-projection",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Projection",
      "pt": "Projeção Sombria"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Remote Sensing — Visual, auditory and mental; visual costs two.",
      "pt": "Sensoriamento Remoto — Visual, auditivo e mental; visual custa duas graduações."
    },
    "page": 32,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Remote Sensing (visual, auditory, mental) • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    },
    "sourceFormula": "Remote Sensing (visual, auditory, mental)"
  },
  {
    "id": "darkness-shadow-walk",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Walk",
      "pt": "Caminhar pelas Sombras"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Medium — Shadows are the teleport medium.",
      "pt": "Teleporte · Meio — Sombras são o meio de teleporte."
    },
    "page": 32,
    "components": [
      {
        "effectId": "teleport",
        "ranks": 1,
        "modifiers": [
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
      "Darkness"
    ],
    "audit": {
      "formula": "Teleport, Medium (shadows) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Teleport, Medium (shadows)"
  },
  {
    "id": "darkness-darkvision",
    "profileId": "darkness",
    "name": {
      "en": "Darkvision",
      "pt": "Visão no Escuro"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 33,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "counters_concealment",
            "ranks": 2,
            "senseType": "Visual",
            "detail": "Darkness"
          }
        ]
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Senses 2 (Vision Counters Concealment – darkness) • 2 points",
      "fixed": 2,
      "perRank": 0
    },
    "sourceFormula": "Senses 2 (Vision Counters Concealment – darkness)"
  },
  {
    "id": "darkness-gloom-visibility-2",
    "profileId": "darkness",
    "name": {
      "en": "Gloom — Visibility -2",
      "pt": "Penumbra — Visibilidade -2"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 33,
    "components": [
      {
        "effectId": "environment",
        "ranks": 1,
        "modifiers": [],
        "scalable": true,
        "variableCostOption": "Visibility (-2)"
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Environment (visibility) • 1 or 2 points per rank",
      "fixed": 0,
      "perRank": 1
    },
    "sourceFormula": "Environment (visibility)"
  },
  {
    "id": "darkness-gloom-visibility-5",
    "profileId": "darkness",
    "name": {
      "en": "Gloom — Visibility -5",
      "pt": "Penumbra — Visibilidade -5"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Environment",
      "pt": "Controle Ambiental"
    },
    "page": 33,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Environment (visibility) • 1 or 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Environment (visibility)"
  },
  {
    "id": "darkness-healing-darkness",
    "profileId": "darkness",
    "name": {
      "en": "Healing Darkness",
      "pt": "Escuridão Curativa"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Regeneration · Source — Requires darkness.",
      "pt": "Regeneração · Fonte — Exige escuridão."
    },
    "page": 33,
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
      "Darkness"
    ],
    "audit": {
      "formula": "Regeneration, Source (darkness) • 1 point",
      "fixed": 0,
      "perRank": 0.5
    },
    "sourceFormula": "Regeneration, Source (darkness)"
  },
  {
    "id": "darkness-scry-through-shadow",
    "profileId": "darkness",
    "name": {
      "en": "Scry Through Shadow",
      "pt": "Espiar pelas Sombras"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Remote Sensing · Medium — Visual and auditory; shadows are the medium.",
      "pt": "Sensoriamento Remoto · Meio — Visual e auditivo; sombras são o meio."
    },
    "page": 33,
    "components": [
      {
        "effectId": "remote-sensing",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "medium",
            "ranks": 1,
            "isPowerSpecific": true
          }
        ],
        "scalable": true,
        "variableCostOption": "Three sense types"
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Remote Sensing (visual and auditory), Medium (shadows and darkness) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Remote Sensing (visual and auditory), Medium (shadows and darkness)"
  },
  {
    "id": "darkness-shadow-form",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Form",
      "pt": "Forma Sombria"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Concealment · Limited · Immunity · Insubstantial · Movement — Concealment only in darkness; life support and shadow form.",
      "pt": "Camuflagem · Limitado · Imunidade · Insubstancial · Movimento — Camuflagem apenas na escuridão; suporte vital e forma de sombras."
    },
    "page": 33,
    "components": [
      {
        "effectId": "concealment",
        "ranks": 2,
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
      },
      {
        "effectId": "immunity",
        "ranks": 10,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 3,
        "modifiers": []
      },
      {
        "effectId": "movement",
        "ranks": 3,
        "modifiers": [],
        "fieldValues": {
          "movement": [
            "Slithering",
            "Wall-Crawling 2"
          ]
        }
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Concealment 2 (Visual, Limited to Darkness and Shadows), Immunity 10 (life support), Insubstantial 3 (shadow form), Movement 3 (Slithering, Wall-crawling 2) • 33 points",
      "fixed": 33,
      "perRank": 0
    },
    "sourceFormula": "Concealment 2 (Visual, Limited to Darkness and Shadows), Immunity 10 (life support), Insubstantial 3 (shadow form), Movement 3 (Slithering, Wall-crawling 2)"
  },
  {
    "id": "darkness-shadow-shaping",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Shaping",
      "pt": "Moldar Sombras"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Create",
      "pt": "Criação"
    },
    "page": 33,
    "components": [
      {
        "effectId": "create",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Create Shadow Shapes • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Create Shadow Shapes"
  },
  {
    "id": "darkness-shadow-tendrils",
    "profileId": "darkness",
    "name": {
      "en": "Shadow Tendrils",
      "pt": "Tentáculos de Sombras"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Move Object",
      "pt": "Mover Objetos"
    },
    "page": 33,
    "components": [
      {
        "effectId": "move-object",
        "ranks": 1,
        "modifiers": [],
        "scalable": true
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Move Object (shadows) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    },
    "sourceFormula": "Move Object (shadows)"
  },
  {
    "id": "darkness-summon-shadows",
    "profileId": "darkness",
    "name": {
      "en": "Summon Shadows",
      "pt": "Invocar Sombras"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon — Configure the shadow creature separately.",
      "pt": "Invocar — Configure a criatura de sombras separadamente."
    },
    "page": 33,
    "components": [
      {
        "effectId": "summon",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Darkness"
    ],
    "audit": {
      "formula": "Summon Shadow Creature 4 (58-point minion) • 8 points",
      "fixed": 8,
      "perRank": 0
    },
    "sourceFormula": "Summon Shadow Creature 4 (58-point minion)"
  }
] satisfies PowerTemplate[];
