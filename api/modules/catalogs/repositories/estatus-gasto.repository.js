import { getPool } from '../../../database/connection/index.js';

async function listEstatusGastos() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre, descripcion
     FROM estatus_gastos
     ORDER BY id ASC`
  );
  return result.rows;
}

async function findEstatusGastoById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre, descripcion
     FROM estatus_gastos
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export { listEstatusGastos, findEstatusGastoById };
