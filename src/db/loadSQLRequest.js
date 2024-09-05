import { readFileSync } from 'fs';

export function loadSQLReqest(path) {
  const query = readFileSync(new URL(path, import.meta.url), 'utf-8');
  //   console.log(query);
  return query;
}
