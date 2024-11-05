import { readFileSync } from 'node:fs';
import { get } from 'node:http';

import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { getAlgorithmID } from '../getAlgorithmID.js';
import { importXYZ } from '../importXYZ.js';

test('importXYZ', async () => {
  const content = readFileSync(new URL('data/test.xyz', import.meta.url));
  const db = await getTempDB();
  const options = {
    xyz: {
      columns: {
        4: {
          algorithm: {
            name: 'GW_charged',
            version: '1.0.0',
            description: 'GW_charged',
          },
        },
        5: {
          algorithm: {
            name: 'dKS_charged',
            version: '1.0.0',
            description: 'dKS_charged',
          },
        },
        6: {
          algorithm: {
            name: 'dKS_neutral',
            version: '1.0.0',
            description: 'dKS_neutral',
          },
        },
      },
      orbital: '2s',
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
