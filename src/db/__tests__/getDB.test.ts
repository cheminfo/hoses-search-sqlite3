import { test, expect } from 'vitest';

import { getTempDB, getAllTableInfo } from '../getDB.js';

test('getDB', async () => {
  const db = await getTempDB();
  expect(db.open).toBeTruthy();

  const info = getAllTableInfo(db).map((row) => row.name);
  expect(info).toEqual(['schemaversion', 'entries', 'hoseCodes', 'measures']);
  db.close();
});
