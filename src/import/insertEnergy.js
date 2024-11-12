import { getAlgorithmID } from './getAlgorithmID';
import { insertAlgorithm } from './insertAlgorithm';

export function insertEnergy(energy, atomID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
          energies(orbital, bindingEnergy, algorithmID, atomID) 
          VALUES (?, ?, ?, ?)`);
  let algorithmID = getAlgorithmID(energy.algorithm, db);
  if (algorithmID === null) {
    algorithmID = insertAlgorithm(energy.algorithm, energy.contact, db);
  }
  const newEnergyRecord = insertStmt.run(
    energy.orbital,
    energy.energy,
    algorithmID,
    atomID,
  );
  return newEnergyRecord.lastInsertRowid;
}
