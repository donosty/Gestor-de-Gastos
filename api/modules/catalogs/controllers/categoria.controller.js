import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  activateCategoria,
  createCategoria,
  deactivateCategoria,
  getCategoriaById,
  getCategorias,
  updateCategoria,
} from '../services/categoria.service.js';

function parseCategoriaId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id invalido');
  return id;
}

async function createCategoriaController(req, res, next) {
  try {
    const categoria = await createCategoria(req.body);
    res.status(201).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function listCategoriasController(req, res, next) {
  try {
    const categorias = await getCategorias();
    res.status(200).json({ data: categorias });
  } catch (error) {
    next(error);
  }
}

async function getCategoriaController(req, res, next) {
  try {
    const id = parseCategoriaId(req.params.id);
    const categoria = await getCategoriaById(id);
    res.status(200).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function updateCategoriaController(req, res, next) {
  try {
    const id = parseCategoriaId(req.params.id);
    const categoria = await updateCategoria(id, req.body);
    res.status(200).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function activateCategoriaController(req, res, next) {
  try {
    const id = parseCategoriaId(req.params.id);
    const categoria = await activateCategoria(id);
    res.status(200).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

async function deactivateCategoriaController(req, res, next) {
  try {
    const id = parseCategoriaId(req.params.id);
    const categoria = await deactivateCategoria(id);
    res.status(200).json({ data: categoria });
  } catch (error) {
    next(error);
  }
}

export {
  createCategoriaController,
  listCategoriasController,
  getCategoriaController,
  updateCategoriaController,
  activateCategoriaController,
  deactivateCategoriaController,
};
