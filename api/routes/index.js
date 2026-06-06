import express from 'express';
import createAreasRouter from './areas.routes.js';
import createAuthRouter from './auth.routes.js';
import createCategoriasRouter from './categorias.routes.js';
import createConceptosDeducibilidadRouter from './conceptos-deducibilidad.routes.js';
import createCostCentersRouter from './cost-centers.routes.js';
import createEstatusGastosRouter from './estatus-gastos.routes.js';
import createGastosRouter from './gastos.routes.js';
import createHealthRouter from './health.routes.js';
import createProveedoresRouter from './proveedores.routes.js';
import createUsersRouter from './users.routes.js';

function createApiRouter() {
  const router = express.Router();

  router.use('/areas', createAreasRouter());
  router.use('/auth', createAuthRouter());
  router.use('/categorias', createCategoriasRouter());
  router.use('/centros-costo', createCostCentersRouter());
  router.use('/conceptos-deducibilidad', createConceptosDeducibilidadRouter());
  router.use('/estatus-gastos', createEstatusGastosRouter());
  router.use('/gastos', createGastosRouter());
  router.use('/health', createHealthRouter());
  router.use('/proveedores', createProveedoresRouter());
  router.use('/usuarios', createUsersRouter());

  return router;
}

export default createApiRouter;