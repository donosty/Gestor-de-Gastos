import express from 'express';
import multer from 'multer';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  deleteCfdiController,
  getCfdiController,
  uploadCfdiController,
} from '../modules/expenses/controllers/cfdi.controller.js';
import {
  deleteDocumentoController,
  listDocumentosController,
  uploadDocumentoController,
} from '../modules/expenses/controllers/documento.controller.js';
import {
  addDetalleController,
  editDetalleController,
  getDetalleController,
  listDetallesController,
  removeDetalleController,
} from '../modules/expenses/controllers/expense-detail.controller.js';
import {
  createExpenseController,
  deleteExpenseController,
  getExpenseController,
  listExpensesController,
  sendForApprovalController,
  updateExpenseController,
} from '../modules/expenses/controllers/expense.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function createGastosRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);

  // cabecera
  router.get('/', listExpensesController);
  router.get('/:id', getExpenseController);
  router.post('/', requireRole(['CAPTURISTA', 'ADMIN']), createExpenseController);
  router.put('/:id', requireRole(['CAPTURISTA', 'ADMIN']), updateExpenseController);
  router.delete('/:id', requireRole(['CAPTURISTA', 'ADMIN']), deleteExpenseController);
  router.post('/:id/enviar', requireRole(['CAPTURISTA', 'ADMIN']), sendForApprovalController);

  // cfdi (rutas anidadas)
  router.post('/:id/cfdi', requireRole(['CAPTURISTA', 'ADMIN']), express.text({ type: ['text/xml', 'application/xml'] }), uploadCfdiController);
  router.get('/:id/cfdi', getCfdiController);
  router.delete('/:id/cfdi', requireRole(['CAPTURISTA', 'ADMIN']), deleteCfdiController);

  // documentos relacionados (rutas anidadas)
  router.post('/:id/documentos', requireRole(['CAPTURISTA', 'ADMIN']), upload.single('archivo'), uploadDocumentoController);
  router.get('/:id/documentos', listDocumentosController);
  router.delete('/:id/documentos/:docId', requireRole(['CAPTURISTA', 'ADMIN']), deleteDocumentoController);

  // detalle (rutas anidadas)
  router.get('/:id/detalle', listDetallesController);
  router.get('/:id/detalle/:detalleId', getDetalleController);
  router.post('/:id/detalle', requireRole(['CAPTURISTA', 'ADMIN']), addDetalleController);
  router.put('/:id/detalle/:detalleId', requireRole(['CAPTURISTA', 'ADMIN']), editDetalleController);
  router.delete('/:id/detalle/:detalleId', requireRole(['CAPTURISTA', 'ADMIN']), removeDetalleController);

  return router;
}

export default createGastosRouter;
