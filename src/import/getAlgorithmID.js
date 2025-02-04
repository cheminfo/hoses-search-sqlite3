import { getContactID } from './getContactID.js';

export function getAlgorithmID(name, version, contactEmail, db) {
  const contactID = getContactID(contactEmail, db);

  const fetchStmt = db.prepare(
    `SELECT * FROM algorithms WHERE name='${name}' AND version='${version}' AND contactID=${contactID}`,
  );
  const record = fetchStmt.all();
  if (record.length === 0) return null;
  else return record[0].algorithmID;
}
