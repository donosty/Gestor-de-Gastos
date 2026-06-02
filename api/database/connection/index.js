import pg from 'pg';
import { env } from '../../core/config/env.js';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
    });

    pool.on('error', (error) => {
      console.error('Unexpected database pool error.');
      console.error(error);
    });
  }

  return pool;
}

async function verifyDatabaseConnection() {
  const databasePool = getPool();
  const client = await databasePool.connect();

  try {
    await client.query('SELECT 1 AS connected');
  } finally {
    client.release();
  }
}

async function initializeDatabase() {
  await verifyDatabaseConnection();
  return getPool();
}

async function closeDatabase() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = undefined;
}

export { getPool, verifyDatabaseConnection, initializeDatabase, closeDatabase };