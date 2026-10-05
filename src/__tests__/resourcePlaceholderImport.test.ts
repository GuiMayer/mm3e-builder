import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { ICharacterPower, IResource } from '../entities/types';
import { serializeCharacterJSON } from '../services/character-file/exportCharacter';
import { importCharacterJSON } from '../services/character-file/importCharacter';
import { importResourceAppendix } from '../services/character-file/importResourceAppendix';
import { validateImportedReferences } from '../services/character-file/validateImportedReferences';
import { parseDraftBundle, serializeDraftBundle, parseResourceLibrary, serializeResourceLibrary } from '../services/draftTransfer';
import { I18nError } from '../services/character-file/errors';

const placeholder: ICharacterPower = { id: 'power', name: '', notes: '', alternateEffects: [], components: [{ id: 'component', effectId: '', ranks: 1, modifiers: [], fieldValues: {} }] };
const resource: IResource = { id: '25e5268a-df4b-49bf-8501-faeb927a2fe6', name: 'Unconfigured resource', notes: 'Keep these notes', createdAt: '2026-10-02', updatedAt: '2026-10-02', type: 'gadget', power: placeholder, costMode: 'equipment', costReviewRequired: false };
const character = createDefaultCharacter({ characterId: 'cf4a9ed2-ac7c-41c6-bd9e-ac8187b2c139', resourceLinks: [{ id: 'link', resourceId: resource.id, isFree: true }] });

describe('unconfigured resource import compatibility', () => {
  it('round-trips a linked resource placeholder without deleting or rewriting data', async () => {
    const file = new File([serializeCharacterJSON(character, 'pt-BR', [resource])], 'character.json');
    const imported = await importCharacterJSON(file);
    const resources = await importResourceAppendix(file);
    const before = JSON.stringify({ imported, resources });
    expect(() => validateImportedReferences([imported], resources)).not.toThrow();
    expect(resources[0]).toEqual(resource);
    expect(imported.resourceLinks).toEqual(character.resourceLinks);
    expect(JSON.stringify({ imported, resources })).toBe(before);
  });

  it('accepts the same placeholder in draft and resource-library imports', () => {
    const draft = parseDraftBundle(serializeDraftBundle([{ id: 'tab', character, label: 'Hero', lastModified: 1, isDirty: false }], 'tab', [resource]));
    expect(() => validateImportedReferences(draft.tabs.map(tab => tab.character), draft.resources)).not.toThrow();
    const library = parseResourceLibrary(serializeResourceLibrary([resource]));
    expect(() => validateImportedReferences([], library)).not.toThrow();
    expect(library[0]).toEqual(resource);
  });

  it('keeps empty character powers invalid', () => {
    expect(() => validateImportedReferences([createDefaultCharacter({ powers: [placeholder] })], [])).toThrow('errors.validationError');
  });

  it.each([
    { effectId: 'unknown-effect' },
    { ranks: 2 },
    { modifiers: [{ modifierId: 'limited', ranks: 1 }] },
    { fieldValues: { detail: 'Preserve configuration' } },
    { enhancedTarget: { kind: 'ability' as const, key: 'str' as const } },
  ])('rejects partially configured or unknown effects and reports the resource path (%j)', change => {
    const configured: IResource = { ...resource, power: { ...placeholder, components: [{ ...placeholder.components[0], ...change }] } };
    let failure: unknown;
    try { validateImportedReferences([], [configured]); } catch (error) { failure = error; }
    expect(failure).toBeInstanceOf(I18nError);
    expect((failure as I18nError).i18nParams?.field).toBe('resources.0.power.components.0.effectId');
  });

  it('does not skip an invalid alternate effect alongside a blank base', () => {
    const configured: IResource = { ...resource, power: { ...placeholder, alternateEffects: [{ ...placeholder, id: 'alternate', dynamic: false }] } };
    expect(() => validateImportedReferences([], [configured])).toThrow('errors.validationError');
  });
});
