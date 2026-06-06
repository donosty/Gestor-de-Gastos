import { getPool } from '../../../database/connection/index.js';

async function listProviders() {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, rfc, razon_social, correo, telefono, activo, created_at, updated_at
     FROM proveedores
     ORDER BY id ASC`
  );
  return result.rows;
}

async function findProviderById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, rfc, razon_social, correo, telefono, activo, created_at, updated_at
     FROM proveedores
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findProviderByRfc(rfc) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id FROM proveedores WHERE rfc = $1`,
    [rfc]
  );
  return result.rows[0] || null;
}

async function createProvider({ rfc, razonSocial, correo, telefono }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO proveedores (rfc, razon_social, correo, telefono)
     VALUES ($1, $2, $3, $4)
     RETURNING id, rfc, razon_social, correo, telefono, activo, created_at, updated_at`,
    [rfc, razonSocial, correo ?? null, telefono ?? null]
  );
  return result.rows[0];
}

async function updateProvider(id, { rfc, razonSocial, correo, telefono }) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE proveedores
     SET rfc = $1,
         razon_social = $2,
         correo = $3,
         telefono = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, rfc, razon_social, correo, telefono, activo, created_at, updated_at`,
    [rfc, razonSocial, correo ?? null, telefono ?? null, id]
  );
  return result.rows[0] || null;
}

async function setProviderActive(id, active) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE proveedores
     SET activo = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, rfc, razon_social, correo, telefono, activo, created_at, updated_at`,
    [active, id]
  );
  return result.rows[0] || null;
}

export {
  listProviders,
  findProviderById,
  findProviderByRfc,
  createProvider,
  updateProvider,
  setProviderActive,
};
