import { getXYZEnhancedEntry } from './getXYZEnhancedEntry.js';
import { insertEntry } from './insertEntry.js';
import { splitXYZ } from './splitXYZ.js';

export async function importXYZ(content, db, options = {}) {

  const xyzEntries = splitXYZ(content);

  for (const xyzLines of xyzEntries) {
    const entry = await getXYZEnhancedEntry(xyzLines);
    insertEntry(entry, db);
  }
}
