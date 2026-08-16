import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';

// Keep this namespace stable forever: changing it would change every UUID
// deterministically derived during legacy-data migrations.
const DERIVED_ID_NAMESPACE = '294e89a5-d9b7-4cae-9f16-97fe1ec74e40';

export type DerivedIdScope =
  | 'resource'
  | 'power'
  | 'link';

/** Creates the identity of a new user-owned persisted entity. */
export function createId(): string {
  return uuidv4();
}

/** Creates a retry-safe identity for an entity derived by a migration. */
export function createDerivedId(scope: DerivedIdScope, seed: string): string {
  return uuidv5(`${scope}:${seed}`, DERIVED_ID_NAMESPACE);
}
