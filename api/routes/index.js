import express from 'express';
import createAreasRouter from './areas.routes.js';
import createAuthRouter from './auth.routes.js';
import createCostCentersRouter from './cost-centers.routes.js';
import createHealthRouter from './health.routes.js';

function createApiRouter() {
  const router = express.Router();

  router.use('/areas', createAreasRouter());
  router.use('/auth', createAuthRouter());
  router.use('/centros-costo', createCostCentersRouter());
  router.use('/health', createHealthRouter());

  return router;
}

export default createApiRouter;