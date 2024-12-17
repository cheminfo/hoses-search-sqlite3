export function insertContact(email, db) {
  const insertStmt = db.prepare(`INSERT INTO 
            contacts(email) 
            VALUES (?)`);
  const newContact = insertStmt.run(email);
  return newContact.lastInsertRowid;
}
