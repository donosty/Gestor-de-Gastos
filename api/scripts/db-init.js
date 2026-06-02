import { closeApplicationDatabase, initializeApplicationDatabase } from '../bootstrap/database.js';

try {
  await initializeApplicationDatabase();
  console.log('Database connection initialized successfully.');
} catch (error) {
  console.error('Database initialization failed.');
  console.error(error);
  process.exitCode = 1;
} finally {
  await closeApplicationDatabase();
}