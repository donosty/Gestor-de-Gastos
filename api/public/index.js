import { startServer } from '../bootstrap/server.js';

try {
  await startServer();
} catch (error) {
  console.error('The API could not be started.');
  console.error(error);
  process.exitCode = 1;
}