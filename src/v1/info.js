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
