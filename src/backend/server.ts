import Fastify from 'fastify';
import cors from '@fastify/cors';
import { classificationRoutes } from './routes/classify';

const server = Fastify({
  logger: true
});

// CORS pour permettre les appels depuis le frontend
async function startServer() {
  await server.register(cors, {
    origin: true,
    credentials: true
  });

  // Routes
  await server.register(classificationRoutes, { prefix: '/api' });

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', service: 'dounia-backend' };
  });

  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Backend server running on http://localhost:3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
