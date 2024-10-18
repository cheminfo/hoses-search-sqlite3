import { getDB } from '../db/getDB.js';
import sqLite from 'better-sqlite3';

export function insertEntry(entry, db) {
  let coordinates = '';
  for (let atom of entry.atoms) {
    coordinates = coordinates
      .concat('\n', atom.atom)
      .concat(' ', atom.x)
      .concat(' ', atom.y)
      .concat(' ', atom.z);
  }

  let now = new Date().toJSON();

  const insertRequest = `INSERT INTO 
  entries(idCode, nbAtoms, coordinates, relativeWeight, comment, ssIndex, molFile, xyzFile, lastModificationdate) 
  VALUES (
    '${entry.mf}',
    ${entry.nbAtoms},
    '${coordinates}',
    ${entry.mw},
    '${entry.comment}',
    '${entry.ssIndex}',
    '${entry.molfile2D}',
    '${entry.xyz}',
    '${now}'
    );`;
  db.exec(insertRequest);
}

export function insertEntries(entries, db) {
  const insertStmt = db.prepare(`INSERT INTO 
        entries(idCode, nbAtoms, coordinates, relativeWeight, comment, ssIndex, molFile, xyzFile, lastModificationdate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const entry of entries) {
    let coordinates = '';
    for (let atom of entry.atoms) {
      coordinates = coordinates
        .concat('\n', atom.atom)
        .concat(' ', atom.x)
        .concat(' ', atom.y)
        .concat(' ', atom.z);
    }
    const now = new Date().toJSON;
    insertStmt.run(
      `'${entry.mf}'`,
      entry.nbAtoms,
      `'${coordinates}'`,
      entry.mw,
      `'${entry.comment}'`,
      `'${entry.ssIndex}'`,
      `'${entry.molfile2D}'`,
      `'${entry.xyz}'`,
      `'${now}'`,
    );
  }
}
