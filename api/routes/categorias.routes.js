import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  activateCategoriaController,
  createCategoriaController,
  deactivateCategoriaController,
  getCategoriaController,
  listCategoriasController,
  updateCategoriaController,
} from '../modules/catalogs/controllers/categoria.controller.js';

function createCategoriasRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  router.get('/', listCategoriasController);
  router.get('/:id', getCategoriaController);

  router.post('/', requireRole(['ADMIN']), createCategoriaController);
  router.put('/:id', requireRole(['ADMIN']), updateCategoriaController);
  router.patch('/:id/activar', requireRole(['ADMIN']), activateCategoriaController);
  router.patch('/:id/desactivar', requireRole(['ADMIN']), deactivateCategoriaController);

  return router;
}

export default createCategoriasRouter;
