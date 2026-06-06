import { getPool } from '../../../database/connection/index.js';

const EXPENSE_SELECT = `
  SELECT
    g.id,
    g.folio,
    g.usuario_id,
    u.nombre AS usuario,
    g.area_id,
    a.nombre AS area,
    g.centro_costo_id,
    cc.nombre AS centro_costo,
    g.estatus_id,
    eg.nombre AS estatus,
    g.fecha_gasto,
    g.concepto_general,
    g.justificacion,
    g.subtotal,
    g.iva,
    g.total,
    g.fecha_envio_aprobacion,
    g.fecha_aprobacion,
    g.observaciones_rechazo,
    g.created_at,
    g.updated_at,
    g.deleted_at
  FROM gastos g
  INNER JOIN usuarios u ON u.id = g.usuario_id
  INNER JOIN areas a ON a.id = g.area_id
  INNER JOIN centros_costo cc ON cc.id = g.centro_costo_id
  INNER JOIN estatus_gastos eg ON eg.id = g.estatus_id
`;

async function findExpenseById(id) {
  const pool = getPool();
  const result = await pool.query(`${EXPENSE_SELECT} WHERE g.id = $1`, [id]);
  return result.rows[0] || null;
}

async function listExpenses({ areaId = null, usuarioId = null } = {}) {
  const pool = getPool();
  const result = await pool.query(
    `${EXPENSE_SELECT}
     WHERE g.deleted_at IS NULL
       AND ($1::bigint IS NULL OR g.area_id = $1)
       AND ($2::bigint IS NULL OR g.usuario_id = $2)
     ORDER BY g.created_at DESC`,
    [areaId, usuarioId]
  );
  return result.rows;
}

async function createExpense({
  usuarioId,
  areaId,
  centroCostoId,
  estatusId,
  fechaGasto,
  conceptoGeneral,
  justificacion,
  subtotal,
  iva,
  total,
}) {
  const pool = getPool();

  const insertResult = await pool.query(
    `INSERT INTO gastos
       (folio, usuario_id, area_id, centro_costo_id, estatus_id,
        fecha_gasto, concepto_general, justificacion, subtotal, iva, total)
     VALUES ('PENDING', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      usuarioId,
      areaId,
      centroCostoId,
      estatusId,
      fechaGasto,
      conceptoGeneral,
      justificacion ?? null,
      subtotal,
      iva,
      total,
    ]
  );

  const id = insertResult.rows[0].id;
  const year = new Date().getFullYear();
  const folio = `GAS-${year}-${String(id).padStart(6, '0')}`;

  await pool.query('UPDATE gastos SET folio = $1 WHERE id = $2', [folio, id]);

  return findExpenseById(id);
}

async function updateExpense(
  id,
  { areaId, centroCostoId, fechaGasto, conceptoGeneral, justificacion, subtotal, iva, total }
) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE gastos
     SET area_id = $1,
         centro_costo_id = $2,
         fecha_gasto = $3,
         concepto_general = $4,
         justificacion = $5,
         subtotal = $6,
         iva = $7,
         total = $8,
         updated_at = NOW()
     WHERE id = $9
     RETURNING id`,
    [areaId, centroCostoId, fechaGasto, conceptoGeneral, justificacion ?? null, subtotal, iva, total, id]
  );

  if (!result.rows[0]) return null;
  return findExpenseById(id);
}

async function softDeleteExpense(id) {
  const pool = getPool();
  const result = await pool.query(
    `UPDATE gastos SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0] || null;
}

async function findEstatusByNombre(nombre) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, nombre FROM estatus_gastos WHERE nombre = $1`,
    [nombre]
  );
  return result.rows[0] || null;
}

async function findAreaById(id) {
  const pool = getPool();
  const result = await pool.query(`SELECT id FROM areas WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function findCentroCostoById(id) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, area_id FROM centros_costo WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findUserAreaId(userId) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT area_id FROM usuarios WHERE id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

export {
  findExpenseById,
  listExpenses,
  createExpense,
  updateExpense,
  softDeleteExpense,
  findEstatusByNombre,
  findAreaById,
  findCentroCostoById,
  findUserAreaId,
};
