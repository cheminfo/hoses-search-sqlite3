import { readFileSync } from 'node:fs';

import { test, expect } from 'vitest';

import { getTempDB } from '../../db/getDB.js';
import { getAlgorithmID } from '../../import/getAlgorithmID.js';
import { importXYZ } from '../../import/importXYZ.js';
import { getAlgorithmsInfo, getGlobalsInfo } from '../info';

import { testDataProperties } from './data/test.info.js';

test('importXYZ', async () => {
  const contents = [
    readFileSync(new URL('data/test_1.xyz', import.meta.url)),
    readFileSync(new URL('data/test_2.xyz', import.meta.url)),
    readFileSync(new URL('data/test_3.xyz', import.meta.url)),
  ];
  const db = await getTempDB();
  for (let i = 0; i < contents.length; i++) {
    await importXYZ(contents[i], db, testDataProperties[i]);
  }

  const algorithmsInfo = getAlgorithmsInfo(db);
  const globalsInfo = getGlobalsInfo(db);

  expect(algorithmsInfo).toMatchSnapshot('algorithmInfo');
  expect(globalsInfo).toMatchSnapshot('globalsInfo');
});
