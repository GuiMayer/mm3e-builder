import { describe, expect, it } from 'vitest';
import { createDefaultCharacter } from '../entities/characterDefaults';
import type { IResource } from '../entities/types';
import {
  POINT_CALCULATION_REVISION,
  hasPricedDraftData,
  shouldShowPointCalculationNotice,
} from '../shared/lib/pointCalculationVersion';

const emptyTab = { character: createDefaultCharacter() };
const powerTab = {
  character: createDefaultCharacter({
    powers: [{
      id: 'power',
      name: 'Power',
      notes: '',
      components: [{
        id: 'component',
        effectId: 'damage',
        ranks: 5,
        modifiers: [],
      }],
      alternateEffects: [],
    }],
  }),
};
const resource: IResource = {
  id: 'resource',
  type: 'gear',
  name: 'Gear',
  notes: '',
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  power: {
    id: 'resource-power',
    name: 'Gear',
    notes: '',
    components: [],
    alternateEffects: [],
  },
};

describe('point calculation revision notice', () => {
  it('does not bother a first-time user with an empty draft', () => {
    expect(hasPricedDraftData([emptyTab], [])).toBe(false);
    expect(shouldShowPointCalculationNotice({
      storedRevision: null,
      isDraftHydrated: true,
      draftLoadError: null,
      tabs: [emptyTab],
      resources: [],
    })).toBe(false);
  });

  it('detects both character powers and resource-only drafts', () => {
    expect(hasPricedDraftData([powerTab], [])).toBe(true);
    expect(hasPricedDraftData([], [resource])).toBe(true);
  });

  it('shows once for old priced data and stops at the current revision', () => {
    const state = {
      isDraftHydrated: true,
      draftLoadError: null,
      tabs: [powerTab],
      resources: [] as IResource[],
    };

    expect(shouldShowPointCalculationNotice({
      ...state,
      storedRevision: null,
    })).toBe(true);
    expect(shouldShowPointCalculationNotice({
      ...state,
      storedRevision: POINT_CALCULATION_REVISION,
    })).toBe(false);
  });

  it('waits for safe hydration and stays quiet after a recovery error', () => {
    expect(shouldShowPointCalculationNotice({
      storedRevision: null,
      isDraftHydrated: false,
      draftLoadError: null,
      tabs: [powerTab],
      resources: [],
    })).toBe(false);
    expect(shouldShowPointCalculationNotice({
      storedRevision: null,
      isDraftHydrated: true,
      draftLoadError: 'draft.recovery.unreadable',
      tabs: [powerTab],
      resources: [],
    })).toBe(false);
  });
});
