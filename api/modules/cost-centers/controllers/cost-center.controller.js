import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  activateCostCenter,
  createCostCenter,
  deactivateCostCenter,
  getCostCenterById,
  getCostCenters,
  updateCostCenter,
} from '../services/cost-center.service.js';

function parseCostCenterId(rawId) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Id invalido');
  }

  return id;
}

async function createCostCenterController(req, res, next) {
  try {
    const costCenter = await createCostCenter(req.body);
    res.status(201).json({ data: costCenter });
  } catch (error) {
    next(error);
  }
}

async function listCostCentersController(req, res, next) {
  try {
    const costCenters = await getCostCenters();
    res.status(200).json({ data: costCenters });
  } catch (error) {
    next(error);
  }
}

async function getCostCenterController(req, res, next) {
  try {
    const id = parseCostCenterId(req.params.id);
    const costCenter = await getCostCenterById(id);
    res.status(200).json({ data: costCenter });
  } catch (error) {
    next(error);
  }
}

async function updateCostCenterController(req, res, next) {
  try {
    const id = parseCostCenterId(req.params.id);
    const costCenter = await updateCostCenter(id, req.body);
    res.status(200).json({ data: costCenter });
  } catch (error) {
    next(error);
  }
}

async function activateCostCenterController(req, res, next) {
  try {
    const id = parseCostCenterId(req.params.id);
    const costCenter = await activateCostCenter(id);
    res.status(200).json({ data: costCenter });
  } catch (error) {
    next(error);
  }
}

async function deactivateCostCenterController(req, res, next) {
  try {
    const id = parseCostCenterId(req.params.id);
    const costCenter = await deactivateCostCenter(id);
    res.status(200).json({ data: costCenter });
  } catch (error) {
    next(error);
  }
}

export {
  createCostCenterController,
  listCostCentersController,
  getCostCenterController,
  updateCostCenterController,
  activateCostCenterController,
  deactivateCostCenterController,
};
