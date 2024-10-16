import { Molecule } from 'openchemlib';
import { improveMoleculeInfo } from './improveMoleculeInfo.js';
import calculateMoleculeInfoFromIDCode from '../calculate/calculateMoleculeInfoFromIDCode.js';

export async function getInfoFromMolfile(molfile) {
  const molecule = Molecule.fromMolfile(molfile);
  const idCode = molecule.getIDCode();
  const info = calculateMoleculeInfoFromIDCode(idCode);
  info.ssIndex = Buffer.from(info.ssIndex);
  info.atoms = JSON.stringify(info.atoms);
  return improveMoleculeInfo(info);
}
