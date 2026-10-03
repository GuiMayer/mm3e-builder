import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import { exportCharacterJSON } from '../services/character-file/exportCharacter';
import { createDefaultCharacter } from '../entities/characterDefaults';
import { savePortrait } from '../services/storage/portraitStorage';
import { downloadBlob } from '../services/downloadHelper';

vi.mock('../services/downloadHelper', () => ({ downloadBlob: vi.fn().mockResolvedValue(true), sanitizeFileName: (name: string) => name || 'hero' }));

describe('actual portrait JSON download payload', () => {
  it('exports no local image data or association and only exports a URL when selected', async () => {
    const character = createDefaultCharacter({ characterId: crypto.randomUUID() });
    const image = new Blob(['local-image-bytes'], { type: 'image/png' });
    await savePortrait({ image, thumbnail: image, width: 100, height: 100 }, { characterId: character.characterId! });
    await exportCharacterJSON(character);
    const first = vi.mocked(downloadBlob).mock.calls.at(-1)![0];
    const text = await first.text();
    expect(JSON.parse(text).character.header).not.toHaveProperty('portraitUrl');
    expect(text).not.toContain('local-image-bytes');
    expect(text).not.toContain('data:image');
    await exportCharacterJSON({ ...character, header: { ...character.header, portraitUrl: 'https://example.com/portrait.png' } });
    const last = vi.mocked(downloadBlob).mock.calls.at(-1)![0];
    expect(JSON.parse(await last.text()).character.header.portraitUrl).toBe('https://example.com/portrait.png');
  });
});
