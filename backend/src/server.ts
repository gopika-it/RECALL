import { app } from './app.js';
import { env } from './config/env.js';
import { migrate, verifyDatabase } from './config/db.js';

async function start() {
  if (!env.databaseUrl) {
    console.warn('DATABASE_URL is missing. Health will work; data endpoints will fail.');
  } else {
    await migrate();
    const db = await verifyDatabase();
    console.log(`Database connected=${db.connected} pgvector=${db.pgvector}`);
    if (!db.pgvector) {
      throw new Error('pgvector extension is not available');
    }
  }

  app.listen(env.port, () => {
    console.log(`RECALL backend listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start RECALL backend', err);
  process.exit(1);
});
