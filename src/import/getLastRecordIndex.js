export function getLastRecordIndex(tableName, db) {
  const stmt = db.prepare(
    `SELECT * FROM ${tableName} ORDER BY 1 DESC LIMIT 1;`,
  );
  const lastRecord = stmt.all();
  return lastRecord[0][Object.keys(lastRecord[0])[0]];
}
