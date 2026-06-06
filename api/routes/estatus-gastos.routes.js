import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import {
  getEstatusGastoController,
  listEstatusGastosController,
} from '../modules/catalogs/controllers/estatus-gasto.controller.js';

function createEstatusGastosRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  router.get('/', listEstatusGastosController);
  router.get('/:id', getEstatusGastoController);

  return router;
}

export default createEstatusGastosRouter;
