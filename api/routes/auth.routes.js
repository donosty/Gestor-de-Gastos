import express from 'express';
import { loginController, logoutController, meController } from '../modules/auth/controllers/auth.controller.js';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

function createAuthRouter() {
  const router = express.Router();

  router.post('/login', loginController);
  router.post('/logout', logoutController);
  router.get(
    '/me',
    authenticationMiddleware,
    requireRole(['ADMIN', 'CAPTURISTA', 'JEFE_AREA', 'CUENTAS_POR_PAGAR']),
    meController
  );

  return router;
}

export default createAuthRouter;
