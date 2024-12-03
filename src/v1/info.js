import debugLibrary from 'debug';

import { getDB } from '../db/getDB.js';

const debug = debugLibrary('getInfoFromSmiles');

export default function info(fastify) {
  fastify.route({
    url: '/v1/info',
    method: ['GET', 'POST'],
    handler: getInfo,
    scheme: {
      summary: '$retrieve information from a molfile',
      description: '',
    },
  });
}

export async function getInfo(request, response) {
  const body = request.query;
  try {
    const db = await getDB();
    const result = {
      algorithms: getAlgorithmsInfo(db),
      globals: getGlobalsInfo(db),
    };
    return await response.send({ result });
  } catch (error) {
    debug(`Error: ${error.stack}`);
    return response.send({ result: {}, log: error.toString() });
  }
}

export function getAlgorithmsInfo(db) {
  const infoStmt = db.prepare(`
  SELECT algorithms.algorithmID, algorithms.name AS algorithmName, algorithms.version, algorithms.description, algorithms.contactID, mail,
        atomCount, hoseCount, entryCount
  FROM algorithms
  INNER JOIN contacts ON algorithms.contactID = contacts.contactID
  INNER JOIN(
    SELECT energies.algorithmID AS id, COUNT(energies.atomID) AS atomCount
    FROM algorithms
    INNER JOIN energies ON algorithms.algorithmID = energies.algorithmID
    GROUP BY energies.algorithmID) AS atomSubQuery ON atomSubQuery.id=algorithms.algorithmID
  INNER JOIN(
    SELECT energies.algorithmID AS id, COUNT(hoseCodes.hoseID) AS hoseCount
    FROM atoms
    INNER JOIN hoseCodes ON hoseCodes.atomID = atoms.atomID
    INNER JOIN energies ON energies.atomID = atoms.atomID
    GROUP BY energies.algorithmID) AS hoseSubQuery ON hoseSubQuery.id = algorithms.algorithmID
  INNER JOIN(
    SELECT energies.algorithmID AS id, COUNT(entries.entryID) AS entryCount
    FROM atoms
    INNER JOIN entries ON atoms.entryID = entries.entryID
    INNER JOIN energies ON atoms.atomID = energies.atomID
    GROUP BY energies.algorithmID) AS entrySubQuery ON entrySubQuery.id=algorithms.algorithmID`);
  let algorithmInfo = Object.groupBy(
    infoStmt.all(),
    ({ algorithmName }) => algorithmName,
  );
  for (let algorithm in algorithmInfo) {
    for (let version of algorithmInfo[algorithm]) delete version.algorithmName;
  }
  return algorithmInfo;
}

export function getAlgorithmsWithContact(db) {
  const infoStmt = db.prepare(`
  SELECT algorithmID, name, version, description, algorithms.contactID, mail
  FROM algorithms
  INNER JOIN contacts ON algorithms.contactID = contacts.contactID`);
  return infoStmt.all();
}

export function getAtomCountPerAlgorithm(db) {
  const atomCountstmt = db.prepare(`
SELECT energies.algorithmID, COUNT(energies.atomID) AS atomCount
FROM algorithms
INNER JOIN energies ON algorithms.algorithmID = energies.algorithmID
GROUP BY energies.algorithmID`);
  return atomCountstmt.all();
}

export function getHoseCountPerAlgorithm(db) {
  const hoseCountStmt = db.prepare(`
SELECT energies.algorithmID, COUNT(hoseCodes.hoseID) AS hoseCount
FROM atoms
INNER JOIN hoseCodes ON hoseCodes.atomID = atoms.atomID
INNER JOIN energies ON energies.atomID = atoms.atomID
GROUP BY energies.algorithmID`);
  return hoseCountStmt.all();
}

export function getEntryCountPerAlgorithm(db) {
  const entryCountStmt = db.prepare(`
SELECT energies.algorithmID, COUNT(entries.entryID) AS entryCount
FROM atoms
INNER JOIN entries ON atoms.entryID = entries.entryID
INNER JOIN energies ON atoms.atomID = energies.atomID
GROUP BY energies.algorithmID`);
  return entryCountStmt.all();
}

export function getGlobalsInfo(db) {
  const atomsStmt = db.prepare(`
    SELECT COUNT( atoms.atomID ) AS totalAtoms,
    SUM( CASE WHEN entries.lastModificationDate / 1000 >= CAST( strftime('%s', 'now', '-1 month') AS INTEGER ) THEN 1 ELSE 0 END) AS lastMonthAtoms,
    SUM( CASE WHEN entries.lastModificationDate / 1000 >= CAST( strftime('%s', 'now', '-12 months') AS INTEGER ) THEN 1 ELSE 0 END) AS lastTwelveMonthsAtoms
    FROM atoms
    INNER JOIN entries ON atoms.entryID = entries.entryID`);
  const atomsInfo = atomsStmt.get();

  const entriesStmt = db.prepare(`
    SELECT COUNT(entries.entryID) AS totalEntries,
    SUM( CASE WHEN entries.lastModificationDate / 1000 >= CAST( strftime('%s', 'now', '-1 month') AS INTEGER ) THEN 1 ELSE 0 END ) AS lastMonthEntries,
    SUM( CASE WHEN entries.lastModificationDate / 1000 >= CAST( strftime('%s', 'now', '-12 months') AS INTEGER ) THEN 1 ELSE 0 END ) AS lastTwelveMonthsEntries
    FROM entries`);
  const entriesInfo = entriesStmt.get();

  const hosesStmt = db.prepare(`
    SELECT COUNT(hoseCodes.hoseID) AS totalHoses,
    SUM( CASE WHEN entries.lastModificationDate / 1000 >= CAST( strftime('%s', 'now', '-1 month') AS INTEGER ) THEN 1 ELSE 0 END ) AS lastMonthHoses,
    SUM( CASE WHEN entries.lastModificationDate / 1000 >= CAST( strftime('%s', 'now', '-12 months') AS INTEGER ) THEN 1 ELSE 0 END ) AS lastTwelveMonthsHoses
    FROM hoseCodes 
    INNER JOIN atoms ON hoseCodes.atomID = atoms.atomID 
    INNER JOIN entries ON atoms.entryID = entries.entryID`);
  const hosesInfo = hosesStmt.get();

  return {
    atoms: {
      total: atomsInfo.totalAtoms,
      lastMonth: atomsInfo.lastMonthAtoms,
      last12Months: atomsInfo.lastTwelveMonthsAtoms,
    },
    hoses: {
      total: hosesInfo.totalHoses,
      lastMonth: hosesInfo.lastMonthHoses,
      last12Months: hosesInfo.lastTwelveMonthsHoses,
    },
    entries: {
      total: entriesInfo.totalEntries,
      lastMonth: entriesInfo.lastMonthEntries,
      last12Months: entriesInfo.lastTwelveMonthsEntries,
    },
  };
}
