import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  activateArea,
  createArea,
  deactivateArea,
  getAreaById,
  getAreas,
  updateArea,
} from '../services/area.service.js';

function parseAreaId(rawId) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Id invalido');
  }

  return id;
}

async function createAreaController(req, res, next) {
  try {
    const area = await createArea(req.body);
    res.status(201).json({ data: area });
  } catch (error) {
    next(error);
  }
}

async function listAreasController(req, res, next) {
  try {
    const areas = await getAreas();
    res.status(200).json({ data: areas });
  } catch (error) {
    next(error);
  }
}

async function getAreaController(req, res, next) {
  try {
    const id = parseAreaId(req.params.id);
    const area = await getAreaById(id);
    res.status(200).json({ data: area });
  } catch (error) {
    next(error);
  }
}

async function updateAreaController(req, res, next) {
  try {
    const id = parseAreaId(req.params.id);
    const area = await updateArea(id, req.body);
    res.status(200).json({ data: area });
  } catch (error) {
    next(error);
  }
}

async function activateAreaController(req, res, next) {
  try {
    const id = parseAreaId(req.params.id);
    const area = await activateArea(id);
    res.status(200).json({ data: area });
  } catch (error) {
    next(error);
  }
}

async function deactivateAreaController(req, res, next) {
  try {
    const id = parseAreaId(req.params.id);
    const area = await deactivateArea(id);
    res.status(200).json({ data: area });
  } catch (error) {
    next(error);
  }
}

export {
  createAreaController,
  listAreasController,
  getAreaController,
  updateAreaController,
  activateAreaController,
  deactivateAreaController,
};
