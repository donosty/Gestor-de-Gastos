import { getPool } from '../../../database/connection/index.js';

async function createArea({ clave, nombre, descripcion }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO areas (clave, nombre, descripcion)
     VALUES ($1, $2, $3)
     RETURNING id, clave, nombre, descripcion, activo, created_at, updated_at`,
    [clave, nombre, descripcion]
  );

  return result.rows[0];
}

async function listAreas() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, clave, nombre, descripcion, activo, created_at, updated_at
     FROM areas
     ORDER BY id ASC`
  );

  return result.rows;
}

async function findAreaById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, clave, nombre, descripcion, activo, created_at, updated_at
     FROM areas
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function findAreaByClave(clave) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, clave, nombre, descripcion, activo, created_at, updated_at
     FROM areas
     WHERE clave = $1`,
    [clave]
  );

  return result.rows[0] || null;
}

async function updateArea(id, { clave, nombre, descripcion }) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE areas
     SET clave = $1,
         nombre = $2,
         descripcion = $3,
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, clave, nombre, descripcion, activo, created_at, updated_at`,
    [clave, nombre, descripcion, id]
  );

  return result.rows[0] || null;
}

async function setAreaActive(id, active) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE areas
     SET activo = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, clave, nombre, descripcion, activo, created_at, updated_at`,
    [active, id]
  );

  return result.rows[0] || null;
}

export {
  createArea,
  listAreas,
  findAreaById,
  findAreaByClave,
  updateArea,
  setAreaActive,
};
