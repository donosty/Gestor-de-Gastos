import { createServer } from 'node:http';
import { env } from '../core/config/env.js';
import { closeApplicationDatabase, initializeApplicationDatabase } from './database.js';
import { createApp } from './app.js';

let server;
let shutdownRegistered = false;

async function startServer() {
  await initializeApplicationDatabase();

  const app = createApp();
  server = createServer(app);

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(env.port, resolve);
  });

  registerShutdownHandlers();
  console.log(`${env.appName} running on port ${env.port}`);

  return server;
}

function registerShutdownHandlers() {
  if (shutdownRegistered) {
    return;
  }

  shutdownRegistered = true;

  const shutdown = async () => {
    if (!server) {
      return;
    }

    await new Promise((resolve) => server.close(resolve));
    await closeApplicationDatabase();
  };

  process.once('SIGINT', () => {
    void shutdown().finally(() => process.exit(0));
  });

  process.once('SIGTERM', () => {
    void shutdown().finally(() => process.exit(0));
  });
}

export { startServer };