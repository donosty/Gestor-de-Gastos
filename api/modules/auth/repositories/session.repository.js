import { getPool } from '../../../database/connection/index.js';

async function createSession({ userId, tokenHash, expiresAt }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO sesiones (usuario_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [userId, tokenHash, expiresAt]
  );

  return result.rows[0];
}

async function findSessionByTokenHash(tokenHash) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT
      sesiones.id AS session_id,
      sesiones.usuario_id AS user_id,
      sesiones.expires_at,
      sesiones.revoked_at,
      usuarios.nombre AS user_nombre,
      usuarios.email AS user_email,
      usuarios.activo AS user_activo,
      roles.nombre AS user_rol
    FROM sesiones
    INNER JOIN usuarios ON usuarios.id = sesiones.usuario_id
    INNER JOIN roles ON roles.id = usuarios.rol_id
    WHERE sesiones.token_hash = $1`,
    [tokenHash]
  );

  return result.rows[0] || null;
}

async function revokeSessionByTokenHash(tokenHash) {
  const pool = getPool();
  await pool.query(
    `UPDATE sesiones
     SET revoked_at = NOW()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
}

export { createSession, findSessionByTokenHash, revokeSessionByTokenHash };
