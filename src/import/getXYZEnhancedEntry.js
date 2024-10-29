import { convertXYZToMolfile } from '../qm9/utils/convertXYZToMolfile.js';
import OCL from 'openchemlib';
import { TopicMolecule } from 'openchemlib-utils';
const { Molecule } = OCL;

export async function getXYZEnhancedEntry(lines, options = {}) {
  const entry = {};
  entry.nbAtoms = parseInt(lines[0]);
  entry.comment = lines[1];
  entry.atoms = [];
  const cleanLines = lines.slice(0);
  const atoms = [];
  for (let i = 2; i < entry.nbAtoms + 2; i++) {
    const line = lines[i];
    const [atom, x, y, z, ...properties] = line.split(/\s+/);
    atoms.push({ atom, x, y, z, properties: properties.map(Number) });
    cleanLines[i] = `${atom} ${x} ${y} ${z}`;
  }
  entry.xyz = cleanLines.join('\n');
  entry.molfile3D = await convertXYZToMolfile(entry.xyz);
  const { molecule, map } = Molecule.fromMolfileWithAtomMap(entry.molfile3D);

  const topicMolecule = new TopicMolecule(molecule);
  topicMolecule.ensureMapNo();
  const hoses = topicMolecule.hoseCodes.map((hoses) =>
    hoses.map((value, sphere) => ({ value, sphere })),
  );
  entry.atoms = [];
  for (let i = 0; i < map.length; i++) {
    const sourceAtom = map[i];
    entry.atoms.push({ ...atoms[sourceAtom], hoses: hoses[i] });
  }

  entry.mf = molecule.getMolecularFormula().formula;
  entry.mw = molecule.getMolecularFormula().relativeWeight;

  //  topicMolecule.molecule.inventCoordinates();

  entry.molfile2D = topicMolecule.toMolfileWithH();
  const { idCode, coordinates } = molecule.getIDCodeAndCoordinates();
  entry.idCode = idCode;
  entry.coordinates = coordinates;
  entry.ssIndex = getSSIndex(molecule);
  // entry.hoses = calculateHoseCodes(molecule, entry, options);
  // Object.keys(entry).forEach((prop) => console.log(prop));
  return entry;
}

function getSSIndex(molecule) {
  return Buffer.from(Uint32Array.from(molecule.getIndex()).buffer);
}
