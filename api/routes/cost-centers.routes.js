import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  activateCostCenterController,
  createCostCenterController,
  deactivateCostCenterController,
  getCostCenterController,
  listCostCentersController,
  updateCostCenterController,
} from '../modules/cost-centers/controllers/cost-center.controller.js';

function createCostCentersRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  router.get('/', listCostCentersController);
  router.get('/:id', getCostCenterController);

  router.post('/', requireRole(['ADMIN']), createCostCenterController);
  router.put('/:id', requireRole(['ADMIN']), updateCostCenterController);
  router.patch('/:id/activar', requireRole(['ADMIN']), activateCostCenterController);
  router.patch('/:id/desactivar', requireRole(['ADMIN']), deactivateCostCenterController);

  return router;
}

export default createCostCentersRouter;
