import { getPool } from '../../../database/connection/index.js';

async function findUserByEmail(email) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT
      usuarios.id,
      usuarios.nombre,
      usuarios.email,
      usuarios.password_hash,
      usuarios.activo,
      roles.nombre AS rol
    FROM usuarios
    INNER JOIN roles ON roles.id = usuarios.rol_id
    WHERE usuarios.email = $1`,
    [email]
  );

  return result.rows[0] || null;
}

export { findUserByEmail };
