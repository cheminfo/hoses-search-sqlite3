import debugLibrary from 'debug';
import { FastifyRequest, FastifyReply } from 'fastify';

const debug = debugLibrary('getInfoFromSmiles');

export default function fromMolfile(fastify) {
  fastify.get(
    '/v1/predict',
    {
      schema: {
        summary: 'Retrieve information from a molfile',
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
    },
    getInfo,
  );
}

async function getInfo(request: FastifyRequest, response: FastifyReply) {
  const body: any = request.query;
  try {
    const result = {};
    return await response.send({ result });
  } catch (e: any) {
    debug(`Error: ${e.stack}`);
    return response.send({ result: {}, log: e.toString() });
  }
}
