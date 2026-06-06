import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  getEstatusGastoById,
  getEstatusGastos,
} from '../services/estatus-gasto.service.js';

function parseEstatusId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id invalido');
  return id;
}

async function listEstatusGastosController(req, res, next) {
  try {
    const estatus = await getEstatusGastos();
    res.status(200).json({ data: estatus });
  } catch (error) {
    next(error);
  }
}

async function getEstatusGastoController(req, res, next) {
  try {
    const id = parseEstatusId(req.params.id);
    const estatus = await getEstatusGastoById(id);
    res.status(200).json({ data: estatus });
  } catch (error) {
    next(error);
  }
}

export { listEstatusGastosController, getEstatusGastoController };
