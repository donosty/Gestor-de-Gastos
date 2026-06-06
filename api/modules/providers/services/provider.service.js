import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createProvider as createProviderRecord,
  findProviderById,
  findProviderByRfc,
  listProviders,
  setProviderActive,
  updateProvider as updateProviderRecord,
} from '../repositories/provider.repository.js';

// RFC format: 3-4 letters/& /Ñ + 6 digits + 3 alphanumeric
const RFC_REGEX = /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/;

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validateProviderPayload(payload) {
  const rfcRaw = normalizeString(payload?.rfc);
  const rfc = rfcRaw ? rfcRaw.toUpperCase() : null;
  const razonSocial = normalizeString(payload?.razon_social);
  const correo = normalizeString(payload?.correo);
  const telefono = normalizeString(payload?.telefono);

  if (!rfc) throw new HttpError(400, 'RFC es requerido');
  if (!RFC_REGEX.test(rfc)) throw new HttpError(400, 'RFC inválido');
  if (!razonSocial) throw new HttpError(400, 'Razón social es requerida');

  return { rfc, razonSocial, correo, telefono };
}

async function ensureProviderExists(id) {
  const provider = await findProviderById(id);
  if (!provider) throw new HttpError(404, 'Proveedor no encontrado');
  return provider;
}

async function ensureRfcDisponible(rfc, currentId = null) {
  const existing = await findProviderByRfc(rfc);
  const existingId = existing ? Number(existing.id) : null;
  if (existing && existingId !== currentId) {
    throw new HttpError(409, 'El RFC ya está registrado');
  }
}

async function createProvider(payload) {
  const data = validateProviderPayload(payload);
  await ensureRfcDisponible(data.rfc);
  return createProviderRecord(data);
}

async function getProviders() {
  return listProviders();
}

async function getProviderById(id) {
  return ensureProviderExists(id);
}

async function updateProvider(id, payload) {
  const data = validateProviderPayload(payload);
  await ensureProviderExists(id);
  await ensureRfcDisponible(data.rfc, id);

  const updated = await updateProviderRecord(id, data);
  if (!updated) throw new HttpError(404, 'Proveedor no encontrado');
  return updated;
}

async function activateProvider(id) {
  await ensureProviderExists(id);
  return setProviderActive(id, true);
}

async function deactivateProvider(id) {
  await ensureProviderExists(id);
  return setProviderActive(id, false);
}

export {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  activateProvider,
  deactivateProvider,
};
