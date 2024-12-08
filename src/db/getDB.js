import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DatabaseSync } from 'node:sqlite';
import Postgrator from 'postgrator';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db;

export async function getDB() {
  if (!db?.open) {
    const path = new URL('../../sqlite/', import.meta.url).pathname;
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    db = new DatabaseSync(join(path, 'db.sqlite'));
    // https://www.sqlite.org/wal.html
    // Activating WAL mode allows to get a speed improvement of 100x !!!
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA synchronous=NORMAL');
  }
  await prepareDB(db);
  return db;
}

export function getAllTableInfo(db) {
  const sql = `
SELECT name, sql
FROM sqlite_master
WHERE type='table';`;
  const stmt = db.prepare(sql);
  const rows = stmt.all();
  return rows;
}

export async function getTempDB() {
  const tempDB = new DatabaseSync(':memory:');
  tempDB.exec('PRAGMA journal_mode = WAL');
  tempDB.exec('PRAGMA synchronous=NORMAL');
  await prepareDB(tempDB);
  return tempDB;
}

export async function prepareDB(db) {
  const postgrator = new Postgrator({
    migrationPattern: join(__dirname, 'migrations/*'),
    driver: 'sqlite3',
    execQuery: (query) => {
      return new Promise((resolve, reject) => {
        const stmt = db.prepare(query);
        try {
          const rows = stmt.all();
          resolve({ rows });
        } catch (error) {
          if (error.message.includes('This statement does not return data')) {
            stmt.run();
            resolve({ rows: [] });
          }
          throw error;
        }
      });
    },
    execSqlScript: (sqlScript) => {
      return new Promise((resolve, reject) => {
        db.exec(sqlScript);
        resolve();
      });
    },
  });
  await postgrator.migrate();
}
