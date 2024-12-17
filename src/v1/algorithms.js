import debugLibrary from 'debug';

import { getDB } from '../db/getDB.js';

const debug = debugLibrary('getInfoFromSmiles');

export default function algorithms(fastify) {
  fastify.route({
    url: '/v1/algorithms',
    method: ['GET', 'POST'],
    handler: getAlgorithms,
    schema: {
      summary: '$retrieve information from a molfile',
      description: '',
    },
  });
}

async function getAlgorithms(request, response) {
  try {
    const db = await getDB();
    const algorithms = getAlgorithmsFromDB(db);
    return response.send(algorithms);
  } catch (error) {
    return response.send({ log: error.toString() });
  }
}

export function getAlgorithmsFromDB(db) {
  try {
    const stmt = db.prepare(`SELECT * from algorithms`);
    return stmt.all();
  } catch (error) {
    throw new Error(error);
  }
}
