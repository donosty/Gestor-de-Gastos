import express from 'express';
import { env } from '../core/config/env.js';
import { verifyDatabaseConnection } from '../database/connection/index.js';

function createHealthRouter() {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      await verifyDatabaseConnection();

      res.status(200).json({
        status: 'ok',
        service: env.appName,
        environment: env.nodeEnv,
        timestamp: new Date().toISOString(),
        database: 'up',
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export default createHealthRouter;