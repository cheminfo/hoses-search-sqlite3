
import { ensureString } from 'ensure-string'
export function splitXYZ(content) {
  content = ensureString(content);
  let entries = [];
  let entry;
  let lines = content.split('\n');
  for (let line of lines) {
    if (line.match(/^[0-9]+$/)) {
      entry = [];
      entries.push(entry);
    }
    if (!entry) {
      throw new Error('No number of atoms found in the first line');
    }
    entry.push(line);
  }
  return entries;
}