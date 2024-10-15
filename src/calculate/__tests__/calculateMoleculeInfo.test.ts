import { readFileSync } from 'fs';
import { join } from 'path';

import { Molecule } from 'openchemlib';
import { test, expect } from 'vitest';

import calculateMoleculeInfoFromIDCode from '../calculateMoleculeInfoFromIDCode';

const molfile = readFileSync(join(__dirname, 'molfile.txt'), 'utf8');

test('should first', () => {
  const molecule = Molecule.fromMolfile(molfile);
  const idCode = molecule.getIDCode();
  const info = calculateMoleculeInfoFromIDCode(idCode);
  expect(info).toMatchInlineSnapshot(`
    {
      "acceptorCount": 0,
      "atoms": {
        "C": 6,
        "H": 14,
      },
      "charge": 0,
      "donorCount": 0,
      "em": 86.10955045122,
      "idCode": "gGP@DiVj\`@",
      "logP": 2.7947999835014343,
      "logS": -2.0640000104904175,
      "mf": "C6H14",
      "mw": 86.17558593719237,
      "nbFragments": 1,
      "noStereoID": "gGP@DiVj\`@",
      "noStereoTautomerID": "gGP@DiVj\`@",
      "polarSurfaceArea": 0,
      "rotatableBondCount": 3,
      "ssIndex": {
        "data": [
          0,
          0,
          129,
          98,
          0,
          0,
          0,
          8,
          0,
          0,
          0,
          2,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
        "type": "Buffer",
      },
      "stereoCenterCount": 0,
      "unsaturation": 0,
    }
  `);
});
