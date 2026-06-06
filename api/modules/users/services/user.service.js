import bcrypt from 'bcrypt';
import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createUser as createUserRecord,
  findAreaById,
  findRolById,
  findUserByEmail,
  findUserById,
  listUsers,
  setUserActive,
  updateUser as updateUserRecord,
  updateUserPasswordHash,
} from '../repositories/user.repository.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 10;

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parsePositiveInt(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function validateUserPayload(payload, { requirePassword }) {
  const nombre = normalizeString(payload?.nombre);
  const email = normalizeString(payload?.email);
  const password = normalizeString(payload?.password);
  const rolId = parsePositiveInt(payload?.rol_id);
  const areaId = payload?.area_id !== undefined && payload?.area_id !== null
    ? parsePositiveInt(payload.area_id)
    : null;

  if (!nombre) throw new HttpError(400, 'Nombre es requerido');

  if (!email) throw new HttpError(400, 'Email es requerido');
  if (!EMAIL_REGEX.test(email)) throw new HttpError(400, 'Email invalido');

  if (requirePassword && !password) throw new HttpError(400, 'Password es requerido');

  if (!rolId) throw new HttpError(400, 'rol_id es requerido');

  if (payload?.area_id !== undefined && payload?.area_id !== null && !areaId) {
    throw new HttpError(400, 'area_id invalido');
  }

  return { nombre, email, password, rolId, areaId };
}

async function ensureUserExists(id) {
  const user = await findUserById(id);
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  return user;
}

async function ensureEmailDisponible(email, currentId = null) {
  const existing = await findUserByEmail(email);
  const existingId = existing ? Number(existing.id) : null;
  if (existing && existingId !== currentId) {
    throw new HttpError(409, 'El email ya está en uso');
  }
}

async function ensureRolExists(rolId) {
  const rol = await findRolById(rolId);
  if (!rol) throw new HttpError(404, 'Rol no encontrado');
}

async function ensureAreaExists(areaId) {
  const area = await findAreaById(areaId);
  if (!area) throw new HttpError(404, 'Area no encontrada');
}

async function createUser(payload) {
  const data = validateUserPayload(payload, { requirePassword: true });
  await ensureEmailDisponible(data.email);
  await ensureRolExists(data.rolId);
  if (data.areaId) await ensureAreaExists(data.areaId);

  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  return createUserRecord({ ...data, passwordHash });
}

async function getUsers() {
  return listUsers();
}

async function getUserById(id) {
  return ensureUserExists(id);
}

async function updateUser(id, payload) {
  const data = validateUserPayload(payload, { requirePassword: false });
  await ensureUserExists(id);
  await ensureEmailDisponible(data.email, id);
  await ensureRolExists(data.rolId);
  if (data.areaId) await ensureAreaExists(data.areaId);

  const updated = await updateUserRecord(id, data);
  if (!updated) throw new HttpError(404, 'Usuario no encontrado');

  if (data.password) {
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    await updateUserPasswordHash(id, passwordHash);
  }

  return updated;
}

async function activateUser(id) {
  await ensureUserExists(id);
  return setUserActive(id, true);
}

async function deactivateUser(id, requestingUserId) {
  const user = await ensureUserExists(id);
  if (Number(user.id) === Number(requestingUserId)) {
    throw new HttpError(403, 'No puedes desactivar tu propio usuario');
  }
  return setUserActive(id, false);
}

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
};
