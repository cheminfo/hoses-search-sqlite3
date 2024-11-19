import debugLibrary from 'debug';
import { Molecule } from 'openchemlib';

const debug = debugLibrary('getInfoFromSmiles');

export default function predict(fastify) {
  fastify.route({
    url: '/v1/predict',
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
  const query = request.query;
  const molecule = getMolecule(query);

  try {
    const result = {};
    return await response.send({ result });
  } catch (error) {
    debug(`Error: ${error.stack}`);
    return response.send({ result: {}, log: error.toString() });
  }
}

function getMolecule(query) {
  if (query.molfile) {
    return Molecule.fromMolfile(query.molfile);
  }
  if (query.smiles) {
    return Molecule.fromSmiles(query.smiles);
  }
}
