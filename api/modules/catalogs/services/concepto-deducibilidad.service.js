import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createConcepto as createConceptoRecord,
  findConceptoById,
  findConceptoByNombre,
  listConceptos,
  setConceptoActive,
  updateConcepto as updateConceptoRecord,
} from '../repositories/concepto-deducibilidad.repository.js';

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseBoolean(value, defaultValue) {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === 1 || value === '1') return true;
  if (value === 'false' || value === 0 || value === '0') return false;
  return defaultValue;
}

function validateConceptoPayload(payload, { requireAll }) {
  const nombre = normalizeString(payload?.nombre);
  const descripcion = normalizeString(payload?.descripcion);
  const deducible = parseBoolean(payload?.deducible, true);

  if ((requireAll || payload?.nombre !== undefined) && !nombre) {
    throw new HttpError(400, 'Nombre es requerido');
  }

  return { nombre, descripcion, deducible };
}

async function ensureConceptoExists(id) {
  const concepto = await findConceptoById(id);
  if (!concepto) throw new HttpError(404, 'Concepto de deducibilidad no encontrado');
  return concepto;
}

async function ensureNombreDisponible(nombre, currentId = null) {
  const existing = await findConceptoByNombre(nombre);
  const existingId = existing ? Number(existing.id) : null;
  if (existing && existingId !== currentId) {
    throw new HttpError(409, 'El nombre ya existe');
  }
}

async function createConcepto(payload) {
  const data = validateConceptoPayload(payload, { requireAll: true });
  await ensureNombreDisponible(data.nombre);
  return createConceptoRecord(data);
}

async function getConceptos() {
  return listConceptos();
}

async function getConceptoById(id) {
  return ensureConceptoExists(id);
}

async function updateConcepto(id, payload) {
  const data = validateConceptoPayload(payload, { requireAll: true });
  await ensureConceptoExists(id);
  await ensureNombreDisponible(data.nombre, id);

  const updated = await updateConceptoRecord(id, data);
  if (!updated) throw new HttpError(404, 'Concepto de deducibilidad no encontrado');
  return updated;
}

async function activateConcepto(id) {
  await ensureConceptoExists(id);
  return setConceptoActive(id, true);
}

async function deactivateConcepto(id) {
  await ensureConceptoExists(id);
  return setConceptoActive(id, false);
}

export {
  createConcepto,
  getConceptos,
  getConceptoById,
  updateConcepto,
  activateConcepto,
  deactivateConcepto,
};
