import { readFileSync } from 'node:fs';

import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { getAlgorithmID } from '../getAlgorithmID.js';
import { importXYZ } from '../importXYZ.js';

test('importXYZ', async () => {
  const content = readFileSync(new URL('data/test.xyz', import.meta.url));
  const db = await getTempDB();
  const options = {
    contact: {
      email: '',
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
  await importXYZ(content, db, options);

  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  const stmtAtoms = db.prepare('SELECT * FROM atoms');
  const insertedAtoms = stmtAtoms.all();
  for (let column in options.xyz.columns) {
    getAlgorithmID(options.xyz.columns[column], db);
  }
  console.log(getAlgorithmID(options.xyz.columns['5'].algorithm, db));
  // checkDB
});
