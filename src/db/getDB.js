import fs, { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import sqLite from 'better-sqlite3';

let db;

export default function getDB() {
  const path = new URL('../../sqlite/', import.meta.url).pathname;
  console.log({ path })
  if (!db) {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    db = sqLite(join(path, 'db.sqlite'));
    // https://www.sqlite.org/wal.html
    // Activating WAL mode allows to get a speed improvement of 100x !!!
    db.pragma('journal_mode = WAL');
  }

  setInterval(() => {
    fs.stat(join(path, 'db.sqlite-wal'), (err, stat) => {
      if (err) {
        if (err.code !== 'ENOENT') throw err;
      } else if (stat.size > 100000000) {
        db.pragma('wal_checkpoint(RESTART)');
      }
    });
  }, 300000).unref();

  const createTable = `
CREATE TABLE IF NOT EXISTS molecules (
  id data_type PRIMARY KEY,
  idCode data_type TEXT,
  ssIndex0 data_type INTEGER,
  ssIndex1 data_type INTEGER,
  ssIndex2 data_type INTEGER,
  ssIndex3 data_type INTEGER,
  ssIndex4 data_type INTEGER,
  ssIndex5 data_type INTEGER,
  ssIndex6 data_type INTEGER,
  ssIndex7 data_type INTEGER
);
CREATE INDEX IF NOT EXISTS ssIndex0 ON molecules(ssIndex0);
CREATE INDEX IF NOT EXISTS ssIndex1 ON molecules(ssIndex1);
CREATE INDEX IF NOT EXISTS ssIndex2 ON molecules(ssIndex2);
CREATE INDEX IF NOT EXISTS ssIndex3 ON molecules(ssIndex3);
CREATE INDEX IF NOT EXISTS ssIndex4 ON molecules(ssIndex4);
CREATE INDEX IF NOT EXISTS ssIndex5 ON molecules(ssIndex5);
CREATE INDEX IF NOT EXISTS ssIndex6 ON molecules(ssIndex6);
CREATE INDEX IF NOT EXISTS ssIndex7 ON molecules(ssIndex7);
`;

  db.exec(createTable);
  return db;
}
