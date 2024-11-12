export function insertAtom(atom, molfileIndex, entryID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
          atoms(molfileIndex, label, entryID) 
          VALUES (?, ?, ?)`);
  const info = insertStmt.run(molfileIndex, atom.atomSymbol, entryID);
  return info.lastInsertRowid;
}
