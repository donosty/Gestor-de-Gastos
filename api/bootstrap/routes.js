import { env } from '../core/config/env.js';
import createApiRouter from '../routes/index.js';

function registerRoutes(app) {
  app.use(env.apiPrefix, createApiRouter());
}

export { registerRoutes };