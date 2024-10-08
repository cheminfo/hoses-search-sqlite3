import { convertXYZToMolfile } from './convertXYZToMolfile.js';
import { calculateHoseCodes } from './calculateHoseCodes.js';
import OCL from 'openchemlib';
const { Molecule } = OCL;

export async function getEntries(xyz, options = {}) {
  const { densities } = options;
  let entry;
  let entries = [];
  let lines = xyz.split('\n');
  for (let line of lines) {
    if (line.match(/^[0-9]+$/)) {
      entry = { lines: [] };
      entries.push(entry);
    }
    entry.lines.push(line);
  }

  let index = 0;
  for (const entry of entries) {
    entry.index = index++;
    entry.nbAtoms = parseInt(entry.lines[0]);
    entry.comment = entry.lines[1];
    entry.atoms = [];
    const cleanLines = entry.lines.slice(0);
    for (let i = 2; i < entry.nbAtoms + 2; i++) {
      const line = entry.lines[i];
      const [atom, x, y, z, gw, dksCharged, dksNeutral] = line.split(/\s+/);
      entry.atoms.push({ atom, x, y, z, gw, dksCharged, dksNeutral });
      cleanLines[i] = `${atom} ${x} ${y} ${z}`;
    }
    entry.xyz = cleanLines.join('\n');
    entry.molfile3D = await convertXYZToMolfile(entry.xyz);
    const { molecule, map } = Molecule.fromMolfileWithAtomMap(entry.molfile3D);
    entry.map = Array.from(map);

    molecule.inventCoordinates();
    entry.mf = molecule.getMolecularFormula().formula;
    entry.mw = molecule.getMolecularFormula().relativeWeight;
    entry.molfile2D = molecule.toMolfile();
    // entry.hoses = calculateHoseCodes(molecule, entry, options);
    console.log('>>> XYZ : ', entry.xyz);
  }

  return entries;
}
