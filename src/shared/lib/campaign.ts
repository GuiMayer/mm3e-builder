import type { ICampaign, ICharacter, IPPLogEntry } from '../../entities/types';

export const CAMPAIGN_AMOUNT_LIMIT = 1_000_000;

export function localCampaignDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isCampaignDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isCampaignAmount(value: number): boolean {
  return Number.isSafeInteger(value) && value !== 0 && Math.abs(value) <= CAMPAIGN_AMOUNT_LIMIT;
}

export function validCampaignEntry(entry: Omit<IPPLogEntry, 'id'>): boolean {
  return isCampaignDate(entry.date) && isCampaignAmount(entry.amount) && (entry.kind !== 'award' || entry.amount > 0);
}

export function createCampaign(powerLevel: number, initialPP = powerLevel * 15): ICampaign {
  return { version: 1, initialPowerLevel: powerLevel, initialPP };
}

/** Legacy imports have no starting PL. Preserve their recorded budget until the initial budget is reviewed. */
export function migrateCampaignCharacter(character: ICharacter): ICharacter {
  if (character.campaign || (!character.campaignMode && !character.ppLog?.length)) return character;
  return { ...character, campaign: createCampaign(character.header.powerLevel) };
}

export function campaignInitialPP(character: Pick<ICharacter, 'campaign' | 'header'>): number {
  return character.campaign?.initialPP ?? character.header.powerLevel * 15;
}
