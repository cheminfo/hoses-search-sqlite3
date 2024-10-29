import { convertXYZToMolfile } from '../qm9/utils/convertXYZToMolfile.js';
import { calculateHoseCodes } from '../qm9/utils/calculateHoseCodes.js';
import OCL from 'openchemlib';
const { Molecule } = OCL;

export async function enhanceXYZEntries(lines) {
  const entry = {}
  entry.nbAtoms = parseInt(lines[0]);
  entry.comment = lines[1];
  entry.atoms = [];
  const cleanLines = lines.slice(0);
  for (let i = 2; i < entry.nbAtoms + 2; i++) {
    const line = lines[i];
    const [atom, x, y, z, gw, dksCharged, dksNeutral] = line.split(/\s+/);
    entry.atoms.push({ atom, x, y, z, gw, dksCharged, dksNeutral });
    cleanLines[i] = `${atom} ${x} ${y} ${z}`;
  }
  entry.xyz = cleanLines.join('\n');
  entry.molfile3D = await convertXYZToMolfile(entry.xyz);
  const { molecule, map } = Molecule.fromMolfileWithAtomMap(entry.molfile3D);
  entry.map = Array.from(map);

  entry.mf = molecule.getMolecularFormula().formula;
  entry.mw = molecule.getMolecularFormula().relativeWeight;
  molecule.inventCoordinates()
  entry.molfile2D = molecule.toMolfile();
  console.log(entry.molfile2D)
  const { idCode, coordinates } = molecule.getIDCodeAndCoordinates();
  entry.idCode = idCode
  entry.coordinates = coordinates
  entry.ssIndex = getSSIndex(molecule);
  // entry.hoses = calculateHoseCodes(molecule, entry, options);
  // Object.keys(entry).forEach((prop) => console.log(prop));
  return entry;
}

function getSSIndex(molecule) {
  return Buffer.from(Uint32Array.from(molecule.getIndex()).buffer);
}
