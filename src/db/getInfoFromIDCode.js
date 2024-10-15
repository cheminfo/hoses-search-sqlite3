import debugLibrary from 'debug';

import { improveMoleculeInfo } from './improveMoleculeInfo.js';
import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise.js';

export async function getInfoFromIDCode(idCode) {
  const { promise } = await calculateMoleculeInfoFromIDCodePromise(idCode);
  const info = await promise;
  // convert Uint8Array(64) to number[] to be able to store it in sqlite
  info.ssIndex = Buffer.from(info.ssIndex);
  info.atoms = JSON.stringify(info.atoms);
  return improveMoleculeInfo(info);
}
