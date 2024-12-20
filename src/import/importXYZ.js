import debugLibrary from 'debug';

import { getXYZEnhancedEntry } from './getXYZEnhancedEntry.js';
import { insertAtom } from './insertAtom.js';
import { insertEnergy } from './insertEnergy.js';
import { insertEntry } from './insertEntry.js';
import { insertHose } from './insertHose.js';
import { splitXYZ } from './splitXYZ.js';

const debug = debugLibrary('importXYZ');

export async function importXYZ(content, db, options = {}) {
  const stats = { nbEntries: 0 };
  const xyzEntries = splitXYZ(content);
  let counter = 0;
  for (const xyzLines of xyzEntries) {
    const entry = await getXYZEnhancedEntry(xyzLines, options);
    const entryID = insertEntry(entry, db);
    stats.nbEntries++;
    counter++;
    if (counter % 100 === 0) {
      debug(`Imported ${counter} entries`);
    }
    for (let i = 0; i < entry.atoms.length; i++) {
      let atomID = insertAtom(entry.atoms[i], i, entryID, db);
      for (let p = 0; p < entry.atoms[i].properties.length; p++) {
        let property = entry.atoms[i].properties[p];
        if (!Number.isNaN(property.energy)) {
          insertEnergy(property, atomID, db);
        }
      }
      if (entry.atoms[i]?.hoses) {
        for (let h = 0; h < entry.atoms[i].hoses.length; h++) {
          insertHose(entry.atoms[i].hoses[h], atomID, db);
          // console.log(entry.atoms[i].hoses[h], atomID);
        }
      }
    }
  }
  return stats;
}
