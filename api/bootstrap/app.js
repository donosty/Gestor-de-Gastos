import express from 'express';
import { HttpError } from '../core/exceptions/http-error.js';
import { errorMiddleware } from '../middlewares/error.middleware.js';
import { registerMiddlewares } from './middlewares.js';
import { registerRoutes } from './routes.js';

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  registerMiddlewares(app);
  registerRoutes(app);
  app.use((req, res, next) => {
    next(new HttpError(404, 'Ruta no encontrada'));
  });
  app.use(errorMiddleware);

  return app;
}

export { createApp };