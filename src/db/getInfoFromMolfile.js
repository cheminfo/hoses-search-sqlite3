import { Molecule } from 'openchemlib';
import { improveMoleculeInfo } from './improveMoleculeInfo.js';
import calculateMoleculeInfoFromIDCodePromise from '../calculate/calculateMoleculeInfoFromIDCodePromise.js';

export async function getInfoFromMolfile(molfile) {
  const molecule = Molecule.fromMolfile(molfile);
  const idCode = molecule.getIDCode();
  const { promise } = await calculateMoleculeInfoFromIDCodePromise(idCode);
  const info = await promise;
  info.ssIndex = Buffer.from(info.ssIndex);
  info.atoms = JSON.stringify(info.atoms);
  return improveMoleculeInfo(info);
}
