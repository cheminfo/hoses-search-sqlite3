import OCL from 'openchemlib';
import { TopicMolecule } from 'openchemlib-utils';

import { convertXYZToMolfile } from '../qm9/utils/convertXYZToMolfile.js';

const { Molecule } = OCL;

export async function getXYZEnhancedEntry(lines, options = {}) {
  const { xyz, orbital = null } = options;
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
    // if (xyz?.columns) console.log(xyz.columns);
    console.log(atom.properties);
    // for (let i = 0; i < atom.properties.length; i++) {
    if (xyz?.columns) {
      let propertyIndex = 0;
      for (let k in xyz.columns) {
        // console.log(k, xyz.columns[`${k}`]);
        // console.log(xyz.columns);
        console.log(xyz.columns[k]);
        atom.properties[propertyIndex] = {
          value: atom.properties[propertyIndex],
          algorithm: xyz.columns[`${k}`].algorithm,
        };
        console.log(atom.properties[propertyIndex]);
        propertyIndex++;
      }
      // }
    }

    // console.log('>>> Atome :', atom);
    atoms.push({ atomSymbol, x, y, z, properties: properties.map(Number) });
    cleanLines[i] = `${atomSymbol} ${x} ${y} ${z}`;
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
    // console.log(entry.atoms);
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
