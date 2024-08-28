import md5 from 'md5';
import OCL from 'openchemlib/full.js';

import getDB from "./db/getDB.js";

const db = getDB();
const stmt = db.prepare('INSERT OR IGNORE INTO molecules VALUES (@id, @idCode, @ssIndex0, @ssIndex1, @ssIndex2, @ssIndex3, @ssIndex4, @ssIndex5, @ssIndex6, @ssIndex7)');


const moleculesSmiles = ['CCCC', 'c1ccccc1', 'c1ccnccc1', 'CCCF', 'CCCI'];

const ssIndexArray = new BigInt64Array(8);

for (let smiles of moleculesSmiles) {
  const molecule = OCL.Molecule.fromSmiles(smiles);
  const idCode = molecule.getIDCode();
  const data = {
    id: md5(idCode),
    idCode
  }
  const ssIndex = molecule.getIndex()
  for (let i = 0; i < ssIndex.length; i = i + 2) {
    const index = i / 2
    ssIndexArray[index] = BigInt(ssIndex[i]) << 32n + BigInt(ssIndex[i + 1]) // a way to convert 2 32 bit non signed integers into a single signed 64 bit integer
    data[`ssIndex${index}`] = ssIndexArray[index]
  }
  stmt.run(data);
}





