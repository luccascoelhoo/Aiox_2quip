import type { FastifyInstance } from 'fastify';
import { StoryReader } from '../services/StoryReader';
import path from 'path';

export async function storiesRoutes(server: FastifyInstance) {
  // Assuming aiox-core is exactly 2 levels up from packages/metaverse
  const AIOX_ROOT = path.resolve(__dirname, '../../../../');
  const reader = new StoryReader(AIOX_ROOT);

  server.get('/stories', async (request, reply) => {
    try {
      const stories = await reader.listStories();
      return { success: true, stories };
    } catch (err: unknown) {
      server.log.error(err);
      return reply.code(500).send({ success: false, error: 'Failed to read stories' });
    }
  });

  server.get<{ Params: { id: string } }>('/stories/:id', async (request, reply) => {
    try {
      const detail = await reader.readStory(request.params.id);
      if (!detail) return reply.code(404).send({ success: false, error: 'Story not found' });
      return { success: true, story: detail };
    } catch (err: unknown) {
      server.log.error(err);
      return reply.code(500).send({ success: false, error: 'Failed to read story detail' });
    }
  });
}
