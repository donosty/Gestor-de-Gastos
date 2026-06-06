import { getPool } from '../../../database/connection/index.js';

const USER_SELECT = `
  SELECT
    u.id,
    u.nombre,
    u.email,
    u.rol_id,
    r.nombre AS rol,
    u.area_id,
    a.nombre AS area,
    u.activo,
    u.ultimo_acceso,
    u.created_at,
    u.updated_at
  FROM usuarios u
  INNER JOIN roles r ON r.id = u.rol_id
  LEFT JOIN areas a ON a.id = u.area_id
`;

async function listUsers() {
  const pool = getPool();
  const result = await pool.query(`${USER_SELECT} ORDER BY u.id ASC`);
  return result.rows;
}

async function findUserById(id) {
  const pool = getPool();
  const result = await pool.query(`${USER_SELECT} WHERE u.id = $1`, [id]);
  return result.rows[0] || null;
}

async function findUserByEmail(email) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id FROM usuarios WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function createUser({ nombre, email, passwordHash, rolId, areaId }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash, rol_id, area_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [nombre, email, passwordHash, rolId, areaId ?? null]
  );
  return findUserById(result.rows[0].id);
}

async function updateUser(id, { nombre, email, rolId, areaId }) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE usuarios
     SET nombre = $1,
         email = $2,
         rol_id = $3,
         area_id = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING id`,
    [nombre, email, rolId, areaId ?? null, id]
  );
  if (!result.rows[0]) return null;
  return findUserById(id);
}

async function updateUserPasswordHash(id, passwordHash) {
  const pool = getPool();
  await pool.query(
    `UPDATE usuarios SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [passwordHash, id]
  );
}

async function setUserActive(id, active) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE usuarios
     SET activo = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id`,
    [active, id]
  );
  if (!result.rows[0]) return null;
  return findUserById(id);
}

async function findRolById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre FROM roles WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findAreaById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id FROM areas WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export {
  listUsers,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  updateUserPasswordHash,
  setUserActive,
  findRolById,
  findAreaById,
};
