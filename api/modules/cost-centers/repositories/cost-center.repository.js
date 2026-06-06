import { getPool } from '../../../database/connection/index.js';

async function createCostCenter({ areaId, clave, nombre, descripcion }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO centros_costo (area_id, clave, nombre, descripcion)
     VALUES ($1, $2, $3, $4)
     RETURNING id, area_id, clave, nombre, descripcion, activo, created_at, updated_at`,
    [areaId, clave, nombre, descripcion]
  );

  return result.rows[0];
}

async function listCostCenters() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, area_id, clave, nombre, descripcion, activo, created_at, updated_at
     FROM centros_costo
     ORDER BY id ASC`
  );

  return result.rows;
}

async function findCostCenterById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, area_id, clave, nombre, descripcion, activo, created_at, updated_at
     FROM centros_costo
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function updateCostCenter(id, { areaId, clave, nombre, descripcion }) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE centros_costo
     SET area_id = $1,
         clave = $2,
         nombre = $3,
         descripcion = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, area_id, clave, nombre, descripcion, activo, created_at, updated_at`,
    [areaId, clave, nombre, descripcion, id]
  );

  return result.rows[0] || null;
}

async function setCostCenterActive(id, active) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE centros_costo
     SET activo = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, area_id, clave, nombre, descripcion, activo, created_at, updated_at`,
    [active, id]
  );

  return result.rows[0] || null;
}

async function findCostCenterByClave(clave) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, area_id, clave, nombre, descripcion, activo, created_at, updated_at
     FROM centros_costo
     WHERE clave = $1`,
    [clave]
  );

  return result.rows[0] || null;
}

async function findAreaById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id
     FROM areas
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

export {
  createCostCenter,
  listCostCenters,
  findCostCenterById,
  findCostCenterByClave,
  updateCostCenter,
  setCostCenterActive,
  findAreaById,
};
