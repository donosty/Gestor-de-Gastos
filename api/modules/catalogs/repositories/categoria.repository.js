import { getPool } from '../../../database/connection/index.js';

async function listCategorias() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre, descripcion, activo, created_at, updated_at
     FROM categorias
     ORDER BY id ASC`
  );
  return result.rows;
}

async function findCategoriaById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre, descripcion, activo, created_at, updated_at
     FROM categorias
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findCategoriaByNombre(nombre) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id FROM categorias WHERE nombre = $1`,
    [nombre]
  );
  return result.rows[0] || null;
}

async function createCategoria({ nombre, descripcion }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO categorias (nombre, descripcion)
     VALUES ($1, $2)
     RETURNING id, nombre, descripcion, activo, created_at, updated_at`,
    [nombre, descripcion ?? null]
  );
  return result.rows[0];
}

async function updateCategoria(id, { nombre, descripcion }) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE categorias
     SET nombre = $1,
         descripcion = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, nombre, descripcion, activo, created_at, updated_at`,
    [nombre, descripcion ?? null, id]
  );
  return result.rows[0] || null;
}

async function setCategoriaActive(id, active) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE categorias
     SET activo = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, nombre, descripcion, activo, created_at, updated_at`,
    [active, id]
  );
  return result.rows[0] || null;
}

export {
  listCategorias,
  findCategoriaById,
  findCategoriaByNombre,
  createCategoria,
  updateCategoria,
  setCategoriaActive,
};
