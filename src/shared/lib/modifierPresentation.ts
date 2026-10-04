/** Catalog presentation only; identifiers and pricing remain authoritative. */
export function modifierDefinitionVersion(effectId: string | undefined, modifierId: string): 'legacyMinions' | 'currentMinions' | 'legacyHealing' | 'currentHealing' | undefined {
  if (effectId === 'summon' && modifierId === 'multiple_minions') return 'legacyMinions';
  if (effectId === 'summon' && modifierId === 'multiple_minions_ranked') return 'currentMinions';
  if (effectId === 'healing' && modifierId === 'persistent') return 'legacyHealing';
  if (effectId === 'healing' && modifierId === 'persistent_flat') return 'currentHealing';
}
