import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { v4 } from '@lukeed/uuid';
import sqLite, { Database } from 'better-sqlite3';
import Postgrator from 'postgrator';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db: Database;

export async function getDB(): Promise<Database> {
  if (!db?.open) {
    const path = new URL('../../sqlite/', import.meta.url).pathname;
    if (!existsSync(path)) {
      mkdirSync(path);
    }
    db = sqLite(join(path, 'db.sqlite'));
    // https://www.sqlite.org/wal.html
    // Activating WAL mode allows to get a speed improvement of 100x !!!
    db.pragma('journal_mode = WAL');
  }
  await prepareDB(db);
  return db;
}

export function getAllTableInfo(db: Database) {
  const sql = `
SELECT name, sql
FROM sqlite_master
WHERE type='table';`;
  const stmt = db.prepare(sql);
  const rows = stmt.all();
  return rows;
}

export async function getTempDB(): Promise<Database> {
  const tempDB = sqLite(`file:${v4()}?mode=memory`);
  await prepareDB(tempDB);
  return tempDB;
}

export async function prepareDB(db: Database) {
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
          //@ts-expect-error This is a hack to avoid the error
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
