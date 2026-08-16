import { useDraftAutoSave } from '../hooks/useDraftAutoSave';

/** Keeps character persistence active regardless of the selected application view. */
export function DraftPersistenceController() {
  useDraftAutoSave();
  return null;
}
