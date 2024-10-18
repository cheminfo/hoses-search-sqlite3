import { test, expect } from 'vitest';
import { importXYZ } from '../importXYZ.js';
import { insertEntry, insertEntries } from '../insertEntry.js';
import { getTempDB, getAllTableInfo } from '../../db/getDB.js';

test('insertEntry', async () => {
  const db = await getTempDB();
  expect(db.open).toBeTruthy();
  const entries = await importXYZ(
    new URL('./data/testInsertEntry.xyz', import.meta.url).pathname,
  );
  for (let entry of entries) {
    insertEntry(entry, db);
  }

  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  const expectedEntries = [
    {
      entryID: 1,
      idCode: 'CH4',
      nbAtoms: 5,
      coordinates:
        '\n' +
        'C 5.02975104 5.59520017 5.38737141\n' +
        'H 5.04461553 4.50000000 5.38133262\n' +
        'H 6.05732741 5.97433493 5.37961885\n' +
        'H 4.50000000 5.95804208 4.50000000\n' +
        'H 4.51704914 5.94841095 6.28853619',
      relativeWeight: 16.04276,
      comment:
        'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"',
      ssIndex: '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
      molFile:
        'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"\n' +
        'Actelion Java MolfileCreator 1.0\n' +
        '\n' +
        '  1  0  0  0  0  0  0  0  0  0999 V2000\n' +
        '    0.0000   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n' +
        'M  END\n',
      xyzFile:
        '5\n' +
        'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"\n' +
        'C 5.02975104 5.59520017 5.38737141\n' +
        'H 5.04461553 4.50000000 5.38133262\n' +
        'H 6.05732741 5.97433493 5.37961885\n' +
        'H 4.50000000 5.95804208 4.50000000\n' +
        'H 4.51704914 5.94841095 6.28853619',
    },
  ];
  delete insertedEntries[0].lastModificationDate;
  expect(insertedEntries).toMatchObject(expectedEntries);
});

test('insertEntries', async () => {
  const db = await getTempDB();
  expect(db.open).toBeTruthy();
  const entries = await importXYZ(
    new URL('./data/testInsertEntries.xyz', import.meta.url).pathname,
  );
  insertEntries(entries, db);
  const stmt = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmt.all();
  console.log(insertEntries);
  const expectedEntries = [
    {
      entryID: 1,
      idCode: "'CH4'",
      nbAtoms: 5,
      coordinates:
        "'\n" +
        'C 5.02975104 5.59520017 5.38737141\n' +
        'H 5.04461553 4.50000000 5.38133262\n' +
        'H 6.05732741 5.97433493 5.37961885\n' +
        'H 4.50000000 5.95804208 4.50000000\n' +
        "H 4.51704914 5.94841095 6.28853619'",
      relativeWeight: 16.04276,
      comment: `'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"'`,
      ssIndex: "'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'",
      molFile:
        `'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"\n` +
        'Actelion Java MolfileCreator 1.0\n' +
        '\n' +
        '  1  0  0  0  0  0  0  0  0  0999 V2000\n' +
        '    0.0000   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n' +
        'M  END\n' +
        "'",
      xyzFile:
        "'5\n" +
        'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"\n' +
        'C 5.02975104 5.59520017 5.38737141\n' +
        'H 5.04461553 4.50000000 5.38133262\n' +
        'H 6.05732741 5.97433493 5.37961885\n' +
        'H 4.50000000 5.95804208 4.50000000\n' +
        "H 4.51704914 5.94841095 6.28853619'",
    },
    {
      entryID: 2,
      idCode: "'CH4'",
      nbAtoms: 5,
      coordinates:
        "'\n" +
        'C 5.02975104 5.59520017 5.38737141\n' +
        'H 5.04461553 4.50000000 5.38133262\n' +
        'H 6.05732741 5.97433493 5.37961885\n' +
        'H 4.50000000 5.95804208 4.50000000\n' +
        "H 4.51704914 5.94841095 6.28853619'",
      relativeWeight: 16.04276,
      comment: `'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"'`,
      ssIndex: "'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'",
      molFile:
        `'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"\n` +
        'Actelion Java MolfileCreator 1.0\n' +
        '\n' +
        '  1  0  0  0  0  0  0  0  0  0999 V2000\n' +
        '    0.0000   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n' +
        'M  END\n' +
        "'",
      xyzFile:
        "'5\n" +
        'Lattice="10.55732741 0.0 0.0 0.0 10.47433493 0.0 0.0 0.0 10.78853619" Properties=species:S:1:pos:R:3:GW_charged:R:1:dKS_charged:R:1:dKS_neutral:R:1 pbc="T T T"\n' +
        'C 5.02975104 5.59520017 5.38737141\n' +
        'H 5.04461553 4.50000000 5.38133262\n' +
        'H 6.05732741 5.97433493 5.37961885\n' +
        'H 4.50000000 5.95804208 4.50000000\n' +
        'H 4.51704914 5.94841095 6.28853619\n' +
        "'",
    },
  ];
  insertedEntries.forEach((entry) => delete entry.lastModificationDate);
  expect(insertedEntries).toMatchObject(expectedEntries);
});
