import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createCategoria as createCategoriaRecord,
  findCategoriaById,
  findCategoriaByNombre,
  listCategorias,
  setCategoriaActive,
  updateCategoria as updateCategoriaRecord,
} from '../repositories/categoria.repository.js';

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validateCategoriaPayload(payload) {
  const nombre = normalizeString(payload?.nombre);
  const descripcion = normalizeString(payload?.descripcion);

  if (!nombre) throw new HttpError(400, 'Nombre es requerido');

  return { nombre, descripcion };
}

async function ensureCategoriaExists(id) {
  const categoria = await findCategoriaById(id);
  if (!categoria) throw new HttpError(404, 'Categoría no encontrada');
  return categoria;
}

async function ensureNombreDisponible(nombre, currentId = null) {
  const existing = await findCategoriaByNombre(nombre);
  const existingId = existing ? Number(existing.id) : null;
  if (existing && existingId !== currentId) {
    throw new HttpError(409, 'El nombre ya existe');
  }
}

async function createCategoria(payload) {
  const data = validateCategoriaPayload(payload);
  await ensureNombreDisponible(data.nombre);
  return createCategoriaRecord(data);
}

async function getCategorias() {
  return listCategorias();
}

async function getCategoriaById(id) {
  return ensureCategoriaExists(id);
}

async function updateCategoria(id, payload) {
  const data = validateCategoriaPayload(payload);
  await ensureCategoriaExists(id);
  await ensureNombreDisponible(data.nombre, id);

  const updated = await updateCategoriaRecord(id, data);
  if (!updated) throw new HttpError(404, 'Categoría no encontrada');
  return updated;
}

async function activateCategoria(id) {
  await ensureCategoriaExists(id);
  return setCategoriaActive(id, true);
}

async function deactivateCategoria(id) {
  await ensureCategoriaExists(id);
  return setCategoriaActive(id, false);
}

export {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  activateCategoria,
  deactivateCategoria,
};
