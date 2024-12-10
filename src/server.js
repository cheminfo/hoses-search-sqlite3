import { join } from 'node:path';

import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import debugLibrary from 'debug';
import Fastify from 'fastify';

import { getDB } from './db/getDB.js';
import v1 from './v1/v1.js';

const debug = debugLibrary('server');

async function setDB() {
  const db = await getDB();
  return db;
}

async function doAll() {
  const fastify = Fastify({
    logger: false,
  });

  fastify.register(fastifyCors, {
    maxAge: 86400,
  });

  fastify.register(fastifySensible);

  fastify.get('/', (_, reply) => {
    reply.redirect('/documentation');
  });

  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Cache openchemlib calculation results',
        description: ``,
        version: '1.0.0',
      },
      produces: ['application/json'],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  v1(fastify);

  await fastify.ready();
  fastify.swagger();

  debug('Listening http://127.0.0.1:41210');

  fastify.listen({ port: 41210, host: '0.0.0.0' }, (err) => {
    if (err) {
      fastify.log.error(err);
      console.log(err);
      process.exit(1);
    }
  });
}

const db = await setDB();
await doAll();
