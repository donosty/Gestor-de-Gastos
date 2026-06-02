import { closeDatabase, initializeDatabase } from '../database/connection/index.js';

async function initializeApplicationDatabase() {
  await initializeDatabase();
}

export { initializeApplicationDatabase, closeDatabase as closeApplicationDatabase };