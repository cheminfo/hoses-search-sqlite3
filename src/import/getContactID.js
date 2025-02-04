export function getContactID(email, db) {
  const fetchStmt = db.prepare(`SELECT * FROM contacts WHERE email='${email}'`);
  const records = fetchStmt.all();
  if (records.length === 0) return null;
  else return records[0].contactID;
}
