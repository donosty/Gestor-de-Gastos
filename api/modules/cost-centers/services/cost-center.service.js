import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createCostCenter as createCostCenterRecord,
  findAreaById,
  findCostCenterById,
  listCostCenters,
  setCostCenterActive,
  updateCostCenter as updateCostCenterRecord,
} from '../repositories/cost-center.repository.js';

function normalizeString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parsePositiveInt(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function validateCostCenterPayload(payload, { requireAll }) {
  const areaId = parsePositiveInt(payload?.area_id);
  const clave = normalizeString(payload?.clave);
  const nombre = normalizeString(payload?.nombre);
  const descripcion = normalizeString(payload?.descripcion);

  if ((requireAll || payload?.area_id !== undefined) && !areaId) {
    throw new HttpError(400, 'area_id es requerido');
  }

  if ((requireAll || payload?.clave !== undefined) && !clave) {
    throw new HttpError(400, 'Clave es requerida');
  }

  if ((requireAll || payload?.nombre !== undefined) && !nombre) {
    throw new HttpError(400, 'Nombre es requerido');
  }

  return {
    areaId,
    clave,
    nombre,
    descripcion,
  };
}

async function ensureAreaExists(areaId) {
  const area = await findAreaById(areaId);

  if (!area) {
    throw new HttpError(404, 'Area no encontrada');
  }
}

async function ensureCostCenterExists(id) {
  const costCenter = await findCostCenterById(id);

  if (!costCenter) {
    throw new HttpError(404, 'Centro de costo no encontrado');
  }

  return costCenter;
}

async function createCostCenter(payload) {
  const data = validateCostCenterPayload(payload, { requireAll: true });
  await ensureAreaExists(data.areaId);
  return createCostCenterRecord(data);
}

async function getCostCenters() {
  return listCostCenters();
}

async function getCostCenterById(id) {
  return ensureCostCenterExists(id);
}

async function updateCostCenter(id, payload) {
  const data = validateCostCenterPayload(payload, { requireAll: true });
  await ensureCostCenterExists(id);
  await ensureAreaExists(data.areaId);

  const updated = await updateCostCenterRecord(id, data);

  if (!updated) {
    throw new HttpError(404, 'Centro de costo no encontrado');
  }

  return updated;
}

async function activateCostCenter(id) {
  await ensureCostCenterExists(id);
  return setCostCenterActive(id, true);
}

async function deactivateCostCenter(id) {
  await ensureCostCenterExists(id);
  return setCostCenterActive(id, false);
}

export {
  createCostCenter,
  getCostCenters,
  getCostCenterById,
  updateCostCenter,
  activateCostCenter,
  deactivateCostCenter,
};
