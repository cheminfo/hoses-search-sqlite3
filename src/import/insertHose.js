export function insertHose(hose, atomID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
            hoses(idCode, sphere, atomID) 
            VALUES (?, ?, ?)`);
  const info = insertStmt.run(hose.idCode, hose.sphere, atomID);
  return info.lastInsertRowid;
}
