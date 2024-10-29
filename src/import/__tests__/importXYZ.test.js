import { test, expect } from 'vitest';
import { importXYZ } from '../importXYZ.js';
import { readFileSync } from 'fs';
import { get } from 'http';
import { getTempDB } from '../../db/getDB.js';

test('importXYZ', async () => {

  const content = readFileSync(new URL('./data/test.xyz', import.meta.url));
  const db = await getTempDB()
  await importXYZ(content, db)

  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  console.log(insertedEntries)
  // checkDB


});
