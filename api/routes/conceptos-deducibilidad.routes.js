import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  activateConceptoController,
  createConceptoController,
  deactivateConceptoController,
  getConceptoController,
  listConceptosController,
  updateConceptoController,
} from '../modules/catalogs/controllers/concepto-deducibilidad.controller.js';

function createConceptosDeducibilidadRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  router.get('/', listConceptosController);
  router.get('/:id', getConceptoController);

  router.post('/', requireRole(['ADMIN']), createConceptoController);
  router.put('/:id', requireRole(['ADMIN']), updateConceptoController);
  router.patch('/:id/activar', requireRole(['ADMIN']), activateConceptoController);
  router.patch('/:id/desactivar', requireRole(['ADMIN']), deactivateConceptoController);

  return router;
}

export default createConceptosDeducibilidadRouter;
