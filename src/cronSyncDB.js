import {
  readFileSync,
  readdirSync,
  lstatSync,
  existsSync,
  mkdirSync,
  renameSync,
} from 'node:fs';
import { join } from 'node:path';

import debugLibrary from 'debug';
import delay from 'delay';

import { getDB } from './db/getDB.js';
import { importXYZ } from './import/importXYZ.js';

const debug = debugLibrary('cronSyncDB');

export async function cronSyncDB() {
  while (true) {
    let db;
    try {
      db = await getDB();
      const syncFolderPath = new URL('../sync/', import.meta.url);
      const projectDirectories = readdirSync(syncFolderPath, {
        withFileTypes: true,
      })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      for (const projectDirectory of projectDirectories) {
        const baseDirectory = join(syncFolderPath.pathname, projectDirectory);
        const { dirToProcess, dirProcessed, dirErrored } =
          getDirs(baseDirectory);

        const configFile = join(baseDirectory, 'config.js');
        if (!existsSync(configFile)) {
          debug(`config.js not found in: ${baseDirectory}`);
          continue;
        }
        const { config } = await import(configFile);
        const filesToProcess = readdirSync(dirToProcess);
        for (const fileToProcess of filesToProcess) {
          debug(
            `Processing: ${fileToProcess} from project: ${projectDirectory}`,
          );
          const filePath = join(dirToProcess, fileToProcess);
          // console.log(filePath);
          try {
            const extension = fileToProcess.replace(/^.*\./, '');
            switch (extension) {
              case 'xyz':
                {
                  const xyzData = readFileSync(filePath, 'utf-8');
                  const stats = await importXYZ(xyzData, db, config);
                  debug(
                    `Imported successfully ${fileToProcess}. Nb entries: ${stats.nbEntries}`,
                  );
                  renameSync(filePath, join(dirProcessed, fileToProcess));
                }
                break;
              default:
                debug(`Unknown file extension: ${extension}`);
                renameSync(filePath, join(dirErrored, fileToProcess));
            }
          } catch (error) {
            console.log('>>> Error:', error);
            renameSync(filePath, join(dirErrored, fileToProcess));
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // db?.close();
    }
    await delay(1000);
  }
}

function getDirs(folderPath) {
  return {
    dirToProcess: getDir(folderPath, 'to_process'),
    dirProcessed: getDir(folderPath, 'processed'),
    dirErrored: getDir(folderPath, 'errored'),
  };
}

function getDir(folderPath, subfolderName) {
  const dir = join(folderPath, subfolderName);
  //create if not exists
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  return dir;
}

cronSyncDB();
