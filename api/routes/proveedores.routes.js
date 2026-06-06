import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  activateProviderController,
  createProviderController,
  deactivateProviderController,
  getProviderController,
  listProvidersController,
  updateProviderController,
} from '../modules/providers/controllers/provider.controller.js';

function createProveedoresRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  router.get('/', listProvidersController);
  router.get('/:id', getProviderController);

  router.post('/', requireRole(['ADMIN']), createProviderController);
  router.put('/:id', requireRole(['ADMIN']), updateProviderController);
  router.patch('/:id/activar', requireRole(['ADMIN']), activateProviderController);
  router.patch('/:id/desactivar', requireRole(['ADMIN']), deactivateProviderController);

  return router;
}

export default createProveedoresRouter;
