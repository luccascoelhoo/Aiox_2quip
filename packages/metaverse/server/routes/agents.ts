import type { FastifyInstance } from 'fastify';
import { AgentManifestBuilder } from '../services/AgentManifestBuilder';

export async function agentsRoutes(server: FastifyInstance) {
  const manifestBuilder = new AgentManifestBuilder();

  server.get('/agents', async () => {
    return { agents: manifestBuilder.getManifest() };
  });
}
