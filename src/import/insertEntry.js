import { getDB } from '../db/getDB.js';
import sqLite from 'better-sqlite3';

export default function insertEntry(entry, db) {
  let coordinates = '';
  for (let atom of entry.atoms) {
    coordinates = coordinates
      .concat('\n', atom.atom)
      .concat(' ', atom.x)
      .concat(' ', atom.y)
      .concat(' ', atom.z);
  }
  const insertRequest = `INSERT INTO entries VALUES (
    ${entry.mf},
    ${entry.nbAtoms},
    ${coordinates}
    ${entry.mw},
    ${entry.comment},
    ${entry.ssIndex}
    ${entry.molfile2D},
    ${entry.xyz},
    );`;

  //   db.exec(insertRequest);
}
