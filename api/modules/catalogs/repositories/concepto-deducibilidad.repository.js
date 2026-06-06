import { getPool } from '../../../database/connection/index.js';

async function listConceptos() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre, descripcion, deducible, activo, created_at, updated_at
     FROM conceptos_deducibilidad
     ORDER BY id ASC`
  );
  return result.rows;
}

async function findConceptoById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre, descripcion, deducible, activo, created_at, updated_at
     FROM conceptos_deducibilidad
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findConceptoByNombre(nombre) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id FROM conceptos_deducibilidad WHERE nombre = $1`,
    [nombre]
  );
  return result.rows[0] || null;
}

async function createConcepto({ nombre, descripcion, deducible }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO conceptos_deducibilidad (nombre, descripcion, deducible)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, descripcion, deducible, activo, created_at, updated_at`,
    [nombre, descripcion ?? null, deducible ?? true]
  );
  return result.rows[0];
}

async function updateConcepto(id, { nombre, descripcion, deducible }) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE conceptos_deducibilidad
     SET nombre = $1,
         descripcion = $2,
         deducible = $3,
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, nombre, descripcion, deducible, activo, created_at, updated_at`,
    [nombre, descripcion ?? null, deducible, id]
  );
  return result.rows[0] || null;
}

async function setConceptoActive(id, active) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE conceptos_deducibilidad
     SET activo = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, nombre, descripcion, deducible, activo, created_at, updated_at`,
    [active, id]
  );
  return result.rows[0] || null;
}

export {
  listConceptos,
  findConceptoById,
  findConceptoByNombre,
  createConcepto,
  updateConcepto,
  setConceptoActive,
};
