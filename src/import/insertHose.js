export function insertHose(hose, atomID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
            hoseCodes(value, sphere, atomID) 
            VALUES (?, ?, ?)`);
  const info = insertStmt.run(hose.value, hose.sphere, atomID);
  return info.lastInsertRowid;
}
