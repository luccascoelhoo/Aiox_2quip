import Fastify from 'fastify';
import cors from '@fastify/cors';
import { stateRoutes } from './routes/state';
import { agentsRoutes } from './routes/agents';
import { commandRoutes } from './routes/command';

const server = Fastify({ logger: false });

async function start() {
  await server.register(cors, { origin: ['http://localhost:5173', 'http://localhost:5174'] });

  server.register(stateRoutes, { prefix: '/api' });
  server.register(agentsRoutes, { prefix: '/api' });
  server.register(commandRoutes, { prefix: '/api' });

  server.get('/health', async () => ({ status: 'ok', service: '2quip-metaverse-api', timestamp: new Date().toISOString() }));

  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 2quip Metaverse API running on http://localhost:3001');
    console.log('   Health: http://localhost:3001/health');
  } catch (err) {
    console.error('Failed to start API server:', err);
    process.exit(1);
  }
}

start();
