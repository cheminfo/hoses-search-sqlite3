import debugLibrary from 'debug';

import { getAlgorithmID } from './getAlgorithmID.js';
import { getContactID } from './getContactID.js';
import { getXYZEnhancedEntry } from './getXYZEnhancedEntry.js';
import { insertAlgorithm } from './insertAlgorithm.js';
import { insertAtom } from './insertAtom.js';
import { insertContact } from './insertContact.js';
import { insertEnergy } from './insertEnergy.js';
import { insertEntry } from './insertEntry.js';
import { insertHose } from './insertHose.js';
import { splitXYZ } from './splitXYZ.js';

const debug = debugLibrary('importXYZ');

/**
 * @param {InstanceType<import('better-sqlite3')>} db - the sqlite3 database
 * @param {string} content - raw xyz data
 * @param options
 * @returns {string|number|boolean|object|undefined} - the value of the parameter
 */

export async function importXYZ(content, db, options = {}) {
  const stats = { nbEntries: 0, nbContact: 0, nbAtoms: 0, nbHoses: 0 };
  const xyzEntries = splitXYZ(content);

  const xyzProperties = options.xyz.columns;
  // console.log(xyzProperties);
  for (let p = 0; p < xyzProperties.length; p++) {
    let contactID = getContactID(options.contact.email, db);
    if (contactID === null) {
      contactID = insertContact(options.contact.email, db);
      stats.nbContact++;
    }
    const algorithmID = insertAlgorithm(
      xyzProperties[p].algorithm,
      contactID,
      db,
    );

    for (const xyzLines of xyzEntries) {
      const entry = await getXYZEnhancedEntry(xyzLines, options);
      const entryID = insertEntry(entry, algorithmID, db);
      stats.nbEntries++;
      for (let i = 0; i < entry.atoms.length; i++) {
        const atomID = insertAtom(entry.atoms[i], i, entryID, db);
        stats.nbAtoms++;
        for (let h = 0; h < entry.atoms[i].hoses.length; h++) {
          const hose = entry.atoms[i].hoses[h];
          insertHose(hose, atomID, db);
          stats.nbHoses++;
        }
        for (let j = 0; j < entry.atoms[i].properties.length; j++) {
          const property = entry.atoms[i].properties[j];
          if (!Number.isNaN(property.energy)) {
            const energyAlgorithmID = getAlgorithmID(
              property.algorithm.name,
              property.algorithm.version,
              property.contact,
              db,
            );
            if (energyAlgorithmID === algorithmID) {
              insertEnergy(property, algorithmID, atomID, db);
            }
          }
        }
      }
    }
  }
  return stats;
}
