import debugLibrary from 'debug';

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

async function getInfo(request, response) {
  const body = request.query;
  try {
    const result = {};
    return await response.send({ result });
  } catch (error) {
    debug(`Error: ${error.stack}`);
    return response.send({ result: {}, log: error.toString() });
  }
}

export function getAlgorithmsWithContact(db) {
  const infoStmt = db.prepare(`
  SELECT algorithmID, name, version, description, algorithms.contactID, mail
  FROM algorithms
  INNER JOIN contacts ON algorithms.contactID = contacts.contactID`);
  return infoStmt.all();
}

export function getAtomCountPerAlgorithm(db) {
  const AtomCountstmt = db.prepare(`
SELECT energies.algorithmID, algorithms.name, algorithms.version, COUNT(energies.atomID) AS atomCount
FROM algorithms
INNER JOIN energies ON algorithms.algorithmID = energies.algorithmID
GROUP BY energies.algorithmID`);
  return AtomCountstmt.all();
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
  const EntryCountStmt = db.prepare(`
SELECT energies.algorithmID, COUNT(entries.entryID) AS entryCount
FROM atoms
INNER JOIN entries ON atoms.entryID = entries.entryID
INNER JOIN energies ON atoms.atomID = energies.atomID
GROUP BY energies.algorithmID`);
  return EntryCountStmt.all();
}
