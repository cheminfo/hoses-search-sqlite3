import { convertXYZToMolfile } from './convertXYZToMolfile.mjs';
import { calculateHoseCodes } from './calculateHoseCodes.mjs';
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

  //entries = entries.slice(0, 100);

  let index = 0;
  for (const entry of entries) {
    const density = densities[index];
    entry.index = index++;
    entry.nbAtoms = parseInt(entry.lines[0]);
    if (!entry.nbAtoms === entry.lines.length - 2) {
      throw new Error('nAtoms mismatch');
    }
    entry.comment = entry.lines[1];
    entry.atoms = [];
    const cleanLines = entry.lines.slice(0);
    if (entry.nbAtoms !== density.nbAtoms) {
      throw new Error('nAtoms mismatch');
    }
    for (let i = 2; i < entry.nbAtoms + 2; i++) {
      const line = entry.lines[i];
      const [atom, x, y, z, gw, dksCharged, dksNeutral] = line.split(/\s+/);
      entry.atoms.push({ atom, x, y, z, gw, dksCharged, dksNeutral, cm5: density.atoms[i - 2].cm5, mulliken: density.atoms[i - 2].mulliken });
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
    entry.hoses = calculateHoseCodes(molecule, entry, options);
  }

  return entries;
}
