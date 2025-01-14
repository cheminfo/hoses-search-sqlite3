import { readFileSync } from 'node:fs';

import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { getXYZEnhancedEntry } from '../getXYZEnhancedEntry.js';
import { insertAlgorithm } from '../insertAlgorithm.js';
import { insertEntry } from '../insertEntry.js';
import { splitXYZ } from '../splitXYZ.js';

test('insertEntry', async () => {
  const db = await getTempDB();
  expect(db.open).toBeTruthy();

  const xyzRawData = readFileSync(
    new URL('data/test.xyz', import.meta.url).pathname,
    'utf8',
  );

  const options = {
    contact: {
      email: 'test@test.ch',
    },
    xyz: {
      columns: [
        {
          column: 4,
          orbital: '2s',
          algorithm: {
            name: 'GW_charged',
            version: '1.0.0',
            description: 'GW_charged',
          },
        },
        {
          column: 5,
          orbital: '2s',
          algorithm: {
            name: 'dKS_charged',
            version: '1.0.0',
            description: 'dKS_charged',
          },
        },
        {
          column: 6,
          orbital: '2s',
          algorithm: {
            name: 'dKS_neutral',
            version: '1.0.0',
            description: 'dKS_neutral',
          },
        },
      ],
    },
  };

  const xyzEntries = splitXYZ(xyzRawData);
  const entry = await getXYZEnhancedEntry(xyzEntries[0], options);
  console.log(entry.atoms);

  for (let i = 0; i < entry.atoms.length; i++) {
    for (let p = 0; p < entry.atoms[i].properties.length; p++) {
      const property = entry.atoms[i].properties[p];
      if (!Number.isNaN(property.energy)) {
        const algorithmID = insertAlgorithm(
          property.algorithm,
          property.contact,
          db,
        );
        // Will import the contact if needed at the same time
        insertEntry(entry, algorithmID, db);
      }
    }
  }

  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  console.log(insertedEntries);
  for (let e = 0; e < insertedEntries.length; e++) {
    delete insertedEntries[e].lastModificationDate;
  }
  expect(insertedEntries).toMatchSnapshot();
});
