import fs, { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { loadSQLReqest } from './loadSQLRequest.js';

import sqLite from 'better-sqlite3';

let db;

export function getDB() {
  const path = new URL('../../sqlite/', import.meta.url).pathname; // ":memory:" for creating an in-memory database
  console.log({ path });
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

  const createTable = loadSQLReqest('./SQL/createTable.sql');
  // console.log(createTable);

  db.exec(createTable);
  return db;
}
