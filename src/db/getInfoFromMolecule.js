import { Statement } from 'better-sqlite3';
import Debug from 'debug';
import { Molecule } from 'openchemlib';

import { InternalMoleculeInfo } from '../InternalMoleculeInfo';

import getDB from '../getDB';
import { improveMoleculeInfo } from '../improveMoleculeInfo';
import { insertMolecule } from '../insertMolecule';

const debug = Debug('getInfoFromMolecule');

let stmt;

export async function getInfoFromMolecule(
  molecule
) {
  const db = getDB();
  const idCode = molecule.getIDCode();
  if (!stmt) {
    stmt = db.prepare('SELECT * FROM molecules WHERE idCode = ?');
  }
  const resultFromDB = stmt.get(idCode);
  if (resultFromDB) {
    debug('in cache');
    return improveMoleculeInfo(resultFromDB as InternalMoleculeInfo);
  }
  return improveMoleculeInfo(await insertMolecule(idCode, db));
}
