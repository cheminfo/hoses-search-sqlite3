import fs, { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getDB } from '../db/getDB.js';
import { importXYZ } from '../import/importXYZ.js';

function isXYZFile(filename) {
  return filename.split('.').pop().toLowerCase() === 'xyz';
}

export async function cronSyncDB() {
  const db = await getDB();
  const syncFolderPath = new URL('../../sync/', import.meta.url);
  const projectDirList = fs.readdirSync(syncFolderPath);
  for (let filename of projectDirList) {
    const filePath = new URL(filename, syncFolderPath);
    if (fs.lstatSync(filePath.pathname).isDirectory()) {
      const dirToProcess = new URL(
        join(filePath.pathname, 'to_process'),
        import.meta.url,
      );
      const dirProcessed = new URL(
        join(filePath.pathname, 'processed'),
        import.meta.url,
      );
      const dirErrored = new URL(
        join(filePath.pathname, 'errored'),
        import.meta.url,
      );
      const { config } = await import(join(filePath.pathname, 'conf.js'));
      if (fs.existsSync(dirToProcess)) {
        const listToProcess = fs.readdirSync(dirToProcess.pathname);
        for (filename of listToProcess) {
          const filePath = new URL(
            join(dirToProcess.pathname, filename),
            import.meta.url,
          );
          try {
            if (!isXYZFile(filename)) throw new error('incorrect file format');
            const xyzData = readFileSync(filePath.pathname, 'utf-8');
            await importXYZ(xyzData, db, config);
            if (!fs.existsSync(dirProcessed)) {
              fs.mkdirSync(dirProcessed.pathname);
            }
            fs.renameSync(
              filePath.pathname,
              new URL(join(dirProcessed.pathname, filename), import.meta.url),
            );
          } catch {
            if (!fs.existsSync(dirErrored.pathname)) {
              fs.mkdirSync(dirProcessed.pathname);
            }
            fs.renameSync(
              filePath.pathname,
              new URL(join(dirErrored.pathname, filename), import.meta.url),
            );
          }
        }
      }
    }
  }
  setTimeout(await cronSyncDB(), 1 * 1000);
}

// await cronSyncDB();
