import { getEntries } from '../qm9/utils/getEntries.js';
import { readFileSync } from 'fs';

export function importXYZ(xyzFileName) {
  const xyzData = readFileSync(xyzFileName, 'utf-8');
  // console.log(xyzData);
  const entries = getEntries(xyzData);
  // console.log(entries);
  // split XYZ
  return entries;
}
