import { test, expect } from 'vitest';

import { getInfoFromIDCode } from '../getInfoFromIDCode.js';
import { getInfoFromMolfile } from '../getInfoFromMolfile.js';
import { readFileSync } from 'fs';
import { convertXYZToMolfile } from '../../qm9/utils/convertXYZToMolfile.js';

test('getInfoFromMolfile', async () => {
  const xyzData = readFileSync(
    new URL('./data/QM9.xyz', import.meta.url).pathname,
    'utf-8',
  );
  const molfileData = await convertXYZToMolfile(xyzData);
  // console.log(xyzData);
  const result = await getInfoFromMolfile(molfileData);
  // console.log(result);
  expect(result).toStrictEqual({
    mf: 'C8H16O',
    mw: 128.2123441630927,
    em: 128.12011513525002,
    charge: 0,
    atoms: { C: 8, H: 16, O: 1 },
    unsaturation: 1,
    idCode: 'diDH@@RV[fjjQId@',
    noStereoID: 'diDH@@RV[fjj@@',
    noStereoTautomerID: 'diDH@@RV[jjj@MTCDX\x7FRLBicxX~F@',
    logS: -1.981999944895506,
    logP: 1.8562999367713928,
    acceptorCount: 1,
    donorCount: 0,
    rotatableBondCount: 3,
    stereoCenterCount: 2,
    polarSurfaceArea: 17.06999969482422,
    nbFragments: 1,
    ssIndex: [
      1940130608, 738197632, 570425952, 67389440, 339756290, 536870912, 0,
      135168, 16900, 16777216, 16, 0, 16908288, 0, 0, 131088,
    ],
  });
});
