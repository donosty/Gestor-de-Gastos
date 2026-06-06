import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  activateConcepto,
  createConcepto,
  deactivateConcepto,
  getConceptoById,
  getConceptos,
  updateConcepto,
} from '../services/concepto-deducibilidad.service.js';

function parseConceptoId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id invalido');
  return id;
}

async function createConceptoController(req, res, next) {
  try {
    const concepto = await createConcepto(req.body);
    res.status(201).json({ data: concepto });
  } catch (error) {
    next(error);
  }
}

async function listConceptosController(req, res, next) {
  try {
    const conceptos = await getConceptos();
    res.status(200).json({ data: conceptos });
  } catch (error) {
    next(error);
  }
}

async function getConceptoController(req, res, next) {
  try {
    const id = parseConceptoId(req.params.id);
    const concepto = await getConceptoById(id);
    res.status(200).json({ data: concepto });
  } catch (error) {
    next(error);
  }
}

async function updateConceptoController(req, res, next) {
  try {
    const id = parseConceptoId(req.params.id);
    const concepto = await updateConcepto(id, req.body);
    res.status(200).json({ data: concepto });
  } catch (error) {
    next(error);
  }
}

async function activateConceptoController(req, res, next) {
  try {
    const id = parseConceptoId(req.params.id);
    const concepto = await activateConcepto(id);
    res.status(200).json({ data: concepto });
  } catch (error) {
    next(error);
  }
}

async function deactivateConceptoController(req, res, next) {
  try {
    const id = parseConceptoId(req.params.id);
    const concepto = await deactivateConcepto(id);
    res.status(200).json({ data: concepto });
  } catch (error) {
    next(error);
  }
}

export {
  createConceptoController,
  listConceptosController,
  getConceptoController,
  updateConceptoController,
  activateConceptoController,
  deactivateConceptoController,
};
