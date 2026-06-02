import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDatabase, getPool, initializeDatabase } from '../database/connection/index.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const seedDirectory = path.resolve(currentDirectory, '../database/seeders');

function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

async function runSeedFile(pool, filename) {
  const filePath = path.join(seedDirectory, filename);
  const sql = await fs.readFile(filePath, 'utf8');
  await pool.query(sql);
}

async function main() {
  try {
    await initializeDatabase();
    const pool = getPool();

    const adminName = readRequiredEnv('ADMIN_NAME');
    const adminEmail = readRequiredEnv('ADMIN_EMAIL');
    const adminPasswordHash = readRequiredEnv('ADMIN_PASSWORD_HASH');

    await pool.query('BEGIN');

    try {
      await runSeedFile(pool, '001_seed_roles.sql');

      const roleResult = await pool.query(
        'SELECT id FROM roles WHERE nombre = $1',
        ['ADMIN']
      );

      if (roleResult.rowCount === 0) {
        throw new Error('ADMIN role is missing. Run role seed first.');
      }

      const adminSeedSql = await fs.readFile(
        path.join(seedDirectory, '002_seed_admin_user.sql'),
        'utf8'
      );

      await pool.query(adminSeedSql, [
        adminName,
        adminEmail,
        adminPasswordHash,
        'ADMIN',
      ]);

      await pool.query('COMMIT');
      console.log('Seed completed successfully.');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Seed failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

await main();
