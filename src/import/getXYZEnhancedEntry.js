import OCL from 'openchemlib';
import { TopicMolecule } from 'openchemlib-utils';

import { convertXYZToMolfile } from '../qm9/utils/convertXYZToMolfile.js';

const { Molecule } = OCL;

export async function getXYZEnhancedEntry(lines, options = {}) {
  const { xyz, contact } = options;
  const entry = {};
  entry.nbAtoms = Number.parseInt(lines[0]);
  entry.comment = lines[1];
  entry.atoms = [];
  const cleanLines = lines.slice(0);
  const atoms = [];
  for (let i = 2; i < entry.nbAtoms + 2; i++) {
    const line = lines[i];
    const [atomSymbol, x, y, z, ...properties] = line.split(/\s+/);
    const atom = { atomSymbol, x, y, z, properties: properties.map(Number) };
    if (xyz?.columns) {
      for (let i = 0; i < atom.properties.length; i++) {
        atom.properties[i] = {
          energy: atom.properties[i],
          algorithm: xyz.columns[i].algorithm,
          orbital: xyz.columns[i].orbital,
          contact: contact.email,
        };
      }
    }
    atoms.push(atom);
    cleanLines[i] = `${atomSymbol} ${x} ${y} ${z}`;
  }
  entry.xyz = cleanLines.join('\n');
  entry.molfile3D = await convertXYZToMolfile(entry.xyz);
  const { molecule, map } = Molecule.fromMolfileWithAtomMap(entry.molfile3D);

  const topicMolecule = new TopicMolecule(molecule);
  topicMolecule.ensureMapNo();
  const hoses = topicMolecule.hoseCodes.map((hose) =>
    hose.map((idCode, sphere) => ({ idCode, sphere })),
  );
  entry.atoms = [];
  for (let i = 0; i < map.length; i++) {
    const sourceAtom = map[i];
    entry.atoms.push({ ...atoms[sourceAtom], hoses: hoses[i] });
  }
  entry.mf = molecule.getMolecularFormula().formula;
  entry.mw = molecule.getMolecularFormula().relativeWeight;
  entry.molfile2D = topicMolecule.toMolfileWithH();
  const { idCode, coordinates } = molecule.getIDCodeAndCoordinates();
  entry.idCode = idCode;
  entry.coordinates = coordinates;
  entry.ssIndex = getSSIndex(molecule);
  if (options?.date) entry.date = options.date;
  return entry;
}

function getSSIndex(molecule) {
  return Buffer.from(Uint32Array.from(molecule.getIndex()).buffer);
}
