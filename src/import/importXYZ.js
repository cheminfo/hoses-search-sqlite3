import { enhanceXYZEntries as parseXYZLines } from './enhanceXYZEntries.js';
import { insertEntry } from './insertEntry.js';
import { splitXYZ } from './splitXYZ.js';

export async function importXYZ(content, db) {

  const xyzEntries = splitXYZ(content);

  for (const xyzLines of xyzEntries) {
    const entry = await parseXYZLines(xyzLines);
    insertEntry(entry, db);
  }
}
