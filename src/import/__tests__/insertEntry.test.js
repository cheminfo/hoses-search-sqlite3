import { readFileSync } from 'node:fs';

import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { getContactID } from '../getContactID.js';
import { getXYZEnhancedEntry } from '../getXYZEnhancedEntry.js';
import { insertAlgorithm } from '../insertAlgorithm.js';
import { insertContact } from '../insertContact.js';
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
  let xyzProperties = options.xyz.columns;

  for (let p = 0; p < xyzProperties.length; p++) {
    let contactID = getContactID(options.contact.email, db);
    if (contactID === null) {
      contactID = insertContact(options.contact.email, db);
    }
    const algorithmID = insertAlgorithm(
      xyzProperties[p].algorithm,
      contactID,
      db,
    );

    for (const xyzLines of xyzEntries) {
      const entry = await getXYZEnhancedEntry(xyzLines, options);
      insertEntry(entry, algorithmID, db);
    }
  }
  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  // console.log(insertedEntries);
  for (let e = 0; e < insertedEntries.length; e++) {
    delete insertedEntries[e].lastModificationDate;
  }
  expect(insertedEntries).toMatchSnapshot();
});
