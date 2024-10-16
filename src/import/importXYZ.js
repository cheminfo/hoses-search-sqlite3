import { getEntries } from '../qm9/utils/getEntries.js';
import { readFileSync } from 'fs';

export function importXYZ(xyzFileName) {
  const xyzData = readFileSync(xyzFileName, 'utf-8');
  const entries = getEntries(xyzData);
  // split XYZ
  return entries;
}
