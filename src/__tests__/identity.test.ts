import { describe, expect, it } from 'vitest';
import { validate as isUuid, version as uuidVersion } from 'uuid';
import { createDerivedId, createId } from '../shared/lib/identity';

describe('identity', () => {
  it('creates unique UUID v4 identities for new entities', () => {
    const first = createId();
    const second = createId();

    expect(isUuid(first)).toBe(true);
    expect(uuidVersion(first)).toBe(4);
    expect(second).not.toBe(first);
  });

  it('creates stable UUID v5 identities for migration-derived entities', () => {
    const first = createDerivedId('resource', 'character:item:0');
    const retry = createDerivedId('resource', 'character:item:0');
    const differentScope = createDerivedId('power', 'character:item:0');

    expect(isUuid(first)).toBe(true);
    expect(uuidVersion(first)).toBe(5);
    expect(retry).toBe(first);
    expect(differentScope).not.toBe(first);
  });
});
