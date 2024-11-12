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

  await importXYZ(content, db, options);

  const stmtEntries = db.prepare('SELECT * FROM entries');
  const insertedEntries = stmtEntries.all();
  for (let entry of insertedEntries) delete entry.lastModificationDate;
  expect(insertedEntries).toMatchSnapshot('entriesTable');

  const stmtAtoms = db.prepare('SELECT * FROM atoms');
  const insertedAtoms = stmtAtoms.all();
  expect(insertedAtoms).toMatchSnapshot('atomsTable');

  const stmtEnergies = db.prepare('SELECT * FROM energies');
  const insertedEnergies = stmtEnergies.all();
  expect(insertedEnergies).toMatchSnapshot('energiesTable');

  const stmtAlgorithms = db.prepare('SELECT * FROM algorithms');
  const insertedAlgorithms = stmtAlgorithms.all();
  expect(insertedAlgorithms).toMatchFileSnapshot('algorithmsTable');

  const stmtHoses = db.prepare('SELECT * FROM hoseCodes');
  const insertedHoses = stmtHoses.all();
  expect(insertedHoses).toMatchSnapshot('hoseCodesTable');

  const stmtContacts = db.prepare('SELECT * FROM contacts');
  const insertedContacts = stmtContacts.all();
  expect(insertedContacts).toMatchSnapshot('contactsTable');
});
