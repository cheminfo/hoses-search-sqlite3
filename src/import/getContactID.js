import { insertContact } from './insertContact.js';

export function getContactID(email, db) {
  const fetchStmt = db.prepare(`SELECT * FROM contacts WHERE email='${email}'`);
  const record = fetchStmt.all();
  if (record.length === 0) return null;
  else return record[0].contactID;
}
