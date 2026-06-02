import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createArea as createAreaRecord,
  findAreaByClave,
  findAreaById,
  listAreas,
  setAreaActive,
  updateArea as updateAreaRecord,
} from '../repositories/area.repository.js';

function normalizeString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validateAreaPayload(payload, { requireAll }) {
  const clave = normalizeString(payload?.clave);
  const nombre = normalizeString(payload?.nombre);
  const descripcion = normalizeString(payload?.descripcion);

  if ((requireAll || payload?.clave !== undefined) && !clave) {
    throw new HttpError(400, 'Clave es requerida');
  }

  if ((requireAll || payload?.nombre !== undefined) && !nombre) {
    throw new HttpError(400, 'Nombre es requerido');
  }

  return {
    clave,
    nombre,
    descripcion,
  };
}

async function ensureAreaExists(id) {
  const area = await findAreaById(id);

  if (!area) {
    throw new HttpError(404, 'Area no encontrada');
  }

  return area;
}

async function ensureClaveDisponible(clave, currentId = null) {
  const existing = await findAreaByClave(clave);

  const existingId = existing ? Number(existing.id) : null;

  if (existing && existingId !== currentId) {
    throw new HttpError(409, 'La clave ya existe');
  }
}

async function createArea(payload) {
  const data = validateAreaPayload(payload, { requireAll: true });
  await ensureClaveDisponible(data.clave);
  return createAreaRecord(data);
}

async function getAreas() {
  return listAreas();
}

async function getAreaById(id) {
  return ensureAreaExists(id);
}

async function updateArea(id, payload) {
  const data = validateAreaPayload(payload, { requireAll: true });
  await ensureAreaExists(id);
  await ensureClaveDisponible(data.clave, id);

  const updated = await updateAreaRecord(id, data);

  if (!updated) {
    throw new HttpError(404, 'Area no encontrada');
  }

  return updated;
}

async function activateArea(id) {
  await ensureAreaExists(id);
  return setAreaActive(id, true);
}

async function deactivateArea(id) {
  await ensureAreaExists(id);
  return setAreaActive(id, false);
}

export {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  activateArea,
  deactivateArea,
};
