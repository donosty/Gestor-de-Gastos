import { HttpError } from '../../../core/exceptions/http-error.js';
import { addDetalle, editDetalle, getDetalleById, getDetalles, removeDetalle } from '../services/expense-detail.service.js';

function parseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id invalido');
  return id;
}

async function listDetallesController(req, res, next) {
  try {
    const gastoId = parseId(req.params.id);
    const detalles = await getDetalles(gastoId, req.user);
    res.status(200).json({ data: detalles });
  } catch (error) {
    next(error);
  }
}

async function getDetalleController(req, res, next) {
  try {
    const gastoId = parseId(req.params.id);
    const detalleId = parseId(req.params.detalleId);
    const detalle = await getDetalleById(gastoId, detalleId, req.user);
    res.status(200).json({ data: detalle });
  } catch (error) {
    next(error);
  }
}

async function addDetalleController(req, res, next) {
  try {
    const gastoId = parseId(req.params.id);
    const detalle = await addDetalle(gastoId, req.body, req.user);
    res.status(201).json({ data: detalle });
  } catch (error) {
    next(error);
  }
}

async function editDetalleController(req, res, next) {
  try {
    const gastoId = parseId(req.params.id);
    const detalleId = parseId(req.params.detalleId);
    const detalle = await editDetalle(gastoId, detalleId, req.body, req.user);
    res.status(200).json({ data: detalle });
  } catch (error) {
    next(error);
  }
}

async function removeDetalleController(req, res, next) {
  try {
    const gastoId = parseId(req.params.id);
    const detalleId = parseId(req.params.detalleId);
    await removeDetalle(gastoId, detalleId, req.user);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export {
  listDetallesController,
  getDetalleController,
  addDetalleController,
  editDetalleController,
  removeDetalleController,
};
