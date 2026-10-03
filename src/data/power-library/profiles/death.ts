import type { PowerTemplate } from '../../../features/power-library/types';
export default [
  {
    "id": "death-banshee-s-wail",
    "profileId": "death",
    "name": {
      "en": "Banshee’s Wail",
      "pt": "Lamento da Banshee"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area — Hearing; Dazed, Stunned, Dying.",
      "pt": "Aflição · Área — Audição; Atordoado, Aturdido, Morrendo."
    },
    "page": 36,
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
          }
        ],
        "scalable": true,
        "fieldValues": {
          "resistance": "will"
        }
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Hearing Perception Area Affliction (Resisted and Overcome by Will; Dazed, Stunned, Dying) • 2 points",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "death-command-the-undead",
    "profileId": "death",
    "name": {
      "en": "Command the Undead",
      "pt": "Comandar Mortos-vivos"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Area · Affects Objects · Limited — Hearing; Dazed, Compelled, Controlled. Undead only.",
      "pt": "Aflição · Área · Afeta Objetos · Limitado — Audição; Atordoado, Compelido, Controlado. Apenas mortos-vivos."
    },
    "page": 36,
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
            "modifierId": "affects_objects",
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
      "Death"
    ],
    "audit": {
      "formula": "Hearing Perception Area Affliction (Resisted and Overcome by Will; Dazed, Compelled, Controlled), Affects Objects, Limited to the Undead • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "death-death-curse",
    "profileId": "death",
    "name": {
      "en": "Death Curse",
      "pt": "Maldição da Morte"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Progressive · Limited — Impaired, Disabled, Dying; one recovery check per day.",
      "pt": "Aflição · Alcance Aumentado · Progressivo · Limitado — Prejudicado, Debilitado, Morrendo; um teste de recuperação por dia."
    },
    "page": 36,
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
      "Death"
    ],
    "audit": {
      "formula": "Perception Ranged Progressive Affliction (Resisted and Overcome by Will; Impaired, Disabled, Dying), Limited to one check per day • 4 points per rank",
      "fixed": 0,
      "perRank": 4
    }
  },
  {
    "id": "death-death-stare",
    "profileId": "death",
    "name": {
      "en": "Death Stare",
      "pt": "Olhar Mortal"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Cumulative · Sense-Dependent — Impaired, Stunned, Paralyzed.",
      "pt": "Aflição · Alcance Aumentado · Cumulativo · Dependente de Sentido — Prejudicado, Aturdido, Paralisado."
    },
    "page": 36,
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
            "modifierId": "sense_dependent",
            "ranks": 1,
            "options": {
              "sense": "Visual"
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
      "Death"
    ],
    "audit": {
      "formula": "Perception Ranged Cumulative Affliction (Resisted and Overcome by Will; Impaired, Stunned, Paralyzed), Vision Dependent • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "death-death-touch",
    "profileId": "death",
    "name": {
      "en": "Death Touch",
      "pt": "Toque Mortal"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Cumulative — Impaired, Disabled, Dying.",
      "pt": "Aflição · Cumulativo — Prejudicado, Debilitado, Morrendo."
    },
    "page": 37,
    "components": [
      {
        "effectId": "affliction",
        "ranks": 1,
        "modifiers": [
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
      "Death"
    ],
    "audit": {
      "formula": "Cumulative Affliction (Resisted and Overcome by Fortitude; Impaired, Disabled, Dying) • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "death-grasping-graves",
    "profileId": "death",
    "name": {
      "en": "Grasping Graves",
      "pt": "Túmulos que Agarram"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Affliction · Increased Range · Extra Condition · Limited Degree · Alternate Resistance — Hindered/Vulnerable, Defenseless/Immobilized; overcome by Damage.",
      "pt": "Aflição · Alcance Aumentado · Condição Extra · Graus Limitados · Resistência Alternativa — Impedido/Vulnerável, Indefeso/Imóvel; superado por Dano."
    },
    "page": 37,
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
      "Death"
    ],
    "audit": {
      "formula": "Ranged Affliction (Resisted by Dodge, Overcome by Damage; Hindered and Vulnerable, Defenseless and Immobilized), Extra Condition, Limited Degree • 2 points per rank",
      "fixed": 0,
      "perRank": 2
    }
  },
  {
    "id": "death-soulfire",
    "profileId": "death",
    "name": {
      "en": "Soulfire",
      "pt": "Fogo da Alma"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Damage · Alternate Resistance",
      "pt": "Dano · Resistência Alternativa"
    },
    "page": 37,
    "components": [
      {
        "effectId": "damage",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "alternate_resistance",
            "ranks": 1,
            "options": {
              "subtypeId": "will"
            },
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Damage (soul), Alternate Resistance (Will) • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "death-suppress-life",
    "profileId": "death",
    "name": {
      "en": "Suppress Life",
      "pt": "Suprimir Vida"
    },
    "section": {
      "en": "Offensive powers",
      "pt": "Poderes ofensivos"
    },
    "summary": {
      "en": "Weaken · Incurable · Insidious · Limited — Limited to recovery checks.",
      "pt": "Enfraquecer · Incurável · Insidioso · Limitado — Limitado a testes de recuperação."
    },
    "page": 37,
    "components": [
      {
        "effectId": "weaken",
        "ranks": 1,
        "modifiers": [
          {
            "modifierId": "incurable",
            "ranks": 1,
            "isPowerSpecific": false
          },
          {
            "modifierId": "insidious",
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
          "trait": "Stamina",
          "resistance": "fortitude"
        }
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Weaken Stamina, Incurable, Insidious, Limited to Recovery Checks • 2 points + 1 point per 2 ranks",
      "fixed": 2,
      "perRank": 0.5
    }
  },
  {
    "id": "death-blood-healing",
    "profileId": "death",
    "name": {
      "en": "Blood Healing",
      "pt": "Cura pelo Sangue"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Regeneration · Source — Source: blood.",
      "pt": "Regeneração · Fonte — Fonte: sangue."
    },
    "page": 37,
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
      "Death"
    ],
    "audit": {
      "formula": "Regeneration, Source (blood) • 1 point per 2",
      "fixed": 0,
      "perRank": 0.5
    }
  },
  {
    "id": "death-deathless",
    "profileId": "death",
    "name": {
      "en": "Deathless",
      "pt": "Imortal"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immortality · Limited — Choose a means of permanent death.",
      "pt": "Imortalidade · Limitado — Escolha uma causa de morte permanente."
    },
    "page": 37,
    "components": [
      {
        "effectId": "immortality",
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
      "Death"
    ],
    "audit": {
      "formula": "Immortality, Limited (means of permanent death) • 1 point per rank",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "death-ghost-shield",
    "profileId": "death",
    "name": {
      "en": "Ghost Shield",
      "pt": "Escudo Fantasma"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Protection · Sustained",
      "pt": "Proteção · Sustentado"
    },
    "page": 37,
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
      "Death"
    ],
    "audit": {
      "formula": "Protection (necromantic), Sustained • 1 point",
      "fixed": 0,
      "perRank": 1
    }
  },
  {
    "id": "death-shielded-soul",
    "profileId": "death",
    "name": {
      "en": "Shielded Soul",
      "pt": "Alma Protegida"
    },
    "section": {
      "en": "Defensive powers",
      "pt": "Poderes defensivos"
    },
    "summary": {
      "en": "Immunity — Death effects.",
      "pt": "Imunidade — Efeitos de morte."
    },
    "page": 37,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 5,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Immunity 5 (death effects) • 5 points",
      "fixed": 5,
      "perRank": 0
    }
  },
  {
    "id": "death-death-s-gate",
    "profileId": "death",
    "name": {
      "en": "Death’s Gate",
      "pt": "Portal da Morte"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Movement · Portal",
      "pt": "Movimento · Portal"
    },
    "page": 37,
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
          "movement": "Dimensional Travel: afterlives"
        }
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Movement 2 (Dimensional 2, afterlives), Portal • 8 points",
      "fixed": 8,
      "perRank": 0
    }
  },
  {
    "id": "death-valkyrie-s-ride",
    "profileId": "death",
    "name": {
      "en": "Valkyrie’s Ride",
      "pt": "Cavalgada da Valquíria"
    },
    "section": {
      "en": "Movement powers",
      "pt": "Poderes de movimento"
    },
    "summary": {
      "en": "Teleport · Accurate · Extended · Limited — Limited to dying subjects.",
      "pt": "Teleporte · Preciso · Estendido · Limitado — Limitado a pessoas morrendo."
    },
    "page": 38,
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
            "modifierId": "limited",
            "ranks": 1,
            "isPowerSpecific": false
          }
        ],
        "scalable": true
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Teleport, Accurate (see description), Extended, Limited to Dying Subjects • 3 points per rank",
      "fixed": 0,
      "perRank": 3
    }
  },
  {
    "id": "death-death-sight",
    "profileId": "death",
    "name": {
      "en": "Death Sight",
      "pt": "Visão da Morte"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 38,
    "components": [
      {
        "effectId": "senses",
        "ranks": 2,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "detect",
            "ranks": 1,
            "senseType": "Mental",
            "detail": "Dying"
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
      "Death"
    ],
    "audit": {
      "formula": "Senses 2 (Detect Dying, Ranged) • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "death-death-visions",
    "profileId": "death",
    "name": {
      "en": "Death Visions",
      "pt": "Visões da Morte"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses · Limited — Only visions of death.",
      "pt": "Sentidos · Limitado — Apenas visões de morte."
    },
    "page": 38,
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
            "id": "precognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Senses 4 (Precognition), Limited to Visions of Death • 2 points",
      "fixed": 2,
      "perRank": 0
    }
  },
  {
    "id": "death-ghost-form",
    "profileId": "death",
    "name": {
      "en": "Ghost Form",
      "pt": "Forma Fantasma"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Flight · Immunity · Insubstantial",
      "pt": "Voo · Imunidade · Insubstancial"
    },
    "page": 38,
    "components": [
      {
        "effectId": "flight",
        "ranks": 1,
        "modifiers": []
      },
      {
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      },
      {
        "effectId": "insubstantial",
        "ranks": 4,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Flight 1, Immunity 30 (Fortitude effects), Insubstantial 4 (incorporeal), No Stamina rank (–10 points) • 41 points",
      "fixed": 41,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "The displayed total counts powers only. Absent Stamina is a character-level -10 PP trait; Ghost Form also has a printed one-point mismatch.",
          "pt": "Divergência da fonte: The displayed total counts powers only. Absent Stamina is a character-level -10 PP trait; Ghost Form also has a printed one-point mismatch."
        },
        "fixed": 52,
        "perRank": 0
      }
    },
    "requiresCharacterChanges": {
      "en": "Reference only: this form also removes the character’s Stamina. A power template cannot safely make that character-level change. Configure absent Stamina separately; these powers do not include its refund.",
      "pt": "Apenas referência: esta forma também remove a Vigor do personagem. Um modelo de poder não pode fazer essa alteração com segurança. Configure Vigor ausente separadamente; estes poderes não incluem o desconto."
    }
  },
  {
    "id": "death-undead-form",
    "profileId": "death",
    "name": {
      "en": "Undead Form",
      "pt": "Forma Morta-viva"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Immunity",
      "pt": "Imunidade"
    },
    "page": 38,
    "components": [
      {
        "effectId": "immunity",
        "ranks": 30,
        "modifiers": []
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Immunity 30 (Fortitude effects), No Stamina rank (–10 points) • 20 points",
      "fixed": 20,
      "perRank": 0,
      "discrepancy": {
        "reason": {
          "en": "The displayed total counts powers only. Absent Stamina is a character-level -10 PP trait; Ghost Form also has a printed one-point mismatch.",
          "pt": "Divergência da fonte: The displayed total counts powers only. Absent Stamina is a character-level -10 PP trait; Ghost Form also has a printed one-point mismatch."
        },
        "fixed": 30,
        "perRank": 0
      }
    },
    "requiresCharacterChanges": {
      "en": "Reference only: this form also removes the character’s Stamina. A power template cannot safely make that character-level change. Configure absent Stamina separately; these powers do not include its refund.",
      "pt": "Apenas referência: esta forma também remove a Vigor do personagem. Um modelo de poder não pode fazer essa alteração com segurança. Configure Vigor ausente separadamente; estes poderes não incluem o desconto."
    }
  },
  {
    "id": "death-necromancy",
    "profileId": "death",
    "name": {
      "en": "Necromancy",
      "pt": "Necromancia"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Summon · Controlled · Horde · Multiple Minions (per effect rank)",
      "pt": "Invocar · Controlado · Horda · Múltiplos Lacaios (por graduação do efeito)"
    },
    "page": 38,
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
      "Death"
    ],
    "audit": {
      "formula": "Summon Undead, Controlled, Horde, Multiple Minions (32 total) • 14 points per rank",
      "fixed": 0,
      "perRank": 14
    }
  },
  {
    "id": "death-speak-with-the-dead",
    "profileId": "death",
    "name": {
      "en": "Speak With the Dead",
      "pt": "Falar com os Mortos"
    },
    "section": {
      "en": "Utility powers",
      "pt": "Poderes utilitários"
    },
    "summary": {
      "en": "Senses",
      "pt": "Sentidos"
    },
    "page": 38,
    "components": [
      {
        "effectId": "senses",
        "ranks": 4,
        "modifiers": [],
        "senseTraits": [
          {
            "id": "postcognition",
            "ranks": 4
          }
        ]
      }
    ],
    "descriptors": [
      "Death"
    ],
    "audit": {
      "formula": "Senses 4 (Postcognition) • 4 points",
      "fixed": 4,
      "perRank": 0
    }
  }
] satisfies PowerTemplate[];
