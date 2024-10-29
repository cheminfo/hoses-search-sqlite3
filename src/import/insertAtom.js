export function insertAtom(atom, molfileIndex, entryID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
          atoms(molfileIndex, label, entryID) 
          VALUES (?, ?, ?)`);
  insertStmt.run(molfileIndex, atom.atom, entryID);
}
