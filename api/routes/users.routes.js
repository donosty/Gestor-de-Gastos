import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  activateUserController,
  createUserController,
  deactivateUserController,
  getUserController,
  listUsersController,
  updateUserController,
} from '../modules/users/controllers/user.controller.js';

function createUsersRouter() {
  const router = express.Router();

  router.use(authenticationMiddleware);
  router.use(requireRole(['ADMIN']));

  router.get('/', listUsersController);
  router.get('/:id', getUserController);
  router.post('/', createUserController);
  router.put('/:id', updateUserController);
  router.patch('/:id/activar', activateUserController);
  router.patch('/:id/desactivar', deactivateUserController);

  return router;
}

export default createUsersRouter;
