export function insertEnergy(energy, db, options) {
  const { orbital = null } = options;
  const insertStmt = db.prepare(`INSERT INTO 
          energies(orbital, bindingEnergy, algorithmID, atomID) 
          VALUES (?, ?, ?, ?)`);
  insertStmt.run(orbital);
}
