import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  activateAreaController,
  createAreaController,
  deactivateAreaController,
  getAreaController,
  listAreasController,
  updateAreaController,
} from '../modules/areas/controllers/area.controller.js';

function createAreasRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  router.get('/', listAreasController);
  router.get('/:id', getAreaController);

  router.post('/', requireRole(['ADMIN']), createAreaController);
  router.put('/:id', requireRole(['ADMIN']), updateAreaController);
  router.patch('/:id/activar', requireRole(['ADMIN']), activateAreaController);
  router.patch('/:id/desactivar', requireRole(['ADMIN']), deactivateAreaController);

  return router;
}

export default createAreasRouter;
