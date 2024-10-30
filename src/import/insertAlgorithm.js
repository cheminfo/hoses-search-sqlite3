export function insertAlgorithm(algorithm, db) {
  const insertStmt = db.prepare(`INSERT INTO 
    algorithms(name, version, description) 
    VALUES (?, ?, ?)`);
  const newAlgorithmRecord = insertStmt.run(
    algorithm.name,
    algorithm.version,
    algorithm.description,
  );
  return newAlgorithmRecord.lastInsertRowid;
}
