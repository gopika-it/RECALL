import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function migrate(): Promise<void> {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }
  const here = path.dirname(fileURLToPath(import.meta.url));
  const sqlPath = path.resolve(here, '../../migrations/001_init.sql');
  const sql = await fs.readFile(sqlPath, 'utf8');
  await pool.query(sql);
}

export async function verifyDatabase(): Promise<{ connected: boolean; pgvector: boolean }> {
  const ping = await pool.query('SELECT 1 as ok');
  const ext = await pool.query(
    `SELECT extname FROM pg_extension WHERE extname = 'vector'`
  );
  return {
    connected: ping.rows[0]?.ok === 1,
    pgvector: ext.rowCount > 0,
  };
}
