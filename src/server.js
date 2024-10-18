import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import debugLibrary from 'debug';
import Fastify from 'fastify';

import v1 from './v1/v1.js';

import { getDB, getTempDB } from './db/getDB.js';
import { join } from 'path';
import { importXYZ } from './import/importXYZ.js';
import insertEntry from './import/insertEntry.js';

const debug = debugLibrary('server');

async function setDB() {
  const db = await getTempDB();
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

  debug('Listening http://127.0.0.1:40828');

  fastify.listen({ port: 40828, host: '0.0.0.0' }, (err) => {
    if (err) {
      fastify.log.error(err);
      console.log(err);
      process.exit(1);
    }
  });
}

const db = setDB();
doAll();
