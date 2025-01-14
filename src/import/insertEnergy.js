import { getAlgorithmID } from './getAlgorithmID.js';
import { insertAlgorithm } from './insertAlgorithm.js';

export function insertEnergy(energy, atomID, db) {
  const insertStmt = db.prepare(`INSERT INTO 
          energies(orbital, bindingEnergy, algorithmID, atomID) 
          VALUES (?, ?, ?, ?)`);

  const newEnergyRecord = insertStmt.run(
    energy.orbital,
    energy.energy,
    algorithmID,
    atomID,
  );
  return newEnergyRecord.lastInsertRowid;
}
