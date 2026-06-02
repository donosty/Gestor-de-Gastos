import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDatabase, getPool, initializeDatabase } from '../database/connection/index.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const migrationsDirectory = path.resolve(currentDirectory, '../database/migrations');
const migrationTable = 'schema_migrations';

function readStepsArg() {
  const stepsIndex = process.argv.findIndex(
    (arg) => arg === '--steps' || arg === '-s'
  );

  if (stepsIndex === -1) {
    return 1;
  }

  const rawSteps = process.argv[stepsIndex + 1];
  const steps = Number(rawSteps);

  if (!Number.isInteger(steps) || steps <= 0) {
    throw new Error('Invalid rollback steps value.');
  }

  return steps;
}

async function ensureMigrationTable(pool) {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS ${migrationTable} (
      id BIGSERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  );
}

async function fetchAppliedMigrations(pool, steps) {
  const result = await pool.query(
    `SELECT filename FROM ${migrationTable} ORDER BY applied_at DESC, id DESC LIMIT $1`,
    [steps]
  );

  return result.rows.map((row) => row.filename);
}

async function rollbackMigration(pool, filename) {
  if (!filename.endsWith('.up.sql')) {
    throw new Error(`Invalid migration filename: ${filename}`);
  }

  const rollbackFilename = filename.replace('.up.sql', '.down.sql');
  const filePath = path.join(migrationsDirectory, rollbackFilename);
  const sql = await fs.readFile(filePath, 'utf8');

  await pool.query('BEGIN');

  try {
    await pool.query(sql);
    await pool.query(`DELETE FROM ${migrationTable} WHERE filename = $1`, [filename]);
    await pool.query('COMMIT');
    console.log(`Rolled back migration: ${filename}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

async function main() {
  try {
    const steps = readStepsArg();

    await initializeDatabase();
    const pool = getPool();

    await ensureMigrationTable(pool);

    const appliedMigrations = await fetchAppliedMigrations(pool, steps);

    if (appliedMigrations.length === 0) {
      console.log('No migrations to rollback.');
      return;
    }

    for (const migrationFile of appliedMigrations) {
      await rollbackMigration(pool, migrationFile);
    }
  } catch (error) {
    console.error('Rollback failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

await main();
