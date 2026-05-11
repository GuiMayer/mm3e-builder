import { describe, it, expect, beforeEach } from 'vitest';
import { saveDraft, clearDraft, getDraftMetadata } from '../services/fileService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('fileService - Draft Metadata', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('saves draft with metadata', () => {
    const character = {
      header: { name: 'Batman', player: 'Bruce', identity: 'Secret', base: 'Gotham', powerLevel: 12, heroPoints: 1 },
      abilities: { str: 3, sta: 3, agl: 4, dex: 4, fgt: 5, int: 5, awe: 4, pre: 3 },
      absentAbilities: [],
      defenses: { dodge: 5, parry: 6, fortitude: 4, will: 5 },
      skills: [],
      advantages: [],
      powers: [],
      complications: [],
      equipmentNotes: '',
    };

    const result = saveDraft(character);

    expect(result).toBe(true);
    expect(localStorage.getItem('mm3e-draft-character')).toBeTruthy();
    expect(localStorage.getItem('mm3e-draft-character-metadata')).toBeTruthy();

    const metadata = JSON.parse(localStorage.getItem('mm3e-draft-character-metadata')!);
    expect(metadata.characterName).toBe('Batman');
    expect(metadata.powerLevel).toBe(12);
    expect(metadata.timestamp).toBeTruthy();
  });

  it('getDraftMetadata returns metadata when available', () => {
    const metadata = {
      timestamp: new Date().toISOString(),
      characterName: 'Superman',
      powerLevel: 15,
    };

    localStorage.setItem('mm3e-draft-character-metadata', JSON.stringify(metadata));

    const result = getDraftMetadata();

    expect(result).toEqual(metadata);
  });

  it('getDraftMetadata returns null when no metadata exists', () => {
    const result = getDraftMetadata();

    expect(result).toBeNull();
  });

  it('clearDraft removes both draft and metadata', () => {
    localStorage.setItem('mm3e-draft-character', '{}');
    localStorage.setItem('mm3e-draft-character-metadata', '{}');

    clearDraft();

    expect(localStorage.getItem('mm3e-draft-character')).toBeNull();
    expect(localStorage.getItem('mm3e-draft-character-metadata')).toBeNull();
  });
});
