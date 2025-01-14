/**
 * @param algorithmID
 * @param {InstanceType<import('better-sqlite3')>} db - the sqlite3 database
 * @param {object} entry - raw xyz data
 * @param {number} algorithmID - algorithm ID
 * @returns {number} - the value of the parameter
 */
export function insertEntry(entry, algorithmID, db) {
  const checkIfExistsStmt = db.prepare(`SELECT * FROM entries
    WHERE idCode='${entry.idCode}' AND algorithmID=${algorithmID}`);
  const similarRecords = checkIfExistsStmt.all();

  if (similarRecords.length === 0) {
    const insertStmt = db.prepare(`INSERT INTO 
        entries(mf, idCode, algorithmID, nbAtoms, coordinates, mw, comment, ssIndex, molfile2D, molfile3D, xyz, lastModificationDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const date = entry?.date ? Date.parse(entry.date) : Date.now();
    const newEntryRecord = insertStmt.run(
      entry.mf,
      entry.idCode,
      algorithmID,
      entry.nbAtoms,
      entry.coordinates,
      entry.mw,
      entry.comment,
      entry.ssIndex,
      entry.molfile2D,
      entry.molfile3D,
      entry.xyz,
      date,
    );
    return newEntryRecord.lastInsertRowid;
  } else {
    return similarRecords[0].entryID;
  }
}
