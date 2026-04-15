import type { FastifyInstance } from 'fastify';
import { CommandBridge } from '../services/CommandBridge';

export async function commandRoutes(server: FastifyInstance) {
  const bridge = new CommandBridge();

  server.post<{ Body: { command: string; agentContext?: string } }>('/command', async (request) => {
    const { command, agentContext } = request.body;

    if (!command || !command.startsWith('*')) {
      return { success: false, output: 'Commands must start with *', agentId: 'system' };
    }

    return bridge.execute(command, agentContext);
  });
}
