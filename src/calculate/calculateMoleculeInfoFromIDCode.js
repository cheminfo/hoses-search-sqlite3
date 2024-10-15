import { Molecule } from 'openchemlib';

import calculateMoleculeInfo from './calculateMoleculeInfo.js';

export default function calculateMoleculeInfoFromIDCode(idCode, options = {}) {
  const info = calculateMoleculeInfo(Molecule.fromIDCode(idCode), options);
  // surprisingly in some cases the idCode is not 'stable' and if we recreate the idCode we don't obtain the same code
  info.idCode = idCode;

  return info;
}
