import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  activateUser,
  createUser,
  deactivateUser,
  getUserById,
  getUsers,
  updateUser,
} from '../services/user.service.js';

function parseUserId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Id invalido');
  }
  return id;
}

async function createUserController(req, res, next) {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function listUsersController(req, res, next) {
  try {
    const users = await getUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
}

async function getUserController(req, res, next) {
  try {
    const id = parseUserId(req.params.id);
    const user = await getUserById(id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUserController(req, res, next) {
  try {
    const id = parseUserId(req.params.id);
    const user = await updateUser(id, req.body);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function activateUserController(req, res, next) {
  try {
    const id = parseUserId(req.params.id);
    const user = await activateUser(id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function deactivateUserController(req, res, next) {
  try {
    const id = parseUserId(req.params.id);
    const user = await deactivateUser(id, req.user.id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export {
  createUserController,
  listUsersController,
  getUserController,
  updateUserController,
  activateUserController,
  deactivateUserController,
};
