import { getHoseCodes } from 'openchemlib-utils';

export function calculateHoseCodes(molecule, entry, options = {}) {
  const { maxSphereSize, stats, statsKeys } = options;
  const hoses = getHoseCodes(molecule, { maxSphereSize });
  const idCode = molecule.getIDCode();
  const map = entry.map;
  const atoms = [];
  for (let i = 0; i < hoses.length; i++) {
    if (entry.atoms[map[i]].atom === 'H') continue;

    for (const key of statsKeys) {
      if (!stats[key]) {
        stats[key] = {};
      }
      const value = Number(entry.atoms[map[i]][key]);

      for (let j = 0; j < hoses[i].length; j++) {
        const hose = hoses[i][j];
        if (!stats[key][hose]) {
          stats[key][hose] = { sources: [], sphere: j, idCode: hose };
        }

        stats[key][hose].sources.push({
          value: value,
          idCode,
          atomLabel: molecule.getAtomLabel(i),
        });
      }
    }

    const atom = {
      atomLabel: molecule.getAtomLabel(i),
      hose: hoses[i].map((hose, index) => ({ oclID: hose, sphere: index })),
      atomIndex: i,
    };
    for (const key of statsKeys) {
      atom[key] = Number(entry.atoms[map[i]][key]);
    }
    atoms.push(atom);
  }
  return atoms;
}
