import { getLastRecordIndex } from './getLastRecordIndex.js';
import { getXYZEnhancedEntry } from './getXYZEnhancedEntry.js';
import { insertAtom } from './insertAtom.js';
import { insertEntry } from './insertEntry.js';
import { splitXYZ } from './splitXYZ.js';

export async function importXYZ(content, db, options = {}) {
  const xyzEntries = splitXYZ(content);
  for (const xyzLines of xyzEntries) {
    const entry = await getXYZEnhancedEntry(xyzLines);
    insertEntry(entry, db);
    const lastEntryIndex = getLastRecordIndex('entries', db);
    for (let i = 0; i < entry.atoms.length; i++) {
      insertAtom(entry.atoms[i], i, lastEntryIndex, db);
    }
  }
}
