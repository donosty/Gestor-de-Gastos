import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDatabase, getPool, initializeDatabase } from '../database/connection/index.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const migrationsDirectory = path.resolve(currentDirectory, '../database/migrations');
const migrationTable = 'schema_migrations';

async function ensureMigrationTable(pool) {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS ${migrationTable} (
      id BIGSERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  );
}

async function listMigrationFiles() {
  const entries = await fs.readdir(migrationsDirectory);
  return entries.filter((entry) => entry.endsWith('.up.sql')).sort();
}

async function fetchAppliedMigrations(pool) {
  const result = await pool.query(
    `SELECT filename FROM ${migrationTable} ORDER BY applied_at ASC, id ASC`
  );
  return new Set(result.rows.map((row) => row.filename));
}

async function applyMigration(pool, filename) {
  const filePath = path.join(migrationsDirectory, filename);
  const sql = await fs.readFile(filePath, 'utf8');

  await pool.query('BEGIN');

  try {
    await pool.query(sql);
    await pool.query(`INSERT INTO ${migrationTable} (filename) VALUES ($1)`, [filename]);
    await pool.query('COMMIT');
    console.log(`Applied migration: ${filename}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }
}

async function main() {
  try {
    await initializeDatabase();
    const pool = getPool();

    await ensureMigrationTable(pool);

    const appliedMigrations = await fetchAppliedMigrations(pool);
    const migrationFiles = await listMigrationFiles();
    const pendingMigrations = migrationFiles.filter(
      (file) => !appliedMigrations.has(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations.');
      return;
    }

    for (const migrationFile of pendingMigrations) {
      await applyMigration(pool, migrationFile);
    }
  } catch (error) {
    console.error('Migration failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}

await main();
