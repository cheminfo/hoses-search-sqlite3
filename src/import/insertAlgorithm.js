import { getContactID } from './getContactID.js';
import { insertContact } from './insertContact.js';

export function insertAlgorithm(algorithm, contactMail, db) {
  let contactID = getContactID(contactMail, db);
  if (contactID === null) contactID = insertContact(contactMail, db);

  const checkIfExistsStmt = db.prepare(
    `SELECT * FROM algorithms WHERE 
    algorithms.name = '${algorithm.name}' AND 
    algorithms.version = '${algorithm.version}' AND 
    algorithms.contactID = ${contactID}`,
  );
  const similarRecords = checkIfExistsStmt.all();

  if (similarRecords.length === 0) {
    const insertStmt = db.prepare(`INSERT INTO 
    algorithms(name, version, description, contactID) 
    VALUES (?, ?, ?, ?)`);
    const newAlgorithmRecord = insertStmt.run(
      algorithm.name,
      algorithm.version,
      algorithm.description,
      contactID,
    );
    return newAlgorithmRecord.lastInsertRowid;
  } else {
    return similarRecords[0].algorithmID;
  }
}
