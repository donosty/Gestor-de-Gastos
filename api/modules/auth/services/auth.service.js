import bcrypt from 'bcrypt';
import { HttpError } from '../../../core/exceptions/http-error.js';
import { getSessionExpiresAt, hashSessionToken, generateSessionToken } from '../../../utils/session.js';
import { createSession, findSessionByTokenHash, revokeSessionByTokenHash } from '../repositories/session.repository.js';
import { findUserByEmail } from '../repositories/user.repository.js';

async function login(email, password) {
  if (!email || !password) {
    throw new HttpError(400, 'Email y password son requeridos');
  }

  const user = await findUserByEmail(email);

  if (!user || !user.activo) {
    throw new HttpError(401, 'Credenciales invalidas');
  }

  const matches = await bcrypt.compare(password, user.password_hash);

  if (!matches) {
    throw new HttpError(401, 'Credenciales invalidas');
  }

  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);
  const expiresAt = getSessionExpiresAt();

  await createSession({
    userId: user.id,
    tokenHash: sessionTokenHash,
    expiresAt,
  });

  return {
    token: sessionToken,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    },
  };
}

async function logout(sessionToken) {
  if (!sessionToken) {
    return;
  }

  const sessionTokenHash = hashSessionToken(sessionToken);
  await revokeSessionByTokenHash(sessionTokenHash);
}

async function authenticateByToken(sessionToken) {
  if (!sessionToken) {
    throw new HttpError(401, 'No autenticado');
  }

  const sessionTokenHash = hashSessionToken(sessionToken);
  const session = await findSessionByTokenHash(sessionTokenHash);

  if (!session) {
    throw new HttpError(401, 'No autenticado');
  }

  if (session.revoked_at) {
    throw new HttpError(401, 'Sesion invalida');
  }

  if (new Date(session.expires_at) <= new Date()) {
    throw new HttpError(401, 'Sesion expirada');
  }

  if (!session.user_activo) {
    throw new HttpError(401, 'Usuario inactivo');
  }

  return {
    id: session.user_id,
    nombre: session.user_nombre,
    email: session.user_email,
    rol: session.user_rol,
  };
}

export { authenticateByToken, login, logout };
