import { readFileSync } from 'node:fs';

import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { getXYZEnhancedEntry } from '../getXYZEnhancedEntry.js';
import { importXYZ } from '../importXYZ.js';
import { insertEntry } from '../insertEntry.js';
import { splitXYZ } from '../splitXYZ.js';

test('insertEntry', async () => {
  const db = await getTempDB();
  expect(db.open).toBeTruthy();

  const xyzRawData = readFileSync(
    new URL('data/test.xyz', import.meta.url).pathname,
    'utf8',
  );
  const xyzEntries = splitXYZ(xyzRawData);
  const entry = await getXYZEnhancedEntry(xyzEntries[0]);
  insertEntry(entry, db);

  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  delete insertedEntries[0].lastModificationDate;
  expect(insertedEntries).toMatchSnapshot();
});
