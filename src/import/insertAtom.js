export function insertAtom(atom, entryID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
          atoms(number, label, entryID) 
          VALUES (?, ?, ?)`);
  insertStmt.run();
}
