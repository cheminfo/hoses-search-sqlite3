import { test, expect } from 'vitest';
import { importXYZ } from '../importXYZ.js';
import { readFileSync } from 'fs';
import { get } from 'http';
import { getTempDB } from '../../db/getDB.js';

test('importXYZ', async () => {
  const content = readFileSync(new URL('./data/test.xyz', import.meta.url));
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
    },
  };
  await importXYZ(content, db, options);

  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  // checkDB
});
