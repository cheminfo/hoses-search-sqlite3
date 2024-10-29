export async function getDensities(xyz, options = {}) {
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
    entry.nbAtoms = Number.parseInt(entry.lines[0]);
    if (!entry.nbAtoms === entry.lines.length - 2) {
      throw new Error('nAtoms mismatch');
    }
    entry.comment = entry.lines[1];
    entry.atoms = [];
    const cleanLines = entry.lines.slice(0);
    for (let i = 2; i < entry.nbAtoms + 2; i++) {
      const line = entry.lines[i];
      const [atom, mulliken, cm5] = line.split(/\s+/);
      entry.atoms.push({ atom, mulliken, cm5 });
    }
  }

  return entries;
}
