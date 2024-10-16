import debugLibrary from 'debug';

import { improveMoleculeInfo } from './improveMoleculeInfo.js';
import calculateMoleculeInfoFromIDCode from '../calculate/calculateMoleculeInfoFromIDCode.js';

export async function getInfoFromIDCode(idCode) {
  const info = calculateMoleculeInfoFromIDCode(idCode);
  // convert Uint8Array(64) to number[] to be able to store it in sqlite
  info.ssIndex = Buffer.from(info.ssIndex);
  info.atoms = JSON.stringify(info.atoms);
  return improveMoleculeInfo(info);
}
