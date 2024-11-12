export function insertEntry(entry, db) {
  const insertStmt = db.prepare(`INSERT INTO 
        entries(mf, nbAtoms, idCode, coordinates, mw, comment, ssIndex, molfile2D, molfile3D, xyz, lastModificationDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const now = Date.now();
  const newEntryRecord = insertStmt.run(
    entry.mf,
    entry.nbAtoms,
    entry.idCode,
    entry.coordinates,
    entry.mw,
    entry.comment,
    entry.ssIndex,
    entry.molfile2D,
    entry.molfile3D,
    entry.xyz,
    now,
  );
  return newEntryRecord.lastInsertRowid;
}
