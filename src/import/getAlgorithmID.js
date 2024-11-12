import { insertAlgorithm } from './insertAlgorithm';

export function getAlgorithmID(algorithm, db) {
  const fetchStmt = db.prepare(
    `SELECT * FROM algorithms WHERE name='${algorithm.name}' AND version='${algorithm.version}'`,
  );
  const record = fetchStmt.all();
  if (record.length === 0) return null;
  else return record[0].algorithmID;
}
