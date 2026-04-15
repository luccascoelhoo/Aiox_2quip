import type { FastifyInstance } from 'fastify';
import { StateReader } from '../services/StateReader';

export async function stateRoutes(server: FastifyInstance) {
  const stateReader = new StateReader();

  server.get('/state', async () => {
    return stateReader.getState();
  });
}
