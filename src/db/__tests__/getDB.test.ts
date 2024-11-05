import { test, expect } from 'vitest';

import { getTempDB, getAllTableInfo } from '../getDB.js';

test('getDB', async () => {
  const db = await getTempDB();
  expect(db.open).toBeTruthy();

  const info = getAllTableInfo(db).map((row) => row.name);
  expect(info).toEqual([
    'schemaversion',
    'entries',
    'sqlite_sequence',
    'algorithms',
    'energies',
    'hoseCodes',
    'atoms',
  ]);
  db.close();
});
