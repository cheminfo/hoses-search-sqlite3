export function insertContact(mail, db) {
  const insertStmt = db.prepare(`INSERT INTO 
            contacts(mail) 
            VALUES (?)`);
  const newContact = insertStmt.run(mail);
  return newContact.lastInsertRowid;
}
