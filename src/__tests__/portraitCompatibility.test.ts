import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { CharacterSchema } from '../entities/schemas';
import { sanitizeCharacterForExport } from '../services/character-file/sanitizeCharacter';
import { importCharacterJSON } from '../services/character-file/importCharacter';
import { calculateCharacterPointSummary } from '../shared/lib/pointSummary';
import { POWER_DEFS, MODIFIER_DEFS } from '../entities/gameDataLoaders';
import { SCHEMA_VERSION } from '../entities/constants';

describe('portrait file compatibility', () => {
  it('keeps old characters free of portrait fields and preserves their game data', async () => {
    const old = createDefaultCharacter({ header: { name: 'Hero', player: '', identity: '', base: '', powerLevel: 10, heroPoints: 1 } });
    const file = new File([JSON.stringify({ schemaVersion: '2.1.0', exportedAt: new Date().toISOString(), character: old })], 'old.json');
    const imported = await importCharacterJSON(file);
    expect(imported.header).toEqual(old.header);
    expect(JSON.parse(JSON.stringify(sanitizeCharacterForExport(imported))).header).not.toHaveProperty('portraitUrl');
  });

  it('round-trips only a portable URL and leaves calculations unchanged', async () => {
    const character = createDefaultCharacter();
    const withPortrait = { ...character, header: { ...character.header, portraitUrl: 'https://example.com/hero.png' } };
    const exported = sanitizeCharacterForExport(withPortrait);
    const imported = await importCharacterJSON(new File([JSON.stringify({ schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), character: exported })], 'hero.json'));
    expect(imported.header.portraitUrl).toBe(withPortrait.header.portraitUrl);
    expect(calculateCharacterPointSummary(withPortrait, [], POWER_DEFS, MODIFIER_DEFS)).toEqual(calculateCharacterPointSummary(character, [], POWER_DEFS, MODIFIER_DEFS));
    const header = { ...imported.header }; delete header.portraitUrl;
    expect(header).toEqual(sanitizeCharacterForExport(character).header);
  });

  it.each(['blob:https://example.com/123', 'data:image/png;base64,abc', 'file:///portrait.png', 'http://example.com/portrait.png'])('rejects nonportable portrait address %s', portraitUrl => {
    const character = createDefaultCharacter();
    expect(CharacterSchema.safeParse({ ...character, header: { ...character.header, portraitUrl } }).success).toBe(false);
  });
});
