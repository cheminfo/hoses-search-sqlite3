import info from './info.js';
import predict from './predict.js';

export default function v1(fastify) {
  info(fastify);
  predict(fastify);
}
