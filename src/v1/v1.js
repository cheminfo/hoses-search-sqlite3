import algorithms from './algorithms.js';
import info from './info.js';
import molecules from './molecules.js';
import predict from './predict.js';

export default function v1(fastify) {
  info(fastify);
  predict(fastify);
  molecules(fastify);
  algorithms(fastify);
}
