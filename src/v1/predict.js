import debugLibrary from 'debug';
import pkg from 'fastify';

const { FastifyRequest, FastifyReply } = pkg;

const debug = debugLibrary('getInfoFromSmiles');

export default function fromMolfile(fastify) {
  fastify.route({
    url: '/v1/convertRaw',
    method: ['GET', 'POST'],
    handler: getInfo,
    scheme: {
      summary: '$retrieve information from a molfile',
      description: '',
      querystring: {
        molfile: {
          type: 'string',
          description: 'Molfile',
        },
        smiles: {
          type: 'string',
          description: 'SMILES',
        },
      },
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
