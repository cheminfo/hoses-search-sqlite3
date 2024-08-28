import { readFile } from 'fs/promises';

export async function loadSQLReqest(path) {
  return await readFile(new URL(path, import.meta.url));
}
